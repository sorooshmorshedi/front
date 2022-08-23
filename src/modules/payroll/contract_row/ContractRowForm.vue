<template>
  <div>
    <m-form
        title="ثبت پیمان"
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
        ref="workshopForm"

    >

      <template>
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete
                v-if="!this.workshop"
                label="کارگاه"
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
                v-model="item.tender = this.workshop"

            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="* ردیف پیمان " v-model="item.contract_row" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="* شماره قرارداد " v-model="item.contract_number" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <date v-model="item.registration_date" label="تاریخ قرارداد" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <date v-model="item.from_date" label="تاریخ شروع قرارداد" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <date v-model="item.to_date" label="تاریخ پایان قرارداد" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="* شناسه ملی واگذار کننده " v-model="item.assignor_national_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="* نام واگذار کننده " v-model="item.assignor_name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="* کد کارگاه واگذار کننده " v-model="item.assignor_workshop_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label=" شعبه " v-model="item.branch" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <money
                label=" مبلغ اولیه قرارداد"
                v-model="item.contract_initial_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                label="* وضعیت"
                :items="STATUS_TYPE"
                v-model="item.status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
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
  name: "ContractRowFrom",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      STATUS_TYPE: [
        {name: ' فعال', value: 'a'},
        {name: 'راکد', value: 'n'},
      ],

      printUrl: 'payroll/conractrow/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/contract/row",
      permissionBasename: "contract_row",
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
          text: "ردیف پیمان",
          value: "contract_row",
          type: "numeric",
        },
        {
          text: "شماره قرارداد",
          value: "contract_number",
        },
        {
          text: "تاریخ قرارداد",
          value: "registration_date",
        },
        {
          text: "تاریخ شروع قرارداد",
          value: "from_date",
        },
        {
          text: "تاریخ پایان قرارداد",
          value: "to_date",
        },
        {
          text: "شناسه ملی واگذار کننده",
          value: "assignor_national_code",
        },
        {
          text: "نام واگذار کننده",
          value: "assignor_name",
        },

        {
          text: "کد کارگاه واگذار کننده",
          value: "assignor_workshop_code",
        },
        {
          text: "شعبه",
          value: "branch",
        },
        {
          text: "مبلغ اولیه قرارداد",
          value: "contract_initial_amount",
        },
        {
          text: "وضعیت",
          value: "status",
        },
      ];
    },
  },
  mounted() {
    if(!this.workshop){
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name,
              'code': data[t].code,
              'id': data[t].id,
            })
          }
          console.log(this.tenders)
        }
      })}
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

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کارگاه رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

