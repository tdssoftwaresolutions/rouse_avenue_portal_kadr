import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import Default from '../layouts/BlankLayout'
/* Dashboards View */
import Dashboard from '../views/Dashboards/Dashboard1.vue'
import Dashboard1 from '../views/Dashboards/Dashboard2.vue'
import Analytics from '../views/Dashboards/Analytics.vue'
import WebAnalytics from '../views/Dashboards/WebAnalytics.vue'
import Patient from '../views/Dashboards/Patient'
import Tracking from '../views/Dashboards/Tracking'
import TicketBooking from '../views/Dashboards/TicketBooking'
/* UIElements View */
import UiAlerts from '../views/core/UiAlerts.vue'
import UiButtons from '../views/core/UiButtons.vue'
import UiBadges from '../views/core/UiBadges.vue'
import UiBreadcrumb from '../views/core/UiBreadcrumb.vue'
import UiColors from '../views/core/UiColors.vue'
import UiTypography from '../views/core/UiTypography.vue'
import UiCards from '../views/core/UiCards.vue'
import UiCarousel from '../views/core/UiCarousel.vue'
import UiEmbedVideo from '../views/core/UiEmbedVideo.vue'
import UiGrid from '../views/core/UiGrid.vue'
import UiModal from '../views/core/UiModal.vue'
import UiListGroup from '../views/core/UiListGroup.vue'
import UiImages from '../views/core/UiImages.vue'
import UiMediaObject from '../views/core/UiMediaObject.vue'
import UiTooltips from '../views/core/UiTooltips.vue'
import UiPopovers from '../views/core/UiPopovers.vue'
import UiNotifications from '../views/core/UiNotifications.vue'
import UiTabs from '../views/core/UiTabs.vue'
import UiPagination from '../views/core/UiPagination.vue'
import UiProgressBars from '../views/core/UiProgressBars.vue'
/* Authentic View */
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'
import SignIn1 from '../views/AuthPages/Default/SignIn1'
import SignUp1 from '../views/AuthPages/Default/SignUp1'
import RecoverPassword1 from '../views/AuthPages/Default/RecoverPassword1'
import LockScreen1 from '../views/AuthPages/Default/LockScreen1'
import ConfirmMail1 from '../views/AuthPages/Default/ConfirmMail1'
/* Extra Pages */
import ErrorPage from '../views/Pages/ErrorPage'
import ComingSoon from '../views/Pages/ComingSoon'
import Maintenance from '../views/Pages/Maintenance'
import TimeLine from '../views/Pages/TimeLines'
import Pricing from '../views/Pages/Pricing'
import Pricing1 from '../views/Pages/Pricing1'
import BlankPage from '../views/Pages/BlankPage'
import FAQ from '../views/Pages/FAQ'
import Invoice from '../views/Pages/Invoice'
/* Apps Views */
import EmailListing from '../views/Apps/Email/EmailListing'
import EmailCompose from '../views/Apps/Email/EmailCompose'
import Calendar from '../views/Apps/Calendar'
import Calendar2 from '../views/Apps/Calendar2'
import ECommerceListing from '../views/Apps/Ecommerce/Listing'
import Checkout from '../views/Apps/Ecommerce/Checkout'
import Wishlist from '../views/Apps/Ecommerce/Wishlist'
import EcommerceDetail from '../views/Apps/Ecommerce/Detail'
import ChatIndex from '../views/Apps/Chat/Index'
/* Icon Views */
import IconDripicons from '../views/Icons/IconDripicons'
import IconFontawesome5 from '../views/Icons/IconFontawesome5'
import IconLineAwesome from '../views/Icons/IconLineAwesome'
import IconRemixicon from '../views/Icons/IconRemixicon'
import IconUnicons from '../views/Icons/IconUnicons'
/* Tables Views */
import TablesBasic from '../views/Tables/TablesBasic'
import DataTable from '../views/Tables/DataTable'
import EditableTable from '../views/Tables/EditableTable'
import ApexCharts from '../views/Charts/ApexCharts'
import AmCharts from '../views/Charts/AmCharts'
import MorrisCharts from '../views/Charts/MorrisCharts'
import HighCharts from '../views/Charts/HighCharts'
import GoogleMaps from '../views/Maps/GoogleMaps'
import VectorMaps from '../views/Maps/VectorMaps'
/* Form View */
import FormLayout from '../views/Forms/FormLayout'
import FormValidates from '../views/Forms/FormValidates'
import FormSwitches from '../views/Forms/FormSwitches'
import FormRadios from '../views/Forms/FormRadios'
import FormCheckboxes from '../views/Forms/FormCheckboxes'
/* User View */
import Profile from '../views/User/Profile'
import ProfileEdit from '../views/User/ProfileEdit'
import AddUser from '../views/User/AddUser'
import UserList from '../views/User/UserList'
import UserList1 from '../views/User/UserList1'
/* Form Wizard View  */
import SimpleWizard from '../views/FormsWizard/SimpleWizard'
import WizardValidate from '../views/FormsWizard/WizardValidate'
import VerticalWizard from '../views/FormsWizard/VerticalWizard'

