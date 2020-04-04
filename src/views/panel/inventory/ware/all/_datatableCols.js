export default {
  routerName: 'FactorForm',
  cols: [{
    th: "کالا",
    td: "name",
    type: "text",
    sortable: false,
    sortable: false,
    filters: ["name__icontains"]
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
    colspan: '2',
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
