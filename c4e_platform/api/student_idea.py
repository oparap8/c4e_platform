import frappe
from frappe.utils import pretty_date


@frappe.whitelist()
def get_student_idea_count_per_user():
	count = frappe.db.count("C4E Student Idea", {"student": frappe.session.user})
	return {"count": count, "max_ideas": 3}


@frappe.whitelist()
def get_student_ideas_for_current_user():
	ideas = frappe.get_list(
		"C4E Student Idea",
		filters={"student": frappe.session.user},
		fields=[
			"name",
			"student_idea",
			"onboarding_problem",
			"onboarding_solution",
			"stage",
			"modified",
		],
		order_by="creation desc",
		limit=3,
	)

	for idea in ideas:
		idea["modified_pretty"] = pretty_date(idea["modified"])

	return ideas
