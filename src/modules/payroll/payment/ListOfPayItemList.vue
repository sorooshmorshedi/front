<template>
  <v-card>

    <v-toolbar
        class="mt-10 mr-5 ml-5"
        color="indigo"
        dark
    >
      <v-toolbar-title>حقوق و دستمزد</v-toolbar-title>

      <v-divider
          class="mx-4"
          vertical
      ></v-divider>

      <span class="subheading mr-4 ml-4">کارگاه :  {{ list_of_pay.workshop_display }}</span>
      <v-divider class="mr-2 ml-2" vertical></v-divider>
      <span class="subheading mr-4 ">سال : {{ list_of_pay.year }}</span>

      <v-divider class="mr-4" vertical></v-divider>
      <span class="subheading mr-2 ml-2 "> ماه : {{ list_of_pay.month_name }}</span>
      <v-divider class="mr-2 ml-2" vertical></v-divider>
      <v-spacer></v-spacer>
      <v-btn v-if="!list_of_pay.pay_done" @click="goPay()" color="green darken-1" class=" white--text pl-10 pr-10"
             large> پرداخت حقوق
      </v-btn>
      <v-btn v-if="list_of_pay.pay_done" @click="goPay()" color="blue darken-3" class=" white--text pl-10 pr-10"
             large>نمایش حقوق پرداخت شده
      </v-btn>

    </v-toolbar>
    <v-toolbar color="indigo darken-3" class="white--text pl-10 pr-10 ml-5 mt-1 mr-5 rounded">
      حقوق و دستمزد جامع :
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="چاپ"
          icon
          @click="printThis('html')"
      >
        <v-icon>fa-print</v-icon>
      </v-btn>
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printThis('pdf')"
          icon

      >
        <v-icon>fa-file-pdf</v-icon>
      </v-btn>
      <v-btn
          small
          class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
          @click="printThis('xlsx')"
          title="اکسل"
          icon
      >
        <v-icon>fa-file-excel</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      گزارش مالیات ماه :
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="فایل مالیات"
          :href="this.endpoint(`payroll/diskette/tax/` + this.$route.params.id + '/' + '?token=' + this.token)"
          icon

      >
        <v-icon>fa-file-download</v-icon>
      </v-btn>


      <v-spacer></v-spacer>

      گزارش خلاصه مالیات ماه :
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="فایل مالیات"
          :href="this.endpoint(`payroll/diskette/tax/summary/` + this.$route.params.id + '/' + '?token=' + this.token)"
          icon

      >
        <v-icon>fa-file-download</v-icon>
      </v-btn>
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="چاپ"
          icon
          @click="printTaxWorkshop('html')"
      >
        <v-icon>fa-print</v-icon>
      </v-btn>
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printTaxWorkshop('pdf')"
          icon

      >
        <v-icon>fa-file-pdf</v-icon>
      </v-btn>
      <v-btn
          small
          class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
          @click="printTaxWorkshop('xlsx')"
          title="اکسل"
          icon
      >
        <v-icon>fa-file-excel</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      گزارش بیمه :
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="فایل بیمه"
          :href="this.endpoint(`payroll/diskette/insurance/` + this.$route.params.id + '/' + '?token=' + this.token)"
          icon
      >
        <v-icon>fa-file-download</v-icon>
      </v-btn>
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="چاپ"
          icon
          @click="printInsurance('html')"
      >
        <v-icon>fa-print</v-icon>
      </v-btn>
      <v-btn
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printInsurance('pdf')"
          icon

      >
        <v-icon>fa-file-pdf</v-icon>
      </v-btn>
      <v-btn
          small
          class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
          @click="printInsurance('xlsx')"
          title="اکسل"
          icon
      >
        <v-icon>fa-file-excel</v-icon>
      </v-btn>

    </v-toolbar>

    <v-card-actions class="justify-end mt-4">
    </v-card-actions>
    <v-card-text>
      <m-datatable :headers="headers" e :exportUrl="exportUrl" :apiUrl="url" :filters.sync="filters"
                   :show-export-btns="false" @dblclick:row="(e, row) => $router.push(to(row.item))"
                   ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)"/>
        </template>
      </m-datatable>
      <m-datatable v-show="false" :headers="headers" :apiUrl="url" :exportUrl="export_url" :filters.sync="export_filter"
                   ref="exportTable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)"/>
        </template>
      </m-datatable>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "PaymentItemList",
  props: {},
  data() {
    return {
      url: "payroll/listOfPayItem/less",
      exportUrl: "payroll/payroll",
      export_url: "payroll/payroll",
      filters: {list_of_pay: this.$route.params.id},
      export_filter: {id: this.$route.params.id},
      list_of_pay: null,
      my_list: null,
    };
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/paylist/less/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        this.list_of_pay = data

      }
    })
    this.request({
      url: this.endpoint(`payroll/paylist/bank/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.my_list = data

      }
    })
  },
  computed: {
    headers() {
      return [
        {
          text: "پرسنل در کارگاه",
          value: "personnel_name",
        },
        {
          text: "بیمه مبشود؟",
          value: "is_insurance_display",
        },
        {
          text: "کارکرد عادی",
          value: "normal_worktime",
        },
        {
          text: "کارکرد واقعی",
          value: "real_worktime",
        },
        {
          text: "حقوق",
          value: "total_payment",
          type: 'numeric'
        },
      ];
    },
  },
  methods: {
    to(item) {
      return {
        name: "ListOfPayItemForm",
        params: {
          id: item.id,
        },
      };
    },
    printThis(type) {
      this.$refs.exportTable.exportTo(type)
    },
    goPay() {
      this.$router.push('/panel/pay/' + this.$route.params.id + '/')
    },

    printInsurance(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/total/insurance/report"
      this.$refs.exportTable.exportTo(type)
    },

    printTax(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = 'payroll/tax/report'
      this.$refs.exportTable.exportTo(type)

    },
    printTaxWorkshop(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = 'payroll/month/tax'
      this.$refs.exportTable.exportTo(type)

    }


  },
};
</script>

<style scoped lang="scss">
</style>