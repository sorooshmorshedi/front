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
            :canSubmit="canSubmit"
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
                    label="نوع"
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
                    @change="item = template[tem_id] ; item.is_template = false; item.id = null"
                />
              </v-col>

              <v-col cols="12" md="4">
                <v-autocomplete
                    v-if="!this.workshopPersonnel"
                    label=" پرسنل در کارگاه"
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
                    label="نوع"
                    :items="DEDUCTION_TYPES"
                    v-model="item.is_template"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field label="نام قالب" v-model="item.template_name" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field label="نام کسورات" v-model="item.name" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>

              <v-col cols="12" md="6">
                <money v-model="item.amount"  label="مبلغ"></money>
              </v-col>
              <v-col cols="12" md="6" >
                <money v-model="item.episode"  :disabled="!isEditing" label="تعداد ماه "></money>
              </v-col>
              <v-col cols="12" md="6">
                <date v-model="item.start_date" label="* تاریخ" :default="true" :disabled="!isEditing"/>
              </v-col>

            </v-row>
            <v-row v-if="item.id">
              <v-col cols="12" md="12">
                <v-text-field label="توضیحات" v-model="item.explanation" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row class="mt-10" v-if="item.id">
              <v-col cols="12" md="4">
                <v-text-field label="مبلغ هر ماه" v-model="item.monthly_pay" background-color="white"
                              disabled="ture"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.last_dept_date" label="*تا تاریخ " :default="true" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="ماه های پرداخت شده" v-model="item.episode_payed" background-color="white"
                              disabled="ture"/>
              </v-col>

            </v-row>

          </template>
        </m-form>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>لیست وام یا مساعده ها</v-card-title>
          <v-card-text>
            <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                         ref="datatable">
              <template #item.detail="{ item }">
                <detail-link :to="to(item)" />
              </template>

            </m-datatable>
          </v-card-text>
        </v-card>
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


export default {
  name: "ِثیعزفهخدForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
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
  computed: {
    headers() {
      return [
        {
          text: " پرسنل در کارگاه",
          value: "workshop_personnel_display",
          filterable: false,
        },
        {
          text: "تاریخ",
          value: "start_date",
        },
        {
          text: "تاریخ اتمام",
          value: "last_dept_date",
          filterable: false,
        },
        {
          text: "مبلغ هر ماه",
          value: "monthly_pay",
          filterable: false,
        },
      ];
    },

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
  },
}
</script>

<style scoped lang="scss"></style>

