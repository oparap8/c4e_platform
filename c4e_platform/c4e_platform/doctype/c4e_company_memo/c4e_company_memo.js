// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

frappe.ui.form.on("C4E Company Memo", {
	refresh(frm) {
		frm.add_custom_button("Get Analysis", () => {
			if (!frm.doc.purpose || frm.doc.purpose.length < 10) {
				frappe.msgprint({
					title: "Validation Error",
					message: "Please enter a purpose with at least 10 characters before analyzing.",
					indicator: "red",
				});
				return;
			}
			frm.trigger("process_ai_checklist");
		});
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
			callback(r) {
				if (!r.message) return;

				const { purpose, problem, solution } = r.message;

				frm.set_df_property("purpose_ai_feedback", "options", build_feedback_html(purpose));
				frm.set_df_property("problem_ai_feedback", "options", build_feedback_html(problem));
				frm.set_df_property("solution_ai_feedback", "options", build_feedback_html(solution));

				set_purpose_checklist(frm, purpose);
				set_problem_checklist(frm, problem);
				set_solution_checklist(frm, solution);
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

function set_purpose_checklist(frm, { person_named, outcome_clear, one_sentence }) {
	frm.set_value("has_who_is_helped", person_named.pass);
	frm.set_value("is_described_in_plain_terms", outcome_clear.pass);
	frm.set_value("is_one_sentence", one_sentence.pass);
}

function set_problem_checklist(frm, { concrete, who_affected, significance_shown }) {
	frm.set_value("is_problem_described_concretely", concrete.pass);
	frm.set_value("is_who_in_problem", who_affected.pass);
	frm.set_value("is_problem_significant", significance_shown.pass);
}

function set_solution_checklist(frm, { what_it_does_clear, links_to_problem, user_benefit_not_just_tech }) {
	frm.set_value("is_solution_described_clearly", what_it_does_clear.pass);
	frm.set_value("is_solution_aligned_with_problem", links_to_problem.pass);
	frm.set_value("is_user_value_clear", user_benefit_not_just_tech.pass);
}