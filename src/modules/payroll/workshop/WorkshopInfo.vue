<template>
  <div>
    <v-card
        elevation="2"
        class="ma-5 pa-1 rounded"
    >
      <v-toolbar
          color="indigo"
          dark
      >
        <v-app-bar-nav-icon
            @click="$router.push('/panel/setting/' + workshop.id)"

        ></v-app-bar-nav-icon>

        <v-toolbar-title>کارگاه {{ workshop.name }} {{ workshop.workshop_code }}</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-dialog
            max-width="900"
            hide-overlay
            transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="primary  mr-2 rounded white--text "
                large
                v-bind="attrs"
                v-on="on"
            >
              <v-icon class="ml-2">
                fa-search
              </v-icon>
              گزارش جامع مرخصی
            </v-btn>

          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar
                  color="green darken-2"
                  dark
              > گزارش جامع مرخصی کارگاه {{ workshop.name }} {{ workshop.code }}
              </v-toolbar>
              <v-card-text class="pa-5">
                <v-text-field
                    class="currency-input"
                    color="blue"
                    label="سال"
                    v-model="year"
                    background-color="white"
                />
              </v-card-text>

              <v-container fluid class="pa-5">
                <v-select
                    v-model="months"
                    :items="MONTHS"
                    item-text="name"
                    item-value="value"
                    label="انتخاب ماه"
                    multiple
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                        ripple
                        @mousedown.prevent
                        @click="toggle"
                    >
                      <v-list-item-action>
                        <v-icon :color="months.length > 0 ? 'blue darken-4' : ''">
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          انتخاب همه
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:append-item>
                    <v-divider class="mb-2"></v-divider>
                    <v-list-item disabled>
                      <v-list-item-avatar color="grey lighten-3">
                        <v-icon>
                          fa-plus
                        </v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content v-if="getAllMonth">
                        <v-list-item-title>
                          همه ماه ها
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-content v-else-if="getSomeMonth">
                        <v-list-item-title>
                          تعداد ماه
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ months.length }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-content v-else>
                        <v-list-item-title>
                          ماه انتخاب نشده
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          برای گزارش حداقل یک ماه نیاز است
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-container>
              <v-card-actions class="justify-end mt-16 mb-5">
                <v-btn
                    color="green"
                    class="white--text"
                    large
                    @click="dialog.value = false ; reportAbsence()"
                >گزارش
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>


        <v-dialog
            max-width="900"
            hide-overlay
            transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="primary  mr-2 rounded white--text "
                large
                v-bind="attrs"
                v-on="on"
            >
              <v-icon class="ml-2">
                fa-search
              </v-icon>
              گزارش جامع ذخیره مزایای مرخصی
            </v-btn>

          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar
                  color="green darken-3"
                  dark
              > گزارش جامع ذخیره مزایای مرخصی کارگاه {{ workshop.name }} {{ workshop.code }}
              </v-toolbar>
              <v-card-text class="pa-5">
                <v-text-field
                    class="currency-input"
                    color="blue"
                    label="سال"
                    v-model="year"
                    background-color="white"
                />
              </v-card-text>

              <v-container fluid class="pa-5">
                <v-select
                    v-model="months"
                    :items="MONTHS"
                    item-text="name"
                    item-value="value"
                    label="انتخاب ماه"
                    multiple
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                        ripple
                        @mousedown.prevent
                        @click="toggle"
                    >
                      <v-list-item-action>
                        <v-icon :color="months.length > 0 ? 'blue darken-4' : ''">
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          انتخاب همه
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:append-item>
                    <v-divider class="mb-2"></v-divider>
                    <v-list-item disabled>
                      <v-list-item-avatar color="grey lighten-3">
                        <v-icon>
                          fa-plus
                        </v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content v-if="getAllMonth">
                        <v-list-item-title>
                          همه ماه ها
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-content v-else-if="getSomeMonth">
                        <v-list-item-title>
                          تعداد ماه
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ months.length }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-content v-else>
                        <v-list-item-title>
                          ماه انتخاب نشده
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          برای گزارش حد اقل یک ماه نیاز است
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-container>
              <v-card-actions class="justify-end mt-16 mb-5">
                <v-btn
                    color="green"
                    class="white--text"
                    large
                    @click="dialog.value = false ; reportSaveAbsence()"
                >گزارش
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>


        <v-dialog
            max-width="900"
            hide-overlay
            transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="primary  mr-2 rounded white--text "
                large
                v-bind="attrs"
                v-on="on"
            >
              <v-icon class="ml-2">
                fa-search
              </v-icon>
              گزارش جامع عیدی و پاداش
            </v-btn>

          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar
                  color="green darken-2"
                  dark
              > گزارش جامع عیدی و پاداش {{ workshop.name }} {{ workshop.code }}
              </v-toolbar>
              <v-card-text class="pa-5">
                <v-text-field
                    class="currency-input"
                    color="blue"
                    label="سال"
                    v-model="year"
                    background-color="white"
                />
              </v-card-text>

              <v-container fluid class="pa-5">
                <v-select
                    v-model="months"
                    :items="MONTHS"
                    item-text="name"
                    item-value="value"
                    label="انتخاب ماه"
                    multiple
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                        ripple
                        @mousedown.prevent
                        @click="toggle"
                    >
                      <v-list-item-action>
                        <v-icon :color="months.length > 0 ? 'blue darken-4' : ''">
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          انتخاب همه
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:append-item>
                    <v-divider class="mb-2"></v-divider>
                    <v-list-item disabled>
                      <v-list-item-avatar color="grey lighten-3">
                        <v-icon>
                          fa-plus
                        </v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content v-if="getAllMonth">
                        <v-list-item-title>
                          همه ماه ها
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-content v-else-if="getSomeMonth">
                        <v-list-item-title>
                          تعداد ماه
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ months.length }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-content v-else>
                        <v-list-item-title>
                          ماه انتخاب نشده
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          برای گزارش حداقل یک ماه نیاز است
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-container>
              <v-card-actions class="justify-end mt-16 mb-5">
                <v-btn
                    color="green"
                    class="white--text"
                    large
                    @click="dialog.value = false ; reportEydi()"
                >گزارش
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-dialog
            max-width="900"
            hide-overlay
            transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                class="primary  mr-2 rounded white--text "
                large
                v-bind="attrs"
                v-on="on"
            >
              <v-icon class="ml-2">
                fa-search
              </v-icon>
              گزارش جامع حق سنوات
            </v-btn>

          </template>
          <template v-slot:default="dialog">
            <v-card>
              <v-toolbar
                  color="green darken-2"
                  dark
              > گزارش جامع حق سنوات {{ workshop.name }} {{ workshop.code }}
              </v-toolbar>
              <v-card-text class="pa-5">
                <v-text-field
                    class="currency-input"
                    color="blue"
                    label="سال"
                    v-model="year"
                    background-color="white"
                />
              </v-card-text>

              <v-container fluid class="pa-5">
                <v-select
                    v-model="months"
                    :items="MONTHS"
                    item-text="name"
                    item-value="value"
                    label="انتخاب ماه"
                    multiple
                >
                  <template v-slot:prepend-item>
                    <v-list-item
                        ripple
                        @mousedown.prevent
                        @click="toggle"
                    >
                      <v-list-item-action>
                        <v-icon :color="months.length > 0 ? 'blue darken-4' : ''">
                          {{ icon }}
                        </v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          انتخاب همه
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template v-slot:append-item>
                    <v-divider class="mb-2"></v-divider>
                    <v-list-item disabled>
                      <v-list-item-avatar color="grey lighten-3">
                        <v-icon>
                          fa-plus
                        </v-icon>
                      </v-list-item-avatar>

                      <v-list-item-content v-if="getAllMonth">
                        <v-list-item-title>
                          همه ماه ها
                        </v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-content v-else-if="getSomeMonth">
                        <v-list-item-title>
                          تعداد ماه
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ months.length }}
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-content v-else>
                        <v-list-item-title>
                          ماه انتخاب نشده
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          برای گزارش حداقل یک ماه نیاز است
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-select>
              </v-container>
              <v-card-actions class="justify-end mt-16 mb-5">
                <v-btn
                    color="green"
                    class="white--text"
                    large
                    @click="dialog.value = false ; reportHagheSanavat()"
                >گزارش
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>




        <v-btn
            class="green darken-2  mr-2 rounded white--text "
            large
            @click="$router.push('/panel/workshopSetting/' + workshop.id)"
        >
          <v-icon class="ml-2">
            fa-cogs
          </v-icon>
          تنظیمات کارگاه
        </v-btn>

      </v-toolbar>
      <v-simple-table
          class="ma-2 mt-5"
      >
        <template v-slot:default>
          <thead class="style: indigo darken-2">

          <tr>
            <th
                class="text-center"
                colspan="13">
              <h2 class="white--text"
              >پــرسـنـل کــارگــاه </h2>
            </th>
          </tr>
          </thead>
          <thead class="style: indigo lighten-1"
          >
          <tr>
            <th class="text-center white--text">
              نام و نام خانوادگی
            </th>
            <th class="text-center white--text">
              شماره ملی
            </th>
            <th class="text-center white--text">
              جنسیت
            </th>
            <th class="text-center white--text">
              وضعیت تاهل
            </th>
            <th class="text-center white--text">
              شماره موبایل
            </th>
            <th class="text-center white--text">
              عنوان شغلی
            </th>
            <th class="text-center white--text">
              رسته شغلی
            </th>
            <th class="text-left" colspan="9">
            </th>
          </tr>
          </thead>
          <tbody
          >
          <tr
              v-for="item in personnel"
              :key="item.id"
          >
            <td class="text-center" @click="goToPersonnel(item.id)" >{{ item.personnel_name }}</td>
            <td class="text-center" @click="goToPersonnel(item.id)" >{{ item.personnel_identity_code }}</td>
            <td class="text-center" @click="goToPersonnel(item.id)" >{{ item.gender_display }}</td>
            <td class="text-center" @click="goToPersonnel(item.id)" >{{ item.marital_display }}</td>
            <td class="text-center" @click="goToPersonnel(item.id)" >{{ item.mobile_number }}</td>
            <td class="text-center" @click="goToPersonnel(item.id)">{{ item.work_title }}</td>
            <td class="text-center" @click="goToPersonnel(item.id)">{{ item.job_group_display }}</td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-3"
                  color="yellow darken-2 "
                  @click="$router.push('/panel/absence')"
              >
                مرخصی یا غیبت
              </v-btn>

            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-3"
                  color="yellow darken-2 "
                  @click="$router.push('/panel/mission')"
              >
                ماموریت
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-3"
                  color="yellow darken-2 "
                  @click="$router.push('/panel/loan')"
              >
                ثبت مساعده یا وام
              </v-btn>

            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-3"
                  color="yellow darken-2 "
                  @click="$router.push('/panel/deduction')"
              >
                ثبت کسورات اختیاری
              </v-btn>

            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded white--text"
                  color="blue darken-2 "
                  @click="$router.push('/panel/workshop_contract')"
              >
                ثبت قرارداد
              </v-btn>

            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded white--text"
                  color="blue darken-2 "
                  @click="$router.push('/panel/personnel_family')"
              >
                ثبت خانواده
              </v-btn>

            </td>

          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-simple-table class="mt-16 ma-2">
        <template>
          <thead class="style: indigo darken-2">

          <tr>
            <th
                class="text-center"
                colspan="11">
              <h2 class="white--text"
              >ردیـف پـیـمان های کــارگــاه </h2>
            </th>
            <th class="text-left pa-2">
            </th>
          </tr>
          </thead>

          <thead class="style: indigo lighten-1"
          >
          <tr>
            <th class="text-center white--text">
              ردیف پیمان
            </th>
            <th class="text-center white--text">
              شماره قرارداد
            </th>
            <th class="text-center white--text">
              تاریخ قرارداد
            </th>
            <th class="text-center white--text">
              تاریخ شروع قرارداد
            </th>
            <th class="text-center white--text">
              تاریخ پایان قرارداد
            </th>
            <th class="text-center white--text">
              شناسه ملی واگذار کننده
            </th>
            <th class="text-center white--text">
              نام واگذار کننده
            </th>
            <th class="text-center white--text">
              کد کارگاه واگذار کننده
            </th>
            <th class="text-center white--text">
              شعبه
            </th>
            <th class="text-center white--text">
              مبلغ اولیه قرارداد
            </th>
            <th class="text-center white--text">
              وضعیت
            </th>
            <th class="text-center white--text">
              نهایی
            </th>
          </tr>
          </thead>
          <tbody
          >
          <tr
              v-for="item in contractRows"
              :key="item.id"
              @click="goToContractRow(item.id)"
          >
            <td class="text-center">{{ item.contract_row }}</td>
            <td class="text-center">{{ item.contract_number }}</td>
            <td class="text-center">{{ item.registration_date }}</td>
            <td class="text-center">{{ item.from_date }}</td>
            <td class="text-center">{{ item.to_date }}</td>
            <td class="text-center">{{ item.assignor_national_code }}</td>
            <td class="text-center">{{ item.assignor_name }}</td>
            <td class="text-center">{{ item.assignor_workshop_code }}</td>
            <td class="text-center">{{ item.branch }}</td>
            <td class="text-center">{{ item.round_initial_amount }}</td>
            <td class="text-center">{{ item.get_status_display }}</td>
            <td class="text-center">{{ item.get_verify_display }}</td>
          </tr>
          </tbody>

        </template>
      </v-simple-table>
    </v-card>
    <m-datatable v-show="false"   :headers="headers"  :apiUrl="url" :exportUrl="report_url" :filters.sync="report_filter"
                 ref="exportTable">
      <template #item.detail="{ item }">
        <detail-link :to="to(item)"/>
      </template>
    </m-datatable>
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
import WorkshopList from "@/modules/payroll/workshop/WorkshopList";
import SummaryWorkshopList from "@/modules/payroll/workshop/SummaryWorkshopList";


