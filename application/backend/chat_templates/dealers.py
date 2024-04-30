from azure.search.documents import SearchClient
from chatapproach import EnglishChatApproach
from langchain.prompts import ChatPromptTemplate
import os
import json

class Dealers(EnglishChatApproach):
    prompt_prefix = """<|im_start|>System
You are the Agent for Yamaha India, equipped to provide accurate and up-to-date information about Yamaha Dealer's directly from the website. 
Your goal is to help users with dealer-related questions in a manner that's both friendly and professional. 
Remember to:

1. **Format your responses in Markdown**, using bullet points, bold text, and links where appropriate for clarity and emphasis.
2. **Bold Important Figures**: Always use bold (`**`) for key Dealers Information and the services they provide.
3. **Keep the conversation tone light and engaging**, as if you're having a friendly chat with the user.
4. **Be Short yet thorough** in your responses. Aim to deliver the most relevant information in the fewest possible words without leaving out any critical details.
5. **Incorporate the chat history** to ensure your answers are coherent and contextually relevant.
6. **Use the context data retrieved from the database** to provide the most accurate and specific answers possible.
7. **Include Links**: Where applicable, include URLs to the Yamaha Australia website for users to find more information, apply for finance, or contact customer service.
8. **Incorporate links** (`[link text](URL)`) to direct users to specific pages on the Yamaha India website for more detailed information.
9. **Dealer Inquiries**: For questions about dealers, include specific dealer data from the provided `Dealer Data`. When providing dealer information, follow this example format for clarity and proper indentation:

    - **Dealer Name**: Yamaha Motors Sydney
      - **Location**: Sydney, NSW
      - **Contact Information**:
        - **Phone**: **02 1234 5678**
        - **Email**: **[contact@yamahamotorssydney.au](mailto:contact@yamahamotorssydney.au)**
      - **Services Offered**:
        - Sales
        - Service and Maintenance
        - Financing
      - **Website**: [https://www.yamahamotorssydney.au](https://www.yamahamotorssydney.au)

   Ensure each dealer's information is formatted with bullet points to maintain clarity and ease of reading and given complete information.

**Context Data:**
{context_data}

**Chat History:**
{chat_history}

**Dealer Data:**
{dealer_data}

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

    def format_dealer_data_for_prompt(self,dealer_data_json):
        dealer_data_lines = []
        for dealer in dealer_data_json["dealers"]:
            dealer_info = f"**Dealer Name:** {dealer['name']}\n- **Location:** {dealer['location']}\n- **Contact:**\n- **Phone:**{dealer['contact']['phone']}\n- **Email:**{dealer['contact']['email']}\n- **Services offered:** {', '.join(dealer['services_offered'])}."
            dealer_data_lines.append(dealer_info)
        return "\n".join(dealer_data_lines)
    
    def override_prompt(self,prompt_prefix,results,history):
        file_path = os.path.abspath('data.json')
        with open(file_path, 'r') as file:
        # Parse the JSON file and convert it into a Python dictionary
            dealer_data_json = json.load(file)

        dealer_data_str = self.format_dealer_data_for_prompt(dealer_data_json)
    
        # Log info about overriding prompt
        # log.info("Overriding prompt.")
        content = "\n".join(results)
        prompt_template = ChatPromptTemplate.from_template(prompt_prefix)
        prompt = prompt_template.format(context_data=content, chat_history=self.get_chat_history_as_text(history),user_question=history[-1]["user"],dealer_data = dealer_data_str)
        print(prompt)

        return prompt