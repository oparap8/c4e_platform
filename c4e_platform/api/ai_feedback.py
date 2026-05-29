import frappe
import json
from c4e_platform.api.ai_config import get_client


@frappe.whitelist()
def get_idea_feedback(onboarding_idea, onboarding_problem, onboarding_target_customer, onboarding_differentiation):
    system_prompt = """You are a startup advisor at a university Center for Entrepreneurship in Rwanda.
    Your job is to encourage students and help them think clearly about their idea.
    You are reading a student's first submission — treat it as the beginning of a conversation, not an evaluation.

    Respond ONLY with a valid JSON object. No preamble. No markdown. Just JSON.

    Return this exact structure:
    {
    "overview_paragraph": "string — under 100 words, warm and specific to their idea",
    "overview_bullets": ["string", "string", "string"],
    "industry_tag": "string — one word or short phrase, e.g. fintech, agritech, health",
    "approach": "Problem first | Solution first | unclear",
    "ai_stage_recommendation": "string — one sentence on what to focus on next"
    }

    Rules:
    - overview_paragraph must feel personal, not generic. Reference their specific idea.
    - overview_bullets: 3 to 5 bullets. Each under 20 words. Frame as things to explore, not problems to fix.
    - Never start a bullet with 'However' or 'Unfortunately'. Never use the word 'Unfortunately'.
    - If the idea sounds very early, say so positively: it is a good start.
    - If the idea sounds advanced, acknowledge that too.
    - Never mention scores, ratings, or maturity levels."""

    user_prompt = f"""Here is a student's business idea submission:

    Business Idea: {onboarding_idea}
    Problem: {onboarding_problem}
    Target Customer: {onboarding_target_customer}
    Differentiation: {onboarding_differentiation}"""

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

        bullets = "\n".join(f"- {b}" for b in result.pop("overview_bullets", []))
        paragraph = result.pop("overview_paragraph", "")
        result["overview"] = f"### Overview\n\n{paragraph}\n\n### Key Insights\n\n{bullets}"

        return result
    except json.JSONDecodeError:
        frappe.throw("AI response is not valid JSON: " + response)


@frappe.whitelist()
def check_memo(purpose, problem, solution):
    system_prompt = """
    You are screening a student proposal for a university entrepreneurship program.

    Return ONLY a valid JSON object. No preamble. No markdown. No extra text.

    Each checklist item must have two fields:
    - "pass": true or false
    - "reason": null if pass is true, or a short friendly suggestion (under 15 words) if false

    Respond using EXACTLY this structure:

    {{
    "purpose": {{
        "person_named": {{ "pass": true, "reason": null }},
        "outcome_clear": {{ "pass": true, "reason": null }},
        "one_sentence": {{ "pass": true, "reason": null }}
    }},
    "problem": {{
        "concrete": {{ "pass": true, "reason": null }},
        "who_affected": {{ "pass": true, "reason": null }},
        "significance_shown": {{ "pass": true, "reason": null }}
    }},
    "solution": {{
        "what_it_does_clear": {{ "pass": true, "reason": null }},
        "links_to_problem": {{ "pass": true, "reason": null }},
        "user_benefit_not_just_tech": {{ "pass": true, "reason": null }}
    }}
    }}
    """
    
    user_prompt = f"""
        Purpose: {purpose}
        Problem: {problem}
        Solution: {solution}
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



