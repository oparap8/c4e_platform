// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

frappe.ui.form.on("C4E Student", {

    refresh(frm){
        if (!frm.is_new()) {
            frm.add_custom_button(("Add Builder Role"), function(){
                frappe.call({
                    method: "c4e_platform.api.auth.add_builder_role",
                    args: {
                        user: frm.doc.email,
                    },
                    freeze: true,
                    freeze_message: "Updating role....",
                    callback(r) {
                        if (!r.message) return;
    
                        const result = r.message;
    
                        frappe.msgprint(result)
    
                    }
                })
            });

        }
    },
	
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