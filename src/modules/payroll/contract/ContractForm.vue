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
            <v-row v-if="!item.id">
              <v-col cols="12" md="12">
                <v-autocomplete
                    label="  کارگاه"
                    @click="show()"
                    :items="workshops"
                    v-model="workshop"
                    ref="workshopSelect"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    @keydown="show"
                    @change="getPersonnel(workshop)"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                    v-if="!item.id"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!workshop"
                    @change="setChange"
                />
                <v-autocomplete
                    v-if="item.id"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    @change="setChange"
                />
                <v-text-field
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-on:keypress="NumbersOnly" label="* شماره قرارداد  "
                              v-model="item.code" background-color="white"
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
              <v-col cols="12" md="3">
                <v-switch
                    class="text-center pr-11"
                    v-model="item.insurance"
                    label='بیمه میشود'
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

              <v-col cols="12" md="4" v-if="item.insurance">
                <v-text-field v-on:keypress="NumbersOnly"
                              v-if=" !is_insurance[item.workshop_personnel]"
                              label=" * شماره بیمه" v-model="item.insurance_number"
                              background-color="white"
                              :disabled="!isEditing"/>
                <v-text-field v-on:keypress="NumbersOnly"
                              v-if=" is_insurance[item.workshop_personnel]"
                              label=" شماره بیمه"
                              v-model="item.insurance_number = personnel_insurance_code[item.workshop_personnel]"
                              background-color="white"
                              :disabled="true"/>

              </v-col>

            </v-row>
          </template>
          <v-btn
              class="light-blue white--text mt-6  mr-2 float-left"
              @click="verifyContract(item)"
              v-if="item.id && !item.is_verified && !isEditing">ثبت نهایی
          </v-btn>
          <v-btn
              class="red white--text mt-12 mr-2 ml-2 float-left "
              @click="UnVerifyContract(item)"
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
      is_insurance: {},
      personnel_insurance_code: {},
      first: false,
      defaultWorkshop: null,
      isDefinable: false,
      workshops: [],
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
                'name': data[t].personnel_name + '  ' + data[t].personnel_identity_code,
                'id': data[t].id,
              })
            }
          }
        })

      }
    })
  },
  updated() {
    if (!this.first && this.$route.params.id) {
      this.first = true
      this.isEditing = false
    }
  },


  methods: {
    getPersonnel(id){
      this.workshopPersonnels = []
      this.request({
        url: this.endpoint(`payroll/workshop/workshop_personnel/` + id + '/'),
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
          this.error_message = data.response.data['وضعییت']
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
        console.log('ok')
        this.$refs.ContractForm.$props.items['insurance_add_date'] = this.personnel_insurance_date[item.workshop_personnel]
        this.$refs.ContractForm.$props.items['insurance_number'] = undefineds
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
    show(){
      console.log(this.$refs.workshopSelect.$props.value)
    },
    unConfirm() {
      this.$router.go()
      this.notify(' ثبت قرارداد رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

