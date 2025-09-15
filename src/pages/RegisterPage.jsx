/** 
 * RegisterPage.jsx
 * 
 * Lógica principal:
 * -----------------
 * 1. Se define un esquema de validación con Zod para email, contraseña y confirmación.
 * 2. Al enviar el formulario:
 *    - Se validan los datos contra el esquema.
 *    - Si hay errores, se muestran debajo de los inputs.
 *    - Si todo es válido, se simula un "registro" con un setTimeout.
 *    - Luego redirige al usuario a la ruta "/".
 * 
 * Pasos del proyecto:
 * -------------------
 * - Paso 1: Definir esquema de validación con Zod.
 * - Paso 2: Definir estados locales (inputs, errores, loading).
 * - Paso 3: Manejar envío del formulario con safeParse.
 * - Paso 4: Mostrar errores dinámicamente si los hay.
 * - Paso 5: Simular registro exitoso y redirigir.
 */

import React, { useState } from 'react';           // Importamos React y hook useState para estados locales
import { z } from 'zod';                          // Importamos Zod para validaciones
import { useNavigate } from 'react-router-dom';   // Importamos useNavigate para redirección

// 📌 Paso 1: Definir el esquema de validación con Zod
const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),                          // Validación de email
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }), // Validación de password (mínimo 6)
  confirm: z.string().min(6)                                                       // Validación de confirmación (mínimo 6)
}).refine(data => data.password === data.confirm, {                                // Refinar: password y confirm deben coincidir
  message: 'Las contraseñas no coinciden', 
  path: ['confirm']                                                                // El error aparecerá en el campo "confirm"
});

// 📌 Componente principal RegisterPage
export default function RegisterPage({ onSuccess }) {
  const navigate = useNavigate();               // Hook de navegación
  const [email, setEmail] = useState('');       // Estado para email
  const [password, setPassword] = useState(''); // Estado para contraseña
  const [confirm, setConfirm] = useState('');   // Estado para confirmación de contraseña
  const [errors, setErrors] = useState({});     // Estado para almacenar errores de validación
  const [loading, setLoading] = useState(false);// Estado de carga al enviar formulario

  // 📌 Paso 3: Función que maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();        // Prevenimos recarga de la página
    setErrors({});             // Reiniciamos errores antes de validar

    // Validamos los datos contra el esquema de Zod
    const result = registerSchema.safeParse({ email, password, confirm });

    // Si la validación falla:
    if (!result.success) {
      const fieldErrors = {};  // Objeto para almacenar errores por campo
      // ✅ FIX: en Zod se accede con "issues", no con "errors"
      result.error.issues.forEach(err => { 
        fieldErrors[err.path[0]] = err.message; // Guardamos el mensaje en el campo correspondiente
      });
      setErrors(fieldErrors);  // Actualizamos estado de errores
      return;                  // Cortamos la ejecución
    }

    // 📌 Paso 5: Si todo es válido, simulamos registro
    setLoading(true);          // Activamos loading
    setTimeout(() => {         // Simulación de API
      setLoading(false);       // Quitamos loading
      if (onSuccess) onSuccess(); // Si existe callback onSuccess, lo ejecutamos
      alert('Registro simulado — cuenta creada'); // Mostramos alerta
      navigate('/');           // Redirigimos al home
    }, 900);                   // 900 ms de delay
  };

  // 📌 Paso 4: Renderizado del formulario
  return (
    <main className="auth-page">{/* Contenedor principal */}
      <h1 className="auth-title">Crear una cuenta</h1>

      {/* Formulario */}
      <form className="auth-form" onSubmit={handleSubmit}>
        
        {/* Input de email */}
        <label className="inputLabel">Dirección de correo electrónico</label>
        <input 
          className={`auth-input ${errors.email ? 'invalid' : ''}`} // Clase condicional si hay error
          type="email" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)}                 // Actualizamos estado
          placeholder="ejemplo@correo.com" 
        />
        {errors.email && <div className="fieldError">{errors.email}</div>} {/* Mensaje de error */}

        {/* Input de contraseña */}
        <label className="inputLabel">Contraseña</label>
        <input 
          className={`auth-input ${errors.password ? 'invalid' : ''}`} 
          type="password" 
          value={password} 
          onChange={(e)=>setPassword(e.target.value)} 
          placeholder="Contraseña" 
        />
        {errors.password && <div className="fieldError">{errors.password}</div>}

        {/* Input de confirmación */}
        <label className="inputLabel">Confirmar contraseña</label>
        <input 
          className={`auth-input ${errors.confirm ? 'invalid' : ''}`} 
          type="password" 
          value={confirm} 
          onChange={(e)=>setConfirm(e.target.value)} 
          placeholder="Repite la contraseña" 
        />
        {errors.confirm && <div className="fieldError">{errors.confirm}</div>}

        {/* Botón principal */}
        <button className="bigPrimaryBtn" type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Continuar'}
        </button>

        {/* Link a login */}
        <p className="smallLink">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </p>

        {/* Separador "O" */}
        <div className="orRow"><span></span><strong>O</strong><span></span></div>

        {/* Botones sociales */}
        <div className="socialButtons">

          {/* Google */}
          <button type="button" className="socialBtn"> 
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M21 8.5a8.5 8.5 0 1 0-2.6 6.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Continuar con Google
          </button>

          {/* Microsoft */}
          <button type="button" className="socialBtn"> 
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <rect x="3" y="3" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            Continuar con una cuenta de Microsoft
          </button>

          {/* Apple */}
          <button type="button" className="socialBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M16 4c-1 1.2-2.8 1.8-4 1.2-0.9-0.4-1.7-0.4-2.6 0C6.7 6.1 6 8.6 6.9 10.4c0.7 1.4 2.3 2.6 4.2 2.6 0.2 0 0.4 0 0.6-0.0 1.1-0.1 2.3 0.3 3.6 0.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Continuar con Apple
          </button>

          {/* Teléfono */}
          <button type="button" className="socialBtn">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              <path d="M21 10v6a2 2 0 0 1-2 2H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Continuar con el teléfono
          </button>
        </div>
      </form>
    </main>
  );
}
