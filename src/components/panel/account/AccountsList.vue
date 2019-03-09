<template>
  <div>
    <datatable :cols="cols" :data="accounts" @rowClick="rowClick"/>
  </div>
</template>
<script>
import { fromCodeFilter, toCodeFilter } from "@/mixin/account.js";
import datatable from "@/components/mcomponents/datatable/Client";

export default {
  props: {
    accounts: {
      required: true
    }
  },
  components: { datatable },
  data() {
    return {
      cols: [
        {
          th: "کد حساب",
          td: "code",
          type: "number",
          filters: [
            {
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
    };
  },
  created() {},
  mounted() {},
  watch: {},
  methods: {
    rowClick(item) {
      this.$emit("rowClick", item);
    }
  }
};
</script>

<style scoped lang="scss">
</style>

