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
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-app-bar-nav-icon
                class=""
                v-bind="attrs"
                v-on="on"
            ></v-app-bar-nav-icon>
          </template>
          <v-list>
            <v-list-item @click="$router.push('/panel/hr_letter/' + list_of_pay_item.hr)">
              <v-list-item-avatar>
                <img :src="endpoint('media/1.jpg')">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>حکم کارگزینی</v-list-item-title>
                <v-list-item-subtitle>برای مشاهده حکم این لیست کلیک کنید</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>fa-eye</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item @click="$router.push('/panel/listOfPayItem/' + list_of_pay_item.list_of_pay)">
              <v-list-item-avatar>
                <img :src="endpoint('media/list.png')">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>لیست حقوق</v-list-item-title>
                <v-list-item-subtitle>برای مشاهده لیست حقوق این ماه کلیک کنید</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>fa-eye</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item @click="$router.push('/panel/workshop_contract/' + list_of_pay_item.contract)">
              <v-list-item-avatar>
                <img :src="endpoint('media/contract.jpg')">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>قرارداد</v-list-item-title>
                <v-list-item-subtitle>برای مشاهده قرارداد این لیست کلیک کنید</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>fa-eye</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item @click="$router.push('/panel/workshop_personnel/' + list_of_pay_item.workshop_personnel)">
              <v-list-item-avatar>
                <img :src="endpoint('media/personnel.png')">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>پرسنل در کارگاه</v-list-item-title>
                <v-list-item-subtitle>برای مشاهده پرسنل در کارگاه این لیست کلیک کنید</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>fa-eye</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-list-item @click="$router.push('/panel/listOfPayItemForm/' + item_id)">
              <v-list-item-avatar>
                <img :src="endpoint('media/pay.png')">
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>حقوق و دستمزد جامع</v-list-item-title>
                <v-list-item-subtitle>برای مشاهده حقوق و دستمزد جامع این لیست کلیک کنید</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon>
                  <v-icon>fa-eye</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>


          </v-list>
        </v-menu>

        <v-toolbar-title class="mr-2"> فیش حقوقی</v-toolbar-title>

        <v-spacer></v-spacer>
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
            class=" grey--text  text--darken-3 export-btn ml-5 mr-1 mt-1 mt-md-0"
            @click="printPayslip('xlsx')"
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
        <v-toolbar-title>   {{ list_of_pay_item.personnel_name }} {{list_of_pay_item.personnel_national_code}} برای حکم {{list_of_pay_item.hr_name}}</v-toolbar-title>

        <v-spacer></v-spacer>
        <span class="ml-2 mr-2"> کارگاه {{ list_of_pay_item.workshop_display }}</span>
        <span class="ml-2 mr-2"> سال {{ list_of_pay_item.year }}</span>
        <span class="ml-2 mr-2"> ماه  {{ list_of_pay_item.month_display }}</span>
      </v-toolbar>
      <v-card>
        <v-row>
          <v-col cols="12" md="4">
            <v-simple-table class="ma-2 mt-5">
              <template v-slot:default>
                <thead class="style: indigo darken-2">
                <tr>
                  <th class="white--text text-center" colspan="2">
                    اطلاعات پایه
                  </th>
                </tr>
                </thead>
                <tbody>
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
                    حداقل مزد روزانه
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.hoghoogh_roozane" disabled="true"></money>
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
                    کارکرد عادی
                  </th>
                  <td>
                    {{ list_of_pay_item.normal_worktime }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    جمع مرخصی استحقاقی
                  </th>
                  <td>
                    {{ list_of_pay_item.get_entitlement_sum }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی استعلاجی
                  </th>
                  <td>
                    {{ list_of_pay_item.get_illness_sum }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی ماده 73
                  </th>
                  <td>
                    {{ list_of_pay_item.matter_47_leave_day }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    مرخصی بدون حقوق
                  </th>
                  <td>
                    {{ list_of_pay_item.get_without_salary_sum }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    غیبت
                  </th>
                  <td>
                    {{ list_of_pay_item.get_absence_sum }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    کارکرد واقعی
                  </th>
                  <td>
                    {{ list_of_pay_item.real_worktime }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    کسر کار (ساعت)
                  </th>
                  <td class="text-center">
                    <v-text-field class="currency-input" v-model="list_of_pay_item.get_kasre_kar_time"
                                  append-icon="fa-clock"
                                  disabled="true"
                    ></v-text-field>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    اضافه کاری (ساعت)
                  </th>
                  <td class="text-center">
                    <v-text-field class="currency-input" v-model="list_of_pay_item.get_ezafe_kari_time"
                                  append-icon="fa-clock"
                                  disabled="true"
                    ></v-text-field>
                  </td>
                </tr>

                <tr>
                  <th class="">
                    تعطیل کاری (ساعت)
                  </th>
                  <td class="text-center">
                    <v-text-field class="currency-input" v-model="list_of_pay_item.get_tatil_kari_time"
                                  append-icon="fa-clock"
                                  disabled="true"
                    ></v-text-field>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    شب کاری (ساعت)
                  </th>
                  <td class="text-center">
                    <v-text-field class="currency-input" v-model="list_of_pay_item.get_shab_kari_time"
                                  append-icon="fa-clock"
                                  disabled="true"
                    ></v-text-field>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.nobat_kari_sob_shab != 0">
                  <th class="">
                    نوبت کاری صبح و شب (روز)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_sob_shab" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.nobat_kari_sob_asr != 0">
                  <th class="">
                    نوبت کاری صبح و عصر (روز)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_sob_asr" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.nobat_kari_asr_shab != 0">
                  <th class="">
                    نوبت کاری عصر و شب (روز)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_asr_shab" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.nobat_kari_sob_asr_shab != 0">
                  <th class="">
                    نوبت کاری صبح، عصر و شب (روز)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.nobat_kari_sob_asr_shab" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="">
                    ماموریت (روز)
                  </th>
                  <td class="text-center">
                    {{ list_of_pay_item.get_mission_sum }}
                  </td>
                </tr>
                <tr>
                  <th class="">
                    تعداد اولاد مشمول
                  </th>
                  <td class="text-center">
                    {{ list_of_pay_item.aele_mandi_child }}
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
                  <th class="white--text text-center" colspan="2">
                    اضافات
                  </th>
                </tr>
                </thead>
                <tbody>
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
                    پایه سنوات ماهانه
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.sanavat_mahane_real_work" disabled="true"></money>
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
                    تعطیل کاری (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.tatil_kari_total" disabled="true"></money>
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

                <tr v-if="list_of_pay_item.nobat_kari_sob_shab != 0">
                  <th class="">
                    نوبت کاری صبح و شب (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_sob_shab_total" disabled="true"></money>
                  </td>
                </tr>

                <tr v-if="list_of_pay_item.nobat_kari_sob_asr != 0">
                  <th class="">
                    نوبت کاری صبح و عصر (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_sob_asr_total" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.nobat_kari_asr_shab != 0">
                  <th class="">
                    نوبت کاری عصر و شب (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_asr_shab_total" disabled="true"></money>
                  </td>
                </tr>
                <tr v-if="list_of_pay_item.nobat_kari_sob_asr_shab != 0">
                  <th class="">
                    نوبت کاری صبح، عصر و شب (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.get_nobat_kari_sob_asr_shab_total" disabled="true"></money>
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
                    <money v-model="list_of_pay_item.info.additions.mahroomiat_tashilat_zendegi"
                           disabled="true"></money>
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
                    <money v-model="list_of_pay_item.info.additions.fogholade_sharayet_mohit_kar"
                           disabled="true"></money>
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
                <tr v-if="list_of_pay_item.info.additions.yarane_ghaza">
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
                    <money v-model="list_of_pay_item.info.additions.mazaya_mostamar_gheyre_naghdi"
                           disabled="true"></money>
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
                    حقوق و مزایای کل ماهانه ناخالص
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
                  <th class="white--text text-center" colspan="3">
                    کسورات
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr class="text-center">
                  <th class="text-center" colspan="2"> حق بیمه سهم بیمه شده</th>
                  <td>
                    <money v-model="list_of_pay_item.get_haghe_bime_bime_shavande" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center" colspan="2"> مالیات حقوق</th>
                  <td>
                    <money v-model="list_of_pay_item.get_month_tax" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="" rowspan="4">
                    بدهی متفرقه
                  </th>
                <tr class="text-center">
                  <th class="text-center"> مساعده</th>
                  <td>
                    <money v-model="list_of_pay_item.get_dept" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center"> وام</th>
                  <td>
                    <money v-model="list_of_pay_item.get_loan" disabled="true"></money>
                  </td>
                </tr>
                <tr class="text-center">
                  <th class="text-center"> غیره</th>
                  <td>
                    <money v-model="list_of_pay_item.get_deduction" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                <tr>
                  <th class="text-center" colspan="2">
                    کسر کار (مبلغ)
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.kasre_kar_total" disabled="true"></money>
                  </td>
                </tr>
                <tr>
                  <th class="text-center" colspan="2">
                    سایر کسورات
                  </th>
                  <td>
                    <money v-model="list_of_pay_item.sayer_kosoorat" disabled="true"></money>
                  </td>
                </tr>

                <tr class="text-center">
                  <th class="text-center" colspan="2"> حقوق و دستمزد پرداختنی</th>
                  <td>
                    <money v-model="list_of_pay_item.get_payable" disabled="true"></money>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>

        </v-row>
      </v-card>
      <m-datatable v-show="false" :headers="headers" :apiUrl="url" :exportUrl="exportUrl" :filters.sync="export_filter"
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
import time_from_decimal from "@/components/scomponents/DecimalToTime";


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";
import SummaryAbsenceList from "@/modules/payroll/absence/SummaryAbsenceList";
import LoanList from "@/modules/payroll/loan/LoanList";


export default {
  name: "PayslipForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    LoanList,
    SummaryAbsenceList,
    mtime,
    TreeSelect,
    citySelect,
    TenderList,
    MDatatable,
    TransactionForm,
    money,
    time_from_decimal,
  },
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
      item_id: this.$route.params.id,
      export_filter: {},
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
      list_of_pay_item: true,
    };
  },
  computed: {
    headers() {
      return [];
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
      this.export_filter = {id: this.$route.params.id}
      this.exportUrl = 'payroll/payslip'
      this.$refs.exportTable.exportTo(type)

    },


    printInsurance(type) {
      this.export_filter = {id: this.$route.params.id}
      this.exportUrl = 'payroll/person/insurance/report'
      this.$refs.exportTable.exportTo(type)

    },
    printTax(type) {
      this.export_filter = {id: this.$route.params.id}
      this.exportUrl = 'payroll/personTax/report'
      this.$refs.exportTable.exportTo(type)

    },
    printPersonTax(type) {
      this.export_filter = {id: this.list_of_pay_item.workshop_personnel}
      this.exportUrl = 'payroll/diskette/person'
      this.$refs.exportTable.exportTo(type)

    },


  },
}
</script>

<style scoped lang="scss"></style>

