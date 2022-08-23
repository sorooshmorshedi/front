<template>
  <div>
    <m-form
        title="ثبت قرارداد در کارگاه"
        :showList="false"
        :listRoute="{name:'ContractRowList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="workshopContractForm"

    >

      <template>
        <v-row>
          <v-col cols="9" md="5">
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
          <v-col cols="9" md="4">
            <v-text-field label="* شماره قرارداد  " v-model="item.code" background-color="white" :disabled="!isEditing"/>
          </v-col>
        </v-row>
        <v-row>
        <v-col cols="9" md="3">
            <date v-model="item.contract_from_date" label="* تاریخ شروع قرارداد " :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="9" md="3">
            <date v-model="item.contract_to_date" label="* تاریخ پایان قرارداد " :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="9" md="3">
            <date v-model="item.quit_job_date" label="تاریخ ترک کار " :default="true" :disabled="!isEditing"/>
          </v-col>

        </v-row>
      </template>
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
  name: "WorkshopContractForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {

      printUrl: 'payroll/contract/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/contract",
      permissionBasename: "contract",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
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
          value: "workshp_personnel",
        },
        {
          text: "شماره قرارداد",
          value: "code",
        },
        {
          text: "تاریخ شروع قرارداد",
          value: "contract_from_date",
        },
        {
          text: "تاریخ پایان قرارداد",
          value: "contract_to_date",
        },
        {
          text: "تاریخ ترک کار",
          value: "quit_job_date",
        },
      ];
    },
  },
  mounted() {
    if(!this.workshopPersonnel){
      this.request({
        url: this.endpoint(`payroll/workshop/personnel/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshopPersonnels.push({
              'name': data[t].personnel_name + ' ' + data[t].personnel_last_name + ' in ' + data[t].workshop_name,
              'id': data[t].id,
            })
          }
          console.log(this.workshopPersonnels)
        }
      })}
  },

  methods: {
    to(item) {
      return {
        name: 'WorkshopContractDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت قرارداد رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

