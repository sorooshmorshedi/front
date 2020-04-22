import Panel from '@/views/panel/Panel.vue';

import Home from '@/views/panel/Home.vue';

import Company from '@/views/panel/company/Company.vue';
import CreateCompany from '@/views/panel/company/Create.vue';
import UpdateCompany from '@/views/panel/company/Update.vue';
import CompaniesList from '@/views/panel/company/List.vue';

import Users from '@/views/panel/user/Users';
import Roles from '@/views/panel/role/Roles';

import Accounts from '../views/panel/account/Accounts.vue';
import FloatAccounts from '../views/panel/account/FloatAccounts.vue';
import FloatAccountGroups from '../views/panel/account/FloatAccountGroups.vue';
import AccountTree from '@/views/panel/account/Tree.vue';

import DefaultAccounts from '@/views/panel/defaultAccounts/DefaultAccounts.vue';

import Ware from '@/views/panel/ware/Ware.vue';
import CreateWare from '@/views/panel/ware/Create.vue';
import EditWare from '@/views/panel/ware/Edit.vue';
import Warehouse from '@/views/panel/ware/WareHouse.vue';
import Unit from '@/views/panel/ware/Unit.vue';

import Sanad from '@/views/panel/sanad/Sanad.vue';
import SanadForm from '@/views/panel/sanad/Form.vue';

import Transaction from '@/views/panel/transaction/Transaction.vue';
import TransactionForm from '@/views/panel/transaction/Form.vue';


import Factor from '@/views/panel/factor/Factor.vue';
import FactorForm from '@/views/panel/factor/Form.vue';
import FactorExpenses from '@/views/panel/factor/Expenses.vue';

import TransferForm from '@/views/panel/transfer/Form.vue';

import FirstPeriodInventory from '@/views/panel/firstPeriodInventory/FirstPeriodInventory.vue';

import Chequebook from '../views/panel/chequebook/Chequebook.vue';
import ChequebookForm from '../views/panel/chequebook/ChequebookForm.vue';

import Cheque from '@/views/panel/cheque/Cheque.vue';
import ChequeDetail from '../views/panel/cheque/ChequeDetail.vue';
import ChequeForm from '../views/panel/cheque/ChequeForm.vue';

import ExportVerifiers from '@/views/panel/exportVerifiers/ExportVerifiers.vue';

import Closing from '../views/panel/closing/Closing.vue';

export default [{
  name: 'Panel',
  path: '/panel',
  component: Panel,
  children: [{
      name: 'Home',
      path: 'home',
      component: Home,
    },
    {
      name: 'Users',
      path: 'users',
      component: Users,
    },{
      name: 'Roles',
      path: 'roles',
      component: Roles,
    }, {
      name: 'Company',
      path: 'company',
      component: Company,
      children: [{
          name: 'CreateCompany',
          path: 'create',
          component: CreateCompany,
        },
        {
          name: 'CompaniesList',
          path: 'list',
          component: CompaniesList,
        },
        {
          name: 'UpdateCompany',
          path: 'update/:id',
          component: UpdateCompany,
          props: true,
        }
      ]
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
      name: 'Ware',
      path: 'ware',
      component: Ware,
      children: [{
        name: 'CreateWare',
        path: 'create',
        component: CreateWare
      }, {
        name: 'EditWare',
        path: 'edit',
        component: EditWare
      }, {
        name: 'Warehouse',
        path: 'warehouse',
        component: Warehouse
      }, {
        name: 'Unit',
        path: 'unit',
        component: Unit
      }]
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
      name: 'FirstPeriodInventory',
      path: 'firstPeriodInventory',
      component: FirstPeriodInventory
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
      name: 'Chequebook',
      path: 'chequebook',
      component: Chequebook,
      children: [{
          name: 'ChequebookForm',
          path: 'form/:id?',
          component: ChequebookForm,
          props: true,
        },

      ]
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
