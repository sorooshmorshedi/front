<template>
  <v-card>
    <v-card-title>لیست پرداخت رانندگان متفرقه</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            api-url="dashtbashi/otherDriverPayments/"
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
          text: "عطف",
          value: "id",
        },
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "تاریخ",
          value: "date",
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
          text: "توضیحات",
          value: "explanation",
          type: "",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss"></style>

