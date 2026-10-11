/**
 * Eisenhower Matrix API
 * Anonymous sessions via httpOnly cookie only (no client-supplied user ids).
 */
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')
const sqlite3 = require('sqlite3').verbose()

const PORT = Number(process.env.PORT || 5000)
const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_PROD = NODE_ENV === 'production'
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost'
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'database.sqlite')
const FRONTEND_DIST =
	process.env.FRONTEND_DIST || path.join(__dirname, 'public')
const COOKIE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000
const JSON_LIMIT = process.env.JSON_LIMIT || '64kb'

const QUADRANTS = new Set([
	'urgent-important',
	'important-not-urgent',
	'urgent-not-important',
	'not-urgent-not-important',
])
const PRIORITIES = new Set(['high', 'medium', 'low'])

function createApp (db) {
	const app = express()

	app.disable('x-powered-by')
	app.set('trust proxy', 1)

	app.use(
		cors({
			origin (origin, callback) {
				// Allow same-origin / non-browser tools (no Origin header).
				if (!origin || origin === CORS_ORIGIN) {
					return callback(null, true)
				}
				return callback(new Error('CORS origin denied'))
			},
			credentials: true,
		})
	)
	app.use(cookieParser())
	app.use(express.json({ limit: JSON_LIMIT }))

	function cookieSecureFlag (req) {
		// Prefer explicit env; otherwise Secure only on HTTPS (via Apache X-Forwarded-Proto).
		if (process.env.COOKIE_SECURE === 'true') return true
		if (process.env.COOKIE_SECURE === 'false') return false
		return Boolean(req.secure || req.get('x-forwarded-proto') === 'https')
	}

	function sessionCookieOpts (req) {
		return {
			maxAge: COOKIE_MAX_AGE_MS,
			httpOnly: true,
			secure: cookieSecureFlag(req),
			sameSite: 'lax',
			path: '/',
		}
	}

	function csrfCookieOpts (req) {
		return {
			maxAge: COOKIE_MAX_AGE_MS,
			httpOnly: false,
			secure: cookieSecureFlag(req),
			sameSite: 'lax',
			path: '/',
		}
	}

	function ensureSession (req, res, next) {
		// Never accept client-supplied identity (headers, query, body).
		let userId = req.cookies.userId
		let csrfToken = req.cookies.csrfToken
		let isNew = false

		if (!userId || !uuidValidate(userId)) {
			userId = uuidv4()
			isNew = true
			res.cookie('userId', userId, sessionCookieOpts(req))
			db.run('INSERT OR IGNORE INTO users (id) VALUES (?)', [userId])
		}

		if (!csrfToken || csrfToken.length < 32) {
			csrfToken = crypto.randomBytes(32).toString('hex')
			res.cookie('csrfToken', csrfToken, csrfCookieOpts(req))
		}

		req.userId = userId
		req.csrfToken = csrfToken
		req.isNewSession = isNew
		next()
	}

	function tokensMatch (a, b) {
		if (typeof a !== 'string' || typeof b !== 'string') return false
		const bufA = Buffer.from(a)
		const bufB = Buffer.from(b)
		if (bufA.length === 0 || bufA.length !== bufB.length) return false
		return crypto.timingSafeEqual(bufA, bufB)
	}

	function requireCsrf (req, res, next) {
		const method = req.method.toUpperCase()
		if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
			return next()
		}

		const headerToken = req.get('x-csrf-token') || ''
		const cookieToken = req.cookies.csrfToken || ''
		if (!tokensMatch(headerToken, cookieToken)) {
			return res.status(403).json({ error: 'Invalid CSRF token' })
		}

		// Defense in depth: reject cross-site Origin when present.
		const origin = req.get('origin')
		if (origin && origin !== CORS_ORIGIN) {
			return res.status(403).json({ error: 'Invalid origin' })
		}

		next()
	}

	function validateTaskInput (body, { partial = false } = {}) {
		const errors = []
		const out = {}

		if (!partial || body.title !== undefined) {
			if (typeof body.title !== 'string' || !body.title.trim()) {
				if (!partial) errors.push('title is required')
			} else if (body.title.trim().length > 200) {
				errors.push('title too long')
			} else {
				out.title = body.title.trim()
			}
		}

		if (body.description !== undefined) {
			if (typeof body.description !== 'string') {
				errors.push('description must be a string')
			} else if (body.description.length > 2000) {
				errors.push('description too long')
			} else {
				out.description = body.description
			}
		}

		if (!partial || body.quadrant !== undefined) {
			if (!QUADRANTS.has(body.quadrant)) {
				if (!partial) errors.push('invalid quadrant')
			} else {
				out.quadrant = body.quadrant
			}
		}

		if (!partial || body.priority !== undefined) {
			if (!PRIORITIES.has(body.priority)) {
				if (!partial) errors.push('invalid priority')
			} else {
				out.priority = body.priority
			}
		}

		if (body.dueDate !== undefined) {
			if (body.dueDate === null || body.dueDate === '') {
				out.dueDate = null
			} else if (
				typeof body.dueDate !== 'string' ||
				body.dueDate.length > 40
			) {
				errors.push('invalid dueDate')
			} else {
				out.dueDate = body.dueDate
			}
		}

		if (body.completed !== undefined) {
			out.completed = Boolean(body.completed)
		}

		return { errors, out }
	}

	app.get('/api/health', (req, res) => {
		res.json({ ok: true, service: 'todolist', env: NODE_ENV })
	})

	app.get('/api/session', ensureSession, (req, res) => {
		res.json({
			authenticated: true,
			anonymous: true,
			// Explicit product rule: clearing cookies loses access to old tasks.
			note: 'Anonymous session. Clearing cookies permanently loses access to previous tasks.',
			csrfToken: req.csrfToken,
		})
	})

	app.get('/api/tasks', ensureSession, (req, res) => {
		db.all(
			'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
			[req.userId],
			(err, rows) => {
				if (err) {
					return res.status(500).json({ error: 'Database error' })
				}
				res.json(rows)
			}
		)
	})

	app.post('/api/tasks', ensureSession, requireCsrf, (req, res) => {
		const { errors, out } = validateTaskInput(req.body || {}, { partial: false })
		if (errors.length) {
			return res.status(400).json({ error: errors.join('; ') })
		}

		const taskId = uuidv4()
		const now = new Date().toISOString()

		db.run(
			`INSERT INTO tasks (
				id, user_id, title, description, quadrant, priority,
				due_date, completed, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				taskId,
				req.userId,
				out.title,
				out.description || '',
				out.quadrant,
				out.priority,
				out.dueDate || null,
				out.completed ? 1 : 0,
				now,
				now,
			],
			function (err) {
				if (err) {
					return res.status(500).json({ error: 'Database error' })
				}
				db.get('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, req.userId], (getErr, row) => {
					if (getErr) {
						return res.status(500).json({ error: 'Database error' })
					}
					res.status(201).json(row)
				})
			}
		)
	})

	app.put('/api/tasks/:id', ensureSession, requireCsrf, (req, res) => {
		const { id } = req.params
		if (!uuidValidate(id)) {
			return res.status(400).json({ error: 'Invalid task id' })
		}

		const { errors, out } = validateTaskInput(req.body || {}, { partial: true })
		if (errors.length) {
			return res.status(400).json({ error: errors.join('; ') })
		}
		if (Object.keys(out).length === 0) {
			return res.status(400).json({ error: 'No valid fields to update' })
		}

		db.get(
			'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
			[id, req.userId],
			(err, task) => {
				if (err) {
					return res.status(500).json({ error: 'Database error' })
				}
				if (!task) {
					return res.status(404).json({ error: 'Task not found' })
				}

				const now = new Date().toISOString()
				const fields = []
				const values = []
				if (out.title !== undefined) {
					fields.push('title = ?')
					values.push(out.title)
				}
				if (out.description !== undefined) {
					fields.push('description = ?')
					values.push(out.description)
				}
				if (out.quadrant !== undefined) {
					fields.push('quadrant = ?')
					values.push(out.quadrant)
				}
				if (out.priority !== undefined) {
					fields.push('priority = ?')
					values.push(out.priority)
				}
				if (out.dueDate !== undefined) {
					fields.push('due_date = ?')
					values.push(out.dueDate)
				}
				if (out.completed !== undefined) {
					fields.push('completed = ?')
					values.push(out.completed ? 1 : 0)
				}
				fields.push('updated_at = ?')
				values.push(now)
				values.push(id, req.userId)

				db.run(
					`UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
					values,
					function (updateErr) {
						if (updateErr) {
							return res.status(500).json({ error: 'Database error' })
						}
						db.get(
							'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
							[id, req.userId],
							(getErr, row) => {
								if (getErr) {
									return res.status(500).json({ error: 'Database error' })
								}
								res.json(row)
							}
						)
					}
				)
			}
		)
	})

	app.put('/api/tasks/:id/move', ensureSession, requireCsrf, (req, res) => {
		const { id } = req.params
		const { quadrant } = req.body || {}
		if (!uuidValidate(id)) {
			return res.status(400).json({ error: 'Invalid task id' })
		}
		if (!QUADRANTS.has(quadrant)) {
			return res.status(400).json({ error: 'Invalid quadrant' })
		}

		const now = new Date().toISOString()
		db.run(
			'UPDATE tasks SET quadrant = ?, updated_at = ? WHERE id = ? AND user_id = ?',
			[quadrant, now, id, req.userId],
			function (err) {
				if (err) {
					return res.status(500).json({ error: 'Database error' })
				}
				if (this.changes === 0) {
					return res.status(404).json({ error: 'Task not found' })
				}
				db.get(
					'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
					[id, req.userId],
					(getErr, row) => {
						if (getErr) {
							return res.status(500).json({ error: 'Database error' })
						}
						res.json(row)
					}
				)
			}
		)
	})

	app.delete('/api/tasks/:id', ensureSession, requireCsrf, (req, res) => {
		const { id } = req.params
		if (!uuidValidate(id)) {
			return res.status(400).json({ error: 'Invalid task id' })
		}

		db.run(
			'DELETE FROM tasks WHERE id = ? AND user_id = ?',
			[id, req.userId],
			function (err) {
				if (err) {
					return res.status(500).json({ error: 'Database error' })
				}
				if (this.changes === 0) {
					return res.status(404).json({ error: 'Task not found' })
				}
				res.status(204).send()
			}
		)
	})

	// Export before parameterized routes that could collide in future.
	app.get('/api/tasks/export', ensureSession, (req, res) => {
		db.all(
			'SELECT * FROM tasks WHERE user_id = ? ORDER BY quadrant, priority DESC',
			[req.userId],
			(err, tasks) => {
				if (err) {
					return res.status(500).json({ error: 'Database error' })
				}

				const header = [
					'Название',
					'Описание',
					'Квадрант',
					'Приоритет',
					'Дата выполнения',
					'Выполнено',
					'Дата создания',
				]
				const lines = [header.map(csvEscape).join(',')]
				for (const task of tasks) {
					lines.push(
						[
							task.title,
							task.description || '',
							getQuadrantLabel(task.quadrant),
							getPriorityLabel(task.priority),
							task.due_date || '',
							task.completed ? 'Да' : 'Нет',
							new Date(task.created_at).toLocaleDateString('ru-RU'),
						]
							.map(csvEscape)
							.join(',')
					)
				}

				// UTF-8 BOM helps Excel open Cyrillic correctly.
				const body = '\uFEFF' + lines.join('\n')
				res.setHeader('Content-Type', 'text/csv; charset=utf-8')
				res.setHeader(
					'Content-Disposition',
					'attachment; filename="eisenhower-matrix-tasks.csv"'
				)
				res.send(body)
			}
		)
	})

	// Static SPA (production dist copied into image).
	if (fs.existsSync(FRONTEND_DIST)) {
		app.use(express.static(FRONTEND_DIST, { index: false }))
		app.get('*', (req, res, next) => {
			if (req.path.startsWith('/api/')) {
				return next()
			}
			res.sendFile(path.join(FRONTEND_DIST, 'index.html'), (err) => {
				if (err) next()
			})
		})
	}

	app.use((err, req, res, next) => {
		if (err && err.message === 'CORS origin denied') {
			return res.status(403).json({ error: 'CORS origin denied' })
		}
		if (err && err.type === 'entity.too.large') {
			return res.status(413).json({ error: 'Request body too large' })
		}
		console.error('Unhandled error:', err)
		res.status(500).json({ error: 'Something broke!' })
	})

	return app
}

