import Panel from '@/views/panel/Panel.vue';

import Home from '@/views/panel/Home.vue';

import Companies from '@/views/panel/company/Companies.vue';
import FinancialYears from '@/views/panel/company/FinancialYears.vue';

import Users from '@/views/panel/user/Users';
import Roles from '@/views/panel/role/Roles';
import Cities from '@/views/panel/city/Cities';

import Accounts from '../views/panel/account/Accounts.vue';
import FloatAccounts from '../views/panel/account/FloatAccounts.vue';
import FloatAccountGroups from '../views/panel/account/FloatAccountGroups.vue';
import AccountTree from '@/views/panel/account/Tree.vue';

import DefaultAccounts from '@/views/panel/defaultAccounts/DefaultAccounts.vue';

import WareLevels from '@/views/panel/ware/WareLevels.vue';
import Wares from '@/views/panel/ware/Wares.vue';

import Warehouses from '@/views/panel/ware/Warehouses.vue';
import Units from '@/views/panel/ware/Units.vue';

import Sanad from '@/views/panel/sanad/Sanad.vue';
import SanadForm from '@/views/panel/sanad/Form.vue';

import Transaction from '@/views/panel/transaction/Transaction.vue';
import TransactionForm from '@/views/panel/transaction/Form.vue';


import Factor from '@/views/panel/factor/Factor.vue';
import FactorForm from '@/views/panel/factor/Form.vue';
import FactorExpenses from '@/views/panel/factor/Expenses.vue';

import TransferForm from '@/views/panel/transfer/Form.vue';

import ChequebookForm from '../views/panel/chequebook/ChequebookForm.vue';

import Cheque from '@/views/panel/cheque/Cheque.vue';
import ChequeDetail from '../views/panel/cheque/ChequeDetail.vue';
import ChequeForm from '../views/panel/cheque/ChequeForm.vue';

import ExportVerifiers from '@/views/panel/exportVerifiers/ExportVerifiers.vue';

import Closing from '../views/panel/closing/Closing.vue';

import DashtbashiRoutes from '@/modules/dashtbashi/Router';

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
      path: 'users',
      component: Users,
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
          path: 'form/:factorType/:id?',
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