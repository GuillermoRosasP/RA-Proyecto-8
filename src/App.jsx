
import './App.css';
import gptLogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';
import { sendMsgToOpenAi } from './openai';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hola, soy ChatGPT. ¿En qué puedo ayudarte?" }
  ]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userInput = input;
    setInput("");

    // Mostrar mensaje del usuario
    setMessages((prev) => [...prev, { type: "user", text: userInput }]);

    try {
      const res = await sendMsgToOpenAi(userInput);
      setMessages((prev) => [...prev, { type: "bot", text: res }]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: "bot", text: "Ocurrió un error. 😢" }]);
      console.error(err);
    }
  };

  return (
    <div className='App'>
      <div className='sideBar'>
        <div className='upperSide'>
          <div className='upperSideTop'>
            <img src={gptLogo} alt="logo" className="logo" />
            <span className='brand'>ChatGPT</span>
          </div>
          <button className="midBtn">
            <img src={addBtn} alt="new chat" className="addBtn" />New Chat
          </button>
          <div className="upperSideBottom">
            <button className="query"><img src={msgIcon} alt="Query" />What is Programming?</button>
            <button className="query"><img src={msgIcon} alt="Query" />How to use an API</button>
          </div>
        </div>
        <div className='lowerSide'>
          <div className="listItems"><img src={home} alt="Home" className="listitemsimg" />Home</div>
          <div className="listItems"><img src={saved} alt="Saved" className="listitemsimg" />Saved</div>
          <div className="listItems"><img src={rocket} alt="Upgrade" className="listitemsimg" />Upgraded to Pro</div>
        </div>
      </div>

      <div className='main'>
        <div className="chats" ref={chatContainerRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat ${msg.type === "bot" ? "bot" : ""}`}>
              <img
                className="chatImg"
                src={msg.type === "bot" ? gptImgLogo : userIcon}
                alt=""
              />
              <p className="txt">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="chatFooter">
          <div className="inp">
            <input
              type="text"
              placeholder='Send a message'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="send" onClick={handleSend}>
              <img src={sendBtn} alt="send" />
            </button>
          </div>
          <p>ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT August 20 Version</p>
        </div>
      </div>
    </div>
  );
}

export default App;
