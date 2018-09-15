export default {
  url: "reports/lists/transactions",
  cols: [{
      th: "شماره",
      td: "code",
      type: "number",
      filters: ["code__icontains"]
    },
    {
      th: "نام حساب",
      td: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      th: "تاریخ",
      td: "date",
      type: "date",
      filters: [{
          label: "از تاریخ",
          model: "date__gte"
        },
        {
          label: "تا تاریخ",
          model: "date__lte"
        }
      ]
    },
    {
      th: "توضیحات",
      td: "explanation",
      type: "text",
      filters: ["account__icontains"]
    },
    {
      th: "مبلغ مجموع",
      td: "sanad.bed",
      type: "money",
      filters: ["sanad__bed__icontains"]
    }
  ],
  routerName: 'TransactionForm',
}
