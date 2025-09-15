

import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import gptLogo from "../assets/chatgpt.svg";
import addBtn from "../assets/add-30.png";
import { ChatContext } from "../context/ChatContext";

const Sidebar = ({
    isOpen,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    conversations
}) => {
    const navigate = useNavigate();
    const ctx = useContext(ChatContext);

    // Crear nuevo chat y navegar al chat principal
    const handleNewChatAndNavigate = () => {
        if (ctx?.handleNewChat) ctx.handleNewChat();
        navigate("/");
    };

    // Cargar conversación específica y navegar
    const loadConversationAndNavigate = (id) => {
        if (ctx?.loadConversation) ctx.loadConversation(id);
        navigate("/");
    };

    // Borrar conversación
    const deleteConversationAndKeepView = (id) => {
        if (ctx?.deleteConversation) ctx.deleteConversation(id);
    };

    // Ejecutar búsqueda por lupa/Enter (normaliza espacios)
    const performSearch = () => {
        const q = (searchQuery || "").trim();
        setSearchQuery(q);
    };

    // Cambios en el input -> filtrado en vivo
    const onSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Enter también dispara performSearch
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") performSearch();
    };

    // Texto del tooltip según estado abierto/colapsado
    const tooltipText = isOpen
        ? "Click para nuevo chat • Ctrl/Cmd + B para ocultar"
        : "Click para nuevo chat • Ctrl/Cmd + B para mostrar";

    // Render
    return (
        <aside className={`sideBar ${isOpen ? "open" : "collapsed"}`}>
            <div className="upperSide">
                <div className="upperSideTop">
                    <button
                        className="logoBtn"
                        onClick={handleNewChatAndNavigate}
                        aria-label="Nuevo chat"
                        title="Nuevo chat"
                    >
                        <img src={gptLogo} alt="logo" className="logo" />
                        <span className="logoTooltip" role="status" aria-hidden="true">{tooltipText}</span>
                    </button>

                    <span className="brand">{isOpen && "ChatGPT"}</span>

                    <button
                        className="collapseBtn"
                        onClick={toggleSidebar}
                        aria-pressed={isOpen}
                        aria-label={isOpen ? "Ocultar barra lateral" : "Mostrar barra lateral"}
                    >
                        {isOpen ? "«" : "»"}
                    </button>
                </div>

                <button className="midBtn" onClick={handleNewChatAndNavigate}>
                    <img src={addBtn} alt="new chat" className="addBtn" />
                    {isOpen && <span className="midBtnText">New Chat</span>}
                </button>

                <div className="searchChatsWrapper" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <input
                        type="text"
                        className="searchChats"
                        placeholder="Buscar en chats..."
                        value={searchQuery}
                        onChange={onSearchChange}
                        onKeyDown={onSearchKeyDown}
                        aria-label="Buscar chats"
                    />
                    <button
                        type="button"
                        className="searchBtn"
                        onClick={performSearch}
                        aria-label="Buscar"
                        title="Buscar"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                {conversations.length > 0 && (
                    <div className="history-header">
                        {isOpen && <strong className="history-title-header">Historial</strong>}
                    </div>
                )}

                <div className="history-list" role="list">
                    {conversations.length === 0 && isOpen && (
                        <div className="no-history">No hay conversaciones guardadas</div>
                    )}

                    {conversations.map((conv) => (
                        <div className="history-item" key={conv.id} role="listitem">
                            <div
                                className="history-item-main"
                                onClick={() => loadConversationAndNavigate(conv.id)}
                                tabIndex={0}
                                onKeyDown={(e) => { if (e.key === "Enter") loadConversationAndNavigate(conv.id); }}
                            >
                                {isOpen && <div className="history-title">{conv.title}</div>}
                                {isOpen && <div className="history-meta">{new Date(conv.createdAt).toLocaleString()}</div>}
                            </div>

                            <div className="history-actions">
                                <button
                                    className="three-dots"
                                    aria-label="Más opciones"
                                    onClick={() => deleteConversationAndKeepView(conv.id)}
                                    title="Borrar conversación"
                                >
                                    ⋯
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lowerSide">
                <div className="authWrapper">
                    <Link to="/login" className="authBtn loginBtn" aria-label="Inicia sesión">
                        {isOpen ? (
                            <span>Inicia sesión</span>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        )}
                    </Link>

                    <Link to="/register" className="authBtn registerBtn" aria-label="Regístrate">
                        {isOpen ? (
                            <span>Regístrate</span>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="20" y1="8" x2="20" y2="14" />
                                <line x1="17" y1="11" x2="23" y2="11" />
                            </svg>
                        )}
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;