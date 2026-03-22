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

	def set_student(self):
		if self.student:
			return
		student = frappe.db.exists("C4E Student", {"user": frappe.session.user})
		if student:
			self.student = student
		else:
			frappe.throw("You must be a C4E Student to submit an idea.")

	def ensure_idea_limit(self):
		if not self.is_new():
			return
		if self.student:
			ideas_count = frappe.db.count("C4E Student Idea", {"student": self.student})
			if ideas_count >= 3:
				frappe.throw("You can only submit a maximum of 3 ideas.")

	def validate_char_count(self):
		if len(self.onboarding_idea) < 10:
			frappe.throw("The idea must be at least 10 characters long.")
		if len(self.onboarding_differentiation) < 10:
			frappe.throw("The differentiation must be at least 10 characters long.")
		if len(self.onboarding_target_customer) < 10:
			frappe.throw("The target customer must be at least 10 characters long.")
		if len(self.onboarding_problem) < 10:
			frappe.throw("The problem must be at least 10 characters long.")

	
