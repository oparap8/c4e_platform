// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

frappe.ui.form.on("C4E Data Room", {
	refresh(frm) {
        frm.add_custom_button("Field Analysis", () => {
            frappe.prompt([
                {
                    label: 'Field to Check',
                    fieldname: 'field_section',
                    fieldtype: 'Select',
                    options: ['Problem', 'Market Size', 'Competition and Edge', 'Discovery', 
                        'Stage', 'Features', 'Testing', 'Unique Value Proposal', 'Go-To-Market Strategy', 'Traction and Revenue', 
                        'Marketing Assets', 'Financial History', 'Projections', 'Unit Economics', 'Ask', 'Business Registration', 
                        'Contracts', 'IP Protection', 'Compliance', 'Cap Table', 'Impact Metrics', 'Partnerships', 'Testimonials'],
                    reqd: 1
                }
            ],
            (values) => {
                let section_key;
                if (values.field_section == "Unique Value Proposal"){
                    section_key = "uvp";
                } else if (values.field_section == "Go-To-Market Strategy"){
                    section_key = "gtm_strategy";
                } else if (values.field_section == "Traction and Revenue") {
                    section_key = "traction"
                } else if (values.field_section == "IP Protection") {
                    section_key = 'ip'
                } else {
                    section_key = (values.field_section).toLowerCase().replace(/ /g, '_');
                }
                
                const section_text = frm.doc[section_key];

                if (!section_text || section_text.length < 10) {
                    frappe.msgprint({
                        title: "Validation Error",
                        message: `Please enter a ${values.field_section} with at least 10 characters before analyzing.`,
                        indicator: "red",
                    });
                    return;
                }

                frm.events.process_ai_checklist(frm, section_key, section_text);
            });
        });
	},
    process_ai_checklist(frm, section_key, section_text) {
        frappe.call({
            method: "c4e_platform.api.data_room.data_room_feedback",
            args: {
                venture_name: frm.doc.venture_name,
                industry: frm.doc.industry,
                key: section_key,
                field: section_text,
            },
            freeze: true,
            freeze_message: "Analyzing your input...",
            callback(r) {
                if (!r.message) return;

                const result = r.message;
                section_ai_feedback(frm, section_key, result);  
            },
        });
    },
});

function build_feedback_html(feedback_data) {
    if (!feedback_data) return "";

    let list_items = [];

    if (feedback_data.ack) {
        list_items.push(
            `<li style="color: #16a34a; margin-bottom: 8px;">
                <b>Solid:</b> ${feedback_data.ack}
            </li>`
        );
    }

    if (feedback_data.adv) {
        list_items.push(
            `<li style="color: #d97706; margin-bottom: 8px;">
                <b>Tip:</b> ${feedback_data.adv}
            </li>`
        );
    }

    if (feedback_data.flag && feedback_data.flag.item) {
        list_items.push(
            `<li style="color: #dc2626; margin-bottom: 8px;">
                <b>Missing (${feedback_data.flag.item}):</b> ${feedback_data.flag.prompt}
            </li>`
        );
    }

    if (list_items.length === 0) {
        return `<p style="color: gray; font-style: italic;">No specific feedback generated.</p>`;
    }

    return `<ul style="list-style-type: none; padding: 0;">${list_items.join("")}</ul>`;
}

function section_ai_feedback(frm, section, result){
	const target_fieldname = `${section}_ai_feedback`;

    const safe_html = build_feedback_html(result);
    frm.get_field(target_fieldname).$wrapper.html(safe_html);

	// frm.set_df_property(target_fieldname, "options", build_feedback_html(result));
}