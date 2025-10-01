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
      <div class="col-12">
        <button class="btn btn-success" @click="cargarReservas">Filtrar</button>
      </div>
    </div>

    <!-- LISTA DE RESERVAS -->
    <table class="table table-bordered table-hover">
      <thead class="table-dark">
        <tr>
          <th>Cliente</th>
          <th>Teléfono</th>
          <th>Restaurante</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="reserva in reservas" :key="reserva.id">
          <td>{{ reserva.nombre }}</td>
          <td>{{ reserva.telefono }}</td>
          <td>{{ reserva.restaurante_nombre }}</td>
          <td>{{ reserva.fecha }}</td>
          <td>{{ reserva.hora }}</td>
          <td>{{ reserva.estado_pago }}</td>
          <td>
            <button class="btn btn-info btn-sm me-1" @click="verDetalle(reserva)">Ver</button>
            <button class="btn btn-warning btn-sm me-1" @click="abrirModal(reserva)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="cancelarReserva(reserva.id)">Borrar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODAL DETALLE (solo lectura) -->
    <div class="modal fade show" v-if="modalDetalle" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">Detalle de Reserva</h5>
            <button type="button" class="btn-close" @click="modalDetalle=false"></button>
          </div>
          <div class="modal-body">
            <p><b>Cliente:</b> {{ reservaSeleccionada.nombre }}</p>
            <p><b>Teléfono:</b> {{ reservaSeleccionada.telefono }}</p>
            <p><b>Restaurante:</b> {{ reservaSeleccionada.restaurante_nombre }}</p>
            <p><b>Fecha:</b> {{ reservaSeleccionada.fecha }}</p>
            <p><b>Hora:</b> {{ reservaSeleccionada.hora }}</p>
            <p><b>Estado:</b> {{ reservaSeleccionada.estado_pago }}</p>
            <p><b>Creada:</b> {{ reservaSeleccionada.created_at }}</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="modalDetalle=false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL EDITAR -->
    <div class="modal fade show" v-if="modalEditar" style="display:block; background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-warning">
            <h5 class="modal-title">Editar Reserva</h5>
            <button type="button" class="btn-close" @click="modalEditar=false"></button>
          </div>
          <div class="modal-body">
            <div class="mb-2">
              <label class="form-label">Cliente</label>
              <input v-model="reservaSeleccionada.nombre" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Teléfono</label>
              <input v-model="reservaSeleccionada.telefono" class="form-control" />
            </div>
            <div class="mb-2">
              <label class="form-label">Restaurante</label>
              <input v-model="reservaSeleccionada.restaurante_nombre" class="form-control" />
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
            <button class="btn btn-secondary" @click="modalEditar=false">Cerrar</button>
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

async function cargarReservas() {
  const params = {};
  if (filtros.value.nombre) params.nombre = filtros.value.nombre;
  if (filtros.value.restaurante) params.restaurante = filtros.value.restaurante;
  if (filtros.value.fecha) params.fecha = filtros.value.fecha;

  const res = await window.api.getReservas(params);
  if (res.success) reservas.value = res.reservas;
  else alert(res.message);
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
  const datosActualizados = {
    nombre: reservaSeleccionada.value.nombre,
    telefono: reservaSeleccionada.value.telefono,
    restaurante_nombre: reservaSeleccionada.value.restaurante_nombre,
    fecha: reservaSeleccionada.value.fecha,
    hora: reservaSeleccionada.value.hora
  };

  const res = await window.api.updateReserva(reservaSeleccionada.value.id, datosActualizados);
  
  if (res.success) {
    alert("Reserva actualizada");
    modalEditar.value = false;
    cargarReservas();
  } else {
    alert(res.message);
  }
}

async function cancelarReserva(id) {
  if (!confirm("¿Seguro que deseas eliminar la reserva?")) return;
  const res = await window.api.deleteReserva(id);
  if (res.success) {
    alert("Reserva eliminada");
    cargarReservas();
  } else alert(res.message);
}

cargarReservas();
</script>
