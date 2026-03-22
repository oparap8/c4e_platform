import frappe
import anthropic
import json


def get_client():
    api_key = frappe.db.get_single_value("C4E Platform Settings", "anthropic_api_key")
    if not api_key:
        frappe.throw("Anthropic API key not configured in C4E Platform Settings.")
    return anthropic.Anthropic(api_key=api_key)


@frappe.whitelist()
def get_idea_feedback(onboarding_idea, onboarding_problem, onboarding_target_customer, onboarding_differentiation):
    prompt = f"""
        You are an expert business consultant who helps early-stage entrepreneurs refine their business ideas.

        Your task is to review the information below and provide a short SWOT-style reflection on the idea. 
        However, instead of explicitly labeling Strengths, Weaknesses, Opportunities, or Threats, present your feedback as constructive insights that help the student think about the next steps.

        Response Structure:

        1. **Summary (3–5 sentences)**
        - Write one short paragraph summarizing what the student is building.
        - Personalize the summary based on the idea provided.
        - Include one line of context about the industry or market if relevant.

        2. **Key Insights (3–5 bullet points)**
        - Each bullet should be a short observation, idea, or question worth exploring.
        - These can highlight strengths, opportunities, or areas to develop further.
        - Frame everything as something the student could explore or build next.
        - Do NOT present anything as something “wrong.”

        Tone Guidelines:
        - Supportive, constructive, and mentor-like.
        - If the idea seems very early-stage, acknowledge it positively:  
        "You're at the very beginning — that's a good place to start."
        - If the idea seems more developed, acknowledge that:  
        "You've already done more than most people at this stage."
        - Do NOT mention scoring, ratings, or maturity levels.

        Length Limit:
        The entire response should take **no more than 30 seconds to read**. If it is longer than that, shorten it.

        Business Idea:
        {onboarding_idea}

        Problem:
        {onboarding_problem}

        Target Customer:
        {onboarding_target_customer}

        Differentiation:
        {onboarding_differentiation}

        Response:
        """

    client = get_client()
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


@frappe.whitelist()
def check_memo(purpose, problem, solution):
    prompt = f"""
        You are screening a student proposal purpose for a university entrepreneurship program.

        Evaluate the submission and return ONLY a valid JSON object.

        Do NOT include:
        - explanations
        - markdown
        - comments
        - extra text
        - code blocks

        Return ONLY the JSON object.

        Purpose: {purpose} 
        Problem: {problem}
        Solution: {solution}

        Respond using EXACTLY this JSON structure:

        {{
        "purpose": {{
            "who_you_help_is_named": true,
            "what_you_help_them_do_is_described_in_plain_terms": true,
            "it_fits_in_one_sentence": true
        }},
        "problem": {{
            "is_problem_described_concretely": true,
            "you_mention_who_experiences_this_problem": true,
            "you_give_a_sense_of_how_significant_the_problem_is": true
        }},
        "solution": {{
            "what_the_product_or_service_does_is_described_in_plain_terms": true,
            "its_clear_how_the_solution_connects_to_the_problem_you_described": true,
            "you_havent_only_described_the_technology_youve_described_what_it_does_for_the_user": true
        }}
    }}
    """
    client = get_client()
    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )

    response = message.content[0].text.strip()

    # strip markdown code fences if Claude wraps it anyway
    if response.startswith("```") and response.endswith("```"):
        response = response[3:-3].strip()

    try:
        result = json.loads(response)
        return result
    except json.JSONDecodeError:
        frappe.throw("AI response is not valid JSON: " + response)
