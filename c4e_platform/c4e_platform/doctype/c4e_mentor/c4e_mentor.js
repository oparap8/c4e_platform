// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

frappe.ui.form.on("C4E Mentor", {
	first_name(frm) {
        frm.trigger("setFullName");
    },
    
    last_name(frm) {
        frm.trigger("setFullName");
    },

    setFullName(frm) {
        frm.set_value("full_name", `${frm.doc.first_name || ""} ${frm.doc.last_name || ""}`.trim());
    }
});