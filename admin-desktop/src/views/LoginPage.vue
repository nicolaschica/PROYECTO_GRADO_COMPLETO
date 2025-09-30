<template>
  <div class="container d-flex vh-100 justify-content-center align-items-center">
    <div class="card p-4 shadow" style="max-width: 400px; width: 100%;">
      <h3 class="text-center mb-3">Login Admin</h3>
      
      
      
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input 
          v-model="email" 
          type="email" 
          class="form-control" 
          :class="{ 'is-invalid': errorType === 'email' }"
          placeholder="admin@proyecto.com" 
        />
        <div v-if="errorType === 'email'" class="invalid-feedback d-block">
          ❌ Este correo no está registrado en el sistema
        </div>
      </div>
      
      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input 
          v-model="password" 
          type="password" 
          class="form-control" 
          :class="{ 'is-invalid': errorType === 'password' }"
          placeholder="********" 
        />
        <div v-if="errorType === 'password'" class="invalid-feedback d-block">
          ❌ La contraseña es incorrecta
        </div>
      </div>

      <!-- Mensaje de error detallado -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        <strong>{{ errorMessage }}</strong>
      </div>
      
      <button class="btn btn-primary w-100" @click="login" :disabled="loading">
        {{ loading ? "Cargando..." : "Iniciar sesión" }}
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
const errorType = ref(""); // 'email', 'password', o ''
const router = useRouter();

async function login() {
  if (loading.value) return;
  
  // Limpiar errores previos
  errorMessage.value = "";
  errorType.value = "";
  loading.value = true;

  try {
    const res = await window.api.login(email.value, password.value);
    
    console.log("📩 Respuesta del servidor:", res);
    
    if (res.success) {
      console.log("✅ Login exitoso");
      router.push("/reservas");
    } else {
      // Detectar el tipo de error usando errorType del backend
      if (res.errorType === 'email') {
        errorType.value = "email";
        errorMessage.value = res.message || "El correo no está registrado";
        console.error("❌ ERROR: CORREO NO EXISTE");
        console.error("Email ingresado:", email.value);
      } else if (res.errorType === 'password') {
        errorType.value = "password";
        errorMessage.value = res.message || "La contraseña es incorrecta";
        console.error("❌ ERROR: CONTRASEÑA INCORRECTA");
        console.error("Email:", email.value);
        console.error("Password (últimos 2 chars):", "***" + password.value.slice(-2));
        password.value = ""; // Limpiar contraseña incorrecta
      } else {
        // Error genérico (sin errorType)
        errorMessage.value = res.message || "Credenciales incorrectas";
        console.error("❌ ERROR GENÉRICO:", res.message);
        console.error("Email ingresado:", email.value);
        console.error("Password ingresado:", "***" + password.value.slice(-2));
      }
    }
  } catch (err) {
    console.error("💥 Error en login:", err);
    console.error("Detalles:", {
      message: err.message,
      email: email.value
    });
    errorMessage.value = "Error al conectar con el servidor";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  font-weight: 500;
}
</style>