Vue.use(VueRouter)

const childRoutes = (prop) => [
  {
    path: '',
    name: prop + '.home',
    component: Dashboard
  },
  {
    path: 'dashboard1',
    name: prop + '.home1',
    component: Dashboard1
  },
  {
    path: 'analytics',
    name: prop + '.analytics',
    component: Analytics
  },
  {
    path: 'web-analytics',
    name: prop + '.web.analytics',
    component: WebAnalytics
  },
  {
    path: 'patient-dashboard',
    name: prop + '.patient',
    component: Patient
  },
  {
    path: 'tracking-dashboard',
    name: prop + '.tracking',
    component: Tracking
  },
  {
    path: 'ticket-booking',
    name: prop + '.ticket.booking',
    component: TicketBooking
  }
]

const coreChildRoute = (prop) => [
  {
    path: 'ui-colors',
    name: prop + '.color',
    component: UiColors
  },
  {
    path: 'ui-typography',
    name: prop + '.typography',
    component: UiTypography
  },
  {
    path: 'ui-alerts',
    name: prop + '.alert',
    component: UiAlerts
  },
  {
    path: 'ui-buttons',
    name: prop + '.button',
    component: UiButtons
  },
  {
    path: 'ui-breadcrumb',
    name: prop + '.breadcrumb',
    component: UiBreadcrumb
  },
  {
    path: 'ui-badges',
    name: prop + '.badges',
    component: UiBadges
  },
  {
    path: 'ui-cards',
    name: prop + '.cards',
    component: UiCards
  },
  {
    path: 'ui-carousel',
    name: prop + '.carousel',
    component: UiCarousel
  },
  {
    path: 'ui-grid',
    name: prop + '.grid',
    component: UiGrid
  },
  {
    path: 'ui-embed-video',
    name: prop + '.embed-video',
    component: UiEmbedVideo
  },
  {
    path: 'ui-modal',
    name: prop + '.modal',
    component: UiModal
  },
  {
    path: 'ui-listgroup',
    name: prop + '.listgroup',
    component: UiListGroup
  },
  {
    path: 'ui-images',
    name: prop + '.images',
    component: UiImages
  },
  {
    path: 'ui-media-object',
    name: prop + '.media-object',
    component: UiMediaObject
  },
  {
    path: 'ui-pagination',
    name: prop + '.pagination',
    component: UiPagination
  },
  {
    path: 'ui-progressbars',
    name: prop + '.progressbars',
    component: UiProgressBars
  },
  {
    path: 'ui-tooltips',
    name: prop + '.tooltips',
    component: UiTooltips
  },
  {
    path: 'ui-popovers',
    name: prop + '.popovers',
    component: UiPopovers
  },
  {
    path: 'ui-notifications',
    name: prop + '.notifications',
    component: UiNotifications
  },
  {
    path: 'ui-tabs',
    name: prop + '.tabs',
    component: UiTabs
  }
]
const formChildRoute = (prop) => [
  {
    path: 'form-layout',
    name: prop + '.layout',
    component: FormLayout
  },
  {
    path: 'form-validate',
    name: prop + '.validate',
    component: FormValidates
  },
  {
    path: 'form-switches',
    name: prop + '.switch',
    component: FormSwitches
  },
  {
    path: 'form-radios',
    name: prop + '.radio',
    component: FormRadios
  },
  {
    path: 'form-checkboxes',
    name: prop + '.checkbox',
    component: FormCheckboxes
  },
  {
    path: 'simple-wizard',
    name: prop + '.wizard',
    component: SimpleWizard
  },
  {
    path: 'form-wizard-validate',
    name: prop + '.wizard-validate',
    component: WizardValidate
  },
  {
    path: 'form-wizard-vertical',
    name: prop + '.wizard-vertical',
    component: VerticalWizard
  }
]

