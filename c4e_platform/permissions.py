import frappe


def get_permission_query_conditions_for_student_idea(user):
	if not user:
		user = frappe.session.user
	if user == "Administrator" or "C4E Manager" in frappe.get_roles(user):
		return None
	return f"(`tabC4E Student Idea`.student = {frappe.db.escape(user)})"
