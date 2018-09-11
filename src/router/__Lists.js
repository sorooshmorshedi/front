import Panel from '@/components/panel/Panel';

import TransactionsList from '@/components/panel/lists/Transactions';

export default [{
  name: 'Lists',
  path: '/panel',
  component: Panel,
  children: [{
      name: 'TransactionsList',
      path: '/transactions/:transactionType',
      component: TransactionsList,
      props: true,
    }
  ]
}]
