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

import Ware from '@/components/panel/Ware/Ware';
import CreateWare from '@/components/panel/Ware/Create';
import EditWare from '@/components/panel/Ware/Edit';
import WareHouse from '@/components/panel/Ware/WareHouse';
import Unit from '@/components/panel/Ware/Unit';

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
    }
  ]
}]
