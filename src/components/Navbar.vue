<template>
  <v-list nav dense class="navbar-list">
    <navbar-list-item v-for="(route, i) in routes" :key="i" :route="route" :level="1" />
  </v-list>
</template>

<script>
import NavbarListItem from "./NavbarListItem";
export default {
  name: "NavBar",
  components: { NavbarListItem },
  data() {
    return {
      routes: [
        {
          to: {
            name: "Home"
          },
          title: "خانه"
        },
        {
          title: "اطلاعات پایه",
          children: [
            {
              title: "تعاریف",
              children: [
                {
                  to: {
                    name: "Users"
                  },
                  title: "کاربران"
                },
                {
                  to: {
                    name: "Roles"
                  },
                  title: "نقش ها"
                },
                {
                  title: "شرکت ها",
                  to: {
                    name: "Companies"
                  }
                },
                {
                  title: "سال های مالی",
                  to: {
                    name: "FinancialYears"
                  }
                },
                {
                  to: {
                    name: "Cities"
                  },
                  title: "شهر ها"
                }
              ]
            },
            {
              title: "حساب",
              children: [
                {
                  to: {
                    name: "Accounts",
                    params: {
                      level: 0
                    }
                  },
                  title: "گروه حساب"
                },
                {
                  to: {
                    name: "Accounts",
                    params: {
                      level: 1
                    }
                  },
                  title: "حساب کل"
                },
                {
                  to: {
                    name: "Accounts",
                    params: {
                      level: 2
                    }
                  },
                  title: "حساب معین"
                },
                {
                  to: {
                    name: "Accounts",
                    params: {
                      level: 3
                    }
                  },
                  title: "حساب تفضیلی"
                },
                {
                  to: {
                    name: "Accounts",
                    params: {
                      level: 3,
                      account_type: "p"
                    }
                  },
                  title: "اشخاص"
                },
                {
                  to: {
                    name: "Accounts",
                    params: {
                      level: 3,
                      account_type: "b"
                    }
                  },
                  title: "بانک"
                },

                {
                  to: {
                    name: "AccountTree"
                  },
                  title: "نمودار درختی حساب ها"
                }
              ]
            },
            {
              title: "شناور و مراکز",
              children: [
                {
                  to: {
                    name: "FloatAccountGroups"
                  },
                  title: "گروه حساب شناور"
                },
                {
                  to: {
                    name: "FloatAccounts"
                  },
                  title: "حساب شناور"
                },
                {
                  to: {
                    name: "FloatAccountGroups",
                    params: {
                      is_cost_center: true
                    }
                  },
                  title: "گروه مرکز هزینه و درآمد"
                },
                {
                  to: {
                    name: "FloatAccounts",
                    params: {
                      is_cost_center: true
                    }
                  },
                  title: "مرکز هزینه و درآمد"
                }
              ]
            },
            {
              title: "کالا",
              children: [
                {
                  to: {
                    name: "WareLevels",
                    params: {
                      level: 0
                    }
                  },
                  title: "ماهیت"
                },
                {
                  to: {
                    name: "WareLevels",
                    params: {
                      level: 1
                    }
                  },
                  title: "گروه"
                },
                {
                  to: {
                    name: "WareLevels",
                    params: {
                      level: 2
                    }
                  },
                  title: "دسته بندی"
                },
                {
                  to: {
                    name: "Wares"
                  },
                  title: "کالا"
                },
                {
                  to: {
                    name: "Warehouses"
                  },
                  title: "انبار"
                },
                {
                  to: {
                    name: "Units"
                  },
                  title: "واحد"
                },
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "fpi"
                    }
                  },
                  title: "ثبت موجودی اول دوره"
                }
              ]
            },
            {
              title: "پیشفرض ها",
              children: [
                {
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "receive"
                    }
                  },
                  title: "حساب های دریافت"
                },
                {
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "payment"
                    }
                  },
                  title: "حساب های پرداخت"
                },
                {
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "factor"
                    }
                  },
                  title: "حساب های فاکتور"
                },
                {
                  to: {
                    name: "FactorExpenses",
                    params: {
                      factorType: "buy"
                    }
                  },
                  title: "هزینه های فاکتور خرید"
                },
                {
                  to: {
                    name: "FactorExpenses",
                    params: {
                      factorType: "sale"
                    }
                  },
                  title: "هزینه های فاکتور فروش"
                },
                {
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "closeAccounts"
                    }
                  },
                  title: "حساب های بستن"
                },
                {
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "other"
                    }
                  },
                  title: "دیگر حساب ها"
                },

                {
                  to: {
                    name: "ExportVerifiers"
                  },
                  title: "تایید کنندگان خروجی"
                }
              ]
            }
          ]
        },
        {
          title: "حسابداری",
          children: [
            {
              to: {
                name: "SanadForm"
              },
              title: "ثبت سند"
            },
            {
              title: "لیست اسناد",
              children: [
                {
                  to: {
                    name: "List",
                    params: {
                      form: "sanad"
                    }
                  },
                  title: "همه"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "sanadUnbalanced"
                    }
                  },
                  title: "اسناد نامتوازن"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "sanadEmpty"
                    }
                  },
                  title: "اسناد خالی"
                }
              ]
            },

            {
              to: {
                name: "Closing"
              },
              title: "عملیات بستن و انتقال"
            }
          ]
        },
        {
          title: "خزانه داری",
          children: [
            {
              title: "دریافت",
              children: [
                {
                  to: {
                    name: "TransactionForm",
                    params: {
                      transactionType: "receive"
                    }
                  },
                  title: "ثبت دریافت"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "transaction",
                      type: "receive"
                    }
                  },
                  title: "لیست دریافت ها"
                },
                {
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "r"
                    }
                  },
                  title: "ثبت چک دریافتنی"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "cheque",
                      type: "received"
                    }
                  },
                  title: "لیست چک های دریافتی"
                }
              ]
            },
            {
              title: "پرداخت",
              children: [
                {
                  to: {
                    name: "TransactionForm",
                    params: {
                      transactionType: "payment"
                    }
                  },
                  title: "ثبت پرداخت"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "transaction",
                      type: "payment"
                    }
                  },
                  title: "لیست پرداخت ها"
                },
                {
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "p"
                    }
                  },
                  title: "ثبت چک پرداختنی"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "cheque",
                      type: "paid"
                    }
                  },
                  title: "لیست چک های پرداختنی"
                },
                {
                  to: {
                    name: "ChequebookForm"
                  },
                  title: "ثبت دسته چک"
                }
              ]
            },
            {
              title: "تنخواه",
              children: [
                {
                  title: "پرداخت تنخواه",
                  to: {
                    name: "TransactionForm",
                    params: {
                      transactionType: "imprest"
                    }
                  }
                },
                {
                  title: "تسویه تنخواه",
                  to: {
                    name: "ImprestSettlement"
                  }
                },
                {
                  title: "حساب های پیشفرض تنخواه",
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "imprest"
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          title: "بازرگانی",
          children: [
            {
              title: "فاکتور خرید",
              children: [
                {
                  title: "ثبت فاکتور خرید",
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "buy"
                    }
                  }
                },

                {
                  to: {
                    name: "List",
                    params: {
                      form: "factor",
                      type: "buy"
                    }
                  },
                  title: "لیست خرید"
                }
              ]
            },
            {
              title: "فاکتور فروش",
              children: [
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "sale"
                    }
                  },
                  title: "ثبت فاکتور فروش"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "factor",
                      type: "sale"
                    }
                  },
                  title: "لیست فروش"
                }
              ]
            },
            {
              title: "برگشت از خرید",
              children: [
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "backFromBuy"
                    }
                  },
                  title: "ثبت برگشت از خرید"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "factor",
                      type: "backFromBuy"
                    }
                  },
                  title: "لیست برگشت از خرید"
                }
              ]
            },
            {
              title: "برگشت از فروش",
              children: [
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      type: "backFromSale"
                    }
                  },
                  title: "ثبت برگشت از فروش"
                },
                {
                  to: {
                    name: "List",
                    params: {
                      form: "factor",
                      type: "backFromSale"
                    }
                  },
                  title: "لیست برگشت از فروش"
                }
              ]
            }
          ]
        },
        {
          title: "انبار",
          children: [
            {
              title: "انتقال",
              children: [
                {
                  to: {
                    name: "TransferForm"
                  },
                  title: "ثبت انتقال"
                }
              ]
            },
            {
              title: "تعدیل",
              children: [
                {
                  title: "حواله تعدیل انبار",
                  to: {
                    name: "AdjustmentForm",
                    params: {
                      type: "ia"
                    }
                  }
                },
                {
                  title: "رسید تعدیل انبار",
                  to: {
                    name: "AdjustmentForm",
                    params: {
                      type: "oa"
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          title: "گزارش",
          children: [
            {
              title: "دفاتر حسابداری",
              children: [
                {
                  title: "گروه حساب",
                  to: {
                    name: "LedgerReport"
                  }
                },
                {
                  title: "کل",
                  to: {
                    name: "LedgerReport"
                  }
                },
                {
                  title: "معین",
                  to: {
                    name: "LedgerReport"
                  }
                },
                {
                  title: "تفصیلی",
                  to: {
                    name: "LedgerReport"
                  }
                },
                {
                  title: "گروه شناور",
                  to: {
                    name: "LedgerReport"
                  }
                },
                {
                  title: "گروه مرکز هزینه و درآمد",
                  to: {
                    name: "LedgerReport"
                  }
                }
              ]
            },
            {
              to: {
                name: "BillReport"
              },
              title: "صورت حساب تفصیلی"
            },
            {
              title: "تراز حساب ها",
              children: [
                {
                  to: {
                    name: "AccountsBalanceReport"
                  },
                  title: "تراز سطوح حساب ها"
                },
                {
                  to: {
                    name: "FloatAccountsBalanceReportByGroup"
                  },
                  title: "تراز گروه و حساب شناور"
                },
                {
                  to: {
                    name: "FloatAccountsBalanceReport"
                  },
                  title: "تراز حساب شناور"
                },
                {
                  to: {
                    name: "FloatAccountsBalanceReportByGroup",
                    params: {
                      is_cost_center: true
                    }
                  },
                  title: "تراز گروه و مرکز هزینه و درآمد"
                },
                {
                  to: {
                    name: "FloatAccountsBalanceReport",
                    params: {
                      is_cost_center: true
                    }
                  },
                  title: "تراز مرکز هزینه و درآمد"
                }
              ]
            },
            {
              title: "گزارش کالا",
              children: [
                {
                  to: {
                    name: "DetailedWareInventoryReport"
                  },
                  title: "کاردکس کالا"
                },
                {
                  to: {
                    name: "AllWaresInventoryReport"
                  },
                  title: "کاردکس همه کالا ها"
                },
                {
                  to: {
                    name: "BuySaleReport",
                    params: {
                      type: "buy"
                    }
                  },
                  title: "گزارش خرید"
                },
                {
                  to: {
                    name: "BuySaleReport",
                    params: {
                      type: "sale"
                    }
                  },
                  title: "گزارش فروش"
                }
              ]
            },
            {
              title: "گزارش انبار",
              children: [
                {
                  to: {
                    name: "DetailedWarehouseInventoryReport"
                  },
                  title: "کاردکس انبار"
                },
                {
                  to: {
                    name: "AllWarehousesInventoryReport"
                  },
                  title: "کاردکس انبار همه کالا ها"
                }
              ]
            },
            {
              to: {
                name: "JournalReport"
              },
              title: "دفتر روزنامه"
            },
            {
              title: "سود و زیان",
              children: [
                {
                  to: {
                    name: "IncomeStatementReport"
                  },
                  title: "کلی"
                },
                {
                  to: {
                    name: "IncomeStatementReport",
                    params: {
                      detailed: "detailed"
                    }
                  },
                  title: "جامع"
                }
              ]
            },
            {
              to: {
                name: "BalanceSheetReport"
              },
              title: "ترازنامه"
            }
          ]
        },
        {
          title: "حمل و نقل",
          children: [
            {
              title: "اطلاعات پایه",
              children: [
                {
                  title: "تنظیمات",
                  to: {
                    name: "Options"
                  }
                },

                {
                  to: {
                    name: "DefaultAccounts",
                    params: {
                      usage: "dashtbashi"
                    }
                  },
                  title: "حساب های پیشفرض"
                },
                {
                  title: "ماشین ها",
                  to: {
                    name: "Cars"
                  }
                },
                {
                  title: "راننده ها",
                  to: {
                    name: "Drivers"
                  }
                },
                {
                  title: "انتصاب راننده به ماشین",
                  to: {
                    name: "Drivings"
                  }
                },
                {
                  title: "انجمن",
                  to: {
                    name: "Associations"
                  }
                }
              ]
            },
            {
              title: "بارنامه",
              children: [
                {
                  title: "سری بارنامه",
                  to: {
                    name: "LadingBillSeries"
                  }
                },
                {
                  title: "ابطال شماره بارنامه",
                  to: {
                    name: "RevokeLadingBillNumber"
                  }
                }
              ]
            },
            {
              title: "حواله",
              to: {
                name: "Remittance"
              }
            },
            {
              title: "بارگیری",
              children: [
                {
                  title: "بارگیری حمل و نقل",
                  to: {
                    name: "Lading"
                  }
                },
                {
                  title: "بارگیری شرکت نفت",
                  to: {
                    name: "OilCompanyLading"
                  }
                }
              ]
            },
            {
              title: "پرداخت",
              children: [
                {
                  title: "پرداخت راننده متفرقه",
                  to: {
                    name: "DriverPayment"
                  }
                },
                {
                  title: "گزارش مبلغ قابل پرداخت رانندگان متفرقه",
                  to: {
                    name: "DriverPaymentReport"
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {},
  computed: {
    username() {
      if (this.user.username.includes("manager")) return "manager";
      return this.user.username;
    }
  }
};
</script>

<style lang="scss">
.navbar-list {
  .list-item-title {
    // color: white;
    font-weight: 300 !important;
    font-size: 0.9rem !important;
  }
  .v-icon {
    // color: rgba(white, 0.8) !important;
  }
}
</style>
