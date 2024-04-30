import React, { useState } from "react";
import "./chatbot.css";
import ChatBotText from "./ChatBotText";
import Card from "react-bootstrap/Card";
import ChatBotHeader from "./ChatBotHeader";

const ChatBot = () => {
  const [showTextBox, setShowTextBox] = useState(false);
  return (
    <>
      {/* {!showTextBox && (
        <button className="chatbot-icon" onClick={() => setShowTextBox(true)}>
          <img src={chatBotIcon} alt="chatbot" width={50} height={50} />
        </button>
      )} */}

      {!showTextBox && (
        <Card>
          <ChatBotHeader
            showTextBox={showTextBox}
            setShowTextBox={setShowTextBox}
          />
        </Card>
      )}
      <div
        className={`chat-text-box ${showTextBox ? "slide-up" : "slide-down"}`}
      >
        {showTextBox && (
          <ChatBotText
            setShowTextBox={setShowTextBox}
            showTextBox={showTextBox}
          />
        )}
      </div>
    </>
  );
};

export default ChatBot;
