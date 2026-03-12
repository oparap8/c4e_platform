### C4E Platform

The C4E Platform is an AI-assisted Frappe application that replaces student email submissions with a structured, guided journey, funnelling raw startup ideas through a rigorous Company Memo review process and culminating in an investment-ready Student Data Room, allowing C4E staff to provide efficient, targeted mentorship.

### Installation

You can install this app using the [bench](https://github.com/frappe/bench) CLI:

```bash
cd $PATH_TO_YOUR_BENCH
bench get-app $URL_OF_THIS_REPO --branch develop
bench install-app c4e_platform
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/c4e_platform
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License

mit
