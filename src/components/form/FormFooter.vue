<template>
  <v-card flat class="pa-1 d-flex justify-space-between flex-column flex-md-row align-center">
    <div>
      <template v-if="showNavigationButtons">
        <v-btn @click="goToForm('first')" :disabled="!hasFirst" title="اولین" icon>
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12" />
          </svg>
        </v-btn>
        <v-btn @click="goToForm('prev')" :disabled="!hasPrev" icon title="قبلی" class="pr-1">
          <v-icon>skip_next</v-icon>
        </v-btn>
        <v-btn @click="goToForm('next')" :disabled="!hasNext" icon title="بعدی" class="pr-1">
          <v-icon>skip_previous</v-icon>
        </v-btn>
        <v-btn @click="goToForm('last')" :disabled="!hasLast" icon title="آخرین" class="pr-1">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20,5V19L13,12M6,5V19H4V5M13,5V19L6,12" />
          </svg>
        </v-btn>
      </template>
    </div>
    <div v-if="!financialYear.is_closed" class="order-first order-md-last">
      <template v-if="isEditing">
        <slot></slot>
        <v-btn @click="emitDelete" v-if="deletable" :disabled="!canDelete" color="red" outlined>حذف</v-btn>
        <v-btn
          @click="validate(false)"
          :disabled="!canSubmit"
          class="w-100px mr-1 green white--text"
        >ثبت</v-btn>
        <v-btn
          v-if="showSubmitAndClearForm"
          @click="validate(true)"
          class="mr-1 green white--text"
          :disabled="!canSubmit"
        >ثبت و صدور {{ formName }} جدید</v-btn>
      </template>
      <v-btn v-else @click="edit()" class="submit amber">ویرایش</v-btn>
      <slot name="always"></slot>
    </div>
  </v-card>
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
