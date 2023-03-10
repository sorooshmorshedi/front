<template>
  <v-row :class="{ 'is-editing': isEditing }">
    <v-col cols="12" :md="formWidth">
      <v-card>
        <v-card-title v-if="showHeader">
          <span>{{ title }}</span>
          <v-spacer></v-spacer>
          <div class="d-flex flex-wrap justify-center mt-2">
            <v-btn
              small
              v-if="showClearBtn"
              @click.prevent="emit('clearForm')"
              href="#/"
              outlined
              class="teal--text mt-1 mt-md-0"
              icon
              title="جدید"
            >
              <v-icon>fa-eraser</v-icon>
            </v-btn>
            <v-btn
              small
              v-if="showListBtn"
              class="light-blue white--text mr-1 mt-1 mt-md-0"
              :to="listRoute"
              icon
              outlined
              title="لیست"
            >
              <v-icon>fa-th-list</v-icon>
            </v-btn>
            <slot name="header-btns"></slot>
            <template v-if="hasExport">
              <span>
                <v-btn
                  small
                  class="export-btn mr-1 mt-1 mt-md-0"
                  :href="printUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="چاپ"
                  icon
                >
                  <v-icon>fa-print</v-icon>
                </v-btn>
                <v-btn
                  small
                  class="export-btn mr-1 mt-1 mt-md-0"
                  :href="pdfUrl"
                  rel="noopener noreferrer"
                  title="PDF"
                  icon
                >
                  <v-icon>fa-file-pdf</v-icon>
                </v-btn>
                <v-btn
                  small
                  class="export-btn mr-1 mt-1 mt-md-0"
                  @click="downloadUrl(excelUrl)"
                  title="اکسل"
                  icon
                >
                  <v-icon>fa-file-excel</v-icon>
                </v-btn>
              </span>
            </template>
          </div>
        </v-card-title>

        <v-card-text class="form-fields">
          <slot name="default"></slot>
        </v-card-text>

        <v-card-actions v-if="showActions">
          <v-row no-gutters class="d-flex flex-column-reverse flex-md-row mb-1">
            <v-col
              cols="12"
              md="6"
              class="d-flex justify-center justify-md-start mt-2 mt-md-0"
            >
              <template v-if="showNavigationBtns">
                <v-btn
                  @click="goToForm('first')"
                  :disabled="!hasFirst"
                  title="اولین"
                  icon
                >
                  <v-icon>fa-fast-forward</v-icon>
                </v-btn>
                <v-btn
                  @click="goToForm('prev')"
                  :disabled="!hasPrev"
                  icon
                  title="قبلی"
                  class="pr-1"
                >
                  <v-icon>fa-step-forward</v-icon>
                </v-btn>
                <v-btn
                  @click="goToForm('next')"
                  :disabled="!hasNext"
                  icon
                  title="بعدی"
                  class="pr-1"
                >
                  <v-icon>fa-step-backward</v-icon>
                </v-btn>
                <v-btn
                  @click="goToForm('last')"
                  :disabled="!hasLast"
                  icon
                  title="آخرین"
                  class="pr-1"
                >
                  <v-icon>fa-fast-backward</v-icon>
                </v-btn>
              </template>
            </v-col>
            <v-col
              cols="12"
              md="6"
              class="d-flex justify-center justify-md-end"
            >
              <div
                v-if="hasFinancialYear"
                class="d-flex flex-wrap justify-center"
              >
                <template v-if="isEditing">
                  <v-btn
                    @click="emitDelete"
                    v-if="canDelete"
                    color="red"
                    outlined
                    class="mt-1 mt-md-0 ml-1"
                    >حذف</v-btn
                  >
                  <v-btn
                    @click="submit(false)"
                    v-if="canSubmit"
                    class="w-100px ml-1 green white--text mt-1 mt-md-0"
                    >ثبت</v-btn
                  >
                  <v-btn
                    v-if="showSubmitAndClearBtn && canSubmit"
                    @click="submit(true)"
                    class="ml-1 mt-1 mt-md-0 green white--text"
                    >ثبت و صدور جدید</v-btn
                  >
                  <slot name="footer-btns"></slot>
                </template>
                <v-btn
                  v-else-if="canEdit"
                  @click="edit()"
                  class="submit amber w-100px mt-1 mt-md-0"
                  >ویرایش</v-btn
                >

                <v-btn
                  v-if="isDefinable"
                  @click="parentCall('defineItem', [false])"
                  :disabled="!canDefine"
                  class="blue white--text mr-1"
                  >قطعی کردن</v-btn
                >

                <v-btn
                  v-if="hasLock"
                  @click="parentCall('toggleItemLock')"
                  class="white--text mr-1"
                  :class="isLocked ? 'red' : 'green'"
                  icon
                  :title="isLocked ? 'باز کردن قفل' : 'قفل کردن'"
                >
                  <v-icon v-if="isLocked">fa-lock</v-icon>
                  <v-icon v-else>fa-unlock</v-icon>
                </v-btn>

                <span class="mt-1 mt-md-0">
                  <slot name="footer-outside-btns"></slot>
                </span>
              </div>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" :md="listWidth" v-if="showList" class="items-list">
      <v-card>
        <v-card-text>
          <m-datatable
            :headers="cols"
            :api-url="apiUrl"
            :items="items"
            @click:row="rowClick"
            v-on="listeners"
            v-bind="$attrs"
            :filters.sync="filters"
            ref="datatable"
          >
            <!-- Pass user templates to m-data-table -->
            <template v-for="(index, name) in $slots" v-slot:[name]>
              <slot :name="name" />
            </template>
            <template
              v-for="(index, name) in $scopedSlots"
              v-slot:[name]="data"
            >
              <slot :name="name" v-bind="data"></slot>
            </template>
          </m-datatable>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import MDatatable from "@/components/m-datatable";

