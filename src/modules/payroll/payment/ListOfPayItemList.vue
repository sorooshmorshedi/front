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
    <v-row>
      <v-col cols="12" md="12">
        <v-banner v-if="!list_of_pay.ultimate" class="mt-3 ml-2 mr-2 orange--text text--darken-3">
          <v-avatar
              slot="icon"
              color="orange"
              size="40"
          >
            <v-icon
                color="white"
            >
              fa-times
            </v-icon>
          </v-avatar>
          این لیست غیر قطعی میباشد

          <v-btn left class="float-left ml-5"
                 outlined
                 color="green darken-3"
                 @click="UltimateList">
            <v-icon class="ml-4"> fa-check</v-icon>
            قطعی شود
          </v-btn>
        </v-banner>
        <v-banner v-if="list_of_pay.ultimate" class="mt-3 ml-2 mr-2 green--text text--darken-3">
          <v-avatar
              slot="icon"
              color="green"
              size="40"
          >
            <v-icon
                color="white"
            >
              fa-check
            </v-icon>
          </v-avatar>
          این لیست قطعی میباشد

          <v-btn left class="float-left ml-5"
                 outlined
                 color="red darken-3"
                 @click="UnUltimateList">
            <v-icon class="ml-4"> fa-times</v-icon>
            غیر قطعی شود
          </v-btn>
        </v-banner>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-banner v-if="!list_of_pay.use_in_calculate" class="ml-2 mr-2 mb-2 orange--text text--darken-3">
          <v-avatar
              slot="icon"
              color="orange"
              size="40"
          >
            <v-icon
                color="white"
            >
              fa-times
            </v-icon>
          </v-avatar>
          این لیست در محاسبات بیمه و مالیات محاسبه نمی شود

          <v-btn left class="float-left ml-5"
                 outlined
                 color="green darken-3"
                 @click="CalculateList">
            <v-icon class="ml-4"> fa-check</v-icon>
            محاسبات انجام شود
          </v-btn>
        </v-banner>
        <v-banner v-if="list_of_pay.use_in_calculate" class="ml-2 mr-2 mb-2 green--text text--darken-3">
          <v-avatar
              slot="icon"
              color="green"
              size="40"
          >
            <v-icon
                color="white"
            >
              fa-check
            </v-icon>
          </v-avatar>
          این لیست در محاسبات بیمه و مالیات محاسبه می شود

          <v-btn left class="float-left ml-5"
                 outlined
                 color="red darken-3"
                 @click="UnCalculateList">
            <v-icon class="ml-4"> fa-times</v-icon>
            از محاسبات خارج شود
          </v-btn>
        </v-banner>
      </v-col>
    </v-row>

  </v-card>
</template>
<script>
export default {
  name: "PaymentItemList",
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
          text: "بیمه میشود؟",
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

    },
    UltimateList() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/ultimate/` + this.$route.params.id + '/'),
        method: "post",
        data: {
          'ultimate': true,
          'use_in_calculate': this.list_of_pay.use_in_calculate
        },
        success: data => {
          this.notify('قطعی شد', 'success')
          window.location.reload()
        }
      })
    },
    UnUltimateList() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/ultimate/` + this.$route.params.id + '/'),
        method: "post",
        data: {
          'ultimate': false,
          'use_in_calculate': this.list_of_pay.use_in_calculate
        },
        success: data => {
          this.notify('غیر قطعی شد', 'success')
          window.location.reload()
        }
      })
    },
    CalculateList() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/ultimate/` + this.$route.params.id + '/'),
        method: "post",
        data: {
          'ultimate': this.list_of_pay.ultimate,
          'use_in_calculate': true
        },
        success: data => {
          this.notify('ثبت در محاسبات بیمه و مالیات انجام شد', 'success')
          window.location.reload()
        }
      })
    },
    UnCalculateList() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/ultimate/` + this.$route.params.id + '/'),
        method: "post",
        data: {
          'ultimate': this.list_of_pay.ultimate,
          'use_in_calculate': false
        },
        success: data => {
          this.notify('از محاسبات بیمه و مالیات خارج شد', 'success')
          window.location.reload()
        }
      })
    },

  }
};
</script>

<style scoped lang="scss">
</style>