import { API_URLS } from "../utils/apiUrls"

export const autoComplete = async (inputText) => {
    let body = {
        inputText: inputText
    };
    try {

        const response = await fetch(API_URLS.AUTOCOMPLETE, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
        return response.json();
    } catch (e) {
        console.error(e);
        return [];
    }
}