<template>
  <v-card>
    <v-card-title>لیست بارگیری های شرکت نفت</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="2" md="4">
          <v-autocomplete
            label="ماه"
            :items="months"
            v-model="filters.month"
            @change="(v) => filters.oilCompanyLading__month = v"
            :return-object="false"
            clearable
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            clearable
            :return-object="false"
            label="ماشین"
            v-model="filters.driving__car"
            @change="(v) => filters.oilCompanyLading__driving__car = v"
            :items="$store.state.cars"
            item-text="car_number_str"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-autocomplete
            clearable
            :return-object="false"
            label="راننده"
            v-model="filters.driving__driver"
            @change="(v) => filters.oilCompanyLading__driving__car = v"
            :items="$store.state.drivers"
            item-text="name"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            :api-url="url"
            :filters.sync="filters"
            @detail="(item) => newTab({name: 'OilCompanyLading', params: {id: item.id}})"
          ></m-datatable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import GetApi from "../GetApi";

export default {
  name: "Form",
  mixins: [GetApi],
  props: {
    detailed: {
      default: false,
    },
  },
  data() {
    return {
      filters: {
        driving__driver: null,
        oilCompanyLading__driving__driver: null,

        driving__car: null,
        oilCompanyLading__driving__car: null,

        month: null,
        oilCompanyLading__month: null,
      },
    };
  },
  computed: {
    url() {
      if (this.detailed) {
        return "dashtbashi/report/oilCompanyLadingItems/";
      } else {
        return "dashtbashi/report/oilCompanyLadings/";
      }
    },
    headers() {
      let headers = [
        {
          text: "عطف",
          value: "local_id",
          show: !this.detailed,
        },
        {
          text: "تاریخ ثبت",
          value: "date",
          show: !this.detailed,
        },
        {
          text: "تاریخ سیاهه",
          value: "list_date",
        },
        {
          text: "مبلغ ناخالص",
          value: "gross_price",
          type: "numeric",
        },
        {
          text: "حق بیمه",
          value: "insurance_price",
          type: "numeric",
        },
        {
          text: "مبلغ کل ارزش افزوده",
          value: "complication_price",
          type: "numeric",
        },
        {
          text: "مبلغ کل با ارزش افزوده",
          value: "total_value",
          type: "numeric",
        },
        {
          text: "کمیسیون شرکت",
          value: "company_commission",
          type: "numeric",
        },
        {
          text: "درآمد ماشین",
          value: "car_income",
          type: "numeric",
        },
        {
          text: "وزن",
          value: "weight",
          type: "numeric",
        },
        {
          text: "ماه",
          value: "month",
          items: this.months,
          type: "select",
          show: !this.detailed,
        },
        {
          text: "حمل کننده",
          value: "driving.title",
          sortable: false,
          filterable: false,
        },
      ];

      if (this.detailed) {
        headers = [
          ...headers,
          {
            text: "ماه",
            value: "month",
            items: this.months,
          },
          {
            text: "مبدا",
            value: "origin.name",
          },
          {
            text: "مقصد",
            value: "destination.name",
          },
        ];
      }

      return headers;
    },
  },
  created() {
    this.getCars();
    this.getDrivers();
  },
};
</script>

<style scoped lang="scss"></style>

