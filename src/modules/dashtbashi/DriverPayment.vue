<template>
  <daily-form
    title="پرداخت رانندگان متفرقه"
    formName="پرداخت رانندگان متفرقه"
    @clearForm="clearForm()"
    :editable="editable"
    :deletable="true"
    :hasList="false"
    @goToForm="getItemByPosition"
    @validate="submit"
    @edit="makeFormEditable()"
    @delete="deleteItem"
  >
    <template #inputs>
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
            :disabled="!editable"
            @change="getDrivingData"
          />
        </v-col>

        <v-col cols="12" md="2">
          <date v-model="item.date" label="تاریخ" :default="true" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!editable"></v-textarea>
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
            item-key="id"
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
                <td>{{ tipsSum | toMoney }}</td>
              </tr>
              <tr>
                <td>جمع درآمد ماشین</td>
                <td>{{ carIncomesSum | toMoney }}</td>
              </tr>
              <tr>
                <td>جمع</td>
                <td>{{ ladingsSum | toMoney }}</td>
              </tr>
              <tr>
                <td>مجموع بدهی باربری</td>
                <td>{{ cargoDebtsSum | toMoney }}</td>
              </tr>
              <tr>
                <td>مجموع تنخواه</td>
                <td>{{ imprestsSum | toMoney }}</td>
              </tr>
              <tr>
                <td class="text--bold">مبلغ قابل پرداخت</td>
                <td>{{ ladingsSum - cargoDebtsSum - imprestsSum | toMoney }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>

        <v-dialog v-model="paymentDialog">
          <transaction-form
            transactionType="payment"
            :modal-mode="true"
            @submit="setTransaction"
            accountId="632"
          />
        </v-dialog>
      </v-row>
    </template>
  </daily-form>
</template>

<script>
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import DailyForm from "@/components/form/DailyForm";
import GetApi from "./GetApi";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";

import TransactionForm from "@/views/panel/transaction/Form";

export default {
  name: "Form",
  mixins: [formsMixin, GetApi, ListModalFormMixin],
  components: { TransactionForm },
  props: ["id"],
  data() {
    return {
      baseUrl: "dashtbashi/oilCompanyLadings",
      leadingSlash: true,
      rows: [],
      itemsToDelete: [],
      paymentDialog: false,
      transactoin: {},
      perforClearForm: true,
      ladingHeaders: [
        {
          text: "شماره حواله",
          value: "remittance.code"
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
          text: "تاریخ بارگیری",
          value: "lading_date"
        },
        {
          text: "تاریخ بارنامه",
          value: "bill_date"
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
    }
  },
  created() {
    this.rows.push(this.getRowTemplate());
  },
  watch: {
    rows: {
      handler() {
        let row = this.rows[this.rows.length - 1];
        if (row && row.gross_price) {
          this.rows.push(this.getRowTemplate());
        }
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.getDrivings();
    },
    submit(clearForm = true) {
      this.performClearForm = clearForm;
      this.paymentDialog = true;
    },
    getCarIncome(item) {
      return item.destination_amount * item.fare_price;
    },
    getLadingSum(item) {
      return +item.driver_tip_price + this.getCarIncome(item);
    },
    getCargoDebt(item) {
      return +item.association_price + +item.bill_price + +item.cargo_tip_price;
    },
    getDrivingData(driving) {
      this.selectedLadings = [];
      this.selectedImprests = [];
      this.getDrivingLadings(driving);
      this.getDriverNotSettledImprests(driving.driver);
    },
    getDrivingLadings(driving) {
      this.request({
        url: this.endpoint("dashtbashi/ladings/"),
        method: "get",
        params: {
          dirving: driving.id
        },
        success: data => {
          this.ladings = data;
        }
      });
    },
    setTransaction(transaction) {
      this.transaction = transaction;

      let transaction_sum = transaction.items.items.reduce(
        (v, o) => v + +o.value,
        0
      );

      // if (this.item.id) this.updateItem(this.performClearForm);
      // else this.storeItem(this.performClearForm);
    },

    getDriverNotSettledImprests(driver) {
      this.request({
        url: this.endpoint("imprests/notSettledImprests"),
        params: {
          account: 632
          // floatAccount: '',
          // costCenter: '',
        },
        method: "get",
        success: data => {
          this.imprests = data;
        }
      });
    },
    getItemTemplate() {
      return {
        company_commission: +this.getOptionValue(
          "companyCommissionFromOilCompanyLading"
        )
      };
    },
    getRowTemplate() {
      return {
        tax_percent: this.getOptionValue("taxPercent")
      };
    },
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint("dashtbashi/oilCompanyLadings/byPosition"),
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
      this.makeFormUneditable();
      this.$router.push({
        name: "OilCompanyLading",
        params: { id: item.id }
      });
      this.item = item;
      this.itemsToDelete = [];
      this.rows = [];
      item.items.forEach(item => {
        let row = { ...item };
        this.rows.push(row);
      });
      this.rows.push(this.getRowTemplate());
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
        form: this.extractIds(this.item),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: []
        }
      };

      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;

        let item = this.copy(row);
        item = this.extractIds(item);
        item.bed = +item.bed;
        item.bes = +item.bes;

        data.items.items.push(item);
      });

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

