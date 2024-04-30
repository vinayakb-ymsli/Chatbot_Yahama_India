import openai
from azure.search.documents.models import QueryType
from text import nonewlines
from config import AZURE_OPENAI_CHATGPT_DEPLOYMENT, KB_FIELDS_SOURCEPAGE, KB_FIELDS_CONTENT
from langchain.prompts import ChatPromptTemplate
import re
import json
import os
# from log import log 

class Approach:
    def run(self, q: str, use_summaries: bool,fname) -> any:
        # log.info("Running the 'run' method.")
        raise NotImplementedError
    
    def get_search_query(self,query_prompt_template,history):
        # log.info("Generating search query.")
        prompt = query_prompt_template.format(chat_history=self.get_chat_history_as_text(history, include_last_turn=False), question=history[-1]["user"])
        flag = True

        while flag==True:
            completion = openai.Completion.create(
                    engine=AZURE_OPENAI_CHATGPT_DEPLOYMENT,
                    prompt=prompt,
                    temperature=0,
                    max_tokens=64,
                    n=1,
                    stop=["\n"])
            
            if completion.choices[0].text != "":
                flag = False
        
        # print(completion)
        # log.info(f"Search query generated: {completion.choices[0].text}")
        return completion.choices[0].text
    

    def retrieve_document(self,search_client,language,query_speller,q,filter,top,use_semantic_captions):
        # log.info(f"Retrieving document with query: {repr(q)} and filter: {repr(filter)}")
        return search_client.search(q,
                                        filter=filter,
                                        query_type=QueryType.SEMANTIC,
                                        query_language=language,
                                        query_speller=query_speller,
                                        semantic_configuration_name="default",
                                        top=top,
                                        query_caption="extractive|highlight-false" if use_semantic_captions else None)
    
    def get_data_points(self,use_semantic_captions,r):
        # log.info("Extracting data points from results.")
        if use_semantic_captions:
            results = [doc[KB_FIELDS_SOURCEPAGE] + ": " + nonewlines(" . ".join([c.text for c in doc['@search.captions']])) for doc in r]
        else:
            results = [doc[KB_FIELDS_SOURCEPAGE] + ": " + nonewlines(doc[KB_FIELDS_CONTENT]) for doc in r]

        return results
        
    def get_answer(self,prompt):
        # log.info("Generating answer using OpenAI.")
        completion = openai.Completion.create(
                engine=AZURE_OPENAI_CHATGPT_DEPLOYMENT, 
                prompt=prompt, 
                temperature= 0.0, 
                max_tokens=4096, 
                n=1, 
                stop=["<|im_end|>", "<|im_start|>"])
        # log.info("Answer generated.")
        response = completion.choices[0].text
    
        # Define the prefix to be removed.
        response = re.sub(r'^.*?:\*\*', '', response, 1)
        
        # Return the modified response.
        return response
    
    
    
    def override_prompt(self,prompt_prefix,results,history):
    
        # Log info about overriding prompt
        # log.info("Overriding prompt.")
        content = "\n".join(results)
        prompt_template = ChatPromptTemplate.from_template(prompt_prefix)
        prompt = prompt_template.format(context_data=content, chat_history=self.get_chat_history_as_text(history),user_question=history[-1]["user"])
        print(prompt)

        return prompt
    
    
    def get_chat_history_as_text(self, history, include_last_turn=True, approx_max_tokens=1000) -> str:
        # log.info("Converting chat history to text.")
        history_text = ""
        for h in reversed(history if include_last_turn else history[:-1]):
            history_text = """<|im_start|>user""" +"\n" + h["user"] + "\n" + """<|im_end|>""" + "\n" + """<|im_start|>assistant""" + "\n" + (h.get("bot") + """<|im_end|>""" if h.get("bot") else "") + "\n" + history_text
            if len(history_text) > approx_max_tokens*4:
                break    
        return history_text