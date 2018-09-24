import Panel from '@/components/panel/Panel';

import List from '@/components/panel/lists/List';
import Balance from '@/components/panel/balance/Balance';
import Ledger from '@/components/panel/ledger/Ledger';
import Journal from '@/components/panel/journal/Journal';
import IncomeStatement from '@/components/panel/incomeStatement/IncomeStatement';

export default [{
  name: 'Reports',
  path: '/report',
  component: Panel,
  children: [{
      name: 'List',
      path: 'lists/:form/:type?',
      component: List,
      props: true,
    },
    {
      name: 'BalanceReport',
      path: 'balance',
      component: Balance,
    },
    {
      name: 'LedgerReport',
      path: 'ledger',
      component: Ledger,
      props: route => {
        return {
          ledgerAccountIds: route.query.accs
        }
      }
    },
    {
      name: 'JournalReport',
      path: 'journal',
      component: Journal,
    },
    {
      name: 'IncomeStatementReport',
      path: 'incomeStatement',
      component: IncomeStatement,
    },
  ]
}]
