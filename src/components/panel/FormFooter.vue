<template>
  <div class="row rtl d-print-none">
    <div class="col-12 col-md-6">
      <template v-if="showNavigationButtons">
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
      </template>
    </div>
    <div class="col-12 col-md-6 ltr text-left" dir="ltr" v-if="!financialYear.is_closed">
      <template v-if="isEditing">
        <slot></slot>
        <button
          v-if="showSubmitAndClearForm"
          @click="validate(true)"
          type="button"
          class="btn submit btn-success foat-left"
          :disabled="!canSubmit"
        >ثبت و صدور {{ formName }} جدید</button>
        <button
          @click="validate(false)"
          type="button"
          :disabled="!canSubmit"
          class="btn submit btn-success foat-left w-100px"
        >ثبت</button>
        <button
          @click="emitDelete"
          type="button"
          v-if="deletable"
          :disabled="!canDelete"
          class="btn submit btn-danger"
        >حذف</button>
      </template>
      <button v-else @click="edit()" type="button" class="btn submit btn-info foat-left">ویرایش</button>
      <slot name="always"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formName: {
      required: true
    },
    showNavigationButtons: {
      default: true
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
    },
    canDelete: {
      default: true
    },
    confirmEdit: {
      default: true
    },
    editable: {
      default: false
    },
    deletable: {
      default: false
    },
    showSubmitAndClearForm: {
      default: true
    }
  },
  data() {
    return {
      isEditing: false
    };
  },
  created() {
    if (this.confirmEdit) {
      this.isEditing = false;
      this.setIsEditing();
    } else {
      this.isEditing = true;
    }
  },
  watch: {
    editable() {
      this.setIsEditing();
    }
  },
  methods: {
    setIsEditing() {
      if (this.isEditing != this.editable) this.isEditing = this.editable;
    },
    goToForm(pos) {
      this.$emit("goToForm", pos);
    },
    validate(clearForm) {
      this.$emit("validate", clearForm);
    },
    edit() {
      this.$emit("edit");
      this.isEditing = true;
    },
    emitDelete() {
      this.$emit("delete");
    }
  }
};
</script>

<style scoped lang="scss">
</style>
