import React, { useEffect, useRef, useState } from "react";
import "./chatbot.css";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import AnswerText from "../answer-text/AnswerText";
import Badge from "react-bootstrap/Badge";
import { chatResponse } from "../../services/chatService";
import Loading from "../loading/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import { autoComplete } from "../../services/autoCompleteService";
import ChatBotHeader from "./ChatBotHeader";
import { config } from "../../utils/config";
import { IoSend } from "react-icons/io5";

export default function ChatBotText({ setShowTextBox, showTextBox }) {
  const [questionText, setQuestionText] = useState("");
  const [isAnswerLoading, setIsAnswerLoading] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState(false);
  const debounceQuestionText = useDebounce(questionText, 300);
  const [isQuestionAsked, setIsQuestionAsked] = useState(false);
  const [chatBody, setChatBody] = useState([]);
  const cardBodyRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const sendButtonRef = useRef(null);

  const [selectedChatOption, setSelectedChatOption] = useState(null);
  const [approachTemplate,setApproachTemplate] = useState();

  useEffect(() => {
    setTimeout(() => {
      setWelcomeMessage(true);

      const sessionMessage = sessionStorage.getItem(config.SESSION_STORAGE_KEY);
      const sessionMessageChatOption = sessionStorage.getItem(
        config.SESSION_CHAT_OPTION
      );

      if (sessionMessage) {
        setChatBody(JSON.parse(sessionMessage));
      }
      if (sessionMessageChatOption) {
        setSelectedChatOption(JSON.parse(sessionMessageChatOption));
      }
    }, 500);
  }, [showTextBox]);

  const handleSuggestionClick = (suggestion) => {
    if (!suggestion) {
      return;
    }

    setQuestionText((prevText) => {
      // Split the text into words
      const words = prevText.trim().split(" ");

      // Replace the last word with the suggestion
      words[words.length - 1] = suggestion;

      // Join the words back together with spaces
      return words.join(" ") + " ";
    });
  };

  /**
   * The `chatAnswer` function handles the logic for sending a question to a chatbot and displaying the
   * response in a chat interface.
   * @returns The `chatAnswer` function returns a Promise.
   */
  const chatAnswer = async (questionText) => {
    setIsAnswerLoading(true);
    setIsQuestionAsked(true);
    try {
      if (!questionText) {
        return;
      }

      const result = await chatResponse(questionText, chatBody,approachTemplate);
      const newMessage = {
        bot: result?.answer,
      };
      setSuggestions([]);
      setChatBody((prevChatBody) => {
        const updatedChatBody = [...prevChatBody];

        if (updatedChatBody.length > 0) {
          const lastUserMessageIndex = updatedChatBody.length - 1;

          // Update the last user message with the bot message
          updatedChatBody[lastUserMessageIndex] = {
            ...updatedChatBody[lastUserMessageIndex],
            ...newMessage,
          };
        }
        sessionStorage.setItem(
          config.SESSION_STORAGE_KEY,
          JSON.stringify(updatedChatBody)
        );

        return updatedChatBody;
      });
    } catch (error) {
      console.error(error);
      const newMessage = {
        bot: error?.message ?? "Something went wrong",
      };
      setChatBody((prevChatBody) => {
        const updatedChatBody = [...prevChatBody];

        if (updatedChatBody.length > 0) {
          const lastUserMessageIndex = updatedChatBody.length - 1;

          // Update the last user message with the bot message
          updatedChatBody[lastUserMessageIndex] = {
            ...updatedChatBody[lastUserMessageIndex],
            ...newMessage,
          };
        }

        return updatedChatBody;
      });
    } finally {
      setIsAnswerLoading(false);
    }
  };
  const handleResetChat = () => {
    sessionStorage.removeItem(config.SESSION_STORAGE_KEY);
    sessionStorage.removeItem(config.SESSION_CHAT_OPTION);
    setSelectedChatOption(null);
    setChatBody([]);
  };
  const handleSendButton = async (text = questionText) => {
    if (text.trim() === "") {
      setQuestionText("");
      return;
    }

    const newMessage = {
      user: text,
    };
    setSuggestions([]);
    setChatBody((prevChatBody) => [...prevChatBody, newMessage]);
    setQuestionText("");
    await chatAnswer(text);
  };
  const handleChatOptionButtonClick = (topicOptions) => {
    setApproachTemplate(topicOptions?.value);
    console.log("redsfc",topicOptions)
    setSelectedChatOption(topicOptions);
    sessionStorage.setItem(
      config.SESSION_CHAT_OPTION,
      JSON.stringify(topicOptions)
    );
  };
  /**
   * The function `handleQuestionInput` takes an event object as input, updates the question text state,
   * sets a flag to indicate that a question has not been asked, and calls an asynchronous function to
   * retrieve auto-complete suggestions based on the question text.
   * @returns The function `handleQuestionInput` returns a Promise.
   */

  const handleQuestionInput = async () => {
    if (!debounceQuestionText) {
      return;
    }
    setIsQuestionAsked(false);

    try {
      const res = await autoComplete(debounceQuestionText);
      if (res?.error) {
        return;
      }
      setSuggestions(res?.value);
    } catch (e) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    handleQuestionInput();
  }, [debounceQuestionText]);

  useEffect(() => {
    if (cardBodyRef.current) {
      cardBodyRef.current.scrollTop = cardBodyRef.current.scrollHeight;
    }
  }, [isQuestionAsked]);

  return (
    <div className="chat-body">
      <Card className={`h-100`}>
        <ChatBotHeader
          setShowTextBox={setShowTextBox}
          showTextBox={showTextBox}
          handleResetChat={handleResetChat}
        />
        <Card.Body
          className="card-chat-body"
          ref={cardBodyRef}
          style={{ overflow: "auto", padding: "0 0 1rem 0" }}
        >
          {welcomeMessage && (
            <>
              <AnswerText isAnswer={true} text={`Hi! How can I help you?`} />

              <div className="chat-options-container">
                {config?.CHAT_START_OPTIONS?.map((topicOptions) => (
                  <button
                    className="btn btn-primary mt-1 button-text-link"
                    key={topicOptions.id}
                    buttonText={topicOptions?.text}
                    disabled={selectedChatOption}
                    onClick={() => handleChatOptionButtonClick(topicOptions)}
                  >
                    {topicOptions.text}
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedChatOption && (
            <AnswerText isAnswer={true} text={selectedChatOption?.answer} />
          )}

          {chatBody?.map((chat, index) => (
            <React.Fragment key={index}>
              {chat?.user && (
                <AnswerText
                  key={chat.id}
                  isAnswer={false}
                  text={chat?.user}
                  handleSuggestionClick={handleSuggestionClick}
                  handleSendButton={handleSendButton}
                />
              )}
              {chat?.bot && (
                <AnswerText
                  key={chat.id}
                  isAnswer={true}
                  text={chat?.bot}
                  handleSuggestionClick={handleSuggestionClick}
                  handleSendButton={handleSendButton}
                />
              )}
            </React.Fragment>
          ))}

          {isAnswerLoading && <AnswerText isAnswer={true} text={<Loading />} />}
        </Card.Body>
        <Card.Footer>
          {suggestions?.length > 0 && (
            <div className="suggestion-words-container">
              {suggestions?.slice(0, 4)?.map((suggestion, index) => (
                <Badge
                  key={index}
                  className="suggestion-word"
                  onClick={() => handleSuggestionClick(suggestion?.text)}
                  style={{ marginLeft: 5 }}
                  bg="secondary"
                >
                  {suggestion?.text}
                </Badge>
              ))}
            </div>
          )}
          <div className="d-flex justify-content-between">
            <Form.Control
              className="custom-text-area "
              disabled={isAnswerLoading || selectedChatOption === null}
              as="textarea"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              // onChange={handleQuestionInput}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevents the default Enter key behavior (line break)
                  handleSendButton();
                }
              }}
              aria-label="With textarea"
              placeholder="Type your message here..."
            />

            <button
              ref={sendButtonRef}
              className="btn btn-secondary-outline"
              type="button"
              style={{ transform: "translateX(5px)" }}
              onClick={() => handleSendButton()}
            >
              <IoSend color="#0d6efd" size={20} />
            </button>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
