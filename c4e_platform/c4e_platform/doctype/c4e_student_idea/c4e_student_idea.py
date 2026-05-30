# Copyright (c) 2026, Udo and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class C4EStudentIdea(Document):
	def validate(self):
		self.set_student()
		self.validate_char_count()

	def before_save(self):
		self.ensure_idea_limit()

	def after_insert(self):
		memo = frappe.get_doc({
			"doctype": "C4E Company Memo",
			"idea": self.name
		})
		memo.insert(ignore_permissions=True)

	def set_student(self):
		if not self.student:
			self.student = frappe.session.user

	def ensure_idea_limit(self):
		if not self.is_new():
			return
		count = frappe.db.count("C4E Student Idea", {"student": frappe.session.user})
		if count >= 3:
			frappe.throw("You can only submit a maximum of 3 ideas.")

	def validate_char_count(self):
		if len(self.onboarding_problem or "") < 10:
			frappe.throw("The problem must be at least 10 characters long.")
		if len(self.onboarding_solution or "") < 10:
			frappe.throw("The solution must be at least 10 characters long.")
