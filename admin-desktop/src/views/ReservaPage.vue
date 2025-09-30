<template>
  <div class="container mt-4">
    <h2 class="mb-3">Gestión de Reservas</h2>

    <!-- FILTROS -->
    <div class="row g-3 mb-3">
      <div class="col-md-3">
        <input v-model="filtros.nombre" class="form-control" placeholder="Nombre Cliente" />
      </div>
      <div class="col-md-3">
        <input v-model="filtros.restaurante" class="form-control" placeholder="Restaurante" />
      </div>
      <div class="col-md-3">
        <input v-model="filtros.fecha" type="date" class="form-control" />
      </div>
      <div class="col-md-3">
        <input v-model="filtros.ocasion" class="form-control" placeholder="Ocasión" />
      </div>
      <div class="col-12">
        <button class="btn btn-success" @click="cargarReservas">Filtrar</button>
      </div>
    </div>

    <!-- LISTA DE RESERVAS -->
    <table class="table table-bordered table-hover">
      <thead class="table-dark">
        <tr>
          <th>Cliente</th>
          <th>Restaurante</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Ocasión</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reserva in reservas" :key="reserva.id" @click="abrirModal(reserva)" style="cursor: pointer;">
          <td>{{ reserva.nombre_cliente }}</td>
          <td>{{ reserva.restaurante_nombre }}</td>
          <td>{{ reserva.fecha }}</td>
          <td>{{ reserva.hora }}</td>
          <td>{{ reserva.ocasión }}</td>
          <td>{{ reserva.estado_pago }}</td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL DETALLE -->
    <div class="modal fade show" v-if="modalAbierto" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Detalle Reserva</h5>
            <button type="button" class="btn-close" @click="modalAbierto=false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Cliente</label>
              <input v-model="reservaSeleccionada.nombre_cliente" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Ocasión</label>
              <input v-model="reservaSeleccionada.ocasión" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Fecha</label>
              <input v-model="reservaSeleccionada.fecha" type="date" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Hora</label>
              <input v-model="reservaSeleccionada.hora" type="time" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="guardarCambios">Guardar</button>
            <button class="btn btn-danger" @click="cancelarReserva">Cancelar Reserva</button>
            <button class="btn btn-secondary" @click="modalAbierto=false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const reservas = ref([]);
const filtros = ref({ nombre: "", restaurante: "", fecha: "", ocasion: "" });
const modalAbierto = ref(false);
const reservaSeleccionada = ref({});

async function cargarReservas() {
  const params = {};
  if (filtros.value.nombre) params.nombre = filtros.value.nombre;
  if (filtros.value.restaurante) params.restaurante = filtros.value.restaurante;
  if (filtros.value.fecha) params.fecha = filtros.value.fecha;
  if (filtros.value.ocasion) params.ocasion = filtros.value.ocasion;

  const res = await window.api.getReservas(params);
  if (res.success) reservas.value = res.reservas;
  else alert(res.message);
}

function abrirModal(reserva) {
  reservaSeleccionada.value = { ...reserva };
  modalAbierto.value = true;
}

async function guardarCambios() {
  const res = await window.api.updateReserva(reservaSeleccionada.value.id, reservaSeleccionada.value);
  if (res.success) {
    alert("Reserva actualizada");
    modalAbierto.value = false;
    cargarReservas();
  } else alert(res.message);
}

async function cancelarReserva() {
  if (!confirm("¿Seguro que deseas eliminar la reserva?")) return;
  const res = await window.api.deleteReserva(reservaSeleccionada.value.id);
  if (res.success) {
    alert("Reserva eliminada");
    modalAbierto.value = false;
    cargarReservas();
  } else alert(res.message);
}

cargarReservas();
</script>
