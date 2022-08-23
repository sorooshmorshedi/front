<template>
  <div>
    <m-form
        title="ثبت کارگاه"
        :showList="false"
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
          <v-col cols="10" md="5">
            <v-text-field label="* کد کارگاه " v-model="item.code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="10" md="5">
            <v-text-field label="* ردیف پیمان " v-model="item.contract_row" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="10" md="5">
            <v-text-field label="* نام کارگاه " v-model="item.name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="10" md="5">
            <v-text-field label="* نام کارفرما " v-model="item.employer_name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="10" md="6">
            <v-textarea label="* آدرس کارگاه" v-model="item.address" :disabled="!isEditing"></v-textarea>
          </v-col>
          <v-col cols="10" md="4">
            <v-textarea label=" کد پستی کارگاه" v-model="item.postal_code" :disabled="!isEditing"></v-textarea>
          </v-col>
          <v-col cols="10" md="3">
            <v-textarea label=" * نرخ بیمه حق کارفرما " v-model="item.employer_insurance_contribution" :disabled="!isEditing"></v-textarea>
          </v-col>
          <v-col cols="10" md="3">
            <v-textarea label=" کد شعبه" v-model="item.branch_code" :disabled="!isEditing"></v-textarea>
          </v-col>
          <v-col cols="10" md="4">
            <v-textarea label=" نام شعبه" v-model="item.branch_name" :disabled="!isEditing"></v-textarea>
          </v-col>
        </v-row>
      </template>
      <v-btn class="blue white--text mt-6 ml-2 float-left"
             v-if=" item.id" @click="addContractRow(item)">ثبت پیمان
      </v-btn>
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


export default {
  name: "WorkshopForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      printUrl: 'payroll/workshop/',
      isWorkshopConfirmed: false,
      worshopId: 0,
      baseUrl: "payroll/workshop",
      permissionBasename: "workshop",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      myClass: '',
      factors: [],
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

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کارگاه رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

