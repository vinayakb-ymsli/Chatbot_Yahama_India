from azure.search.documents import SearchClient
from azure.core.credentials import AzureKeyCredential
from config import AZURE_SEARCH_SERVICE,search_admin_key

def get_searchclient(index):
    search_credential = AzureKeyCredential(search_admin_key)
    search_client = SearchClient(
    endpoint=f"https://{AZURE_SEARCH_SERVICE}.search.windows.net",
    index_name=index,
    credential=search_credential)

    return search_client