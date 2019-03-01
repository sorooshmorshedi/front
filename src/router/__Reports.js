import Panel from '@/components/panel/Panel';

import List from '@/components/panel/lists/List';
import Balance from '@/components/panel/balance/Balance';
import FloatBalance from '@/components/panel/FloatBalance/FloatBalance';
import Ledger from '@/components/panel/ledger/Ledger';
import Journal from '@/components/panel/journal/Journal';
import IncomeStatement from '@/components/panel/incomeStatement/IncomeStatement';
import BalanceSheet from '@/components/panel/balanceSheet/BalanceSheet';
import Inventory from '@/components/panel/inventory/Inventory';

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
      name: 'FloatBalanceReport',
      path: 'balance/float',
      component: FloatBalance,
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
      name: 'InventoryReport',
      path: 'inventory',
      component: Inventory,
      props: route => {
        return {
          wareId: route.query.wareId
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
    {
      name: 'BalanceSheetReport',
      path: 'balanceSheet',
      component: BalanceSheet,
    },
  ]
}]
