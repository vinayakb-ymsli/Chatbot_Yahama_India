import React from "react";
import "./buttonTextLink.css";

const ButtonTextLink = ({
  handleSuggestionClick,
  handleSendButton,
  buttonText,
  
}) => {
  const handleButtonTextLink = () => {
    handleSuggestionClick(buttonText);
    handleSendButton(buttonText);
    // sendButtonRef.current.click();
  };



  return (
    <div className="button-text-link">
      <a
        name=""
        id=""
        className="btn btn-primary"
        href="#"
        role="button"
        onClick={handleButtonTextLink}
      >
        {buttonText}
      </a>
    </div>
  );
};

export default ButtonTextLink;
