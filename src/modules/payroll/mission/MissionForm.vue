<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت ماموریت"
            :showList="false"
            :listRoute="{name:'MissionList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :canSubmit="canSubmit"
            :show-submit-and-clear-btn="false"
            :show-navigation-btns="false"
            :isEditing.sync="isEditing"
            :can-edit="!item.is_verified"
            :items.sync="item"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="MissionForm"
        >

          <template>
            <v-row v-if="item.un_editable">
              <v-col cols="12" md="12">
                <v-banner class="mt-3 mb-5 red--text">
                  <v-avatar
                      slot="icon"
                      color="red"
                      size="40"
                  >
                    <v-icon
                        color="white"
                    >
                      fa-exclamation-triangle
                    </v-icon>
                  </v-avatar>
                  این ماموریت در محاسبات حقوق استفاده شده و غیر قابل ویرایش می باشد
                </v-banner>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="12" v-if="!item.id">
                <v-autocomplete
                    label="  کارگاه"
                    :items="workshops"
                    v-model="workshop"
                    ref="workshopSelect"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    @change="getPersonnel(workshop)"
                />
              </v-col>
              <v-col cols="12" md="12" v-if="item.id && !isEditing">
                <v-text-field
                    label="  کارگاه"
                    v-model="item.workshop"
                    :disabled="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="12" v-if="item.id && isEditing">
                <v-autocomplete
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

            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
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
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    label="نوع"
                    :items="MISSION_TYPES"
                    v-model="item.mission_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || !item.workshop_personnel"
                    @change="setValues(item)"
                />
              </v-col>
            </v-row>
            <v-row
                v-if="item.mission_type == 'd'"
            >
              <v-col cols="9" md="6">
                <date
                    v-model="item.from_date"
                    label="* از تاریخ"
                    :default="false"
                    :disabled="!isEditing"/>
              </v-col>
              <v-col cols="9" md="6">
                <date
                    v-model="item.to_date"
                    label="* تا تاریخ "
                    :default="false"
                    :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row
                v-if="item.mission_type == 'h'"
            >
              <v-col cols="12" md="4">
                <date v-model="item.date"
                      label="* تاریخ "
                      :default="false"
                      :disabled="!isEditing"/>
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
            <v-row v-if="item.mission_type">
              <v-col cols="12" md="4">
                <v-text-field label="مکان" v-model="item.location" background-color="white" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="موضوع" v-model="item.topic" background-color="white" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="توضیحات" v-model="item.explanation" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row class="mt-10" v-if="item.mission_type">

              <v-col cols="12" md="12">
                <v-banner class="mt-3  green--text" v-if="item.is_in_payment">
                  <v-avatar
                      slot="icon"
                      color="green"
                      size="25"
                  >
                    <v-icon
                        color="white"
                    >
                      fa-check
                    </v-icon>
                  </v-avatar>
                  تبصره ماده ۴۶ قانون کار - ماموریت به موردی اطلاق می‌شود که کارگر برای انجام کار حداقل ۵۰ کیلومتر </br>
                  از
                  محل
                  کارگاه اصلی دور شود و یا ناگزیر باشد حداقل یک شب در محل ماموریت توقف نماید.

                  <v-switch
                      :disabled="!isEditing"
                      class="float-left"
                      v-model="item.is_in_payment"
                      :true-value="true"
                      :false-value="false"
                      inset
                      color="green darken-2"
                  ></v-switch>
                </v-banner>
                <v-banner class="mt-3  orange--text text--darken-3" v-if="!item.is_in_payment">
                  <v-avatar
                      slot="icon"
                      color="orange"
                      size="25"
                  >
                    <v-icon
                        color="white"
                    >
                      fa-info
                    </v-icon>
                  </v-avatar>
                  برای محاسبه حق ماموریت در حقوق مزایای ماهیانه گزینه را فعال کنید
                  <v-switch
                      :disabled="!isEditing"
                      class="float-left"
                      v-model="item.is_in_payment"
                      :true-value="true"
                      :false-value="false"
                      inset
                      color="green darken-2"
                  ></v-switch>
                </v-banner>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-if="item.id">
                <v-text-field label="مدت ماموریت به روز" v-model="item.time_period" background-color="white"
                              :disabled="true"/>
              </v-col>
              <v-col cols="12" md="4" v-if="item.id && item.mission_type == 'h'">
                <v-text-field label="مدت ماموریت به ساعت" v-model="item.by_hour" background-color="white"
                              :disabled="true"/>
              </v-col>

            </v-row>
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyMission(item)"
              v-if="item.id && !item.is_verified && !isEditing">ثبت نهایی
          </v-btn>
          <v-btn
              class="red white--text mt-12 mr-2 ml-2 float-left "
              @click="UnVerifyMission(item)"
              v-if="item.id && item.is_verified && !item.un_editable"> خروج از وضعیت نهایی
          </v-btn>

        </m-form>
        <v-row justify="center">
          <v-dialog
              v-model="error_dialog"
              persistent
              @click:outside="error_dialog=false"
              max-width="400"
          >
            <v-card>
              <v-card-title class="red--text text-h5">
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
        <summary-mission-list></summary-mission-list>
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
import SummaryMissionList from "@/modules/payroll/mission/SummaryMissionList";


export default {
  name: "MissionForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {SummaryMissionList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      MISSION_TYPES: [
        {name: ' ساعتی', value: 'h'},
        {name: 'روزانه', value: 'd'},
      ],
      time: null,
      menu1: false,
      modal2: false,
      printUrl: 'payroll/mission/request',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/mission",
      type: null,
      entitlement: null,
      permissionBasename: "mission",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      error_dialog: false,
      workshop: null,
      workshops: [],
      error_message: null,
      first: false,
      isDefinable: false,
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
    if (this.$route.params.id) {
      console.log('ok')
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
        url: this.endpoint(`payroll/mission/` + this.$route.params.id + '/'),
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
              }
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
        console.log('ok')
        this.entitlement = true
      }
    },

    to(item) {
      return {
        name: 'MissionDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت ماموریت رد شد', 'warning')
    },
    verifyMission(item) {
      this.request({
        url: this.endpoint(`payroll/mission/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  ماموریت نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

        }
      })

    },
    UnVerifyMission(item) {
      this.request({
        url: this.endpoint(`payroll/mission/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('ماموریت از نهایی خارج شد', 'success')
          this.to(item)
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },
    getPersonnel(id) {
      this.workshopPersonnels = []
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
          }
        }
      })

    },

  },
}
</script>

<style scoped lang="scss"></style>

