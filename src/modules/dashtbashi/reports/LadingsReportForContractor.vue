<template>
  <v-card>
    <v-card-title>گزارش بارگیری برای پیمانکار</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-autocomplete
            :return-object="false"
            label="* ماشین"
            v-model="filters.driving__car"
            :items="$store.state.cars"
            item-text="car_number_str"
            item-value="id"
          />
        </v-col>
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
import GetApi from "../GetApi";
export default {
  name: "LadingsReportForContractor",
  mixins: [GetApi],
  data() {
    return {
      filters: {
        title: "گزارش بارگیری برای پیمانکار",
      },
      headers: [
        {
          text: "عطف",
          value: "local_id",
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
          text: "انعام راننده",
          value: "driver_tip_price",
          type: "numeric",
        },
        {
          text: "مبلغ اختلاف بارنامه",
          value: "lading_bill_difference",
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

