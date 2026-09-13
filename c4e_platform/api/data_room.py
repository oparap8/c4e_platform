import frappe
import json
from c4e_platform.api.ai_config import get_client

def generate_data_system_prompt(key):
    hints = frappe.get_doc("C4E Data Room Hint")

    section_hint = hints.get(key)

    template = """
       {{
            "ack": "",
            "adv": "",
            "flag": {{ 
                "item": "", 
                "prompt": "" 
            }}
        }}
        """
    
    system_prompt = f"""
    You are an investment-readiness coach at C4E, a university
    entrepreneurship programme in Rwanda. You are reviewing all field of
    a student's investor-facing data room. Your goal: help the student
    make these fields something an investor would find clear, concrete,
    and credible

    Each field will have:
    - "ack": string     // 1 sentence acknowledgment when the field is solid and concrete. Under 25 words. Null otherwise.
    - "adv": string     // one specific improvement suggestion. Under 60 words. Null if nothing useful to add.
    - "flag": {{         // a missing item an investor would ask for, "" if no flag to report
        "item": string      // short label, under 6 words, "" if no flag.
        "prompt": string    // 1 sentence explanation, under 25 words "" if no flag.
        }}  
    
    Return ONLY a JSON object with these keys and no others and respond using exactly this structure:
    {template}

    Tone:
    - Direct and specific. Never generic praise ("great work!", "good
    start!"). If you cannot point to something concrete, ack is null.
    - Treat the student as an adult founder, not a child. No exclamation
    marks. No emojis.
    - Respond in the language the student wrote in. If field_text is
    in Kinyarwanda or French, your strings are in that language.
    
    Domain context:
    - Audience: investors evaluating early-stage Rwandan ventures.
    - Currency: prefer RWF. If the student uses USD, that's fine, but
    note it once if both appear without conversion.
    - Be aware that some legitimate Rwandan-context items will not match
    global templates (e.g. mobile money is normal; SACCOs are normal
    financial partners). Don't penalise them.
    
    Per-section guidance:
    {section_hint}

    Return valid JSON only. No markdown, no fences, no commentary.
    """

    return system_prompt

@frappe.whitelist()
def data_room_feedback():
    venture_name = frappe.form_dict.get('venture_name')
    industry = frappe.form_dict.get('industry')
    key = frappe.form_dict.get('key')
    field = frappe.form_dict.get('field')
    disable_ai = frappe.form_dict.get('disable_ai')

    if disable_ai:
        return

    system_prompt = generate_data_system_prompt(key)

    payload = {
        "field_value": field,
        "context": {
            "venture_name": venture_name,
            "industry": industry 
        }
    }

    user_prompt = f"""
        {key}: {payload}
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

@frappe.whitelist()
def read_uploaded_document():
    client = get_client()

    template = {
        "Problem": "", "Market Size": "", "Competetion and Edge": "",
        "Discovery": "", "Stage": "", "Features": "", "Testing": "",
        "Unique Value Proposal": "", "GTM Strategy": "", "Traction and Revenue": "",
        "Marketing Assets": "", "Financial History": "", "Projections": "",
        "Unit Economics": "", "Ask": "", "Business Registration": "",
        "Contracts": "", "IP Protection": "", "Complaince": "", "Cap Table": "",
        "Company Hook": "", "Impact Metrics": "", "Partnerships": "", "Testimonials": ""
    }

    file_url = frappe.form_dict.get('file_url')
    docname = frappe.form_dict.get('docname')

    file_doc = frappe.get_doc("File", {"file_url": file_url})
    file_content = file_doc.get_content()

    system_prompt = f"""
    You are an investment-readiness coach for an
    entrepreneurship programme. You are reading a document of
    a student's investor-facing data room. Your goal: break the document
    down into these sections: {', '.join(template.keys())}. 

    Be brief in each section and if any section wasn't present leave it
    empty ("").

    Return ONLY a JSON object with these keys and no others, using exactly this structure:
    {template}

    Return valid JSON only. No markdown, no fences, no commentary.
    """

    user_prompt = "Please analyze the attached document and extract the sections as instructed."

    uploaded = client.beta.files.upload(
        file=(file_doc.file_name, file_content, "application/pdf")
    )

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": [
                {"type": "document", "source": {"type": "file", "file_id": uploaded.id}},
                {"type": "text", "text": user_prompt}
            ]
        }]
    )

    response = message.content[0].text.strip()
    if response.startswith("```") and response.endswith("```"):
        response = response[3:-3].strip()
        if response.startswith("json"):
            response = response[4:].strip()

    try:
        result = json.loads(response)
    except json.JSONDecodeError:
        frappe.throw("AI response is not valid JSON: " + response)

    # map labels back to real Dataroom fieldnames, same pattern as Program field_config
    meta = frappe.get_meta("C4E Data Room")
    label_to_fieldname = {f.label: f.fieldname for f in meta.fields if f.label}

    doc = frappe.get_doc("C4E Data Room", docname)
    for label, value in result.items():
        fieldname = label_to_fieldname.get(label)
        if fieldname and value:
            doc.set(fieldname, value)

    doc.save()
    return {"status": "success"}