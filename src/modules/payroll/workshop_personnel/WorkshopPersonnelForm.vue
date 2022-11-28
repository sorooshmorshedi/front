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
            :canDelete="false"

            :canSubmit="!item.quit_job"
            :isEditing.sync="isEditing"
            :show-submit-and-clear-btn="false"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="WorkshopPersonnelForm"

        >
          <v-toolbar  v-if="item.id"  class="white--text" color="indigo">
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

            <m-datatable v-if="item.id" v-show="false" :headers="headers"
                         :apiUrl="export_url" :filters.sync="export_filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                         ref="exportTable">
              <template #item.detail="{ item }">
                <detail-link :to="to(item)" />
              </template>

            </m-datatable>

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
              <v-col cols="12" md="3">
                <v-autocomplete
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

              <v-col cols="12" md="3">
                <v-autocomplete
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
                    label="نام  و نام خانوادگی"
                    v-if="this.searchByCode || personnelName"
                    disabled="true"
                    v-model="personnelName"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2" @click='nationalDisplaySet(item)'>
                <v-text-field label="* کد ملی" v-model="national_code" background-color="white"
                              :disabled="!isEditing || !national_code_dis || personnel"/>
              </v-col>
              <v-col cols="12" md="2" @click='personnelDisplaySet(item)'>
                <v-text-field label="* کد پرسنلی " v-model="personnel_code" background-color="white"
                              :disabled="!isEditing || !personnel_code_dis || personnel"/>
              </v-col>
              <v-col cols="12" md="2">
                <v-btn v-if="!personnel" color="green" class=" white--text" @click="searchUser"> سـرچ کنبد</v-btn>
                <v-btn v-if="!personnel" color="red" class="mt-1 white--text" @click="setNull"> خالی کردن</v-btn>
              </v-col>

            </v-row>

            <v-row class="mt-16">
              <v-col cols="12" md="6">
                <v-text-field label="* عنوان شغلی " v-model="item.work_title" background-color="white"
                              :disabled="!isEditing || item.quit_job "/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="* محل خدمت  " v-model="item.job_location" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
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
                    label="* وضعیت محل کار"
                    :items="JOB_LOCATION_STATUSES"
                    v-model="item.job_location_status"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>


              <v-col cols="12" md="6">
                <v-text-field label="* سابقه بیمه قبلی خارج این کارگاه (ماه) "
                              v-model="item.previous_insurance_history_out_workshop" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="* سابقه بیمه قبلی در این کارگاه (ماه)"
                              v-model="item.previous_insurance_history_in_workshop" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6" v-if="item.id">
                <v-text-field label="* سابقه بیمه جاری در این کارگاه (ماه) "
                              v-model="item.current_insurance_month"
                              background-color="white" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="6"  v-if="item.id" >
                <v-text-field label="* مجموع سوابق بیمه ای  (ماه) " v-model="item.total_insurance_month"
                              background-color="white" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="* سمت یا شغل (دارایی)" v-model="item.job_position" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
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
                    label="* نوع قرارداد"
                    :items="CONTRACT_TYPES"
                    v-model="item.contract_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>

              <v-col cols="12" md="4">
                <date v-model="item.employment_date" label="تاریخ استخدام " :default="false" :disabled="!isEditing || item.quit_job"/>
              </v-col>

            </v-row>
            <v-row class="mt-5">
              <v-col cols="12" md="4">
                <v-banner
                    class=" "
                    elevation="6"
                    outlined
                    rounded
                    single-line
                    sticky
                >
                  <v-icon
                      color="orange"
                      large
                  >info
                  </v-icon>
                  برای محاسبه حق سنوات <br>علی الحساب این دو فیلد لازم است
                </v-banner>
              </v-col>
              <v-col cols="12" md="4" class="mt-3">
                <v-text-field label=" روز های کارکرد قبل از تعریف "
                              v-model="item.haghe_sanavat_days" background-color="white"
                              :disabled="!isEditing || item.quit_job"/>
              </v-col>

              <v-col cols="12" md="4" class="mt-3">
                <money
                    label="* مبلغ حق سنوات شناسایی شده "
                    v-model="item.komakhazine_mobile_amount"
                    background-color="white"
                    :disabled="!isEditing || item.quit_job"
                />
              </v-col>

            </v-row>
          </template>
        </m-form>
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
      CONTRACT_TYPES: [
        {name: ' پاره وقت', value: 2},
        {name: 'تمام وقت', value: 1},
        {name: 'موقت', value: 5},
        {name: 'ساعتی', value: 3},
        {name: 'پیمانی', value: 4},
      ],
      JOB_LOCATION_STATUSES: [
        {name: ' معمولی', value: 1},
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
        {name: ' معمولی', value: 1},
        {name: 'جانباز', value: 2},
        {name: 'فرزند شهید', value: 3},
        {name: 'آزاده', value: 4},
        {name: 'نیروهای مسلح', value: 5},
        {name: 'یر مشمولین بند14 ماده 11', value: 6},
        {name: 'اتباع خارجی مشمول قانون اجتناب از اخذ مالیات مضاعف', value: 7},

      ],
      JOB_POSITIONS: [
        {name: ' آموزشي و فرهنگي', value: 2},
        {name: 'اداري و مالي', value: 1},
        {name: 'اموراجتماعي', value: 3},
        {name: 'درماني و بهداشتي', value: 5},
        {name: 'اطلاعات فناوري', value: 4},
        {name: 'خدمات', value: 7},
        {name: 'فني و مهندسي', value: 6},
        {name: 'كشاورزي ومحيط زيست', value: 8},
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
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/balance"
      this.$refs.exportTable.exportTo(type)
    },
    settlement(type) {
      this.export_filter = {id: this.$route.params.id}
      this.export_url = "payroll/settlement/" + this.$route.params.id
      this.$refs.exportTable.exportTo(type)
    },

  }
}

</script>

<style scoped lang="scss"></style>

