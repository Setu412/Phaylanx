# requirments.txt
# functions-framework==3.*
# openai>=0.10.0
# markupsafe==2.0.1

import functions_framework
from openai import OpenAI
import os
from flask import jsonify, request
from markupsafe import escape



client = OpenAI(
  api_key=os.environ['OPENAI_API_KEY'], 
)

@functions_framework.http
def gpt_service(request):
    # Handle preflight requests for CORS
    if request.method == "OPTIONS":
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return '', 204, headers
    
    # Ensure the request method is POST
    if request.method != 'POST':
        return 'Only POST method is supported', 405

    # Parse request JSON
    request_json = request.get_json(silent=True)

    if not request_json or 'prompt' not in request_json:
        response = jsonify({'error': 'No prompt provided'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    
    prompt = request_json['prompt']

    try:
        # Generate response from OpenAI GPT
        response: ChatCompletion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are helpful coding assistant."},
                {"role": "user", "content": prompt},
            ],
        )
        result_text = response.choices[0].message.content
        response_data = jsonify({'output': result_text})
    except Exception as e:
        response_data = jsonify({'error': str(e)})
        return response_data, 500
    
    # Add CORS headers to the response
    response_data.headers.add('Access-Control-Allow-Origin', '*')
    return response_data, 200


