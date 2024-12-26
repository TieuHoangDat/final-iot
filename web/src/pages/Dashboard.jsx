// src/pages/Dashboard.js
import React from 'react';
import ButtonsSection from '../components/ButtonsSection'; 
import History from '../components/History'; 
import VoiceRecorder from '../components/VoiceRecorder'; 

const Dashboard = () => {
  return (
    <div className="row">
      {/* Main content (Buttons) */}
      <div className="col-md-7"> 
        <ButtonsSection />
        <VoiceRecorder />
      </div>

      {/* Right (VoiceRecorder and History) */}
      <div className="col-md-5"> 
        <History />
      </div>
    </div>
  );
};

export default Dashboard;
