import Panel from '@/views/panel/Panel.vue';

import Profile from '@/views/auth/Profile.vue';

import Home from '@/views/panel/Home.vue';

import Companies from '@/views/panel/company/Companies.vue';
import FinancialYears from '@/views/panel/company/FinancialYears.vue';

import NotificationsList from '@/views/panel/user/NotificationsList';
import NotificationForm from '@/views/panel/user/NotificationForm';

import Users from '@/views/panel/user/Users';
import UserInvitations from '@/views/panel/user/UserInvitations';
import Roles from '@/views/panel/role/Roles';
import Cities from '@/views/panel/city/Cities';

import Accounts from '../views/panel/account/Accounts.vue';
import FloatAccounts from '../views/panel/account/FloatAccounts.vue';
import FloatAccountGroups from '../views/panel/account/FloatAccountGroups.vue';
import AccountsTree from '@/views/panel/account/AccountsTree.vue';

import DefaultAccounts from '@/views/panel/defaultAccounts/DefaultAccounts.vue';

import Wares from '@/views/panel/ware/Wares.vue';
import WaresTree from '@/views/panel/ware/WaresTree.vue';

import Warehouses from '@/views/panel/ware/Warehouses.vue';
import Units from '@/views/panel/ware/Units.vue';
import SalePriceTypes from '@/views/panel/ware/SalePriceTypes.vue';

import Sanad from '@/views/panel/sanad/Sanad.vue';
import SanadForm from '@/views/panel/sanad/Form.vue';

import Transaction from '@/views/panel/transaction/Transaction.vue';
import TransactionForm from '@/views/panel/transaction/Form.vue';
import BankingOperations from '@/views/panel/transaction/BankingOperations.vue';

import Factor from '@/views/panel/factor/Factor.vue';
import FactorForm from '@/views/panel/factor/Form.vue';
import FactorExpenses from '@/views/panel/factor/Expenses.vue';

import FactorsAggregatedSanadForm from '@/views/panel/factorsAggregatedSanad/Form';

import TransferForm from '@/views/panel/transfer/Form.vue';

import AdjustmentForm from '@/views/panel/adjustment/Form.vue';

import WarehouseHandlingForm from '@/views/panel/warehouseHandling/Form.vue';

import ChequebookForm from '../views/panel/chequebook/ChequebookForm.vue';

import Cheque from '@/views/panel/cheque/Cheque.vue';
import ChequeDetail from '../views/panel/cheque/ChequeDetail.vue';
import ChequeForm from '../views/panel/cheque/ChequeForm.vue';

import ExportVerifiers from '@/views/panel/exportVerifiers/ExportVerifiers.vue';

import Closing from '../views/panel/closing/Closing.vue';

import ImprestSettlement from '@/views/panel/imprestSettlement/ImprestSettlement';

import DefaultTexts from '@/views/panel/defaultTexts/DefaultTexts';

import DashtbashiRoutes from '@/modules/dashtbashi/Routes';
import DistributionRoutes from '@/modules/distribution/Routes';
import ContractingRoutes from '@/modules/contracting/Routes'
import PayrollRoutes from '@/modules/payroll/Routes'

export default [{
  name: 'Panel',
  path: '/panel',
  component: Panel,
  children: [
    ...DashtbashiRoutes,
    ...DistributionRoutes,
    ...ContractingRoutes,
    ...PayrollRoutes,
    {
      name: 'Profile',
      path: 'profile',
      component: Profile,
    },
    {
      name: 'Home',
      path: 'home',
      component: Home,
    },
    {
      name: 'NotificationForm',
      path: 'notificationForm/:type',
      component: NotificationForm,
      props: true,
    },
    {
      name: 'NotificationsList',
      path: 'notificationsList',
      component: NotificationsList,
    },
    {
      name: 'Users',
      path: 'users/:id?',
      component: Users,
    },
    {
      name: 'UserInvitations',
      path: 'userInvitations',
      component: UserInvitations,
    },
    {
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
      name: 'AccountsTree',
      path: 'accounts/tree',
      component: AccountsTree,
    },
    {
      name: 'Accounts',
      path: 'accounts/:level/:accountType?',
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
      name: 'WaresTree',
      path: 'wares/tree',
      component: WaresTree,
    },
    {
      name: 'Wares',
      path: 'wares/:level',
      component: Wares,
      props: true
    },
    {
      name: 'Warehouses',
      path: 'warehouses',
      component: Warehouses
    },
    {
      name: 'Units',
      path: 'units',
      component: Units
    },
    {
      name: 'SalePriceTypes',
      path: 'salePriceTypes',
      component: SalePriceTypes
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
          name: 'BankingOperations',
          path: 'bankingOperations',
          component: BankingOperations,
        },
        {
          name: 'TransactionForm',
          path: ':type/:id?',
          component: TransactionForm,
          props: (route) => {
            return {
              accountId: route.query.accountId,
              ...route.params,
            };
          },
        },
      ]
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
          path: 'form/:isPreFactor/:type/:id?',
          component: FactorForm,
          props: (route) => {
            let isPreFactor = [true, 'true'].includes(route.params.isPreFactor)
            return {
              ...route.query,
              ...route.params,
              isPreFactor: isPreFactor
            }
          }
        },
        {
          name: 'FactorExpenses',
          path: 'expenses/:factorType',
          props: true,
          component: FactorExpenses
        },
        {
          name: 'FactorsAggregatedSanadForm',
          path: 'aggregatedSanadForm/:type/:id?',
          props: true,
          component: FactorsAggregatedSanadForm
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
      name: 'WarehouseHandlingForm',
      path: 'warehouseHandling/form/:id?',
      component: WarehouseHandlingForm,
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
          path: 'form/:type/:isPaid/:id?',
          component: ChequeForm,
          props: (route) => {
            return {
              ...route.params,
              isPaid: [true, 'true'].includes(route.params.isPaid)
            }
          },
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
    },

    {
      name: 'DefaultTexts',
      path: 'defaultTexts/:usage',
      component: DefaultTexts,
      props: true
    },


  ]
}]