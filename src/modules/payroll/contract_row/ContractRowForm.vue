<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت پیمان"
            :showList="false"
            :listRoute="{name:'ContractRowList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :can-edit="!item.is_verified && !item.use_in_insurance_list"
            :canSubmit="canSubmit"
            :isEditing.sync="isEditing"
            :show-navigation-btns="false"
            :show-submit-and-clear-btn="false"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="workshopForm"
        >
          <template>
            <v-banner v-if="!item.is_verified && !item.use_in_insurance_list" class="mt-3 mb-5 green--text">
              <v-avatar
                  slot="icon"
                  color="green"
                  size="25"
              >
                <v-icon
                    color="white"
                >
                  fa-check
                </v-icon>
              </v-avatar>
              توجه داشته باشید اطلاعات پیمان باید با اطلاعات مندرج در بیمه تامین اجتماعی یکی باشد
            </v-banner>
            <v-banner v-if="item.use_in_insurance_list" class="mt-3 mb-5 red--text">
              <v-avatar
                  slot="icon"
                  color="red"
                  size="25"
              >
                <v-icon
                    color="white"
                >
                  fa-times
                </v-icon>
              </v-avatar>
              با توجه به این که ردیف پیمان در محاسبات حقوق و لیست بیمه درج شده قابل ویرایش نیست

            </v-banner>
            <v-row>
              <v-col cols="12" md="4">
                <v-autocomplete
                    :rules="[rules.required,]"
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
                    v-model="item.workshop = this.workshop"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* ردیف پیمان " v-model="item.contract_row" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* شماره قرارداد " v-model="item.contract_number" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.registration_date" label="* تاریخ قرارداد" :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.from_date" label="* تاریخ شروع قرارداد" :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <date v-model="item.to_date" label="* تاریخ پایان قرارداد" :default="false" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* شناسه ملی واگذار کننده " v-model="item.assignor_national_code"
                              background-color="white" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NoneNumbersOnly" label="* نام واگذار کننده " v-model="item.assignor_name" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* کد کارگاه واگذار کننده " v-model="item.assignor_workshop_code"
                              background-color="white" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label=" شعبه تامین اجتماعی" v-model="item.branch" background-color="white" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4">
                <money
                    v-on:keypress="NumbersOnly"
                    label="* مبلغ اولیه قرارداد"
                    v-model="item.contract_initial_amount"
                    background-color="white"
                    :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    :rules="[rules.required,]"
                    label="* وضعیت"
                    :items="STATUS_TYPE"
                    v-model="item.status"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label=" موضوع " v-model="item.topic" background-color="white" :disabled="!isEditing"/>
              </v-col>
            </v-row>
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyContract(item.id)"
              v-if="item.id && !item.is_verified && !item.use_in_insurance_list" >ثبت نهایی</v-btn>
          <v-btn
              class="red white--text mt-12 mr-2 float-left "
              @click="UnVerifyContract(item)"
              v-if="item.id && item.is_verified && !item.use_in_insurance_list" > خروج از وضعیت نهایی</v-btn>

        </m-form>
      </v-col>
      <v-col cols="12" md="6">
        <summary-contract-row-list></summary-contract-row-list>
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
import SummaryContractRowList from "@/modules/payroll/contract_row/SummaryContractRowList";


export default {
  name: "ContractRowFrom",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {SummaryContractRowList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      STATUS_TYPE: [
        {name: ' فعال', value: true},
        {name: 'غیر فعال', value: false},
      ],

      printUrl: 'payroll/contractRows/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/contract/row",
      permissionBasename: "contract_row",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      isDefinable: false,
      myClass: '',
      workshop: this.$route.query.workshop,
      workshops: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      first: false,
      performClearForm: true,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },

    };
  },
  updated() {
    if (!this.first && this.$route.params.id){
      this.first = true
      this.isEditing = false
    }
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
    if (!this.workshop) {
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
    NoneNumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        return true;
      } else {
        evt.preventDefault();;
      }
    },
    verifyContract(id){
      this.request({
        url: this.endpoint(`payroll/contract/row/verify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  ردیف پیمان نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })

    },
    UnVerifyContract(item) {
      this.request({
        url: this.endpoint(`payroll/contract/row/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('ردیف پیمان از نهایی خارج شد', 'success')
          this.to(item)
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },
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

