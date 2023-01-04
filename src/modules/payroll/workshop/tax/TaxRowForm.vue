<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت  جدول معافیت مالیات حقوق سالانه"
            :showList="false"
            :listRoute="{name:'TaxRowList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :show-navigation-btns="false"
            :show-submit-and-clear-btn="false"
            :canDelete="false"
            :can-edit="!item.is_verified"
            :show-clear-btn="false"
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
                    :disabled="!isEditing"
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
                      <money v-model="row.from_amount" disabled="true"></money>
                    </td>
                    <td class="text-center">
                      <money disabled="true" v-model="row.to_amount , from = row.to_amount "></money>
                    </td>
                    <td class="text-center">
                      <money v-if="row.ratio" disabled="true" v-model="row.ratio"></money>
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
                          :disabled="!isEditing"
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
                      <money v-model="to" :disabled="!isEditing"></money>
                    </td>
                    <td class="text-center">
                      <money
                          v-model="ratio"
                          v-if="item.tax_row.slice().reverse()[0]"
                          :disabled="!isEditing"
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
                          :disabled="!isEditing"
                      >
                        ایجاد ردیف جدید
                      </v-btn>
                      <v-btn
                          v-if="!item.tax_row.slice().reverse()[0]"
                          color="green darken-2 white--text"
                          @click="add_row(item.id) ; goTo(item.id)"
                          :disabled="!isEditing"
                      >
                        ایجاد ردیف جدید
                      </v-btn>
                    </td>

                  </tr>

                </template>
              </v-simple-table>
            </v-row>
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyWorkshopTax(item)"
              v-if="item.id && !item.is_verified && !isEditing">ثبت نهایی
          </v-btn>
          <v-btn
              class="red white--text mt-12 mr-2 ml-2 float-left "
              @click="UnVerifyWorkshopTax(item)"
              v-if="item.id && item.is_verified"> خروج از وضعیت نهایی
          </v-btn>

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
                  {{ item }}
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
      firstt: false,
      error_dialog: false,
      error_message: null,
      hasLock: false,
      isDefinable: false,
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
  updated() {
    if (!this.firstt && this.$route.params.id){
      this.firstt = true
      this.isEditing = false
    }
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
    verifyWorkshopTax(item) {
      this.request({
        url: this.endpoint(`payroll/tax/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  جدول معاف مالیات نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

        }
      })

    },
    UnVerifyWorkshopTax(item) {
      this.request({
        url: this.endpoint(`payroll/tax/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('جدول معاف مالیات از نهایی خارج شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },


    unConfirm() {
      this.$router.go()
      this.notify(' ثبت ردیف مالیات رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

