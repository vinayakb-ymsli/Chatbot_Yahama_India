import React from "react";
import Card from "react-bootstrap/Card";
import yamFavicon from "./../../assets/favicon.png";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { VscDebugRestart } from "react-icons/vsc";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const ChatBotHeader = ({ setShowTextBox, showTextBox, handleResetChat }) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Restart Chat
    </Tooltip>
  );

  return (
    <Card.Header
      className="chat-bot-header "
      onClick={() => {
        if (!showTextBox) setShowTextBox(!showTextBox);
      }}
      style={!showTextBox ? { boxShadow: "0 0 20px rgba(0, 0, 0, 0.8)" } : {}}
    >
      <div className="d-flex align-items-center">
        <img src={yamFavicon} alt="chatbot" width={35} height={35} />
        <span style={{ marginLeft: "1rem" }}>Chat with me</span>
      </div>

      <div>
        {showTextBox && (
          <OverlayTrigger
            placement="top"
            delay={{ show: 250 }}
            overlay={renderTooltip}
          >
            <button
              type="button"
              className="btn btn-secondary-outline"
              onClick={handleResetChat}
            >
              <VscDebugRestart />
            </button>
          </OverlayTrigger>
        )}
        <button
          className="btn btn-primary-outline "
          type="button"
          onClick={() => setShowTextBox(!showTextBox)}
        >
          {showTextBox ? <FaChevronDown /> : <FaChevronUp />}
        </button>
      </div>
    </Card.Header>
  );
};

export default ChatBotHeader;
