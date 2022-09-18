<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت ردیف جدول نرخ مالیات"
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
              <v-col cols="12" md="3">
                <v-autocomplete
                    v-if="!this.workshop"
                    label=" کارگاه"
                    :items="workshops"
                    v-model="item.workshop"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                />
                <v-text-field
                    label="کارگاه"
                    v-if="this.workshop"
                    disabled="true"
                    v-model="item.workshop = this.workshop"

                ></v-text-field>
              </v-col>

              <v-col cols="12" md="3">
                <money
                    label="*از مبلغ "
                    v-model="item.from_amount"
                    background-color="white"
                    :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="3">
                <money
                    label="*تا مبلغ "
                    v-model="item.to_amount"
                    background-color="white"
                    :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                    label="* درصد "

                    :disabled="!isEditing"
                    v-model="item.ratio"
                    prepend-inner-icon="%"
                ></v-text-field>
              </v-col>
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


export default {
  name: "TaxRowForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {TaxRowList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      time: null,
      menu1: false,
      modal2: false,
      printUrl: 'payroll/tax/row/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/tax/row",
      type: null,
      entitlement: null,
      permissionBasename: "workshop_tax_row",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      myClass: '',
      workshop: this.$route.query.workshop,
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
          text: " کارگاه",
          value: "workshop",
        },
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
    if (!this.workshop) {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].code,
              'id': data[t].id,
            })
          }
          console.log(this.workshops)
        }
      })
    }
  },

  methods: {
    to(item) {
      return {
        name: 'MissionDetail',
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
