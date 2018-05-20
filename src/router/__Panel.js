import Panel from '@/components/panel/Panel';

import Company from '@/components/panel/company/Company';
import CreateCompany from '@/components/panel/company/Create';

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
                   }
               ]
           }
       ]
   }
]