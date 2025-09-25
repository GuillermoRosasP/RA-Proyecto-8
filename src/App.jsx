
import React, { useState, useRef, useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ChatProvider } from "./context/ChatProvider";
import { ChatContext } from "./context/ChatContext";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import InputBar from "./components/InputBar"; // input unificado
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { sendMsgToGoogleAi } from "./googleai"; // acepta signal para abortar

export default function App() {
  return (
    <ChatProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ChatProvider>
  );
}

function LoadingDots() {
  // Componente simple con keyframes inline para que funcione sin tocar tailwind config
  return (
    <>
      <style>{`
        @keyframes dots {
          0% { transform: translateY(0); opacity: 0.25; }
          20% { transform: translateY(-4px); opacity: 1; }
          40% { transform: translateY(0); opacity: 0.25; }
          100% { transform: translateY(0); opacity: 0.25; }
        }
      `}</style>
      <span className="inline-flex items-center gap-1">
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "#374151", animation: "dots 1s linear infinite", animationDelay: "0s" }} />
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "#374151", animation: "dots 1s linear infinite", animationDelay: "0.15s" }} />
        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 999, background: "#374151", animation: "dots 1s linear infinite", animationDelay: "0.3s" }} />
      </span>
    </>
  );
}

function AppContent() {
  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showHero, setShowHero] = useState(true); // true = pantalla inicial centrada (hero visible)
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false); // true mientras esperamos la respuesta completa
  const [isTyping, setIsTyping] = useState(false); // true mientras "typewriter" está escribiendo la respuesta
  const [searchQuery, setSearchQuery] = useState("");

  // Refs y contexto
  const chatContainerRef = useRef(null);
  const abortControllerRef = useRef(null); // controla fetch
  const typingIntervalRef = useRef(null); // controla typewriter interval
  const { messages, setMessages, conversations } = useContext(ChatContext);

  // Auto-minimiza sidebar en pantallas pequeñas
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth < 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);

  // Scroll helper (suave)
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 80);
  };

  // Al iniciar nuevo chat desde Sidebar: mostramos HERO y limpiamos input
  const handleStartNewChat = () => {
    setShowHero(true);
    setInput("");
    // opcional: limpio mensajes en el provider? Eso lo hace ctx.handleNewChat en Sidebar
    setTimeout(() => {
      if (chatContainerRef.current) chatContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }, 120);
  };

  // ======================
  // Envío + "Esperando respuesta" + Typewriter
  // ======================
  const handleSend = async () => {
    if (!input.trim()) return;

    // Si hero visible, lo ocultamos (suavemente) para mostrar chat
    if (showHero) setShowHero(false);

    const userInput = input;
    setInput("");
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, type: "user", text: userInput }]);

    // Preparamos cancelación y estado "esperando"
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsWaiting(true);
    setIsTyping(false);

    try {
      // llamada a la API (acepta signal); si no tienes acceso mockea con delay
      const resText = await sendMsgToGoogleAi(userInput, controller.signal);

      // Llegó la respuesta completa -> dejamos esperar un pelín y empezamos "typewriter"
      setIsWaiting(false);

      // Insertamos un mensaje bot vacío que iremos llenando
      const botMsgId = `b-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      setMessages((prev) => [...prev, { id: botMsgId, type: "bot", text: "" }]);

      // Typewriter: revelar carácter a carácter
      setIsTyping(true);
      const fullText = String(resText);
      const speedPerChar = 18; // ms por carácter (ajusta para más/fuera velocidad)
      let i = 0;

      // Limpia cualquier typing previo
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }

      // Usamos setInterval para escribir en pantalla; guardamos en ref para poder cancelarlo
      typingIntervalRef.current = setInterval(() => {
        i++;
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, text: fullText.slice(0, i) } : m))
        );

        // Cuando terminamos el texto, limpiamos interval
        if (i >= fullText.length) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setIsTyping(false);
          // Scroll final
          scrollToBottom();
        }
      }, speedPerChar);

      // pequeño scroll inicial mientras escribe
      scrollToBottom();
    } catch (err) {
      // Si la petición fue abortada por el usuario, sendMsgToGoogleAi debería lanzar AbortError
      setIsWaiting(false);
      setIsTyping(false);
      if (err.name === "AbortError") {
        // Mensaje que indique que se canceló
        setMessages((prev) => [...prev, { id: `b-canceled-${Date.now()}`, type: "bot", text: "⏹️ Respuesta detenida por el usuario." }]);
      } else {
        console.error("Error en sendMsgToGoogleAi:", err);
        setMessages((prev) => [...prev, { id: `b-err-${Date.now()}`, type: "bot", text: "Ocurrió un error al conectar con el servicio." }]);
      }
    } finally {
      // Limpieza: abortController ref y typing interval se manejan según sea cancelado
      abortControllerRef.current = null;
      // si aún había typing, no tocarlo (lo limpia el interval cuando termina)
    }
  };

  // Cancelar petición en curso (y detener typewriter si está en curso)
  const handleCancel = () => {
    // Abort fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // Detener typewriter si está escribiendo
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setIsWaiting(false);
    setIsTyping(false);
    // Optional: show a bot note about cancellation (handled by catch of sendMsgToGoogleAi)
  };

  // Clase para empujar main cuando sidebar está fija (md+)
  const mainMarginClass = isSidebarOpen ? "md:ml-64" : "md:ml-16";

  return (
    <div className="App min-h-screen bg-white">
      {/* Sidebar fija: ahora recibe onNewChat para restaurar el hero */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        conversations={conversations}
        onNewChat={handleStartNewChat}
      />

      {/* Main: en pantallas md+ deja margen según ancho de sidebar; en móvil ml=0 */}
      <div className={`main flex-1 transition-all duration-700 ${mainMarginClass}`}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* HERO (barra grande centrada). Visible sólo si showHero === true */}
                {showHero && (
                  <div
                    className="w-full flex items-center justify-center"
                    style={{ height: "calc(100vh - 4rem)" }}
                  >
                    <div className="max-w-3xl w-full text-center px-6">
                      <h1 className="text-3xl md:text-4xl font-medium mb-8">¿En qué estás trabajando?</h1>

                      <div
                        // añadimos una pequeña transición adicional: slide + fade
                        className="transform transition-transform duration-700 ease-in-out"
                        style={{ transform: showHero ? "translateY(0)" : "translateY(-8px)" }}
                      >
                        <InputBar
                          mode="hero"
                          value={input}
                          onChange={setInput}
                          onSubmit={handleSend}
                          isLoading={isWaiting || isTyping}
                          onCancel={handleCancel}
                          placeholder="Pregunta lo que quieras"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Si showHero === false montamos TODO el chat (mensajes + footer).
                    Si showHero === true, NADA relacionado con chat/footer está montado. */}
                {!showHero && (
                  <>
                    <div
                      className="chats w-full max-w-5xl mx-auto p-6 flex flex-col gap-6 transition-all duration-500"
                      ref={chatContainerRef}
                      style={{ height: "calc(100vh - 8rem)", overflowY: "auto" }}
                    >
                      {messages.map((msg, i) => (
                        <ChatMessage key={msg.id ?? i} msg={msg} />
                      ))}

                      {/* While waiting for the API result (before typewriter begins) show an explicit waiting row */}
                      {isWaiting && !isTyping && (
                        <div className="w-full flex items-center gap-3 text-sm text-gray-600">
                          <div className="px-3 py-2 rounded-full bg-gray-50 border border-gray-100">🤖</div>
                          <div>
                            <strong>Esperando respuesta</strong>
                            <span className="ml-2"><LoadingDots /></span>
                          </div>
                        </div>
                      )}

                      {/* If typing is active, we let the typewriter fill the last bot message,
                          the typewriter already updates the messages array progressively. */}
                    </div>

                    <div className="w-full flex justify-center">
                      <div className="w-full max-w-5xl">
                        <InputBar
                          mode="footer"
                          value={input}
                          onChange={setInput}
                          onSubmit={handleSend}
                          isLoading={isWaiting || isTyping}
                          onCancel={handleCancel}
                          placeholder="Pregunta lo que quieras"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
}
