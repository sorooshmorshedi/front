<template>
  <v-list nav dense class="navbar-list white--text">
    <navbar-list-item
      v-for="(route, i) in routes"
      class="level-0"
      :key="i"
      :route="route"
      :level="1"
      v-if="route.show"
    />
  </v-list>
</template>

<script>
import NavbarListItem from "./NavbarListItem";
export default {
  name: "NavBar",
  components: { NavbarListItem },
  data() {
    return {};
  },
  computed: {
    /*
      returns all routes
      if called outside of component it will miss some params or queries, but names & titles are currect
    */
    allRoutes() {
      return [
        {
          title: "خانه",
          icon: "fa-home",
          to: {
            name: "Home",
          },
        },
        {
          title: "تعاریف",
          icon: "fa-database",
          children: [
            {
              title: "اطلاعات پایه",
              children: [
                {
                  to: {
                    name: "Users",
                  },
                  title: "کاربران",
                  perm: "user",
                },
                {
                  to: {
                    name: "Roles",
                  },
                  title: "نقش ها",
                  perm: "role",
                },
                {
                  title: "شرکت ها",
                  to: {
                    name: "Companies",
                  },
                  perm: "company",
                },
                {
                  title: "سال های مالی",
                  to: {
                    name: "FinancialYears",
                  },
                  perm: "financialYear",
                },
                {
                  to: {
                    name: "Cities",
                  },
                  title: "شهر ها",
                  perm: "city",
                },
              ],
            },
            {
              title: "حساب",
              children: [
                {
                  to: {
                    name: "Accounts",
                    params: {
                      level: 0,
                    },
                  },
                  title: "گروه حساب",
                  perm: "account0",
                },
                {
                  perm: "account1",
                  to: {
                    name: "Accounts",
                    params: {
                      level: 1,
                    },
                  },
                  title: "حساب کل",
                },
                {
                  perm: "account2",
                  to: {
                    name: "Accounts",
                    params: {
                      level: 2,
                    },
                  },
                  title: "حساب معین",
                },
                {
                  perm: "account3",
                  to: {
                    name: "Accounts",
                    params: {
                      level: 3,
                    },
                  },
                  title: "حساب تفضیلی",
                },
                {
                  perm: "account3",
                  to: {
                    name: "Accounts",
                    params: {
                      level: 3,
                      account_type: "p",
                    },
                  },
                  title: "اشخاص",
                },
                {
                  perm: "account3",
                  to: {
                    name: "Accounts",
                    params: {
                      level: 3,
                      account_type: "b",
                    },
                  },
                  title: "بانک",
                },
                {
                  perm: "account",
                  to: {
                    name: "AccountTree",
                  },
                  title: "نمودار درختی حساب ها",
                },
              ],
            },
            {
              title: "شناور و مراکز",
              children: [
                {
                  perm: "floatAccountGroup",
                  to: {
                    name: "FloatAccountGroups",
                  },
                  title: "گروه حساب شناور",
                },
                {
                  perm: "floatAccount",
                  to: {
                    name: "FloatAccounts",
                  },
                  title: "حساب شناور",
                },
                {
                  perm: "floatAccountGroup",
                  to: {
                    name: "FloatAccountGroups",
                    params: {
                      is_cost_center: true,
                    },
                  },
                  title: "گروه مرکز هزینه و درآمد",
                },
                {
                  perm: "floatAccount",
                  to: {
                    name: "FloatAccounts",
                    params: {
                      is_cost_center: true,
                    },
                  },
                  title: "مرکز هزینه و درآمد",
                },
              ],
            },
            {
              title: "کالا",
              children: [
                {
                  perm: "ware",
                  to: {
                    name: "Wares",
                    params: {
                      level: 0,
                    },
                  },
                  title: "ماهیت",
                },
                {
                  perm: "ware",
                  to: {
                    name: "Wares",
                    params: {
                      level: 1,
                    },
                  },
                  title: "گروه",
                },
                {
                  perm: "ware",
                  to: {
                    name: "Wares",
                    params: {
                      level: 2,
                    },
                  },
                  title: "دسته بندی",
                },
                {
                  perm: "ware",
                  to: {
                    name: "Wares",
                    params: {
                      level: 3,
                    },
                  },
                  title: "کالا",
                },
                {
                  perm: "warehouse",
                  to: {
                    name: "Warehouses",
                  },
                  title: "انبار",
                },
                {
                  perm: "unit",
                  to: {
                    name: "Units",
                  },
                  title: "واحد",
                },
                {
                  perm: "firstPeriodInventory",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "firstPeriodInventory",
                    },
                  },
                  title: "ثبت موجودی اول دوره",
                },
              ],
            },
            {
              title: "پیشفرض ها",
              children: [
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "receive",
                    },
                  },
                  title: "حساب های دریافت",
                },
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "payment",
                    },
                  },
                  title: "حساب های پرداخت",
                },
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "factor",
                    },
                  },
                  title: "حساب های فاکتور",
                },
                {
                  perm: "factorExpenses",
                  to: {
                    name: "FactorExpenses",
                    params: {
                      factorType: "buy",
                    },
                  },
                  title: "هزینه های فاکتور خرید",
                },
                {
                  perm: "factorExpenses",
                  to: {
                    name: "FactorExpenses",
                    params: {
                      factorType: "sale",
                    },
                  },
                  title: "هزینه های فاکتور فروش",
                },
                {
                  perm: "defaultAccounts",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "closeAccounts",
                    },
                  },
                  title: "حساب های بستن",
                },
                {
                  perm: "defaultAccounts",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "other",
                    },
                  },
                  title: "دیگر حساب ها",
                },

                {
                  to: {
                    name: "ExportVerifiers",
                  },
                  title: "تایید کنندگان خروجی",
                },
              ],
            },
          ],
        },
        {
          title: "حسابداری",
          icon: "fa-wallet",
          module: "sanads",
          children: [
            {
              perm: "create.sanad",
              to: {
                name: "SanadForm",
              },
              title: "ثبت سند",
            },
            {
              title: "لیست اسناد",
              children: [
                {
                  perm: "get.sanad",
                  to: {
                    name: "SanadsList",
                    params: {
                      type: "all",
                    },
                  },
                  title: "همه",
                },
                {
                  perm: "get.sanad",
                  to: {
                    name: "SanadsList",
                    params: {
                      type: "unbalanced",
                    },
                  },
                  title: "اسناد نامتوازن",
                },
                {
                  perm: "get.sanad",
                  to: {
                    name: "SanadsList",
                    params: {
                      type: "empty",
                    },
                  },
                  title: "اسناد خالی",
                },
              ],
            },

            {
              perm: "close.financialYear",
              to: {
                name: "Closing",
              },
              title: "عملیات بستن و انتقال",
            },
          ],
        },
        {
          title: "خزانه داری",
          icon: "$safeIcon",
          module: "transactions",
          children: [
            {
              title: "دریافت",
              children: [
                {
                  perm: "create.receiveTransaction",
                  to: {
                    name: "TransactionForm",
                    params: {
                      type: "receive",
                    },
                  },
                  title: "ثبت دریافت",
                },
                {
                  perm: "get.receiveTransaction",
                  to: {
                    name: "TransactionsList",
                    params: {
                      type: "receive",
                    },
                  },
                  title: "لیست دریافت ها",
                },
                {
                  perm: "submit.receivedCheque",
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "r",
                    },
                  },
                  title: "ثبت چک دریافتنی",
                },
                {
                  perm: "get.receivedCheque",
                  to: {
                    name: "ChequesList",
                    params: {
                      type: "r",
                    },
                  },
                  title: "لیست چک های دریافتی",
                },
                {
                  perm: "get.receivedCheque",
                  to: {
                    name: "ChequesList",
                    params: {
                      type: "r",
                    },
                    query: {
                      status__in: "notPassed,bounced",
                      due__lt: this.now ? this.now.format("jYYYY-jMM-jDD") : "",
                    },
                  },
                  title: "لیست چک های دریافتی پاس نشده و برگشتی سررسید گذشته",
                },
              ],
            },
            {
              title: "پرداخت",
              children: [
                {
                  perm: "create.paymentTransaction",
                  to: {
                    name: "TransactionForm",
                    params: {
                      type: "payment",
                    },
                  },
                  title: "ثبت پرداخت",
                },
                {
                  perm: "get.paymentTransaction",
                  to: {
                    name: "TransactionsList",
                    params: {
                      type: "payment",
                    },
                  },
                  title: "لیست پرداخت ها",
                },
                {
                  perm: "submit.paidCheque",
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "p",
                    },
                  },
                  title: "ثبت چک پرداختنی",
                },
                {
                  perm: "get.paidCheque",
                  to: {
                    name: "ChequesList",
                    params: {
                      type: "p",
                    },
                  },
                  title: "لیست چک های پرداختنی",
                },
                {
                  perm: "get.paidCheque",
                  to: {
                    name: "ChequesList",
                    params: {
                      type: "p",
                    },
                    query: {
                      status__in: "notPassed,bounced",
                      due__lt: this.now ? this.now.format("jYYYY-jMM-jDD") : "",
                    },
                  },
                  title: "لیست چک های پرداختی پاس نشده و برگشتی سررسید گذشته",
                },

                {
                  perm: "chequebook",
                  to: {
                    name: "ChequebookForm",
                  },
                  title: "ثبت دسته چک",
                },
              ],
            },
            {
              title: "تنخواه",
              children: [
                {
                  perm: "create.imprestTransaction",
                  title: "پرداخت تنخواه",
                  to: {
                    name: "TransactionForm",
                    params: {
                      type: "imprest",
                    },
                  },
                },
                {
                  perm: "get.imprestTransaction",
                  to: {
                    name: "TransactionsList",
                    params: {
                      type: "imprest",
                    },
                  },
                  title: "لیست پرداخت های تنخواه",
                },
                {
                  perm: "defaultAccount",
                  title: "حساب های پیشفرض تنخواه",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "imprest",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          title: "بازرگانی",
          icon: "$buySaleIcon",
          module: "factors",
          children: [
            {
              title: "فاکتور خرید",
              children: [
                {
                  title: "ثبت فاکتور خرید",
                  perm: "create.buyFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "buy",
                    },
                  },
                },
                {
                  perm: "get.buyFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      type: "buy",
                    },
                  },
                  title: "لیست خرید",
                },
              ],
            },
            {
              title: "فاکتور فروش",
              children: [
                {
                  perm: "create.saleFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "sale",
                    },
                  },
                  title: "ثبت فاکتور فروش",
                },
                {
                  perm: "get.saleFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      type: "sale",
                    },
                  },
                  title: "لیست فروش",
                },
              ],
            },
            {
              title: "برگشت از خرید",
              children: [
                {
                  perm: "create.backFromBuyFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "backFromBuy",
                    },
                  },
                  title: "ثبت برگشت از خرید",
                },
                {
                  perm: "get.backFromBuyFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      type: "backFromBuy",
                    },
                  },
                  title: "لیست برگشت از خرید",
                },
              ],
            },
            {
              title: "برگشت از فروش",
              children: [
                {
                  perm: "create.backFromSaleFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "backFromSale",
                    },
                  },
                  title: "ثبت برگشت از فروش",
                },
                {
                  perm: "get.backFromSaleFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      type: "backFromSale",
                    },
                  },
                  title: "لیست برگشت از فروش",
                },
              ],
            },
          ],
        },
        {
          title: "انبار",
          icon: "$warehouseIcon",
          module: "warehouses",
          children: [
            {
              title: "انتقال",
              children: [
                {
                  perm: "create.transfer",
                  to: {
                    name: "TransferForm",
                  },
                  title: "ثبت انتقال",
                },
                {
                  perm: "get.transfer",
                  to: {
                    name: "TransfersList",
                  },
                  title: "لیست انتقال ها",
                },
              ],
            },
            {
              title: "تعدیل",
              children: [
                {
                  title: "رسید تعدیل انبار",
                  perm: "create.adjustment",
                  to: {
                    name: "AdjustmentForm",
                    params: {
                      type: "ia",
                    },
                  },
                },
                {
                  perm: "get.adjustment",
                  to: {
                    name: "AdjustmentsList",
                    params: {
                      type: "ia",
                    },
                  },
                  title: "لیست رسید های تعدیل انبار",
                },
                {
                  title: "حواله تعدیل انبار",
                  perm: "create.adjustment",
                  to: {
                    name: "AdjustmentForm",
                    params: {
                      type: "oa",
                    },
                  },
                },
                {
                  perm: "get.adjustment",
                  to: {
                    name: "AdjustmentsList",
                    params: {
                      type: "oa",
                    },
                  },
                  title: "لیست حواله های تعدیل انبار",
                },
              ],
            },
            {
              title: "حواله کالای مصرفی",
              children: [
                {
                  perm: "create.consumptionFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "cw",
                    },
                  },
                  title: "ثبت حواله کالای مصرفی",
                },
                {
                  perm: "get.consumptionFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      type: "cw",
                    },
                  },
                  title: "لیست حواله های کالای مصرفی",
                },
              ],
            },
          ],
        },
        {
          title: "گزارش",
          icon: "$reportIcon",
          children: [
            {
              perm: "accountsCodingReport",
              to: {
                name: "AccountsCoding",
              },
              title: "گزارش کدینگ حساب ها",
            },
            {
              title: "دفاتر حسابداری",
              children: [
                {
                  perm: "sanadItemsReport",
                  title: "گروه حساب",
                  to: {
                    name: "LedgerReport",
                    params: {
                      level: "level0",
                    },
                  },
                },
                {
                  perm: "sanadItemsReport",
                  title: "کل",
                  to: {
                    name: "LedgerReport",
                    params: { level: "level1" },
                  },
                },
                {
                  perm: "sanadItemsReport",
                  title: "معین",
                  to: {
                    name: "LedgerReport",
                    params: { level: "level2" },
                  },
                },
                {
                  perm: "sanadItemsReport",
                  title: "تفصیلی",
                  to: {
                    name: "LedgerReport",
                    params: { level: "level3" },
                  },
                },
                {
                  perm: "sanadItemsReport",
                  title: "گروه شناور",
                  to: {
                    name: "LedgerReport",
                    params: { level: "floatAccountGroups" },
                  },
                },
                {
                  perm: "sanadItemsReport",
                  title: "حساب شناور",
                  to: {
                    name: "LedgerReport",
                    params: { level: "floatAccounts" },
                  },
                },
                {
                  perm: "sanadItemsReport",
                  title: "گروه مرکز هزینه و درآمد",
                  to: {
                    name: "LedgerReport",
                    params: { level: "costCenterGroups" },
                  },
                },
                {
                  perm: "sanadItemsReport",
                  title: "مرکز هزینه و درآمد",
                  to: {
                    name: "LedgerReport",
                    params: { level: "costCenters" },
                  },
                },
              ],
            },
            {
              perm: "sanadItemsReport",
              to: {
                name: "BillReport",
              },
              title: "صورت حساب تفصیلی",
            },
            {
              title: "تراز حساب ها",
              children: [
                {
                  perm: "accountBalanceReport",
                  to: {
                    name: "AccountsBalanceReport",
                  },
                  title: "تراز سطوح حساب ها",
                },
                {
                  perm: "floatAccountBalanceByGroupReport",
                  to: {
                    name: "FloatAccountsBalanceReportByGroup",
                  },
                  title: "تراز گروه و حساب شناور",
                },
                {
                  perm: "floatAccountBalanceReport",
                  to: {
                    name: "FloatAccountsBalanceReport",
                  },
                  title: "تراز حساب شناور",
                },
                {
                  perm: "floatAccountBalanceByGroupReport",
                  to: {
                    name: "FloatAccountsBalanceReportByGroup",
                    params: {
                      is_cost_center: true,
                    },
                  },
                  title: "تراز گروه و مرکز هزینه و درآمد",
                },
                {
                  perm: "floatAccountBalanceReport",
                  to: {
                    name: "FloatAccountsBalanceReport",
                    params: {
                      is_cost_center: true,
                    },
                  },
                  title: "تراز مرکز هزینه و درآمد",
                },
              ],
            },
            {
              title: "گزارش کالا",
              children: [
                {
                  perm: "wareInventoryReport",
                  to: {
                    name: "DetailedWareInventoryReport",
                  },
                  title: "کاردکس کالا",
                },
                {
                  perm: "allWaresInventoryReport",
                  to: {
                    name: "AllWaresInventoryReport",
                  },
                  title: "کاردکس همه کالا ها",
                },
                {
                  perm: "buyReport",
                  to: {
                    name: "BuySaleReport",
                    params: {
                      type: "buy",
                    },
                  },
                  title: "گزارش خرید",
                },
                {
                  perm: "saleReport",
                  to: {
                    name: "BuySaleReport",
                    params: {
                      type: "sale",
                    },
                  },
                  title: "گزارش فروش",
                },
              ],
            },
            {
              title: "گزارش انبار",
              children: [
                {
                  perm: "warehouseInventoryReport",
                  to: {
                    name: "DetailedWarehouseInventoryReport",
                  },
                  title: "کاردکس انبار",
                },
                {
                  perm: "allWarehousesInventoryReport",
                  to: {
                    name: "AllWarehousesInventoryReport",
                  },
                  title: "کاردکس انبار همه کالا ها",
                },
              ],
            },
            {
              perm: "sanadItemsReport",
              to: {
                name: "JournalReport",
              },
              title: "دفتر روزنامه",
            },
            {
              title: "سود و زیان",
              children: [
                {
                  perm: "incomeStatementReport",
                  to: {
                    name: "IncomeStatementReport",
                  },
                  title: "کلی",
                },
                {
                  perm: "incomeStatementReport",
                  to: {
                    name: "IncomeStatementReport",
                    params: {
                      detailed: "detailed",
                    },
                  },
                  title: "جامع",
                },
              ],
            },
            {
              perm: "balanceSheetReport",
              to: {
                name: "BalanceSheetReport",
              },
              title: "ترازنامه",
            },
          ],
        },
        {
          title: "حمل و نقل",
          icon: "$transportationIcon",
          module: "dashtbashi",
          children: [
            {
              title: "اطلاعات پایه",
              children: [
                {
                  title: "تنظیمات",
                  perm: "option",
                  to: {
                    name: "Options",
                  },
                },
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "dashtbashi",
                    },
                  },
                  title: "حساب های پیشفرض",
                },
                {
                  perm: "car",
                  title: "ماشین ها",
                  to: {
                    name: "Cars",
                  },
                },
                {
                  title: "راننده ها",
                  perm: "driver",
                  to: {
                    name: "Drivers",
                  },
                },
                {
                  perm: "driving",
                  title: "انتصاب راننده به ماشین",
                  to: {
                    name: "Drivings",
                  },
                },
                {
                  perm: "association",
                  title: "انجمن",
                  to: {
                    name: "Associations",
                  },
                },
              ],
            },
            {
              title: "بارنامه",
              children: [
                {
                  perm: "ladingBillSeries",
                  title: "سری بارنامه",
                  to: {
                    name: "LadingBillSeries",
                  },
                },
                {
                  perm: "ladingBillSeries",
                  title: "لیست سری های بارنامه",
                  to: {
                    name: "LadingBillSeriesList",
                  },
                },
                {
                  perm: "revoke.ladingBillNumber",
                  title: "ابطال شماره بارنامه",
                  to: {
                    name: "RevokeLadingBillNumber",
                  },
                },
              ],
            },
            {
              title: "حواله",
              children: [
                {
                  title: "ثبت حواله",
                  perm: "remittance",
                  to: {
                    name: "Remittance",
                  },
                },
                {
                  title: "لیست حواله ها",
                  perm: "remittance",
                  to: {
                    name: "RemittancesReport",
                  },
                },
              ],
            },
            {
              title: "بارگیری",
              children: [
                {
                  title: "بارگیری حمل و نقل",
                  perm: "lading",
                  to: {
                    name: "Lading",
                  },
                },
                {
                  title: "لیست بارگیری های حمل و نقل",
                  perm: "lading",
                  to: {
                    name: "LadingsReport",
                  },
                },
                {
                  title: "بارگیری شرکت نفت",
                  perm: "oilCompanyLading",
                  to: {
                    name: "OilCompanyLading",
                  },
                },
                {
                  title: "گزارش بارگیری شرکت نفت",
                  perm: "oilCompanyLading",
                  to: {
                    name: "OilCompanyLadingsList",
                  },
                },
                {
                  title: "لیست بارگیری شرکت نفت همراه با جزئیات",
                  perm: "oilCompanyLading",
                  to: {
                    name: "OilCompanyLadingsList",
                    params: {
                      detailed: true,
                    },
                  },
                },
              ],
            },
            {
              title: "پرداخت",
              children: [
                {
                  perm: "otherDriverPayment",
                  title: "پرداخت راننده متفرقه",
                  to: {
                    name: "OtherDriverPayment",
                  },
                },
                {
                  perm: "otherDriverPayment",
                  title: "لیست پرداخت راننده متفرقه",
                  to: {
                    name: "OtherDriverPaymentsList",
                  },
                },
              ],
            },
            {
              title: "گزارشات",
              children: [
                {
                  title: "گزارش بارنامه برای کامیون های آقا ابراهیم",
                  perm: "lading",
                  to: {
                    name: "LadingNumberReport",
                    query: { "filters.driving__car__owner": "e" },
                  },
                },
                {
                  title: "گزارش بارنامه برای کامیون های آقا رحیم",
                  perm: "lading",
                  to: {
                    name: "LadingNumberReport",
                    query: { "filters.driving__car__owner": "rm" },
                  },
                },
                {
                  title: "گزارش بارنامه برای کامیون های متفرقه",
                  perm: "lading",
                  to: {
                    name: "LadingNumberReport",
                    query: { "filters.driving__car__owner": "o" },
                  },
                },
                {
                  title: "گزارش بارنامه برای کامیون های حاج رحمان",
                  perm: "lading",
                  to: {
                    name: "LadingNumberReport",
                    query: { "filters.driving__car__owner": "rn" },
                  },
                },

                {
                  title: "گزارش بارگیری حمل و نقل برای پیمانکار",
                  perm: "lading",
                  to: {
                    name: "LadingsReportForContractor",
                  },
                },
                {
                  title: "گزارش بارگیری حمل و نقل برای راننده",
                  perm: "lading",
                  to: {
                    name: "LadingsReportForDriver",
                  },
                },
                {
                  title: "گزارش کمیسیون حمل و نقل",
                  perm: "lading",
                  to: {
                    name: "TransportationCommissionReport",
                  },
                },

                {
                  perm: "otherDriverPayment",
                  title: "گزارش مبلغ قابل پرداخت رانندگان متفرقه",
                  to: {
                    name: "DriverPaymentReport",
                  },
                },
              ],
            },
          ],
        },
      ];
    },
    routes() {
      let routes = this.allRoutes;
      let setVisibility = (route) => {
        let visible = false;

        if (route.module && !this.hasModule(route.module)) {
          visible = false;
        } else if (route.perm) {
          visible = this.hasPerm("", route.perm);
        } else if (route.children) {
          for (let child of route.children) {
            visible |= setVisibility(child);
          }
          route.show = visible;
        } else {
          visible = true;
        }

        route.show = visible;
        return visible;
      };

      for (let route of routes) {
        setVisibility(route);
      }
      return routes;
    },
    username() {
      if (this.user.username.includes("manager")) return "manager";
      return this.user.username;
    },
  },
};
</script>

<style lang="scss">
.navbar-list {
  border: none !important;
  .list-item-title {
    font-weight: 300 !important;
    font-size: 0.9rem !important;
  }

  .level-0.v-list-group--active > .v-list-group__header {
    background-color: rgba(#fff, 0.4) !important;
  }

  .level-2 > .v-list-item--active {
    background-color: rgba(#fff, 0.6) !important;
  }

  .level-3.v-list-item--active {
    &:before {
      background-color: rgba(#fff, 0) !important;
    }
    background-color: rgba(#fff, 0.9) !important;
    border: none !important;
    border-radius: 4px !important;
    .v-list-item__title {
      color: #212121 !important;
    }
  }

  .v-list-group__header__append-icon,
  .v-list-group__header__prepend-icon {
    color: white !important;
  }
}
</style>

