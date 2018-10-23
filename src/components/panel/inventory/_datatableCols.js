export default {
  routerName: 'FactorForm',
  cols: [{
      th: "تاریخ",
      td: "factor.date",
      type: "date",
      sortable: false,
      filters: [{
        label: 'از تاریخ',
        model: "factor.date__gte"
      }, {
        label: 'تا تاریخ',
        model: "factor.date__lte"
      }]
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
      }, ],
      filters: ['factor.type']
    },
    {
      th: "شماره فاکتور",
      td: "factor.code",
      type: "number",
      sortable: false,
      filters: ["factor.code"]
    },
    {
      th: "نام حساب",
      td: "factor.account.name",
      type: "text",
      sortable: false,
      sortable: false,
      filters: ["factor.account.name"]
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
      td: "input.total",
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
      td: "output.total",
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
      td: "remain.total",
      type: "money",
      sortable: false,
      filters: []
    },
  ],
  colHeaders: [
    {
      colspan:'5',
      title: '',
    },
    {
      colspan:'3',
      title: 'وارده',
    },
    {
      colspan:'3',
      title: 'صادره',
    },
    {
      colspan:'3',
      title: 'مانده',
    },
  ]
}
