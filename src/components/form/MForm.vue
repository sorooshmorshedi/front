<template>
  <v-row>
    <v-col cols="12" :md="formWidth">
      <v-card>
        <v-card-title v-if="showHeader">
          <span>{{ title }}</span>
          <v-spacer></v-spacer>
          <v-btn
            small
            v-if="showClearBtn"
            @click.prevent="emit('clearForm')"
            href="#/"
            outlined
            class="teal--text mr-1"
          >جدید</v-btn>
          <v-btn small v-if="showListBtn" class="light-blue white--text mr-1" :to="listRoute">لیست</v-btn>
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
          <slot name="default"></slot>
        </v-card-text>

        <v-card-actions v-if="showActions">
          <template v-if="showNavigationBtns">
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
          <div v-if="hasFinancialYear" class="order-first order-md-last">
            <template v-if="isEditing">
              <v-btn @click="emitDelete" v-if="canDelete" color="red" outlined>حذف</v-btn>
              <v-btn
                @click="submit(false)"
                v-if="canSubmit"
                class="w-100px mr-1 green white--text"
              >ثبت</v-btn>
              <v-btn
                v-if="showSubmitAndClearBtn && canSubmit"
                @click="submit(true)"
                class="mr-1 green white--text"
              >ثبت و صدور جدید</v-btn>
              <v-btn
                v-if="canCancelConfirm"
                outlined
                @click="cancelConfirm()"
                color="red"
              >{{ cancelConfirmBtnText }}</v-btn>
              <v-btn
                v-if="canConfirm"
                @click="confirm()"
                color="blue white--text"
                class="mr-1"
              >{{ confirmBtnText }}</v-btn>
              <slot name="footer-btns"></slot>
            </template>
            <v-btn v-else-if="canEdit" @click="edit()" class="submit amber w-100px">ویرایش</v-btn>
            <slot name="footer-outside-btns"></slot>
          </div>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" :md="listWidth" v-if="showList" class="items-list">
      <v-card>
        <v-card-text>
          <m-datatable
            :headers="cols"
            :items="items"
            @click:row="rowClick"
            v-on="listeners"
            :filters.sync="filters"
          >
            <!-- Pass user templates to m-data-table -->
            <template v-for="(index, name) in $slots" v-slot:[name]>
              <slot :name="name" />
            </template>
            <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
              <slot :name="name" v-bind="data"></slot>
            </template>
          </m-datatable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import MDatatable from "@/components/mcomponents/datatable/MDatatable";

export default {
  name: "MForm",
  components: { MDatatable },
  props: {
    showHeader: {
      default: true
    },
    title: {
      required: true
    },
    showListBtn: {
      default: true
    },
    listRoute: {
      default: undefined
    },
    showClearBtn: {
      default: true
    },
    exportParams: {},

    showList: {
      default: true
    },
    items: {
      default: () => []
    },
    cols: {
      default: () => []
    },

    showActions: {
      default: true
    },
    showNavigationBtns: {
      default: true
    },
    hasFirst: {
      default: true
    },
    hasPrev: {
      default: true
    },
    hasNext: {
      default: true
    },
    hasLast: {
      default: true
    },

    canSubmit: {
      default: true
    },
    canDelete: {
      default: true
    },
    canEdit: {
      default: true
    },

    isEditing: {
      default: false
    },

    showSubmitAndClearBtn: {
      default: true
    },

    canConfirm: {
      default: false
    },
    canCancelConfirm: {
      default: false
    },
    confirmBtnText: {
      default: "تایید"
    },
    cancelConfirmBtnText: {
      default: "لغو تایید"
    },

    fullWidth: {
      default: false
    }
  },
  data() {
    return {
      exportBaseUrl: "reports/lists/",
      filters: {}
    };
  },
  computed: {
    formWidth() {
      if (this.fullWidth) return 12;
      return this.showList ? 6 : 12;
    },
    listWidth() {
      if (this.fullWidth) return 12;
      return 6;
    },

    listeners() {
      let listeners = this.$listeners;
      listeners["click:row"] = this.rowClick;
      return listeners;
    },
    hasFinancialYear() {
      let financialYearSafeRoutes = ["Companies", "FinancialYears", "Cities"];
      if (financialYearSafeRoutes.includes(this.$route.name)) return true;
      return this.financialYear && !this.financialYear.is_closed;
    },
    hasExport() {
      if (this.exportParams && this.exportParams.id) return true;
      return false;
    },
    printUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + this.listRoute.params.form + "s/html?";
      path = this.addParams(path);
      return this.endpoint(path);
    },
    pdfUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + this.listRoute.params.form + "s/pdf?";
      path = this.addParams(path);
      return this.endpoint(path);
    }
  },
  methods: {
    emit(event) {
      this.$emit(event);
    },
    addParams(url) {
      Object.keys(this.listRoute.params).forEach(k => {
        url += k + "=" + this.listRoute.params[k] + "&";
      });
      Object.keys(this.exportParams).forEach(k => {
        url += k + "=" + this.exportParams[k] + "&";
      });
      url += "token=" + this.token;
      return url;
    },
    edit() {
      this.$emit("update:is-editing", true);
    },
    confirm() {
      this.$emit("confirm");
    },
    cancelConfirm() {
      this.$emit("cancelConfirm");
    },
    goToForm(pos) {
      this.$emit("goToForm", pos);
    },
    submit(clearForm) {
      this.$emit("submit", clearForm);
    },
    emitDelete() {
      this.$emit("delete");
    },
    rowClick(item) {
      this.$emit("update:is-editing", false);
      this.$emit("click:row", item);
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
    td {
      text-align: center !important;
    }

    th {
      background-color: #eeeeee !important;
    }

    td {
      padding: 2px !important;
      height: 32px !important;
      // vertical-align: top;

      &:last-child {
        vertical-align: middle;
      }
    }

    .v-data-table th {
      text-align: center;
    }

    .v-text-field input {
      padding: 4px 0px !important;
    }

    .v-text-field--filled.v-input--dense.v-text-field--single-line
      > .v-input__control
      > .v-input__slot,
    .v-text-field--filled.v-input--dense.v-text-field--outlined
      > .v-input__control
      > .v-input__slot,
    .v-text-field--full-width.v-input--dense.v-text-field--single-line
      > .v-input__control
      > .v-input__slot,
    .v-text-field--full-width.v-input--dense.v-text-field--outlined
      > .v-input__control
      > .v-input__slot,
    .v-text-field--outlined.v-input--dense.v-text-field--single-line
      > .v-input__control
      > .v-input__slot,
    .v-text-field--outlined.v-input--dense.v-text-field--outlined
      > .v-input__control
      > .v-input__slot {
      min-height: 30px !important;
    }

    .v-text-field.v-text-field--enclosed .v-text-field__details,
    .v-text-field.v-text-field--enclosed > .v-input__control > .v-input__slot {
      padding: 0px 4px !important;
    }

    .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
      .v-input__prepend-outer,
    .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
      .v-input__prepend-inner,
    .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
      .v-input__append-inner,
    .v-text-field.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined
      .v-input__append-outer {
      margin-top: 3px !important;
    }
  }

  .items-list {
    tr:hover {
      cursor: pointer !important;
    }
  }
}
</style>

