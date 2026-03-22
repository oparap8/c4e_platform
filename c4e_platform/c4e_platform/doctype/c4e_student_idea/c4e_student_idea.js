// Copyright (c) 2026, Udo and contributors
// For license information, please see license.txt

const charCheckFields = [
	"onboarding_idea",
	"onboarding_problem",
	"onboarding_target_customer",
	"onboarding_differentiation",
];

// frappe.markdown("**Hi**");
{/* <div class="alert alert-warning" role="alert">
	You have not received <strong>AI feedback</strong> for your idea
</div> */}

frappe.ui.form.on("C4E Student Idea", {
	refresh(frm) {
		validate_char_length(frm);
		display_analyze_idea_button(frm);
		if (frm.doc.ai_feedback) {
			frm.set_df_property("ai_feedback_html", "options", frappe.markdown(frm.doc.ai_feedback));
		}
	},
	generate_feedback(frm) {
		frappe.call({
			method: "c4e_platform.api.ai_feedback.get_idea_feedback",

			args: {
				onboarding_idea: frm.doc.onboarding_idea,
				onboarding_problem: frm.doc.onboarding_problem,
				onboarding_target_customer: frm.doc.onboarding_target_customer,
				onboarding_differentiation: frm.doc.onboarding_differentiation,
			},

			freeze: true,
			freeze_message: "Analyzing your idea...",

			callback: function (r) {
				if (r.message) {
					write_to_ai_feedback(frm, r.message);
					frappe.msgprint({
						title: "AI Feedback",
						message: frappe.markdown(r.message),
						indicator: "green",
						is_html: true,
					});
				}
			},
		});
	},
});

function validate_char_length(frm) {
    charCheckFields.forEach((fieldname) => {
		const field_wrapper = frm.fields_dict[fieldname].$wrapper;

		field_wrapper
			.find("input, textarea")
			.off("input")
			.on("input", function () {
				let value = $(this).val() || "";
				let length = value.length;

				let wrapper = $(this).closest(".control-input-wrapper");

				let help_box = wrapper.find(".help-box");

				if (length < 10) {
					$(this).css("border", "1px solid red");

					help_box
						.removeClass("text-muted")
						.css("color", "red")
						.text("Minimum 10 characters required!");
				} else {
					$(this).css("border", "");

					help_box.addClass("text-muted").css("color", "").text("");
				}
			});
	});
}


function write_to_ai_feedback(frm, content) {
	frm.set_value("ai_feedback", content);

	frm.set_df_property("ai_feedback_html", "options", frappe.markdown(content));
}

function are_all_fields_valid(frm) {
	return charCheckFields.every((fieldname) => {
		const value = frm.doc[fieldname] || "";
		return value.length >= 10;
	});
}

function display_analyze_idea_button(frm){
	frm.add_custom_button("Analyze Idea", () => {
		if (!are_all_fields_valid(frm)) {
			frappe.msgprint({
				title: "Validation Error",
				message:
					"Please ensure all fields have at least 10 characters before analyzing your idea.",
				indicator: "red",
			});
			return;
		}
		frm.trigger("generate_feedback");
	});
}
