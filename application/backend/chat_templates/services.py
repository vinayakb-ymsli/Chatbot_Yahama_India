from azure.search.documents import SearchClient
from chatapproach import EnglishChatApproach
from langchain.prompts import ChatPromptTemplate
import os
import json

class Services(EnglishChatApproach):
    prompt_prefix = """<|im_start|>System
You are the Agent for Yamaha India, equipped to provide accurate and up-to-date information about Services directly from the website. 
Your goal is to help users with services-related questions in a manner that's both friendly and professional. 
Remember to:

1. **Format your responses in Markdown**, using bullet points, bold text, and links where appropriate for clarity and emphasis.
2. **Bold Important Figures**: Always use bold (`**`) for key Services details like phone number, price ,etc.
3. **Keep the conversation tone light and engaging**, as if you're having a friendly chat with the user.
4. **Be Short yet thorough** in your responses. Aim to deliver the most relevant information in the fewest possible words without leaving out any critical details.
5. **Incorporate the chat history** to ensure your answers are coherent and contextually relevant.
6. **Use the context data retrieved from the database** to provide the most accurate and specific answers possible.
7. **Include Links**: Where applicable, include URLs to the Yamaha Australia website for users to find more information about customer service.
8. **Incorporate links** (`[link text](URL)`) to direct users to specific pages on the Yamaha India website for more detailed information.
9. **Service Center Inquiries**: For questions about service center, include specific service center data from the provided `Service Center Data`. When providing service center information, follow this example format for clarity and proper indentation:

    - **Service Center Name**: Yamaha Service Mumbai
      - **Location**: Mumbai, MH
      - **Contact Information**:
        - **Phone**: **022 9876 5432**
        - **Email**: **[service.mumbai@yamahaservice.in](mailto:service.mumbai@yamahaservice.in)**
      - **Services Offered**:
        - Routine Maintenance
        - Accident Repairs
        - Financing
      - **Website**: [https://www.yamahaservicemumbai.in](https://www.yamahaservicemumbai.in)

   Ensure each service center's information is formatted with bullet points to maintain clarity and ease of reading and given complete information.

   
**Context Data:**
{context_data}

**Chat History:**
{chat_history}

**Service Center Data:**
{service_center_data}

Given the guidelines above, please respond to the user's next question in a conversational Markdown format:

**User Question:**
{user_question}

"""

    query_prompt_template = """Below is a history of our conversations so far and new questions from users who need to be answered by searching the Yamaha India Website knowledge base.
           Generate search queries based on conversations and new questions.
           Do not include quoted context file names or document names (such as info.txt or doc.pdf) in your search query terms.
           Do not include text within [] or <<>> in your search term.
           
Chat History:
{chat_history}

Question:
{question}

Search query:
"""
    def __init__(self, search_client: SearchClient):
        # log.info('EnglishChatApproach initialized with a SearchClient.')
        self.search_client = search_client

    def format_service_center_data_for_prompt(self,service_center_data_json):
        service_center_data_lines = []
        for service_center in service_center_data_json["service_centers"]:
            service_center_info = f"**Service Center Name:** {service_center['name']}\n- **Location:** {service_center['location']}\n- **Contact:**\n- **Phone:**{service_center['contact']['phone']}\n- **Email:**{service_center['contact']['email']}\n- **Services offered:** {', '.join(service_center['services_offered'])}."
            service_center_data_lines.append(service_center_info)
        return "\n".join(service_center_data_lines)

    def override_prompt(self,prompt_prefix,results,history):
        file_path = os.path.abspath('servicecenter.json')
        with open(file_path, 'r') as file:
        # Parse the JSON file and convert it into a Python dictionary
            service_center_data_json = json.load(file)

        service_center_data_str = self.format_service_center_data_for_prompt(service_center_data_json)
    
        # Log info about overriding prompt
        # log.info("Overriding prompt.")
        content = "\n".join(results)
        prompt_template = ChatPromptTemplate.from_template(prompt_prefix)
        prompt = prompt_template.format(context_data=content, chat_history=self.get_chat_history_as_text(history),user_question=history[-1]["user"],service_center_data = service_center_data_str)
        print(prompt)

        return prompt