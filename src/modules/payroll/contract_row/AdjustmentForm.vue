<template>
  <div>
    <m-form
        class="mt-2"
        title="ثبت تعدیل"
        :showList="false"
        :listRoute="{name:'AdjustmentList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :can-edit="isEditing"
        :canSubmit="canSubmit"
        :show-clear-btn="false"
        :show-list-btn="false"
        :isEditing.sync="isEditing"
        :show-navigation-btns="false"
        :show-submit-and-clear-btn="false"
        @submit="sub(item)"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="adjustment"
    >
      <v-text-field v-show="false" v-model="item.contract_row = contract_row " />
      <v-row class="ma-3">
        <v-col cols="12" md="12">
          <date :rules="[rules.required,]" v-model="item.change_date" label="* تاریخ تعدیل" :default="false" :disabled="!isEditing"/>
        </v-col>
        <v-col cols="12" md="12">
          <money
              v-on:keypress="NumbersOnly"
              :rules="[rules.required,]"
              label="* مبلغ تغییر قرارداد"
              v-model="item.amount"
              background-color="white"
              :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-autocomplete
              :rules="[rules.required,]"
              label="* نوع تغییر"
              :items="STATUS_TYPE"
              v-model="item.status"
              item-text="name"
              item-value="value"
              :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea
              outlined
              label="توضیحات"
              v-model="item.explanation"
          ></v-textarea>
        </v-col>

      </v-row>

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
import WorkshopContractList from "@/modules/payroll/contract/ContractList";
import WorkshopContractSummaryList from "@/modules/payroll/contract/ContractSummaryList";


export default {
  name: "AdjustmentForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    WorkshopContractSummaryList,
    WorkshopContractList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money
  },
  props: {
    id: {},
    contract_row: {
      default: undefined,
    },

  },
  data() {
    return {
      STATUS_TYPE: [
        {name: ' افزایشی', value: true},
        {name: 'کاهش', value: false},
      ],

      printUrl: 'payroll/adjustment/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/adjustment",
      permissionBasename: "adjustment",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      contract_row: null,
      hasLock: false,
      isDefinable: false,
      myClass: '',
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
      return [];
    },
  },
  mounted() {
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
    sub(item){
      this.request({
        url: this.endpoint(`payroll/adjustment/`),
        method: "post",
        data : item,
        success: data => {
          console.log(data);
          this.notify('تعدیل ثبت شد', 'success')
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

