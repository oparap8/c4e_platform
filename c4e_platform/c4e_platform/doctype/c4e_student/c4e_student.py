# Copyright (c) 2026, Udo and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class C4EStudent(Document):
	def validate(self):
		self.set_full_name()

	def set_full_name(self):
		self.full_name = f"{self.first_name} {self.last_name}"




def student_has_permission(doc, user=None, permission_type=None):
	if not user:
		user = frappe.session.user


	if "C4E Student" in frappe.get_roles(user):
		return doc.user == user
	
	return None

	