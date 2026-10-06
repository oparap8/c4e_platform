import frappe
import anthropic
from frappe.utils.password import get_decrypted_password


def get_client():
    api_key = get_decrypted_password(
        doctype="C4E Platform Settings", 
        name="C4E Platform Settings", 
        fieldname="anthropic_api_key"
    )
    if not api_key:
        frappe.throw("Anthropic API key not configured in C4E Platform Settings.")
    return anthropic.Anthropic(api_key=api_key)