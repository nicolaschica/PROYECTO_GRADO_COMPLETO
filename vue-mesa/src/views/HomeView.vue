<template>
  <div class="home-wrapper min-vh-100 d-flex flex-column">
    <!-- Navbar -->
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
              <button class="btn btn-primary btn-sm rounded-pill" @click="logout">
                <i class="bi bi-box-arrow-right me-1"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow-1 py-5 mt-5 bg-light-custom">
      <div class="container px-4 py-4">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-dark mb-2">Descubre nuestros restaurantes</h2>
          <p class="text-muted">Encuentra el lugar perfecto para disfrutar una experiencia gastronómica inolvidable</p>
        </div>

        <div class="row g-4">
          <div 
            class="col-12 col-md-6 col-lg-4" 
            v-for="rest in restaurantes" 
            :key="rest.id"
          >
            <div class="card h-100 border-0 shadow-sm restaurant-card">
              <div class="position-relative overflow-hidden rounded-top-3">
                <img 
                  :src="rest.imagen" 
                  alt="Restaurante" 
                  class="card-img-top restaurant-img"
                />
                <div class="card-overlay">
                  <h5 class="card-title fw-bold text-white mb-0">{{ rest.titulo }}</h5>
                </div>
              </div>
              
              <div class="card-body d-flex flex-column">
                <p class="text-muted flex-grow-1">{{ rest.descripcion }}</p>
                <button 
                  @click="irADetalle(rest.id)"
                  class="btn btn-outline-primary rounded-pill fw-semibold mt-3"
                >
                  <i class="bi bi-eye me-2"></i>Ver más detalles
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-if="restaurantes.length === 0" class="text-center py-5">
          <i class="bi bi-shop display-1 text-muted mb-3"></i>
          <h4 class="text-muted">No hay restaurantes disponibles</h4>
          <p class="text-muted">Vuelve pronto para ver nuestras opciones</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
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
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

const router = useRouter()
const restaurantes = ref([])

const logout = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas cerrar tu sesión?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#0d6efd',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      localStorage.clear()
      router.push('/login')
    }
  })
}

const goProfile = () => {
  router.push('/profile')
}

const fetchRestaurantes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/restaurantes')
    restaurantes.value = response.data
  } catch (error) {
    console.error('Error al obtener los restaurantes:', error)
    if (error.response?.status === 401 || error.response?.status === 403) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Por favor vuelve a iniciar sesión'
      })
      router.push('/login')
    }
  }
}

onMounted(() => {
  fetchRestaurantes()
})

const irADetalle = id => {
  router.push({ name: 'infoRest', params: { id } })
}
</script>

<style scoped>
/* ======== NAVBAR ======== */
.navbar {
  backdrop-filter: blur(10px);
}

.navbar-brand {
  letter-spacing: 0.5px;
}

/* ======== MAIN ======== */
.bg-light-custom {
  background-color: #f8f9fa;
}

.restaurant-card {
  transition: all 0.3s ease;
  border-radius: 1rem;
}

.restaurant-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.restaurant-img {
  height: 240px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.restaurant-card:hover .restaurant-img {
  transform: scale(1.03);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 1rem;
}

/* ======== FOOTER ======== */
.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #fff;
}

.footer-icon {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.3rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.footer-icon:hover {
  color: #0d6efd;
  transform: translateY(-2px);
}

/* ======== RESPONSIVE ======== */
@media (max-width: 768px) {
  .restaurant-img {
    height: 200px;
  }
}
</style>
