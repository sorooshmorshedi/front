const Panel = () => import('@/views/panel/Panel.vue');

const List = () => import('@/views/panel/lists/List.vue');

const AccountsCoding = () => import('../views/panel/account/Coding');

const AccountsBalance = () => import('../views/panel/balance/accounts/AccountsBalance.vue');
const FloatAccountsBalanceByGroup = () => import('../views/panel/balance/floatAccountsByGroup/FloatAccountsBalanceByGroup.vue');
const FloatAccountsBalance = () => import('../views/panel/balance/floatAccounts/FloatAccountsBalance.vue');

const Ledger = () => import('@/views/panel/ledger/Ledger.vue');
const Bill = () => import('@/views/panel/bill/Bill.vue');
const Journal = () => import('@/views/panel/journal/Journal.vue');
const IncomeStatement = () => import('@/views/panel/incomeStatement/IncomeStatement.vue');
const BalanceSheet = () => import('@/views/panel/balanceSheet/BalanceSheet.vue');
const BuySaleReport = () => import('@/views/panel/buySaleReport/BuySaleReport.vue');

const DetailedWareInventory = () => import('@/views/panel/inventory/ware/DetailedWareInventory.vue');
const AllWaresInventory = () => import('@/views/panel/inventory/ware/AllWaresInventory.vue');
const DetailedWarehouseInventory = () => import('@/views/panel/inventory/warehouse/DetailedWarehouseInventory.vue');
const AllWarehousesInventory = () => import('@/views/panel/inventory/warehouse/AllWarehousesInventory.vue');

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
      props: (route) => {
        return {
          wareId: route.query.wareId
        }
      }
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