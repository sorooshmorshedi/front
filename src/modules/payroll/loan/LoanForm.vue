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
            :canDelete="false"
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
              <v-col  cols="12" md="6" v-if="item.id">
                <v-btn left v-if="is_req" class="white--text ma-2 " color="orange" @click="change_export_req(item)">فرم درخواست مساعده</v-btn>
                <v-btn left v-if="!is_req" class="ma-2 " @click="change_export_req(item)">فرم درخواست مساعده</v-btn>
                <v-btn left v-if="is_item" class="white--text ma-2 pl-10 pr-10" color="orange" @click="change_export_item(item)">جدول وام</v-btn>
                <v-btn left v-if="!is_item" class="ma-2 pl-10 pr-10" @click="change_export_item(item)">جدول وام</v-btn>
              </v-col>
            </v-row>
            <v-row >
              <v-col cols="12" md="6">
                <v-autocomplete
                    v-if="!this.workshopPersonnel"
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
              <v-col cols="12" md="4">
                <date v-model="item.pay_date" label="* تاریخ" :default="true" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <money v-model="item.amount"  label="مبلغ"></money>
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
            <v-row class="mt-10" v-if="item.id">
              <v-col cols="12" md="4">
                <v-text-field label="مبلغ هر قسط" v-model="item.monthly_pay" background-color="white"
                              disabled="ture"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.last_dept_date" label="* تاریخ سررسید" :default="true" :disabled="true"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label="اقساط پرداخت شده" v-model="item.episode_payed" background-color="white"
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
  name: "LoanForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
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
      hasIdProp: true,
      hasLock: false,
      isDefinable: false,
      myClass: '',
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
          value: "pay_date",
          filterable: false,
        },
        {
          text: "مبلغ کل",
          value: "amount",
          filterable: false,

        },
        {
          text: "مبلغ هر قسط",
          value: "monthly_pay",
          filterable: false,
        },
      ];
    },

  },
  mounted() {
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
  },
}
</script>

<style scoped lang="scss"></style>

