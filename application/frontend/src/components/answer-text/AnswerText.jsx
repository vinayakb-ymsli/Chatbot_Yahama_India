import React from "react";
import "./answerText.css";
import botIcon from "./../../assets/robot.png";
import userIcon from "./../../assets/user.png";
import ReactMarkdown from "react-markdown";

const AnswerText = ({ isAnswer, text }) => {

  return (
    <>
      {isAnswer ? (
        <div className="answer left">
          <div className="avatar">
            <img src={botIcon} alt="yamaha" width={25} height={25} />
          </div>
          <div className="overflow-auto">
            <div className="name text-muted"></div>

            <div className="text">
              {typeof text === "string" ? (
                <ReactMarkdown
                  children={text}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noreferrer noopener" />
                    ),
                  }}
                />
              ) : (
                text
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="answer right">
          <div className="overflow-hidden">
            <div className="name text-muted"></div>
            <div className="text">{text}</div>
          </div>
          <div className="avatar ">
            <img src={userIcon} alt="You" width={25} height={25} />
          </div>
        </div>
      )}
    </>
  );
};

export default AnswerText;
