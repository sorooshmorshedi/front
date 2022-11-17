<template>
  <v-card>

    <v-toolbar
        class="mt-10 mr-5 ml-5"
        color="indigo"
        dark
    >
      <v-toolbar-title>فرم پرداخت حقوق و دستمزد</v-toolbar-title>
      <v-divider
          class="mx-4"
          vertical
      ></v-divider>

      <span class="subheading mr-4 ml-4">کارگاه :  {{ listOfPay.workshop_name }}</span>
      <v-divider class="mr-2 ml-2" vertical></v-divider>
      <span class="subheading mr-4 ">سال : {{ listOfPay.year }}</span>

      <v-divider class="mr-4" vertical></v-divider>
      <span class="subheading mr-2 ml-2 "> ماه : {{ listOfPay.month_name }}</span>
      <v-spacer></v-spacer>
      <span v-if="listOfPay.pay_done"
      >
              فرم پرداخت حقوق و دستمزد :
      </span>

      <v-btn
          v-if="listOfPay.pay_done"
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printReport('html')"
          icon

      >
        <v-icon>fa-print</v-icon>
      </v-btn>

      <v-btn
          v-if="listOfPay.pay_done"
          class="export-btn grey--text  text--darken-3 mr-1 ml-3 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printReport('pdf')"
          icon

      >
        <v-icon>fa-file-pdf</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <span v-if="!listOfPay.bank_pay_date && listOfPay.pay_done">خروجی بانک جهت پرداخت :</span>
      <v-btn
          v-if="!listOfPay.bank_pay_date && listOfPay.pay_done"
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printBankReport('html')"
          icon

      >
        <v-icon>fa-print</v-icon>
      </v-btn>

      <v-btn
          v-if="!listOfPay.bank_pay_date && listOfPay.pay_done"
          class="export-btn grey--text  text--darken-3 mr-1 ml-3 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printBankReport('pdf')"
          icon

      >
        <v-icon>fa-file-pdf</v-icon>
      </v-btn>

    </v-toolbar>
    <v-card-text v-if="!listOfPay.pay_done">
      <v-card-actions class="justify-center">
      </v-card-actions>
      <v-simple-table class="mt-10 ">
        <template v-slot:default>
          <thead class="style: blue lighten-4 pa-5">
          <th class="text-center">
            نام و نام خانوادگی
          </th>
          <th class="text-center">
            حقوق معوق
          </th>
          <th class="text-center">
            حقوق قابل پرداخت ماه جاری
          </th>
          <th class="text-center">
            جمع حقوق قابل پرداخت تا ماه
          </th>
          <th class="text-center">
            مبلغ ارسالی به بانک جهت پرداخت
          </th>
          </thead>
          <tbody>
          <tr v-for="item in listOfPayItem">
            <td class="text-center">
              {{ item.personnel_name }}
            </td>
            <td class="text-center">
              {{ item.unpaid_of_year }}
            </td>
            <td class="text-center">
              {{ item.get_unpaid }}
            </td>
            <td class="text-center">
              {{ item.get_total_unpaid }}
            </td>
            <td class="text-center">
              <v-text-field
                  class="currency-input"
                  v-model="items[item.id]['pay_amount'] "
                  @change="updateUnpaid(item.id)"
              ></v-text-field>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider class="mt-7" vertical></v-divider>
      <v-card-actions class="justify-end">
        <date class="ml-5 mr-5" v-model="create_date" label="تاریخ ایجاد " :default="true" disabled="true"/>
        <v-btn @click="pay()" color="green darken-2" class="white--text pl-4 pr-4 ml-8" large>
          ثبت
        </v-btn>
      </v-card-actions>

    </v-card-text>
    <v-card-text v-if="listOfPay.pay_done">
      <v-card-actions class="justify-center">
      </v-card-actions>
      <v-simple-table class="mt-10 ">
        <template v-slot:default>
          <thead class="style: blue lighten-4 pa-5">
          <th class="text-center">
            نام و نام خانوادگی
          </th>
          <th class="text-center">
            حقوق معوق
          </th>
          <th class="text-center">
            حقوق قابل پرداخت ماه جاری
          </th>
          <th class="text-center">
            جمع حقوق قابل پرداخت تا ماه
          </th>
          <th class="text-center">
            مبلغ حقوق پرداخت
          </th>
          <th class="text-center">
            حقوق پرداخت نشده
          </th>
          </thead>
          <tbody>
          <tr v-for="item in listOfPayItem">
            <td class="text-center">
              {{ item.personnel_name }}
            </td>
            <td class="text-center">
              {{ item.unpaid_of_year }}
            </td>
            <td class="text-center">
              {{ item.payable_amout }}
            </td>
            <td class="text-center">
              {{ item.get_total_unpaid }}
            </td>
            <td class="text-center">
              {{ item.paid_amount }}
            </td>
            <td class="text-center">
              {{ item.get_unpaid }}
            </td>
          </tr>


          </tbody>
        </template>
      </v-simple-table>
      <v-divider class="mt-7" vertical></v-divider>
      <v-card-actions class="justify-end">
        <date class="ml-5 mr-5" v-model="create_date" label="تاریخ ایجاد " :default="true" disabled="true"/>
        <date class="ml-5 mr-5" :disabled="listOfPay.bank_pay_date" v-model="bank_pay_date" label="تاریخ پرداخت بانک " :default="false"/>


        <v-btn v-if="!listOfPay.bank_pay_date" @click="addBankDate()" color="orange darken-2" class="white--text pl-4 pr-4 ml-8" large>
          ثبت تاریخ
        </v-btn>
      </v-card-actions>
      <m-datatable v-show="false" :headers="headers" :apiUrl="url" :exportUrl="export_url" :filters.sync="export_filter"
                   ref="exportTable"></m-datatable>

    </v-card-text>

  </v-card>
