import Panel from '@/views/panel/Panel.vue';

import TransactionsList from '@/views/panel/lists/TransactionsList.vue';
import FactorsList from '@/views/panel/lists/FactorsList.vue';
import FactorsAggregatedSanadsList from '@/views/panel/lists/FactorsAggregatedSanadsList.vue';
import SanadsList from '@/views/panel/lists/SanadsList.vue';
import SanadItemsList from '@/views/panel/lists/SanadItemsList.vue';
import TransfersList from '@/views/panel/lists/TransfersList.vue';
import ChequesList from '@/views/panel/lists/ChequesList.vue';
import AdjustmentsList from '@/views/panel/lists/AdjustmentsList.vue';
import WarehouseHandlingList from '@/views/panel/lists/WarehouseHandlingList.vue';
import SalePricesList from '@/views/panel/lists/SalePricesList.vue';

import AccountsCoding from '../views/panel/account/Coding';

import AccountsBalance from '../views/panel/balance/accounts/AccountsBalance.vue';
import FloatAccountsBalanceByGroup from '../views/panel/balance/floatAccountsByGroup/FloatAccountsBalanceByGroup.vue';
import FloatAccountsBalance from '../views/panel/balance/floatAccounts/FloatAccountsBalance.vue';

import Ledger from '@/views/panel/ledger/Ledger.vue';
import Bill from '@/views/panel/bill/Bill.vue';
import Journal from '@/views/panel/journal/Journal.vue';
import IncomeStatement from '@/views/panel/incomeStatement/IncomeStatement.vue';
import BalanceSheet from '@/views/panel/balanceSheet/BalanceSheet.vue';
import BuySaleReport from '@/views/panel/buySaleReport/BuySaleReport.vue';

import DetailedWareInventory from '@/views/panel/inventory/ware/DetailedWareInventory.vue';
import AllWaresInventory from '@/views/panel/inventory/ware/AllWaresInventory.vue';
import DetailedWarehouseInventory from '@/views/panel/inventory/warehouse/DetailedWarehouseInventory.vue';
import AllWarehousesInventory from '@/views/panel/inventory/warehouse/AllWarehousesInventory.vue';

export default [{
  name: 'Reports',
  path: '/report',
  component: Panel,
  children: [{
      name: 'TransfersList',
      path: 'lists/transfers',
      component: TransfersList,
    },
    {
      name: 'SanadsList',
      path: 'lists/sanads/:type?',
      component: SanadsList,
      props: true
    },
    {
      name: 'SanadItemsList',
      path: 'lists/sanadItems',
      component: SanadItemsList,
    },
    {
      name: 'FactorsAggregatedSanadsList',
      path: 'lists/factors/aggregatedSanads/:type',
      component: FactorsAggregatedSanadsList,
      props: true
    },
    {
      name: 'FactorsList',
      path: 'lists/factors/:type/:isPreFactor',
      component: FactorsList,
      props: (route) => {
        let isPreFactor = [true, 'true'].includes(route.params.isPreFactor)
        return {
          ...route.params,
          isPreFactor: isPreFactor
        }
      }
    },
    {
      name: 'TransactionsList',
      path: 'lists/transactions/:type',
      component: TransactionsList,
      props: true
    },
    {
      name: 'ChequesList',
      path: 'lists/cheques/:type',
      component: ChequesList,
      props: true
    },
    {
      name: 'AdjustmentsList',
      path: 'lists/adjustments/:type',
      component: AdjustmentsList,
      props: true
    },
    {
      name: 'WarehouseHandlingList',
      path: 'lists/warehouseHandling',
      component: WarehouseHandlingList,
    },
    {
      name: 'SalePricesList',
      path: 'lists/salePrices',
      component: SalePricesList,
    },

    {
      name: 'AccountsCoding',
      path: 'accountsCoding',
      component: AccountsCoding,
    },
    {
      name: 'AccountsBalanceReport',
      path: 'balance/accounts',
      component: AccountsBalance,
    },
    {
      name: 'FloatAccountsBalanceReportByGroup',
      path: 'balance/floatAccountsByGroup/:is_cost_center?',
      component: FloatAccountsBalanceByGroup,
      props: true
    },
    {
      name: 'FloatAccountsBalanceReport',
      path: 'balance/floatAccounts/:is_cost_center?',
      component: FloatAccountsBalance,
      props: true
    },
    {
      name: 'LedgerReport',
      path: 'ledger/:level?',
      component: Ledger,
      props: (route) => {
        return {
          ledgerAccountIds: route.query.accs,
          ...route.params
        }
      },
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
    },
    {
      name: 'DetailedWarehouseInventoryReport',
      path: 'inventory/warehouse/detailed',
      component: DetailedWarehouseInventory,
      props: (route) => {
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
      props: (route) => {
        return {
          wareId: route.query.wareId,
          ...route.params
        }
      }
    }
  ]
}]