<template xmlns="http://www.w3.org/1999/html">
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
            :items.sync="item"
            :can-edit="!item.is_verified && !item.use_in_insurance_list"
            :canSubmit="!item.is_verified"
            :isEditing.sync="isEditing"
            :show-navigation-btns="false"
            :show-submit-and-clear-btn="false"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="contractRowForm"
        >
          <template>
            <v-banner v-if="!item.is_verified && !item.use_in_insurance_list" class="mt-3 mb-5 red--text">
              <v-avatar
                  slot="icon"
                  color="red"
                  size="25"
              >
                <v-icon
                    color="white"
                >
                  fa-check
                </v-icon>
              </v-avatar>
              توجه داشته باشید اطلاعات پیمان باید با اطلاعات مندرج در بیمه تامین اجتماعی یکسان باشد
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
                    label="کارگاه"
                    :items="workshops"
                    v-model="item.workshop"
                    ref="workshopSelect"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing || item.is_verified"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersTo3Only" ref="contract_row" label="* ردیف پیمان " v-model="item.contract_row" background-color="white"
                              :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* شماره قرارداد " v-model="item.contract_number" background-color="white"
                              :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <date  v-model="item.registration_date" label="* تاریخ قرارداد" :default="false" :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <date  v-model="item.from_date" label="* تاریخ شروع قرارداد" :default="false" :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4" >
                <date  v-model="item.initial_to_date" label="* تاریخ پایان قرارداد" :default="false" :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* شناسه ملی واگذار کننده " v-model="item.assignor_national_code"
                              background-color="white" :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NoneNumbersOnly" label="* نام واگذار کننده " v-model="item.assignor_name" background-color="white"
                              :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field :rules="[rules.required]" v-on:keypress="NumbersToTenOnly"  ref="code" label="* کد کارگاه واگذار کننده " v-model="item.assignor_workshop_code"
                              background-color="white" :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field label=" شعبه تامین اجتماعی" v-model="item.branch" background-color="white" :disabled="!isEditing || item.is_verified"/>
              </v-col>
              <v-col cols="12" md="4">
                <money
                    v-on:keypress="NumbersOnly"
                    :rules="[rules.required,]"
                    label="* مبلغ اولیه قرارداد"
                    v-model="item.contract_initial_amount"
                    background-color="white"
                    :disabled="!isEditing || item.is_verified"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    :rules="[rules.bool_required,]"
                    label="* وضعیت"
                    :items="STATUS_TYPE"
                    v-model="item.status"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing || item.is_verified"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field  label=" موضوع " v-model="item.topic" background-color="white" :disabled="!isEditing || item.is_verified"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
              <v-text-field v-show="item.id"  label="مبلغ فعلی قرارداد" v-model="item.round_amount" background-color="white"
                            :disabled="true"/>
              </v-col>
              <v-col cols="12" md="6">
                <date v-show="item.id" v-model="item.get_now_date" label="* تاریخ پایان فعلی قرارداد" :default="false" :disabled="true"/>
              </v-col>
            </v-row>
            <v-banner v-if="item.have_ads" class="mt-5 red--text">
              <v-avatar
                  slot="icon"
                  color="red"
                  size="25"
              >
                <v-icon
                    color="white"
                >
                  fa-check
                </v-icon>
              </v-avatar>
              برای ویرایش اطلاعات ردیف پیمان ابتدا تمام تعدیل های این ردیف پیمان را حذف کنید
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
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyContract(item.id)"
              v-if="item.id && !item.is_verified && !item.use_in_insurance_list && !isEditing" >ثبت نهایی</v-btn>
          <v-btn
              class="red white--text mt-12 mr-2 float-left "
              @click="UnVerifyContract(item)"
              v-if="item.id && item.is_verified && !item.use_in_insurance_list && !item.have_ads" > خروج از وضعیت نهایی</v-btn>
          <v-dialog
              v-if="item.id && item.is_verified && item.status == true"
              transition="dialog-top-transition"
              max-width="600"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  class="accent darken-3 white--text mt-12 mr-2 float-left "
                  v-bind="attrs"
                  v-on="on"
              >ثبت تعدیل</v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-toolbar
                    color="accent darken-3"
                    dark
                >ثبت تعدیل برای ردیف پیمان {{item.contract_row}}</v-toolbar>
                <v-card-text>

                  <adjustment-form :contract_row="item.id" ></adjustment-form>

                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn fab color="red" class="mt-1 mr-1 white--text" @click="dialog.value = false"><v-icon>fa-times</v-icon></v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-btn
              class="primary darken-1 white--text mt-12 mr-2 float-left "
              v-if="item.id && item.is_verified && item.have_ads"
              @click="goAdjustment(item)"
          >مشاهده تغییرات ردیف پیمان</v-btn>
          <v-btn
              class="red darken-1 white--text mt-12 mr-2 float-left "
              v-if="item.id && item.is_verified && item.have_ads && item.status"
              @click="UnActiveContract(item)"
          >غیر فعال کردن</v-btn>
          <v-btn
              class="green darken-1 white--text mt-12 mr-2 float-left "
              v-if="item.id && item.is_verified && item.have_ads && !item.status"
              @click="ActiveContract(item)"
          > فعال کردن</v-btn>

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
                  {{item}}
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
import AdjustmentForm from "@/modules/payroll/contract_row/AdjustmentForm";
import AdjustmentList from "@/modules/payroll/contract_row/AdjustmentList";


export default {
  name: "ContractRowFrom",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    AdjustmentList,
    AdjustmentForm,
    SummaryContractRowList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
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
      error_dialog: false,
      error_message: null,
      performClearForm: true,
      rules: {
        required: value => !!value || 'Required.',
        bool_required: value => value != null || 'Required.',
        code_len: v => v.length == 10|| '10 characters',
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
          value: "workshop_name",
          filterable: false,
        },
        {
          text: "ردیف پیمان",
          value: "contract_row",
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

    if (!this.$route.params.id) {
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
      this.request({
        url: this.endpoint(`payroll/workshop/default/`),
        method: "get",
        success: data => {
          this.workshop = data.id
          this.$refs.workshopSelect.$props.value = data.id
          console.log(this.$refs.workshopSelect.$props)
          console.log(this.$refs.workshopSelect.$props.value)
          this.request({
            url: this.endpoint(`payroll/workshop/workshop_personnel/` + data.id + '/'),
            method: "get",
            success: data => {
              this.workshopPersonnels = []
              for (let t in data) {
                this.workshopPersonnels.push({
                  'name': data[t].personnel_name + '  ' + data[t].personnel_identity_code,
                  'id': data[t].id,
                })
              }
            }
          })

        }
      })
    } else {
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
    NumbersToTenOnly(evt) {
      if (this.$refs.code.$props.value.length >= 10){
        evt.preventDefault();
      }

      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
    NumbersTo3Only(evt) {
      if (this.$refs.contract_row.$props.value.length >= 3){
        evt.preventDefault();
      }

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
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

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
    UnActiveContract(item) {
      this.request({
        url: this.endpoint(`payroll/contract/row/unactive/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('غیر فعال  کردن ردیف پیمان انجام شد', 'success')
          this.to(item)
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },
    ActiveContract(item) {
      this.request({
        url: this.endpoint(`payroll/contract/row/active/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify(' فعال  کردن ردیف پیمان انجام شد', 'success')
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
    goAdjustment(item) {
      this.$router.push('/panel/ContractRowAdjustment?contract_row=' + item.id)
    },


    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کارگاه رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

