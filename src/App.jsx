/**
 * App.jsx
 * - Componente raíz de la app de chat que integra el Sidebar, el área de mensajes y el Footer.
 * - Pasos:
 *   1) Importar dependencias, estilos y context
 *   2) Definir AppContent con estado local, filtros y handleSend
 *   3) Exportar App envuelta en ChatProvider y BrowserRouter
 *
 * Nota: este archivo ya llama a sendMsgToGoogleAi. Asegúrate de tener src/googleai.js y VITE_GOOGLE_API_KEY en .env.
 */

import React, { useState, useRef, useContext } from 'react'; // React + hooks (useState/useRef/useContext) - hooks necesarios
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Router SPA - para rutas

// Estilos — ajusta las rutas si usas otros nombres/ubicaciones
import './index.css'; // index.css: estilos globales del proyecto
import './App.css'; // App.css: estilos específicos del componente App

// Contexto y provider
import { ChatContext } from './context/ChatContext'; // ChatContext: contexto para chats
import { ChatProvider } from './context/ChatProvider'; // ChatProvider: proveedor del contexto

// Componentes principales
import Sidebar from './components/Sidebar'; // Sidebar: lista de conversaciones y controles
import ChatMessage from './components/ChatMessage'; // ChatMessage: componente para un mensaje
import ChatFooter from './components/ChatFooter'; // ChatFooter: input, botones de envío
import LoginPage from './pages/LoginPage'; // LoginPage: página de inicio de sesión
import RegisterPage from './pages/RegisterPage'; // RegisterPage: página de registro

// Importamos la función que llama a Google AI Studio (Gemini)
import { sendMsgToGoogleAi } from './googleai'; // sendMsgToGoogleAi: función para Gemini

/**
 * AppContent
 * - Componente con estado local y lógica de envío al modelo.
 */
function AppContent() {
  const [input, setInput] = useState(''); // input: texto actual del input del usuario
  const [isLoading, setIsLoading] = useState(false); // isLoading: indicador cuando esperamos respuesta
  const [searchQuery, setSearchQuery] = useState(''); // searchQuery: texto para filtrar conversaciones
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // isSidebarOpen: controla visibilidad del sidebar
  const chatContainerRef = useRef(null); // chatContainerRef: ref al contenedor de mensajes para scrollear

  // Extraemos messages, setMessages, conversations desde el contexto de la app
  const { messages, setMessages, conversations } = useContext(ChatContext); // messages: array de mensajes, setMessages: setter, conversations: lista de conversaciones

  // toggleSidebar: función que alterna la visibilidad del sidebar
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev); // toggleSidebar: alterna booleano

  // filteredConversations: filtrado por título o contenido de mensajes
  const filteredConversations = (conversations || []).filter(c => {
    const q = (searchQuery || '').toLowerCase(); // q: query en minúsculas para buscar
    if (!q) return true;
    const titleMatch = (c.title || '').toLowerCase().includes(q); // titleMatch: coincide con título
    const messagesMatch = Array.isArray(c.messages) && c.messages.some(m =>
      (m.text || '').toLowerCase().includes(q) // messagesMatch: alguna msg contiene q
    );
    return titleMatch || messagesMatch; // devolver true si coincide
  }); // filteredConversations: conversaciones filtradas

  /**
   * handleSend
   * - Envía el mensaje del usuario a Google AI y actualiza el contexto con la respuesta.
   */
  const handleSend = async () => {
    if (!input.trim()) return; // si input vacío no hacemos nada
    const userInput = input; // userInput: copia del input antes de limpiar
    setInput(''); // limpiar input en UI
    setMessages(prev => [...prev, { type: 'user', text: userInput }]); // agregamos mensaje del usuario al contexto
    setIsLoading(true); // activamos indicador de carga

    try {
      // Llamada a Google AI Studio (Gemini)
      const res = await sendMsgToGoogleAi(userInput); // res: texto devuelto por Gemini
      setMessages(prev => [...prev, { type: 'bot', text: res }]); // agregar respuesta del bot al contexto
    } catch (err) {
      console.error(err); // log del error en consola
      setMessages(prev => [...prev, { type: 'bot', text: 'Ocurrió un error 😢' }]); // mostrar mensaje de error en UI
    }

    setIsLoading(false); // desactivar indicador de carga
    // scrollear al final del contenedor de chats
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight); // scrollea contenedor
  }; // handleSend: envía y procesa respuesta

  // Render del layout principal: sidebar + main (rutas)
  return (
    <div className="App">
      <Sidebar
        isOpen={isSidebarOpen} // isOpen: controla visibilidad
        toggleSidebar={toggleSidebar} // toggleSidebar: función para alternar
        conversations={filteredConversations} // conversations: conversaciones a mostrar
        searchQuery={searchQuery} // searchQuery: valor actual del filtro
        setSearchQuery={setSearchQuery} // setSearchQuery: setter para actualizar el filtro
      />

      <div className={`main ${isSidebarOpen ? '' : 'expanded'}`}> {/* className dinámico para expandir main */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="chats" ref={chatContainerRef}> {/* chats: contenedor de mensajes */}
                  {messages.map((msg, i) => ( // map de mensajes desde el contexto
                    <ChatMessage key={i} msg={msg} /> // ChatMessage: componente para cada mensaje
                  ))}

                  {isLoading && ( // si isLoading true mostramos indicador
                    <div className="chat bot">
                      <div className="txt">Escribiendo respuesta...</div>
                    </div>
                  )}
                </div>

                <ChatFooter
                  input={input} // input: texto en el footer
                  setInput={setInput} // setInput: setter para input
                  handleSend={handleSend} // handleSend: función de envío
                />
              </>
            }
          />
          <Route path="/login" element={<LoginPage />} /> {/* Ruta /login */}
          <Route path="/register" element={<RegisterPage />} /> {/* Ruta /register */}
        </Routes>
      </div>
    </div>
  );
}

/**
 * App
 * - Envuelve AppContent con ChatProvider y BrowserRouter para proveer contexto y rutas.
 */
function App() {
  return (
    <ChatProvider> {/* ChatProvider: envuelve la app y provee estado global */}
      <BrowserRouter> {/* BrowserRouter: manejo de rutas SPA */}
        <AppContent /> {/* AppContent: render principal */}
      </BrowserRouter>
    </ChatProvider>
  );
}

export default App; // export default App

