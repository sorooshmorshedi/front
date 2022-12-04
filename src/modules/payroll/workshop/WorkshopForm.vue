<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت کارگاه"
            :showList="false"
            :show-submit-and-clear-btn="false"
            :listRoute="{name:'WorkshopList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :canSubmit="canSubmit"
            :isEditing.sync="isEditing"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="workshopForm"

        >

          <template>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* کد کارگاه " v-model="item.code" background-color="white" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]"  label="* نام کارگاه " v-model="item.name" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NoneNumbersOnly" label="* نام کارفرما " v-model="item.employer_name" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* کد پستی کارگاه" v-model="item.postal_code" :disabled="!isEditing"></v-textarea>
              </v-col>

              <v-col cols="12" md="12">
                <v-textarea :rules="[rules.required,]" label="* آدرس کارگاه" v-model="item.address" :disabled="!isEditing"></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea label=" کد شعبه" v-model="item.branch_code" :disabled="!isEditing"></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea label=" نام شعبه" v-model="item.branch_name" :disabled="!isEditing"></v-textarea>
              </v-col>
            </v-row>
            <v-btn class="primary white--text mt-6 ml-2 float-left"
                   v-if=" item.id" @click="setting(item)">تنظیمات کارگاه
            </v-btn>
            <v-btn color="blue" class=" white--text mt-6 ml-2 float-left"
                   v-if=" item.id" @click="goWorkshop(item)">مشاهده جامع
            </v-btn>

          </template>

        </m-form>
      </v-col>
      <v-col cols="12" md="6">
        <summary-workshop-list></summary-workshop-list>
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
import WorkshopList from "@/modules/payroll/workshop/WorkshopList";
import SummaryWorkshopList from "@/modules/payroll/workshop/SummaryWorkshopList";


export default {
  name: "WorkshopForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryWorkshopList,
    WorkshopList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money
  },
  props: {
    id: {},
  },
  data() {
    return {
      BASE_PAY_TYPES: [
        {name: 'مزد مبنای روزانه', value: 'd'},
        {name: 'مزد مبنای ماهانه', value: 'm'},
      ],
      PAY_TYPES: [
        {name: 'حداقل حقوق روزانه', value: 'd'},
        {name: 'مزد مبنا', value: 'b'},
      ],
      SANAVAT_TYPES: [
        {name: 'پیوسته', value: 'c'},
        {name: 'نا پیوسته', value: 'n'},
      ],

      printUrl: 'payroll/workshop/all',
      isWorkshopConfirmed: false,
      worshopId: 0,
      baseUrl: "payroll/workshop",
      permissionBasename: "workshop",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      isDefinable: false,
      myClass: '',
      factors: [],
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
          text: "کد کارگاه",
          value: "code",
          type: "numeric",

        },
        {
          text: "ردیف پیمان",
          value: "contract_row",
          type: "numeric",
        },
        {
          text: "نام کارگاه",
          value: "name",
        },
        {
          text: "نام کارفرما",
          value: "employer_name",
        },
        {
          text: "آدرس کارگاه",
          value: "address",
        },
        {
          text: "کد پستی",
          value: "postal_code",
          type: "numeric",
        },
        {
          text: "نرخ بیمه حق کارفرما",
          value: "employer_insurance_contribution",
          type: "numeric",
        },
        {
          text: "کد شعبه",
          value: "branch_code",
          type: "numeric",
        },

        {
          text: "نام شعبه",
          value: "branch_name",
        },
      ];
    },
  },

  methods: {
    to(item) {
      return {
        name: 'WorkshopDetail',
        params: {
          id: item.id,
        },
      };
    },
    addContractRow(item) {
      this.$router.push('/panel/contract_row' + '?workshop=' + item.id)
    },
    setting(item) {
      this.$router.push('/panel/setting/' + item.id)
    },

    goWorkshop(item) {
      this.$router.push('/panel/info/workshop?workshop=' + item.id)
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کارگاه رد شد', 'warning')
    },
    NumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
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
        evt.preventDefault();;
      }
    },

  },
}
</script>

<style scoped lang="scss"></style>

