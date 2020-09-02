export default {
  url: "reports/lists/adjustments",
  routerName: 'AdjustmentForm',
  cols: [{
      text: "شماره",
      value: "code",
      type: "number",
    },
    {
      text: "تاریخ",
      value: "date",
      type: "date",
    },
    {
      text: "توضیحات",
      value: "explanation",
      type: "text",
    },
  ],
}