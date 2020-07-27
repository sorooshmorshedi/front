<template>
  <v-card>
    <v-card-title>گزارش مبلغ قابل پرداخت به رانندگان متفرقه</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            label="شماره حواله"
            v-model="remittance"
            :items="remittances"
            :search-input.sync="remittanceSearch"
            item-text="code"
            clearable
          />
        </v-col>

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
            <template #item.payableValue="{ item }">{{ item.payableValue | toMoney }}</template>

            <template #item.pay="{ item }">
              <v-btn v-if="!item.sumRow" color="blue white--text">پرداخت</v-btn>
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

import DailyForm from "@/components/form/DailyForm";
import GetApi from "../GetApi";
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm";

import TransactionForm from "@/views/panel/transaction/Form";

export default {
  name: "Form",
  mixins: [formsMixin, GetApi, ListModalFormMixin],
  components: { TransactionForm },
  props: ["id"],
  data() {
    return {
      remittances: [],
      remittanceSearch: "",
      remittance: null,
      tableHeaders: [
        {
          text: "حمل کننده",
          value: "driving.name"
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
      ]
    };
  },
  computed: {
    items() {
      return [
        {
          driving: { name: "	علی اکبری : 19 ی 332 ایران 63" },
          tipPrice: 1000,
          carIncome: 20000,
          cargoDebt: 150,
          imprestSum: 300,
          payableValue: 20550
        },
        {
          driving: { name: "	رضا سلطانی : 19 ی 332 ایران 63" },
          tipPrice: 2000,
          carIncome: 190000,
          cargoDebt: 200,
          imprestSum: 1300,
          payableValue: 19500
        },
        {
          driving: { name: "مجموع" },
          sumRow: true,
          tipPrice: 3000,
          carIncome: 390000,
          cargoDebt: 350,
          imprestSum: 1600,
          payableValue: 40050
        }
      ];
    }
  },
  created() {},
  watch: {
    remittanceSearch() {
      this.getRemittances(this.remittanceSearch);
    },
  },
  methods: {
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

