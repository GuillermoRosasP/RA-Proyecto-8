
// Un componente reutilizable para la barra de entrada.
// Props:
// - mode: "hero" | "footer"  -> controla tamaño y estilos
// - value, onChange, onSubmit, isLoading, onCancel
// - placeholder (opcional)

import React from "react";
import { FiSend } from "react-icons/fi";

export default function InputBar({
  mode = "footer",
  value,
  onChange,
  onSubmit,
  isLoading = false,
  onCancel,
  placeholder = "Pregunta lo que quieras",
}) {
  const isHero = mode === "hero";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isLoading) {
        if (onCancel) onCancel();
      } else {
        onSubmit();
      }
    }
  };

  return (
    <div
      className={`w-full ${isHero ? "mx-auto max-w-2xl" : "max-w-5xl mx-auto"} transition-all duration-300`}
    >
      <div
        className={`flex items-center gap-3 rounded-full border ${
          isHero ? "p-3 border-gray-200 shadow-md bg-white" : "p-2 border-gray-200 bg-white"
        }`}
      >
        {/* left icon or add button */}
        <button
          type="button"
          className={`${isHero ? "w-10 h-10 text-xl" : "w-10 h-10"} flex items-center justify-center rounded-full`}
          aria-hidden="true"
        >
          +
        </button>

        <input
          className={`flex-1 bg-transparent outline-none ${isHero ? "px-4 py-3 text-base" : "px-4 py-2 text-sm"}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Input"
        />

        <button
          onClick={() => {
            if (isLoading) {
              if (onCancel) onCancel();
            } else {
              onSubmit();
            }
          }}
          className={`flex items-center justify-center rounded-full ${isHero ? "w-10 h-10" : "w-10 h-10"} bg-gray-100 hover:bg-gray-200`}
          aria-label={isLoading ? "Cancelar" : "Enviar"}
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>

      {isHero ? (
        <p className="text-center text-sm text-gray-500 mt-3">
          Presiona Enter para enviar — vuelve a presionar Enter para detener la respuesta.
        </p>
      ) : null}
    </div>
  );
}
