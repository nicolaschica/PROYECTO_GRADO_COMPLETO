<template>
  <div v-if="restaurante" class="info-rest">
    <!-- Hero -->
    <header class="hero position-relative d-flex align-items-center">
      <div class="overlay"></div>
      <img :src="restaurante.imagen" class="hero-bg" alt="Portada restaurante" />
      <div class="hero-content text-white d-flex align-items-center gap-3">
        <img :src="restaurante.icono" alt="Logo" class="hero-logo shadow-lg" />
        <h1 class="display-4 fw-bold m-0">{{ restaurante.titulo }}</h1>
      </div>
    </header>

    <!-- Contenido -->
    <div class="container-fluid py-5">
      <div class="row g-4">
        <!-- Sidebar -->
        <aside class="col-lg-4 d-flex flex-column gap-4">
          <!-- Galería -->
          <div class="sidebar-section card shadow-sm flex-fill">
            <div class="card-header text-center fw-bold bg-white border-0 text-primary">
              📸 Galería
            </div>
            <div class="card-body text-center">
              <img
                :src="restaurante.imagen"
                class="img-fluid rounded shadow-sm gallery-img"
                alt="Foto"
                data-bs-toggle="modal"
                data-bs-target="#fotoModal"
              />
              <small class="text-muted d-block mt-2">Haz clic para ampliar</small>
            </div>
          </div>

          <!-- Mapa -->
          <div class="sidebar-section card shadow-sm flex-fill">
            <div class="card-header text-center fw-bold bg-white border-0 text-primary">
              📍 Ubicación
            </div>
            <div class="card-body p-0">
              <iframe
                v-if="restaurante.direccion"
                :src="`https://www.google.com/maps?q=${encodeURIComponent(restaurante.direccion)}&output=embed`"
                class="map-frame"
                allowfullscreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </aside>

        <!-- Contenido principal -->
        <main class="col-lg-8 d-flex flex-column gap-4">
          <div class="card shadow-sm border-0 rounded-4 p-4 main-info flex-fill">
            <div class="info-grid">
              <div class="info-item" v-for="(item, index) in infoList" :key="index">
                <i :class="item.icon" class="icon"></i>
                <div>
                  <h6>{{ item.title }}</h6>
                  <p>{{ item.value }}</p>
                </div>
              </div>
            </div>

            <br><br>

            <!-- Precio -->
            <div class="price-section text-center mt-4">
              <h5 class="fw-bold text-primary">Precio por Reserva</h5>
              <p class="fs-3 fw-bold text-dark mb-0">${{ restaurante.precio }} COP</p>
            </div>

            <!-- Botones -->
            <div class="d-flex gap-3 justify-content-center mt-4">
              <button class="btn btn-primary btn-lg rounded-pill shadow-sm" @click="irAReserva">
                Reservar Ahora
              </button>
              <button class="btn btn-outline-primary btn-lg rounded-pill" @click="volver">
                ← Volver
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- Footer -->
   <!-- Footer -->
<footer class="footer mt-5 py-4">
  <div class="container text-center">
    <h5 class="fw-bold text-light mb-3">
      🌐 Conéctate con {{ restaurante.titulo }}
    </h5>
    <div class="d-flex justify-content-center gap-4 flex-wrap mb-3">
      <a
        :href="`https://www.facebook.com/search/top?q=${restaurante.titulo}`"
        target="_blank"
        class="social-icon"
      >
        <i class="bi bi-facebook"></i>
      </a>
      <a
        :href="`https://www.instagram.com/explore/tags/${restaurante.titulo}`"
        target="_blank"
        class="social-icon"
      >
        <i class="bi bi-instagram"></i>
      </a>
      <a
        :href="`https://www.google.com/search?q=${restaurante.titulo}`"
        target="_blank"
        class="social-icon"
      >
        <i class="bi bi-globe2"></i>
      </a>
    </div>
    <p class="text-light-50 small mb-0">
      © {{ new Date().getFullYear() }} {{ restaurante.titulo }} — Todos los derechos reservados.
    </p>
  </div>
</footer>



    <!-- Modal -->
    <div class="modal fade" id="fotoModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content bg-dark border-0">
          <div class="modal-body text-center p-0">
            <img :src="restaurante.imagen" class="img-fluid rounded shadow-lg" alt="Ampliada" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loader -->
  <div v-else class="d-flex flex-column align-items-center justify-content-center min-vh-100">
    <div class="spinner-border text-primary mb-3" role="status"></div>
    <p class="text-muted">Cargando información del restaurante...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const restaurante = ref(null);

const fetchRestaurante = async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`http://localhost:3000/restaurantes/${id}`);
    restaurante.value = response.data;
  } catch (error) {
    console.error("❌ Error al obtener restaurante:", error);
  }
};

const infoList = computed(() => {
  if (!restaurante.value) return [];
  return [
    { title: "Descripción", value: restaurante.value.descripcion, icon: "bi bi-book-half" },
    { title: "Tipo de Cocina", value: restaurante.value.tipo_cocina, icon: "bi bi-egg-fried" },
    { title: "Dirección", value: restaurante.value.direccion, icon: "bi bi-geo-alt" },
    { title: "Teléfono", value: restaurante.value.telefono, icon: "bi bi-telephone" },
    {
      title: "Horarios",
      value: restaurante.value.horarios || "Lunes a Domingo: 8:00 AM - 10:00 PM",
      icon: "bi bi-clock-history",
    },
    {
      title: "Fechas Especiales",
      value: restaurante.value.fechas_especiales || "Disponible todo el año",
      icon: "bi bi-calendar-heart",
    },
  ];
});

const irAReserva = () => {
  router.push({ name: "reserva", query: { restauranteNombre: restaurante.value.titulo } });
};

const volver = () => {
  router.push("/home");
};

onMounted(fetchRestaurante);
</script>

<style scoped>
/* Hero */
.hero {
  height: 40vh;
  position: relative;
  overflow: hidden;
  border-bottom: 4px solid #007bff;
}

.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(60%);
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
}

.hero-content {
  position: absolute;
  bottom: 20px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.hero-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: white;
  padding: 5px;
}

/* Sidebar */
.sidebar-section {
  border-radius: 16px;
  overflow: hidden;
  flex: 1;
}

.map-frame {
  width: 100%;
  height: 250px;
  border: none;
}

.gallery-img {
  transition: transform 0.3s ease;
  cursor: pointer;
}
.gallery-img:hover {
  transform: scale(1.05);
}

/* Info */
.main-info {
  background-color: #fff;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #e7f0ff;
  transform: translateY(-3px);
}

.icon {
  font-size: 1.6rem;
  color: #007bff;
  flex-shrink: 0;
}

.info-item h6 {
  margin-bottom: 0.3rem;
  font-weight: 600;
  color: #007bff;
}

.info-item p {
  margin: 0;
  color: #555;
}

/* Footer*/
.footer {
  background-color: #1a1a1a; /* gris oscuro elegante */
  color: #f0f0f0;
  border-radius: 0; /* quitar bordes redondeados */
}

.social-icon {
  color: #f0f0f0;
  font-size: 1.8rem;
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-icon:hover {
  color: #007bff;
  transform: translateY(-3px);
}

.text-light-50 {
  color: rgba(240, 240, 240, 0.6);
}

</style>
