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
            :show-navigation-btns="false"
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
          <v-toolbar v-if="item.is_verified" class="rounded-lg" color="back" flat>
            <v-toolbar-title>
              {{ item.personnel_name }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="rounded-lg" depressed left @click="settlement('html')" v-if="item.quit_job">
              فرم تسویه
            </v-btn>
            <v-btn left color="secondary" @click="balance('html')" class="rounded-lg ml-2 mr-2 white--text" depressed>
              گردش پرداخت
            </v-btn>

          </v-toolbar>
          <v-col cols="12" md="12" v-if="item.quit_job">
            <v-banner
                flat
                class="error--text rounded-lg"
                outlined
            >
              <v-icon
                  class="mr-6 ml-10"
                  color="error"
                  large
              >info
              </v-icon>
              به دلیل اینکه برای پرسنل ترک کار ثبت شده است قادر به ویرایش نمی باشید
            </v-banner>
          </v-col>

          <template>
            <v-row class="mt-3">
              <v-col cols="12" md="12">
                <v-autocomplete
                    class="rounded-lg"
                    ref="workshopSelect"
                    label="کارگاه"
                    :items="workshops"
                    v-model="item.workshop"
                    item-text="name"
                    item-value="id"
                    @change="getPersonnel(item.workshop)"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>
            </v-row>

            <v-row class="mt-3" v-if="!item.id && workshop  && !searchByCode && !item.personnel">
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    :rules="[rules.required,]"
                    label="نام  و نام خانوادگی"
                    :items="personnels"
                    v-model="item.personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing || item.quit_job"
                    @change="setValues(item.personnel) ; item.save_leave_limit = 26"

                />
              </v-col>

              <v-col v-if="!item.personnel" cols="12" md="3">
                <v-text-field class="rounded-lg" v-on:keypress="NumbersOnly" label="* کد ملی / فراگیر"
                              v-model="national_code"
                              background-color="white" @keydown="personnel_code = null"/>
              </v-col>

              <v-col cols="12" md="3" v-if="!item.personnel">
                <v-text-field class="rounded-lg" v-on:keypress="NumbersOnly" label="* کد پرسنلی "
                              v-model="personnel_code"
                              background-color="white" @keydown="national_code = null"/>
              </v-col>

              <v-col cols="12" md="2" v-if="!item.personnel">
                <v-btn depressed fab color="success" class=" white--text" @click="searchUser">
                  <v-icon>fa-search</v-icon>
                </v-btn>
                <v-btn depressed fab color="error" class="mt-1 mr-1 white--text" @click="setNull">
                  <v-icon>fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="!item.id && item.workshop && searchByCode">
              <v-col cols="12" md="4">
                <v-text-field class="rounded-lg" label="نام  و نام خانوادگی" v-model="personnelName"
                              :disabled="true" background-color="white"/>
                <v-text-field class="rounded-lg" v-show="false" v-model="item.personnel = personnel"
                              :disabled="true" background-color="white"/>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field class="rounded-lg" label="کد ملی / فراگیر" v-model="national_code"
                              :disabled="true" background-color="white"/>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field class="rounded-lg" label="کد پرسنلی" v-model="personnel_code"
                              :disabled="true" background-color="white"/>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn fab color="error" depressed class=" mr-5 white--text"
                       @click="searchByCode = null ; item.personnel = null ; national_code = null ; personnel_code = null">
                  <v-icon>fa-times</v-icon>
                </v-btn>
              </v-col>

            </v-row>
            <v-row v-if="!item.id && item.workshop && !searchByCode && item.personnel">
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    :rules="[rules.required,]"
                    label="نام  و نام خانوادگی"
                    :items="personnels"
                    v-model="item.personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing || item.quit_job"
                    @change="setValues(item.personnel)"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field class="rounded-lg" label="کد ملی / فراگیر" v-model="national_code"
                              :disabled="true" background-color="white"/>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field class="rounded-lg" label="کد پرسنلی" v-model="personnel_code"
                              :disabled="true" background-color="white"/>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn fab color="error" depressed class=" mr-5 white--text"
                       @click="national_code = null ; personnel_code = null ; item.personnel = null">
                  <v-icon>fa-times</v-icon>
                </v-btn>
              </v-col>

            </v-row>

            <v-row class="" v-if="item.personnel">
              <v-col cols="12" md="12">
                <v-autocomplete
                    class="rounded-lg"
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
                <work-title-select
                    :first_item="item.title"
                    v-model="item.title"
                    :disabled="!isEditing || item.quit_job"
                    :change_func="get_name_from_id"
                ></work-title-select>

              </v-col>
              <v-col cols="12" md="6">
                <v-text-field class="rounded-lg" :rules="[rules.required,]" v-on:keypress="NoneNumbersOnly"
                              label="* محل خدمت  "
                              v-model="item.job_location" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
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
                    class="rounded-lg"
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
                <v-text-field class="rounded-lg" :rules="[rules.required,]" v-on:keypress="NumbersOnly"
                              label="* سابقه بیمه قبلی خارج این کارگاه (ماه) "
                              v-model="item.previous_insurance_history_out_workshop" background-color="white"
                              :disabled="!isEditing || item.quit_job || !is_insurance[item.personnel]"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field class="rounded-lg" :rules="[rules.required,]" v-on:keypress="NumbersOnly"
                              label="* سابقه بیمه قبلی در این کارگاه (ماه)"
                              v-model="item.previous_insurance_history_in_workshop" background-color="white"
                              :disabled="!isEditing || item.quit_job || !is_insurance[item.personnel]"/>
              </v-col>
              <v-col cols="12" md="6" v-if="item.id">
                <v-text-field class="rounded-lg" label="* سابقه بیمه جاری در این کارگاه (ماه) "
                              v-model="item.get_current_insurance"
                              background-color="white" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="6" v-if="item.id">
                <v-text-field class="rounded-lg" label="* مجموع سوابق بیمه ای  (ماه) "
                              v-model="item.total_insurance_month"
                              background-color="white" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    class="rounded-lg"
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
                    class="rounded-lg"
                    :rules="[rules.bool_required,]"
                    label="* رسته شغلی "
                    :items="JOB_POSITIONS"
                    v-model="item.job_group"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />

              </v-col>


              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
                    :rules="[rules.required,]"
                    label="* نوع استخدام "
                    :items="EMPLOYMENTS_TYPES"
                    v-model="item.employment_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
                    :rules="[rules.required,]"
                    label="* نوع قرارداد"
                    :items="CONTRACT_TYPES"
                    v-model="item.contract_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field v-model="item.save_leave_limit"
                              :disabled="!isEditing"
                              class="currency-input rounded-lg"
                              label="حد نصاب مرخصی سالانه"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <date v-model="item.employment_date" label=" * تاریخ استخدام " :default="false"
                      :disabled="!isEditing || item.quit_job"/>
              </v-col>
            </v-row>
            <v-row class="mt-5" v-if="item.personnel">
              <v-col cols="12" md="12">
                <v-banner class="mt-3 rounded-lg error--text" v-if="item.un_editable">
                  <v-avatar
                      slot="icon"
                      color="error"
                      size="40"
                  >
                    <v-icon
                        color="white"
                    >
                      fa-exclamation-triangle
                    </v-icon>
                  </v-avatar>
                  با توجه به اینکه برای این پرسنل حق سنوات علی الحساب شناسایی شده دو فیلد زیر غیر قابل ویرایش می باشد
                </v-banner>

                <v-banner class="mt-3  error--text rounded-lg" v-if="!item.un_editable">
                  <v-avatar
                      slot="icon"
                      color="error"
                      size="25"
                  >
                    <v-icon
                        color="white"
                    >
                      fa-check
                    </v-icon>
                  </v-avatar>
                  برای محاسبه حق سنوات در شناسایی (( علی الحساب )) پر کردن دو فیلد زیر لازم است
                  <v-switch
                      :disabled="!isEditing || item.quit_job  && item.un_editable"
                      class="float-left"
                      v-model="item.sanavat_btn"
                      :true-value="true"
                      :false-value="false"
                      inset
                      color="success"
                      @click="myAlert(item)"
                  ></v-switch>
                </v-banner>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                    class="rounded-lg"
                    v-on:keypress="NumbersOnly"
                    label=" روز های کارکرد قبل از تعریف "
                    ref="day"
                    v-model="item.sanavat_previuos_days" background-color="white"
                    :disabled="!item.sanavat_btn || !isEditing || item.quit_job || item.un_editable"/>
              </v-col>

              <v-col cols="12" md="6">
                <money
                    v-on:keypress="NumbersOnly"
                    label="مبلغ حق سنوات شناسایی شده "
                    ref="amount"
                    v-model="item.sanavat_previous_amount"
                    background-color="white"
                    :disabled="!item.sanavat_btn || !isEditing || item.quit_job || item.un_editable"/>
              </v-col>
            </v-row>
          </template>
          <v-btn
              class="accent rounded-lg white--text mt-6  mr-2 float-left" depressed
              @click="verifyPersonnel(item.id)"
              v-if="item.id && !item.is_verified && !isEditing">ثبت نهایی
          </v-btn>
          <v-btn
              class="error rounded-lg white--text mt-12 mr-2 ml-2 float-left " depressed
              @click="verifyUnPersonnel(item.id)"
              v-if="item.id && item.is_verified && !item.unverifiable"> خروج از وضعیت نهایی
          </v-btn>
          <v-btn
              class="error rounded-lg white--text mt-12 mr-2 ml-2 float-left " depressed
              @click="unverify_dialog = true"
              v-if="item.id && item.is_verified && item.unverifiable"> خروج از وضعیت نهایی
          </v-btn>

        </m-form>
        <v-row justify="center">
          <v-dialog
              v-model="error_dialog"
              persistent
              @click:outside="error_dialog=false"
              max-width="400"
              class="rounded-lg"
          >
            <v-card class="rounded-lg">
              <v-card-title class="error--text text-h5">
                لطفا موارد زیر را تکمیل یا اصلاح کنید!

              </v-card-title>
              <v-card-text>
                <v-row v-for="item in error_message" class="mt-5 mr-10">
                  {{ item }}
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    text
                    @click="error_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
              v-model="sanavat_dialog"
              persistent
              @click:outside="sanavat_dialog=false"
              max-width="400"
              class="rounded-lg"

          >
            <v-card class="rounded-lg"
            >
              <v-card-title class="error--text text-h5">
                توجه!
              </v-card-title>
              <v-card-text>
                اگر از روش قطعی استفاده می کنید و حق سنوات را تسویه نموده اید، نیازی به تکمل فیلد های زیر نیست
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    text
                    @click="sanavat_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row justify="center">
          <v-dialog
              class="rounded-lg"
              v-model="unverify_dialog"
              persistent
              @click:outside="unverify_dialog=false"
              max-width="500"
          >
            <v-card class="rounded-lg">
              <v-card-title class="error--text text-h5">
                خطا!
              </v-card-title>
              <v-card-text>
                با توجه به اینکه برای این پرسنل قرارداد نهایی صادر شده نمیتوانید آنرا غیر نهایی کنید
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    text
                    @click="unverify_dialog = false"
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
import work_titles from "./bime.json"


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";
import {toString} from "lodash";
import SummaryWorkshopPersonnelList from "@/modules/payroll/workshop_personnel/SummaryWorkshopPersonnelList";
import workTitleSelect from "@/components/scomponents/WorkTitleSelect";


export default {
  name: "WorkshopPersonnelForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryWorkshopPersonnelList,
    mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money, workTitleSelect
  },
  props: {
    id: {},
  },
  data() {
    return {
      test_val: 'fist',
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
      sanavat_dialog: false,
      baseUrl: "payroll/workshop/personnel",
      permissionBasename: "workshop_personnel",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      dont_loop: true,
      hasLock: false,
      isDefinable: false,
      error_dialog: false,
      sanava_disable: true,
      error_message: null,
      myClass: '',
      id: this.$route.params.id,
      personnel: this.$route.query.personnel,
      personnels: [],
      workshop: null,
      workshops: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      unverify_dialog: false,
      payment: '',
      first: false,
      performClearForm: true,
      searchByCode: false,
      personnelName: null,
      workshop_name: null,
      is_insurance: {},
      selected: false,
      cleared: false,
      rules: {
        required: value => !!value || 'Required.',
        bool_required: value => value != null || 'Required.',
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
      return [];
    },
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/workshop/`),
      method: "get",
      success: data => {
        console.log(data);
        for (let t in data) {
          this.workshops.push({
            'name': data[t].name + ' ' + data[t].workshop_code,
            'id': data[t].id,
          })
        }
        console.log(this.workshops)
      }
    })
    if (this.$route.params.id) {
      this.personnel = []
      this.request({
        url: this.endpoint(`payroll/personnel/`),
        method: "get",
        success: data => {
          this.personnels = []
          for (let t in data) {
            this.personnels.push({
              'name': data[t].name + ' ' + data[t].last_name,
              'id': data[t].id,
              'national_code': data[t].national_code,
              'personnel_code': data[t].personnel_code,
            })
            this.is_insurance[data[t].id] = data[t].insurance

          }
          console.log(this.is_insurance)
        }
      })
    } else {
      this.request({
        url: this.endpoint(`payroll/workshop/default/`),
        method: "get",
        success: data => {
          this.$refs.workshopSelect.$props.value = data.id
          this.$refs.WorkshopPersonnelForm.$props.items['workshop'] = data.id
          console.log(this.$refs.workshopSelect.$props.value)
          this.workshop = this.$refs.workshopSelect.$props.value
          this.getPersonnel(data.id)
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
    myAlert(item) {
      if (item.sanavat_btn) {
        this.sanavat_dialog = true
      } else {
        this.$refs.WorkshopPersonnelForm.$props.items['sanavat_previuos_days'] = undefined
        this.$refs.WorkshopPersonnelForm.$props.items['sanavat_previous_amount'] = undefined

      }

    },
    get_name_from_id(work_title) {
      this.request({
        url: this.endpoint(`payroll/workTitle/` + work_title + '/'),
        method: "get",
        success: data => {
          this.setChange(data['name'])
        }
      })
    },
    setChange(work_title) {
      console.log(work_title)
      this.$refs.WorkshopPersonnelForm.$props.items['job_position'] = work_title
      this.$refs.title._props.value = work_title
      console.log(this.$refs.WorkshopPersonnelForm.$props.items['job_position'])

    },
    show(item) {
      console.log(item)
    },

    setValues(id) {
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
    setNull(item) {
      this.searchByCode = false
      this.national_code_dis = true
      this.personnel_code_dis = true
      this.national_code = null
      this.personnel_code = null
      this.personnel = null
      this.personnelName = null

    },
    balance(type) {
      window.location.href = "http://188.121.108.201:40/payroll/balance/html?id=" + this.$route.params.id + '&token=' +
          this.token
    },
    settlement(type) {
      window.location.href = "http://188.121.108.201:40/payroll/settlement/" + this.$route.params.id + '/?token=' +
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
          this.error_message = data.response.data['وضعیت']
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
    getPersonnel(id) {
      this.workshop = id
      this.personnel = []
      this.request({
        url: this.endpoint(`payroll/personnel/not/workshop/` + id + '/'),
        method: "get",
        success: data => {
          this.personnels = []
          for (let t in data) {
            this.personnels.push({
              'name': data[t].name + ' ' + data[t].last_name,
              'id': data[t].id,
              'national_code': data[t].national_code,
              'personnel_code': data[t].personnel_code,
            })
            this.is_insurance[data[t].id] = data[t].insurance

          }
          console.log(this.is_insurance)
        }
      })
    }

  }
}

</script>

<style scoped lang="scss"></style>

