<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <v-card></v-card>
        <m-form
            title="ثبت وام یا مساعده"
            :showList="false"
            :listRoute="{name:'LoanList'}"
            :exportBaseUrl="exportUrl"
            :exportParams="ex"
            :items.sync="item"
            :canDelete="false"
            :show-navigation-btns="false"
            :show-submit-and-clear-btn="false"
            :can-edit="!item.is_verified"
            :canSubmit="canSubmit"
            :isEditing.sync="isEditing"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="LoanForm"
        >
          <template>
            <v-row>
            <v-col cols="12" md="6"></v-col>
              <v-col  cols="12" md="6" v-if="item.id && item.is_verified">
                <v-btn left v-if="is_req" class="white--text ma-2 " color="orange" @click="change_export_req(item)">فرم درخواست مساعده</v-btn>
                <v-btn left v-if="!is_req" class="ma-2 " @click="change_export_req(item)">فرم درخواست مساعده</v-btn>
                <v-btn left v-if="is_item" class="white--text ma-2 pl-10 pr-10" color="orange" @click="change_export_item(item)">جدول وام</v-btn>
                <v-btn left v-if="!is_item" class="ma-2 pl-10 pr-10" @click="change_export_item(item)">جدول وام</v-btn>
              </v-col>
            </v-row>
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
                  این وام یا مساعده در محاسبات حقوق استفاده شده و غیر قابل ویرایش می باشد
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
                    label=" کارگاه"
                    :items="workshops"
                    v-model="item.workshop_id"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    @change="getPersonnel(item.workshop_id)"
                />
              </v-col>
            </v-row>

            <v-row >
              <v-col cols="12" md="6">
                <v-autocomplete
                    v-if="!item.id"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
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
                    :items="LOAN_TYPES"
                    v-model="item.loan_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4" v-if="item.loan_type != 'd'">
                <date  v-model="item.pay_date" label="* تاریخ شروع" :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4" v-if="item.loan_type == 'd'">
                <date  v-model="item.pay_date" label="* تاریخ اعمال در حقوق" :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <money v-model="item.amount" :disabled="!isEditing" label="مبلغ"></money>
              </v-col>
              <v-col cols="12" md="4" v-if="item.loan_type != 'd'">
                <money v-model="item.episode"  :disabled="!isEditing" label="تعداد اقساط"></money>
              </v-col>
              <v-col cols="12" md="4" v-if="item.loan_type == 'd'">
                <money v-model="dept_episode"  disabled="true" label="تعداد اقساط"></money>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="توضیحات" v-model="item.explanation" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
            </v-row >
            <v-row class="mt-10" v-if="item.id && item.is_verified && item.loan_type == 'l'">
              <v-col cols="12" md="4">
                <money v-model="item.monthly_pay"
                       :disabled="!isEditing"
                       label="مبلغ هر قسط"
                       background-color="white"
                       disabled="ture"></money>

              </v-col>
              <v-col cols="12" md="4">
                <v-text-field v-model="item.last_dept_date" label=" تاریخ پایان وام" :default="true" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="اقساط پرداخت شده" v-model="item.episode_payed" background-color="white"
                              disabled="ture"/>
              </v-col>

            </v-row>
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyLoan(item)"
              v-if="item.id && !item.is_verified && !isEditing" >ثبت نهایی</v-btn>
          <v-btn
              class="red white--text mt-12 mr-2 ml-2 float-left "
              @click="UnVerifyLoan(item)"
              v-if="item.id && item.is_verified" > خروج از وضعیت نهایی</v-btn>
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
        <summary-loan-list></summary-loan-list>
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
import LoanList from "@/modules/payroll/loan/LoanList";
import SummaryLoanList from "@/modules/payroll/loan/SummeryLoanList";


export default {
  name: "LoanForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryLoanList,
    LoanList,
    SummaryAbsenceList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    loan: {},
  },
  data() {
    return {

      LOAN_TYPES: [
        {name: ' وام', value: 'l'},
        {name: 'مساعده', value: 'd'},

      ],
      is_item: false,
      is_req: false,
      time: null,
      ex: {},
      dept_episode: 1,
      menu1: false,
      modal2: false,
      exportUrl: 'payroll/loan/item',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/loan",
      type: null,
      entitlement: null,
      permissionBasename: "loan",
      url: "payroll/loan/all",
      appendSlash: true,
      hasList: false,
      workshop: null,
      workshops: [],
      hasIdProp: true,
      error_dialog: false,
      error_message: null,
      hasLock: false,
      isDefinable: false,
      myClass: '',
      workshopPersonnel: this.$route.query.workshop_personnel,
      workshopPersonnels: [],
      PathLevels,
      VisitorLevels,
      first: false,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
    };
  },
  computed: {

  },
  updated() {
    if (!this.first && this.$route.params.id){
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
        url: this.endpoint(`payroll/loan/` + this.$route.params.id + '/'),
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
    setValues(item) {
      if (item.leave_type == 'e') {
        console.log('ok')
        this.entitlement = true
      }
    },
    change_export_req(item) {
    this.exportUrl = 'payroll/loan/request'
      this.ex = {id : item.id}
      this.is_req = true
      this.is_item = false
      },
    change_export_item(item) {
    this.exportUrl = 'payroll/loan/item'
      this.ex = {id : '', loan: item.id}
      this.is_req = false
      this.is_item = true

    },
    verifyLoan(item){
      this.request({
        url: this.endpoint(`payroll/loan/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  وام نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

        }
      })

    },
    UnVerifyLoan(item) {
      this.request({
        url: this.endpoint(`payroll/loan/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('وام از نهایی خارج شد', 'success')
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
    show(item) {
      console.log(item)
    },

  },
}
</script>

<style scoped lang="scss"></style>

