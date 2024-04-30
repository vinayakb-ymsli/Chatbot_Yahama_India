import os
import logging
from flask import Flask, request, jsonify
from utils.client import get_clients
from config import OPENAI_API_KEY,AZURE_OPENAI_SERVICE,AZURE_SEARCH_SERVICE,AZURE_INDEX,AZURE_AI_SUGGESTOR,api_version,search_admin_key
import openai
from flask_cors import CORS
import requests


openai.api_type = "azure"
openai.api_base = f"https://{AZURE_OPENAI_SERVICE}.openai.azure.com"
openai.api_version = "2023-06-01-preview"

os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": ["http://localhost:3000"]}})

@app.route("/autocomplete" , methods=["POST"])
def autocomplete():
    data = request.json  # Parse JSON from incoming request
    input_text = data.get('inputText')  # Extract the input text from JSON
    if not input_text.strip():
        return jsonify([])

    url = f'https://{AZURE_SEARCH_SERVICE}.search.windows.net/indexes/{AZURE_INDEX}/docs/autocomplete?api-version={api_version}&search={input_text}&suggesterName={AZURE_AI_SUGGESTOR}'

    headers = {
        'Content-Type': 'application/json',
        'api-key': search_admin_key,
    }

    response = requests.get(url, headers=headers,verify=False)
    # if response.status_code == 200:
    return jsonify(response.json())  # Return autocomplete suggestions
    
    
@app.route("/chat", methods=["POST"])
def chat():

    approach = request.json["approach"]
    history = request.json["history"]
    approach_template = request.json["approachTemplate"]
    try:
        search_clients = get_clients(approach,approach_template)
        impl = search_clients
        
        if not impl:
            return jsonify({"error": "unknown approach"}), 400
        result = []
        result.append(impl.run(history))
        
        return jsonify(result[0])

    except Exception as e:
        logging.exception("Exception in /chat")
        return jsonify({"error": str(e)}), 500

    
if __name__ == "__main__":
    app.run(debug=True)
