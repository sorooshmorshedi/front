<template>
  <v-card>

    <v-toolbar
        class="mt-10 mr-5 ml-5"
        color="indigo"
        dark
    >
      <v-toolbar-title>حقوق و دستمزد {{list_of_pay.name}}</v-toolbar-title>

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

      <v-btn
          small
          class="light-blue white--text ml-2 mr-3 mt-1 mt-md-0"
          icon
          @click="goToList"
          outlined
          title="لیست"
      >
        <v-icon>fa-th-list</v-icon>
      </v-btn>
    </v-toolbar>
    <v-toolbar color="indigo darken-3" class="white--text   ml-5 mt-1 mr-5 rounded">
      <v-spacer></v-spacer>
      <v-btn v-if="list_of_pay.ultimate" @click="goReport()" color="primary darken-1" class=" white--text ml-4"
             large>گزارش بیمه و مالیات
      </v-btn>
      <v-btn v-if="list_of_pay.ultimate && !list_of_pay.bank_pay_date" @click="goPay()" color="green darken-1" class=" white--text"
             large> پرداخت حقوق
      </v-btn>
      <v-btn v-if="list_of_pay.ultimate && list_of_pay.bank_pay_date" @click="goPay()" color="blue darken-2" class=" white--text"
             large>مشاهده حقوق پرداختی
      </v-btn>

    </v-toolbar>
    <v-row justify="center">
      <v-dialog
          v-model="accept_dialog"
          persistent
          @click:outside="accept_dialog=false"
          max-width="400"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            توجه!
          </v-card-title>
          <v-card-text>
            آیا برای نهایی کردن این لیست اطمینان دارید؟
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="accept_dialog = false"
            >
              بستن
            </v-btn>
            <v-btn
                color="light-blue"
                text
                @click="UltimateList"
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
            <span v-if="list_of_pay.bank_pay_date" class="mt-3 mr-5"> برای این لیست پرداخت حقوق ثبت شده</span>
            <div v-if="!list_of_pay.bank_pay_date">
              <span v-if="!list_of_pay.ultimate">برای نهایی کردن یا تغییر لیست نباید لیست دیگری از ماه های بعد نهایی باشد</span>
              <br/>
              ابتدا تمام لیست های حقوق مربوط به ماه های بعد امسال را غیر نهایی کنید

            </div>
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
          v-model="workshop_dialog"
          persistent
          @click:outside="workshop_dialog=false"
          max-width="300"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            توجه!
          </v-card-title>
          <v-card-text>
            ابتدا  کارگاه را به حالت نهایی بازگردانید
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="workshop_dialog = false"
            >
              بستن
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog
          v-model="delete_dialog"
          persistent
          @click:outside="delete_dialog=false"
          max-width="400"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            آیا از حذف این لیست اطمینان دارید؟
          </v-card-title>
          <v-card-text >
            باتوجه به اینکه با حذف این لیست امکان بازگردانی مجدد اطلاعات نیست آیا اطمینان دارید؟
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="delete_dialog = false"
            >
              بستن
            </v-btn>
            <v-btn
                color="light-blue"
                text
                @click="DeleteList"
            >
              حذف
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-row justify="center">
      <v-dialog
          v-model="un_ultimate_dialog"
          @click:outside="un_ultimate_dialog=false"
          max-width="450"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            توجه
          </v-card-title>
          <v-card-text v-if="list_of_pay.use_in_calculate" >
            باتوجه به اینکه با خروج این لیست از حالت نهایی امکان دارد تمام محاسبات دارای بیمه و مالیات این سال تغییر یابد، آیا اطمینان دارید؟
          </v-card-text>
          <v-card-text v-if="!list_of_pay.use_in_calculate" >
            آیا از غیر نهایی کردن این لیست اطمینان دارید؟
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="un_ultimate_dialog = false"
            >
              بستن
            </v-btn>
            <v-btn
                color="light-blue"
                text
                @click="UnUltimateList"
            >
              خروج از وضعیت نهایی
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-card-actions class="justify-end mt-4">
    </v-card-actions>
    <v-card-text>
      <v-simple-table class="ma-3 border_all " dense>
        <thead class="indigo darken-2 white--text">

        <tr>
          <th class="white--text pa-1">
            تایید پایه سنوات
          </th>
          <th class="white--text pa-1">
            پرسنل در کارگاه
          </th>
          <th class="white--text pa-1">
            تاریخ شروع به کار
          </th>
          <th class="white--text pa-1">
            بیمه میشود
          </th>
          <th class="white--text pa-1">
            عنوان شغل
          </th>
          <th class="white--text pa-1">
            سابقه بیمه در کارگاه
          </th>
          <th class="white--text pa-1">
            ردیف پیمان
          </th>
          <th class="white--text pa-1">
            کارکرد عادی
          </th>
          <th class="white--text pa-1">
            کارکرد واقعی
          </th>
          <th class="white--text pa-1">
            حقوق پایه ماهانه
          </th>
          <th class="white--text pa-1">
            پایه سنوات ماهانه
          </th>
          <th class="white--text pa-1">
            اضافه کاری
          </th>
          <th class="white--text pa-1">
            تعطیل کاری
          </th>
          <th class="white--text pa-1">
            شب کاری
          </th>
          <th class="white--text pa-1">
            ماموریت
          </th>
          <th class="white--text pa-1">
            حق اولاد
          </th>
          <th class="white--text pa-1">
            حق مسکن
          </th>
          <th class="white--text pa-1">
            حق جذب
          </th>
          <th class="white--text pa-1">
            بن خاروبار
          </th>
          <th class="white--text pa-1">
            جمع سایر مزایای حکمی
          </th>
          <th class="white--text pa-1">
            حق سنوات
          </th>
          <th class="white--text pa-1">
            عیدی و پاداش
          </th>
          <th class="white--text pa-1">
            سایر اضافات
          </th>
          <th class="white--text pa-1">
            حقوق مزایای کل ماهانه
          </th>
          <th class="white--text pa-1">
            حق بیمه سهم بیمه شده
          </th>
          <th class="white--text pa-1">
            مالیات حقوق
          </th>
          <th class="white--text pa-1">
            بدهی مساعده
          </th>
          <th class="white--text pa-1">
            بدهی وام
          </th>
          <th class="white--text pa-1">
            بدهی غیره
          </th>
          <th class="white--text pa-1">
            کسر کار
          </th>
          <th class="white--text pa-1">
            سایر کسورات
          </th>
          <th class="white--text pa-1">
            حقوق و دستمزد پرداختنی
          </th>
        </tr>

        </thead>
        <tbody>

        <tr v-for="item in list_of_pay_items" @click="$router.push(to(item))">
          <td> {{item.get_sanavat_verify}}</td>
          <td> {{item.personnel_name}}</td>
          <td> {{item.work_start_date}}</td>
          <td> {{item.insurance_display}}</td>
          <td> {{item.work_title}}</td>
          <td> {{item.get_insurance_in_workshop}}</td>
          <td> {{item.contract_row}}</td>
          <td> {{item.normal_worktime}}</td>
          <td> {{item.real_worktime}}</td>
          <td> {{item.hoghoogh_mahane_real_work}}</td>
          <td> {{item.sanavat_mahane_real_work}}</td>
          <td> {{item.ezafe_kari_total}}</td>
          <td> {{item.tatil_kari_total}}</td>
          <td> {{item.shab_kari_total}}</td>
          <td> {{item.get_mission_total}}</td>
          <td> {{item.aele_mandi}}</td>
          <td> {{item.get_haghe_maskan}}</td>
          <td> {{item.get_haghe_jazb}}</td>
          <td> {{item.get_kharo_bar}}</td>
          <td> {{item.get_sayer_hr}}</td>
          <td> {{item.haghe_sanavat_total}}</td>
          <td> {{item.padash_total}}</td>
          <td> {{item.sayer_ezafat}}</td>
          <td> {{item.total_payment}}</td>
          <td> {{item.get_haghe_bime_bime_shavande}}</td>
          <td> {{item.total_tax}}</td>
          <td> {{item.dept_amount}}</td>
          <td> {{item.loan_amount}}</td>
          <td> {{item.get_deduction}}</td>
          <td> {{item.kasre_kar_total}}</td>
          <td> {{item.sayer_kosoorat}}</td>
          <td> {{item.get_payable}}</td>
        </tr>
        <tr>
          <td  class="text-center" colspan="7"> جمع</td>
          <td> {{list_of_pay.get_total.normal_worktime}}</td>
          <td> {{list_of_pay.get_total.real_worktime}}</td>
          <td> {{list_of_pay.get_total.hoghoogh_mahane}}</td>
          <td> {{list_of_pay.get_total.sanavat_mahane}}</td>
          <td> {{list_of_pay.get_total.ezafe_kari_total}}</td>
          <td> {{list_of_pay.get_total.tatil_kari_total}}</td>
          <td> {{list_of_pay.get_total.shab_kari_total}}</td>
          <td> {{list_of_pay.get_total.mission_total}}</td>
          <td> {{list_of_pay.get_total.aele_mandi}}</td>
          <td> {{list_of_pay.get_total.haghe_maskan}}</td>
          <td> {{list_of_pay.get_total.haghe_jazb}}</td>
          <td> {{list_of_pay.get_total.kharo_bar}}</td>
          <td> {{list_of_pay.get_total.sayer_hr}}</td>
          <td> {{list_of_pay.get_total.haghe_sanavat_total}}</td>
          <td> {{list_of_pay.get_total.padash_total}}</td>
          <td> {{list_of_pay.get_total.sayer_ezafat}}</td>
          <td> {{list_of_pay.get_total.total_payment}}</td>
          <td> {{list_of_pay.get_total.haghe_bime_bime_shavande}}</td>
          <td> {{list_of_pay.get_total.total_tax}}</td>
          <td> {{list_of_pay.get_total.dept_amount}}</td>
          <td> {{list_of_pay.get_total.loan_amount}}</td>
          <td> {{list_of_pay.get_total.check_and_get_optional_deduction_episode}}</td>
          <td> {{list_of_pay.get_total.kasre_kar_total}}</td>
          <td> {{list_of_pay.get_total.sayer_kosoorat}}</td>
          <td> {{list_of_pay.get_total.payable}}</td>
        </tr>
        </tbody>
      </v-simple-table>

      <m-datatable v-show="false" :headers="headers" :apiUrl="url" :exportUrl="export_url" :filters.sync="export_filter"
                   ref="exportTable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)"/>
        </template>
      </m-datatable>
    </v-card-text>
    <v-card-actions>
      <v-row>
        <v-col cols="12" md="9">
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
              </v-banner>
            </v-col>
          </v-row>

        </v-col>
        <v-col
            cols="12"
            md="3"
            class="d-flex justify-center justify-md-end"
        >
          <v-btn
              class="orange white--text mt-2  mr-2 ml-5 float-left"
              large
              @click="$router.push('/panel/payList/edit?pay_id=' + $route.params.id)"
              v-if="!list_of_pay.ultimate"
          >ویرایش
          </v-btn>
          <v-btn
              class="red white--text mt-2  mr-2 ml-5 float-left"
              large
              @click="delete_dialog = true"
              v-if="!list_of_pay.ultimate"
          >حذف لیست
          </v-btn>
          <v-btn
              class="light-blue white--text mt-2  mr-2 ml-5 float-left"
              large
              @click="un_accept_dialog = true"
              v-if="!list_of_pay.ultimate && !list_of_pay.get_is_editable"
          >ثبت نهایی
          </v-btn>
          <v-btn
              class="light-blue white--text mt-2  mr-2 ml-5 float-left"
              large
              @click="accept_dialog = true"
              v-if="!list_of_pay.ultimate && list_of_pay.get_is_editable"
          >ثبت نهایی
          </v-btn>
          <v-btn
              class="red white--text mt-2 mr-2 ml-5 float-left "
              @click="un_ultimate_dialog = true"
              large
              v-if="list_of_pay.ultimate && list_of_pay.get_is_editable && list_of_pay.is_workshop_verified"> خروج از وضعیت نهایی
          </v-btn>
          <v-btn
              class="red white--text mt-2 mr-2 ml-5 float-left "
              @click="workshop_dialog = true"
              large
              v-if="list_of_pay.ultimate && list_of_pay.get_is_editable && !list_of_pay.is_workshop_verified"> خروج از وضعیت نهایی
          </v-btn>
          <v-btn
              class="red white--text mt-2 mr-2 ml-5 float-left "
              @click="un_accept_dialog = true"
              large
              v-if="list_of_pay.ultimate && !list_of_pay.get_is_editable"> خروج از وضعیت نهایی
          </v-btn>
        </v-col>
      </v-row>

    </v-card-actions>



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
      accept_dialog: false,
      un_accept_dialog: false,
      delete_dialog: false,
      workshop_dialog: false,
      un_ultimate_dialog: false,
      list_of_pay: null,
      list_of_pay_items: null,
      my_list: null,
    };
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/paylist/less/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        console.log(data.list_of_pay_item)
        this.list_of_pay = data
        this.list_of_pay_items = data.list_of_pay_item
      }
    })
  },
  computed: {
    headers() {
      return [
        {
          text: "تایید پایه سنوات",
          value: "get_sanavat_verify",
          type: 'boolean',
        },
        {
          text: "پرسنل در کارگاه",
          value: "personnel_name",
        },
        {
          text: "تاریخ شروع به کار",
          value: "work_start_date",
        },
        {
          text: "بیمه میشود؟",
          value: "insurance_display",
        },
        {
          text: "عنوان شغل",
          value: "work_title",
        },
        {
          text: "سابقه بیمه در کارگاه",
          value: "get_insurance_in_workshop",
        },
        {
          text: "ردیف پیمان",
          value: "contract_row",
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
          text: "حقوق پایه ماهانه",
          value: "hoghoogh_mahane_real_work",
          type: 'numeric',
        },
        {
          text: "پایه سنوات ماهانه",
          value: "sanavat_mahane_real_work",
          type: 'numeric',
        },
        {
          text: "اضافه کاری ",
          value: "ezafe_kari_total",
          type: 'numeric'
        },
        {
          text: "تعطیل کاری ",
          value: "tatil_kari_total",
          type: 'numeric'
        },
        {
          text: "شب کاری ",
          value: "shab_kari_total",
          type: 'numeric'
        },
        {
          text: "ماموریت",
          value: "get_mission_total",
          type: 'numeric'
        },
        {
          text: "حق اولاد",
          value: "aele_mandi",
          type: 'numeric'
        },
        {
          text: "حق مسکن",
          value: "get_haghe_maskan",
          type: 'numeric'
        },
        {
          text: "حق جذب",
          value: "get_haghe_jazb",
          type: 'numeric'
        },
        {
          text: "بن خاروبار",
          value: "get_kharo_bar",
          type: 'numeric'
        },
        {
          text: "جمع سایر مزایای حکمی",
          value: "get_sayer_hr",
          type: 'numeric'
        },
        {
          text: "حق سنوات",
          value: "haghe_sanavat_total",
          type: 'numeric'
        },
        {
          text: "عیدی و پاداش",
          value: "padash_total",
          type: 'numeric'
        },
        {
          text: "سایر اضافات",
          value: "sayer_ezafat",
          type: 'numeric'
        },

        {
          text: "حقوق مزایای کل ماهانه",
          value: "total_payment",
          type: 'numeric'
        },
        {
          text: "حق بیمه سهم بیمه شده",
          value: "get_haghe_bime_bime_shavande",
          type: 'numeric'
        },
        {
          text: "مالیات حقوق",
          value: "get_month_tax",
          type: 'numeric'
        },

        {
          text: "بدهی مساعده",
          value: "get_dept",
          type: 'numeric'
        },
        {
          text: "بدهی وام",
          value: "get_loan",
          type: 'numeric'
        },
        {
          text: "بدهی غیره",
          value: "get_deduction",
          type: 'numeric'
        },
        {
          text: "کسر کار (مبلغ)",
          value: "kasre_kar_total",
          type: 'numeric'
        },

        {
          text: "سایر کسورات",
          value: "sayer_kosoorat",
          type: 'numeric'
        },

        {
          text: "حقوق و دستمزد پرداختنی",
          value: "get_payable",
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
    goReport() {
      this.$router.push('/panel/reportList/' + this.$route.params.id + '/')
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
    printCardex(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = 'payroll/insuranceCardex'
      this.$refs.exportTable.exportTo(type)

    },
    goToList() {
      this.$router.push('/panel/ListOfPay')
    },
    UltimateList() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/ultimate/` + this.$route.params.id + '/'),
        method: "post",
        data: {
          'ultimate': true,
        },
        success: data => {
          this.notify('نهایی شد', 'success')
          window.location.reload()
        },
        error: data => {
          this.notify(data.response.data['وضعیت'], 'danger')
        }

      })
    },
    UnUltimateList() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/ultimate/` + this.$route.params.id + '/'),
        method: "post",
        data: {
          'ultimate': false,
        },
        success: data => {
          this.notify('غیر نهایی شد', 'success')
          window.location.reload()
        }
      })
    },
    DeleteList() {
      this.request({
        url: this.endpoint(`payroll/paylist/` + this.$route.params.id + '/'),
        method: "delete",
        success: data => {
          this.notify('لیست حقوق حذف شد شد', 'success')
          this.$router.push('/panel/ListOfPay')
        }
      })
    },

  }
};
</script>

<style scoped lang="scss">
</style>