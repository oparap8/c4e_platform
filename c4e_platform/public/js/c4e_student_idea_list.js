frappe.listview_settings["C4E Student Idea"] = {
	onload(listview) {
		frappe.call({
			method: "c4e_platform.api.student_idea.get_student_idea_count_per_user",
			callback: function (r) {
				if (!r.message) return;

				let { count, max_ideas } = r.message;
				if (count >= max_ideas) {
					$(listview.page.main).parent().prepend(`
                        <div class="alert alert-warning" role="alert">
                            You have already submitted ${count} ideas. You cannot submit more than ${max_ideas} ideas.
                        </div>
                    `);
					$(".btn-primary").hide();
				}``
			},
		});
	},
};
