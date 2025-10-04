<template>
  <div class="register-wrapper min-vh-100 d-flex align-items-center justify-content-center">
    <div class="register-card shadow-lg border-0 d-flex flex-column flex-md-row overflow-hidden">
      <!-- Panel izquierdo -->
      <div class="register-panel-left d-flex flex-column justify-content-center p-5 position-relative text-white">
        <div class="blob blob1"></div>
        <div class="blob blob2"></div>
        <h2 class="fw-bold mb-3">¡Bienvenido de nuevo!</h2>
        <p class="mb-4">¿Ya tienes una cuenta? Inicia sesión aquí y conéctate con nosotros</p>
        <button @click="$router.push('/login')" class="btn btn-outline-light btn-lg rounded-pill">
          ← Iniciar sesión
        </button>
      </div>

      <!-- Panel derecho -->
      <div class="register-panel-right p-5 d-flex align-items-center justify-content-center">
        <div style="width: 100%; max-width: 400px;">
          <form @submit.prevent="register">
            <h2 class="text-center text-dark mb-4 fw-bold">Registro</h2>

            <div class="form-floating mb-4">
              <input
                id="name"
                type="text"
                class="form-control custom-input"
                v-model="name"
                placeholder="Nombre de usuario"
                required
              />
              <label for="name">Nombre de usuario</label>
            </div>

            <div class="form-floating mb-4">
              <input
                id="email"
                type="email"
                class="form-control custom-input"
                v-model="email"
                placeholder="Correo electrónico"
                required
              />
              <label for="email">Correo electrónico</label>
            </div>

            <div class="form-floating mb-4">
              <input
                id="password"
                type="password"
                class="form-control custom-input"
                v-model="password"
                placeholder="Contraseña"
                required
              />
              <label for="password">Contraseña</label>
            </div>

            <div class="d-grid">
              <button type="submit" class="btn btn-primary btn-lg rounded-pill fw-bold">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    if (password.value.length < 6) {
      return Swal.fire({
        icon: 'warning',
        title: 'Contraseña débil',
        text: 'La contraseña debe tener mínimo 6 caracteres'
      })
    }

    const res = await axios.post('http://localhost:3000/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    if (res.data.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada',
        timer: 2000,
        showConfirmButton: false
      })
      router.push('/login')
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'El correo ya existe',
        text: 'Por favor usa otro'
      })
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.response?.data?.message || 'Hubo un problema al registrar'
    })
  }
}
</script>

<style scoped>
/* Fondo gris claro */
.register-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f2f2f2;
}

/* Card */
.register-card {
  background-color: white;
  border-radius: 0.5rem;
  display: flex;
  width: 90%;
  max-width: 900px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.15);
  transition: transform 0.3s ease;
}

.register-card:hover {
  transform: translateY(-5px);
}

/* Panel izquierdo con degradado y blobs */
.register-panel-left {
  flex: 1;
  background: linear-gradient(135deg, #3b82f6, #0d6efd);
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  animation: float 6s ease-in-out infinite;
}

.blob1 { width: 150px; height: 150px; top: 20%; left: 10%; }
.blob2 { width: 100px; height: 100px; bottom: 10%; right: 15%; animation-delay: 3s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(45deg); }
}

/* Panel derecho */
.register-panel-right {
  flex: 1;
  background-color: white;
}

/* Inputs y botones */
.custom-input {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  padding: 12px 15px;
  transition: all 0.3s ease;
}

.custom-input:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13,110,253,0.25);
}

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
}

.btn-outline-light {
  border-color: #fff;
  color: #fff;
}

.btn-outline-light:hover {
  background-color: #fff;
  color: #0d6efd;
  transform: translateY(-2px);
}

/* Responsivo */
@media (max-width: 768px) {
  .register-card {
    flex-direction: column;
  }
  .register-panel-left, .register-panel-right {
    flex: unset;
    width: 100%;
    text-align: center;
  }
}
</style>
