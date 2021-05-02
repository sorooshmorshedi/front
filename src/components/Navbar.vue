<template>
  <v-list nav dense class="navbar-list white--text">
    <v-list-item class flat v-if="user && isXs">
      <span class="d-block mx-auto px-5 py-2" style="width: 100%;">
        <v-img
          class="mx-auto"
          style="border-radius: 30%"
          contain
          width="60%"
          src="/img/SobhanAccountingLogo.png"
        />
      </span>
    </v-list-item>

    <v-list-item class="grey lighten-4" flat v-if="user && isXs">
      <v-list-item-icon>
        <v-icon class="navbar-icon indigo--text mt-3 mr-1">fa fa-user</v-icon>
      </v-list-item-icon>
      <v-list-item-content class="black--text">
        <v-list-item-title class="text-center">{{ user.name }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn text icon color="red" class="rotate-180" @click="$emit('logout')">
          <v-icon>logout</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>

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
import { VisitorLevels } from "@/variables";
import { PathLevels } from "@/variables";
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
          title: "اطلاعات پایه",
          icon: "fa-database",
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
              perm: "exportVerifier",
              to: {
                name: "ExportVerifiers",
              },
              title: "تایید کنندگان خروجی",
            },
          ],
        },
        {
          title: "حسابداری",
          icon: "fa-wallet",
          module: "sanads",
          children: [
            {
              title: "تعریف حساب",
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
                      accountType: "p",
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
                      accountType: "b",
                    },
                  },
                  title: "بانک",
                },
                {
                  perm: "account",
                  to: {
                    name: "AccountsTree",
                  },
                  title: "نمودار درختی حساب ها",
                },
              ],
            },
            {
              title: "تعریف شناور و مراکز",
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
                  perm: "sanad",
                  to: {
                    name: "SanadsList",
                    params: {
                      type: "all",
                    },
                  },
                  title: "تمامی اسناد",
                },
                {
                  perm: "sanad",
                  to: {
                    name: "SanadsList",
                    params: {
                      type: "unbalanced",
                    },
                  },
                  title: "اسناد نامتوازن",
                },
                {
                  perm: "sanad",
                  to: {
                    name: "SanadsList",
                    params: {
                      type: "empty",
                    },
                  },
                  title: "اسناد خالی",
                },
                {
                  perm: "sanad",
                  to: {
                    name: "SanadItemsList",
                  },
                  title: "جزئیات اسناد",
                },
              ],
            },

            {
              perm: "financialYear",
              to: {
                name: "Closing",
              },
              title: "عملیات بستن و انتقال",
            },
            {
              title: "حساب های پیش فرض",
              children: [
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
                  title: "سایر حساب ها",
                },
              ],
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
                  perm: "receiveTransaction",
                  to: {
                    name: "TransactionForm",
                    params: {
                      type: "receive",
                    },
                  },
                  title: "ثبت دریافت",
                },
                {
                  perm: "receiveTransaction",
                  to: {
                    name: "TransactionsList",
                    params: {
                      type: "receive",
                    },
                  },
                  title: "لیست دریافت ها",
                },
                {
                  perm: "receivedCheque",
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "r",
                    },
                  },
                  title: "ثبت چک دریافتنی",
                },
                {
                  perm: "receivedCheque",
                  to: {
                    name: "ChequesList",
                    params: {
                      type: "r",
                    },
                  },
                  title: "لیست چک های دریافتی",
                },
                {
                  perm: "receivedCheque",
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
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "receive",
                    },
                  },
                  title: "حساب های پیش فرض دریافت",
                },
              ],
            },
            {
              title: "پرداخت",
              children: [
                {
                  perm: "paymentTransaction",
                  to: {
                    name: "TransactionForm",
                    params: {
                      type: "payment",
                    },
                  },
                  title: "ثبت پرداخت",
                },
                {
                  perm: "paymentTransaction",
                  to: {
                    name: "TransactionsList",
                    params: {
                      type: "payment",
                    },
                  },
                  title: "لیست پرداخت ها",
                },
                {
                  perm: "paidCheque",
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "p",
                    },
                  },
                  title: "ثبت چک پرداختنی",
                },
                {
                  perm: "paidCheque",
                  to: {
                    name: "ChequesList",
                    params: {
                      type: "p",
                    },
                  },
                  title: "لیست چک های پرداختنی",
                },
                {
                  perm: "paidCheque",
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
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "payment",
                    },
                  },
                  title: "حساب های پیش فرض پرداخت",
                },
              ],
            },
            {
              title: "تنخواه",
              children: [
                {
                  perm: "imprestTransaction",
                  title: "پرداخت تنخواه",
                  to: {
                    name: "TransactionForm",
                    params: {
                      type: "imprest",
                    },
                  },
                },
                {
                  perm: "imprestTransaction",
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
              title: "پیشفرض های فاکتور",
              children: [
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "factor",
                    },
                  },
                  title: "حساب ها",
                },
                {
                  perm: "defaultTexts",
                  to: {
                    name: "DefaultTexts",
                    params: {
                      usage: "factor",
                    },
                  },
                  title: "متون",
                },
              ],
            },
            {
              title: "تعریف کالا",
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
                  perm: "ware",
                  to: {
                    name: "WaresTree",
                  },
                  title: "نمودار درختی کالا ها",
                },
                {
                  perm: "salePriceType",
                  to: {
                    name: "SalePriceTypes",
                  },
                  title: "انواع نرخ های فروش",
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
                      isPreFactor: false,
                      type: "fpi",
                    },
                  },
                  title: "ثبت موجودی اول دوره",
                },
              ],
            },

            {
              title: "پیش فاکتور",
              children: [
                {
                  title: "ثبت پیش فاکتور فروش",
                  perm: "saleFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: true,
                      type: "sale",
                    },
                  },
                },
                {
                  title: "لیست پیش فاکتور های فروش",
                  perm: "buyFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: true,
                      type: "sale",
                    },
                  },
                },
                {
                  title: "ثبت پیش فاکتور خرید",
                  perm: "buyFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: true,
                      type: "buy",
                    },
                  },
                },
                {
                  title: "لیست پیش فاکتور های خرید",
                  perm: "buyFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: true,
                      type: "buy",
                    },
                  },
                },
              ],
            },

            {
              title: "فاکتور خرید",
              children: [
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
                  title: "ثبت فاکتور خرید",
                  perm: "buyFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: false,
                      type: "buy",
                    },
                  },
                },
                {
                  perm: "buyFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: false,
                      type: "buy",
                    },
                  },
                  title: "لیست فاکتور های خرید",
                },
              ],
            },
            {
              title: "فاکتور فروش",
              children: [
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
                  perm: "saleFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: false,
                      type: "sale",
                    },
                  },
                  title: "ثبت فاکتور فروش",
                },
                {
                  perm: "saleFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: false,
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
                  perm: "backFromBuyFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: false,
                      type: "backFromBuy",
                    },
                  },
                  title: "ثبت برگشت از خرید",
                },
                {
                  perm: "backFromBuyFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: false,
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
                  perm: "backFromSaleFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: false,
                      type: "backFromSale",
                    },
                  },
                  title: "ثبت برگشت از فروش",
                },
                {
                  perm: "backFromSaleFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: false,
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
              title: "رسید",
              children: [
                {
                  perm: "receipt",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "rc",
                      isPreFactor: false,
                    },
                  },
                  title: "ثبت رسید",
                },
                {
                  perm: "receipt",
                  to: {
                    name: "FactorsList",
                    params: {
                      type: "rc",
                      isPreFactor: false,
                    },
                  },
                  title: "لیست رسید ها",
                },
              ],
            },
            {
              title: "حواله",
              children: [
                {
                  perm: "remittance",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "rm",
                      isPreFactor: false,
                    },
                  },
                  title: "ثبت حواله",
                },
                {
                  perm: "remittance",
                  to: {
                    name: "FactorsList",
                    params: {
                      type: "rm",
                      isPreFactor: false,
                    },
                  },
                  title: "لیست حواله ها",
                },
              ],
            },

            {
              title: "انتقال",
              children: [
                {
                  perm: "transfer",
                  to: {
                    name: "TransferForm",
                  },
                  title: "ثبت انتقال",
                },
                {
                  perm: "transfer",
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
                  perm: "adjustment",
                  to: {
                    name: "AdjustmentForm",
                    params: {
                      type: "ia",
                    },
                  },
                },
                {
                  perm: "adjustment",
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
                  perm: "adjustment",
                  to: {
                    name: "AdjustmentForm",
                    params: {
                      type: "oa",
                    },
                  },
                },
                {
                  perm: "adjustment",
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
              hide: this.isAdvari,
              children: [
                {
                  perm: "consumptionWareFactor",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: false,
                      type: "cw",
                    },
                  },
                  title: "ثبت حواله کالای مصرفی",
                },
                {
                  perm: "consumptionWareFactor",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: false,
                      type: "cw",
                    },
                  },
                  title: "لیست حواله های کالای مصرفی",
                },
              ],
            },
            {
              title: "انبارگردانی",
              children: [
                {
                  perm: "warehouseHandling",
                  to: {
                    name: "WarehouseHandlingForm",
                  },
                  title: "ثبت انبارگردانی",
                },
                {
                  perm: "warehouseHandling",
                  to: {
                    name: "WarehouseHandlingList",
                  },
                  title: "لیست انبارگردانی ها",
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
                {
                  perm: "salePrice",
                  to: {
                    name: "SalePricesList",
                  },
                  title: "گزارش قیمت ها و واحد های کالا ها",
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
          title: "پخش",
          icon: "fa-truck",
          module: "distribution",
          children: [
            {
              title: "بازه پورسانت",
              perm: "commissionRange",
              to: {
                name: "CommissionRanges",
              },
            },
            {
              title: "ویزیتور",
              children: [
                {
                  title: VisitorLevels.find((o) => o.value == 0).text,
                  perm: "visitor",
                  to: {
                    name: "Visitors",
                    params: {
                      level: 0,
                    },
                  },
                },
                {
                  title: VisitorLevels.find((o) => o.value == 1).text,
                  perm: "visitor",
                  to: {
                    name: "Visitors",
                    params: {
                      level: 1,
                    },
                  },
                },
                {
                  title: VisitorLevels.find((o) => o.value == 2).text,
                  perm: "visitor",
                  to: {
                    name: "Visitors",
                    params: {
                      level: 2,
                    },
                  },
                },
                {
                  title: VisitorLevels.find((o) => o.value == 3).text,
                  perm: "visitor",
                  to: {
                    name: "Visitors",
                    params: {
                      level: 3,
                    },
                  },
                },
              ],
            },
            {
              title: "مسیر",
              children: [
                {
                  title: PathLevels.find((o) => o.value == 0).text,
                  perm: "path0",
                  to: {
                    name: "Paths",
                    params: {
                      level: 0,
                    },
                  },
                },
                {
                  title: PathLevels.find((o) => o.value == 1).text,
                  perm: "path1",
                  to: {
                    name: "Paths",
                    params: {
                      level: 1,
                    },
                  },
                },
                {
                  title: PathLevels.find((o) => o.value == 2).text,
                  perm: "path2",
                  to: {
                    name: "Paths",
                    params: {
                      level: 2,
                    },
                  },
                },
                {
                  title: PathLevels.find((o) => o.value == 3).text,
                  perm: "path3",
                  to: {
                    name: "Paths",
                    params: {
                      level: 3,
                    },
                  },
                },
                {
                  title: PathLevels.find((o) => o.value == 4).text,
                  perm: "path4",
                  to: {
                    name: "Paths",
                    params: {
                      level: 4,
                    },
                  },
                },
              ],
            },
            {
              title: "راننده",
              perm: "driver",
              to: {
                name: "Drivers",
              },
            },
            {
              title: "موزع",
              perm: "distributor",
              to: {
                name: "Distributors",
              },
            },
            {
              title: "ماشین",
              perm: "car",
              to: {
                name: "Cars",
              },
            },
            {
              title: "تحویل فاکتور ها جهت توزیع",
              perm: "distribution",
              to: {
                name: "DistributionForm",
              },
            },
          ],
        },
        {
          title: "بهای تمام شده",
          module: "costAccounting",
          icon: "$costAccountingIcon",
          children: [
            {
              title: "اطلاعات پایه",
              children: [
                {
                  perm: "defaultAccount",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "costAccounting",
                    },
                  },
                  title: "حساب های پیشفرض",
                },
              ],
            },
            {
              title: "تولید",
              children: [
                {
                  title: "ثبت تولید",
                  perm: "production",
                  to: {
                    name: "FactorForm",
                    params: {
                      isPreFactor: false,
                      type: "p",
                    },
                  },
                },
                {
                  title: "لیست تولید ها",
                  perm: "production",
                  to: {
                    name: "FactorsList",
                    params: {
                      isPreFactor: false,
                      type: "p",
                    },
                  },
                },
              ],
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
                  to: {
                    name: "Cities",
                  },
                  title: "شهر ها",
                  perm: "city",
                },
                {
                  perm: "car",
                  title: "ماشین ها",
                  to: {
                    name: "DashtbashiCars",
                  },
                },
                {
                  title: "راننده ها",
                  perm: "driver",
                  to: {
                    name: "DashtbashiDrivers",
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
                  perm: "ladingBillNumber",
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
                    name: "RemittancesList",
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
                    name: "LadingsList",
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
                  title: "لیست بارگیری شرکت نفت",
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
                    name: "OtherDriverPaymentReport",
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
      let user = this.$store.state.user;
      if (user.username.includes("manager")) return "manager";
      return user.username;
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

