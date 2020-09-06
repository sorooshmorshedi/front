<template>
  <v-card>
    <v-card-title>گزارش بارگیری های شرکت نفت</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            api-url="dashtbashi/report/oilCompanyLadings/"
            :filters.sync="filters"
            @detail="(item) => newTab({name: 'OilCompanyLading', params: {id: item.id}})"
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
          text: "عطف",
          value: "id"
        },
        {
          text: "تاریخ سیاهه",
          value: "date"
        },
        {
          text: "تاریخ گرفتن خروجی",
          value: "export_date"
        },
        {
          text: "ماشین",
          value: "car.car_number_str"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss"></style>

