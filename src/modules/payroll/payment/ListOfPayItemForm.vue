<template>
  <div>
    <v-card
        elevation="1"
        class="ma-1 pa-1 rounded"
    >
      <v-toolbar
          color="indigo darken-2"
          dark
      >
        <v-app-bar-nav-icon

        ></v-app-bar-nav-icon>

        <v-toolbar-title> حقوق و دستمزد  </v-toolbar-title>

        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        فیش حقوقی :
        <v-btn
            class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
            rounded
            title="چاپ"
            icon
            @click="printPayslip('html')"
        >
          <v-icon>fa-print</v-icon>
        </v-btn>
        <v-btn
            class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
            rounded
            title="PDF"
            @click="printPayslip('pdf')"
            icon

        >
          <v-icon>fa-file-pdf</v-icon>
        </v-btn>
        <v-btn
            small
            class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
            @click="printPayslip('xlsx')"
            title="اکسل"
            icon
        >
          <v-icon>fa-file-excel</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        گزارش مالیات :
        <v-btn
            class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
            rounded
            title="چاپ"
            icon
            @click="printTax('html')"
        >
          <v-icon>fa-print</v-icon>
        </v-btn>

        <v-btn
            class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
            rounded
            title="PDF"
            @click="printTax('pdf')"
            icon
        >
          <v-icon>fa-file-pdf</v-icon>
        </v-btn>
        <v-btn
            small
            class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
            @click="printTax('xlsx')"
            title="اکسل"
            icon
        >
          <v-icon>fa-file-excel</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        اطلاعات حقوق بگیر :
        <v-btn
            class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
            rounded
            title="فایل مالیات"
            :href="this.endpoint(`payroll/diskette/tax/newPerson/` + this.list_of_pay_item.workshop_personnel + '/' + '?token=' + this.token)"
            icon

        >
          <v-icon>fa-file-download</v-icon>
        </v-btn>
        <v-btn
            class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
            rounded
            title="چاپ"
            icon
            @click="printPersonTax('html')"
        >
          <v-icon>fa-print</v-icon>
        </v-btn>
        <v-btn
            class="export-btn grey--text  text--darken-3 mr-1 mt-1 mt-md-0"
            rounded
            title="PDF"
            @click="printPersonTax('pdf')"
            icon

        >
          <v-icon>fa-file-pdf</v-icon>
        </v-btn>
        <v-btn
            small
            class=" grey--text  text--darken-3 export-btn mr-1 mt-1 mt-md-0"
            @click="printPersonTax('xlsx')"
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
            :href="this.endpoint(`payroll/diskette/insurance/person/` + this.$route.params.id + '/' + '?token=' + this.token)"
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

      <v-toolbar
          color="indigo"
          dark
      >



        <v-toolbar-title>  {{ list_of_pay_item.personnel_name }} </v-toolbar-title>

        <v-spacer></v-spacer>
       <span class="ml-2 mr-2"> کارگاه {{list_of_pay_item.workshop_display}}</span>
       <span class="ml-2 mr-2"> سال {{list_of_pay_item.year}}</span>
       <span class="ml-2 mr-2"> ماه  {{list_of_pay_item.month_display}}</span>
      </v-toolbar>
      <v-simple-table
          class="ma-2 mt-5"
      >
        <template v-slot:default>
          <thead class="style: indigo darken-2">

          <tr>
          </tr>
          </thead>
          <thead class="style: indigo lighten-1"
          >
          <tr>
            <th class="text-center">ردیف</th>
            <th class="text-center">نام و نام خانوادگی</th>
            <th class="text-center">تاریخ شروع به کار</th>
            <th class="text-center">تاریخ تسوبه</th>
            <th class="text-center">عنوان شغل</th>
            <th class="text-center">بیمه میشود؟</th>
            <th class="text-center">سابقه بیمه در کارگاه</th>
            <th class="text-center">ردیف پیمان</th>
            <th class="text-center">کارکرد عادی</th>
            <th colspan="3" class="text-center">مرخصی استحقاقی</th>
            <th class="text-center">مرخصی استعلاجی</th>
            <th class="text-center">مرخصی ماده 73</th>
            <th class="text-center">مرخصی بدون حقوق</th>
            <th class="text-center">غیبت</th>
            <th class="text-center">کارکرد واقعی</th>
            <th class="text-center">حداقل مزد روزانه</th>
            <th class="text-center">حقوق پایه ماهانه</th>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-center">ساعتی</td>
            <td class="text-center">روزانه</td>
            <td class="text-center">جمع</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </thead>
          <tbody
          >
          <tr
          >
            <td class="text-center">*</td>
            <td class="text-center">{{ list_of_pay_item.personnel_name }}</td>
            <td class="text-center">{{ list_of_pay_item.start_date }}</td>
            <td class="text-center"></td>
            <td class="text-center">{{ list_of_pay_item.work_title }}</td>
            <td class="text-center">
              <span v-if="list_of_pay_item.is_insurance == 'y'"> بلی</span>
            </td>
            <td class="text-center">{{ list_of_pay_item.get_insurance_in_workshop }}</td>
            <td class="text-center">{{ list_of_pay_item.contract_row }}</td>
            <td class="text-center">{{ list_of_pay_item.normal_worktime }}</td>
            <td class="text-center">{{ list_of_pay_item.hourly_entitlement_leave_day }}</td>
            <td class="text-center">{{ list_of_pay_item.daily_entitlement_leave_day }}</td>
            <td class="text-center">{{ list_of_pay_item.entitlement_leave_day }}</td>
            <td class="text-center">{{ list_of_pay_item.illness_leave_day }}</td>
            <td class="text-center">{{ list_of_pay_item.matter_47_leave_day }}</td>
            <td class="text-center">{{ list_of_pay_item.without_salary_leave_day }}</td>
            <td class="text-center">{{ list_of_pay_item.absence_day }}</td>
            <td class="text-center">{{ list_of_pay_item.real_worktime }}</td>
            <td class="text-center">{{ list_of_pay_item.hoghoogh_roozane }}</td>
            <td class="text-center">{{ list_of_pay_item.hoghoogh_mahane_real_work }}</td>
          </tr>
          </tbody>
          <thead class="style: indigo lighten-1"
          >
          <tr>
            <th class="text-center">پایه سنوات روزانه</th>
            <th class="text-center">پایه سنوات ماهانه</th>
            <th colspan="2" class="text-center">اضافه کاری</th>
            <th colspan="2" class="text-center">تعطیل کاری</th>
            <th colspan="2" class="text-center">شب کاری</th>
            <th colspan="2" class="text-center">کسر کار</th>
            <th colspan="2" class="text-center">ماموریت</th>
            <th class="text-center">حق خاروبار</th>
            <th class="text-center">حق مسکن</th>
            <th colspan="2" class="text-center">حق اولاد</th>
            <th class="text-center">حق جذب</th>
            <th class="text-center">سایر اضافات</th>
            <th class="text-center">حقوق مزایای کل ماهانه</th>


          </tr>
          <tr>
            <td class="text-center"></td>
            <td class="text-center"></td>
            <td class="text-center">ساعت</td>
            <td class="text-center">مبلغ</td>
            <td class="text-center">ساعت</td>
            <td class="text-center">مبلغ</td>
            <td class="text-center">ساعت</td>
            <td class="text-center">مبلغ</td>
            <td class="text-center">ساعت</td>
            <td class="text-center">مبلغ</td>
            <td class="text-center">روز</td>
            <td class="text-center">مبلغ</td>
            <td></td>
            <td></td>
            <td class="text-center">تعداد اولاد</td>
            <td class="text-center">مبلغ</td>
            <td></td>
            <td></td>
            <td></td>

          </tr>
          </thead>
          <tbody
          >
          <tr
          >
            <td class="text-center">{{ list_of_pay_item.sanavat_base }}</td>
            <td class="text-center">{{ list_of_pay_item.sanavat_mahane_real_work }}</td>
            <td class="text-center">{{ list_of_pay_item.ezafe_kari }}</td>
            <td class="text-center">{{ list_of_pay_item.ezafe_kari_total }}</td>
            <td class="text-center">{{ list_of_pay_item.tatil_kari }}</td>
            <td class="text-center">{{ list_of_pay_item.tatil_kari_total }}</td>
            <td class="text-center">{{ list_of_pay_item.shab_kari }}</td>
            <td class="text-center">{{ list_of_pay_item.shab_kari_total }}</td>
            <td class="text-center">{{ list_of_pay_item.kasre_kar }}</td>
            <td class="text-center">{{ list_of_pay_item.kasre_kar_total }}</td>
            <td class="text-center">{{ list_of_pay_item.mission_day }}</td>
            <td class="text-center">{{ list_of_pay_item.get_mission_total }}</td>
            <td class="text-center">{{ list_of_pay_item.info.additions.kharo_bar }}</td>
            <td class="text-center">{{ list_of_pay_item.info.additions.hagh_maskan }}</td>
            <td class="text-center">{{ list_of_pay_item.aele_mandi_child }}</td>
            <td class="text-center">{{ list_of_pay_item.aele_mandi }}</td>
            <td class="text-center">{{ list_of_pay_item.info.additions.hagh_jazb }}</td>
            <td class="text-center">{{ list_of_pay_item.sayer_ezafat }}</td>
            <td class="text-center">{{ list_of_pay_item.total_payment }}</td>


          </tr>
          </tbody>
          <thead class="style: indigo lighten-1"
          >
          <tr>
            <th colspan="4" class="text-center">بــیـمـه</th>
            <th class="text-center">حق بیمه سهم بیمه شده</th>
            <th class="text-center">معافیت مالیاتی حقوق</th>
            <th class="text-center">حقوق مشمول مالیات</th>
            <th class="text-center"> مالیات حقوق</th>
            <th colspan="3" class="text-center"> بدهی متفرقه</th>
            <th class="text-center"> حقوق و دستمزد پرداختنی</th>
            <th class="text-center"> حق بیمه سهم کارفرما</th>
            <th class="text-center"> بیمه بیکاری</th>

          </tr>

          <tr>
            <td class="text-center"> دستمزد ماهانه </td>
            <td class="text-center">مزایای ماهانه مشمول مستمر و غیر مستمر</td>
            <td class="text-center">جمع دستمزد مزایای ماهانه مشمول </td>
            <td class="text-center">جمع کل دستمزد و مزایای ماهانه </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="text-center">مساعده</td>
            <td class="text-center">وام</td>
            <td class="text-center">غیره</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </thead>
          <tbody
          >
          <tr
          >
          <tr>
            <td class="text-center">{{ list_of_pay_item.get_insurance_monthly_payment}}</td>
            <td class="text-center">{{ list_of_pay_item.get_insurance_monthly_benefit}}</td>
            <td class="text-center">{{ list_of_pay_item.get_insurance_total_included}}</td>
            <td class="text-center">{{ list_of_pay_item.total_payment}}</td>
            <td class="text-center">{{ list_of_pay_item.get_haghe_bime_bime_shavande}}</td>
            <td class="text-center" >{{ list_of_pay_item.get_moaf_sum }}</td>
            <td>{{ list_of_pay_item.get_tax_included }}</td>
            <td>{{ list_of_pay_item.get_month_tax }}</td>
            <td class="text-center">{{ list_of_pay_item.get_dept }}</td>
            <td class="text-center">{{ list_of_pay_item.get_loan }}</td>
            <td class="text-center">{{ list_of_pay_item.get_deduction }}</td>
            <td class="text-center">{{ list_of_pay_item.get_payable }}</td>
            <td class="text-center">{{ list_of_pay_item.get_employer_tax }}</td>
            <td class="text-center">{{ list_of_pay_item.get_un_employer_tax }}</td>

          </tr>

          </tr>
          </tbody>

        </template>s
      </v-simple-table>
      <m-datatable v-show="false"   :headers="headers"  :apiUrl="url" :exportUrl="exportUrl" :filters.sync="export_filter"
                   ref="exportTable">
      </m-datatable>
    </v-card>
  </div>

