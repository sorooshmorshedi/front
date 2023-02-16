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
      <span v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
      >
              فرم پرداخت حقوق و دستمزد :
      </span>

      <v-btn
          v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
          class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printReport('html')"
          icon

      >
        <v-icon>fa-print</v-icon>
      </v-btn>

      <v-btn
          v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
          class="export-btn grey--text  text--darken-3 ml-1 mr-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printReport('pdf')"
          icon
      >
        <v-icon>fa-file-pdf</v-icon>
      </v-btn>
      <v-btn
          v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
          small
          class="export-btn grey--text  text--darken-3 ml-16  mt-1 mt-md-0"
          @click="printReport('xlsx')"
          title="اکسل"
          icon
      >
        <v-icon>fa-file-excel</v-icon>
      </v-btn>

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
          class="export-btn grey--text  text--darken-3 mr-1 ml-1 mt-1 mt-md-0"
          rounded
          title="PDF"
          @click="printBankReport('pdf')"
          icon

      >
        <v-icon>fa-file-pdf</v-icon>
      </v-btn>
      <v-btn
          v-if="!listOfPay.bank_pay_date && listOfPay.pay_done"
          small
          class="export-btn grey--text  text--darken-3 ml-16  mt-1 mt-md-0"
          @click="printBankReport('xlsx')"
          title="اکسل"
          icon
      >
        <v-icon>fa-file-excel</v-icon>
      </v-btn>

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

    </v-toolbar>
    <v-row v-if="listOfPay.bank_pay_date && listOfPay.pay_done" class="mt-5  ml-5 mr-5">
      <v-col cols="12" md="2">
        <v-text-field class="currency-input" v-model="listOfPay.bank_pay_name" label="نام بانک"
                      v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
                      disabled="true"
        >
        </v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field class="currency-input" v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
              v-model="listOfPay.bank_pay_date" label="تاریخ پرداخت بانک " :default="true" disabled="true"/>
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field class="currency-input" v-model="listOfPay.bank_pay_code" label="شماره مستند بانکی"
                      v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
                      disabled="true"
        >
        </v-text-field>

      </v-col>
      <v-col cols="12" md="6">
        <v-text-field class="currency-input" v-model="listOfPay.bank_pay_explanation" label="توضیحات"
                      v-if="listOfPay.bank_pay_date && listOfPay.pay_done"
                      disabled="true"
        >
        </v-text-field>
      </v-col>
    </v-row>
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
            جمع حقوق قابل پرداخت تا این ماه
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
              <money
                  v-model="item.unpaid_of_year "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center">
              <money
                  v-model="item.payable_amout "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center">
              <money
                  v-model="item.get_total_unpaid "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center">
              <money
                  v-model="items[item.id]['pay_amount'] "
                  @change="updateUnpaid(item.id)"
              ></money>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-divider class="mt-7" vertical></v-divider>
      <v-card-actions class="justify-end">
        <date class="ml-5  mb-8" v-model="create_date" label="تاریخ ایجاد " :default="true" disabled="true"/>
        <v-btn @click="pay()" color="green darken-2" class="white--text pl-4 pr-4  mb-8" large>
          ثبت
        </v-btn>
        <v-btn
            class="light-blue white--text pl-4 pr-4 mb-8  mr-2 float-left"
            large
            @click="$router.push('/panel/listOfPayItem/' + $route.params.id + '/')"
        >بازگشت به لیست

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
            جمع حقوق قابل پرداخت تا این ماه
          </th>
          <th class="text-center">
            مبلغ حقوق پرداختی
          </th>
          <th class="text-center" v-if="!edit_amount">
            حقوق پرداخت نشده
          </th>
          </thead>
          <tbody>
          <tr v-for="item in listOfPayItem">
            <td class="text-center">
              {{ item.personnel_name }}
            </td>
            <td class="text-center">
              <money
                  v-model="item.unpaid_of_year "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center">
              <money
                  v-model="item.payable_amout "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center">
              <money
                  v-model="item.get_total_unpaid "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center" v-if="edit_amount" >
              <money
                  v-model="items[item.id]['pay_amount'] "
                  @change="updateUnpaid(item.id)"
              ></money>
            </td>
            <td class="text-center" v-if="!edit_amount" >
              <money
                  v-model="item.paid_amount "
                  :disabled="true"
              ></money>
            </td>
            <td class="text-center" v-if="!edit_amount">
              <money
                  v-model="item.get_unpaid "
                  disabled="true"
              ></money>
            </td>
          </tr>
          <tr class="green lighten-4" >
            <td class="text-center green--text text--darken-3">
              جمع
            </td>
            <td class="text-center">
              <money
                  v-model="listOfPay.get_total_un_paid_of_year "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center">
              <money
                  v-model="listOfPay.get_total_payable "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center">
              <money
                  v-model="listOfPay.get_total_un_paid "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center" v-if="!edit_amount">
              <money
                  v-model="listOfPay.get_total_paid "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center" v-if="edit_amount">
              <money
                  v-model="total_pay_amount "
                  disabled="true"
              ></money>
            </td>
            <td class="text-center" v-if="!edit_amount">
              <money
                  v-model="listOfPay.get_un_paid "
                  disabled="true"
              ></money>
            </td>

          </tr>


          </tbody>
        </template>
      </v-simple-table>
      <v-divider class="mt-7" vertical></v-divider>
      <v-card-actions class="justify-end">
        <date class="ml-5 mr-5 mb-8" v-model="create_date" label="تاریخ ایجاد " :default="true" disabled="true"/>


        <v-btn v-if="listOfPay.bank_pay_date && listOfPay.get_is_editable && listOfPay.pay_done" @click="deleteDate"
               color="red darken-1"
               class="white--text pl-4 pr-4 mb-8 " large>
          خروج از ثبت نهایی
        </v-btn>
        <v-btn v-if="listOfPay.bank_pay_date && !listOfPay.get_is_editable && listOfPay.pay_done"
               @click="un_accept_dialog = true" color="red darken-1"
               class="white--text pl-4 pr-4 mb-8 " large>
          خروج از ثبت نهایی
        </v-btn>
        <v-btn v-if="!listOfPay.bank_pay_date && !edit_amount" @click="deleteAllDate" color="red darken-1"
               class="white--text pl-4 pr-4 mb-8 " large>
          حذف پرداخت
        </v-btn>
        <v-btn v-if="!listOfPay.bank_pay_date && !edit_amount" @click="edit_amount = true" color="orange darken-1"
               class="white--text pl-4 pr-4 mb-8 " large>
          ویرایش
        </v-btn>
        <v-btn v-if="!listOfPay.bank_pay_date && edit_amount" @click="edit_amount = false ; pay()"
               color="green darken-1" class="white--text pl-4 pr-4 mb-8" large>
          ثبت
        </v-btn>
        <v-btn v-if="!listOfPay.bank_pay_date && !edit_amount && !listOfPay.get_not_done_pay" @click="not_verify_dialog = true" color="blue darken-1"
               class="white--text pl-4 pr-4 mb-8" large>
          ثبت نهایی پرداخت
        </v-btn>
        <v-btn v-if="!listOfPay.bank_pay_date && !edit_amount && listOfPay.get_not_done_pay" @click="dialog = true" color="blue darken-1"
               class="white--text pl-4 pr-4 mb-8" large>
          ثبت نهایی پرداخت
        </v-btn>
        <v-btn
            class="light-blue white--text pl-4 pr-4 mb-8  mr-2 float-left"
            large
            @click="$router.push('/panel/listOfPayItem/' + $route.params.id + '/')"
        >بازگشت به لیست

        </v-btn>

      </v-card-actions>
      <m-datatable v-show="false" :headers="headers" :apiUrl="url" :exportUrl="export_url" :filters.sync="export_filter"
                   ref="exportTable"></m-datatable>

    </v-card-text>

    <v-row justify="center">
      <v-dialog
          v-model="dialog"
          persistent
          @click:outside="dialog=false"
          max-width="1200"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            ثبت نهایی پرداخت
          </v-card-title>
          <v-card-text>
            <v-row class="mt-5">
              <v-col cols="12" md="2">
                <v-autocomplete
                    label="نام بانک"
                    :items="BANK_NAMES"
                    v-model="bank_pay_name"
                    item-text="name"
                    item-value="name"
                />
              </v-col>

              <v-col cols="12" md="3">
                <date class="" v-model="bank_pay_date" label="تاریخ پرداخت بانک " :default="true"/>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field v-on:keypress="NumbersOnly"
                              label=" شماره مستند بانکی " v-model="bank_pay_code" background-color="white"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                    label="توضیحات " v-model="bank_pay_explanation" background-color="white"/>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="dialog = false"
            >
              بستن
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                @click="addBankDate()"
            >
              ثبت نهایی
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog
          v-model="un_accept_dialog"
          persistent
          @click:outside="un_accept_dialog=false"
          max-width="500"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            توجه!
          </v-card-title>
          <v-card-text>
            ابتدا تمام لیست های حقوق مربوط به ماه های بعد امسال را غیر نهایی یا حذف کنید
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="un_accept_dialog = false"
            >
              بستن
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog
          v-model="not_verify_dialog"
          persistent
          @click:outside="not_verify_dialog=false"
          max-width="500"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            توجه!
          </v-card-title>
          <v-card-text>
            ابتدا تمام پرداخت های باز را نهایی یا حذف کنید
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="not_verify_dialog = false"
            >
              بستن
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>


  </v-card>
