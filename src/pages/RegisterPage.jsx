
// Lógica principal:
// - Formulario de registro con React Hook Form + Zod.
// - Valida email, password >=6 y confirmación.
// - Simula registro y redirige a /.

import React from "react";
import { useForm } from "react-hook-form"; // Importamos RHF
import { z } from "zod"; // Validaciones
import { zodResolver } from "@hookform/resolvers/zod"; // Para conectar Zod con RHF
import { useNavigate } from "react-router-dom";

// 📌 Definimos esquema de validación
const registerSchema = z
  .object({
    email: z.string().email({ message: "Email inválido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirm: z.string().min(6, { message: "La confirmación debe tener al menos 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

export default function RegisterPage({ onSuccess }) {
  const navigate = useNavigate();

  // 📌 Inicializamos useForm con Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // eslint-disable-next-line no-unused-vars
  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 900)); // Simula carga
    if (onSuccess) onSuccess();
    alert("Registro simulado — cuenta creada");
    navigate("/");
  };

  return (
    <main className="flex flex-col items-center p-8 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Crear una cuenta</h1>

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

        {/* Confirmación */}
        <label className="text-sm">Confirmar contraseña</label>
        <input
          className={`w-full p-4 rounded-full border ${errors.confirm ? "border-red-500" : "border-gray-200"}`}
          type="password"
          placeholder="Repite la contraseña"
          {...register("confirm")}
        />
        {errors.confirm && <div className="text-sm text-red-600">{errors.confirm.message}</div>}

        {/* Botón */}
        <button
          className="mt-2 w-full p-3 rounded-full bg-black text-white font-medium"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cargando..." : "Continuar"}
        </button>

        <p className="text-center text-sm mt-2">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600">
            Inicia sesión
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
