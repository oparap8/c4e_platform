# Copyright (c) 2026, Udo and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class C4EMentor(Document):
	def validate(self):
		self.set_full_name()

	def set_full_name(self):
		self.full_name = f"{self.first_name} {self.last_name}"