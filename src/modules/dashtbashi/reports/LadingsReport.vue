<template>
  <v-card>
    <v-card-title>گزارش بارگیری ها</v-card-title>
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

export default {
  name: "Form",
  components: { MDatatable },
  data() {
    return {
      filters: {},
      headers: [
        {
          text: "شماره حواله",
          value: "remittance.code",
        },
        {
          text: "کالا",
          value: "ware.name",
        },
        {
          text: "نرخ حواله پیمانکار",
          value: "contractor_price",
          type: "numeric",
        },
        {
          text: "پیمانکار",
          value: "contractor.name",
        },
        {
          text: "نرخ کرایه",
          value: "fare_price",
          type: "numeric",
        },
        {
          text: "مبدا",
          value: "origin.name",
        },
        {
          text: "مقصد",
          value: "destination.name",
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
          text: "شماره بارنامه",
          value: "billNumber.number",
        },
        {
          text: "مبلغ بارنامه",
          value: "bill_price",
          type: "numeric",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss"></style>

