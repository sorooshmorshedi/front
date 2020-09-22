<template>
  <v-card>
    <v-card-title>گزارش بارنامه</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            api-url="dashtbashi/report/ladings/"
            :filters.sync="filters"
            @detail="(item) => newTab({name: 'Lading', params: {id: item.id}})"
          ></m-datatable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import MDatatable from "@/components/mcomponents/datatable/MDatatable";
import GetApi from "../GetApi";
import QueryBinding from "@/mixin/queryBinding";

export default {
  name: "Form",
  components: { MDatatable },
  mixins: [GetApi, QueryBinding],
  data() {
    return {
      filters: {
        driving__car__owner: "",
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "سری بارنامه",
          value: "billNumber.series.serial",
        },
        {
          text: "شماره بارنامه",
          value: "billNumber.number",
        },
        {
          text: "تاریخ بارگیری",
          value: "lading_date",
        },
        {
          text: "حمل کننده",
          value: "driving.driver.name",
        },
        {
          text: "ماشین",
          value: "driving.car.car_number_str",
          filterable: false,
          sortable: false,
        },
        {
          text: "مبلغ بارنامه",
          value: "bill_price",
          type: "numeric",
        },
        {
          text: "انعام باربری",
          value: "cargo_tip_price",
          type: "numeric",
        },
        {
          text: "انجمن",
          value: "association.name",
        },
        {
          text: "مبلغ انجمن",
          value: "association_price",
          type: "numeric",
        },
        {
          text: "نحوه دریافت",
          value: "receive_type",
          items: this.receiveTypes,
        },
      ];
    },
  },
};
</script>

<style scoped lang="scss"></style>

