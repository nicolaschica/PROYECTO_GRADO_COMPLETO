<template>
  <div class="reservas-wrapper min-vh-100 d-flex flex-column">
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
              <button class="btn btn-primary btn-sm rounded-pill" @click="irHome">
                <i class="bi bi-house-door me-1"></i> Home
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow-1 bg-light-custom py-5 mt-5">
      <div class="container">
        <h2 class="text-center mb-4">📅 Mis Reservas</h2>

        <div v-if="reservas.length > 0" class="reservas-list">
          <div v-for="r in reservas" :key="r.id" class="reserva-item shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h3>{{ r.restaurante_nombre }}</h3>
              <span :class="['estado-badge', r.estado_pago]">{{ r.estado_pago || 'Pendiente' }}</span>
            </div>
            <p><strong>Fecha:</strong> {{ r.fecha ? new Date(r.fecha).toLocaleDateString() : "N/A" }}</p>
            <p><strong>Hora:</strong> {{ r.hora ? r.hora.substring(0,5) : "N/A" }}</p>
            <button v-if="r.estado_pago !== 'approved'" @click="agregarPago(r)" class="btn pago-btn mt-2">
              💳 Pagar ahora
            </button>
          </div>
        </div>

        <p v-else class="text-center text-muted mt-4">No tienes reservas aún.</p>
      </div>
    </main>

    <!-- Footer (igual que Home) -->
    <footer class="footer bg-dark text-light pt-5 pb-4 mt-auto">
      <div class="container text-center text-md-start">
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
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()
const reservas = ref([])

const agregarPago = async (reserva) => {
  try {
    const token = localStorage.getItem("token")
    const res = await axios.post(
      "http://localhost:3000/crear-pago",
      { reservaId: reserva.id },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (res.data.success) window.location.href = res.data.init_point
  } catch (err) { console.error(err) }
}


const irHome = () => router.push("/home")

onMounted(async () => {
  const token = localStorage.getItem("token")
  if (!token) return router.push("/login")
  try {
    const res = await axios.get("http://localhost:3000/misreservas", {
      headers: { Authorization: `Bearer ${token}` }
    })
    reservas.value = res.data.reservas
  } catch (err) { console.error(err) }
})
</script>

<style scoped>
.bg-light-custom { background-color: #f8f9fa; }

.reservas-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reserva-item {
  background: white;
  border-radius: 1rem;
  padding: 20px;
  border-left: 6px solid #228B22;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.reserva-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.reserva-item h3 {
  margin: 0;
  color: #228B22;
  font-size: 1.25rem;
}

.estado-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  text-transform: capitalize;
  font-size: 0.85rem;
}
.estado-badge.approved { background-color: #28a745; color: white; }
.estado-badge.pending { background-color: #ffc107; color: #333; }
.estado-badge.rejected { background-color: #dc3545; color: white; }

.pago-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 8px 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}
.pago-btn:hover {
  background-color: #1e5fc0;
  transform: translateY(-2px);
}

h2 {
  color: #333;
  font-weight: bold;
  margin-bottom: 30px;
}
</style>
