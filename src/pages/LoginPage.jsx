
// Lógica principal:
// - Formulario de login con React Hook Form + Zod.
// - Valida email y password >=6.
// - Simula inicio de sesión y redirige a /.

import React from "react";
import { useForm } from "react-hook-form"; // Importamos React Hook Form
import { z } from "zod"; // Para validaciones
import { zodResolver } from "@hookform/resolvers/zod"; // Para conectar Zod con RHF
import { useNavigate } from "react-router-dom";

// 📌 Definimos el esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export default function LoginPage({ onSuccess }) {
  const navigate = useNavigate();

  // 📌 Inicializamos useForm con Zod
  const {
    register, // para conectar inputs
    handleSubmit, // para manejar el submit
    formState: { errors, isSubmitting }, // errores y estado de carga
  } = useForm({
    resolver: zodResolver(loginSchema), // conecta con Zod
  });

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 900)); // Simulación de carga
    if (onSuccess) onSuccess();
    alert("Inicio de sesión simulado — ¡Bienvenido!");
    navigate("/");
  };

  return (
    <main className="flex flex-col items-center p-8 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Te damos la bienvenida de nuevo
      </h1>

      <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <label className="text-sm">Dirección de correo electrónico</label>
        <input
          className={`w-full p-4 rounded-full border ${errors.email ? "border-red-500" : "border-gray-200"}`}
          type="email"
          placeholder="ejemplo@correo.com"
          {...register("email")}
        />
        {errors.email && <div className="text-sm text-red-600">{errors.email.message}</div>}

        {/* Password */}
        <label className="text-sm">Contraseña</label>
        <input
          className={`w-full p-4 rounded-full border ${errors.password ? "border-red-500" : "border-gray-200"}`}
          type="password"
          placeholder="Contraseña"
          {...register("password")}
        />
        {errors.password && <div className="text-sm text-red-600">{errors.password.message}</div>}

        {/* Botón */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full p-3 rounded-full bg-black text-white font-medium"
        >
          {isSubmitting ? "Cargando..." : "Continuar"}
        </button>

        <p className="text-center text-sm mt-2">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-600">
            Registrarse
          </a>
        </p>

        {/* Separador */}
        <div className="flex items-center gap-4 my-3">
          <span className="flex-1 h-px bg-gray-200"></span>
          <strong className="text-sm text-gray-600">O</strong>
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        {/* Botones sociales */}
        <div className="flex flex-col gap-2">
          <button type="button" className="w-full p-3 rounded-full border border-gray-200 text-left">
            Continuar con Google
          </button>
          <button type="button" className="w-full p-3 rounded-full border border-gray-200 text-left">
            Continuar con Microsoft
          </button>
          <button type="button" className="w-full p-3 rounded-full border border-gray-200 text-left">
            Continuar con Apple
          </button>
          <button type="button" className="w-full p-3 rounded-full border border-gray-200 text-left">
            Continuar con el teléfono
          </button>
        </div>
      </form>
    </main>
  );
}
