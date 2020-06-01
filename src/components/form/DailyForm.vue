<template>
  <v-card>
    <v-card-title>
      <span>{{ title }}</span>
      <v-spacer></v-spacer>
      <v-btn
        small
        v-if="hasClear"
        @click.prevent="emit('clearForm')"
        href="#/"
        class="light-blue white--text mr-1"
      >جدید</v-btn>
      <v-btn
        small
        v-if="hasList"
        class="light-blue white--text mr-1"
        :to="{name: ListRouteName, params: ListRouteParams}"
      >انتخاب {{ formName }}</v-btn>
      <slot name="header-btns"></slot>
      <template v-if="hasExport">
        <v-btn
          small
          class="export-btn mr-1"
          :href="printUrl"
          target="_blank"
          rel="noopener noreferrer"
        >چاپ</v-btn>
        <v-btn small class="export-btn mr-1" :href="pdfUrl" rel="noopener noreferrer">PDF</v-btn>
      </template>
    </v-card-title>

    <v-card-text class="form-fields">
      <slot name="inputs"></slot>
    </v-card-text>

    <v-card-actions>
      <template v-if="showNavigationButtons">
        <v-btn @click="goToForm('first')" :disabled="!hasFirst" title="اولین" icon>
          <v-icon>fa-fast-forward</v-icon>
        </v-btn>
        <v-btn @click="goToForm('prev')" :disabled="!hasPrev" icon title="قبلی" class="pr-1">
          <v-icon>fa-step-forward</v-icon>
        </v-btn>
        <v-btn @click="goToForm('next')" :disabled="!hasNext" icon title="بعدی" class="pr-1">
          <v-icon>fa-step-backward</v-icon>
        </v-btn>
        <v-btn @click="goToForm('last')" :disabled="!hasLast" icon title="آخرین" class="pr-1">
          <v-icon>fa-fast-backward</v-icon>
        </v-btn>
      </template>
      <v-spacer></v-spacer>
      <div v-if="!financialYear.is_closed" class="order-first order-md-last">
        <template v-if="isEditing">
          <slot></slot>
          <v-btn
            @click="emitDelete"
            v-if="deletable"
            :disabled="!canDelete"
            color="red"
            outlined
          >حذف</v-btn>
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
        <v-btn v-else @click="edit()" class="submit amber w-100px">ویرایش</v-btn>
        <slot name="always"></slot>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
import formsMixin from "@/mixin/forms";
export default {
  name: "DailyForm",
  props: {
    title: {
      required: true
    },
    formName: {
      required: true
    },
    ListRouteName: {
      default: "List"
    },
    hasClear: {
      default: true
    },
    ListRouteParams: {},
    exportParams: {},
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
      exportBaseUrl: "reports/lists/",

      isEditing: false
    };
  },
  computed: {
    hasExport() {
      if (
        this.ListRouteName &&
        this.ListRouteParams &&
        this.ListRouteParams.form &&
        this.exportParams &&
        this.exportParams.id
      )
        return true;
      return false;
    },
    hasList() {
      return this.ListRouteName;
    },
    printUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + this.ListRouteParams.form + "s/html?";
      path = this.addParams(path);
      return this.endpoint(path);
    },
    pdfUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + this.ListRouteParams.form + "s/pdf?";
      path = this.addParams(path);
      return this.endpoint(path);
    }
  },

  watch: {
    editable() {
      this.setIsEditing();
    }
  },
  created() {
    if (this.confirmEdit) {
      this.isEditing = false;
      this.setIsEditing();
    } else {
      this.isEditing = true;
    }
  },
  methods: {
    emit(event) {
      this.$emit(event);
    },
    addParams(url) {
      Object.keys(this.ListRouteParams).forEach(k => {
        url += k + "=" + this.ListRouteParams[k] + "&";
      });
      Object.keys(this.exportParams).forEach(k => {
        url += k + "=" + this.exportParams[k] + "&";
      });
      url += "token=" + this.token;
      return url;
    },
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

<style lang="scss">
.form-fields {
  table {
    textarea {
      margin-top: 0px !important;
    }

    th,
    td,
    input {
      text-align: center;
    }

    th {
      background-color: #eeeeee !important;
    }

    td {
      padding: 2px !important;
    }
  }

  .v-data-table th {
    text-align: center;
  }
}
</style>

