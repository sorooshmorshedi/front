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
            :items.sync="item"
            :show-navigation-btns="false"
            :show-submit-and-clear-btn="false"
            :can-edit="!item.is_verified"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="ContractForm"
        >
          <template>
            <v-row>
              <v-col cols="12" md="12">
                <v-autocomplete
                    class="rounded-lg"
                    label="  کارگاه"
                    :items="workshops"
                    v-if="!item.id"
                    v-model="workshop"
                    ref="workshopSelect"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    @keydown="show"
                    @change="getPersonnel(workshop)"
                />
                <v-autocomplete
                    class="rounded-lg"
                    label="  کارگاه"
                    :items="workshops"
                    v-model="item.workshop_id"
                    ref="workshopSelect"
                    item-text="name"
                    v-if="item.id"
                    item-value="id"
                    :disabled="!isEditing"
                    @keydown="show"
                    @change="getPersonnel(item.workshop_id)"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="!item.id"
                    label=" پرسنل"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!workshop"
                    @change="setChange"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="item.id"
                    label=" پرسنل"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    @change="setChange"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                    class="rounded-lg"
                    label=" نام پدر"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="father_name"
                    item-value="id"
                    :disabled="true"
                />

              </v-col>
              <v-col cols="12" md="3">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="personnel_nationality[item.workshop_personnel] == 2"
                    label=" کد فراگیر تابعیت"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="national_code"
                    item-value="id"
                    :disabled="true"
                />
                <v-autocomplete
                    class="rounded-lg"
                    v-if="personnel_nationality[item.workshop_personnel] != 2"
                    label=" کد ملی"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="national_code"
                    item-value="id"
                    :disabled="true"
                />

              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-on:keypress="NumbersOnly" label="* شماره قرارداد  "
                              class="rounded-lg"
                              v-model="item.code" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>

              <v-col cols="12" md="6">
                <date v-model="item.contract_from_date" label="* تاریخ شروع قرارداد " :default="false"
                      :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="6">
                <date v-model="item.contract_to_date" label="* تاریخ پایان قرارداد " :default="false"
                      :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="6">
                <date v-model="item.quit_job_date" label="تاریخ ترک کار " :default="false" :disabled="!isEditing"/>
              </v-col>

            </v-row>
            <v-row class="mt-10">
              <v-col cols="12" md="4">
                <v-switch
                    inset
                    color="success"
                    class="text-right "
                    v-model="item.insurance"
                    label='اضافه شدن به لیست بیمه'
                    :disabled="!isEditing"
                    :true-value="true"
                    :false-value="false"
                    @change="setChange(item)"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="5" v-if="item.insurance">
                <date
                    v-model="item.insurance_add_date"
                    label="* تاریخ اضافه شدن به لیست بیمه "
                    :default="false" :disabled="!isEditing"/>
              </v-col>

              <v-col cols="12" md="3" v-if="item.insurance">
                <v-text-field v-on:keypress="NumbersOnly"
                              v-if="!is_insurance[item.workshop_personnel]"
                              class="rounded-lg"
                              label=" * شماره بیمه" v-model="item.insurance_number"
                              background-color="white"
                              :disabled="!isEditing"/>
                <v-text-field v-on:keypress="NumbersOnly"
                              v-if="is_insurance[item.workshop_personnel]"
                              class="rounded-lg"
                              label=" شماره بیمه"
                              v-model="item.insurance_number = personnel_insurance_code[item.workshop_personnel]"
                              background-color="white"
                              :disabled="true"/>

              </v-col>

            </v-row>
            <v-row class="mt-10">
              <v-col cols="12" md="4">
                <v-switch
                    inset
                    color="success"
                    class="text-right "
                    v-model="item.tax"
                    label='اضافه شدن به لیست مالیات '
                    :disabled="!isEditing"
                    :true-value="true"
                    :false-value="false"
                ></v-switch>
              </v-col>
              <v-col cols="12" md="5" v-if="item.tax">
                <date
                    v-model="item.tax_add_date"
                    label="* تاریخ اضافه شدن به لیست مالیات "
                    :default="false" :disabled="!isEditing"/>
              </v-col>
            </v-row>
          </template>
          <v-btn
              class="accent rounded-lg white--text mt-6  mr-2 float-left" depressed
              @click="verifyContract(item)"
              v-if="item.id && !item.is_verified && !isEditing">ثبت نهایی
          </v-btn>
          <v-btn
              class="error rounded-lg white--text mt-12 mr-2 ml-2 float-left " depressed
              @click="UnVerifyContract(item)"
              v-if="item.id && item.is_verified && item.unverifiable"> خروج از وضعیت نهایی
          </v-btn>
          <v-btn
              class="error rounded-lg white--text mt-12 mr-2 ml-2 float-left " depressed
              @click="unverify_dialog = true"
              v-if="item.id && item.is_verified && !item.unverifiable"> خروج از وضعیت نهایی
          </v-btn>

          <v-btn
              class="secondary rounded-lg white--text mt-12 mr-2 ml-2 float-left " depressed
              :disabled="!item.insurance_editable"
              @click="insurance_dialog=true"
              v-if="item.id && item.is_verified"> اضافه کردن به لیست بیمه
          </v-btn>
          <v-btn
              class="secondary white--text mt-12 mr-2 ml-2 float-left rounded-lg" depressed
              :disabled="!item.tax_editable"
              @click="tax_dialog=true"
              v-if="item.id && item.is_verified"> اضافه کردن به لیست مالیات
          </v-btn>
          <v-btn
              class="secondary rounded-lg white--text mt-12 mr-2 ml-2 float-left " depressed
              :disabled="!item.is_quit_job_editable"
              @click="quit_dialog = true"
              v-if="item.id && item.is_verified"> ثبت ترک کار
          </v-btn>

        </m-form>
        <v-row justify="center">
          <v-dialog
              class="rounded-lg"
              v-model="tax_dialog"
              persistent
              @click:outside="tax_dialog=false"
              max-width="600"
          >
            <v-card class="rounded-lg">
              <v-card-title class="secondary--text text-h5">
                اضافه کردن به لیست مالیات
              </v-card-title>
              <v-card-text>
                <v-row class="mt-10">
                  <v-col cols="12" md="6">
                    <v-switch
                        inset
                        color="success"
                        class="text-right "
                        v-model="tax_status"
                        label='اضافه شدن به لیست مالیات '
                        :true-value="true"
                        :false-value="false"
                        @change="tax_date = null"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="6" v-if="tax_status">
                    <date
                        v-model="tax_date"
                        label="* تاریخ اضافه شدن به لیست مالیات "
                        :default="false"/>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="error"
                    class="rounded-lg" depressed
                    @click="tax_dialog = false"
                >
                  بستن
                </v-btn>
                <v-btn
                    color="success"
                    class="rounded-lg" depressed
                    @click="EditTax"
                >
                  ثبت
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row justify="center">
          <v-dialog
              v-model="insurance_dialog"
              persistent
              @click:outside="insurance_dialog=false"
              max-width="600"
          >
            <v-card>
              <v-card-title class="secondary--text text-h5">
                اضافه کردن به لیست بیمه
              </v-card-title>
              <v-card-text>
                <v-row class="mt-10">
                  <v-col cols="12" md="4">
                    <v-switch
                        inset
                        color="success"
                        class="text-right "
                        v-model="insurance_status"
                        label='اضافه شدن به لیست بیمه'
                        :true-value="true"
                        :false-value="false"
                        @change="insurance_number = null , insurance_date = null"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="5" v-if="insurance_status">
                    <date
                        v-model="insurance_date"
                        label="* تاریخ اضافه شدن به لیست بیمه "
                        :default="false"/>
                  </v-col>

                  <v-col cols="12" md="3" v-if="insurance_status">

                    <v-text-field v-on:keypress="NumbersOnly"
                                  class="rounded-lg"
                                  v-if="is_insurance[item.workshop_personnel]"
                                  label=" * شماره بیمه" v-model="insurance_number = personnel_insurance_code[item.workshop_personnel]"
                                  background-color="white"
                                  disabled="true"
                    />
                    <v-text-field v-on:keypress="NumbersOnly"
                                  class="rounded-lg"
                                  v-if="!is_insurance[item.workshop_personnel]"
                                  label=" * شماره بیمه" v-model="insurance_number"
                                  background-color="white"
                    />
                  </v-col>

                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="error"
                    class="rounded-lg" depressed
                    @click="insurance_dialog = false"
                >
                  بستن
                </v-btn>
                <v-btn
                    color="success"
                    class="rounded-lg" depressed
                    @click="EditInsurance"
                >
                  ثبت
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
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
                    color="success"
                    text
                    @click="error_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row justify="center">
          <v-dialog
              v-model="unverify_dialog"
              persistent
              @click:outside="unverify_dialog=false"
              max-width="300"
          >
            <v-card>
              <v-card-title class="red--text text-h5">
                خطا!
              </v-card-title>
              <v-card-text>
                با توجه به اینکه برای این قرارداد لیست حقوق صادر شده نمیتوانید آنرا غیر نهایی کنید
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    @click="unverify_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row justify="center">
          <v-dialog
              class="rounded-lg"
              v-model="quit_dialog"
              persistent
              @click:outside="quit_dialog=false"
              max-width="300"
          >
            <v-card class="rounded-lg">
              <v-card-title class="secondary--text text-h5">
                ثبت ترک کار
              </v-card-title>
              <v-card-text>
                <date v-model="quit_job_date" label="تاریخ ترک کار " :default="false"/>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="error"
                    class="rounded-lg" depressed
                    @click="quit_dialog = false"
                >
                  بستن
                </v-btn>
                <v-btn
                    color="success"
                    class="rounded-lg" depressed
                    @click="quitJob(item)"
                >
                  ثبت ترک کار
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
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
    WorkshopContractList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money
  },
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
      error_dialog: false,
      error_message: null,
      quit_job_date: null,
      insurance_date: null,
      insurance_number: null,
      tax_date: null,
      tax_status: false,
      insurance_status: false,
      is_insurance: {},
      personnel_nationality: {},
      personnel_insurance_code: {},
      personnel_insurance: [],
      first: false,
      unverify_dialog: false,
      defaultWorkshop: null,
      isDefinable: false,
      quit_dialog: false,
      tax_dialog: false,
      insurance_dialog: false,
      workshops: [],
      dont_have: true,
      workshop: null,
      myClass: '',
      workshopPersonnel: this.$route.query.workshop_personnel,
      workshopPersonnels: [],
      personnel_insurance_date: {},
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
    if (!this.$route.params.id) {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
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
                  'name': data[t].personnel_name,
                  'id': data[t].id,
                  'national_code': data[t].personnel_identity_code,
                  'father_name': data[t].personnel_father,
                })
                this.personnel_insurance_code[data[t].id] = data[t].personnel_insurance_code
                this.is_insurance[data[t].id] = data[t].personnel_insurance
                this.personnel_insurance_date[data[t].id] = data[t].insurance_add_date
                this.personnel_nationality[data[t].id] = data[t].personnel_nationality
                console.log(this.personnel_nationality)
              }
            }
          })
        }
      })
    } else {
      this.request({
        url: this.endpoint(`payroll/contract/edit/` + this.$route.params.id + '/'),
        method: "get",
        success: data => {
          this.quit_job_date = data.quit_job_date
          this.insurance_status = data.insurance
          this.insurance_date = data.insurance_add_date
          this.insurance_number = data.insurance_number
          this.tax_status = data.tax
          this.tax_date = data.tax_add_date
        }
      })
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
              'id': data[t].id,
            })
          }
        }
      })
      this.request({
        url: this.endpoint(`payroll/contract/` + this.$route.params.id + '/'),
        method: "get",
        success: data => {
          this.workshop = data.workshop_id
          this.$refs.workshopSelect.$props.value = data.workshop_id
          console.log(this.$refs.workshopSelect.$props)
          console.log(this.$refs.workshopSelect.$props.value)
          this.request({
            url: this.endpoint(`payroll/workshop/workshop_personnel/` + data.workshop_id + '/'),
            method: "get",
            success: data => {
              this.workshopPersonnels = []
              for (let t in data) {
                this.workshopPersonnels.push({
                  'name': data[t].personnel_name,
                  'id': data[t].id,
                  'national_code': data[t].personnel_identity_code,
                  'father_name': data[t].personnel_father,
                })
                this.personnel_insurance_code[data[t].id] = data[t].personnel_insurance_code
                this.is_insurance[data[t].id] = data[t].personnel_insurance
                this.personnel_insurance_date[data[t].id] = data[t].insurance_add_date
                this.personnel_nationality[data[t].id] = data[t].personnel_nationality
                console.log(this.personnel_nationality)
              }
              console.log('reload')
              console.log(this.workshopPersonnels)
            }
          })

        }
      })

    }
    console.log('--------------')
    console.log(this.personnel_insurance_code)
    console.log(this.is_insurance)
    console.log('--------------')

  },
  updated() {
    if (!this.first && this.$route.params.id) {
      this.first = true
      this.isEditing = false
    }
    if (this.dont_have && this.$route.params.id) {
      this.dont_have = false
      this.request({
        url: this.endpoint(`payroll/contract/` + this.$route.params.id + '/'),
        method: "get",
        success: data => {
          this.workshop = data.workshop_id
          this.$refs.workshopSelect.$props.value = data.workshop_id
          console.log(this.$refs.workshopSelect.$props)
          console.log(this.$refs.workshopSelect.$props.value)
          this.request({
            url: this.endpoint(`payroll/workshop/workshop_personnel/` + data.workshop_id + '/'),
            method: "get",
            success: data => {
              this.workshopPersonnels = []
              for (let t in data) {
                this.workshopPersonnels.push({
                  'name': data[t].personnel_name,
                  'id': data[t].id,
                  'national_code': data[t].personnel_identity_code,
                  'father_name': data[t].personnel_father,
                })
                this.personnel_insurance_code[data[t].id] = data[t].personnel_insurance_code
                this.is_insurance[data[t].id] = data[t].personnel_insurance
                this.personnel_insurance_date[data[t].id] = data[t].insurance_add_date
                this.personnel_nationality[data[t].id] = data[t].personnel_nationality
                console.log(this.personnel_nationality)
              }
              console.log('reload')
              console.log(this.workshopPersonnels)
            }
          })

        }
      })
    }
  },


  methods: {
    quitJob(item) {
      let put_data = item;
      put_data.quit_job_date = this.quit_job_date
      this.request({
        url: this.endpoint(`payroll/contract/edit/` + this.$route.params.id + '/'),
        method: "put",
        data: put_data,
        success: data => {
          this.notify('ترک کار ثبت شد', 'success')
          window.location.reload()
        }
      })
    },
    EditInsurance(item) {
      let put_data = item;
      put_data.insurance = this.insurance_status
      put_data.insurance_add_date = this.insurance_date
      put_data.insurance_number = this.insurance_number
      this.request({
        url: this.endpoint(`payroll/contract/editInsurance/` + this.$route.params.id + '/'),
        method: "put",
        data: put_data,
        success: data => {
          this.notify('تاریخ اضافه شدن به لیست بیمه ثبت شد', 'success')
          window.location.reload()
        }
      })
    },
    EditTax(item) {
      let put_data = item;
      put_data.tax = this.tax_status
      put_data.tax_add_date = this.tax_date
      this.request({
        url: this.endpoint(`payroll/contract/editTax/` + this.$route.params.id + '/'),
        method: "put",
        data: put_data,
        success: data => {
          this.notify('تاریخ اضافه شدن به لیست بیمه مالیات شد', 'success')
          window.location.reload()
        }
      })
    },
    getPersonnel(id) {
      this.workshopPersonnels = []
      this.request({
        url: this.endpoint(`payroll/workshop/workshop_personnel/` + id + '/'),
        method: "get",
        success: data => {
          this.workshopPersonnels = []
          for (let t in data) {
            this.workshopPersonnels.push({
              'name': data[t].personnel_name,
              'id': data[t].id,
              'national_code': data[t].personnel_identity_code,
              'father_name': data[t].personnel_father,
            })
            this.personnel_insurance_code[data[t].id] = data[t].personnel_insurance_code
            this.is_insurance[data[t].id] = data[t].personnel_insurance
            this.personnel_insurance_date[data[t].id] = data[t].insurance_add_date
            this.personnel_nationality[data[t].id] = data[t].personnel_nationality
            console.log(this.personnel_nationality)
          }
        }
      })

    },
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
    verifyContract(item) {
      this.request({
        url: this.endpoint(`payroll/contract/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  قرارداد نهایی شد', 'success')
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
        url: this.endpoint(`payroll/contract/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('قرارداد از نهایی خارج شد', 'success')
          this.to(item)
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },


    setChange(item) {
      if (this.personnel_insurance_date[item.workshop_personnel]) {
        this.$refs.ContractForm.$props.items['insurance_add_date'] = this.personnel_insurance_date[item.workshop_personnel]
        this.$refs.ContractForm.$props.items['insurance_number'] = undefined
      } else {
        this.$refs.ContractForm.$props.items['insurance_add_date'] = undefined
        this.$refs.ContractForm.$props.items['insurance_number'] = undefined
      }
    },
    to(item) {
      return {
        name: 'WorkshopContractDetail',
        params: {
          id: item.id,
        },
      };
    },
    show(item) {
      console.log(item)
    },
    unConfirm() {
      this.$router.go()
      this.notify(' ثبت قرارداد رد شد', 'warning')
    },

  },
}
</script>

<style scoped lang="scss"></style>

