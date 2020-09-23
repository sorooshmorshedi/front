<template>
  <v-card>
    <v-card-title>گزارش کمیسیون حمل و نقل</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            api-url="dashtbashi/report/ladings/"
            :filters.sync="filters"
            @detail="(item) => newTab({name: 'Lading', params: {id: item.id}})"
          >
          <template #item.commission="{ item }">
            {{ item.contractor_price - item.fare_price }} 
          </template>
          </m-datatable>
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
          text: "عطف",
          value: "id",
        },
        {
          text: "شماره حواله",
          value: "remittance.code",
        },
        {
          text: "شماره بارگیری",
          value: "lading_number",
        },
        {
          text: "تاریخ بارگیری",
          value: "lading_date",
        },
        {
          text: "کالا",
          value: "ware.name",
        },
        {
          text: "پیمانکار",
          value: "contractor.name",
        },
        {
          text: "نرخ حواله پیمانکار",
          value: "contractor_price",
          type: "numeric",
        },
        {
          text: "نرخ کرایه",
          value: "fare_price",
          type: "numeric",
        },
        {
          text: "کمیسیون",
          value: "commission",
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
          text: "مقدار بارنامه مبدا",
          value: "origin_amount",
          type: "numeric",
        },
        {
          text: "مقدار بارنامه مقصد",
          value: "destination_amount",
          type: "numeric",
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
      ],
    };
  },
};
</script>

<style scoped lang="scss"></style>

