export default {
  url: "reports/lists/receipts",
  routerName: 'ReceiptAndRemittance',
  cols: [{
      text: "شماره",
      value: "code",
      type: "number",
      filters: ["code__icontains"]
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
      text: "ساعت",
      value: "time",
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
      text: "توضیحات",
      value: "explanation",
      type: "text",
      filters: ["explanation__icontains"]
    },
  ],
}
