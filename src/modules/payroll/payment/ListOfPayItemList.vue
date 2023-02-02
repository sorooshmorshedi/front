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
            <span v-if="!list_of_pay.ultimate">برای نهایی کردن یا تغییر لیست نباید لیست دیگری از ماه های بعد نهایی باشد</span>
            <br/>
            ابتدا تمام لیست های حقوق مربوط به ماه های بعد امسال را غیر نهایی کنید
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
      my_list: null,
    };
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/paylist/less/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        console.log('ok')
        this.list_of_pay = data
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
          text: "تاریخ شروع به کار",
          value: "start_date",
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