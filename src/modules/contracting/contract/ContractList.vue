<template>
  <v-card>
    <v-card-title>لیست قرارداد ها</v-card-title>
    <v-card-text>
      <m-datatable
          @mydata="getSum($event)" :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable" >
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
        <template  v-slot:body.append="{ headers }">
          <tr class="text-center">
            <td colspan="4"></td>
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
  name: "ContractList",

  component:{
    MDatatable
  },
  props: {},
  data() {
    return {
      sumOfAmounts: 0,
      localFilters: this.filters,
      previousApiData: null,
      url: "reports/contract/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "عنوان",
          value: "title",
        },
        {
          text: "مناقصه",
          value: "tender",
        },

        {
          text: "شماره",
          value: "code",
          type: "numeric",

        },
        {
          text: "مبلغ",
          value: "amount",
          type: "numeric",

        },
        {
          text: "حداکثر میزان تغییر",
          value: "max_change_amount",
          type: "numeric",

        },
        {
          text: "پیمانکار",
          value: "contractor",
        },
        {
          text: "از تاریخ",
          value: "from_date",
          type: "date",
        },

        {
          text: "تا تاریخ",
          value: "to_date",
          type: "date",
        },

        {
          text: "تاریخ ثبت قرارداد",
          value: "registration",
          type: "date",
        },

        {
          text: "تاریخ شروع قرارداد",
          value: "inception",
          type: "date",
        },

        {
          text: "حسن انجام کار",
          value: "doing_job_well",
          type: "numeric",
        },
        {
          text: "علی الحساب بیمه",
          value: "insurance_payment",
          type: "numeric",
        },
        {
          text: "سایر",
          value: "other",
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
  methods: {
    to(item) {
      return {
        name: 'ContractAllDetails',
        params: {
          id: item.id,
        },
      };
    },
    getSum(contracts){
      let sum = 0
      for (let contract of contracts){
        sum += parseFloat(contract.amount)
      }
      this.sumOfAmounts = sum
    },
  },



};
</script>

<style scoped lang="scss">
</style>