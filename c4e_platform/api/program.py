import frappe

@frappe.whitelist()
def get_dataroom_fields():
	meta = frappe.get_meta("C4E Data Room")
	return [{
        "fieldname": f.fieldname, 
        "label": f.label or f.fieldname,
        "description": f.description or "",
        "placeholder": f.placeholder or ""
        }
		for f in meta.fields
		if f.fieldtype not in ("Section Break", "Column Break", "Tab Break", "Table")
	]

@frappe.whitelist()
def get_program_field_config(program):
	program_doc = frappe.get_doc("C4E Program", program)
	meta = frappe.get_meta("C4E Data Room")
	label_to_fieldname = {f.label: f.fieldname for f in meta.fields if f.label}

	result = []
	for row in program_doc.field_config:
		fieldname = label_to_fieldname.get(row.field)
		if not fieldname:
			continue
		result.append({
			"field": fieldname,
			"hidden": row.hidden,
			"description": row.description,
			"placeholder": row.placeholder
		})
	return result