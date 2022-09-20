<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت  جدول معافیت مالیات و حقوق سالانه"
            :showList="false"
            :listRoute="{name:'TaxRowList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :canSubmit="canSubmit"
            :isEditing.sync="isEditing"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="workshopTaxRowForm"
        >

          <template>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                    label="نام"
                    v-model="item.name"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.from_date" label="از تاریخ " :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.to_date" label="تا تاریخ " :default="false" :disabled="!isEditing"/>
              </v-col>

            </v-row>
            <v-row class="mt-10 mb-10 ml-2 mr-2" v-if="item.id">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-center">
                      ردیف
                    </th>
                    <th class="text-center">
                      از مبلغ (سالانه)
                    </th>
                    <th class="text-center">
                      تا مبلغ (سالانه)
                    </th>
                    <th class="text-center">
                      درصد
                    </th>
                    <th class="text-center">
                      از مبلغ (ماهانه)
                    </th>
                    <th class="text-center">
                      تا مبلغ (ماهانه)
                    </th>

                    <th class="text-center">

                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                      v-for="(row, index) in item.tax_row.slice().reverse()"
                      :key="item.id"
                  >
                    <td class="text-center">{{ index + 1 }}</td>
                    <td class="text-center">
                      <money v-model="row.from_amount"></money>
                    </td>
                    <td class="text-center">
                      <money v-model="row.to_amount , from = row.to_amount "></money>
                    </td>
                    <td class="text-center">
                      <money v-if="row.ratio" v-model="row.ratio"></money>
                      <v-text-field
                          v-if="!row.ratio"
                          class="currency-input"
                          v-model="moaf"
                          disabled="true"
                      >
                      </v-text-field>

                    </td>
                    <td class="text-center">
                      <money v-if="row.from_amount_month" disabled="true" v-model="row.from_amount_month "></money>
                      <money v-if="!row.from_amount_month" disabled="true" v-model="first "></money>
                    </td>
                    <td class="text-center">
                      <money disabled="true" v-model="row.to_amount_month"></money>
                    </td>

                    <td class="text-center">
                      <v-btn
                          text
                          color="error"
                          @click="delete_row(row.id)"
                      >
                        حذف
                      </v-btn>
                    </td>
                  </tr>
                  </tbody>
                  <tr class="pt-10 green lighten-4">
                    <td class="text-center">
                      +
                    </td>
                    <td class="text-center">
                      <money v-if="item.tax_row.slice().reverse()[0]" v-model="from = item.tax_row.slice().reverse()[0].auto_from" disabled="true"></money>
                      <v-text-field
                          v-if="!item.tax_row.slice().reverse()[0]"
                          class="currency-input"
                          v-model="first"
                          disabled="true"
                      >
                      </v-text-field>

                    </td>
                    <td class="text-center">
                      <money v-model="to"></money>
                    </td>
                    <td class="text-center">
                      <money
                          v-model="ratio"
                          v-if="item.tax_row.slice().reverse()[0]"
                      ></money>
                      <v-text-field
                          v-if="!item.tax_row.slice().reverse()[0]"
                          class="currency-input"
                          v-model="moaf"
                          disabled="true"
                      >
                      </v-text-field>

                    </td>
                    <td class="text-center" colspan="2">
                    </td>
                    <td class="text-center">
                      <v-btn
                          v-if="item.tax_row.slice().reverse()[0]"
                          color="green darken-2 white--text"
                          @click="add_row(item.id)"
                      >
                        ایجاد ردیف جدید
                      </v-btn>
                      <v-btn
                          v-if="!item.tax_row.slice().reverse()[0]"
                          color="green darken-2 white--text"
                          @click="add_row(item.id) ; goTo(item.id)"
                      >
                        ایجاد ردیف جدید
                      </v-btn>
                    </td>

                  </tr>

                </template>
              </v-simple-table>
            </v-row>
          </template>

        </m-form>
      </v-col>
      <v-col cols="12" md="6">
        <tax-row-list></tax-row-list>
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
import TaxRowList from "@/modules/payroll/workshop/tax/TaxRowList";
import {toString} from "lodash";


export default {
  name: "TaxRowForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {TaxRowList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      first: '0',
      moaf: 'معاف از مالیات',
      from: 0,
      to: 0,
      ratio: 0,
      time: null,
      menu1: false,
      modal2: false,
      printUrl: 'payroll/tax/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/tax",
      type: null,
      entitlement: null,
      permissionBasename: "workshop_tax",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      myClass: '',
      workshops: [],
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
          text: "ار مبلغ",
          value: "from_amount",
        },
        {
          text: "تا مبلغ",
          value: "to_amount",
        },
        {
          text: "درصد",
          value: "ratio",
        },
      ];
    },
  },
  mounted() {
  },

  methods: {
    goTo(item) {
      this.$router.push('tax_row/' + toString(item) )
    },
    delete_row(id) {
      this.request({
        url: this.endpoint(`payroll/tax/row/` + id + '/'),
        method: "delete",
        success: data => {
          this.notify('ردیف حذف شد', 'success')
          setTimeout(2000)
          this.$router.go()
        }
      })

    },
    add_row(item) {
      this.request({
        url: this.endpoint(`payroll/tax/row/`),
        method: "post",
        data: {
          workshop_tax: item,
          from_amount: this.from,
          to_amount: this.to,
          ratio: this.ratio
        },
        success: data => {
          this.notify('ردیف ثبت شد', 'success')
          this.$router.go()

        }
      })


    },
    to(item) {
      return {
        name: 'WorkshopTaxDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت ردیف مالیات رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

