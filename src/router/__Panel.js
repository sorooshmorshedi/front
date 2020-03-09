import Panel from '@/components/panel/Panel';

import Home from '@/components/panel/Home';

import Company from '@/components/panel/company/Company';
import CreateCompany from '@/components/panel/company/Create';
import UpdateCompany from '@/components/panel/company/Update';
import CompaniesList from '@/components/panel/company/List';

import Accounts from '../components/panel/account/Accounts.vue';
import FloatAccounts from '../components/panel/account/FloatAccounts.vue';
import FloatAccountGroups from '../components/panel/account/FloatAccountGroups.vue';
import AccountTree from '@/components/panel/account/Tree';

import DefaultAccounts from '@/components/panel/defaultAccounts/DefaultAccounts';

import Ware from '@/components/panel/ware/Ware';
import CreateWare from '@/components/panel/ware/Create';
import EditWare from '@/components/panel/ware/Edit';
import Warehouse from '@/components/panel/ware/Warehouse';
import Unit from '@/components/panel/ware/Unit';

import Sanad from '@/components/panel/sanad/Sanad';
import SanadForm from '@/components/panel/sanad/Form';

import Transaction from '@/components/panel/transaction/Transaction';
import TransactionForm from '@/components/panel/transaction/Form';


import Factor from '@/components/panel/factor/Factor';
import FactorForm from '@/components/panel/factor/Form';
import FactorExpenses from '@/components/panel/factor/Expenses';

import TransferForm from '@/components/panel/transfer/Form';

import FirstPeriodInventory from '@/components/panel/firstPeriodInventory/FirstPeriodInventory';

import Chequebook from '../components/panel/chequebook/Chequebook.vue';
import ChequebookForm from '../components/panel/chequebook/ChequebookForm.vue';

import Cheque from '@/components/panel/cheque/Cheque';
import ChequeDetail from '../components/panel/cheque/ChequeDetail.vue';
import ChequeForm from '../components/panel/cheque/ChequeForm.vue';

import ExportVerifiers from '@/components/panel/exportVerifiers/ExportVerifiers';

export default [{
  name: 'Panel',
  path: '/panel',
  component: Panel,
  children: [{

      name: 'Home',
      path: 'home',
      component: Home,
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
      name: 'FloatAccounts',
      path: 'floatAccounts',
      component: FloatAccounts
    },
    {
      name: 'FloatAccountGroups',
      path: 'floatAccountGroups',
      component: FloatAccountGroups
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
        props: route => {
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
          props: route => {
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
    }

  ]
}]
