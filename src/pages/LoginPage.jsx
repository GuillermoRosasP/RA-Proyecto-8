/**
 * LoginPage.jsx
 * - Página de "Inicia sesión".
 * - Valida con zod (email, password min 6).
 * - Finge el inicio de sesión; al pasar la validación muestra mensaje y redirige a "/".
 */

import React, { useState } from 'react'; // React + useState
import { z } from 'zod'; // zod para validación
import { useNavigate } from 'react-router-dom'; // useNavigate: para redirigir

// esquema de validación con zod
const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }), // email: debe ser email
  password: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }) // password: min 6
});

export default function LoginPage({ onSuccess }) {
  const navigate = useNavigate(); // navigate: para cambiar ruta
  const [email, setEmail] = useState(''); // email: valor input
  const [password, setPassword] = useState(''); // password: valor input
  const [errors, setErrors] = useState({}); // errors: objeto con errores
  const [loading, setLoading] = useState(false); // loading: indicador

  const handleSubmit = (e) => {
    e.preventDefault(); // prevenir submit por defecto
    setErrors({}); // limpiar errores

    const result = loginSchema.safeParse({ email, password }); // validar con zod
    if (!result.success) {
      // mapear errores a un objeto legible
      const fieldErrors = {};
      result.error.errors.forEach(err => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors); // setErrors: mostrar errores
      return;
    }

    // Simular "login"
    setLoading(true); // loading true
    setTimeout(() => {
      setLoading(false); // loading false
      if (onSuccess) onSuccess(); // opcional callback
      alert('Inicio de sesión simulado — ¡Bienvenido!'); // notificar
      navigate('/'); // redirigir a la ruta raíz (chat)
    }, 900); // simular latencia
  };

  return (
    <main className="auth-page">
      <h1 className="auth-title">Te damos la bienvenida de nuevo</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="inputLabel">Dirección de correo electrónico</label>
        <input className={`auth-input ${errors.email ? 'invalid' : ''}`} type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="ejemplo@correo.com" />
        {errors.email && <div className="fieldError">{errors.email}</div>}

        <label className="inputLabel">Contraseña</label>
        <input className={`auth-input ${errors.password ? 'invalid' : ''}`} type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Contraseña" />
        {errors.password && <div className="fieldError">{errors.password}</div>}

        <button className="bigPrimaryBtn" type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Continuar'}
        </button>

        <p className="smallLink">¿No tienes una cuenta? <a href="/register">Registrarse</a></p>

        <div className="orRow"><span></span><strong>O</strong><span></span></div>

        {/* Botones sociales (inline SVGs) */}
        <div className="socialButtons">
          <button type="button" className="socialBtn"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M21 8.5a8.5 8.5 0 1 0-2.6 6.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>Continuar con Google</button>
          <button type="button" className="socialBtn"> <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><rect x="3" y="3" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2"/></svg>Continuar con una cuenta de Microsoft</button>
          <button type="button" className="socialBtn"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M16 4c-1 1.2-2.8 1.8-4 1.2-0.9-0.4-1.7-0.4-2.6 0C6.7 6.1 6 8.6 6.9 10.4c0.7 1.4 2.3 2.6 4.2 2.6 0.2 0 0.4 0 0.6-0.0 1.1-0.1 2.3 0.3 3.6 0.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Continuar con Apple</button>
          <button type="button" className="socialBtn"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden><path d="M21 10v6a2 2 0 0 1-2 2H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>Continuar con el teléfono</button>
        </div>
      </form>
    </main>
  );
}
