// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

frappe.ui.form.on("C4E Company Memo", {
	refresh(frm) {
		frm.add_custom_button(
			"Get Analysis",
			() => {
				if (!frm.doc.purpose || frm.doc.purpose.length < 10) {
					frappe.msgprint({
						title: "Validation Error",
						message:
							"Please enter a purpose with at least 10 characters before analyzing.",
						indicator: "red",
					});
					return;
				}
				frm.trigger("process_ai_checklist");
			},
		);
	},

	process_ai_checklist(frm) {
		frappe.call({
			method: "c4e_platform.api.ai_feedback.check_memo",

			args: {
				purpose: frm.doc.purpose,
                problem: frm.doc.problem,
                solution: frm.doc.solution,
			},

			freeze: true,
			freeze_message: "Analyzing your idea...",

			callback: function (r) {
				if (r.message) {
					console.log("AI Checklist Result:", r.message);
				}
                const {
					purpose,
					problem,
					solution,
				} = r.message;

                set_purpose_checklist(frm, purpose);
                set_problem_checklist(frm, problem);
                set_solution_checklist(frm, solution);
			},
		});
	},
});

function set_problem_checklist(frm, problem) {
    const {
        is_problem_described_concretely,
        you_mention_who_experiences_this_problem,
        you_give_a_sense_of_how_significant_the_problem_is,
    } = problem;

    frm.set_value("is_problem_described_concretely", is_problem_described_concretely);
    frm.set_value("is_who_in_problem", you_mention_who_experiences_this_problem);
    frm.set_value("is_problem_significant", you_give_a_sense_of_how_significant_the_problem_is);
}

function set_purpose_checklist(frm, purpose) {
    const {
        who_you_help_is_named,
        what_you_help_them_do_is_described_in_plain_terms,
        it_fits_in_one_sentence,
    } = purpose;

    frm.set_value("has_who_is_helped", who_you_help_is_named);
	frm.set_value(
		"is_described_in_plain_terms",
		what_you_help_them_do_is_described_in_plain_terms,
	);
	frm.set_value("is_one_sentence", it_fits_in_one_sentence);
}

function set_solution_checklist(frm, solution) {
    const {
		what_the_product_or_service_does_is_described_in_plain_terms,
		its_clear_how_the_solution_connects_to_the_problem_you_described,
		you_havent_only_described_the_technology_youve_described_what_it_does_for_the_user,
	} = solution;

    frm.set_value("is_solution_described_clearly", what_the_product_or_service_does_is_described_in_plain_terms);
    frm.set_value(
		"is_solution_aligned_with_problem",
		its_clear_how_the_solution_connects_to_the_problem_you_described,
	);
    frm.set_value(
		"is_user_value_clear",
		you_havent_only_described_the_technology_youve_described_what_it_does_for_the_user,
	);
}
