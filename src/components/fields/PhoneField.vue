<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    dir="text-field-ltr"
    :hide-details="false"
    :rules="rules"
    type="number"
  />
</template>

<script>
export default {
  name: "PhoneField",
  data() {
    return {
      rules: [(value) => /09\d{9}/.test(value) || "شماره موبایل اشتباه است"],
    };
  },
};
</script>