import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import fa from 'vuetify/es5/locale/fa';


Vue.use(Vuetify);

import {
  VTextField,
  VAutocomplete,
  VBtn,
  VCard,
  VSelect,
  VTextarea
} from 'vuetify/lib'

VTextField.options.props.outlined.default = true
VTextField.options.props.hideDetails.default = true
VTextField.options.props.dense.default = true
VTextField.options.props.backgroundColor.default = 'white'

VBtn.options.props.small.default = true

VCard.options.props.outlined.default = true

VSelect.options.props.outlined.default = true

VTextarea.options.props.rows.default = 1
VTextarea.options.props.autoGrow.default = true



export default new Vuetify({
  rtl: true,
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: '#FF8700',
        secondary: '#002357',
        accent: '#43CED7',
        error: '#F1416C',
        info: '#019EF6',
        success: '#50CD89',
        warning: '#FFC700'
      },
    },
  },
  lang: {
    locales: {
      fa
    },
    current: 'fa',
  },
  icons: {
    iconfont: 'md',
    values: {
      safeIcon: {
        component: () => import('@/icons/SafeIcon.vue')
      },
      buySaleIcon: {
        component: () => import('@/icons/BuySaleIcon.vue')
      },
      warehouseIcon: {
        component: () => import('@/icons/WarehouseIcon.vue')
      },
      reportIcon: {
        component: () => import('@/icons/ReportIcon.vue')
      },
      transportationIcon: {
        component: () => import('@/icons/TransportationIcon.vue')
      },
      clearFiltersIcon: {
        component: () => import('@/icons/ClearFilters.vue')
      },
      curvedArrowLeftIcon: {
        component: () => import('@/icons/CurvedArrowLeft.vue')
      },
      costAccountingIcon: {
        component: () => import('@/icons/CostAccountingIcon.vue')
      },
      sanadIcon: {
        component: () => import('@/icons/SanadIcon.vue')
      },
      accountsTreeIcon: {
        component: () => import('@/icons/AccountsTreeIcon.vue')
      },
      accountIcon: {
        component: () => import('@/icons/AccountIcon.vue')
      },
      balanceReportIcon: {
        component: () => import('@/icons/BalanceReportIcon.vue')
      },
      ledgerReportIcon: {
        component: () => import('@/icons/LedgerReportIcon.vue')
      },
      factorIcon: {
        component: () => import('@/icons/FactorIcon.vue')
      },
      inputFactorIcon: {
        component: () => import('@/icons/InputFactorIcon.vue')
      },
      outputFactorIcon: {
        component: () => import('@/icons/OutputFactorIcon.vue')
      },
      receiveTransactionIcon: {
        component: () => import('@/icons/ReceiveTransactionIcon.vue')
      },
      paymentTransactionIcon: {
        component: () => import('@/icons/PaymentTransactionIcon.vue')
      },
    }
  },
});