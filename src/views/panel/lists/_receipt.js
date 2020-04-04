export default {
  url: "reports/lists/receipts",
  routerName: 'ReceiptAndRemittance',
  cols: [{
      th: "شماره",
      td: "code",
      type: "number",
      filters: ["code__icontains"]
    },
    {
      th: "تاریخ",
      td: "date",
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
      th: "ساعت",
      td: "time",
      type: "time",
      filters: [{
          label: "از ساعت",
          model: "time__gte"
        },
        {
          label: "تا ساعت",
          model: "time__lte"
        }
      ]
    },
    {
      th: "توضیحات",
      td: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
    },
  ],
}
