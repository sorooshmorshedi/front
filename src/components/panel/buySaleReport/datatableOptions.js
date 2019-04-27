export default {
  url: "reports/lists/factorItems",
  cols: [{
      th: "نوع فاکتور",
      td: "factor.type",
      type: "select",
      options: [
        {
          label: 'موجودی اول دوره',
          value: 'fpi',
        },
        {
          label: 'فروش',
          value: 'sale',
        },
        {
          label: 'برگشت از فروش',
          value: 'backFromSale',
        },
        {
          label: 'خرید',
          value: 'buy',
        },
        {
          label: 'برگشت از خرید',
          value: 'backFromBuy',
        }
      ],
      filters: ["factor__type"],
    },
    {
      th: "تاریخ",
      td: "factor.date",
      type: "date",
      filters: [{
          label: "xxxx-xx-xx از تاریخ ",
          model: "factor__date__gte"
        },
        {
          label: "xxxx-xx-xx تا تاریخ",
          model: "factor__date__lte"
        }
      ]
    },
    {
      th: "شماره عطف",
      td: "factor.id",
      type: "number",
      filters: ["factor__id"]
    },
    {
      th: "شماره فاکتور",
      td: "factor.code",
      type: "number",
      filters: ["factor__code"]
    },
    {
      th: "خریدار/فروشنده",
      td: "factor.account.name",
      type: "text",
      filters: ["factor__account__name__icontains"]
    },
    {
      th: "انبار",
      td: "warehouse.name",
      type: "text",
      filters: ["warehouse__name__icontains"]
    },
    {
      th: "تعداد",
      td: "count",
      type: "money",
      filters: ['count'],
      sortable: false,
    },
    {
      th: "فی",
      td: "fee",
      type: "money",
      filters: ['fee'],
      sortable: false,
    },
    {
      th: "مبلغ",
      td: "value",
      type: "money",
      filters: [],
      sortable: false,
    },
    {
      th: "تخفیف",
      td: "discount",
      type: "money",
      filters: [],
      sortable: false,
    },
    {
      th: "مبلغ کل",
      td: "total_value",
      type: "money",
      filters: [],
      sortable: false,
    },
    {
      th: "شرح فاکتور",
      td: "factor__explanation",
      type: "text",
      filters: ["factor__explanation__icontains"]
    },
    {
      th: "توضیحات",
      td: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
    },
  ],
}