export default {
  name: "WorkshopInfo",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryWorkshopList,
    WorkshopList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money
  },
  props: {
    id: {},
  },
  data() {
    return {
      MONTHS: [
        {name: ' فروردین', value: '01'},
        {name: ' اردیبهشت', value: '02'},
        {name: ' خرداد', value: '03'},
        {name: ' تیر', value: '04'},
        {name: ' مرداد', value: '05'},
        {name: ' شهریور', value: '06'},
        {name: ' مهر', value: '07'},
        {name: ' آبان', value: '08'},
        {name: ' آذر', value: '09'},
        {name: ' دی', value: '10'},
        {name: ' بهمن', value: '11'},
        {name: ' اسفند', value: '12'},
      ],

      year: 1401,
      report_url: 'payroll/absence/report/',
      report_filter: [],
      months: [],
      months_string: '',
      show_contract_row: false,
      show_personnel: true,
      workshop: null,
      personnel: null,
      contractRows: null,
      workshopId: this.$route.query.workshop,
      permissionBasename: "workshop",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      myClass: '',
      factors: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
    };
  },

  computed: {
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop",
        },
        {
          text: "ماه",
          value: "month",
        },
      ];
    },

    getAllMonth () {
      return this.months.length === this.MONTHS.length
    },
    getSomeMonth () {
      return this.months.length > 0 && !this.getAllMonth
    },
    icon () {
      if (this.getAllMonth) return 'fa-check-square'
      if (this.getSomeMonth) return 'fa-check-square'
      return 'fa-square'
    },
  },

  mounted() {
    this.request({
      url: this.endpoint(`payroll/workshop/` + this.workshopId + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.workshop = data
      }
    })

    this.request({
      url: this.endpoint(`payroll/workshop/workshop_personnel/` + this.workshopId + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.personnel = data
      }
    })


    this.request({
      url: this.endpoint(`payroll/workshop/contract/row/` + this.workshopId + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.contractRows = data
      }
    })


  },
  methods: {
    to(item) {
      return {
        name: 'WorkshopDetail',
        params: {
          id: item.id,
        },
      };
    },
    addContractRow(item) {
      this.$router.push('/panel/contract_row' + '?workshop=' + item.id)
    },
    absenceReport() {
      let selected_months = this.months.sort()
      for( let month in selected_months ){
        this.months_string += selected_months[month]
      }
      this.report_url= 'payroll/absence/report/' + this.year + '/' + this.months_string + '/'
      console.log(this.report_url)

    },
    setting(item) {
      this.$router.push('/panel/setting/' + item.id)
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کارگاه رد شد', 'warning')
    },
    toggle () {
      this.$nextTick(() => {
        if (this.getAllMonth) {
          this.months = []
        } else {
          this.months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        }
      })
    },
    reportSaveAbsence() {
      let selected_months = this.months.sort()
      for( let month in selected_months ){
        this.months_string += selected_months[month]
      }
      this.report_url= 'payroll/saveLeave/report/' + this.year + '/' + this.months_string + '/'
      this.report_filter = {id : this.$route.query.workshop}
      this.$refs.exportTable.exportTo('')
      this.months_string = ''
      this.months = []

    },
    reportAbsence() {
      let selected_months = this.months.sort()
      for( let month in selected_months ){
        console.log(selected_months[month])
        this.months_string += selected_months[month]
      }
      this.report_url= 'payroll/absence/report/' + this.year + '/' + this.months_string + '/'
      this.report_filter = {id : this.$route.query.workshop}
      this.$refs.exportTable.exportTo('')
      this.months_string = ''
      this.months = []

    },

    reportEydi() {
      let selected_months = this.months.sort()
      for( let month in selected_months ){
        this.months_string += selected_months[month]
      }
      this.report_url= 'payroll/eydi/report/' + this.year + '/' + this.months_string + '/'
      this.report_filter = {id : this.$route.query.workshop}
      this.$refs.exportTable.exportTo('')
      this.months_string = ''
      this.months = []

    },
    goToContractRow(id){
      this.$router.push('/panel/contract_row/' + id + '/')
    },
    goToPersonnel(id){
      this.$router.push('/panel/workshop_personnel/' + id + '/')
    },

    reportHagheSanavat() {
      console.log(' okeye ??')
      let selected_months = this.months.sort()
      for( let month in selected_months ){
        this.months_string += selected_months[month]
      }
      this.report_url= 'payroll/sanavat/report/' + this.year + '/' + this.months_string + '/'
      this.report_filter = {id : this.$route.query.workshop}
      this.$refs.exportTable.exportTo('')
      this.months_string = ''
      this.months = []

    }


  },
}
</script>

<style>

@page {
  size: auto;
  margin: 20mm;
}

.nowrap {
  white-space: nowrap;
}
</style>
