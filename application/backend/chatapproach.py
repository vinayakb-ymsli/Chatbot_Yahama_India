
from approach import Approach
import uuid

class EnglishChatApproach(Approach):

    language = "en-us"
    query_speller = "lexicon"
        
    def run(self, history: list[dict]) -> any:
        # log.info(f'Running the main process with history: {history} and overrides: {overrides}')
        use_semantic_captions = True
        top = 3

        q = self.get_search_query(self.query_prompt_template,history)
        r = self.retrieve_document(search_client = self.search_client,
                                    language = self.language,
                                    query_speller = self.query_speller,
                                    q = q,
                                    filter = None,
                                    top = top,
                                    use_semantic_captions = use_semantic_captions)
        
        
        print(r)

        results = self.get_data_points(use_semantic_captions,r)
        prompt = self.override_prompt(prompt_prefix = self.prompt_prefix,
                                        results = results,
                                        history = history)
        
        answer = self.get_answer(prompt)     
        print(answer)
        return {"data_points": results, "answer": answer,"thoughts": f"Search for:<br>{q}<br><br>Prompt:<br>" + prompt.replace('\n', '<br>'),"source_para":q.split(),"id":self.generate_uuid()}
        
     
    def generate_uuid(self):
        # log.info("Generating a new UUID.")
        return str(uuid.uuid4())
