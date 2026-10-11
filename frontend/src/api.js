/**
 * Same-origin API helper with credentials + CSRF double-submit cookie.
 * Session identity comes only from the httpOnly userId cookie set by the server.
 */

function readCookie (name) {
	if (typeof document === 'undefined') return ''
	const match = document.cookie
		.split(';')
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${name}=`))
	if (!match) return ''
	return decodeURIComponent(match.slice(name.length + 1))
}

async function ensureCsrfToken () {
	let token = readCookie('csrfToken')
	if (token && token.length >= 32) return token

	// Establish anonymous session cookies (userId httpOnly + csrfToken).
	const response = await fetch('/api/session', {
		method: 'GET',
		credentials: 'same-origin',
	})
	if (!response.ok) {
		throw new Error('Failed to initialize session')
	}
	const data = await response.json()
	token = data.csrfToken || readCookie('csrfToken')
	if (!token) {
		throw new Error('CSRF token missing')
	}
	return token
}

export async function apiFetch (path, options = {}) {
	const method = (options.method || 'GET').toUpperCase()
	const headers = {
		...(options.headers || {}),
	}

	if (!['GET', 'HEAD'].includes(method)) {
		const csrfToken = await ensureCsrfToken()
		headers['X-CSRF-Token'] = csrfToken
	}

	if (options.body && !headers['Content-Type']) {
		headers['Content-Type'] = 'application/json'
	}

	return fetch(path, {
		...options,
		method,
		headers,
		credentials: 'same-origin',
	})
}
