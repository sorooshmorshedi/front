<template>
  <v-card>

    <v-toolbar
        class="mt-5 mr-5 ml-5 mb-5"
        color="indigo"
        dark
    >
      <v-toolbar-title>حقوق و دستمزد {{ list_of_pay.name }}</v-toolbar-title>

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
      <v-btn
          small
          class="light-blue white--text ml-2 mt-1 mt-md-0"
          icon
          @click="goToList"
          outlined
          title="لیست"
      >
        <v-icon>fa-th-list</v-icon>
      </v-btn>
      <v-btn
          small
          class="primary white--text ml-2 mt-1 mt-md-0"
          icon
          @click="goToListOfPay"
          outlined
          title="بازگشت"
      >
        <v-icon>fa-arrow-left</v-icon>
      </v-btn>

    </v-toolbar>
    <v-simple-table
        class="ma-5 "
    >
      <template v-slot:default>
        <thead class="white--text style: indigo darken-2">
        <tr>
          <th class="white--text text-center"> ردیف پیمان</th>
          <th class="white--text text-center"> اطلاعات ماهانه کارگاه بیمه</th>
          <th class="white--text text-center">اطلاعات ماهانه بیمه شدگان</th>
          <th class="white--text text-center">خلاصه فهرست حقوق مالیات</th>
          <th class="white--text text-center">ریز حقوق مالیات</th>
        </tr>
        </thead>
        <tbody class="">
        <tr>
          <td class=" text-center pt-3"> کامل</td>
          <td class="pt-3 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل بیمه"
                :href="endpoint(`payroll/diskette/insurance/` + $route.params.id + '/' + '?token=' + token)"
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
          </td>
          <td class="pt-3 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل بیمه"
                :href="endpoint(`payroll/diskette/insurance/workshopPerson/` + $route.params.id + '/' + '?token=' + token)"
                icon
            >
              <v-icon>fa-file-download</v-icon>
            </v-btn>
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="چاپ"
                icon
                @click="printCardex('html')"
            >
              <v-icon>fa-print</v-icon>
            </v-btn>
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="PDF"
                @click="printCardex('pdf')"
                icon

            >
              <v-icon>fa-file-pdf</v-icon>
            </v-btn>
            <v-btn
                small
                class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
                @click="printCardex('xlsx')"
                title="اکسل"
                icon
            >
              <v-icon>fa-file-excel</v-icon>
            </v-btn>

          </td>

          <td class="pt-3 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل مالیات"
                :href="endpoint(`payroll/diskette/tax/summary/` + $route.params.id + '/' + '?token=' + token)"
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

          </td>

          <td class="pt-3 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل مالیات"
                :href="endpoint(`payroll/diskette/tax/` + $route.params.id + '/' + '?token=' + token)"
                icon

            >
              <v-icon>fa-file-download</v-icon>
            </v-btn>
          </td>
        </tr>

        <tr v-for="row in contract_row">
          <td class=" text-center pt-3"> {{ row.contract_row }}</td>
          <td class="pt-3 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل بیمه"
                :href="endpoint(`payroll/diskette/contractRowInsurance/` + $route.params.id + '/' + row.id + '/' + '?token=' + token)"
                icon
            >
              <v-icon>fa-file-download</v-icon>
            </v-btn>
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="چاپ"
                icon
                @click="printRowInsurance('html', row.id)"
            >
              <v-icon>fa-print</v-icon>
            </v-btn>
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="PDF"
                @click="printRowInsurance('pdf', row.id)"
                icon

            >
              <v-icon>fa-file-pdf</v-icon>
            </v-btn>
            <v-btn
                small
                class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
                @click="printRowInsurance('xlsx', row.id)"
                title="اکسل"
                icon
            >
              <v-icon>fa-file-excel</v-icon>
            </v-btn>
          </td>
          <td class="pt-3 text-center">
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="فایل بیمه"
                :href="endpoint(`payroll/diskette/insurance/contractRowPerson/`  + $route.params.id + '/' + row.id + '/' + '?token=' + token)"
                icon
            >
              <v-icon>fa-file-download</v-icon>
            </v-btn>
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="چاپ"
                icon
                @click="printRowCardex('html', row.id)"
            >
              <v-icon>fa-print</v-icon>
            </v-btn>
            <v-btn
                class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
                rounded
                title="PDF"
                @click="printRowCardex('pdf', row.id)"
                icon

            >
              <v-icon>fa-file-pdf</v-icon>
            </v-btn>
            <v-btn
                small
                class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
                @click="printRowCardex('xlsx', row.id)"
                title="اکسل"
                icon
            >
              <v-icon>fa-file-excel</v-icon>
            </v-btn>

          </td>

        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <m-datatable v-show="false" :headers="headers" :apiUrl="url" :exportUrl="export_url" :filters.sync="export_filter"
                 ref="exportTable">
    </m-datatable>


  </v-card>
</template>
<script>
export default {
  name: "ReportList",
  props: {},
  data() {
    return {
      ULTIMATE_TYPES: [
        {name: ' قطعی', value: true},
        {name: 'غیر قطعی', value: false},
      ],

      CALCULATE_TYPES: [
        {name: ' محاسبه شده', value: true},
        {name: 'محاسبه نمی شود', value: false},
      ],

      url: "payroll/listOfPayItem/less",
      exportUrl: "payroll/payroll",
      export_url: "payroll/payroll",
      filters: {list_of_pay: this.$route.params.id},
      export_filter: {id: this.$route.params.id},
      accept_dialog: false,
      un_accept_dialog: false,
      delete_dialog: false,
      workshop_dialog: false,
      un_ultimate_dialog: false,
      list_of_pay: null,
      my_list: null,
      contract_row: [],
    };
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/paylist/less/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        console.log(data)
        this.list_of_pay = data
        for (let row of this.list_of_pay.contract_row) {
          this.request({
            url: this.endpoint(`payroll/contract/row/` + row + '/'),
            method: "get",
            success: data => {
              console.log(data)
              this.contract_row.push(data)
            }
          })
        }
      }
    })
  },
  computed: {
    headers() {
      return [];
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

    printInsurance(type, pk) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/total/insurance/report"
      this.$refs.exportTable.exportTo(type)
    },
    printRowInsurance(type, row_id) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/rowInsurance"
      let my_type = type
      my_type = my_type + '/' + row_id.toString() + '/'
      this.$refs.exportTable.exportTo(my_type)
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

    },
    printCardex(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = 'payroll/insuranceCardex'
      this.$refs.exportTable.exportTo(type)

    },
    printRowCardex(type, row_id) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/rowCardex"
      let my_type = type
      my_type = my_type + '/' + row_id.toString() + '/'
      this.$refs.exportTable.exportTo(my_type)
    },
    goToList() {
      this.$router.push('/panel/ListOfPay')
    },
    goToListOfPay() {
      this.$router.push('/panel/listOfPayItem/' + this.$route.params.id + '/')
    },

  }
};
</script>

<style scoped lang="scss">
</style>