<template>
  <div class="profile-wrapper min-vh-100 d-flex flex-column">
    <!-- Navbar (igual que Home) -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div class="container-fluid px-4">
        <a class="navbar-brand fw-bold text-primary fs-4" href="#">
          <i class="bi bi-geo-alt-fill me-2"></i>Tu Mesa a un solo click
        </a>

        <button 
          class="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <i class="bi bi-list fs-3 text-primary"></i>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav align-items-center gap-2">
            <li class="nav-item">
              <button class="btn btn-outline-primary btn-sm rounded-pill" @click="goProfile">
                <i class="bi bi-person-circle me-1"></i> Perfil
              </button>
            </li>
            <li class="nav-item">
              <button class="btn btn-primary btn-sm rounded-pill" @click="irhome">
                <i class="bi bi-box-arrow-right me-1"></i> Volver
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow-1 d-flex align-items-center justify-content-center bg-light-custom py-5 mt-5">
      <div class="profile-card text-center p-5 shadow-sm">
        <h1 class="mb-4">Bienvenido, {{ user?.name || user?.email }}</h1>
        <div class="d-flex flex-column gap-3">
          <button @click="goProfileInfo" class="btn btn-primary btn-lg rounded-pill">
            Mi información personal
          </button>
          <button @click="viewreserva" class="btn btn-outline-primary btn-lg rounded-pill">
            Ver mis reservas
          </button>
        </div>
      </div>
    </main>

    <!-- Footer (igual que Home) -->
    <footer class="footer bg-dark text-light pt-5 pb-4 mt-auto">
      <div class="container text-center text-md-start">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5 class="fw-bold mb-3">Tu Mesa</h5>
            <p class="small text-light-emphasis">
              Reserva fácilmente en los mejores restaurantes de tu ciudad.
            </p>
          </div>

          <div class="col-md-4 mb-3">
            <h6 class="fw-bold mb-3">Enlaces útiles</h6>
            <ul class="list-unstyled small">
              <li><a href="#" class="footer-link">Contáctanos</a></li>
              <li><a href="#" class="footer-link">Términos y condiciones</a></li>
              <li><a href="#" class="footer-link">Política de privacidad</a></li>
            </ul>
          </div>

          <div class="col-md-4 mb-3">
            <h6 class="fw-bold mb-3">Síguenos</h6>
            <div class="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#" class="footer-icon"><i class="bi bi-facebook"></i></a>
              <a href="#" class="footer-icon"><i class="bi bi-instagram"></i></a>
              <a href="#" class="footer-icon"><i class="bi bi-twitter-x"></i></a>
            </div>
          </div>
        </div>

        <hr class="border-light opacity-25 my-4" />
        <div class="text-center small">
          © 2025 Tu Mesa | Desarrollado por 
          <strong>Nicolas Chica</strong>, 
          <strong>Juan Bastidas</strong> y 
          <strong>Juan Cubides</strong>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import Swal from "sweetalert2"

const router = useRouter()
const user = ref(null)

onMounted(() => {
  const token = localStorage.getItem("token")
  if (!token) router.push("/login")

  const savedUser = localStorage.getItem("user")
  if (savedUser) user.value = JSON.parse(savedUser)
})

const goProfileInfo = () => router.push("/profileinfo")
const viewreserva = () => router.push("/viewreservas")
const goProfile = () => router.push("/profile")

const irhome = () => {
  router.push("/home")
}
</script>

<style scoped>
.bg-light-custom { background-color: #f8f9fa; }

.profile-card {
  background-color: white;
  border-radius: 1rem;
  max-width: 450px;
  width: 100%;
  padding: 3rem 2rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.profile-card:hover { transform: translateY(-5px); }

.btn-primary {
  background-color: #0d6efd;
  border-color: #0d6efd;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0b5ed7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13,110,253,0.3);
}

.btn-outline-primary {
  color: #0d6efd;
  border-color: #0d6efd;
  transition: all 0.3s ease;
}
.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
  transform: translateY(-2px);
}

h1 { font-size: 2rem; color: #333; margin-bottom: 2rem; }

/* Footer enlaces estilo */
.footer-link {
  color: #ccc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #fff;
  text-decoration: underline;
}

/* Footer iconos */
.footer-icon {
  color: #ccc;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}
.footer-icon:hover {
  color: #0d6efd;
}
</style>