function csvEscape (value) {
	const str = String(value ?? '')
	if (/[",\n\r]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`
	}
	return str
}

function getQuadrantLabel (quadrant) {
	const labels = {
		'urgent-important': 'Важно и Срочно',
		'important-not-urgent': 'Важно, но не Срочно',
		'urgent-not-important': 'Срочно, но не важно',
		'not-urgent-not-important': 'Не важно и не Срочно',
	}
	return labels[quadrant] || quadrant
}

function getPriorityLabel (priority) {
	const labels = {
		high: 'Высокий',
		medium: 'Средний',
		low: 'Низкий',
	}
	return labels[priority] || priority
}

function initDatabase (db) {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.run(
				`CREATE TABLE IF NOT EXISTS users (
					id TEXT PRIMARY KEY,
					created_at DATETIME DEFAULT CURRENT_TIMESTAMP
				)`
			)
			db.run(
				`CREATE TABLE IF NOT EXISTS tasks (
					id TEXT PRIMARY KEY,
					user_id TEXT NOT NULL,
					title TEXT NOT NULL,
					description TEXT,
					quadrant TEXT NOT NULL,
					priority TEXT NOT NULL,
					due_date TEXT,
					completed BOOLEAN DEFAULT 0,
					created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
					updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
					FOREIGN KEY (user_id) REFERENCES users (id)
				)`,
				(err) => {
					if (err) reject(err)
					else resolve()
				}
			)
		})
	})
}

function openDatabase (dbPath) {
	const dir = path.dirname(dbPath)
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
	return new Promise((resolve, reject) => {
		const db = new sqlite3.Database(dbPath, (err) => {
			if (err) reject(err)
			else resolve(db)
		})
	})
}

async function start () {
	const db = await openDatabase(DB_PATH)
	await initDatabase(db)
	const app = createApp(db)
	const server = app.listen(PORT, '0.0.0.0', () => {
		console.log(`Server running on port ${PORT}`)
		console.log(`CORS origin: ${CORS_ORIGIN}`)
		console.log(`Database path: ${DB_PATH}`)
		console.log(`Frontend dist: ${FRONTEND_DIST}`)
	})

	const shutdown = () => {
		server.close(() => {
			db.close(() => process.exit(0))
		})
	}
	process.on('SIGINT', shutdown)
	process.on('SIGTERM', shutdown)
}

module.exports = {
	createApp,
	initDatabase,
	openDatabase,
	QUADRANTS,
	PRIORITIES,
}

if (require.main === module) {
	start().catch((err) => {
		console.error('Failed to start server:', err)
		process.exit(1)
	})
}