</template>

<script>

import TenderList from "@/modules/contracting/tender/TenderList";
import {MFormMixin} from "@/components/m-form";
import mtime from "@/components/mcomponents/cleave/Time";
import FormsMixin from "@/mixin/forms";
import FactorMixin from "@/views/panel/factor/mixin";
import TreeSelect from "@/components/selects/TreeSelect";
import {PathLevels, VisitorLevels} from "@/variables";
import citySelect from "@/components/selects/CitySelect";
import MDatatable from "@/components/m-datatable";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";
import SummaryAbsenceList from "@/modules/payroll/absence/SummaryAbsenceList";
import LoanList from "@/modules/payroll/loan/LoanList";


export default {
  name: "ListOfPayItemForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    LoanList,
    SummaryAbsenceList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    loan: {},
  },
  data() {
    return {
      time: null,
      url: 'paylist/item/',
      type: null,
      entitlement: null,
      permissionBasename: "list_of_pay_item",
      exportUrl: "payroll/listOfPayItem/less",
      exportBaseUrl: "payroll/payslip",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      myClass: '',
      PathLevels,
      export_filter : {},
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
      list_of_pay_item: true,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " پرسنل در کارگاه",
          value: "workshop_personnel_display",
        },
        {
          text: "تاریخ",
          value: "pay_date",
        },
        {
          text: "مبلغ کل",
          value: "amount",
        },

        {
          text: "مبلغ هر قسط",
          value: "monthly_pay",
        },
      ];
    },

  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/paylist/item/detail/` + this.$route.params.id + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.list_of_pay_item = data

      }
    })
  },

  methods: {
    to(item) {
      return {
        name: 'LoanDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت وام رد شد', 'warning')
    },
    printPayslip(type) {
      this.export_filter = {id : this.$route.params.id}
      this.exportUrl = 'payroll/payslip'
      this.$refs.exportTable.exportTo(type)

    },


    printInsurance(type) {
      this.export_filter = {id : this.$route.params.id}
      this.exportUrl = 'payroll/person/insurance/report'
      this.$refs.exportTable.exportTo(type)

    },
    printTax(type) {
      this.export_filter = {id : this.$route.params.id}
      this.exportUrl = 'payroll/personTax/report'
      this.$refs.exportTable.exportTo(type)

    },
    printPersonTax(type) {
      this.export_filter = {id : this.list_of_pay_item.workshop_personnel}
      this.exportUrl = 'payroll/diskette/person'
      this.$refs.exportTable.exportTo(type)

    },


  },
}
</script>

<style scoped lang="scss"></style>

