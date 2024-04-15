# TO make this work - need to create Alerts

import functions_framework
from flask import jsonify, request
import os
import logging
import json

@functions_framework.http
def create_log(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows POST requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    if request.method == 'POST':
        entry = dict(
            severity="NOTICE",
            support=True,
            message=request.json['ticket']
        )
        print(json.dumps(entry))
        response = jsonify({'output': 'submitted ticket with message: "' + request.json['ticket'] + '"'}), 200, headers
        return response
    else:
        response = jsonify({'error': 'method must be POST. provided: ' + request.method}), 400, headers
        return response