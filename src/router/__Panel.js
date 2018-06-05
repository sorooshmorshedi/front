import Panel from '@/components/panel/Panel';

import Company from '@/components/panel/company/Company';
import CreateCompany from '@/components/panel/company/Create';
import UpdateCompany from '@/components/panel/company/Update';
import CompaniesList from '@/components/panel/company/List';

import Account from '@/components/panel/account/Account';
import CreateAccount from '@/components/panel/account/Create';
import AccountTree from '@/components/panel/account/Tree';


export default [
   {
       name: 'Panel',
       path: '/panel',
       component: Panel,
       children: [
           {
               name: 'Company',
               path: 'company',
               component: Company,
               children: [
                   {
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
               children: [
                   {
                       name: 'CreateAccount',
                       path: 'create',
                       component: CreateAccount
                   },{
                       name: 'AccountTree',
                       path: 'tree',
                       component: AccountTree,

                   }
               ]
           }
       ]
   }
]