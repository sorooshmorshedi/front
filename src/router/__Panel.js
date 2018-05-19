import Index from '@/components/panel/Index';

import Company from '@/components/panel/company/Index';
import CreateCompany from '@/components/panel/company/Create';

export default [
   {
       name: 'Panel',
       path: 'panel',
       component: Index,
       children: [
           {
               name: 'Company',
               path: 'company',
               component: Company,
               children: [
                   {
                       name: 'Create',
                       path: 'create',
                       component: CreateCompany,
                   }
               ]
           }
       ]
   } 
]