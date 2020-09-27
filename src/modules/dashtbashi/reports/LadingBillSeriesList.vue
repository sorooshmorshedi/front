<template>
  <v-card>
    <v-card-title>لیست سری های بارنامه</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            api-url="dashtbashi/report/ladingBillSeriesList/"
            :filters.sync="filters"
            @detail="(item) => newTab({name: 'LadingBillSeries', params: {id: item.id}})"
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
          text: "تاریخ",
          value: "date"
        },
        {
          text: "سریال",
          value: "serial"
        },
        {
          text: "از شماره",
          value: "from_bill_number"
        },
        {
          text: "تا شماره",
          value: "to_bill_number"
        }
      ]
    };
  }
};
</script>

<style scoped lang="scss"></style>

