<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت مرخصی یا غیبت"
            :showList="false"
            :listRoute="{name:'AbsenceList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :show-navigation-btns="false"
            :show-submit-and-clear-btn="false"
            :items.sync="item"
            :canSubmit="canSubmit"
            :can-edit="!item.is_verified"
            :isEditing.sync="isEditing"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="AbsenceForm"

        >

          <template>
            <v-row v-if="item.un_editable" >
              <v-col cols="12" md="12">
                <v-banner class="rounded-lg mt-3 mb-5 error--text">
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
                  این غیبت یا مرخصی در محاسبات حقوق استفاده شده و غیر قابل ویرایش می باشد
                </v-banner>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" v-if="!item.id">
                <v-autocomplete
                    class="rounded-lg"
                    label="  کارگاه"
                    :items="workshops"
                    v-model="workshop"
                    item-text="name"
                    ref="workshopSelect"
                    item-value="id"
                    :disabled="!isEditing"
                    @change="getPersonnel(workshop)"
                />
              </v-col>
              <v-col cols="12" md="12" v-if="item.id && !isEditing">
                <v-text-field
                    class="rounded-lg"
                    label="  کارگاه"
                    v-model="item.workshop"
                    :disabled="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" v-if="item.id && isEditing">
                <v-autocomplete
                    class="rounded-lg"
                    label="  کارگاه"
                    :items="workshops"
                    v-model="item.workshop_id"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    @change="getPersonnel(item.workshop_id)"
                />
              </v-col>
            </v-row>

            <v-row v-if="item.workshop_personnel && item.leave_type == 'e'">
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="!item.id"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    @change
                    :disabled="!isEditing || !workshop"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="item.id"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    @change
                    :disabled="!isEditing"
                />
                <v-text-field
                    class="rounded-lg"
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' && marital[item.workshop_personnel] != 'c' && marital[item.workshop_personnel] != 's'"
                    label="نوع"
                    :items="ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' &&  marital[item.workshop_personnel] == 's'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' && marital[item.workshop_personnel] == 'c'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] != 'f'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="item.leave_type == 'e'"
                    label="نوع مرخصی استحقاقی"
                    :items="ENTITLEMENT_LEAVE_TYPES"
                    v-model="item.entitlement_leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </v-col>
            </v-row>


            <v-row v-if="item.workshop_personnel && item.leave_type == 'm'">
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="!this.workshopPersonnel"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    @change
                    :disabled="!isEditing || !workshop"
                />
                <v-text-field
                    class="rounded-lg"
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' && marital[item.workshop_personnel] != 'c' && marital[item.workshop_personnel] != 's'"
                    label="نوع"
                    :items="ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' &&  marital[item.workshop_personnel] == 's'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' && marital[item.workshop_personnel] == 'c'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] !== 'f'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="marital[item.workshop_personnel] != 's' && marital[item.workshop_personnel] != 'c' &&
                     gender[item.workshop_personnel] == 'f' &&
                     item.leave_type == 'm'"
                    label="دلیل مرخصی ماده 73"
                    :items="F_MATTER_73_LEAVE_TYPES"
                    v-model="item.matter73_leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="marital[item.workshop_personnel] != 's' && marital[item.workshop_personnel] != 'c'&&
                     gender[item.workshop_personnel] != 'f' && item.leave_type == 'm'"
                    label="دلیل مرخصی ماده 73"
                    :items="MATTER_73_LEAVE_TYPES"
                    v-model="item.matter73_leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="marital[item.workshop_personnel] == 's' && item.leave_type == 'm'"
                    label="دلیل مرخصی ماده 73"
                    :items="SINGLE_MATTER_73_LEAVE_TYPES"
                    v-model="item.matter73_leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="marital[item.workshop_personnel] == 'c' && item.leave_type == 'm'"
                    label="دلیل مرخصی ماده 73"
                    :items="C_MATTER_73_LEAVE_TYPES"
                    v-model="item.matter73_leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-banner class="mt-3 rounded-lg mb-5 primary--text">
                  <v-avatar
                      slot="icon"
                      color="primary"
                      size="25"
                  >
                    <v-icon
                        color="white"
                    >
                      fa-info
                    </v-icon>
                  </v-avatar>
                  کلیه کارگران در صورت ازدواج دائم، فوت همسر، پدرو مادر و فرزندان می‌توانند از 3 روز مرخصی با حقوق به عنوان
                  </br>
                  مرخصی ازدواج یا مرخصی فوت اقوام درجه یک در قانون کار استفاده کنند (ماده ۷۳).
                </v-banner>
              </v-col>
            </v-row>


            <v-row v-if="item.leave_type != 'e' && item.leave_type != 'm'">
              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="!this.workshopPersonnel"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    @change
                    :disabled="!isEditing || !workshop"
                />
                <v-text-field
                    class="rounded-lg"
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' && marital[item.workshop_personnel] != 'c' && marital[item.workshop_personnel] != 's'"
                    label="نوع"
                    :items="ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' &&  marital[item.workshop_personnel] == 's'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] == 'f' && marital[item.workshop_personnel] == 'c'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || !item.workshop_personnel"
                    @change="setValues(item)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="gender[item.workshop_personnel] != 'f'"
                    label="نوع"
                    :items="MALE_ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || !item.workshop_personnel"
                    @change="setValues(item)"
                />
              </v-col>
            </v-row>

            <v-row
                v-if="item.leave_type != 'e' && item.workshop_personnel"
            >
              <v-col cols="9" md="6">
                <date v-model="item.from_date" label="* از تاریخ" :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="9" md="6">
                <date v-model="item.to_date" label="* تا تاریخ " :default="false" :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row
                v-if="item.leave_type == 'e' && item.entitlement_leave_type != 'h'"

            >
              <v-col cols="9" md="6">
                <date v-model="item.from_date" label="* از تاریخ" :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="9" md="6">
                <date v-model="item.to_date" label="* تا تاریخ " :default="false" :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" v-if="item.leave_type == 'i'"
              >

                <v-text-field class="rounded-lg" label="* علت حادثه" v-model="item.cause_of_incident" background-color="white"
                              :disabled="!isEditing"/>

              </v-col>
            </v-row>
            <v-row
                v-if="item.entitlement_leave_type == 'h' && item.leave_type == 'e' "
            >
              <v-col cols="12" md="4">
                <date v-model="item.date" label="* تاریخ " :default="false" :disabled="!isEditing"/>
              </v-col>

              <v-col
                  cols="12"
                  md="4"
              >
                <mtime
                    label="* از ساعت"
                    v-model="item.from_hour"
                    :disabled="!isEditing"
                ></mtime>
              </v-col>
              <v-col
                  cols="12"
                  md="4"
              >
                <mtime
                    label=" * تا ساعت"
                    v-model="item.to_hour"
                    :disabled="!isEditing"
                ></mtime>
              </v-col>

            </v-row>
            <v-row v-if="item.workshop_personnel">
              <v-col cols="12" md="12">
                <v-text-field class="rounded-lg" label="توضیحات" v-model="item.explanation" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4" v-if="item.id">
                <v-text-field class="rounded-lg" label="مدت مرخصی به روز" v-model="item.time_period" background-color="white"
                              :disabled="true"/>
              </v-col>
              <v-col cols="12" md="4" v-if="item.id && item.entitlement_leave_type == 'h'">
                <v-text-field class="rounded-lg" label="مدت مرخصی به ساعت" v-model="item.by_hour" background-color="white"
                              :disabled="true"/>
              </v-col>
            </v-row>
          </template>
          <v-btn
              class="accent rounded-lg white--text mt-6  mr-2 float-left" depressed
              @click="verifyAbsence(item)"
              v-if="item.id && !item.is_verified && !isEditing">ثبت نهایی
          </v-btn>
          <v-btn
              class="error rounded-lg white--text mt-12 mr-2 ml-2 float-left " depressed
              @click="UnVerifyAbsence(item)"
              v-if="item.id && item.is_verified && !item.un_editable"> خروج از وضعیت نهایی
          </v-btn>

        </m-form>
        <v-row justify="center">
          <v-dialog
              v-model="error_dialog"
              class="rounded-lg"
              persistent
              @click:outside="error_dialog=false"
              max-width="400"
          >
            <v-card class="rounded-lg pa-2">
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
        </v-row>

      </v-col>
      <v-col cols="12" md="6">
        <summary-absence-list></summary-absence-list>
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
import SummaryAbsenceList from "@/modules/payroll/absence/SummaryAbsenceList";


