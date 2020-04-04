import _ from 'lodash';
export default {
  cols: [
    {
      th: "تفضیلی شناور",
      td: "float_account_name",
      type: "text",
      filters: ["float_account_name"]
    },
    {
      th: "جمع بدهکار",
      td: "bed_sum",
      type: "money",
      filters: ["bed_sum"]
    },
    {
      th: "جمع بستانکار",
      td: "bes_sum",
      type: "money",
      filters: ["bes_sum"]
    },
    {
      th: "مانده بدهکار",
      td: "bed_remain",
      type: "money",
      filters: ["bed_remain"]
    },
    {
      th: "مانده بستانکار",
      td: "bes_remain",
      type: "money",
      filters: ["bes_remain"]
    },
  ],
}
