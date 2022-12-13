<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="تعریف پرسنل در کارگاه"
            :showList="false"
            :listRoute="{name:'WorkshopPersonnelList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :items.sync="item"
            :canDelete="false"
            :canSubmit="!item.quit_job"
            :can-edit="!item.is_verified"
            :isEditing.sync="isEditing"
            :show-submit-and-clear-btn="false"
            :show-actions="item.personnel"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="WorkshopPersonnelForm"

        >
          <v-toolbar v-if="item.id" class="white--text" color="indigo">
            <v-toolbar-title>
              {{ personnelName }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="red" class="white--text" left @click="settlement('html')" v-if="item.quit_job">
              فرم تسویه
            </v-btn>
            <v-btn left color="indigo lighten-4" @click="balance('html')" class="ml-2 mr-2 indigo--text text--darken-3">
              گردش پرداخت
            </v-btn>

          </v-toolbar>
          <v-col cols="12" md="12" v-if="item.quit_job">
            <v-banner
                class="red white--text"
                elevation="6"
                outlined
                rounded
                single-line
                sticky
            >
              <v-icon
                  class="mr-6 ml-10"
                  color="white"
                  large
              >info
              </v-icon>
              به دلیل اینکه برای پرسنل ترک کار ثبت شده است قادر به ویرایش نمی باشید
            </v-banner>
          </v-col>

          <template>
            <v-row class="mt-3" v-if="!item.id">
              <v-col cols="12" md="6">
                <v-autocomplete
                    :rules="[rules.required,]"
                    v-if="!this.workshop"
                    label="کارگاه"
                    :items="workshops"
                    v-model="item.workshop"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing || item.quit_job"
                />
                <v-text-field
                    label="کارگاه"
                    v-if="this.workshop"
                    disabled="true"
                    v-show="false"
                    v-model="item.workshop = this.workshop"
                ></v-text-field>
                <v-text-field
                    label="کارگاه"
                    v-if="this.workshop"
                    disabled="true"
                    v-model="this.workshop_name "
                ></v-text-field>

              </v-col>
            </v-row>
            <v-row class="mt-3" v-if="!item.id && item.workshop">
              <v-col cols="12" md="4">
                <v-autocomplete
                    :rules="[rules.required,]"
                    v-if="!this.personnel"
                    label="نام  و نام خانوادگی"
                    :items="personnels"
                    v-model="item.personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing || item.quit_job"
                    @change="setValues(item.personnel)"

                />
                <v-text-field
                    label="نام  و نام خانوادگی"
                    v-if="this.personnel"
                    disabled="true"
                    v-show="false"
                    v-model="item.personnel = this.personnel"

                ></v-text-field>
                <v-text-field
                    v-if="this.searchByCode"
                    label="نام  و نام خانوادگی"
                    disabled="true"
                    v-model="personnelName"

                ></v-text-field>
              </v-col>
              <v-col v-if="!item.personnel" cols="12" md="3" @click='nationalDisplaySet(item)'>
                <v-text-field v-on:keypress="NumbersOnly" label="* کد ملی" v-model="national_code"
                              background-color="white"
                              :disabled="!isEditing || !national_code_dis || personnel"/>
              </v-col>
              <v-col cols="12" md="3" v-if="!item.personnel" @click='personnelDisplaySet(item)'>
                <v-text-field v-on:keypress="NumbersOnly" label="* کد پرسنلی " v-model="personnel_code"
                              background-color="white"
                              :disabled="!isEditing || !personnel_code_dis || personnel"/>
              </v-col>
              <v-col v-if="item.personnel" cols="12" md="4">
                <v-text-field v-on:keypress="NumbersOnly" label="* کد ملی" v-model="national_code"
                              background-color="white"
                              :disabled="true"/>
              </v-col>
              <v-col cols="12" md="4" v-if="item.personnel">
                <v-text-field v-on:keypress="NumbersOnly" label="* کد پرسنلی " v-model="personnel_code"
                              background-color="white"
                              :disabled="true"/>
              </v-col>
              <v-col cols="12" md="2" v-if="!item.personnel">
                <v-btn v-if="!personnel" fab color="green" class=" white--text" @click="searchUser">
                  <v-icon>fa-search</v-icon>
                </v-btn>
                <v-btn v-if="!personnel" fab color="red" class="mt-1 mr-1 white--text" @click="setNull">
                  <v-icon>fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-row class="mt-16" v-if="item.personnel">
              <v-col cols="12" md="6">
                <v-autocomplete
                    v-if="item.id"
                    label="کارگاه"
                    :items="workshops"
                    v-model="item.workshop"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    v-if="item.id"
                    label="نام  و نام خانوادگی"
                    :items="personnels"
                    v-model="item.personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing || item.quit_job"
                    @change="setValues(item.personnel)"

                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    :rules="[rules.required,]"
                    v-if="!this.personnel"
                    label="عنوان شغلی(بیمه)"
                    :items="work_titles"
                    v-model="item.work_title"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                    @change="setValues(item.personnel, item.work_title)"
                />

              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NoneNumbersOnly" label="* محل خدمت  "
                              v-model="item.job_location" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    :rules="[rules.required,]"
                    label="* وضعیت کارمند"
                    :items="EMPLOYEE_TYPES"
                    v-model="item.employee_status"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    :rules="[rules.required,]"
                    label="* وضعیت محل کار"
                    :items="JOB_LOCATION_STATUSES"
                    v-model="item.job_location_status"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>


              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly"
                              label="* سابقه بیمه قبلی خارج این کارگاه (ماه) "
                              v-model="item.previous_insurance_history_out_workshop" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly"
                              label="* سابقه بیمه قبلی در این کارگاه (ماه)"
                              v-model="item.previous_insurance_history_in_workshop" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6" v-if="item.id">
                <v-text-field label="* سابقه بیمه جاری در این کارگاه (ماه) "
                              v-model="item.current_insurance_month"
                              background-color="white" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="6" v-if="item.id">
                <v-text-field label="* مجموع سوابق بیمه ای  (ماه) " v-model="item.total_insurance_month"
                              background-color="white" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    ref="title"
                    :rules="[rules.required,]"
                    v-on:keypress="NoneNumbersOnly"
                    label="* سمت یا شغل (دارایی)"
                    v-model="item.job_position"
                    background-color="white"
                    :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    :rules="[rules.required,]"
                    label="* رسته شغلی "
                    :items="JOB_POSITIONS"
                    v-model="item.job_group"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />

              </v-col>


              <v-col cols="12" md="4">
                <v-autocomplete
                    :rules="[rules.required,]"
                    label="* نوع استخدام "
                    :items="EMPLOYMENTS_TYPES"
                    v-model="item.employment_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                    :rules="[rules.required,]"
                    label="* نوع قرارداد"
                    :items="CONTRACT_TYPES"
                    v-model="item.contract_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>

              <v-col cols="12" md="4">
                <date v-model="item.employment_date" label="تاریخ استخدام " :default="false"
                      :disabled="!isEditing || item.quit_job"/>
              </v-col>
            </v-row>
            <v-row class="mt-5" v-if="item.personnel">
              <v-col cols="12" md="12" >
                <v-banner class="mt-3  red--text">
                  <v-avatar
                      slot="icon"
                      color="red"
                      size="25"
                  >
                    <v-icon
                        color="white"
                    >
                      fa-check
                    </v-icon>
                  </v-avatar>
                  برای محاسبه حق سنوات در شناسایی (( علی الحساب  ))  پر کردن دو فیلد زیر لازم است
                </v-banner>
              </v-col>
              <v-col cols="12" md="6" >
                <v-text-field
                    v-on:keypress="NumbersOnly"
                    label=" روز های کارکرد قبل از تعریف "
                    v-model="item.haghe_sanavat_days" background-color="white"
                    :disabled="!isEditing || item.quit_job"/>
              </v-col>

              <v-col cols="12" md="6" >
                <money
                    v-on:keypress="NumbersOnly"
                    label="* مبلغ حق سنوات شناسایی شده "
                    v-model="item.haghe_sanavat_identify_amount"
                    background-color="white"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>
            </v-row>
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyPersonnel(item.id)"
              v-if="item.id && !item.is_verified">ثبت نهایی
          </v-btn>
          <v-btn
              class="red white--text mt-6  mr-2 float-left "
              @click="verifyUnPersonnel(item.id)"
              v-if="item.id && item.is_verified"> خروج از وضعیت نهایی
          </v-btn>
        </m-form>
        <v-row justify="center">
          <v-dialog
              v-model="error_dialog"
              persistent
              max-width="400"
          >
            <v-card>
              <v-card-title class="red--text text-h5">
                ثبت نهایی انجام نشد
              </v-card-title>
              <v-card-text>
                <v-row v-for="item in error_message" class="mt-5 mr-10">
                  {{item}}
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    @click="error_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

      </v-col>
      <v-col cols="12" md="6">
        <summary-workshop-personnel-list></summary-workshop-personnel-list>
      </v-col>
    </v-row>

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
import work_titles from "./bime_title.json"


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";
import {toString} from "lodash";
import SummaryWorkshopPersonnelList from "@/modules/payroll/workshop_personnel/SummaryWorkshopPersonnelList";


export default {
  name: "WorkshopPersonnelForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryWorkshopPersonnelList,
    mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money
  },
  props: {
    id: {},
  },
  data() {
    return {
      work_title: null,
      work_titles: [],
      work_title_code: null,

      WORK_TITLES: work_titles.work_titles,
      CONTRACT_TYPES: [
        {name: ' پاره وقت', value: 2},
        {name: 'تمام وقت', value: 1},
        {name: 'موقت', value: 5},
        {name: 'ساعتی', value: 3},
        {name: 'پیمانی', value: 4},
      ],
      JOB_LOCATION_STATUSES: [
        {name: ' عادی', value: 1},
        {name: 'مناطق کمتر توسعه یافته', value: 2},
        {name: 'مناطق آزاد تجاری', value: 3},
      ],
      EMPLOYMENTS_TYPES: [
        {name: ' پیمانی', value: 4},
        {name: 'قراردادی', value: 1},
        {name: 'َشرکتی', value: 2},
        {name: 'مامور', value: 5},
        {name: 'رسمی', value: 3},
        {name: 'سایر', value: 6},
      ],
      EMPLOYEE_TYPES: [
        {name: ' عادی', value: 1},
        {name: 'جانباز', value: 2},
        {name: 'فرزند شهید', value: 3},
        {name: 'آزاده', value: 4},
        {name: 'نیروهای مسلح', value: 5},
        {name: 'سایر مشمولین بند14 ماده 91', value: 6},
        {name: 'اتباع خارجی مشمول قانون اجتناب از اخذ مالیات مضاعف', value: 7},

      ],
      JOB_POSITIONS: [
        {name: ' آموزشي و فرهنگي', value: 2},
        {name: 'اداري و مالي', value: 1},
        {name: 'اموراجتماعي', value: 3},
        {name: 'درماني و بهداشتي', value: 5},
        {name: 'فناوري اطلاعات ', value: 4},
        {name: 'خدمات', value: 7},
        {name: 'فني و مهندسي', value: 6},
        {name: 'کشاورزی و محيط زيست', value: 8},
        {name: 'تولیدی', value: 13},
        {name: 'تحقیقاتی', value: 15},
        {name: 'کارگری', value: 11},
        {name: 'حراست و نگهبانی', value: 10},
        {name: 'ترابری', value: 12},
        {name: 'بازاریابی و فروش', value: 9},
        {name: 'قضات', value: 17},
        {name: 'انبارداری', value: 16},
        {name: 'کنترل کیفی', value: 14},
        {name: 'هیات علمی', value: 18},
        {name: 'سایر', value: 0},
      ],
      personnel_code: null,
      search_code: null,
      export_url: 'balance/',
      export_filters: [],
      national_code: null,
      national_code_dis: true,
      personnel_code_dis: true,
      printUrl: 'payroll/workshop/personnel/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/workshop/personnel",
      permissionBasename: "workshop_personnel",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      isDefinable: false,
      error_dialog: false,
      error_message: null,
      myClass: '',
      id: this.$route.params.id,
      personnel: this.$route.query.personnel,
      personnels: [],
      workshop: this.$route.query.workshop,
      workshops: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      first: false,
      performClearForm: true,
      searchByCode: false,
      personnelName: null,
      workshop_name: null,
      selected: false,
      cleared: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },

    };
  },
  updated() {
    if (!this.first && this.$route.params.id) {
      this.first = true
      this.isEditing = false
    }
  },

  computed: {
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop",
        },
        {
          text: " پرسنل",
          value: "personnel",
        },
        {
          text: "ّبیمه میشود",
          value: "insurance",
        },
        {
          text: "تاریخ اضافه شدن به لیست بیمه",
          value: "insurance_add_date",
        },
        {
          text: "عنوان شغلی",
          value: "work_title",
        },
        {
          text: " محل خدمت",
          value: "job_location",
        },
        {
          text: "وضعیت محل خدمت",
          value: "job_location_status",
        },
        {
          text: "سابقه بیمه قبلی خارج این کارگاه",
          value: "previous_insurance_history_out_workshop",
        },
        {
          text: "سابقه بیمه قبلی در کارگاه",
          value: "previous_insurance_history_in_workshop",
        },

        {
          text: "سابقه بیمه جاری در کارگاه",
          value: "current_insurance_history_in_workshop",
        },
        {
          text: "مجموع سوابق بیمه ای",
          value: "insurance_history_totality",
        },
        {
          text: "سمت",
          value: "job_position",
        },
        {
          text: "رسته شغلی",
          value: "job_group",
        },
        {
          text: "نوع استخدام",
          value: "employment_type",
        },
        {
          text: "نوع قرارداد",
          value: "contract_type",
        },
        {
          text: "وضعیت کارمند",
          value: "employee_status",
        },
      ];
    },
  },
  mounted() {
    for( let i in this.WORK_TITLES){
      this.work_titles.push(
          {
            'name': this.WORK_TITLES[i]['نام شغل'] + ' ' + this.WORK_TITLES[i]['كــد شغل'],
            'value': this.WORK_TITLES[i]['نام شغل'],
            'code': this.WORK_TITLES[i]['كــد شغل']
          }
      )
    }
    if (this.personnel) {
      this.searchByCode = true
      this.setValues(this.personnel)
    }

    if (this.id) {
      this.request({
        url: this.endpoint(`payroll/workshop/personnel/` + this.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.personnelName = data['personnel_name']
        }
      })
    }

    if (!this.personnel) {
      this.request({
        url: this.endpoint(`payroll/personnel/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.personnels.push({
              'name': data[t].name + ' ' + data[t].last_name,
              'id': data[t].id,
              'national_code': data[t].national_code,
              'personnel_code': data[t].personnel_code,
            })
          }
          console.log(this.personnels)
        }
      })
    }
    if (!this.workshop) {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].code,
              'id': data[t].id,
            })
          }
          console.log(this.workshops)
        }
      })
    }
    if (this.workshop) {
      this.request({
        url: this.endpoint(`payroll/workshop/` + this.workshop + '/'),
        method: "get",
        success: data => {
          this.workshop_name = data.name + ' ' + data.code
        }
      })
    }
  },

  methods: {
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
    NoneNumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        return true;
      } else {
        evt.preventDefault();
        ;
      }
    },

    searchUser(code) {
      if (this.personnel_code) {
        this.request({
          url: this.endpoint(`payroll/personnel/search/` + this.personnel_code + '/'),
          method: "get",
          success: data => {
            this.searchByCode = true
            this.personnel_code = data.personnel_code
            this.national_code = data.national_code
            this.personnel = data.id
            this.personnelName = data.name + ' ' + data.last_name
          }
        })
      } else if (this.national_code) {
        this.request({
          url: this.endpoint(`payroll/personnel/search/` + this.national_code + '/'),
          method: "get",
          success: data => {
            this.searchByCode = true
            this.personnel_code = data.personnel_code
            this.national_code = data.national_code
            this.personnel = data.id
            this.personnelName = data.name + ' ' + data.last_name

          }
        })
      }

    },
    setValues(id, work_title) {
      this.$refs.WorkshopPersonnelForm.$props.items['job_position'] = work_title

      this.request({
        url: this.endpoint(`payroll/personnel/` + id + '/'),
        method: "get",
        success: data => {
          this.personnel_code = data.personnel_code
          this.national_code = data.national_code
          this.personnelName = data.name + ' ' + data.last_name
          this.personnel_code_dis = false
          this.national_code_dis = false
          this.selected = true
        }
      })
    },

    to(item) {
      return {
        name: 'PersonnelFamilyDetail',
        params: {
          id: item.id,
        },
      };
    },
    personnelDisplaySet(item) {
      if (!item.id && !this.personnel && !this.selected) {
        this.national_code_dis = false
        this.personnel_code_dis = true
        this.national_code = null
      }
    },
    setNull(item) {
      if (!item.id && !this.personnel && !this.selected) {
        this.national_code_dis = true
        this.personnel_code_dis = true
        this.national_code = null
        this.personnel_code = null

      }
    },
    nationalDisplaySet(item) {
      if (!item.id && !this.personnel && !this.selected) {
        console.log(this.personnel)
        this.personnel_code_dis = false
        this.national_code_dis = true
        this.personnel_code = null
      }
    },
    balance(type) {
      window.location.href = "http://127.0.0.1:7000/payroll/balance/html?id=" + this.$route.params.id + '&token=' +
          this.token
    },
    settlement(type) {
      window.location.href = "http://127.0.0.1:7000/payroll/settlement/" + this.$route.params.id + '/?token=' +
          this.token
    },
    verifyPersonnel(id) {
      this.request({
        url: this.endpoint(`payroll/workshopPersonnel/verify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  پرسنل در کارگاه نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعییت']
          this.error_dialog = true

        }
      })

    },
    verifyUnPersonnel(id) {
      this.request({
        url: this.endpoint(`payroll/workshopPersonnel/unverify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('پرسنل در کارگاه از نهایی خارج شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })

    },

  }
}

</script>

<style scoped lang="scss"></style>

