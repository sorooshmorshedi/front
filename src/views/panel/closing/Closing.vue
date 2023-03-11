<template>
  <m-form
    title=" عملیات های بستن "
    :items="items"
    :cols="headers"
    :showActions="false"
    :canSubmit="false"
    :canDelete="false"
    :showListBtn="false"
    :show-navigation-btns="false"
    :show-clear-btn="false"
  >
    <template #header-btns>
      <v-btn
        @click="openConfirmDialog('cancel-closing')"
        depressed
        :disabled="!financialYear.is_closed"
        class="accent roundedlg white--text"
      >لغو بستن سال مالی جاری</v-btn>
    </template>

    <template #default>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
              class="rounded-lg"
              :return-object="true"
              label=" * سال مالی جدید"
              :items="financialYears"
              v-model="targetFinancialYear"
              item-text="name"
              item-value="id"
              :multiple="false"
          />
        </v-col>

        <v-col class="d-flex justify-end">
          <v-btn
              depressed
            :disabled="financialYear.is_closed || !targetFinancialYear"
            @click="openConfirmDialog('close-and-move')"
            class="success rounded-lg white--text w-100px"
          >بستن و انتقال</v-btn>
          <v-btn
              depressed
            :disabled="financialYear.is_closed || !targetFinancialYear"
            @click="openConfirmDialog('move')"
            class="success rounded-lg white--text w-100px mr-1"
          >انتقال</v-btn>
        </v-col>
      </v-row>

      <v-dialog
        v-model="confirmDialog"
        scrollable
        max-width="500px"
        transition="dialog-transition"
        v-if="operation"
      >
        <v-card class="rounded-lg pa-2">
          <v-card-title class="error--text text--center">آیا از انجام این عملیات اطمینان دارید؟</v-card-title>

          <v-card-text class="black--text mt-3">
            <div
              v-if="operation == 'cancel-closing'"
            >بسته شدن سال مالی لغو می شود و سند های بستن خالی می گردند</div>
            <div v-if="operation == 'close-and-move'">
              <strong class="white danger--text mx-1 px-1 rounded">سال مالی {{ financialYear.name }}</strong>
              بسته می شود و به
              <strong
                class="white success_important--text mx-1 px-1 rounded"
              >سال مالی {{ targetFinancialYear.name }}</strong>
              انتقال پیدا میکند
            </div>
            <div v-if="operation == 'move'">
              <span class="white black--text mx-1 px-1 rounded">سال مالی {{ financialYear.name }}</span>
              به
              <span
                class="white black--text mx-1 px-1 rounded"
              >سال مالی {{ targetFinancialYear.name }}</span>
              انتقال می کند
            </div>
            <v-text-field
              type="password"
              class="mt-7 rounded-lg text-field-ltr"
              hide-details
              label="کلمه عبور"
              v-model="password"
            />
          </v-card-text>
          <v-card-actions class="white d-flex justify-end">
            <v-btn depressed @click="confirmDialog = false" color="success rounded-lg white--text">بستن</v-btn>
            <v-btn depressed @click="confirm" color="error rounded-lg white--text">تایید و انجام عملیات</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </m-form>
</template>
<script>
import CompanyMixin from "@/views/panel/company/mixin";
import { MFormMixin } from "@/components/m-form";
export default {
  mixins: [MFormMixin, CompanyMixin],
  data() {
    return {
      targetFinancialYear: null,
      password: null,
      financialYears: [],

      confirmDialog: false,
      operation: null,

      headers: [
        {
          text: "عملیات",
          value: "operation",
        },
        {
          text: "کاربر",
          value: "operator_name",
        },
        {
          text: "تاریخ",
          value: "created_at",
          type: "date",
        },
        {
          text: "سال مالی مقصد",
          value: "to_financial_year_name",
        },
      ],
    };
  },
  computed: {
    items() {
      return this.financialYear.operations.map((o) => {
        o.created_at = o.created_at.substr(0, o.created_at.indexOf("."));
        return o;
      });
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      this.getFinancialYears((data) => {
        this.financialYears = data.filter(
          (o) => !o.is_closed && o.id != this.financialYear.id
        );
      });
    },
    clearForm() {
      this.operation = null;
      this.targetFinancialYear = null;
      this.password = null;
      this.confirmDialog = false;
    },
    openConfirmDialog(operation) {
      this.operation = operation;
      this.confirmDialog = true;
    },
    confirm() {
      if (this.operation == "close") this.close();
      else if (this.operation == "move") this.move();
      else if (this.operation == "close-and-move") this.closeAndMove();
      else if (this.operation == "cancel-closing") this.cancelClosing();
    },
    close() {},
    closeAndMove() {
      this.request({
        url: this.endpoint("companies/closeFinancialYear"),
        method: "post",
        data: {
          target_financial_year: this.targetFinancialYear.id,
          password: this.password,
        },
        success: (data) => {
          this.clearForm();
          this.successNotify();
          this.$store.commit("setUser", data);
          this.getData();
        },
      });
    },
    move() {
      this.request({
        url: this.endpoint("companies/moveFinancialYear"),
        method: "post",
        data: {
          target_financial_year: this.targetFinancialYear.id,
          password: this.password,
        },
        success: (data) => {
          this.clearForm();
          this.successNotify();
          this.$store.commit("setUser", data);
        },
      });
    },
    cancelClosing() {
      this.request({
        url: this.endpoint("companies/cancelFinancialYearClosing"),
        method: "post",
        data: {
          password: this.password,
        },
        success: (data) => {
          this.clearForm();
          this.successNotify();
          this.$store.commit("setUser", data);
          this.getData();
        },
      });
    },
  },
};
</script>