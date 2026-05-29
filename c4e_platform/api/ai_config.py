import frappe
import anthropic


def get_client():
    api_key = frappe.db.get_single_value("C4E Platform Settings", "anthropic_api_key")
    if not api_key:
        frappe.throw("Anthropic API key not configured in C4E Platform Settings.")
    return anthropic.Anthropic(api_key=api_key)