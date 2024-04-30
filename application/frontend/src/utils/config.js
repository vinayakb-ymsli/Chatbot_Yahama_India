export const config = {
    SESSION_STORAGE_KEY: 'chatBody',
    SESSION_CHAT_OPTION: 'chat-option',
    CHAT_START_OPTIONS: [
        {
            text: "Products",
            answer: "Which Product you want to know about?",
            value: "Products",
            id: 0,
        },
        {
            text: "Service Related Queries",
            answer: "Which type of Services you are looking for?",
            value: "Services",

            id: 1,
        },
        {
            text: "Dealer's Related Queries",
            answer: "What Dealer's Info or Related Query you want to know?",
            value: "Dealer",

            id: 2,
        },
        {
            text: "Talk to Agent",
            answer: "**Connecting to agent!**",
            value: "Agent",

            id: 3,
        },
        {
            text: "Other Information",
            answer: "What do you want to know about?",
            value: "Info",
            id: 4,
        }

    ]


}