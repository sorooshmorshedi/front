export default {
  url: "reports/lists/transactions",
  cols: [{
      text: "شماره",
      value: "code",
      type: "number",
      filters: ["code__icontains"]
    },
    {
      text: "نام حساب",
      value: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      text: "تاریخ",
      value: "date",
      type: "date",
      filters: [{
          label: "xxxx-xx-xx از تاریخ ",
          model: "date__gte"
        },
        {
          label: "xxxx-xx-xx تا تاریخ",
          model: "date__lte"
        }
      ]
    },
    {
      text: "توضیحات",
      value: "explanation",
      type: "text",
      filters: ["account__icontains"]
    },
    {
      text: "مبلغ مجموع",
      value: "sanad.bed",
      type: "money",
      filters: ["sanad__bed__icontains"]
    }
  ],
  routerName: 'TransactionForm',
}
