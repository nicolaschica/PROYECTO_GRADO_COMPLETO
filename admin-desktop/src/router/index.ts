import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/LoginPage.vue';
import Reservas from '../views/ReservaPage.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/reservas', component: Reservas }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
