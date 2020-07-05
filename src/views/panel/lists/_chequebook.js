export default {
  url: "reports/lists/chequebooks",
  routerName: 'ChequebookForm',
  cols: [{
      th: "حساب",
      td: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      th: "سری",
      td: "serial",
      type: "text",
      filters: ["serial__icontains"]
    },
    {
      th: "از سریال",
      td: "serial_from",
      type: "number",
      filters: ["serial__icontains"]
    },
    {
      th: "تا سریال",
      td: "serial_to",
      type: "number",
      filters: ["serial__icontains"]
    },
    {
      th: "توضیحات",
      td: "explanation",
      type: "text",
      filters: ["account__icontains"]
    },
  ],
  label: 'دسته چک ها'
}
