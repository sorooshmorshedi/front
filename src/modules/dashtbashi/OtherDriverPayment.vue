<template>
  <m-form
    title="پرداخت رانندگان متفرقه"
    formName="پرداخت رانندگان متفرقه"
    exportBaseUrl="dashtbashi/export/otherDriverPayments"
    :listRoute="{name:'OtherDriverPaymentsList'}"
    :exportParams="{id: id}"
    :isEditing.sync="isEditing"
    :deletable="true"
    :showList="false"
    :canDelete="canDelete"
    :canSubmit="canSubmit && !id"
    @goToForm="getItemByPosition"
    @submit="openPaymentDialog"
    @delete="deleteItem"
    @clearForm="clearForm()"
  >
    <template #header-btns>
      <v-btn
        v-if="id"
        target="_blank"
        :to="{name:'TransactionForm', params: {type: 'payment', id: item.payment.id}}"
        class="blue white--text mr-1"
      >
        مشاهده دریافت
        <v-chip class="app-background-color mr-2" x-small>{{ item.payment.code }}</v-chip>
      </v-btn>
    </template>
    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="شماره" v-model="item.code" disabled />
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            label="حمل کننده"
            v-model="item.driving"
            :items="$store.state.drivings.filter(o => o.car.owner == 'o')"
            item-text="title"
            item-value="id"
            :disabled="this.id != undefined"
            @change="getDrivingData"
            :return-object="true"
          />
        </v-col>

        <v-col cols="12" md="2">
          <date v-model="item.date" label="تاریخ" :default="true" :disabled="this.id != undefined" />
        </v-col>

        <v-col cols="2">
          <v-text-field
            v-if="item.created_by"
            label="کاربر"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="this.id != undefined"></v-textarea>
        </v-col>

        <v-col cols="12">
          <div class="mb-1 mr-1">بارگیری ها</div>
          <m-datatable
            :headers="ladingHeaders"
            :items="ladings"
            v-model="selectedLadings"
            :show-select="this.id == undefined"
            item-key="id"
            :disable-pagination="true"
            :hide-default-footer="true"
            :show-export-btns="false"
          >
            <template #item.tipPrice="{ item }">{{ item.driver_tip_price | toMoney}}</template>
            <template #item.carIncome="{ item }">{{ getCarIncome(item) | toMoney}}</template>
            <template #item.sum="{ item }">{{ getLadingSum(item) | toMoney }}</template>
            <template #item.cargoDebt="{ item }">{{ getCargoDebt(item) | toMoney }}</template>
          </m-datatable>
        </v-col>

        <v-col cols="12">
          <div class="mb-1 mr-1">تنخواه ها</div>
          <m-datatable
            :headers="imprestHeaders"
            :items="imprests"
            v-model="selectedImprests"
            :show-select="this.id == undefined"
            item-key="id"
            :disable-pagination="true"
            :hide-default-footer="true"
            :show-export-btns="false"
          >
            <template #item.paidValue="{ item }">{{ item.sanad.bed | toMoney }}</template>
            <template #item.receivedValue="{ item }">{{ getImprestSettledValue(item) | toMoney }}</template>
            <template #item.remain="{ item }">{{ getImprestNotSettledValue(item) | toMoney}}</template>
          </m-datatable>
        </v-col>

        <v-col cols="12" md="4">
          <v-simple-table class="sum-table">
            <tbody>
              <tr>
                <td>جمع انعام</td>
                <td class="ltr">{{ tipsSum | toMoney }}</td>
              </tr>
              <tr>
                <td>جمع درآمد ماشین</td>
                <td class="ltr">{{ carIncomesSum | toMoney }}</td>
              </tr>
              <tr>
                <td>جمع</td>
                <td class="ltr">{{ ladingsSum | toMoney }}</td>
              </tr>
              <tr>
                <td>مجموع بدهی باربری</td>
                <td class="ltr">{{ cargoDebtsSum | toMoney }}</td>
              </tr>
              <tr>
                <td>مجموع تنخواه</td>
                <td class="ltr">{{ imprestsSum | toMoney }}</td>
              </tr>
              <tr>
                <td class="text--bold">مبلغ قابل پرداخت</td>
                <td class="ltr">{{ payableValue | toMoney }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>

        <v-dialog v-model="paymentDialog">
          <transaction-form
            type="payment"
            :modal-mode="true"
            :id="payment.id"
            @submit="validate"
            ref="transactionForm"
          />
        </v-dialog>
      </v-row>
    </template>

    <template #footer-btns>
      <v-btn
        @click="settleDriverImprests"
        v-if="item.driving"
        class="ml-1 blue white--text mt-1 mt-md-0"
      >تسویه تنخواه های انتخاب شده</v-btn>
    </template>
  </m-form>
</template>

<script>
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import GetApi from "./GetApi";
import LadingMixin from "./LadingMixin";
import { MFormMixin } from "@/components/m-form";

import TransactionForm from "@/views/panel/transaction/Form";

export default {
  name: "OtherDriverPaymentForm",
  mixins: [formsMixin, GetApi, MFormMixin, LadingMixin],
  components: { TransactionForm },
  props: ["id"],
  data() {
    return {
      baseUrl: "dashtbashi/otherDriverPayments",
      appendSlash: true,
      permissionBasename: "otherDriverPayment",
      hasList: false,
      hasIdProp: true,
      paymentDialog: false,
      payment: {},
      performClearForm: true,
      ladingHeaders: [
        {
          text: "شماره حواله",
          value: "remittance.code",
        },
        {
          text: "تاریخ بارگیری",
          value: "lading_date",
        },
        {
          text: "تاریخ بارنامه",
          value: "bill_date",
        },
        {
          text: "نام پیمانکار",
          value: "contractor.name",
        },
        {
          text: "انعام",
          value: "tipPrice",
        },

        {
          text: "درآمد ماشین",
          value: "carIncome",
        },
        {
          text: "بدهی باربری",
          value: "cargoDebt",
        },
      ],
      ladings: [],
      selectedLadings: [],
      imprestHeaders: [
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "حساب",
          value: "account.name",
        },
        {
          text: "شناور",
          value: "floatAccount.name",
        },
        {
          text: "تاریخ",
          value: "date",
        },
        {
          text: "مبلغ پرداختی",
          value: "paidValue",
        },
        {
          text: "مبلغ دریافتی",
          value: "receivedValue",
        },
        {
          text: "مانده پرداخت نشده",
          value: "remain",
        },
      ],
      imprests: [],
      selectedImprests: [],
    };
  },
  computed: {
    tipsSum() {
      return this.selectedLadings.reduce((v, o) => v + +o.driver_tip_price, 0);
    },
    carIncomesSum() {
      return this.selectedLadings.reduce((v, o) => v + this.getCarIncome(o), 0);
    },
    ladingsSum() {
      return this.selectedLadings.reduce((v, o) => v + this.getLadingSum(o), 0);
    },
    cargoDebtsSum() {
      return this.selectedLadings.reduce((v, o) => v + this.getCargoDebt(o), 0);
    },
    imprestsSum() {
      return this.selectedImprests.reduce(
        (v, o) => v + +this.getImprestNotSettledValue(o),
        0
      );
    },
    payableValue() {
      return this.ladingsSum - this.cargoDebtsSum - this.imprestsSum;
    },
  },
  methods: {
    getImprestSettledValue(imprest) {
      let imprestSettlement = imprest.imprestSettlement;
      if (imprestSettlement) return +imprestSettlement.settled_value;
      return 0;
    },
    getImprestNotSettledValue(imprest) {
      return imprest.sanad.bed - this.getImprestSettledValue(imprest);
    },
    getData() {
      this.getDrivings(false, (data) => {
        let drivingId = this.urlQuery["item.driving"];
        if (drivingId) {
          this.item.driving = data.filter((o) => o.id == drivingId)[0];
          this.getDrivingData(this.item.driving);
        }
      });
    },
    openPaymentDialog(clearForm = true) {
      this.performClearForm = clearForm;
      this.paymentDialog = true;
      this.$nextTick(() => {
        this.$refs.transactionForm.setDefaults({
          "rows.0.value": this.payableValue,
        });
      });
    },
    getDrivingData(driving) {
      this.selectedLadings = [];
      this.selectedImprests = [];
      this.getDrivingLadings(driving);
      this.getDriverNotSettledImprests(driving);
    },
    getDrivingLadings(driving, callback = null) {
      this.request({
        url: this.endpoint("dashtbashi/ladings/"),
        method: "get",
        params: {
          driving: driving.id,
          is_paid: false,
        },
        success: (data) => {
          this.ladings = data;
          if (this.item.remittance) {
            this.selectedLadings = this.ladings.filter(
              (o) =>
                o.remittance &&
                o.remittance.id == this.item.remittance &&
                this.item.selectedLadings.includes(String(o.id))
            );
          }
          callback && callback(data);
        },
      });
    },
    validate(payment) {
      this.payment = payment;

      let payment_sum = payment.items.items.reduce((v, o) => v + +o.value, 0);

      if (payment_sum != this.payableValue) {
        this.notify(
          "مبلغ پرداختی باید با مبلغ قابل پرداخت برابر باشد",
          "danger"
        );
      } else {
        this.paymentDialog = false;
      }

      this.submit(this.performClearForm);
    },

    settleDriverImprests() {
      this.request({
        url: this.endpoint("dashtbashi/settleDriverImprests"),
        data: {
          car: this.item.driving.car.id,
          driver: this.item.driving.driver.id,
          date: this.item.date,
          imprests: this.selectedImprests.map((o) => o.id),
        },
        method: "post",
        success: (data) => {
          this.successNotify();
          this.getDriverNotSettledImprests(this.item.driving);
        },
      });
    },

    getDriverNotSettledImprests(driving) {
      let filters = {
        type: "imprest",
        account: driving.car.payableAccount,
        floatAccount: driving.driver.floatAccount,
      };
      this.imprests = [];
      this.selectedImprests = [];

      let updateImprests = (data) => {
        this.imprests = this.imprests.concat(data);
        if (this.item.remittance) {
          this.selectedImprests = this.selectedImprests.concat(this.imprests);
        }
      };

      this.request({
        url: this.endpoint("reports/lists/transactions"),
        params: {
          ...filters,
          imprestSettlement__is_settled: false,
        },
        method: "get",
        success: (data) => {
          updateImprests(data);
        },
      });

      this.request({
        url: this.endpoint("reports/lists/transactions"),
        params: {
          ...filters,
          imprestSettlement__isnull: true,
        },
        method: "get",
        success: (data) => {
          updateImprests(data);
        },
      });
    },
    getItemTemplate() {
      return {
        ladings: [],
        imprests: [],
      };
    },
    getRowTemplate() {
      return {
        tax_percent: this.getOptionValue("taxPercent"),
      };
    },
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint("dashtbashi/otherDriverPayments/byPosition"),
        method: "get",
        params: {
          id: this.id,
          position: position,
        },
        success: (data) => {
          this.setItem(data);
        },
      });
    },
    setItem(item) {
      this.changeRouteTo(item.id);
      this.isEditing = false;
      this.item = item;
      this.payment = item.payment;

      this.ladings = item.ladings;
      this.imprests = item.imprests;

      this.selectedLadings = item.ladings;
      this.selectedImprests = item.imprests;
    },
    deleteRow(index) {
      if (index == -1) {
        this.rows.forEach((row) => {
          if (row.id) this.itemsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.itemsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
    getSerialized() {
      let data = {
        item: this.extractIds(this.item),
        payment: this.extractIds(this.payment),
      };

      data.item.ladings = this.selectedLadings.map((o) => o.id);
      data.item.imprests = this.selectedImprests.map((o) => o.id);

      data.payment.account = this.item.driving.car.payableAccount;
      data.payment.floatAccount = this.item.driving.driver.floatAccount;

      return data;
    },

    clearForm() {
      this.isEditing = true;
      this.item = this.getItemTemplate();
      this.selectedLadings = [];
      this.selectedImprests = [];
      this.ladings = [];
      this.imprests = [];
      this.changeRouteTo(null);
      this.see;
    },
  },
};
</script>

<style scoped lang="scss">
.sum-table {
  td:first-child {
    text-align: right !important;
  }
  td:last-child {
    text-align: left !important;
  }
}
</style>

