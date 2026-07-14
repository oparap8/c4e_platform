function csrfToken() {
	return window.csrf_token || ''
}

function headers() {
	return {
		'Content-Type': 'application/json',
		'X-Frappe-CSRF-Token': csrfToken(),
	}
}

async function handleResponse(res) {
	const data = await res.json()
	// console.log(data)
	if (!res.ok) {
		const msg =
			data?.exc_type === 'ValidationError'
				? data?.message || 'Validation error'
				: data?.message || `Request failed (${res.status})`
		throw new Error(msg)
	}
	return data
}

export async function frappeCall(method, args = {}) {
	const res = await fetch(`/api/method/${method}`, {
		method: 'POST',
		credentials: 'include',
		headers: headers(),
		body: JSON.stringify(args),
	})
	// console.log(res)
	const data = await handleResponse(res)
	return data.message
}

export async function frappeGet(doctype, name) {
	const res = await fetch(
		`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
		{ credentials: 'include', headers: { 'X-Frappe-CSRF-Token': csrfToken() } }
	)
	const data = await handleResponse(res)
	return data.data
}

export async function frappeGetList(doctype, { filters = {}, fields = ['name'], limit = 20, orderBy = '' } = {}) {
	const params = new URLSearchParams()
	params.set('fields', JSON.stringify(fields))
	if (Object.keys(filters).length) params.set('filters', JSON.stringify(filters))
	if (limit) params.set('limit', limit)
	if (orderBy) params.set('order_by', orderBy)

	const res = await fetch(
		`/api/resource/${encodeURIComponent(doctype)}?${params.toString()}`,
		{ credentials: 'include', headers: { 'X-Frappe-CSRF-Token': csrfToken() } }
	)
	const data = await handleResponse(res)
	return data.data
}

export async function frappeInsert(doc) {
	const res = await fetch(`/api/resource/${encodeURIComponent(doc.doctype)}`, {
		method: 'POST',
		credentials: 'include',
		headers: headers(),
		body: JSON.stringify(doc),
	})
	const data = await handleResponse(res)
	return data.data
}

export async function frappeSetValue(doctype, name, fieldname, value) {
	const res = await fetch(
		`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
		{
			method: 'PUT',
			credentials: 'include',
			headers: headers(),
			body: JSON.stringify({ [fieldname]: value }),
		}
	)
	const data = await handleResponse(res)
	return data.data
}

export async function frappeUpdate(doctype, name, updates) {
	const res = await fetch(
		`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
		{
			method: 'PUT',
			credentials: 'include',
			headers: headers(),
			body: JSON.stringify(updates),
		}
	)
	const data = await handleResponse(res)
	return data.data
}

export async function frappeLogin(email, password) {
	const res = await fetch('/api/method/login', {
		method: 'POST',
		credentials: 'include',
		headers: headers(),
		body: JSON.stringify({ usr: email, pwd: password }),
	})
	const data = await handleResponse(res)
	// Refresh CSRF token after login
	window.csrf_token = data.home_page ? csrfToken() : csrfToken()
	return data
}

export async function frappeLogout() {
	await fetch('/api/method/logout', {
		method: 'POST',
		credentials: 'include',
		headers: headers(),
	})
}

export async function frappeGetCurrentUser() {
	const res = await fetch('/api/method/frappe.auth.get_logged_user', {
		credentials: 'include',
		headers: { 'X-Frappe-CSRF-Token': csrfToken() },
	})
	if (!res.ok) return null
	const data = await res.json()
	return data.message || null
}

export async function frappeGetUserInfo(email) {
	const res = await fetch(
		`/api/resource/User/${encodeURIComponent(email)}?fields=["name","email","full_name","roles"]`,
		{ credentials: 'include', headers: { 'X-Frappe-CSRF-Token': csrfToken() } }
	)
	if (!res.ok) return null
	const data = await res.json()
	return data.data
}

export async function frappeUploadFile(file, doctype, docname, fieldname) {
	const form = new FormData()
	form.append('file', file)
	form.append('doctype', doctype)
	form.append('docname', docname)
	form.append('fieldname', fieldname)
	form.append('is_private', 0)

	const res = await fetch('/api/method/upload_file', {
		method: 'POST',
		credentials: 'include',
		headers: { 'X-Frappe-CSRF-Token': csrfToken() },
		body: form,
	})
	const data = await handleResponse(res)
	return data.message
}
