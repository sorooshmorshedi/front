<template>
  <balance title="تراز حساب ها" :cols="datatableCols" url="reports/balance"/>
</template>

<script>
import datatableCols from "./_datatableCols";
import Balance from "../Balance";

export default {
  name: "AccountsBalance",
  components: { Balance },
  data() {
    return {
      datatableCols
    };
  }
};
</script>