import re
import frappe
from frappe.utils import strip_html_tags

def _clean_content(html):
    html = re.sub(r'<br\s*/?>', '\n', html, flags=re.IGNORECASE)
    html = re.sub(r'</p>', '\n', html, flags=re.IGNORECASE)
    text = strip_html_tags(html)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()

@frappe.whitelist()
def get_company_memo_comments(doc_name):
    comments = frappe.get_all(
        "Comment",
        fields=["content", "comment_by", "modified"],
        filters={
            "comment_type": "Comment",
            "reference_doctype": "C4E Company Memo",
            "reference_name": doc_name
        },
        order_by="modified desc"
    )
    return [
        {
            "content": _clean_content(c.content),
            "comment_by": c.comment_by,
            "modified": c.modified
        }
        for c in comments
    ]