</template>
<script>
export default {
  name: "PaymentItemList",
  props: {},
  data() {
    return {
      BANK_NAMES: [
        {name: ' آینده', value: 'BAYAN'},
        {name: 'استاندارد چارترد', value: 'CHART'},
        {name: ' اقتصاد نوین', value: 'BEGHTE'},
        {name: ' ایران زمین ', value: 'ZAMIN'},
        {name: ' پارسیان', value: 'BPARSI'},
        {name: ' پاسارگاد', value: 'BPASAR'},
        {name: 'پست بانک ', value: 'BPOST'},
        {name: ' توسعه صادرات  ایران', value: 'BEDIRA'},
        {name: ' تجارت ', value: 'BTEJAR'},
        {name: ' تجاری ایران و اروپا', value: 'EURO'},
        {name: 'تعاون اسلامی برای سرمایه‌گذاری', value: 'ESLA'},
        {name: ' توسعه تعاون', value: 'BCDEVE'},
        {name: ' خاورمیانه ', value: 'KHAVA'},
        {name: ' دی', value: 'BDAY'},
        {name: ' رفاه کارگران ', value: 'BREFAH'},
        {name: ' سامان ', value: 'BSAMAN'},
        {name: ' سرمایه ', value: 'BSARMA'},
        {name: ' سپه ', value: 'BSEPAH'},
        {name: ' سینا ', value: 'BSINA'},
        {name: ' شهر', value: 'BCITY'},
        {name: ' صنعت و معدن ', value: 'BINDMI'},
        {name: ' صادرات ', value: 'BSADER'},
        {name: 'فیوچر بانک (المستقبل)', value: 'FUTU'},
        {name: ' قرض الحسنه رسالت ', value: 'BRESALA'},
        {name: ' قرض الحسنه مهر ایران', value: 'BGHARZ'},
        {name: ' کارآفرین', value: 'BKARAF'},
        {name: ' کشاورزی', value: 'BKESHA'},
        {name: ' گردشگری ', value: 'BTOURI'},
        {name: ' مسکن', value: 'BMASKA'},
        {name: ' ملت', value: 'BMELLA'},
        {name: '  ملی ایران', value: 'BMELLI'},
        {name: ' مشترک ایران - ونزوئلا ', value: 'VENE'},
        {name: 'مؤسسه اعتباری غیربانکی کاسپین ', value: 'CASP'},
        {name: 'مؤسسه اعتباری غیربانکی  توسعه ', value: 'TOSE'},
        {name: 'مؤسسه اعتباری غیربانکی  ملل ', value: 'MELAL'},
        {name: 'مؤسسه اعتباری غیربانکی نور ', value: 'NOR'},
      ],

      items: [],
      create_date: null,
      bank_pay_date: null,
      bank_pay_code: null,
      bank_pay_name: null,
      bank_pay_explanation: null,
      url: "payroll/listOfPayItem/less",
      exportUrl: "payroll/payroll",
      export_url: "payroll/payroll",
      filters: {list_of_pay: this.$route.params.id},
      export_filter: {id: this.$route.params.id},
      list_of_pay: null,
      my_list: null,
      edit_amount: false,
      total_pay_amount: 0,
      dialog: false,
      not_verify_dialog: false,
      un_accept_dialog: false,
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
        this.listOfPay = data
        console.log(this.listOfPay);

        this.listOfPayItem = data.list_of_pay_item
        this.bank_pay_date = data.bank_pay_date
        if (data.pay_done) {
          this.create_date = data.pay_form_create_date
        }
        if (!data.pay_done) {
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
        let total = 0
        for (let item in this.items){
          total += this.items[item]['pay_amount']
        }
        this.total_pay_amount = total


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
      let total = 0
      for (let item in this.items){
        total += this.items[item]['pay_amount']
      }
      this.total_pay_amount = total
      console.log('--------------')
      console.log(this.total_pay_amount)
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
          'bank_pay_code': this.bank_pay_code,
          'bank_pay_name': this.bank_pay_name,
          'bank_pay_explanation': this.bank_pay_explanation,

        },
        success: data => {
          console.log(data)
          location.reload()
        },
      })

    },
    deleteDate() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/pay/` + this.$route.params.id + '/'),
        method: "put",
        data: {
          'pay_done': true,
          'bank_pay_date': null,
          'pay_form_create_date': this.create_date,
          'bank_pay_code': null,
          'bank_pay_name': null,
          'bank_pay_explanation': null,

        },
        success: data => {
          console.log(data)
          location.reload()
        },
      })

    },
    deleteAllDate() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/pay/` + this.$route.params.id + '/'),
        method: "put",
        data: {
          'pay_done': false,
          'bank_pay_date': null,
          'pay_form_create_date': null,
          'bank_pay_code': null,
          'bank_pay_name': null,
          'bank_pay_explanation': null,

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
    goToList() {
      this.$router.push('/panel/payList')
    },
    NumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
        ;
      } else {
        return true;
      }
    },


  },
};
</script>

<style scoped lang="scss">
</style>