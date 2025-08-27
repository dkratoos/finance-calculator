import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/financiamento',
      name: 'financiamento',
      component: () => import('../views/FinanciamentoView.vue'),
    },
    {
      path: '/reserva-emergencia',
      name: 'reserva-emergencia',
      component: () => import('../views/ReservaEmergenciaView.vue'),
    },
    {
      path: '/pj-clt',
      name: 'pj-clt',
      component: () => import('../views/PjCltView.vue'),
    },
    {
      path: '/custo-funcionario',
      name: 'custo-funcionario',
      component: () => import('../views/CustoFuncionarioView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