const tableChildRoute = (prop) => [
  {
    path: 'tables-basic',
    name: prop + '.basic',
    component: TablesBasic
  },
  {
    path: 'data-table',
    name: prop + '.dataTable',
    component: DataTable
  },
  {
    path: 'editable',
    name: prop + '.editable',
    component: EditableTable
  }
]

const iconChildRoute = (prop) => [
  {
    path: 'dripicons',
    name: prop + '.dripicons',
    component: IconDripicons
  },
  {
    path: 'fontawesome-5',
    name: prop + '.fontawesome-5',
    component: IconFontawesome5
  },
  {
    path: 'lineawesome',
    name: prop + '.lineawesome',
    component: IconLineAwesome
  },
  {
    path: 'remixicon',
    name: prop + '.remixicon',
    component: IconRemixicon
  },
  {
    path: 'unicons',
    name: prop + '.unicons',
    component: IconUnicons
  }
]

const chartChildRoutes = (prop) => [
  {
    path: 'apex-charts',
    name: prop + '.apex',
    component: ApexCharts
  },
  {
    path: 'am-charts',
    name: prop + '.am',
    component: AmCharts
  },
  {
    path: 'high-charts',
    name: prop + '.high',
    component: HighCharts
  },
  {
    path: 'morris-charts',
    name: prop + '.morris',
    component: MorrisCharts
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
    path: 'email',
    name: prop + '.email',
    component: EmailListing
  },
  {
    path: 'email-compose',
    name: prop + '.email.compose',
    component: EmailCompose
  },
  {
    path: 'e-commerce/listing',
    name: prop + '.e-commerce.index',
    meta: { name: 'Product list' },
    component: ECommerceListing
  },
  {
    path: 'e-commerce/detail',
    name: prop + '.e-commerce.detail',
    meta: { name: 'Product Detail' },
    component: EcommerceDetail
  },
  {
    path: 'e-commerce/checkout',
    name: prop + '.e-commerce.cart',
    meta: { name: 'Checkout' },
    component: Checkout
  },
  {
    path: 'e-commerce/wish-list',
    name: prop + '.e-commerce.wishlist',
    meta: { name: 'Wishlist' },
    component: Wishlist
  },
  {
    path: 'chat',
    name: prop + '.chat',
    meta: { name: 'Chat' },
    component: ChatIndex
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
    path: 'password-reset1',
    name: prop + '.password-reset1',
    component: RecoverPassword1
  },
  {
    path: 'lock-screen1',
    name: prop + '.lock-screen1',
    component: LockScreen1
  },
  {
    path: 'confirm-mail1',
    name: prop + '.confirm-mail1',
    component: ConfirmMail1
  }
]

const mapChildRoute = (prop) => [
  {
    path: 'google-maps',
    name: prop + '.google',
    component: GoogleMaps
  },
  {
    path: 'vector-maps',
    name: prop + '.vector',
    component: VectorMaps
  }
]

const defaultlayout = (prop) => [
  {
    path: 'timeline',
    name: prop + '.timeline',
    component: TimeLine
  },
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
    path: 'pricing',
    name: prop + '.pricing',
    component: Pricing
  },
  {
    path: 'pricing-1',
    name: prop + '.pricing1',
    component: Pricing1
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

const userChildRoute = (prop) => [
  {
    path: 'profile',
    name: prop + '.profile',
    component: Profile
  },
  {
    path: 'profile-edit',
    name: prop + '.edit',
    component: ProfileEdit
  },
  {
    path: 'add-user',
    name: prop + '.add',
    component: AddUser
  },
  {
    path: 'user-list',
    name: prop + '.list',
    component: UserList
  },
  {
    path: 'user-list1',
    name: prop + '.list1',
    component: UserList1
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
    path: '/core',
    name: 'core',
    component: Layout1,
    children: coreChildRoute('core')
  },
  {
    path: '/table',
    name: 'table',
    component: Layout1,
    children: tableChildRoute('table')
  },
  {
    path: '/chart',
    name: 'chart',
    component: Layout1,
    children: chartChildRoutes('chart')
  },
  {
    path: '/icon',
    name: 'icon',
    component: Layout1,
    children: iconChildRoute('icon')
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout1,
    children: authChildRoutes('auth1')
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
  },
  {
    path: '/map',
    name: 'map',
    component: Layout1,
    children: mapChildRoute('map')
  },
  {
    path: '/form',
    name: 'form',
    component: Layout1,
    children: formChildRoute('form')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
