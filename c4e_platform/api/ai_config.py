import frappe
import anthropic
from frappe.utils.password import get_decrypted_password


def get_client():
    api_key = get_decrypted_password(
        "C4E Platform Settings",
        "C4E Platform Settings",
        "anthropic_api_key",
        raise_exception=False
    )
    if not api_key:
        frappe.throw("Anthropic API key not configured in C4E Platform Settings.")
    return anthropic.Anthropic(api_key=api_key)