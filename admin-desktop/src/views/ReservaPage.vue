<template>
  <div class="reservas-wrapper min-vh-100 bg-light-custom py-5">
    <div class="container">
      <h2 class="text-center fw-bold mb-4">Gestión de Reservas</h2>

      <!-- FILTROS -->
      <div class="row g-3 mb-4 justify-content-center">
        <div class="col-md-3">
          <input v-model="filtros.nombre" class="form-control filtro-input" placeholder="Nombre Cliente" />
        </div>
        <div class="col-md-3">
          <input v-model="filtros.restaurante" class="form-control filtro-input" placeholder="Restaurante" />
        </div>
        <div class="col-md-3">
          <input v-model="filtros.fecha" type="date" class="form-control filtro-input" />
        </div>
        <div class="col-md-2 d-grid">
          <button class="btn btn-success btn-lg filtro-btn" @click="cargarReservas">
            Filtrar
          </button>
        </div>
      </div>

      <!-- LISTA DE RESERVAS -->
      <div class="reservas-list d-grid gap-4">
        <div v-for="reserva in reservas" :key="reserva.id" class="reserva-card p-4 shadow-sm">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h5 class="fw-bold mb-1">{{ reserva.nombre }}</h5>
            <span class="badge" :class="estadoBadge(reserva.estado_pago)">
              {{ reserva.estado_pago || 'Pendiente' }}
            </span>
          </div>
          <p class="mb-1"><b>Teléfono:</b> {{ reserva.telefono }}</p>
          <p class="mb-1"><b>Restaurante:</b> {{ reserva.restaurante_nombre }}</p>
          <p class="mb-1"><b>Fecha:</b> {{ reserva.fecha }}</p>
          <p class="mb-1"><b>Hora:</b> {{ reserva.hora }}</p>

          <div class="d-flex gap-2 mt-3 flex-wrap">
            <button class="btn btn-info btn-sm" @click="verDetalle(reserva)">Ver</button>
            <button class="btn btn-warning btn-sm" @click="abrirModal(reserva)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="cancelarReserva(reserva.id)">Borrar</button>
          </div>
        </div>
      </div>

      <!-- MODAL DETALLE -->
      <div class="modal-backdrop" v-if="modalDetalle">
        <div class="modal-dialog">
          <div class="modal-content shadow">
            <div class="modal-header bg-info text-white">
              <h5 class="modal-title">Detalle de Reserva</h5>
              <button class="btn-close" @click="modalDetalle=false"></button>
            </div>
            <div class="modal-body">
              <p><b>Cliente:</b> {{ reservaSeleccionada.nombre }}</p>
              <p><b>Teléfono:</b> {{ reservaSeleccionada.telefono }}</p>
              <p><b>Restaurante:</b> {{ reservaSeleccionada.restaurante_nombre }}</p>
              <p><b>Fecha:</b> {{ reservaSeleccionada.fecha }}</p>
              <p><b>Hora:</b> {{ reservaSeleccionada.hora }}</p>
              <p><b>Estado:</b> {{ reservaSeleccionada.estado_pago }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="modalDetalle=false">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MODAL EDITAR -->
      <div class="modal-backdrop" v-if="modalEditar">
        <div class="modal-dialog">
          <div class="modal-content shadow">
            <div class="modal-header bg-warning">
              <h5 class="modal-title">Editar Reserva</h5>
              <button class="btn-close" @click="modalEditar=false"></button>
            </div>
            <div class="modal-body">
              <div class="mb-2" v-for="campo in campos" :key="campo.key">
                <label class="form-label">{{ campo.label }}</label>
                <input 
                  v-model="reservaSeleccionada[campo.key]" 
                  :type="campo.type || 'text'" 
                  class="form-control"
                />
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary" @click="guardarCambios">Guardar</button>
              <button class="btn btn-secondary" @click="modalEditar=false">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const reservas = ref([]);
const filtros = ref({ nombre: "", restaurante: "", fecha: "" });
const modalDetalle = ref(false);
const modalEditar = ref(false);
const reservaSeleccionada = ref({});
const campos = [
  { key: "nombre", label: "Cliente" },
  { key: "telefono", label: "Teléfono" },
  { key: "restaurante_nombre", label: "Restaurante" },
  { key: "fecha", label: "Fecha", type: "date" },
  { key: "hora", label: "Hora", type: "time" }
];

async function cargarReservas() {
  const params = {};
  if (filtros.value.nombre) params.nombre = filtros.value.nombre;
  if (filtros.value.restaurante) params.restaurante = filtros.value.restaurante;
  if (filtros.value.fecha) params.fecha = filtros.value.fecha;

  const res = await window.api.getReservas(params);
  if (res.success) reservas.value = res.reservas;
}

function verDetalle(reserva) {
  reservaSeleccionada.value = { ...reserva };
  modalDetalle.value = true;
}

function abrirModal(reserva) {
  reservaSeleccionada.value = { ...reserva };
  modalEditar.value = true;
}

async function guardarCambios() {
  const res = await window.api.updateReserva(reservaSeleccionada.value.id, reservaSeleccionada.value);
  if (res.success) {
    modalEditar.value = false;
    cargarReservas();
  }
}

async function cancelarReserva(id) {
  if (!confirm("¿Seguro que deseas eliminar la reserva?")) return;
  const res = await window.api.deleteReserva(id);
  if (res.success) cargarReservas();
}

function estadoBadge(estado) {
  switch(estado) {
    case "approved": return "bg-success";
    case "pending": return "bg-warning";
    case "rejected": return "bg-danger";
    default: return "bg-secondary";
  }
}

cargarReservas();
</script>

<style scoped>
.bg-light-custom { background-color: #f8f9fa; }

.reserva-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.reserva-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.filtro-input {
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 10px;
}
.filtro-input:focus {
  border-color: #3b82f6;
  box-shadow: none;
}

.filtro-btn {
  transition: transform 0.2s, box-shadow 0.2s;
}
.filtro-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59,130,246,0.3);
}

.modal-backdrop {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  border-radius: 1rem;
  overflow: hidden;
}

.badge {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border-radius: 0.5rem;
}
</style>
