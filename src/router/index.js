import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import Default from '../layouts/BlankLayout'
/* Dashboards View */
import Dashboard from '../views/Dashboards/Dashboard1.vue'
/* Authentic View */
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'
import MyBlogs from '../views/Apps/Blog/MyBlogs.vue'
import SignIn1 from '../views/AuthPages/Default/SignIn1'
import SignUp1 from '../views/AuthPages/Default/SignUp1'
import RecoverPassword from '../views/AuthPages/Default/RecoverPassword1'
/* Extra Pages */
import ErrorPage from '../views/Pages/ErrorPage'
import ComingSoon from '../views/Pages/ComingSoon'
import Maintenance from '../views/Pages/Maintenance'
import BlankPage from '../views/Pages/BlankPage'
import FAQ from '../views/Pages/FAQ'
import Invoice from '../views/Pages/Invoice'
/* Apps Views */
import Calendar from '../views/Apps/Calendar'
import Calendar2 from '../views/Apps/Calendar2'
import ECommerceListing from '../views/Apps/Ecommerce/Listing'
import EditableTable from '../views/Tables/EditableTable'
/* User View */
import UserList from '../views/User/UserList'
import AdminUsersListView from '../views/User/AdminUsersListView.vue'

Vue.use(VueRouter)

const childRoutes = (prop) => [
  {
    path: '',
    name: prop + '.home',
    component: Dashboard
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
  },
  {
    path: 'e-commerce/listing',
    name: prop + '.e-commerce.index',
    meta: { name: 'Product list' },
    component: ECommerceListing
  },
  {
    path: 'users',
    name: prop + '.users',
    meta: { name: 'Admin Users List' },
    component: AdminUsersListView
  }
]

const blogChildRoutes = (prop) => [
  {
    path: 'list',
    name: prop + '.list',
    component: MyBlogs
  }
]

const authChildRoutes = (prop) => [
  {
    path: 'sign-in',
    name: prop + '.sign-in',
    component: SignIn1
  },
  {
    path: 'sign-up',
    name: prop + '.sign-up',
    component: SignUp1
  },
  {
    path: 'password-reset',
    name: prop + '.password-reset',
    component: RecoverPassword
  }
]

const defaultlayout = (prop) => [
  {
    path: 'invoice',
    name: prop + '.invoice',
    component: Invoice
  },
  {
    path: 'blank-page',
    name: prop + '.blank-page',
    component: BlankPage
  },
  {
    path: 'faq',
    name: prop + '.faq',
    component: FAQ
  }
]

const pagesChildRoutes = (prop) => [
  {
    path: 'error/:code',
    name: prop + '.error',
    component: ErrorPage
  },
  {
    path: 'coming-soon',
    name: prop + '.coming-soon',
    component: ComingSoon
  },
  {
    path: 'maintenance',
    name: prop + '.maintenance',
    component: Maintenance
  }
]

const tableChildRoute = (prop) => [
  {
    path: 'editable',
    name: prop + '.editable',
    component: EditableTable
  }
]

const userChildRoute = (prop) => [
  {
    path: 'user-list',
    name: prop + '.list',
    component: UserList
  }
]
const routes = [
  {
    path: '/',
    name: 'dashboard1',
    component: Layout1,
    children: childRoutes('dashboard1')
  },
  {
    path: '/table',
    name: 'table',
    component: Layout1,
    children: tableChildRoute('table')
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout1,
    children: authChildRoutes('auth1')
  },
  {
    path: '/blog',
    name: 'blog',
    component: Layout1,
    children: blogChildRoutes('blog')
  },
  {
    path: '/pages',
    name: 'pages',
    component: Default,
    children: pagesChildRoutes('default')
  },
  {
    path: '/extra-pages',
    name: 'extra-pages',
    component: Layout1,
    children: defaultlayout('extra-pages')
  },
  {
    path: '/app',
    name: 'app',
    component: Layout1,
    children: appChildRoute('app')
  },
  {
    path: '/user',
    name: 'user',
    component: Layout1,
    children: userChildRoute('user')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/admin/',
  routes
})

export default router
