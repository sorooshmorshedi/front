import Panel from '@/components/panel/Panel';

import Company from '@/components/panel/company/Company';
import CreateCompany from '@/components/panel/company/Create';
import UpdateCompany from '@/components/panel/company/Update';
import CompaniesList from '@/components/panel/company/List';

import Account from '@/components/panel/account/Account';

import CreateAccounts from '@/components/panel/account/CreateAccounts';
import CreateFloatAccounts from '@/components/panel/account/CreateFloatAccounts';
import CreatePersonAccounts from '@/components/panel/account/CreatePersonAccounts';
import CreateBankAccounts from '@/components/panel/account/CreateBankAccounts';

import EditAccounts from '@/components/panel/account/EditAccounts';
import EditFloatAccounts from '@/components/panel/account/EditFloatAccounts';
import EditPersonAccounts from '@/components/panel/account/EditPersonAccounts';
import EditBankAccounts from '@/components/panel/account/EditBankAccounts';

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

import TransactionDefaultAccounts from '@/components/panel/defaultAccounts/TransactionDefaultAccounts';
import FactorDefaultAccounts from '@/components/panel/defaultAccounts/FactorDefaultAccounts';

import Factor from '@/components/panel/factor/Factor';
import FactorForm from '@/components/panel/factor/Form';
import FactorExpenses from '@/components/panel/factor/Expenses';
import ReceiptAndRemittance from '@/components/panel/factor/ReceiptAndRemittance';

import Cheque from '@/components/panel/cheque/Cheque';
import Chequebook from '@/components/panel/cheque/Chequebook';
import ReceivedCheques from '@/components/panel/cheque/ReceivedCheques';

import ExportVerifiers from '@/components/panel/exportVerifiers/ExportVerifiers';

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
        name: 'CreateAccounts',
        path: 'createAccounts',
        component: CreateAccounts
      }, {
        name: 'CreatePersonAccounts',
        path: 'createPersonAccounts',
        component: CreatePersonAccounts
      }, {
        name: 'CreateFloatAccounts',
        path: 'createFloatAccounts',
        component: CreateFloatAccounts
      }, {
        name: 'CreateBankAccounts',
        path: 'createBankAccounts',
        component: CreateBankAccounts
      }, {
        name: 'EditAccounts',
        path: 'editAccounts',
        component: EditAccounts
      }, {
        name: 'EditPersonAccounts',
        path: 'editPersonAccounts',
        component: EditPersonAccounts
      }, {
        name: 'EditFloatAccounts',
        path: 'editFloatAccounts',
        component: EditFloatAccounts
      }, {
        name: 'EditBankAccounts',
        path: 'editBankAccounts',
        component: EditBankAccounts
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
      name: 'TransactionDefaultAccounts',
      path: 'defaultAccounts/transaction',
      component: TransactionDefaultAccounts,
    },
    {
      name: 'FactorDefaultAccounts',
      path: 'defaultAccounts/factor',
      component: FactorDefaultAccounts,
    },
    {
      name: 'Transaction',
      path: 'transaction',
      component: Transaction,
      children: [{
        name: 'TransactionForm',
        path: ':transactionType/:id?',
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
        },
      ]
    },
    {
      name: 'ReceiptAndRemittance',
      path: 'receiptAndRemittance/:receiptType/:id?',
      props: true,
      component: ReceiptAndRemittance
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
    },
    {
      name: 'ExportVerifiers',
      path: 'exportVerifiers',
      component: ExportVerifiers,
    }

  ]
}]
