
/**
 *
 * Lógica principal:
 * - Barra lateral con vista expandida y minimizada.
 * - En vista minimizada (isOpen = false) SOLO se muestran: los 3 iconos superiores (Chat, Buscar, Nuevo)
 *   y los 2 botones del footer (Inicia sesión / Regístrate). El historial y el listado NO se muestran.
 * - Footer fijo abajo y centrado; los iconos minimizados quedan centrados en la parte superior.
 *
 * Pasos realizados:
 * 1. Separé claramente la vista expandida y minimizada usando el ternario principal.
 * 2. El listado de conversaciones solo se renderiza en modo expandido (isOpen === true).
 * 3. Ajusté clases Tailwind para centrar los iconos minimizados (`items-center`, `mt-4`) y para centrar el footer (`items-center`).
 * 4. Mantengo la búsqueda funcional y el resto de handlers para compatibilidad con tu contexto actual.
 */

import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChatContext } from "../context/ChatContext";
import "../app.css";
import {
  FiSearch,
  FiPlus,
  FiLogIn,
  FiUserPlus,
  FiTrash2,
} from "react-icons/fi";
import { SiOpenai } from "react-icons/si";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
  conversations = [],
  onNewChat,
}) => {
  const navigate = useNavigate();
  const ctx = useContext(ChatContext);

  const isControlled = typeof setSearchQuery === "function";
  const [internalQuery, setInternalQuery] = useState(searchQuery || "");

  useEffect(() => {
    if (!isControlled) return;
    setInternalQuery(searchQuery || "");
  }, [searchQuery, isControlled]);

  const inputValue = isControlled ? searchQuery || "" : internalQuery;

  const onSearchChange = (e) => {
    const val = e.target.value;
    if (isControlled) setSearchQuery(val);
    else setInternalQuery(val);
  };

  const performSearch = () => {
    const q = (inputValue || "").trim();
    if (isControlled) setSearchQuery(q);
    else setInternalQuery(q);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === "Enter") performSearch();
  };

  const filteredConversations = useMemo(() => {
    const q = (inputValue || "").trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((conv) => {
      const title = (conv.title || "").toString().toLowerCase();
      const snippet = (conv.snippet || "").toString().toLowerCase();
      return title.includes(q) || snippet.includes(q);
    });
  }, [conversations, inputValue]);

  const handleNewChatAndNavigate = () => {
    if (!isOpen) {
      toggleSidebar();
      return;
    }
    if (ctx?.handleNewChat) ctx.handleNewChat();
    if (typeof onNewChat === "function") onNewChat();
    navigate("/");
  };

  const loadConversationAndNavigate = (id) => {
    if (ctx?.loadConversation) ctx.loadConversation(id);
    navigate("/");
  };

  const deleteConversationAndKeepView = (id) => {
    if (ctx?.deleteConversation) ctx.deleteConversation(id);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 bg-gray-100 text-gray-900 ${
        isOpen ? "w-64 p-4" : "w-16 p-2"
      }`}
      aria-label="Sidebar"
    >
      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 min-h-0">
        {isOpen ? (
          // --- VISTA EXPANDIDA ---
          <>
            <div className="flex items-center gap-3 p-2">
              <button
                className="flex items-center gap-3 bg-transparent border-0 p-0"
                onClick={handleNewChatAndNavigate}
                aria-label="Nuevo chat"
                title="Nuevo chat"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white">
                  <SiOpenai className="w-6 h-6 text-black" />
                </div>
                <span className="text-lg font-medium">ChatGPT</span>
              </button>

              <button
                className="ml-auto bg-transparent border-0 text-xl p-1 rounded hover:bg-gray-200"
                onClick={toggleSidebar}
                aria-label="Ocultar barra lateral"
                title="Ocultar barra"
              >
                «
              </button>
            </div>

            <button
              className="flex items-center gap-3 bg-white text-gray-900 rounded-md p-3 w-full mt-4 hover:bg-gray-200"
              onClick={handleNewChatAndNavigate}
              title="Nuevo chat"
            >
              <FiPlus className="w-6 h-6" />
              <span className="font-medium">New Chat</span>
            </button>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={onSearchChange}
                onKeyDown={onSearchKeyDown}
                placeholder="Buscar en chats..."
                className="flex-1 p-2 rounded-md bg-gray-200 border border-gray-300 text-gray-900 placeholder-gray-600"
                aria-label="Buscar en chats"
              />
              <button
                onClick={performSearch}
                className="p-2 rounded-md hover:bg-gray-200"
                aria-label="Buscar"
                title="Buscar"
              >
                <FiSearch className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pb-2">
              <strong className="text-sm text-gray-600">Historial</strong>
            </div>

            {/* Lista de conversaciones (solo en expandido) */}
            <div className="mt-2 flex-1 overflow-y-auto space-y-2 sidebar-scroll">
              {filteredConversations?.length === 0 ? (
                <div className="text-sm text-gray-500 p-2">No hay conversaciones guardadas</div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-200 cursor-pointer"
                  >
                    <div
                      className="flex-1"
                      onClick={() => loadConversationAndNavigate(conv.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") loadConversationAndNavigate(conv.id);
                      }}
                    >
                      <div className="font-medium truncate">{conv.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(conv.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="ml-2">
                      <button
                        className="text-xl p-1 rounded hover:bg-gray-200"
                        aria-label="Borrar conversación"
                        onClick={() => deleteConversationAndKeepView(conv.id)}
                        title="Borrar conversación"
                      >
                        <FiTrash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          // --- VISTA MINIMIZADA: SOLO 3 ICONOS SUPERIORES (centrados) ---
          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              onClick={handleNewChatAndNavigate}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-md hover:bg-gray-200"
              aria-label="Chat / Expandir barra"
              title="Abrir chat"
            >
              <SiOpenai className="w-6 h-6 text-black" />
            </button>

            <button
              onClick={() => {
                // al hacer click en buscar cuando está minimizado, abrimos la barra para mostrar el input
                toggleSidebar();
              }}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-md hover:bg-gray-200"
              aria-label="Buscar"
              title="Buscar"
            >
              <FiSearch className="w-6 h-6 text-black" />
            </button>

            <button
              onClick={() => {
                // si está minimizada, abrirla y luego crear nuevo chat para UX rápida
                toggleSidebar();
                // pequeña espera para que el sidebar abra antes de crear el chat
                setTimeout(() => {
                  if (ctx?.handleNewChat) ctx.handleNewChat();
                  if (typeof onNewChat === "function") onNewChat();
                  navigate("/");
                }, 120);
              }}
              className="w-12 h-12 flex items-center justify-center bg-teal-600 rounded-md hover:bg-teal-500"
              aria-label="Nuevo chat"
              title="Nuevo chat"
            >
              <FiPlus className="w-6 h-6 text-white" />
            </button>
          </div>
        )}
      </div>

      {/* FOOTER: siempre visible, centrado en minimizado */}
      <div className="mt-auto flex flex-col items-center gap-2 p-3 border-t border-gray-200 bg-transparent flex-shrink-0">
        <Link
          to="/login"
          className={`flex items-center justify-center gap-2 p-3 rounded ${
            isOpen ? "w-full bg-white text-gray-900" : "w-12 h-12 bg-white text-gray-900"
          } hover:bg-gray-200 font-semibold`}
        >
          {isOpen ? "Inicia sesión" : <FiLogIn className="w-6 h-6" />}
        </Link>

        <Link
          to="/register"
          className={`flex items-center justify-center gap-2 p-3 rounded ${
            isOpen
              ? "w-full bg-gray-900 text-white"
              : "w-12 h-12 bg-white text-gray-900"
          } hover:bg-gray-800 font-semibold`}
        >
          {isOpen ? "Regístrate" : <FiUserPlus className="w-6 h-6" />}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
