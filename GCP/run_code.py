import functions_framework
import importlib as il
from os import remove
from flask import jsonify

@functions_framework.http
def run(request):

    if request.method == "OPTIONS":
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Max-Age': '10000'
        }

        return ("", 204, headers)

    if 'file' not in request.files:
        response = jsonify({'error': 'file not included in request'})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response, 400

    file = request.files['file']
    if not file.filename.endswith('.py'):
        response = jsonify({'error': 'File must be a .py file'})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response, 400

    file.save('module.py')

    try:
        imported = il.import_module('module')
    except ModuleNotFoundError:
        response = jsonify({'output': 'module not found'})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response, 400
    if 'module' in il.sys.modules:
        imported = il.reload(imported)

    result = imported.main()
    file.close()
    remove('module.py')
    
    response = jsonify({'output': str(result)})
    response.headers.add("Access-Control-Allow-Origin","*")
    return response, 200