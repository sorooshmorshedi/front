export default {
  routerName: 'FactorForm',
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
    th: "نام حساب",
    td: "factor.account.name",
    type: "text",
    sortable: false,
    sortable: false,
    filters: ["factor__account__name__icontains"]
  },
  {
    th: "مقدار",
    td: "input.count",
    type: "number",
    sortable: false,
    filters: []
  },
  {
    th: "فی",
    td: "input.fee",
    type: "money",
    sortable: false,
    filters: []
  },
  {
    th: "مبلغ",
    td: "input.value",
    type: "money",
    sortable: false,
    filters: []
  },
  {
    th: "مقدار",
    td: "output.count",
    type: "number",
    sortable: false,
    filters: []
  },
  {
    th: "فی",
    td: "output.fee",
    type: "money",
    sortable: false,
    filters: []
  },
  {
    th: "مبلغ",
    td: "output.value",
    type: "money",
    sortable: false,
    filters: []
  },
  {
    th: "مقدار",
    td: "remain.count",
    type: "number",
    sortable: false,
    filters: []
  },
  {
    th: "فی",
    td: "remain.fee",
    type: "money",
    sortable: false,
    filters: []
  },
  {
    th: "مبلغ",
    td: "remain.value",
    type: "money",
    sortable: false,
    filters: []
  },
  ],
  colHeaders: [{
    colspan: '6',
    title: '',
  },
  {
    colspan: '3',
    title: 'وارده',
  },
  {
    colspan: '3',
    title: 'صادره',
  },
  {
    colspan: '3',
    title: 'مانده',
  },
  ]
}
