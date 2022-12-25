<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت کسورات اختیاری"
            :showList="false"
            :listRoute="{name:'DeductionList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :show-submit-and-clear-btn="false"
            :show-navigation-btns="false"
            :canSubmit="canSubmit"
            :can-edit="!item.is_verified"
            :isEditing.sync="isEditing"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="DeductionForm"

        >

          <template>

            <v-row  v-if="!item.is_template">
              <v-col cols="12" md="4">
                <v-autocomplete
                    label="* نوع"
                    :items="TYPES"
                    v-model="item.is_template"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    label="انتخاب قالب"
                    :items="templates"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    v-model="tem_id"
                    @change="item = template[tem_id] ; item.is_template = false; item.id = null ; item.is_verified = False"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                    v-if="!this.workshopPersonnel"
                    label=" * پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                />
                <v-text-field
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"
                ></v-text-field>
              </v-col>


            </v-row>
            <v-row v-if="item.is_template" >
              <v-col cols="12" md="6">
                <v-autocomplete
                    label="* نوع"
                    :items="TYPES"
                    v-model="item.is_template"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="* نام قالب" v-model="item.template_name" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="* نام کسورات" v-model="item.name" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>

              <v-col cols="12" md="6">
                <money v-model="item.amount" :disabled="!isEditing" label="* مبلغ"></money>
              </v-col>
              <v-col cols="12" md="6" >
                <money v-model="item.episode"  :disabled="!isEditing" label=" * تعداد ماه "></money>
              </v-col>
              <v-col cols="12" md="6">
                <date v-model="item.start_date" label="* تاریخ" :default="false" :disabled="!isEditing"/>
              </v-col>

            </v-row>
            <v-row >
              <v-col cols="12" md="12">
                <v-text-field label="توضیحات" v-model="item.explanation" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row class="mt-10" v-if="item.id && item.is_verified">
              <v-col cols="12" md="4">
                <v-text-field label="مبلغ هر ماه" v-model="item.monthly_pay" background-color="white"
                              disabled="ture"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.last_dept_date" label="*تا تاریخ " :default="false" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="ماه های پرداخت شده" v-model="item.episode_payed" background-color="white"
                              disabled="ture"/>
              </v-col>
            </v-row>
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyDeduction(item)"
              v-if="item.id && !item.is_verified && !isEditing" >ثبت نهایی</v-btn>
          <v-btn
              class="red white--text mt-12 mr-2 ml-2 float-left "
              @click="UnVerifyDeduction(item)"
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
        <summery-deduction-list></summery-deduction-list>
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
import SummeryDeductionList from "@/modules/payroll/deduction/SummeryDeductionList";


export default {
  name: "DeductionForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummeryDeductionList,
    LoanList,
    SummaryAbsenceList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {

      TYPES: [
        {name: ' شخصی', value: false},
        {name: 'قالب', value: true},

      ],
      time: null,
      tem_id: null,
      dept_episode: 1,
      menu1: false,
      modal2: false,
      printUrl: 'payroll/deduction/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/deduction",
      type: null,
      entitlement: null,
      permissionBasename: "loan",
      url: "payroll/deduction/all",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      first: false,
      error_dialog: false,
      error_message: null,
      isDefinable: false,
      myClass: '',
      templates: [],
      template : null,
      workshopPersonnel: this.$route.query.workshop_personnel,
      workshopPersonnels: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
    };
  },
  updated() {
    if (!this.first && this.$route.params.id){
      this.first = true
      this.isEditing = false
    }
  },

  mounted() {
    this.request({
      url: this.endpoint(`payroll/deduction/template/`),
      method: "get",
      success: data => {
        console.log(data);
        this.template = data
        for (let t in data) {
          this.template[data[t].id] = data[t]
          this.templates.push({
            'name': data[t].template_name,
            'id': data[t].id,
          })
        }
        console.log(this.workshopPersonnels)
      }
    })
    if (!this.workshopPersonnel) {
      this.request({
        url: this.endpoint(`payroll/workshop/personnel/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshopPersonnels.push({
              'name': data[t].personnel_name + ' در کارگاه ' + data[t].workshop_name,
              'id': data[t].id,
            })
          }
          console.log(this.workshopPersonnels)
        }
      })
    }
  },

  methods: {
    to(item) {
      return {
        name: 'DeductionDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کسورات رد شد', 'warning')
    },

    verifyDeduction(item){
      this.request({
        url: this.endpoint(`payroll/deduction/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  کسورات اختیاری نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

        }
      })

    },
    UnVerifyDeduction(item) {
      this.request({
        url: this.endpoint(`payroll/deduction/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('کسورات اختیاری از نهایی خارج شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },

  },

}
</script>

<style scoped lang="scss"></style>

