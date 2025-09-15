import React from 'react';
import gptImgLogo from '../assets/chatgptLogo.svg';
import userIcon from '../assets/user-icon.png';
import Markdown from 'markdown-to-jsx';

/**
 * Componente que muestra un mensaje del chat.
 * @param {Object} msg - Objeto con tipo ("bot" o "user") y texto del mensaje.
 */
function ChatMessage({ msg }) {
  return (
    <div className={`chat ${msg.type === "bot" ? "bot" : ""}`}>
      <img
        className="chatImg"
        src={msg.type === "bot" ? gptImgLogo : userIcon}
        alt=""
      />
      {/* Usamos div en lugar de <p> para evitar <p> anidado */}
      <div className="txt">
        <Markdown>{msg.text}</Markdown>
      </div>
    </div>
  );
}

// Exportamos el componente para poder importarlo en App.jsx u otros
export default ChatMessage;
