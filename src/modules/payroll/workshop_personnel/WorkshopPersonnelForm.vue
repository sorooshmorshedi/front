<template>
  <div>
    <m-form
        title="تعریف پرسنل در کارگاه"
        :showList="false"
        :listRoute="{name:'WorkshopPersonnelList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="WorkshopPersonnelForm"

    >

      <template>
        <v-row class="mt-3">
          <v-col cols="12" md="2">
            <v-autocomplete
                v-if="!this.workshop"
                label="کارگاه"
                :items="workshops"
                v-model="item.workshop"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
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

          <v-col cols="12" md="2">
            <v-autocomplete
                v-if="!this.personnel"
                label="نام  و نام خانوادگی"
                :items="personnels"
                v-model="item.personnel"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
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
                label="نام  و نام خانوادگی"
                v-if="this.searchByCode"
                disabled="true"
                v-model="personnelName"

            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3"  @click='nationalDisplaySet(item)'>
            <v-text-field label="* کد ملی"  v-model="national_code" background-color="white"
                          :disabled="!isEditing || !national_code_dis || personnel"/>
          </v-col>
          <v-col cols="12" md="3" @click='personnelDisplaySet(item)'>
            <v-text-field label="* کد پرسنلی "  v-model="personnel_code" background-color="white"
                          :disabled="!isEditing || !personnel_code_dis || personnel"/>
          </v-col>
          <v-col cols="12" md="1">
            <v-btn v-if="!personnel"  color="red" class="justify-center white--text"  @click="setNull"> خالی کردن</v-btn>
          </v-col>          <v-col cols="12" md="1">
            <v-btn v-if="!personnel"  color="green" class="justify-center white--text"  @click="searchUser"> سرچ کنبد</v-btn>
          </v-col>

        </v-row>

        <v-row class="mt-16">
          <v-col cols="12" md="1">
            <v-switch
                class="text-center "
                v-model="item.insurance"
                label='ّبیمه میشود'
                :disabled="!isEditing"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.insurance_add_date" label="تاریخ اضافه شدن به لیست بیمه" :default="true"
                  :disabled="!isEditing"/>
          </v-col>

          <v-col cols="12" md="3">
            <v-text-field label="* عنوان شغلی " v-model="item.work_title" background-color="white"
                          :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* محل خدمت  " v-model="item.job_location" background-color="white"
                          :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* وضعیت محل خدمت "
                :items="JOB_LOCATION_STATUSES"
                v-model="item.job_location_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* سابقه بیمه قبلی خارج این کارگاه "
                          v-model="item.previous_insurance_history_out_workshop" background-color="white"
                          :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* سابقه بیمه قبلی در این کارگاه  "
                          v-model="item.previous_insurance_history_in_workshop" background-color="white"
                          :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* سابقه بیمه جاری در این کارگاه " v-model="item.current_insurance_history_in_workshop"
                          background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* مجموع سوابق بیمه ای  " v-model="item.insurance_history_totality"
                          background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="* سمت یا شغل (دارایی)" v-model="item.job_position" background-color="white"
                          :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
                label="* رسته شغلی "
                :items="JOB_POSITIONS"
                v-model="item.job_group"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />

          </v-col>


          <v-col cols="12" md="3">
            <v-autocomplete
                label="* نوع استخدام "
                :items="EMPLOYMENTS_TYPES"
                v-model="item.employment_type"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-autocomplete
                label="* نوع قرارداد"
                :items="CONTRACT_TYPES"
                v-model="item.contract_type"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* وضعیت کارمند"
                :items="EMPLOYEE_TYPES"
                v-model="item.employee_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>


        </v-row>
      </template>
    </m-form>
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
import {toString} from "lodash";


export default {
  name: "WorkshopPersonnelForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      CONTRACT_TYPES: [
        {name: ' پاره وقت', value: 'p'},
        {name: 'تمام وقت', value: 'f'},
        {name: 'موقت', value: 't'},
        {name: 'ساعتی', value: 'h'},
        {name: 'پیمانی', value: 'c'},
      ],
      JOB_LOCATION_STATUSES: [
        {name: ' معمولی', value: 'nr'},
        {name: 'مناطق کمتر توسعه یافته', value: 'dp'},
        {name: 'مناطق آزاد تجاری', value: 'ft'},
        {name: 'پارک علم و فناوری', value: 'sp'},
      ],
      EMPLOYMENTS_TYPES: [
        {name: ' پیمانی', value: 'c'},
        {name: 'قراردادی', value: 'co'},
        {name: 'َشرکتی', value: 'cr'},
        {name: 'مامور', value: 'fu'},
        {name: 'رسمی', value: 'p'},
        {name: 'سایر', value: 'or'},
      ],
      EMPLOYEE_TYPES: [
        {name: ' معمولی', value: 'nr'},
        {name: 'فرزند شهید', value: 'fc'},
        {name: 'جانباز', value: 'st'},
        {name: 'آزاده', value: 'fr'},
        {name: 'نیروهای مسلح', value: 'ar'},
        {name: 'مشمولین بند چهارده ماده نود و هفت', value: 'bn'},
        {name: 'اتباع خارجی مشمول قانون اجتناب از اخذ مالیات مضاعف', value: 'fo'},
      ],
      JOB_POSITIONS: [
        {name: ' آموزشي و فرهنگي', value: 'st'},
        {name: 'اداري و مالي', value: 'fn'},
        {name: 'اموراجتماعي', value: 'so'},
        {name: 'درماني و بهداشتي', value: 'he'},
        {name: 'اطلاعات فناوري', value: 'it'},
        {name: 'خدمات', value: 'se'},
        {name: 'فني و مهندسي', value: 'en'},
        {name: 'كشاورزي ومحيط زيست', value: 'ar'},
        {name: 'تولیدی', value: 'pr'},
        {name: 'تحقیقاتی', value: 'sr'},
        {name: 'کارگری', value: 'wo'},
        {name: 'حراست و نگهبانی', value: 'sc'},
        {name: 'ترابری', value: 'tr'},
        {name: 'بازاریابی و فروش', value: 'sa'},
        {name: 'قضات', value: 'ju'},
        {name: 'انبارداری', value: 'wa'},
        {name: 'کنترل کیفی', value: 'co'},
        {name: 'هیات علمی', value: 'ma'},
        {name: 'سایر', value: 'ot'},
      ],
      personnel_code: null,
      search_code: null,
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
      hasLock: true,
      isDefinable: true,
      myClass: '',
      personnel: this.$route.query.personnel,
      personnels: [],
      workshop: this.$route.query.workshop,
      workshops: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
      searchByCode: false,
      personnelName: null,
      workshop_name: null,
      selected: false,
      cleared: false,
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
    if (this.personnel) {
      this.searchByCode = true
      this.setValues(this.personnel)
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
    personnelDisplaySet(item) {
      if(!item.id && !this.personnel && !this.selected) {
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
      if(!item.id && !this.personnel && !this.selected) {
        console.log(this.personnel)
        this.personnel_code_dis = false
        this.national_code_dis = true
        this.personnel_code = null
      }
    },
  }
}

</script>

<style scoped lang="scss"></style>

