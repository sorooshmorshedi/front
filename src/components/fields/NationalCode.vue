<template>
  <v-text-field
    v-bind="$attrs"
    v-on="$listeners"
    class="text-field-ltr"
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
      rules: [
        (value) => {
          function isValidIranianNationalCode(input) {
            if (!/^\d{10}$/.test(input)) return false;
            const check = +input[9];
            const sum =
              Array.from({ length: 9 })
                .map((_, i) => +input[i] * (10 - i))
                .reduce((x, y) => x + y) % 11;
            return sum < 2 ? check == sum : check + sum == 11;
          }

          return isValidIranianNationalCode(value) || "کد ملی صحیح نمی باشد";
        },
      ],
    };
  },
};
</script>