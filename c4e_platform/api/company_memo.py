import frappe
import json
from c4e_platform.api.ai_config import get_client

def generate_system_prompt(key):
    templates = {
        "purpose": """
        {{
            "purpose": {{
                "person_named": {{ "pass": true, "reason": null }},
                "outcome_clear": {{ "pass": true, "reason": null }},
                "one_sentence": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "problem": """
        {{
            "problem": {{
                "problem_described_concretely": {{ "pass": true, "reason": null }},
                "who_affected": {{ "pass": true, "reason": null }},
                "significance_shown": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "solution": """
        {{
            "solution": {{
                "what_it_does_clear": {{ "pass": true, "reason": null }},
                "links_to_problem": {{ "pass": true, "reason": null }},
                "user_benefit_not_just_tech": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "why_now": """
        {{
            "why_now": {{
                "named_recent_change": {{ "pass": true, "reason": null }},
                "change_makes_solution_needed": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "market_potential": """
        {{
            "market_potential": {{
                "market_number_estimate_provided": {{ "pass": true, "reason": null }},
                "target_market_mentioned": {{ "pass": true, "reason": null }},
                "data_source_mentioned": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "competition": """
        {{
            "competition": {{
                "competitor_named": {{ "pass": true, "reason": null }},
                "competitive_advantage_explained": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "business_model": """
        {{
            "business_model": {{
                "who_pays": {{ "pass": true, "reason": null }},
                "what_they_pay_for": {{ "pass": true, "reason": null }},
                "amount_or_pricing_structure": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "team": """
        {{
            "team": {{
                "everyone_working_named": {{ "pass": true, "reason": null }},
                "role_description_for_each": {{ "pass": true, "reason": null }},
                "team_skills_match_problem": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "traction": """
        {{
            "traction": {{
                "one_concrete_thing_done": {{ "pass": true, "reason": null }},
                "if_user_revenue_stated": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "what_you_need": """
        {{
            "what_you_need": {{
                "stated_what_needed": {{ "pass": true, "reason": null }},
                "what_want_next_clear": {{ "pass": true, "reason": null }}
            }}
        }}
        """,
        "vision": """
        {{
            "vision": {{
                "future_bigger_than_now_described": {{ "pass": true, "reason": null }},
                "connection_to_current_solution": {{ "pass": true, "reason": null }}
            }}
        }}
        """
    }

    response_object = templates.get(key, "")

    system_prompt = f"""
    You are screening a student proposal for a university entrepreneurship program.

    Return ONLY a valid JSON object. No preamble. No markdown. No extra text.

    Each checklist item must have two fields:
    - "pass": true or false
    - "reason": "" if pass is true, or a short friendly suggestion (under 15 words) if false

    Respond using EXACTLY this structure:
    {response_object}
    """

    return system_prompt
    

@frappe.whitelist()
def check_memo():
    key = frappe.form_dict.get('key')
    field = frappe.form_dict.get('field')

    system_prompt = generate_system_prompt(key)
    
    user_prompt = f"""
        {key}: {field}
        """

    client = get_client()
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )

    response = message.content[0].text.strip()

    if response.startswith("```") and response.endswith("```"):
        response = response[3:-3].strip()
        if response.startswith("json"):
            response = response[4:].strip()

    try:
        result = json.loads(response)
        return result
    except json.JSONDecodeError:
        frappe.throw("AI response is not valid JSON: " + response)