/**
 * Security and API smoke tests for anonymous cookie sessions.
 * Run: node test-security.js
 */
const assert = require('assert')
const http = require('http')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { createApp, openDatabase, initDatabase } = require('./server')

function request (port, method, urlPath, { headers = {}, body = null, cookies = '' } = {}) {
	return new Promise((resolve, reject) => {
		const payload = body ? Buffer.from(body) : null
		const req = http.request(
			{
				hostname: '127.0.0.1',
				port,
				path: urlPath,
				method,
				headers: {
					...(cookies ? { Cookie: cookies } : {}),
					...(payload
						? {
							'Content-Type': 'application/json',
							'Content-Length': payload.length,
						}
						: {}),
					...headers,
				},
			},
			(res) => {
				const chunks = []
				res.on('data', (c) => chunks.push(c))
				res.on('end', () => {
					const raw = Buffer.concat(chunks).toString('utf8')
					const setCookie = res.headers['set-cookie'] || []
					resolve({
						status: res.statusCode,
						headers: res.headers,
						setCookie,
						body: raw,
						json: () => {
							try {
								return JSON.parse(raw)
							} catch {
								return null
							}
						},
					})
				})
			}
		)
		req.on('error', reject)
		if (payload) req.write(payload)
		req.end()
	})
}

function parseCookies (setCookie) {
	const jar = {}
	for (const line of setCookie) {
		const [pair] = line.split(';')
		const idx = pair.indexOf('=')
		if (idx > 0) {
			jar[pair.slice(0, idx)] = pair.slice(idx + 1)
		}
	}
	return jar
}

function cookieHeader (jar) {
	return Object.entries(jar)
		.map(([k, v]) => `${k}=${v}`)
		.join('; ')
}

async function main () {
	const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todolist-test-'))
	const dbPath = path.join(tmpDir, 'test.sqlite')
	const db = await openDatabase(dbPath)
	await initDatabase(db)
	const app = createApp(db)
	const server = await new Promise((resolve) => {
		const s = app.listen(0, '127.0.0.1', () => resolve(s))
	})
	const port = server.address().port

	try {
		// 1) Session bootstrap
		const session = await request(port, 'GET', '/api/session')
		assert.strictEqual(session.status, 200)
		const jarA = parseCookies(session.setCookie)
		assert.ok(jarA.userId, 'userId cookie required')
		assert.ok(jarA.csrfToken, 'csrfToken cookie required')
		const userCookie = session.setCookie.find((c) => c.startsWith('userId='))
		assert.ok(userCookie.toLowerCase().includes('httponly'), 'userId must be HttpOnly')
		assert.ok(
			!session.setCookie
				.find((c) => c.startsWith('csrfToken='))
				.toLowerCase()
				.includes('httponly'),
			'csrfToken must be readable by JS'
		)

		// 2) x-user-id must be ignored (cannot select another identity)
		const forged = await request(port, 'GET', '/api/tasks', {
			headers: { 'x-user-id': '11111111-1111-4111-8111-111111111111' },
			cookies: cookieHeader(jarA),
		})
		assert.strictEqual(forged.status, 200)

		const createA = await request(port, 'POST', '/api/tasks', {
			cookies: cookieHeader(jarA),
			headers: {
				'X-CSRF-Token': jarA.csrfToken,
				Origin: process.env.CORS_ORIGIN || 'http://localhost',
			},
			body: JSON.stringify({
				title: 'Задача А',
				quadrant: 'urgent-important',
				priority: 'high',
				description: 'кириллица',
			}),
		})
		assert.strictEqual(createA.status, 201, createA.body)
		const taskA = createA.json()
		assert.strictEqual(taskA.title, 'Задача А')

		// 3) CSRF required
		const noCsrf = await request(port, 'POST', '/api/tasks', {
			cookies: cookieHeader(jarA),
			body: JSON.stringify({
				title: 'no csrf',
				quadrant: 'urgent-important',
				priority: 'low',
			}),
		})
		assert.strictEqual(noCsrf.status, 403)

		// 4) Second anonymous user isolation
		const sessionB = await request(port, 'GET', '/api/session')
		const jarB = parseCookies(sessionB.setCookie)
		assert.notStrictEqual(jarA.userId, jarB.userId)
		const listB = await request(port, 'GET', '/api/tasks', {
			cookies: cookieHeader(jarB),
		})
		assert.strictEqual(listB.status, 200)
		assert.strictEqual(listB.json().length, 0, 'user B must not see user A tasks')

		// Forged header alone without cookie creates a NEW session, not access to A
		const headerOnly = await request(port, 'GET', '/api/tasks', {
			headers: { 'x-user-id': jarA.userId },
		})
		assert.strictEqual(headerOnly.status, 200)
		const headerJar = parseCookies(headerOnly.setCookie)
		assert.ok(headerJar.userId)
		assert.notStrictEqual(
			headerJar.userId,
			jarA.userId,
			'x-user-id must not become session identity'
		)
		assert.strictEqual(headerOnly.json().length, 0)

		// 5) Move / update / complete / delete / export
		const moved = await request(port, 'PUT', `/api/tasks/${taskA.id}/move`, {
			cookies: cookieHeader(jarA),
			headers: {
				'X-CSRF-Token': jarA.csrfToken,
				Origin: process.env.CORS_ORIGIN || 'http://localhost',
			},
			body: JSON.stringify({ quadrant: 'important-not-urgent' }),
		})
		assert.strictEqual(moved.status, 200)
		assert.strictEqual(moved.json().quadrant, 'important-not-urgent')

		const updated = await request(port, 'PUT', `/api/tasks/${taskA.id}`, {
			cookies: cookieHeader(jarA),
			headers: {
				'X-CSRF-Token': jarA.csrfToken,
				Origin: process.env.CORS_ORIGIN || 'http://localhost',
			},
			body: JSON.stringify({ completed: true, title: 'Задача А готова' }),
		})
		assert.strictEqual(updated.status, 200)
		assert.ok(updated.json().completed)

		const exported = await request(port, 'GET', '/api/tasks/export', {
			cookies: cookieHeader(jarA),
		})
		assert.strictEqual(exported.status, 200)
		assert.ok(exported.body.includes('Задача А'))

		const deleted = await request(port, 'DELETE', `/api/tasks/${taskA.id}`, {
			cookies: cookieHeader(jarA),
			headers: {
				'X-CSRF-Token': jarA.csrfToken,
				Origin: process.env.CORS_ORIGIN || 'http://localhost',
			},
		})
		assert.strictEqual(deleted.status, 204)

		// 6) B cannot mutate A's former id
		const steal = await request(port, 'DELETE', `/api/tasks/${taskA.id}`, {
			cookies: cookieHeader(jarB),
			headers: {
				'X-CSRF-Token': jarB.csrfToken,
				Origin: process.env.CORS_ORIGIN || 'http://localhost',
			},
		})
		assert.strictEqual(steal.status, 404)

		console.log('ALL_SECURITY_TESTS_PASSED')
	} finally {
		server.close()
		db.close()
		fs.rmSync(tmpDir, { recursive: true, force: true })
	}
}

main().catch((err) => {
	console.error('TEST_FAILED', err)
	process.exit(1)
})
