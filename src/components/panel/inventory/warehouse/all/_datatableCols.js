export default {
  cols: [{
    th: "کالا",
    td: "name",
    type: "text",
    sortable: false,
    sortable: false,
    filters: ["name__icontains"]
  },
  {
    th: "وارده",
    td: "input",
    type: "number",
    sortable: false,
    filters: []
  },
  {
    th: "صادره",
    td: "output",
    type: "number",
    sortable: false,
    filters: []
  },
  {
    th: "مانده",
    td: "remain",
    type: "number",
    sortable: false,
    filters: []
  },
  ],
}
