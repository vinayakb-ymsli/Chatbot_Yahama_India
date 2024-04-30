from chat_templates.products import *
from chat_templates.dealers import *
from chat_templates.services import *
from chat_templates.talktoagent import *
from chat_templates.information import *

from utils.utils import get_searchclient

def get_clients(approach, approach_template):
    template_mapping = {
        "Products": Products,
        "Dealers": Dealers,
        "Services": Services,
        "Talk to Agent": TalkToAgent,
        "Info": Info
    }

    search_client = get_searchclient(approach["name"])
    return template_mapping.get(approach_template, "Error")(search_client)