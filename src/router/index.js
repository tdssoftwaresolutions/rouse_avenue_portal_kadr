import Vue from 'vue'
import VueRouter from 'vue-router'
import StandardLayout from '../layouts/StandardLayout.vue'
import Dashboard from '../views/Standard/Dashboard.vue'
import AuthLayout from '../layouts/AuthLayout'
import SignIn from '../views/AuthPages/SignIn'
import RecoverPassword from '../views/AuthPages/RecoverPassword'
import Calendar from '../views/Apps/Calendar'
import Calendar2 from '../views/Apps/Calendar2'
import ProfileEdit from '../views/Standard/ProfileEdit.vue'
import MCAllMediators from '../views/MC/MCAllMediators.vue'
import Signature from '../views/Client/Signature.vue'
import AgreementSignature from '../views/Client/AgreementSignature.vue'

Vue.use(VueRouter)

const childRoutes = (prop) => [
  {
    path: '',
    name: prop + '.home',
    component: Dashboard
  },
  {
    path: 'mediators',
    name: prop + '.mediators',
    component: MCAllMediators
  }
]
const appChildRoute = (prop) => [
  {
    path: 'calendar',
    name: prop + '.calendar',
    component: Calendar
  },
  {
    path: 'calendar2',
    name: prop + '.calendar2',
    component: Calendar2
  }
]
const authChildRoutes = (prop) => [
  {
    path: 'sign-in',
    name: prop + '.sign-in',
    component: SignIn
  },
  {
    path: 'password-reset',
    name: prop + '.password-reset',
    component: RecoverPassword
  }
]
const userChildRoute = (prop) => [
  {
    path: 'profile-edit',
    name: prop + '.edit',
    component: ProfileEdit
  }
]
const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: StandardLayout,
    children: childRoutes('dashboard')
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout,
    children: authChildRoutes('auth1')
  },
  {
    path: '/signature',
    name: 'signature',
    component: Signature
  },
  {
    path: '/agreement-signature',
    name: 'agreement-signature',
    component: AgreementSignature
  },
  {
    path: '/app',
    name: 'app',
    component: StandardLayout,
    children: appChildRoute('app')
  },
  {
    path: '/user',
    name: 'user',
    component: StandardLayout,
    children: userChildRoute('user')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/admin/',
  routes
})

export default router
