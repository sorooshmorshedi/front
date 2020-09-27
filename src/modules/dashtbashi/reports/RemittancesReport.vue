<template>
  <v-card>
    <v-card-title>گزارش حواله ها</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" class="text-center">
          <m-datatable
            :headers="headers"
            api-url="dashtbashi/report/remittances/"
            :filters.sync="filters"
            @detail="(item) => newTab({name: 'Remittance', params: {id: item.id}})"
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
          text: "تاریخ صدور",
          value: "issue_date",
        },
        {
          text: "مقدار حواله",
          value: "amount",
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
          text: "پیمانکار",
          value: "contractor.name",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss"></style>

