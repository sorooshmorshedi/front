export default {
  url: "reports/ledger",
  cols: [{
      th: "تاریخ",
      td: "sanad.date",
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
      th: "شماره سند",
      td: "sanad.code",
      type: "number",
      filters: ["code__icontains"]
    },
    {
      th: "شرح",
      td: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
    },
    {
      th: "کد حساب",
      td: "account.code",
      type: "number",
      filters: [{
        label: 'از کد حساب',
        model: "account__code__gte"
      }, {
        label: 'تا کد حساب',
        model: "account__code__lte"
      }]
    },
    {
      th: "نام حساب",
      td: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      th: "بدهکار",
      td: "bed",
      type: "money",
      sortable: false,
    },
    {
      th: "بستانکار",
      td: "bes",
      type: "money",
      sortable: false,
    },
    {
      th: "مانده",
      td: "remain",
      type: "money",
      sortable: false,
      render(item, items, oldItems) {
        return item.bed - item.bes;
      },
    },
    {
      th: "تشخیص",
      td: "remainType",
      type: "string",
      sortable: false,
      render(item) {
        let diff = item.bed > item.bes;
        if (diff == 0) return '';
        if (diff > 0) return 'بدهکار';
        if (diff < 0) return 'بستانکار';
        return 'error';
      }
    },
  ],
}
