// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

frappe.ui.form.on("C4E Company Memo", {
    refresh(frm) {
        frm.add_custom_button("Section Analysis", () => {
            frappe.prompt([
                {
                    label: 'Field to Check',
                    fieldname: 'field_section',
                    fieldtype: 'Select',
                    options: ['Purpose', 'Problem', 'Solution', 'Why Now', 'Market Potential', 
                        'Competition', 'Business Model', 'Team', 'Traction', 'What You Need', 'Vision'],
                    reqd: 1
                }
            ],
            (values) => {
                const section_key = (values.field_section).toLowerCase().replace(/ /g, '_');
                
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
            method: "c4e_platform.api.company_memo.check_memo",
            args: {
                key: section_key,
                field: section_text,
            },
            freeze: true,
            freeze_message: "Analyzing your idea...",
            callback(r) {
                if (!r.message) return;

                const result = r.message;

                console.log(result)

                section_ai_feedback(frm, section_key, result);  
                set_checklist(frm, section_key, result);
            },
        });
    },
});

function build_feedback_html(section) {
	const failures = Object.values(section)
		.filter((item) => !item.pass)
		.map((item) => `<li style="color: red;">${item.reason}</li>`)
		.join("");

	return `<ul>${failures}</ul>`;
}

function section_ai_feedback(frm, section, result){
	const target_fieldname = `${section}_ai_feedback`;

	const inner_data = result[section];

	if (!inner_data) {
        console.error(`No data found for section: ${section}`);
        return;
    }

	frm.set_df_property(target_fieldname, "options", build_feedback_html(inner_data));
}

function set_checklist(frm, section, result) {
    const inner_data = result?.[section];
    if (!inner_data) return; 

    const field_map = {
        "purpose": {
            "has_who_is_helped": "person_named",
            "is_described_in_plain_terms": "outcome_clear",
            "is_one_sentence": "one_sentence"
        },
        "problem": {
            "is_problem_described_concretely": "problem_described_concretely",
            "is_who_in_problem": "who_affected",
            "is_problem_significant": "significance_shown"
        },
        "solution": {
            "is_solution_described_clearly": "what_it_does_clear",
            "is_solution_aligned_with_problem": "links_to_problem",
            "is_user_value_clear": "user_benefit_not_just_tech"
        },
        "why_now": {
            "something_changed": "named_recent_change",
            "solution_possible": "change_makes_solution_needed"
        },
        "market_potential": {
            "estimated_number": "market_number_estimate_provided",
            "market_person": "target_market_mentioned",
            "number_source": "data_source_mentioned"
        },
        "competition": {
            "alternative_named": "competitor_named",
            "specific_reason": "competitive_advantage_explained"
        },
        "business_model": {
            "payer_named": "who_pays",
            "pay_description": "what_they_pay_for",
            "amount_provided": "amount_or_pricing_structure"
        },
        "team": {
            "team_named": "everyone_working_named",
            "team_description": "role_description_for_each",
            "suitable_solver": "team_skills_match_problem"
        },
        "traction": {
            "concrete_thing": "one_concrete_thing_done",
            "number_provided": "if_user_revenue_stated"
        },
        "what_you_need": {
            "need_stated": "stated_what_needed",
            "need_next": "what_want_next_clear"
        },
        "vision": {
            "future_described": "future_bigger_than_now_described",
            "logical_connection": "connection_to_current_solution"
        }
    };

    const current_mapping = field_map[section];

    if (current_mapping) {
        for (const [frappe_field, ai_key] of Object.entries(current_mapping)) {
            const passed = inner_data[ai_key]?.pass || false; 
            
            frm.set_value(frappe_field, passed ? 1 : 0);
        }
    }
}