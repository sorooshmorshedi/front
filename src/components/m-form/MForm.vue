<template>
  <v-row :class="{ 'is-editing': isEditing }">
    <v-col cols="12" :md="formWidth">
      <v-card class="rounded-lg">
        <v-card-title v-if="showHeader">
          <span class="black_theme--text">{{ title }}</span>
          <v-spacer></v-spacer>
          <div class="d-flex flex-wrap justify-center mt-2 ">
            <v-tooltip top color="accent">
              <template v-slot:activator="{ on, attrs }">

                <v-btn
                    v-if="showClearBtn"
                    @click.prevent="emit('clearForm')"
                    href="#/"
                    class="accent mt-1 mt-md-0 pa-4"
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-img max-height="25" max-width="25" src="/img/icons/new_form.svg"></v-img>
                </v-btn>
              </template>
              ایجاد فرم جدید
            </v-tooltip>

            <v-tooltip top color="secondary">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    v-bind="attrs"
                    v-on="on"
                    small
                    v-if="showListBtn"
                    class="secondary white--text mr-1 mt-1 mt-md-0 pa-4"
                    :to="listRoute"
                    icon
                >
                  <v-img max-height="25" max-width="25" src="/img/icons/list_icon.svg"></v-img>
                </v-btn>
              </template>
              لیست
            </v-tooltip>

            <slot name="header-btns"></slot>
            <template v-if="hasExport">
              <span>
                <v-tooltip top color="#019EF6">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        small
                        v-bind="attrs"
                        v-on="on"
                        class="export-btn mr-4 mt-1 mt-md-0 pa-4"
                        :href="printUrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        icon
                    >
                      <v-img max-height="30" max-width="30" src="/img/icons/print_icon.svg"></v-img>
                    </v-btn>
                  </template>
                  چاپ
                </v-tooltip>
                <v-tooltip top color="#019EF6">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        small
                        class="secondary--text export-btn mt-2 mt-sm-0 mr-md-2 "
                        :href="pdfUrl"
                        rel="noopener noreferrer"
                        icon
                    >
                      <v-img src="/img/icons/pdf.svg"></v-img>
                    </v-btn>
                  </template>
                  خروجی PDF
                </v-tooltip>
                <v-tooltip top color="#019EF6">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn depressed
                           icon
                           v-bind="attrs"
                           v-on="on"
                           @click="downloadUrl(excelUrl)"
                           class="secondary--text export-btn mt-2 mt-sm-0 mr-md-2 pa-1">
                      <v-img src="/img/icons/xls.svg"></v-img>
                    </v-btn>
                  </template>
                  خروجی اکسل
                </v-tooltip>
              </span>
            </template>
          </div>
        </v-card-title>

        <v-card-text class="form-fields rounded-lg">
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
                <v-tooltip bottom color="#C2CEDB">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="mr-3"
                        v-bind="attrs"
                        v-on="on"
                        @click="goToForm('first')"
                        :disabled="!hasFirst"
                        icon
                    >
                      <v-img max-height="20" max-width="20" src="/img/icons/bold_double_right.svg"></v-img>
                    </v-btn>
                  </template>
                  اولین
                </v-tooltip>
                <v-tooltip bottom color="#C2CEDB">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        @click="goToForm('prev')"
                        :disabled="!hasPrev"
                        icon
                        class="pr-1"
                    >
                      <v-img max-height="20" max-width="20" src="/img/icons/bold_right.svg"></v-img>
                    </v-btn>
                  </template>
                  قبلی
                </v-tooltip>
                <v-tooltip bottom color="#C2CEDB">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        v-on="on"
                        @click="goToForm('next')"
                        :disabled="!hasNext"
                        icon
                        class="pr-1"
                    >
                      <v-img max-height="20" max-width="20" src="/img/icons/bold_left.svg"></v-img>
                    </v-btn>
                  </template>
                  بعدی
                </v-tooltip>
                <v-tooltip bottom color="#C2CEDB">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        @click="goToForm('last')"
                        :disabled="!hasLast"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        class="pr-1"
                    >
                      <v-img max-height="20" max-width="20" src="/img/icons/bold_double_left.svg"></v-img>
                    </v-btn>
                  </template>
                  آخرین
                </v-tooltip>
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
                      depressed
                      @click="delete_dialog = true"
                      v-if="canDelete"
                      color="error"
                      class="mt-1 mt-md-0 ml-1 rounded-lg"
                  >
                    <v-img class="ml-1" max-width="20" src="/img/icons/delete.svg">

                    </v-img>
                    حذف
                  </v-btn>
                  <v-btn
                      @click="submit(false)"
                      v-if="canSubmit"
                      depressed
                      color="success"
                      class="w-100px ml-1 green white--text mt-1 mt-md-0 rounded-lg"
                  >ثبت
                  </v-btn
                  >
                  <v-btn
                      v-if="showSubmitAndClearBtn && canSubmit"
                      @click="submit(true)"
                      color="success"
                      depressed
                      class="ml-1 mt-1 mt-md-0 green white--text rounded-lg"
                  >ثبت و صدور جدید
                  </v-btn
                  >
                  <slot name="footer-btns"></slot>
                </template>
                <v-btn
                    v-else-if="canEdit"
                    @click="edit()"
                    depressed
                    class="submit warning w-100px mt-1 mt-md-0 rounded-lg"
                >ویرایش
                </v-btn
                >

                <v-btn
                    v-if="isDefinable"
                    @click="parentCall('defineItem', [false])"
                    :disabled="!canDefine"
                    depressed
                    class="secondary white--text mr-1 rounded-lg"
                >قطعی کردن
                </v-btn
                >
                <v-tooltip v-if="hasLock" bottom :color="isLocked ? 'error' : 'success_important'">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        @click="parentCall('toggleItemLock')"
                        class="white--text mr-5"
                        v-bind="attrs"
                        v-on="on"
                        :class="isLocked ? 'error' : 'success_important'"
                        icon
                        :title="isLocked ? 'باز کردن قفل' : 'قفل کردن'"
                    >
                      <v-img v-if="isLocked" class="" max-width="20" src="/img/icons/unlock_1.svg"></v-img>
                      <v-img v-else class="" max-width="20" src="/img/icons/lock_1.svg"></v-img>
                    </v-btn>
                  </template>
                  <span v-if="isLocked"> باز کردن قفل </span>
                  <span v-else> قفل کردن </span>
                </v-tooltip>

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
              <slot class="rounded-lg" :name="name"/>
            </template>
            <template
                v-for="(index, name) in $scopedSlots"
                v-slot:[name]="data"
            >
              <slot class="rounded-lg" :name="name" v-bind="data"></slot>
            </template>
          </m-datatable>
        </v-card-text>
      </v-card>
    </v-col>
    <v-dialog
        v-model="delete_dialog"
        activator="parent"
        transition="dialog-top-transition"
        width="auto"
    >
      <v-card class="pa-5 rounded-lg">
        <v-card-title :style="{'color': '#F1416C'}">
          آیا اطمینان دارید؟
        </v-card-title>
        <v-card-text>
          با توجه به اینکه امکان بازگردانی اطلاعات پس از حذف نمی باشد، آیا از حذف اطمینان دارید؟
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn depressed color="error" @click="delete_dialog = false">خیر</v-btn>
          <v-btn depressed color="success" @click="deleteForm">حذف شود</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>
import MDatatable from "@/components/m-datatable";

export default {
  name: "MForm",
  components: {MDatatable},
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
      default: () => {
      },
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
      default: false,
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
      delete_dialog: false,
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
    deleteForm() {
      this.delete_dialog = false;
      this.emitDelete()
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
      background-color: #FFFFFF !important;
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
