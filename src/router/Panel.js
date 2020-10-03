const Panel = () => import('@/views/panel/Panel.vue')

const Home = () => import('@/views/panel/Home.vue')

const Companies = () => import('@/views/panel/company/Companies.vue')
const FinancialYears = () => import('@/views/panel/company/FinancialYears.vue')

const Users = () => import('@/views/panel/user/Users')
const Roles = () => import('@/views/panel/role/Roles')
const Cities = () => import('@/views/panel/city/Cities')

const Accounts = () => import('../views/panel/account/Accounts.vue')
const FloatAccounts = () => import('../views/panel/account/FloatAccounts.vue')
const FloatAccountGroups = () => import('../views/panel/account/FloatAccountGroups.vue')
const AccountTree = () => import('@/views/panel/account/Tree.vue')

const DefaultAccounts = () => import('@/views/panel/defaultAccounts/DefaultAccounts.vue')

const WareLevels = () => import('@/views/panel/ware/WareLevels.vue')
const Wares = () => import('@/views/panel/ware/Wares.vue')

const Warehouses = () => import('@/views/panel/ware/Warehouses.vue')
const Units = () => import('@/views/panel/ware/Units.vue')

const Sanad = () => import('@/views/panel/sanad/Sanad.vue')
const SanadForm = () => import('@/views/panel/sanad/Form.vue')

const Transaction = () => import('@/views/panel/transaction/Transaction.vue')
const TransactionForm = () => import('@/views/panel/transaction/Form.vue')


const Factor = () => import('@/views/panel/factor/Factor.vue')
const FactorForm = () => import('@/views/panel/factor/Form.vue')
const FactorExpenses = () => import('@/views/panel/factor/Expenses.vue')

const TransferForm = () => import('@/views/panel/transfer/Form.vue')

const AdjustmentForm = () => import('@/views/panel/adjustment/Form.vue')

const ChequebookForm = () => import('../views/panel/chequebook/ChequebookForm.vue')

const Cheque = () => import('@/views/panel/cheque/Cheque.vue')
const ChequeDetail = () => import('../views/panel/cheque/ChequeDetail.vue')
const ChequeForm = () => import('../views/panel/cheque/ChequeForm.vue')

const ExportVerifiers = () => import('@/views/panel/exportVerifiers/ExportVerifiers.vue')

const Closing = () => import('../views/panel/closing/Closing.vue')

const ImprestSettlement = () => import('@/views/panel/imprestSettlement/ImprestSettlement')

import DashtbashiRoutes from '@/modules/dashtbashi/Routes';

export default [{
  name: 'Panel',
  path: '/panel',
  component: Panel,
  children: [
    ...DashtbashiRoutes,
    {
      name: 'Home',
      path: 'home',
      component: Home,
    },
    {
      name: 'Users',
      path: 'users/:id?',
      component: Users,
      props: true
    }, {
      name: 'Roles',
      path: 'roles',
      component: Roles,
    },
    {
      name: 'Cities',
      path: 'cities',
      component: Cities,
    }, {
      name: 'Companies',
      path: 'companies',
      component: Companies,
    },
    {
      name: 'FinancialYears',
      path: 'financialYears',
      component: FinancialYears,
    },
    {
      name: 'Accounts',
      path: 'accounts/:level/:account_type?',
      component: Accounts,
      props: true
    },
    {
      name: 'FloatAccountGroups',
      path: 'floatAccountGroups/:is_cost_center?',
      component: FloatAccountGroups,
      props: true
    },
    {
      name: 'FloatAccounts',
      path: 'floatAccounts/:is_cost_center?',
      component: FloatAccounts,
      props: true
    },
    {
      name: 'AccountTree',
      path: 'tree',
      component: AccountTree,
    },
    {
      name: 'WareLevels',
      path: 'wareLevels/:level',
      component: WareLevels,
      props: true
    },
    {
      name: 'Wares',
      path: 'wares',
      component: Wares,
    },
    {
      name: 'Warehouses',
      path: 'warehouses',
      component: Warehouses
    }, {
      name: 'Units',
      path: 'units',
      component: Units
    },
    {
      name: 'DefaultAccounts',
      path: 'defaultAccounts/:usage',
      component: DefaultAccounts,
      props: true
    },
    {
      name: 'Transaction',
      path: 'transaction',
      component: Transaction,
      children: [{
        name: 'TransactionForm',
        path: ':transactionType/:id?',
        component: TransactionForm,
        props: (route) => {
          return {
            factorId: route.query.factorId,
            accountId: route.query.accountId,
            ...route.params,
          };
        },
      }]
    },
    {
      name: 'ImprestSettlement',
      path: 'imprestSettlement/:id?',
      props: true,
      component: ImprestSettlement,
    },
    {
      name: 'Sanad',
      path: 'sanad',
      component: Sanad,
      children: [{
        name: 'SanadForm',
        path: 'form/:id?',
        props: true,
        component: SanadForm,
      }]
    },
    {
      name: 'Factor',
      path: 'factor',
      component: Factor,
      children: [{
          name: 'FactorForm',
          path: 'form/:type/:id?',
          component: FactorForm,
          props: (route) => {
            return {
              ...route.query,
              ...route.params
            }

          }
        },
        {
          name: 'FactorExpenses',
          path: 'expenses/:factorType',
          props: true,
          component: FactorExpenses
        },
      ]
    },
    {
      name: 'TransferForm',
      path: 'transfer/form/:id?',
      component: TransferForm,
      props: true,
    },
    {
      name: 'AdjustmentForm',
      path: 'adjustment/form/:type/:id?',
      component: AdjustmentForm,
      props: true,
    },
    {
      name: 'Cheque',
      path: 'cheque',
      component: Cheque,
      children: [{
          name: 'ChequeDetail',
          path: ':id/detail',
          component: ChequeDetail,
          props: true,
        },
        {
          name: 'ChequeForm',
          path: 'form/:receivedOrPaid/:id?',
          component: ChequeForm,
          props: true,
        },
      ]
    },
    {
      name: 'ChequebookForm',
      path: 'chequebooks/:id?',
      component: ChequebookForm,
      props: true,
    },

    {
      name: 'ExportVerifiers',
      path: 'exportVerifiers',
      component: ExportVerifiers,
    },

    {
      name: 'Closing',
      path: 'closing',
      component: Closing,
    }

  ]
}]