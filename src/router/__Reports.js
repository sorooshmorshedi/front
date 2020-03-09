import Panel from '@/components/panel/Panel';

import List from '@/components/panel/lists/List';
import Balance from '@/components/panel/balance/Balance';
import FloatBalance from '@/components/panel/FloatBalance/FloatBalance';
import Ledger from '@/components/panel/ledger/Ledger';
import Bill from '@/components/panel/bill/Bill';
import Journal from '@/components/panel/journal/Journal';
import IncomeStatement from '@/components/panel/incomeStatement/IncomeStatement';
import BalanceSheet from '@/components/panel/balanceSheet/BalanceSheet';
import BuySaleReport from '@/components/panel/buySaleReport/BuySaleReport';

import DetailedWareInventory from '@/components/panel/inventory/ware/detailed/DetailedWareInventory';
import AllWaresInventory from '@/components/panel/inventory/ware/all/AllWaresInventory';
import DetailedWarehouseInventory from '@/components/panel/inventory/warehouse/detailed/DetailedWarehouseInventory';
import AllWarehousesInventory from '@/components/panel/inventory/warehouse/all/AllWarehousesInventory';

export default [{
  name: 'Reports',
  path: '/report',
  component: Panel,
  children: [{
      name: 'List',
      path: 'lists/:form/:type?',
      component: List,
      props: (route) => {
        return {
          ...route.params,
          ...route.query
        }
      },
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
      name: 'BillReport',
      path: 'bill/:accountId?',
      component: Bill
    },
    {
      name: 'DetailedWareInventoryReport',
      path: 'inventory/ware/detailed',
      component: DetailedWareInventory,
      props: route => {
        return {
          wareId: route.query.wareId
        }
      }
    },
    {
      name: 'DetailedWarehouseInventoryReport',
      path: 'inventory/warehouse/detailed',
      component: DetailedWarehouseInventory,
      props: route => {
        return {
          warehouseId: route.query.warehouseId
        }
      }
    },
    {
      name: 'AllWaresInventoryReport',
      path: 'inventory/ware/all',
      component: AllWaresInventory,
    },
    {
      name: 'AllWarehousesInventoryReport',
      path: 'inventory/warehouse/all',
      component: AllWarehousesInventory,
    },
    {
      name: 'JournalReport',
      path: 'journal',
      component: Journal,
    },
    {
      name: 'IncomeStatementReport',
      path: 'incomeStatement/:detailed?',
      component: IncomeStatement,
      props: true,
    },
    {
      name: 'BalanceSheetReport',
      path: 'balanceSheet/:detailed?',
      component: BalanceSheet,
      props: true,
    },
    {
      name: 'BuySaleReport',
      path: 'buySaleReport/:type',
      component: BuySaleReport,
      props: route => {
        return {
          wareId: route.query.wareId,
          ...route.params
        }
      }
    }
  ]
}]
