<template>
  <div>
    <v-card>
      <v-toolbar
          color="primary darken-3"
          dark
      > وضعیت اولیه ردیف پیمان  {{ContractRowData.contract_row}} </v-toolbar>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-center">
              ردیف پیمان
            </th>

            <th class="text-center">
              کد و نام کارگاه
            </th>
            <th class="text-center">
              تاریخ شروع قرارداد
            </th>
            <th class="text-center">
              تاریخ پایان قرارداد
            </th>
            <th class="text-center">
              مبلغ اولیه قرارداد
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              @click="goToContractRow(ContractRowData.id)"
          >
            <td class="text-center">{{ ContractRowData.contract_row }}</td>
            <td class="text-center">{{ ContractRowData.workshop_name }}</td>
            <td class="text-center">{{ ContractRowData.from_date }}</td>
            <td class="text-center">{{ ContractRowData.initial_to_date }}</td>
            <td class="text-center">{{ ContractRowData.round_initial_amount }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <v-toolbar
          color="primary darken-3"
          dark
      > تغییرات ردیف پیمان {{ContractRowData.contract_row}}</v-toolbar>

      <adjustment-list :ex_filter="{'contract_row': ContractRow}"></adjustment-list>

      <v-toolbar
          color="primary darken-3"
          dark
      > وضعیت فعلی ردیف پیمان  {{ContractRowData.contract_row}} </v-toolbar>
      <v-simple-table>
        <template v-slot:default>
          <thead>
          <tr>
            <th class="text-center">
              ردیف پیمان
            </th>

            <th class="text-center">
              کد و نام کارگاه
            </th>
            <th class="text-center">
              تاریخ شروع قرارداد
            </th>
            <th class="text-center">
              تاریخ پایان فعلی قرارداد
            </th>
            <th class="text-center">
              مبلغ فعلی قرارداد
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
              @click="goToContractRow(ContractRowData.id)"
          >
            <td class="text-center">{{ ContractRowData.contract_row }}</td>
            <td class="text-center">{{ ContractRowData.workshop_name }}</td>
            <td class="text-center">{{ ContractRowData.from_date }}</td>
            <td class="text-center">{{ ContractRowData.get_now_date }}</td>
            <td class="text-center">{{ ContractRowData.round_amount }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>

    </v-card>
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
import AdjustmentList from "@/modules/payroll/contract_row/AdjustmentList";


export default {
  name: "ContractRowAdjustment",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    AdjustmentList,
    WorkshopContractSummaryList,
    WorkshopContractList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money
  },
  data() {
    return {
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
      ContractRow: this.$route.query.contract_row,
      ContractRowData: this.$route.query.contract_row,
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
    this.request({
      url: this.endpoint(`payroll/contract/row/` + this.ContractRow + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.ContractRowData = data
      }
    })
  },

  methods: {
    goToContractRow(id){
      this.$router.push('/panel/contract_row/' + id)
    }
  },
}
</script>

<style scoped lang="scss"></style>

