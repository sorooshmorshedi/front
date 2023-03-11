<template>
  <div>
    <m-form
        class="mt-2"
        title="ثبت تعدیل"
        :showList="false"
        :listRoute="{name:'AdjustmentList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="!deleteVerify"
        :can-edit="false"
        :canSubmit="!item.id"
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
      <v-row class="ma-3">
        <v-col cols="12" md="12">
          <v-text-field v-if="contract_row" v-show="false" v-model="item.contract_row=contract_row"></v-text-field>
          <v-autocomplete
              v-if="!contract_row"
              :rules="[rules.required,]"
              label="ردیف پیمان"
              :items="contractRows"
              v-model="item.contract_row"
              item-text="name"
              item-value="id"
              :disabled="item.id"
          />
        </v-col>
        <v-col cols="12" md="12">
          <date v-model="item.change_date" label=" تاریخ پایان جدید" :default="false" :disabled="item.id"/>
        </v-col>
        <v-col cols="12" md="12">
          <money
              v-on:keypress="NumbersOnly"
              label=" مبلغ تعدیل قرارداد"
              v-model="item.amount"
              background-color="white"
              :disabled="item.id"
          />
        </v-col>
        <v-col cols="12" md="12" v-if="item.amount">
          <v-autocomplete
              :rules="[rules.bool_required,]"
              label="* نوع تعدیل مبلغ"
              :items="STATUS_TYPE"
              v-model="item.status"
              item-text="name"
              item-value="value"
              :disabled="item.id"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-textarea
              class="rounded-lg"
              outlined
              label="توضیحات"
              v-model="item.explanation"
              :disabled="item.id"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-btn
          v-if="item.id != null && deleteVerify"
          class="error rounded-lg white--text  mr-2 float-left " depressed
          @click="error_dialog = true"
      >حذف تعدیل</v-btn>

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
            توجه!
          </v-card-title>
          <v-card-text>
            آیا از حذف تعدیل اطمینان دارید؟
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                v-if="item.id != null && deleteVerify"
                class="error rounded-lg white--text  mr-2 float-left " depressed
                @click="error_dialog = false"
            >خیر</v-btn>

            <v-btn
                v-if="item.id != null && deleteVerify"
                class="success rounded-lg white--text  mr-2 float-left " depressed
                @click="verifyDelete(item.contract_row)"
            >بله</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      error_dialog: false,
      hasIdProp: true,
      contractRow: null,
      contractRows: [],
      hasLock: false,
      isDefinable: false,
      myClass: '',
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      deleteVerify: true,
      payment: '',
      performClearForm: true,
      rules: {
        required: value => !!value || 'Required.',
        bool_required: value => value != null || 'Required.',
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
    if (this.contract_row == null){
      this.contractRow = this.$route.params.id
      this.request({
        url: this.endpoint(`payroll/contract/row/`),
        method: "get",
        success: data => {
          for (let t in data) {
            this.contractRows.push({
              'name': data[t].contract_row,
              'id': data[t].id,
            })
            this.contractRows.push({
              'name': 'هبچ کدام',
              'id': null,
            })
            console.log(this.contractRows)
          }
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
    verifyDelete(id){
      this.$refs.adjustment.emitDelete()
      this.$router.push('/panel/ContractRowAdjustment?contract_row=' + id)
    },
    to(item) {
      return {
        name: 'AdjustmentDetail',
        params: {
          id: item.id,
        },
      };
    },

  },

}
</script>

<style scoped lang="scss"></style>

