import React from "react";
import HomePageCarasouel from "../../components/home-page-carasoule/HomePageCarasouel";
import ChatBot from "../../components/chat-bot/ChatBot";
import "./homepage.css";

const HomePage = () => {
  return (
    <div className="home-page-container">
      <div className="carasoul-section">
        <HomePageCarasouel />
      </div>
      <div className="chatbot-section">
        <ChatBot />
      </div>
    </div>
  );
};

export default HomePage;
