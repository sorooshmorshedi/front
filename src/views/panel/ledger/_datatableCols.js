export default {
  url: "reports/ledger",
  cols: [{
      text: "تاریخ",
      value: "sanad.date",
      type: "date",
      sortable: false,
      filterable: false,
    },
    {
      text: "شماره سند",
      value: "sanad.code",
      type: "numeric",
      sortable: false,
      filterable: false,
    },
    {
      text: "شرح",
      value: "explanation",
      sortable: false,
      filterable: false,
    },
    {
      text: "کد حساب",
      value: "account.code",
      showRangeFilter: true,
      sortable: false,
    },
    {
      text: "نام حساب",
      value: "account.name",
      sortable: false,
    },
    {
      text: "بدهکار",
      value: "bed",
      type: "money",
      sortable: false,
      filterable: false,
    },
    {
      text: "بستانکار",
      value: "bes",
      type: "money",
      sortable: false,
      filterable: false,
    },
    {
      text: "مانده",
      value: "remain",
      sortable: false,
      filterable: false,
      align: 'center'
    },
    {
      text: "تشخیص",
      value: "remain_type",
      sortable: false,
      filterable: false,
      align: 'center'
    },
  ],
}