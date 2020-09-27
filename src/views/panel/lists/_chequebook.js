export default {
  url: "reports/lists/chequebooks",
  routerName: 'ChequebookForm',
  cols: [{
      text: "حساب",
      value: "account.name",
      type: "text",
      filters: ["account__name__icontains"]
    },
    {
      text: "سری",
      value: "serial",
      type: "text",
      filters: ["serial__icontains"]
    },
    {
      text: "از سریال",
      value: "serial_from",
      type: "number",
      filters: ["serial__icontains"]
    },
    {
      text: "تا سریال",
      value: "serial_to",
      type: "number",
      filters: ["serial__icontains"]
    },
    {
      text: "توضیحات",
      value: "explanation",
      type: "text",
      filters: ["account__icontains"]
    },
  ],
  label: 'دسته چک ها'
}
