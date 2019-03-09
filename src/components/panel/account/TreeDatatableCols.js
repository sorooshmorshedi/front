import {
  fromCodeFilter,
  toCodeFilter
} from "@/mixin/account.js";
export default {
  cols: [{
      th: "کد حساب",
      td: "code",
      type: "number",
      filters: [{
          label: "از کد حساب",
          model: "code__from",
          filter: fromCodeFilter
        },
        {
          label: "تا کد حساب",
          model: "code__to",
          filter: toCodeFilter
        }
      ]
    },
    {
      th: "نام حساب",
      td: "name",
      type: "text",
      filters: ["name"]
    },
    {
      th: "نوع",
      td: "type.name",
      type: "text",
      filters: ["type.name"]
    },
  ]
}
