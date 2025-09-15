/**
 * Componente ModalBienvenida
 * Lógica:
 * - Se muestra cuando el usuario hace click en "Continuar".
 * - Contiene un mensaje "Bienvenido" con gradiente.
 * - Incluye un botón "Ir a chat" que activa un spinner y redirige.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ModalBienvenida = ({ visible, onClose }) => {
  // Estado para mostrar el spinner de carga
  const [loading, setLoading] = useState(false); // loading = indica si el spinner está activo
  const navigate = useNavigate(); // Hook para redirigir a otra ruta

  if (!visible) return null; // Si no está activo, no renderizar nada

  // Maneja el click en "Ir a chat"
  const handleIrChat = () => {
    setLoading(true); // Activar spinner
    setTimeout(() => {
      setLoading(false);
      onClose(); // Cierra el modal
      navigate("/chat"); // Redirigir a la página del chat
    }, 2000); // Espera 2 segundos antes de redirigir
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      {/* Contenedor del modal */}
      <div className="bg-gradient-to-r from-pink-400 via-pink-200 to-white p-8 rounded-2xl shadow-2xl text-center w-96">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido</h2>

        {/* Botón para ir al chat */}
        <button
          onClick={handleIrChat}
          disabled={loading}
          className="bg-pink-500 text-white px-6 py-2 rounded-xl shadow-md hover:bg-pink-600 transition disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Cargando...
            </span>
          ) : (
            "Ir a chat"
          )}
        </button>
      </div>
    </div>
  );
};

export default ModalBienvenida;
