<template>
  <div class="login-wrapper d-flex vh-100 justify-content-center align-items-center bg-light-custom">
    <div class="login-card shadow-lg">
      <h2 class="text-center mb-4 fw-bold">Iniciar Sesión</h2>

      <!-- Email Input -->
      <div class="form-floating mb-3">
        <input
          v-model="email"
          type="email"
          class="form-control border-0 border-bottom border-2 rounded-0 bg-transparent custom-input"
          placeholder="Correo electrónico"
          :class="{ 'is-invalid': errorType === 'email' }"
        />
        <label>Correo electrónico</label>
        <div v-if="errorType === 'email'" class="invalid-feedback d-block">
          ❌ Este correo no está registrado en el sistema
        </div>
      </div>

      <!-- Password Input -->
      <div class="form-floating mb-3">
        <input
          v-model="password"
          type="password"
          class="form-control border-0 border-bottom border-2 rounded-0 bg-transparent custom-input"
          placeholder="Contraseña"
          :class="{ 'is-invalid': errorType === 'password' }"
        />
        <label>Contraseña</label>
        <div v-if="errorType === 'password'" class="invalid-feedback d-block">
          ❌ La contraseña es incorrecta
        </div>
      </div>

      <!-- Mensaje de error general -->
      <div v-if="errorMessage" class="alert alert-danger mt-2" role="alert">
        <strong>{{ errorMessage }}</strong>
      </div>

      <!-- Botón de login -->
      <button class="btn btn-primary btn-lg w-100 mt-3" @click="login" :disabled="loading">
        {{ loading ? "Cargando..." : "Ingresar" }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const errorType = ref("");
const router = useRouter();

async function login() {
  if (loading.value) return;

  errorMessage.value = "";
  errorType.value = "";
  loading.value = true;

  try {
    const res = await window.api.login(email.value, password.value);

    if (res.success) {
      router.push("/reservas");
    } else {
      if (res.errorType === 'email') {
        errorType.value = "email";
        errorMessage.value = res.message || "El correo no está registrado";
      } else if (res.errorType === 'password') {
        errorType.value = "password";
        errorMessage.value = res.message || "La contraseña es incorrecta";
        password.value = "";
      } else {
        errorMessage.value = res.message || "Credenciales incorrectas";
      }
    }
  } catch (err) {
    errorMessage.value = "Error al conectar con el servidor";
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* Fondo claro coherente con Home */
.bg-light-custom {
  background-color: #f8f9fa;
}

/* Tarjeta central */
.login-card {
  background: white;
  border-radius: 1rem;
  padding: 3rem 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
}

/* Inputs flotantes al estilo del login normal */
.custom-input {
  padding: 12px 0 8px 0 !important;
}

.custom-input:focus {
  border-color: #3b82f6 !important;
  box-shadow: none !important;
}

.form-floating > label {
  color: #888 !important;
}

.form-floating > .custom-input:focus ~ label,
.form-floating > .custom-input:not(:placeholder-shown) ~ label {
  color: #3b82f6 !important;
}

/* Botón principal */
.btn-primary {
  background-color: #3b82f6;
  border-color: #3b82f6;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #1e5fc0;
  border-color: #1e5fc0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Mensajes de error */
.is-invalid {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 0.15rem rgba(220,53,69,0.25) !important;
}

.invalid-feedback {
  font-weight: 500;
  font-size: 0.9rem;
}
</style>
