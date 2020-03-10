<template>
  <balance
    title="تراز حساب های شناور بر اساس گروه"
    :cols="datatableCols"
    url="reports/balance/floatsByGroup"
  />
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