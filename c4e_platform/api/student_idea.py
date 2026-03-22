import frappe
from frappe.utils import pretty_date


@frappe.whitelist()
def get_student_idea_count_per_user():
    student = frappe.db.get_value("C4E Student", {"user": frappe.session.user}, "name")

    if not student:
        return {"student": None, "count": 0, "max_ideas": 3}

    count = frappe.db.count("C4E Student Idea", {"student": student})

    return {"student": student, "count": count, "max_ideas": 3}


# get the first 3 ideas of the current user ordered by creation date
@frappe.whitelist()
def get_student_ideas_for_current_user():
    student = frappe.db.get_value(
        "C4E Student",
        {"user": frappe.session.user},
        "name"
    )

    # student = "STDNT-0002"

    if not student:
        return []

    ideas = frappe.get_list(
        "C4E Student Idea",
        filters={"student": student},
        fields=[
            "name",
            "onboarding_idea",
            "onboarding_differentiation",
            "onboarding_target_customer",
            "onboarding_problem",
            "modified",
        ],
        order_by="creation desc",
        limit=3,
    )

    for idea in ideas:
        idea["modified_pretty"] = pretty_date(idea["modified"])

    return ideas
