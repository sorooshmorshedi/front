<template>
  <m-form
    title="پرداخت رانندگان متفرقه"
    formName="پرداخت رانندگان متفرقه"
    :isEditing.sync="isEditing"
    :deletable="true"
    :showList="false"
    :showListBtn="false"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
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
            :disabled="!isEditing"
            @change="getDrivingData"
          />
        </v-col>

        <v-col cols="12" md="2">
          <date v-model="item.date" label="تاریخ" :default="true" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
        </v-col>

        <v-col cols="12">
          <div class="mb-1 mr-1">بارگیری ها</div>
          <v-data-table
            :headers="ladingHeaders"
            :items="ladings"
            v-model="selectedLadings"
            :show-select="true"
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
            :show-select="true"
            item-key="transaction"
            :disable-pagination="true"
            :hide-default-footer="true"
          >
            <template
              #item.paidValue="{ item }"
            >{{ item.imprestSettlement.transaction?item.imprestSettlement.transaction.sanad.bed:0 | toMoney }}</template>
            <template
              #item.receivedValue="{ item }"
            >{{ item.imprestSettlement.settled_value | toMoney }}</template>
            <template
              #item.remain="{ item }"
            >{{ item.sum - item.imprestSettlement.settled_value | toMoney}}</template>
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

import DailyForm from "@/components/form/DailyForm";
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
          value: "remittance.code"
        },
        {
          text: "تاریخ بارگیری",
          value: "lading_date"
        },
        {
          text: "تاریخ بارنامه",
          value: "bill_date"
        },
        {
          text: "نام پیمانکار",
          value: "contractor.name"
        },
        {
          text: "انعام",
          value: "tipPrice"
        },

        {
          text: "درآمد ماشین",
          value: "carIncome"
        },
        {
          text: "بدهی باربری",
          value: "cargoDebt"
        }
      ],
      ladings: [],
      selectedLadings: [],
      imprestHeaders: [
        {
          text: "شماره",
          value: "code"
        },
        {
          text: "حساب",
          value: "imprestSettlement.transaction.account.name"
        },
        {
          text: "شناور",
          value: "imprestSettlement.transaction.floatAccount.name"
        },
        {
          text: "تاریخ",
          value: "imprestSettlement.transaction.date"
        },
        {
          text: "مبلغ پرداختی",
          value: "paidValue"
        },
        {
          text: "مبلغ دریافتی",
          value: "receivedValue"
        },
        {
          text: "مانده پرداخت نشده",
          value: "remain"
        }
      ],
      imprests: [],
      selectedImprests: []
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
        (v, o) => v + +o.sum - +o.imprestSettlement.settled_value,
        0
      );
    },
    payableValue() {
      return this.ladingsSum - this.cargoDebtsSum - this.imprestsSum;
    }
  },
  created() {
    this.rows.push(this.getRowTemplate());
  },
  methods: {
    getData() {
      this.getDrivings();
    },
    openPaymentDialog(clearForm = true) {
      this.performClearForm = clearForm;
      this.paymentDialog = true;
      this.$nextTick(() => {
        this.$refs.transactionForm.setDefaults({
          "rows.0.value": this.payableValue
        });
      });
    },
    getDrivingData(driving) {
      this.selectedLadings = [];
      this.selectedImprests = [];
      this.getDrivingLadings(driving);
      this.getDriverNotSettledImprests(driving.driver);
    },
    getDrivingLadings(driving, callback=null) {
      this.request({
        url: this.endpoint("dashtbashi/ladings/"),
        method: "get",
        params: {
          dirving: driving.id,
          is_paid: false,
        },
        success: data => {
          this.ladings = data;
          callback && callback(data)
        }
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

    getDriverNotSettledImprests(driver, callback=null) {
      this.request({
        url: this.endpoint("imprests/notSettledImprests"),
        params: {
          account: 609
          // floatAccount: '',
          // costCenter: '',
        },
        method: "get",
        success: data => {
          this.imprests = data;
          callback && callback(data)
        }
      });
    },
    getItemTemplate() {
      return {
        ladings: [],
        imprests: []
      };
    },
    getRowTemplate() {
      return {
        tax_percent: this.getOptionValue("taxPercent")
      };
    },
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint("dashtbashi/otherDriverPayments/byPosition"),
        method: "get",
        params: {
          id: this.id,
          position: position
        },
        success: data => {
          this.setItem(data);
        }
      });
    },
    setItem(item) {
      this.changeRouteTo(item.id);
      this.isEditing = false;
      this.item = item;
      this.payment = item.payment

      // this.getDrivingLadings(driving);
      this.getDriverNotSettledImprests(driving.driver, (data) => {
        for(const imprest of data) {
          // if(item.imprests.filter(o => o.id == imprest.transaction))
        }
      });

      // this.selectedLadings = item.ladings;
      // this.selectedImprests = item.imprests;



    },
    deleteRow(index) {
      if (index == -1) {
        this.rows.forEach(row => {
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
        payment: this.extractIds(this.payment)
      };

      data.item.ladings = this.selectedLadings.map(o => o.id);
      data.item.imprests = this.selectedImprests.map(o => o.transaction);

      return data;
    }
  }
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

