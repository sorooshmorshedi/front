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
import WareHouse from '@/components/panel/ware/WareHouse';
import Unit from '@/components/panel/ware/Unit';

import Sanad from '@/components/panel/sanad/Sanad';
import CreateSanad from '@/components/panel/sanad/Create';

import Receive from '@/components/panel/receive/Receive';
import CreateReceive from '@/components/panel/receive/Create';

import RPType from '@/components/panel/RPType/RPType';

import Factor from '@/components/panel/factor/Factor';
import CreateFactor from '@/components/panel/factor/Create';


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
        name: 'WareHouse',
        path: 'wareHouse',
        component: WareHouse
      }, {
        name: 'Unit',
        path: 'unit',
        component: Unit
      }]
    },
    {
      name: 'RPType',
      path: 'receiveAndPaymentTypes',
      component: RPType,
    },
    {
      name: 'Receive',
      path: 'receive',
      component: Receive,
      children: [{
        name: 'CreateReceive',
        path: 'create',
        component: CreateReceive
      }]
    },
    {
      name: 'Sanad',
      path: 'sanad',
      component: Sanad,
      children: [{
        name: 'CreateSanad',
        path: 'create',
        component: CreateSanad
      }]
    },
    {
      name: 'Factor',
      path: 'factor',
      component: Factor,
      children: [{
        name: 'CreateFactor',
        path: 'create',
        component: CreateFactor
      }]
    },

  ]
}]
