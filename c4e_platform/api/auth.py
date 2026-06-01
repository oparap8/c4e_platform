import frappe


@frappe.whitelist()
def get_current_user_roles():
	return frappe.get_roles(frappe.session.user)


@frappe.whitelist(allow_guest=True)
def register():
	first_name = frappe.form_dict.get('first_name')
	email = frappe.form_dict.get('email') 
	password = frappe.form_dict.get('password') 

	if not first_name or not email or not password:
		frappe.throw(f"first_name, email and password are required.")

	if frappe.db.exists("User", email):
		frappe.throw("An account with this email already exists.")

	user = frappe.get_doc({
		"doctype":"User",
		"email": email,
		"first_name": first_name,
		"send_welcome_email": 0,
		"new_password": password,
		"roles":[{"role": "C4E Student"}],
	})
	user.insert(ignore_permissions=True)
	frappe.db.commit()
	return {"success": True, "message": "Account created. Please log in."}
