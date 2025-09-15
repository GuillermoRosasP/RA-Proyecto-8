import React from 'react';
import sendBtn from '../assets/send.svg';

const ChatFooter = ({ input, setInput, handleSend }) => {

  const handleKeyDown = (e) => {
    if(e.key === "Enter" && !e.shiftKey){
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="chatFooter">
      <div className="inp">
        <input
          type="text"
          placeholder='Send a message'
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send" onClick={handleSend}>
          <img src={sendBtn} alt="send" />
        </button>
      </div>
      <p>ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT August 20 Version</p>
    </div>
  );
}

export default ChatFooter;
