<template>
  <v-card>
    <v-card-title>لیست صورت وضییت ها</v-card-title>
    <v-card-text>
      <m-datatable @mydata="get_sum($event)" :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
        <template  v-slot:body.append="{ headers }">
          <tr class="text-center">
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td ></td>
            <td>جمع </td>
            <td>{{sumOfAmounts}}</td>
          </tr>
        </template>
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>

      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
import MDatatable from "@/components/m-datatable/MDatatable";

export default {
  name: "StatementList",
  component:{
    MDatatable
  },

  props: {},
  data() {
    return {
      sumOfAmounts: 0,
      url: "reports/statement/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [

        {
          text: "شماره",
          value: "code",
          type: "numeric"
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "قرارداد",
          value: "contract",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
        {
          text: "سریال",
          value: "serial",
          type: "numeric"
        },
        {
          text: "دسته بندی",
          value: "type",
        },

        {
          text: "مبلغ ناخالص کارکرد",
          value: "value",
          type: "numeric",
        },
        {
          text: "مبلغ ناخالص کارکرد تا صورت وضعیت قبلی",
          value: "previous_statement_value",
          type: "numeric",
        },
        {
          text: "مبلغ ناخالص کارکرد تا این صورت وضعیت",
          value: "present_statement_value",
          type: "numeric",
        },
        {
          text: "جزئیات",
          value: "detail",
          sortable: false,
          filterable: false,
        }


      ];
    },
  },
  mounted() {
  },
  methods: {
    to(item) {
      return {
        name: 'StatementDetail',
        params: {
          id: item.id,
        },
      };
    },


    get_sum(statements){
      let sum = 0
      for (let statement of statements){
        sum += parseFloat(statement.value)
      }
      this.sumOfAmounts = sum
    },
  },
};
</script>

<style scoped lang="scss">
</style>