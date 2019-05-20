export default {
  cols: [{
    th: "تاریخ",
    td: "factor.date",
    type: "date",
    sortable: false,
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
    th: "نوع فاکتور",
    td: "factor.type",
    type: "select",
    sortable: false,
    options: [{
      label: 'خرید',
      value: 'buy'
    }, {
      label: 'برگشت از خرید',
      value: 'backFromBuy'
    }, {
      label: 'فروش',
      value: 'sale'
    }, {
      label: 'برگشت از فروش',
      value: 'backFromSale'
    }, {
      label: 'موجودی اول دوره',
      value: 'fpi'
    }],
    filters: ['factor__type']
  },
  {
    th: "شماره فاکتور",
    td: "factor.code",
    type: "number",
    sortable: false,
    filters: ["factor__code"]
  },
  {
    th: "شرح فاکتور",
    td: "factor.explanation",
    type: "text",
    sortable: false,
    filters: ["factor__explanation"]
  },
  {
    th: "انبار",
    td: "warehouse.name",
    type: "text",
    sortable: false,
    filters: ["warehouse__name__icontains"]
  },
  {
    th: "نام حساب",
    td: "factor.account.name",
    type: "text",
    sortable: false,
    sortable: false,
    filters: ["factor__account__name__icontains"]
  },
  {
    th: "وارده",
    td: "input",
    type: "number",
    sortable: false,
    filters: []
  },
  {
    th: "صادره",
    td: "output",
    type: "number",
    sortable: false,
    filters: []
  },
  {
    th: "مانده",
    td: "remain",
    type: "number",
    sortable: false,
    filters: []
  },
  ],
}
