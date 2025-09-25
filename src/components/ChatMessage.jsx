
import React from "react";
import { FiMessageSquare, FiUser } from "react-icons/fi";

/**
 * ChatMessage: muestra un mensaje de bot o user.
 * Renderiza texto con whitespace preserved (saltos de línea).
 */
const ChatMessage = ({ msg }) => {
  const isBot = msg.type === "bot";
  return (
    <div className={`chat ${isBot ? "bot self-start" : "user self-end"} max-w-[85%] flex gap-4`}>
      <div className="chatImg flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          {isBot ? <FiMessageSquare className="w-5 h-5 text-teal-600" /> : <FiUser className="w-5 h-5 text-gray-600" />}
        </div>
      </div>

      <div className="txt whitespace-pre-wrap text-base leading-6">
        {msg.text}
      </div>
    </div>
  );
};

export default ChatMessage;