</template>
<script>
export default {
  name: "PaymentItemList",
  props: {},
  data() {
    return {
      items: [],
      create_date: null,
      bank_pay_date: null,
      url: "payroll/listOfPayItem/less",
      exportUrl: "payroll/payroll",
      export_url: "payroll/payroll",
      filters: {list_of_pay: this.$route.params.id},
      export_filter: {id: this.$route.params.id},
      list_of_pay: null,
      my_list: null,
      list_of: null,
      listOfPay: null,
      listOfPayItem: null,
    };
  },

  mounted() {
    this.request({
      url: this.endpoint(`payroll/listOfPay/pay/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.listOfPay = data
        console.log(data);

        this.listOfPayItem = data.list_of_pay_item
        this.bank_pay_date = data.bank_pay_date
        if(data.pay_done) {
          this.create_date = data.pay_form_create_date
        }
        if(!data.pay_done) {
          this.create_date = null
        }
        for (let item in data.list_of_pay_item) {
          this.items[data.list_of_pay_item[item].id] = {
            'id': data.list_of_pay_item[item].id,
            'amount': data.list_of_pay_item[item].get_total_unpaid,
            'pay_amount': data.list_of_pay_item[item].get_total_unpaid,
            'un_paid': 0,
          }
        }
        console.log(this.items)

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
    updateUnpaid(id) {
      console.log(this.items[id])
      this.items[id]['un_paid'] = this.items[id]['amount'] - this.items[id]['pay_amount']
      console.log(this.items[id])

    },
    pay() {
      for (let payitem in this.items) {
        console.log(payitem)
        this.request({
          url: this.endpoint(`payroll/listOfPayItem/pay/` + payitem + '/'),

          method: "put",
          data: {
            'paid_amount': this.items[payitem]['pay_amount'],
          },
          success: data => {
            console.log(data)
          },
        })
      }
      this.request({
        url: this.endpoint(`payroll/listOfPay/pay/` + this.$route.params.id + '/'),

        method: "put",
        data: {
          'pay_done': true,
          'bank_pay_date': this.bank_pay_date,
          'pay_form_create_date': this.create_date,
        },
        success: data => {
          console.log(data)
          location.reload()
        },
      })

    },
    addBankDate() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/pay/` + this.$route.params.id + '/'),
        method: "put",
        data: {
          'pay_done': true,
          'bank_pay_date': this.bank_pay_date,
          'pay_form_create_date': this.create_date,
        },
        success: data => {
          console.log(data)
          location.reload()
        },
      })

    },
    printReport(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/payForm"
      this.$refs.exportTable.exportTo(type)
    },
    printBankReport(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/bankReport"
      this.$refs.exportTable.exportTo(type)
    },


  },
};
</script>

<style scoped lang="scss">
</style>