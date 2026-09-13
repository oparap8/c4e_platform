app_name = "c4e_platform"
app_title = "C4E Platform"
app_publisher = "Udo"
app_description = "The C4E Platform is an AI-assisted Frappe application that replaces student email submissions with a structured, guided journey, funnelling raw startup ideas through a rigorous Company Memo review process and culminating in an investment-ready Student Data Room, allowing C4E staff to provide efficient, targeted mentorship."
app_email = "oparap8@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "c4e_platform",
# 		"logo": "/assets/c4e_platform/logo.png",
# 		"title": "C4E Platform",
# 		"route": "/c4e_platform",
# 		"has_permission": "c4e_platform.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/c4e_platform/css/c4e_platform.css"
# app_include_js = "/assets/c4e_platform/js/c4e_platform.js"

# include js, css files in header of web template
# web_include_css = "/assets/c4e_platform/css/c4e_platform.css"
# web_include_js = "/assets/c4e_platform/js/c4e_platform.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "c4e_platform/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
doctype_list_js = {
    "C4E Student Idea" : "public/js/c4e_student_idea_list.js",
    }
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "c4e_platform/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "c4e_platform.utils.jinja_methods",
# 	"filters": "c4e_platform.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "c4e_platform.install.before_install"
# after_install = "c4e_platform.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "c4e_platform.uninstall.before_uninstall"
# after_uninstall = "c4e_platform.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "c4e_platform.utils.before_app_install"
# after_app_install = "c4e_platform.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "c4e_platform.utils.before_app_uninstall"
# after_app_uninstall = "c4e_platform.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "c4e_platform.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

permission_query_conditions = {
	"C4E Student Idea": "c4e_platform.permissions.get_permission_query_conditions_for_student_idea",
}

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }


# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"c4e_platform.tasks.all"
# 	],
# 	"daily": [
# 		"c4e_platform.tasks.daily"
# 	],
# 	"hourly": [
# 		"c4e_platform.tasks.hourly"
# 	],
# 	"weekly": [
# 		"c4e_platform.tasks.weekly"
# 	],
# 	"monthly": [
# 		"c4e_platform.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "c4e_platform.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "c4e_platform.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "c4e_platform.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["c4e_platform.utils.before_request"]
# after_request = ["c4e_platform.utils.after_request"]

# Job Events
# ----------
# before_job = ["c4e_platform.utils.before_job"]
# after_job = ["c4e_platform.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"c4e_platform.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

# Website Route Rules to bypass Frappe routing for our SPA routes
website_route_rules = [
	{"from_route": "/dashboard/login", "to_route": "dashboard"},  # Match your frontend name
	{"from_route": "/dashboard/<path:app_path>", "to_route": "dashboard"},
	{"from_route": "/dashboard", "to_route": "dashboard"},
	{"from_route": "/app", "to_route": "/app"},  # Keep ERPNext desk routing
]

fixtures = [
    {
        "doctype": "Role",
        "filters": {
            "name": ["in", ["C4E Mentor", "C4E Manager", "C4E Student", "C4E Builder"]]
        }
    },
    "C4E Data Room Hint",
    {
        "doctype": "Number Card",
        "filters": {
            "name": ["in", ["Total Student Ideas", "Total Company Memos", "Total Data Rooms"]]
        }
    },
    "Swift Theme Settings"
]