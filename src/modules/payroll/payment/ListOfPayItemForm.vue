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
      <v-card>
        <v-row>
          <v-col cols="12" md="4">
            <v-simple-table class="ma-2 mt-5">
              <template v-slot:default>
                <thead class="style: indigo darken-2">
                <tr>
                  <th class="white--text">
                    عنوان
                  </th>
                  <th>

                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th class="">
                    نام و نام خانوادگی
                  </th>
                  <td>
                    {{ list_of_pay_item.personnel_name }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    تاریخ شروع به کار
                  </th>
                  <td>
                    {{ list_of_pay_item.start_date }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    تاریخ تسویه
                  </th>
                  <td>
                    -
                  </td>
                </tr>
                <tr>
                  <th class="">
                    عنوان شغل
                  </th>
                  <td>
                    {{ list_of_pay_item.work_title }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    بیمه میشود
                  </th>
                  <td>
                    <span v-if="list_of_pay_item.is_insurance == 'y'"> بلی</span>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    سابقه بیمه در کارگاه
                  </th>
                  <td>
                    {{list_of_pay_item.get_insurance_in_workshop}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    ردیف پیمان
                  </th>
                  <td>
                    {{list_of_pay_item.contract_row}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    کارکرد عادی
                  </th>
                  <td>
                    {{list_of_pay_item.normal_worktime}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی استحقاقی ساعتی
                  </th>
                  <td>
                    {{list_of_pay_item.hourly_entitlement_leave_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی استحقاقی روزانه
                  </th>
                  <td>
                    {{list_of_pay_item.daily_entitlement_leave_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی استحقاقی جمع
                  </th>
                  <td>
                    {{list_of_pay_item.entitlement_leave_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                     مرخصی استعلاجی
                  </th>
                  <td>
                    {{list_of_pay_item.illness_leave_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی ماده 73
                  </th>
                  <td>
                    {{list_of_pay_item.matter_47_leave_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی بدون حقوق
                  </th>
                  <td>
                    {{list_of_pay_item.without_salary_leave_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    غیبت
                  </th>
                  <td>
                    {{list_of_pay_item.absence_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    کارکرد واقعی
                  </th>
                  <td>
                    {{list_of_pay_item.real_worktime}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    کسر کار (ساعت)
                  </th>
                  <td class="text-center">
                    {{list_of_pay_item.kasre_kar}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    کسر کار (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.kasre_kar_total" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    سایر کسورات
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.sayer_kosoorat" disabled="true"></money>
                  </td>
                </tr>

                </tbody>
              </template>
            </v-simple-table>
          </v-col>


          <v-col cols="12" md="4">
            <v-simple-table class="ma-2 mt-5">
              <template v-slot:default>
                <thead class="style: indigo darken-2">
                <tr>
                  <th class="white--text">
                    عنوان
                  </th>
                  <th>

                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th class="">
                    حداقل مزد روزانه
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.hoghoogh_roozane" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    حقوق پایه ماهانه
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.hoghoogh_mahane_real_work" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    پایه سنوات روزانه
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.sanavat_base " disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    پایه سنوات ماهانه
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.sanavat_mahane_real_work" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    اضافه کاری (ساعت)
                  </th>
                  <td class="text-center">
                    {{list_of_pay_item.ezafe_kari}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    اضافه کاری (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.ezafe_kari_total" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    تعطیل کاری (ساعت)
                  </th>
                  <td class="text-center">
                    {{list_of_pay_item.tatil_kari}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    تعطیل کاری (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.tatil_kari_total" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    شب کاری (ساعت)
                  </th>
                  <td class="text-center">
                    {{list_of_pay_item.shab_kari}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    شب کاری (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.shab_kari_total" disabled="true"></money>
                  </td>
                </tr>

                <tr v-if="list_of_pay_item.nobat_kari_sob_shab">
                  <th class="">
                    نوبت کاری صبح و شب (ساعت)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_sob_shab" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.get_nobat_kari_sob_shab_total">
                  <th class="">
                    نوبت کاری صبح و شب (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_sob_shab_total" disabled="true"></money>
                  </td>
                </tr>

                <tr v-if="list_of_pay_item.nobat_kari_sob_asr">
                  <th class="">
                    نوبت کاری صبح و عصر (ساعت)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_sob_asr" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.get_nobat_kari_sob_asr_total">
                  <th class="">
                    نوبت کاری صبح و عصر (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_sob_asr_total" disabled="true"></money>
                  </td>
                </tr>

                <tr v-if="list_of_pay_item.nobat_kari_asr_shab">
                  <th class="">
                    نوبت کاری عصر و شب (ساعت)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_asr_shab" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.get_nobat_kari_asr_shab_total">
                  <th class="">
                    نوبت کاری عصر و شب (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_asr_shab_total" disabled="true"></money>
                  </td>
                </tr>

                <tr v-if="list_of_pay_item.nobat_kari_sob_asr_shab">
                  <th class="">
                    نوبت کاری صبح، عصر و شب (ساعت)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_sob_asr_shab" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.get_nobat_kari_sob_asr_shab_total">
                  <th class="">
                    نوبت کاری صبح، عصر و شب (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_sob_asr_shab_total" disabled="true"></money>
                  </td>
                </tr>

                <tr>
                  <th class="">
                    ماموریت (روز)
                  </th>
                  <td class="text-center">
                    {{list_of_pay_item.mission_day}}
                  </td>
                </tr>
                <tr>
                  <th class="">
                     ماموریت (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_mission_total" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    تعداد اولاد
                  </th>
                  <td class="text-center">
                    {{list_of_pay_item.aele_mandi_child }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    حق اولاد
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.aele_mandi" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.kharo_bar">
                  <th class="">
                    حق خواروبار
                  </th>
                  <td>
                    <money v-model=" list_of_pay_item.info.additions.kharo_bar" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.hagh_maskan">
                  <th class="">
                    حق مسکن
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.hagh_maskan" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.hagh_jazb">
                  <th class="">
                    حق جذب
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.hagh_jazb" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.hagh_sarparasti">
                  <th class="">
                    حق سرپرستی
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.hagh_sarparasti" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.hagh_modiriat">
                  <th class="">
                    حق مدیریت
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.hagh_modiriat" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.fogholade_shoghl">
                  <th class="">
                    فوق العاده شفل
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.fogholade_shoghl" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.haghe_tahsilat">
                  <th class="">
                    حق تحصیلات
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.haghe_tahsilat" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.fogholade_sakhti_kar">
                  <th class="">
                    فوق العاده سختی کار
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.fogholade_sakhti_kar" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.haghe_ankal">
                  <th class="">
                    حق آنکال
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.haghe_ankal" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.fogholade_badi_abohava">
                  <th class="">
                    فوق العاده بدی آب و هوا
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.fogholade_badi_abohava" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.mahroomiat_tashilat_zendegi">
                  <th class="">
                    فوق العاده محرومیت از تسهیلات زندگی
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.mahroomiat_tashilat_zendegi" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.fogholade_mahal_khedmat">
                  <th class="">
                    فوق العاده محل خدمت
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.fogholade_mahal_khedmat" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.fogholade_sharayet_mohit_kar">
                  <th class="">
                    فوق العاده محیط کار
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.fogholade_sharayet_mohit_kar" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.ayabo_zahab">
                  <th class="">
                    ایاب و ذهاب
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.ayabo_zahab" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.ayabo_zahab">
                  <th class="">
                    یارانه غذا
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.yarane_ghaza" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.haghe_shir">
                  <th class="">
                    حق شیر
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.haghe_shir" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.haghe_taahol">
                  <th class="">
                    حق تاهل
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.haghe_taahol" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.komakhazine_mahdekoodak">
                  <th class="">
                    کمک هزینه مهدکودک
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.komakhazine_mahdekoodak" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.komakhazine_varzesh">
                  <th class="">
                    کمک هزینه ورزش
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.komakhazine_varzesh" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.info.additions.mazaya_mostamar_gheyre_naghdi">
                  <th class="">
                    مزایای مستمر غیر نقدی
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.info.additions.mazaya_mostamar_gheyre_naghdi" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.mazaya_gheyr_mostamar">
                  <th class="">
                    مزایای غیر مستمر غیر نقدی
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.mazaya_gheyr_mostamar" disabled="true"></money>
                  </td>
                </tr>

                <tr>
                  <th class="">
                    حق سنوات
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.haghe_sanavat_total" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    عیدی و پاداش
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.padash_total" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                <tr>
                  <th class="">
                    سایر اضافات
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.sayer_ezafat" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    حقوق مزایای کل ماهانه
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.total_payment" disabled="true"></money>
                  </td>
                </tr>

                </tbody>
              </template>
            </v-simple-table>
          </v-col>

          <v-col cols="12" md="4">
            <v-simple-table class="ma-2 mt-5">
              <template v-slot:default>
                <thead class="style: indigo darken-2">
                <tr>
                <th class="white--text">
                    عنوان
                  </th>
                  <th>

                  </th>
                  <th>

                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                <th class="" rowspan="5">
                  بیمه
                </th>
                <tr class="text-center">
                  <th class="text-center">  دستمزد ماهانه</th>
                  <td>
                    <money v-model="list_of_pay_item.get_insurance_monthly_payment" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center">  مزایای ماهانه مشمول مستمر و غیر مستمر</th>
                  <td>
                    <money v-model="list_of_pay_item.get_insurance_monthly_benefit" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center">  جمع دستمزد و مزایای ماهانه مشمول</th>
                  <td>
                    <money v-model="list_of_pay_item.get_insurance_total_included" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center">  جمع کل دستمزد و مزایای ماهانه</th>
                  <td>
                    <money v-model="list_of_pay_item.total_payment" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2">  حق بیمه سهم بیمه شده</th>
                  <td>
                    <money v-model="list_of_pay_item.get_haghe_bime_bime_shavande" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2">  معافیت مالیاتی حقوق</th>
                  <td>
                    <money v-model="list_of_pay_item.get_moaf_sum" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2">  حقوق مشمول مالیات</th>
                  <td>
                    <money v-model="list_of_pay_item.get_tax_included" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2">  مالیات حقوق</th>
                  <td>
                    <money v-model="list_of_pay_item.get_month_tax" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                <tr>

                  <th class="" rowspan="4">
                    بدهی متفرقه
                  </th>
                <tr class="text-center">
                  <th class="text-center">  مساعده</th>
                  <td>
                    <money v-model="list_of_pay_item.get_dept" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center">  وام</th>
                  <td>
                    <money v-model="list_of_pay_item.get_loan" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center">  غیره</th>
                  <td>
                    <money v-model="list_of_pay_item.get_deduction" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2">  حقوق و دستمزد پرداختنی</th>
                  <td>
                    <money v-model="list_of_pay_item.get_payable" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2">  حق بیمه سهم کارفرما</th>
                  <td>
                    <money v-model="list_of_pay_item.get_employer_tax" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2">  بیمه بیکاری</th>
                  <td>
                    <money v-model="list_of_pay_item.get_un_employer_tax" disabled="true"></money>
                  </td>
                </tr>


                </tbody>
              </template>
            </v-simple-table>
          </v-col>

        </v-row>
      </v-card>
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
      this.notify(' ثبت  رد شد', 'warning')
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

