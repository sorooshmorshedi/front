<template>
  <v-card>
    <v-card-title>لیست الحاقیه ها</v-card-title>
    <v-card-text>
      <m-datatable @mydata="getSum($event)" :headers="headers" :apiUrl="url" :filters.sync="filters" ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>
        <template  v-slot:body.append="{ headers }">
          <tr class="text-center">
            <td colspan="5"></td>
            <td>جمع </td>
            <td>{{sumOfAmounts}}</td>
          </tr>
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "SupplementList",
  props: {
    contractID: {}
  },
  data() {
    return {
      sumOfAmounts: 0,
      url: "reports/supplement/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "شماره",
          value: "code",
          type: "numeric",
        },

        {
          text: "قرارداد",
          value: "contract",
        },
        {
          text: "تاریخ جدید قرارداد",
          value: "new_contract_date",
          type: "date",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "مبلغ",
          value: "value",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
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
  created() {
    this.filters.contract = this.contractID
  },
  methods: {
    to(item) {
      return {
        name: 'SupplementDetail',
        params: {
          id: item.id,
        },
      };
    },

    getSum(supplements){
      let sum = 0
      for (let supplement of supplements){
        sum += parseFloat(supplement.value)
      }
      this.sumOfAmounts = sum
    },
  },
}
</script>

<style scoped lang="scss">
</style>