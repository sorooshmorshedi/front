<template>
  <div>
    <v-row>
      <v-col col="12" md="6">

        <m-form
            title="ثبت قرارداد در کارگاه"
            :showList="false"
            :listRoute="{name:'WorkshopContractList'}"
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
              <v-col cols="12" md="6">
                <v-autocomplete
                    :rules="[rules.required,]"
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
              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* شماره قرارداد  " v-model="item.code" background-color="white"
                               :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <date v-model="item.contract_from_date" label="* تاریخ شروع قرارداد " :default="false"
                      :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.contract_to_date" label="* تاریخ پایان قرارداد " :default="false"
                      :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.quit_job_date" label="تاریخ ترک کار " :default="false" :disabled="!isEditing"/>
              </v-col>

            </v-row>
            <v-row>
              <v-col cols="12" md="4">
                <v-switch
                    class="text-center pr-11"
                    v-model="item.insurance"
                    label='ّبیمه میشود'
                    :disabled="!isEditing"
                    :value="true"
                    @change="show(item.insurance)"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="4" v-if="item.insurance">
                <date v-model="item.insurance_add_date" label="تاریخ اضافه شدن به بیمه " :default="false" :disabled="!isEditing"/>
              </v-col>

            </v-row>
          </template>
        </m-form>
      </v-col>
      <v-col cols="12" md="6">
        <workshop-contract-summary-list></workshop-contract-summary-list>
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
import WorkshopContractList from "@/modules/payroll/contract/ContractList";
import WorkshopContractSummaryList from "@/modules/payroll/contract/ContractSummaryList";


export default {
  name: "WorkshopContractForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    WorkshopContractSummaryList,
    WorkshopContractList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {

      printUrl: 'payroll/contract/form',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/contract",
      permissionBasename: "contract",
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
          text: " پرسنل در کارگاه",
          value: "workshop_personnel",
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
    if (!this.workshopPersonnel) {
      this.request({
        url: this.endpoint(`payroll/workshop/personnel/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshopPersonnels.push({
              'name': data[t].personnel_name + ' ' + ' در کارگاه ' + data[t].workshop_name,
              'id': data[t].id,
            })
          }
          console.log(this.workshopPersonnels)
        }
      })
    }
  },

  methods: {
    NumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },

    show(item) {
      console.log(item)
    },
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

