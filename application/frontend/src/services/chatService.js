import { API_URLS } from "../utils/apiUrls"

export const chatResponse = async (questText, historyChat = null,approachTemplate = null) => {
    let body = {
        history: [...historyChat, { user: questText }], approach: { name: "yma-demo" },approachTemplate
    }
    const response = await fetch(API_URLS.CHAT, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    return response.json();
}