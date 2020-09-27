<template>
  <m-form
    title="پرداخت رانندگان متفرقه"
    formName="پرداخت رانندگان متفرقه"
    :isEditing.sync="isEditing"
    :deletable="true"
    :showList="false"
    :showListBtn="false"
    :canDelete="canDelete"
    :canSubmit="canSubmit && !this.id"
    :confirmBtnText="confirmBtnText"
    :cancelConfirmBtnText="cancelConfirmBtnText"
    :canConfirm="canConfirm"
    :canCancelConfirm="canCancelConfirm"
    @cancelConfirm="cancelConfirm"
    @confirm="confirm"
    @goToForm="getItemByPosition"
    @submit="openPaymentDialog"
    @delete="deleteItem"
    @clearForm="clearForm()"
  >
    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="شماره" v-model="item.code" disabled />
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            label="حمل کننده"
            v-model="item.driving"
            :items="$store.state.drivings"
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
            label="ثبت کننده"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="this.id != undefined"></v-textarea>
        </v-col>

        <v-col cols="12">
          <div class="mb-1 mr-1">بارگیری ها</div>
          <v-data-table
            :headers="ladingHeaders"
            :items="ladings"
            v-model="selectedLadings"
            :show-select="this.id == undefined"
            item-key="id"
            :disable-pagination="true"
            :hide-default-footer="true"
          >
            <template #item.tipPrice="{ item }">{{ item.driver_tip_price | toMoney}}</template>
            <template #item.carIncome="{ item }">{{ getCarIncome(item) | toMoney}}</template>
            <template #item.sum="{ item }">{{ getLadingSum(item) | toMoney }}</template>
            <template #item.cargoDebt="{ item }">{{ getCargoDebt(item) | toMoney }}</template>
          </v-data-table>
        </v-col>

        <v-col cols="12">
          <div class="mb-1 mr-1">تنخواه ها</div>
          <v-data-table
            :headers="imprestHeaders"
            :items="imprests"
            v-model="selectedImprests"
            :show-select="this.id == undefined"
            item-key="id"
            :disable-pagination="true"
            :hide-default-footer="true"
          >
            <template #item.paidValue="{ item }">{{ item.sanad.bed | toMoney }}</template>
            <template #item.receivedValue="{ item }">{{ getImprestSettledValue(item) | toMoney }}</template>
            <template #item.remain="{ item }">{{ getImprestNotSettledValue(item) | toMoney}}</template>
          </v-data-table>
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
            transactionType="payment"
            :modal-mode="true"
            :id="payment.id"
            @submit="validate"
            ref="transactionForm"
          />
        </v-dialog>
      </v-row>
    </template>
  </m-form>
</template>

<script>
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import GetApi from "./GetApi";
import LadingMixin from "./LadingMixin";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";

import TransactionForm from "@/views/panel/transaction/Form";

export default {
  name: "DriverPaymentForm",
  mixins: [formsMixin, GetApi, ListModalFormMixin, LadingMixin],
  components: { TransactionForm },
  props: ["id"],
  data() {
    return {
      baseUrl: "dashtbashi/otherDriverPayments",
      leadingSlash: true,
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
          value: "transaction.date",
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
      return imprest.imprestSettlements.reduce(
        (v, o) => v + +o.settled_value,
        0
      );
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
          dirving: driving.id,
          is_paid: false,
        },
        success: (data) => {
          this.ladings = data;
          if (this.item.remittance) {
            this.selectedLadings = this.ladings.filter(
              (o) =>
                !o.remittance ||
                (o.remittance.id == this.item.remittance &&
                  this.item.selectedLadings.includes(String(o.id)))
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

    getDriverNotSettledImprests(driving, callback = null) {
      console.log({
        account: driving.car.payableAccount,
        floatAccount: driving.driver.floatAccount,
      });
      this.request({
        url: this.endpoint("imprests/notSettledImprests"),
        params: {
          account: driving.car.payableAccount,
          floatAccount: driving.driver.floatAccount,
        },
        method: "get",
        success: (data) => {
          this.imprests = data;
          if (this.item.remittance) {
            this.selectedImprests = this.imprests;
          }
          callback && callback(data);
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
      console.log("set item", item);
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

