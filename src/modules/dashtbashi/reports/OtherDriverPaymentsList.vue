<template>
  <v-card>
    <v-card-title>لیست پرداخت رانندگان متفرقه</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            api-url="dashtbashi/otherDriverPayments/"
            export-url="dashtbashi/report/otherDriverPayments/"
            :filters.sync="filters"
            @detail="(item) => newTab({name: 'OtherDriverPayment', params: {id: item.id}})"
          ></m-datatable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Form",
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

