// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

frappe.ui.form.on("C4E Program", {
    onload(frm) {
		populate_field_options(frm);

		// auto-populate only for a brand new, unsaved doc with an empty table
		if (frm.is_new() && (!frm.doc.field_config || frm.doc.field_config.length === 0)) {
			populate_field_config(frm);
		}
	},
	refresh(frm) {
        populate_field_options(frm);
		frappe.call({
			method: "c4e_platform.api.program.get_dataroom_fields",
			callback: function(r) {
				const options = (r.message || []).map(f => f.fieldname);
				frm.fields_dict["field_config"].grid.update_docfield_property(
					"field", "options", options.join("\n")
				);
				frm.fields_dict["field_config"].grid.refresh();

                frm.fields_dict["field_config"].grid.grid_rows.forEach(row => {
                    if (row.refresh_field) {
                        row.refresh_field("field");
                    }
                });
			}
		});
	},
});

function populate_field_options(frm) {
	frappe.call({
		method: "c4e_platform.api.program.get_dataroom_fields",
		callback: function(r) {
			const labels = (r.message || []).map(f => f.label);
			frm.fields_dict["field_config"].grid.update_docfield_property(
				"field", "options", labels.join("\n")
			);
			frm.fields_dict["field_config"].grid.refresh();
            
            frm.fields_dict["field_config"].grid.grid_rows.forEach(row => {
				if (row.refresh_field) {
					row.refresh_field("field");
				}
			});
		}
	});
}

function populate_field_config(frm) {
	frappe.call({
		method: "c4e_platform.api.program.get_dataroom_fields",
		callback: function(r) {
			const fields = r.message || [];
			frm.clear_table("field_config");

			fields.forEach(f => {
				const row = frm.add_child("field_config");
				frappe.model.set_value(row.doctype, row.name, "field", f.label);
				frappe.model.set_value(row.doctype, row.name, "hidden", 0);
				frappe.model.set_value(row.doctype, row.name, "description", f.description || "");
				frappe.model.set_value(row.doctype, row.name, "placeholder", f.placeholder || "");
			});

			frm.refresh_field("field_config");
			frm.dirty();
		}
	});
}