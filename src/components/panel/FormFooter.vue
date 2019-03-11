<template>
  <div class="row rtl d-print-none">
    <div class="col-12 col-md-6">
      <button
        @click="goToForm('first')"
        :disabled="!hasFirst"
        type="button"
        class="btn btn-info"
      >اولین {{ formName }}</button>
      <button
        @click="goToForm('prev')"
        :disabled="!hasPrev"
        type="button"
        class="btn btn-info"
      >{{ formName }} قبلی</button>
      <button
        @click="goToForm('next')"
        :disabled="!hasNext"
        type="button"
        class="btn btn-info"
      >{{ formName }} بعدی</button>
      <button
        @click="goToForm('last')"
        :disabled="!hasLast"
        type="button"
        class="btn btn-info"
      >آخرین {{ formName }}</button>
    </div>
    <div class="col-12 col-md-6 ltr text-left" dir="ltr">
      <button
        @click="validate(true)"
        type="button"
        class="btn submit btn-primary foat-left"
        :disabled="!canSubmit"
      >ثبت و صدور {{ formName }} جدید</button>
      <button
        @click="validate(false)"
        type="button"
        class="btn submit btn-primary loat-left w-100px"
        :disabled="!canSubmit"
      >ثبت</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formName: {
      required: true
    },
    hasFirst: {
      required: true
    },
    hasPrev: {
      required: true
    },
    hasNext: {
      required: true
    },
    hasLast: {
      required: true
    },
    canSubmit: {
      default: true
    }
  },
  data() {
    return {};
  },
  methods: {
    goToForm(pos) {
      this.$emit("goToForm", pos);
    },
    validate(clearForm) {
      this.$emit("validate", clearForm);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