export default {
  name: "AbsenceForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {SummaryAbsenceList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      ABSENCE_TYPES: [
        {name: ' استحقاقی', value: 'e'},
        {name: 'ماده 73', value: 'm'},
        {name: 'استعلاجی', value: 'i'},
        {name: 'بدون حقوق', value: 'w'},
        {name: 'غیبت', value: 'a'},
        {name: 'زایمان', value: 'c'},
      ],
      MALE_ABSENCE_TYPES: [
        {name: ' استحقاقی', value: 'e'},
        {name: 'ماده 73', value: 'm'},
        {name: 'استعلاجی', value: 'i'},
        {name: 'بدون حقوق', value: 'w'},
        {name: 'غیبت', value: 'a'},
      ],
      MATTER_73_LEAVE_TYPES: [
        {name: 'ازدواج', value: 'm'},
        {name: 'مرگ همسر', value: 's'},
        {name: 'مرگ فرزند', value: 'd'},
        {name: 'مرگ پدر یا مادر', value: 'p'},
      ],
      F_MATTER_73_LEAVE_TYPES: [
        {name: 'مرگ همسر', value: 's'},
        {name: 'مرگ فرزند', value: 'd'},
        {name: 'مرگ پدر یا مادر', value: 'p'},
      ],
      C_MATTER_73_LEAVE_TYPES: [
        {name: 'ازدواج', value: 'm'},
        {name: 'مرگ فرزند', value: 'd'},
        {name: 'مرگ پدر یا مادر', value: 'p'},
      ],
      SINGLE_MATTER_73_LEAVE_TYPES: [
        {name: 'ازدواج', value: 'm'},
        {name: 'مرگ پدر یا مادر', value: 'p'},
      ],
      ENTITLEMENT_LEAVE_TYPES: [
        {name: ' ساعتی', value: 'h'},
        {name: 'روزانه', value: 'd'},
      ],
      time: null,
      menu1: false,
      modal2: false,
      printUrl: 'payroll/absence/request',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/absence",
      type: null,
      entitlement: null,
      permissionBasename: "absence",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      workshop: null,
      workshops: [],
      error_dialog: false,
      gender: {},
      marital: {},
      error_message: null,
      hasLock: false,
      isDefinable: false,
      first: false,
      myClass: '',
      workshopPersonnel: this.$route.query.workshop_personnel,
      workshopPersonnels: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },

    };
  },
  computed: {
    headers() {
      return [
        {
          text: " پرسنل در کارگاه",
          value: "workshop_personnel",
        },
        {
          text: "نوع",
          value: "leave_type_display",
        },
        {
          text: "مدت به روز",
          value: "time_period",
        },
      ];
    },
  },
  updated() {
    if (!this.first && this.$route.params.id) {
      this.first = true
      this.isEditing = false
    }
  },

  mounted() {
    if (this.$route.params.id) {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
              'id': data[t].id,
            })
          }

        }
      })
      this.request({
        url: this.endpoint(`payroll/absence/` + this.$route.params.id + '/'),
        method: "get",
        success: data => {
          console.log(data)
          this.request({
            url: this.endpoint(`payroll/workshop/workshop_personnel/` + data.workshop_id + '/'),
            method: "get",
            success: data => {
              this.workshopPersonnels = []
              for (let t in data) {
                this.workshopPersonnels.push({
                  'name': data[t].personnel_name + '  ' + data[t].personnel_identity_code,
                  'id': data[t].id,
                })
                this.marital[data[t].id] = data[t].marital_status
                this.gender[data[t].id] = data[t].gender
              }
            }
          })

        }
      })

    } else {

      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
              'id': data[t].id,
            })

          }

        }
      })

      this.request({
        url: this.endpoint(`payroll/workshop/default/`),
        method: "get",
        success: data => {
          this.workshop = data.id
          this.$refs.workshopSelect.$props.value = data.id
          console.log(this.$refs.workshopSelect.$props)
          console.log(this.$refs.workshopSelect.$props.value)
          this.request({
            url: this.endpoint(`payroll/workshop/workshop_personnel/` + data.id + '/'),
            method: "get",
            success: data => {
              this.workshopPersonnels = []
              for (let t in data) {
                this.workshopPersonnels.push({
                  'name': data[t].personnel_name + '  ' + data[t].personnel_identity_code,
                  'id': data[t].id,
                })
                this.marital[data[t].id] = data[t].personnel_marital
                this.gender[data[t].id] = data[t].personnel_gender
              }
              console.log(this.marital)
              console.log(this.gender)
            }
          })

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

    setValues(item) {
      if (item.leave_type == 'e') {
        this.entitlement = true
      }
      if (item.leave_type !== 'e') {
        this.entitlement = false
        this.$refs.AbsenceForm.$props.items['entitlement_leave_type'] = null
      }
      this.$refs.AbsenceForm.$props.items['matter73_leave_type'] = null
      this.$refs.AbsenceForm.$props.items['from_date'] = null
      this.$refs.AbsenceForm.$props.items['explanation'] = ' '
      this.$refs.AbsenceForm.$props.items['to_date'] = null
      this.$refs.AbsenceForm.$props.items['date'] = null
      this.$refs.AbsenceForm.$props.items['from_hour'] = null
      this.$refs.AbsenceForm.$props.items['to_hour'] = null
      this.$refs.AbsenceForm.$props.items['explanation'] = ' '
      this.$refs.AbsenceForm.$props.items['cause_of_incident'] = ' '

    },

    to(item) {
      return {
        name: 'WorkshopContractDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت مرخصی یا غیبت رد شد', 'warning')
    },
    verifyAbsence(item) {
      this.request({
        url: this.endpoint(`payroll/absence/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  مرخصی یا غیبت نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

        }
      })

    },
    UnVerifyAbsence(item) {
      this.request({
        url: this.endpoint(`payroll/absence/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('مرخصی یا غیبت از نهایی خارج شد', 'success')
          this.to(item)
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },
    getPersonnel(id) {
      this.request({
        url: this.endpoint(`payroll/workshop/workshop_personnel/` + id + '/'),
        method: "get",
        success: data => {
          this.workshopPersonnels = []
          for (let t in data) {
            this.workshopPersonnels.push({
              'name': data[t].personnel_name + '  ' + data[t].personnel_identity_code,
              'id': data[t].id,
            })
            this.marital[data[t].id] = data[t].marital_status
            this.gender[data[t].id] = data[t].gender

          }
        }
      })

    },

  },

}
</script>

<style scoped lang="scss"></style>

