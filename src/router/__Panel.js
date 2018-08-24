import Panel from '@/components/panel/Panel';

import Company from '@/components/panel/company/Company';
import CreateCompany from '@/components/panel/company/Create';
import UpdateCompany from '@/components/panel/company/Update';
import CompaniesList from '@/components/panel/company/List';

import Account from '@/components/panel/account/Account';
import CreateAccount from '@/components/panel/account/Create';
import EditAccount from '@/components/panel/account/Edit';
import AccountTree from '@/components/panel/account/Tree';
import CostCenter from '@/components/panel/account/CostCenter';
import IndependentAccount from '@/components/panel/account/IndependentAccount';

import Ware from '@/components/panel/ware/Ware';
import CreateWare from '@/components/panel/ware/Create';
import EditWare from '@/components/panel/ware/Edit';
import Warehouse from '@/components/panel/ware/Warehouse';
import Unit from '@/components/panel/ware/Unit';

import Sanad from '@/components/panel/sanad/Sanad';
import CreateSanad from '@/components/panel/sanad/Create';

import Transaction from '@/components/panel/transaction/Transaction';
import TransactionForm from '@/components/panel/transaction/Form';

import DefaultAccounts from '@/components/panel/defaultAccounts/DefaultAccounts';

import Factor from '@/components/panel/factor/Factor';
import FactorForm from '@/components/panel/factor/Form';
import FactorExpenses from '@/components/panel/factor/Expenses';


import Cheque from '@/components/panel/cheque/Cheque';
import Chequebook from '@/components/panel/cheque/Chequebook';
import ReceivedCheques from '@/components/panel/cheque/ReceivedCheques';


export default [{
  name: 'Panel',
  path: '/panel',
  component: Panel,
  children: [{
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
      name: 'Account',
      path: 'account',
      component: Account,
      children: [{
        name: 'CreateAccount',
        path: 'create',
        component: CreateAccount
      }, {
        name: 'EditAccount',
        path: 'edit',
        component: EditAccount
      }, {
        name: 'AccountTree',
        path: 'tree',
        component: AccountTree,

      }, {
        name: 'CostCenter',
        path: 'costCenter',
        component: CostCenter,

      }, {
        name: 'IndependentAccount',
        path: 'independentAccount',
        component: IndependentAccount,
      }]
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
      path: 'defaultAccounts',
      component: DefaultAccounts,
    },
    {
      name: 'Transaction',
      path: 'transaction',
      component: Transaction,
      children: [{
        name: 'TransactionForm',
        path: ':transactionType',
        props: true,
        component: TransactionForm
      }]
    },
    {
      name: 'Sanad',
      path: 'sanad',
      component: Sanad,
      children: [{
        name: 'CreateSanad',
        path: 'create/:id?',
        props: true,
        component: CreateSanad,
      }]
    },
    {
      name: 'Factor',
      path: 'factor',
      component: Factor,
      children: [{
          name: 'FactorForm',
          path: 'form/:factorType/:id?',
          props: true,
          component: FactorForm
        },
        {
          name: 'FactorExpenses',
          path: 'expenses/:factorType',
          props: true,
          component: FactorExpenses
        }
      ]
    },
    {
      name: 'Cheque',
      path: 'cheque',
      component: Cheque,
      children: [{
          name: 'Chequebook',
          path: 'chequebook',
          component: Chequebook,
        },
        {
          name: 'ReceivedCheques',
          path: 'receivedCheques',
          component: ReceivedCheques,

        }
      ]
    }

  ]
}]
