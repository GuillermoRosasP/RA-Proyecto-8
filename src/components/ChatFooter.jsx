
import React from "react";
import { FiSend } from "react-icons/fi";

const ChatFooter = ({ input, setInput, handleSend, isLoading, onCancel }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading) {
        // Si hay petición en curso, Enter la cancela
        if (onCancel) onCancel();
      } else {
        handleSend();
      }
    }
  };

  return (
    <div className="chatFooter sticky bottom-0 bg-white border-t border-gray-200 p-4 transition-all duration-300">
      <div className="inp flex items-center gap-3 max-w-5xl mx-auto">
        <input
          type="text"
          placeholder="Pregunta lo que quieras"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-3 rounded-full border border-gray-200 focus:outline-none"
        />

        <button
          onClick={() => {
            if (isLoading) {
              if (onCancel) onCancel();
            } else {
              handleSend();
            }
          }}
          className="send bg-gray-200 p-3 rounded-full hover:bg-gray-300"
          aria-label={isLoading ? "Cancelar" : "Enviar"}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        ChatGPT puede producir información inexacta. Presiona Enter para detener una respuesta en curso.
      </p>
    </div>
  );
};

export default ChatFooter;
