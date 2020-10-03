<template>
  <v-card>
    <v-card-title>گزارش مبلغ قابل پرداخت به رانندگان متفرقه</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="3">
          <v-autocomplete
            :return-object="true"
            label="شماره حواله"
            v-model="remittance"
            :items="remittances"
            :search-input.sync="remittanceSearch"
            item-text="code"
            item-value="id"
            clearable
            :multiple="false"
            @change="getRemittanceData"
          />
        </v-col>
        <template v-if="remittance">
          <v-col cols="12" md="3">
            <account-select label="پیمانکار" v-model="remittance.contractor" :disabled="true" />
          </v-col>
          <v-col cols="12" md="3">
            <date v-model="filters.fromDate" label="از تاریخ" />
          </v-col>
          <v-col cols="12" md="3">
            <date v-model="filters.toDate" label="تا تاریخ" />
          </v-col>
        </template>

        <v-col cols="12">
          <v-data-table
            v-if="remittance"
            :headers="tableHeaders"
            :items="items"
            item-key="id"
            :disable-pagination="true"
            :hide-default-footer="true"
          >
            <template #item.carIncome="{ item }">{{ item.carIncome | toMoney }}</template>
            <template #item.imprestSum="{ item }">{{ item.imprestSum | toMoney }}</template>
            <template #item.cargoDebt="{ item }">{{ item.cargoDebt | toMoney }}</template>
            <template #item.tipPrice="{ item }">{{ item.tipPrice | toMoney }}</template>
            <template #item.payableValue="{ item }">
              <span class="ltr d-inline-block">{{ item.payableValue | toMoney }}</span>
            </template>

            <template #item.pay="{ item }">
              <v-btn
                v-if="!item.sumRow"
                :to="{name: 'DriverPayment', query: { 'item.driving': item.driving.id, 'item.remittance': remittance.id, 'item.selectedLadings': item.selectedLadings }}"
                color="blue white--text"
              >پرداخت</v-btn>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import GetApi from "../GetApi";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "../LadingMixin";

export default {
  name: "Form",
  mixins: [formsMixin, GetApi, LadingMixin],
  components: { TransactionForm },
  props: ["id"],
  data() {
    return {
      remittances: [],
      remittanceSearch: "",
      remittance: null,
      filters: {},
      tableHeaders: [
        {
          text: "حمل کننده",
          value: "driving.title"
        },
        {
          text: "جمع انعام",
          value: "tipPrice"
        },
        {
          text: "جمع درآمد ماشین",
          value: "carIncome"
        },
        {
          text: "جمع بدهی باربری",
          value: "cargoDebt"
        },
        {
          text: "جمع تنخواه",
          value: "imprestSum"
        },
        {
          text: "مبلغ قابل پرداخت",
          value: "payableValue"
        },
        {
          text: "پرداخت",
          value: "pay"
        }
      ],
      data: {
        ladings: [],
        imprests: []
      }
    };
  },
  computed: {
    items() {
      let items = [];
      for (const lading of this.data.ladings) {
        const driving = lading.driving;
        let item = items.filter(o => o.driving.id == driving.id);
        if (item.length != 0) {
          item = item[0];
          item.ladings = lading;
        } else {
          item = {
            driving: driving,
            ladings: [lading],
            selectedLadings: [],
            imprests: [],
            tipPrice: 0,
            carIncome: 0,
            cargoDebt: 0,
            ladingSum: 0,
            imprestSum: 0,
            payableValue: 0
          };
          items.push(item);
        }

        item.cargoDebt += this.getCargoDebt(lading);

        if (this.filters.fromDate && lading.lading_date < this.filters.fromDate)
          continue;
        if (this.filters.toDate && lading.lading_date > this.filters.toDate)
          continue;

        item.tipPrice += +lading.driver_tip_price;
        item.carIncome += this.getCarIncome(lading);
        item.ladingSum += this.getLadingSum(lading);

        item.selectedLadings.push(lading.id);
      }

      for (const imprest of this.data.imprests) {
        // push right remittance to each driver
        items[0].imprests.push(imprest);

        let paidValue = imprest.items.reduce((v, o) => v + +o.value, 0);
        let settledValue = imprest.imprestSettlements.reduce(
          (v, o) => v + +o.settled_value,
          0
        );
        let payableValue = paidValue - settledValue;
        items[0].imprestSum += payableValue;
      }

      for (let item of items) {
        item.payableValue = item.ladingSum - item.cargoDebt - item.imprestSum;
      }

      return items;
    }
  },
  created() {},
  watch: {
    remittanceSearch() {
      this.getRemittances(this.remittanceSearch);
    }
  },
  methods: {
    getRemittanceData() {
      if (!this.remittance) return;
      this.request({
        url: this.endpoint("dashtbashi/report/otherDriverPayments"),
        params: {
          remittance: this.remittance.id
        },
        method: "get",
        success: data => {
          this.data = data;
        }
      });
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