export default {
  name: "MForm",
  components: { MDatatable },
  props: {
    showHeader: {
      default: true,
    },
    title: {
      required: true,
    },
    showListBtn: {
      default: true,
    },
    listRoute: {
      default: undefined,
    },
    showClearBtn: {
      default: true,
    },
    exportBaseUrl: {},
    exportParams: {
      default: () => {},
    },

    showList: {
      default: true,
    },
    items: {
      default: undefined,
    },
    apiUrl: {
      default: undefined,
    },
    cols: {
      default: () => [],
    },

    showActions: {
      default: true,
    },
    showNavigationBtns: {
      default: true,
    },
    hasFirst: {
      default: true,
    },
    hasPrev: {
      default: true,
    },
    hasNext: {
      default: true,
    },
    hasLast: {
      default: true,
    },

    canSubmit: {
      default: true,
    },
    canDelete: {
      default: true,
    },
    canEdit: {
      default: true,
    },

    isEditing: {
      default: false,
    },

    showSubmitAndClearBtn: {
      default: true,
    },

    fullWidth: {
      default: false,
    },
  },
  data() {
    return {
      filters: {},
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
      if (Object.keys(listeners).includes("click:row"))
        listeners["click:row"] = this.rowClick;
      return listeners;
    },
    hasFinancialYear() {
      let financialYearSafeRoutes = [
        "Companies",
        "FinancialYears",
        "Cities",
        "Profile",
      ];
      if (financialYearSafeRoutes.includes(this.$route.name)) return true;
      return this.financialYear && !this.financialYear.is_closed;
    },
    hasExport() {
      return (
        this.exportBaseUrl != undefined && this.exportParams.id != undefined
      );
    },
    printUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + "/html?";
      path = this.addParams(path);
      return this.endpoint(path);
    },
    pdfUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + "/pdf?";
      path = this.addParams(path);
      return this.endpoint(path);
    },
    excelUrl() {
      if (!this.hasExport) return "";
      let path = this.exportBaseUrl + "/xlsx?";
      path = this.addParams(path);
      return this.endpoint(path);
    },
    isDefinable() {
      return this.canEdit && this.$parent.isDefinable && this.$parent.item.id;
    },
    canDefine() {
      return !this.$parent.item.is_defined;
    },
    hasLock() {
      return this.canEdit && this.$parent.hasLock && this.$parent.item.id;
    },
    isLocked() {
      return this.$parent.item.is_locked;
    },
    parent() {
      return this.$parent;
    },
  },
  mounted() {
    window.addEventListener("keyup", (event) => {
      if (this.isEditing && event.key == "Enter") {
        this.submit(false);
      }
    });
  },
  methods: {
    emit(event) {
      this.$emit(event);
    },
    addParams(url) {
      if (this.listRoute && this.listRoute.params) {
        Object.keys(this.listRoute.params).forEach((k) => {
          url += k + "=" + this.listRoute.params[k] + "&";
        });
      }
      Object.keys(this.exportParams).forEach((k) => {
        url += k + "=" + this.exportParams[k] + "&";
      });
      url += "token=" + this.token;
      return url;
    },
    edit() {
      this.$emit("update:is-editing", true);
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
    emitDefine(indefine) {
      this.$emit("define");
      this.$parent.defineItem;
    },
    rowClick(item) {
      this.$emit("update:is-editing", false);
      this.$emit("click:row", item);
    },
    parentCall(methodName, params = []) {
      this.$parent[methodName](...params);
    },
  },
};
</script>

<style lang="scss">
.form-fields {
  .v-input {
    font-size: 11px !important;
  }
  input {
    font-size: 11px !important;
    padding: 2px 0px !important;
  }
  label {
    font-size: 13px !important;
  }

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
      min-height: 32px !important;
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
