<template>
  <v-list nav dense class="navbar-list">
    <navbar-list-item v-for="(route, i) in routes" :key="i" :route="route" />
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
                  title: "گروه مرکز هزینه"
                },
                {
                  to: {
                    name: "FloatAccounts",
                    params: {
                      is_cost_center: true
                    }
                  },
                  title: "مرکز هزینه"
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
                    name: "FirstPeriodInventory"
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
                    name: "DefaultAccounts",
                    params: {
                      usage: "closeAccounts"
                    }
                  },
                  title: "حساب های بستن"
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
                    name: "ExportVerifiers"
                  },
                  title: "تایید کنندگان خروجی"
                }
              ]
            }
          ]
        },
        {
          title: "عملیات های روزانه",
          children: [
            {
              to: {
                name: "SanadForm"
              },
              title: "ثبت سند"
            },
            {
              title: "فاکتور",
              children: [
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      factorType: "buy"
                    }
                  },
                  title: "ثبت فاکتور خرید"
                },
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      factorType: "backFromBuy"
                    }
                  },
                  title: "ثبت فاکتور برگشت از خرید"
                },
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      factorType: "sale"
                    }
                  },
                  title: "ثبت فاکتور فروش"
                },
                {
                  to: {
                    name: "FactorForm",
                    params: {
                      factorType: "backFromSale"
                    }
                  },
                  title: "ثبت فاکتور برگشت از فروش"
                }
              ]
            },
            {
              to: {
                name: "TransferForm"
              },
              title: "ثبت انتقال"
            },
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
                name: "TransactionForm",
                params: {
                  transactionType: "payment"
                }
              },
              title: "ثبت پرداخت"
            },
            {
              title: "دفتر چک",
              children: [
                {
                  to: {
                    name: "ChequebookForm"
                  },
                  title: "ثبت دفتر چک"
                },
                {
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "p"
                    }
                  },
                  title: "ثبت چک پرداختی"
                },
                {
                  to: {
                    name: "ChequeForm",
                    params: {
                      receivedOrPaid: "r"
                    }
                  },
                  title: "ثبت چک دریافتی"
                }
              ]
            }
          ]
        },
        {
          title: "فهرست فرم ها",
          children: [
            {
              to: {
                name: "List",
                params: {
                  form: "sanad"
                }
              },
              title: "اسناد"
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
            },
            {
              to: {
                name: "List",
                params: {
                  form: "factor",
                  type: "buy"
                }
              },
              title: "فاکتور خرید"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "factor",
                  type: "backFromBuy"
                }
              },
              title: "فاکتور برگشت از خرید"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "factor",
                  type: "sale"
                }
              },
              title: "فاکتور فروش"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "factor",
                  type: "backFromSale"
                }
              },
              title: "فاکتور برگشت از فروش"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "transaction",
                  type: "receive"
                }
              },
              title: "دریافت"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "transaction",
                  type: "payment"
                }
              },
              title: "پرداخت"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "chequebook"
                }
              },
              title: "دسته چک ها"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "cheque",
                  type: "received"
                }
              },
              title: "چک های دریافتی"
            },
            {
              to: {
                name: "List",
                params: {
                  form: "cheque",
                  type: "paid"
                }
              },
              title: "چک های پرداختی"
            }
          ]
        },
        {
          title: "گزارش",
          children: [
            {
              to: {
                name: "LedgerReport"
              },
              title: "دفتر کل، معین، تفضیلی"
            },
            {
              to: {
                name: "BillReport"
              },
              title: "صورت حساب تفصیلی"
            },
            {
              to: {
                name: "AccountsBalanceReport"
              },
              title: "تراز"
            },
            {
              to: {
                name: "FloatAccountsBalanceReportByGroup"
              },
              title: "تراز شناور بر اساس گروه"
            },
            {
              to: {
                name: "FloatAccountsBalanceReport"
              },
              title: "تراز شناور"
            },
            {
              to: {
                name: "FloatAccountsBalanceReportByGroup",
                params: {
                  is_cost_center: true
                }
              },
              title: "تراز مرکز هزینه بر اساس گروه"
            },
            {
              to: {
                name: "FloatAccountsBalanceReport",
                params: {
                  is_cost_center: true
                }
              },
              title: "تراز مرکز هزینه"
            },
            {
              to: {
                name: "JournalReport"
              },
              title: "دفتر روزنامه"
            },
            {
              to: {
                name: "IncomeStatementReport"
              },
              title: "سود و زیان"
            },
            {
              to: {
                name: "IncomeStatementReport",
                params: {
                  detailed: "detailed"
                }
              },
              title: "سود و زیان تفصیلی"
            },
            {
              to: {
                name: "BalanceSheetReport"
              },
              title: "ترازنامه"
            },
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
                name: "DetailedWarehouseInventoryReport"
              },
              title: "کاردکس انبار"
            },
            {
              to: {
                name: "AllWarehousesInventoryReport"
              },
              title: "کاردکس انبار همه کالا ها"
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
          to: {
            name: "Closing"
          },
          title: "عملیات بستن و انتقال"
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
