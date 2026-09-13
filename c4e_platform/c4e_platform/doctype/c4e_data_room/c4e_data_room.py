# Copyright (c) 2026, Udo and contributors
# For license information, please see license.txt	

import frappe
from frappe.model.document import Document

class C4EDataRoom(Document):
	def before_insert(self):
		self.append("team", {
			"user": frappe.session.user,
			"description": ""
		})

	def after_save(self):
		self.sync_team_access()
		frappe.msgprint("Done")


	def sync_team_access(self):
		current_shares = [d.user for d in frappe.share.get_users(self.doctype, self.name)]
		team_users = [d.user for d in self.team]

		for user in team_users:
			if user not in current_shares:
				frappe.share.add(
					self.doctype, self.name, user,
					read=1, write=1, share=0, notify=0
				)
				frappe.msgprint(f"Added {user}")

		for user in current_shares:
			if user not in team_users:
				frappe.share.remove(self.doctype, self.name, user)
				frappe.errprint(f"Removed {user}")
	