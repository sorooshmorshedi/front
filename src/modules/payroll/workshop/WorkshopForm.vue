<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت کارگاه"
            :showList="false"
            :show-submit-and-clear-btn="false"
            :listRoute="{name:'WorkshopList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :can-edit="!item.is_verified"
            :canSubmit="canSubmit"
            :isEditing.sync="isEditing"
            :show-navigation-btns="false"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="workshopForm"

        >
          <template>
            <v-banner class="rounded-lg mt-3 mb-5 error--text">
              <v-avatar
                  slot="icon"
                  color="error"
                  size="25"
              >
                <v-icon
                    color="white"
                >
                  fa-check
                </v-icon>
              </v-avatar>
              توجه داشته باشید اطلاعات کارگاه باید با اطلاعات مندرج در بیمه تامین اجتماعی یکسان باشد
            </v-banner>
            <v-dialog
                transition="dialog-bottom-transition"
                max-width="800"
                v-model="show_setting"
                class="rounded-lg"
            >
              <v-card class="rounded-lg pa-2">
                <v-card-text>
                  <workshop-setting-form ref="setting" :id="item.id" :is_pop="true" :show_edit="false"
                                         :is-editing="false"></workshop-setting-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                      left
                      large
                      depressed
                      class="error rounded-lg white--text mt-12 mb-5 mr-2 float-left"
                      @click="show_setting=false"
                  >بستن
                  </v-btn>
                  <v-btn
                      left
                      large
                      depressed
                      class="accent rounded-lg white--text mt-12 mb-5 mr-2 float-left"
                      @click="verifyWorkshop(item)"
                  >  تایید و ثبت نهایی کارگاه
                  </v-btn>

                </v-card-actions>
              </v-card>

            </v-dialog>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required]" v-on:keypress="NumbersToTenOnly" ref="code"
                              label="* کد کارگاه (بیمه) " v-model="item.workshop_code" background-color="white"
                              :disabled="!isEditing" class="rounded-lg"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" label="* نام کارگاه " v-model="item.name"
                              background-color="white" class="rounded-lg"
                              :disabled="!isEditing"/>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field :rules="[rules.required,]" v-on:keypress="NoneNumbersOnly" label="* نام کارفرما "
                              v-model="item.employer_name" background-color="white" class="rounded-lg"
                              :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* کد پستی کارگاه"
                            v-model="item.postal_code" :disabled="!isEditing" class="rounded-lg"></v-textarea>
              </v-col>

              <v-col cols="12" md="12">
                <v-textarea :rules="[rules.required,]" label="* آدرس کارگاه" v-model="item.address"
                            :disabled="!isEditing" class="rounded-lg"></v-textarea>
              </v-col>

              <v-col cols="12" md="6">
                <v-textarea label=" کد شعبه" v-model="item.branch_code" :disabled="!isEditing" class="rounded-lg"></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea label=" نام شعبه" v-model="item.branch_name" :disabled="!isEditing" class="rounded-lg"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
                    :rules="[rules.required,]"
                    label="* وضعیت"
                    :items="STATUS_TYPE"
                    v-model="item.is_active"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    class="rounded-lg"
                    v-if="item.is_verified"
                    :rules="[rules.required,]"
                    label="پیش فرض"
                    :items="DEFAULT_TYPES"
                    v-model="item.is_default"
                    item-text="name"
                    item-value="value"
                    :disabled="true"
                />
              </v-col>

            </v-row>
          </template>
          <v-btn
              depressed
              class="accent rounded-lg white--text mt-6  mr-2 float-left"
              @click="show_setting = true"
              v-if="item.id && !item.is_verified && !isEditing">ثبت نهایی
          </v-btn>
          <v-btn
              depressed
              class="error rounded-lg white--text mt-12 mr-2 ml-2 float-left "
              @click="UnVerifyWorkshop(item)"
              v-if="item.id && item.is_verified && !item.no_edit"> خروج از وضعیت نهایی
          </v-btn>
          <v-btn
              depressed
              class="error rounded-lg white--text mt-12 mr-2 ml-2 float-left "
              @click="no_edit_dialog = true"
              v-if="item.id && item.is_verified && item.no_edit"> خروج از وضعیت نهایی
          </v-btn>

          <v-btn
              class="secondary  rounded-lg white--text mt-6  mr-2 float-left"
              @click="setting(item)"
              depressed
              v-if="item.id && !item.is_verified && !isEditing">
            <v-icon class="ml-1">fa-cogs</v-icon>
            تنظیمات کارگاه
          </v-btn>
          <v-btn depressed class="success rounded-lg white--text mt-12 ml-2 float-left"
                 v-if=" item.id && item.is_verified && !item.is_default"
                 @click="goDefault(item.id)">انتخاب به عنوان پیش فرض
          </v-btn>
          <v-btn depressed class="primary rounded-lg white--text mt-12 ml-2 float-left"
                 v-if=" item.id && item.is_verified && item.is_default"
                 @click="goUnDefault(item.id)">خروج از پیش فرض
          </v-btn>
          <v-btn depressed class="secondary  rounded-lg white--text mt-12 ml-2 float-left"
                 v-if=" item.id && item.is_verified" @click="setting(item)">
            <v-icon class="ml-1">fa-cogs</v-icon>
            مشاهده تنظیمات کارگاه
          </v-btn>
          <v-btn depressed color="info" class="rounded-lg white--text mt-12 ml-2 float-left"
                 v-if=" item.id && item.is_verified" @click="goWorkshop(item)">
            <v-icon class="ml-1">fa-eye</v-icon>
            مشاهده جامع

          </v-btn>



        </m-form>
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
              v-model="no_edit_dialog"
              persistent
              @click:outside="no_edit_dialog=false"
              max-width="500"
              class="rounded-lg"
          >
            <v-card class="rounded-lg pa-2">
              <v-card-title class="error--text text-h5">
                توجه!
              </v-card-title>
              <v-card-text>
                <v-row  class="mt-5 mr-10">
                  برای خروج از حالت نهایی ابتدا لیست های غیر نهایی را نهایی یا حذف کنید
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    text
                    @click="no_edit_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

      </v-col>
      <v-col cols="12" md="6">
        <summary-workshop-list></summary-workshop-list>
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
import mobile from "@/components/scomponents/Mobile";
import WorkshopSettingForm from "@/modules/payroll/workshop/WorkshopSettingForm";
import WorkTitleSelect from "@/components/scomponents/WorkTitleSelect";


export default {
  name: "WorkshopForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    WorkshopSettingForm,
    SummaryWorkshopList,
    WorkshopList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money, mobile, WorkTitleSelect
  },
  props: {
    id: {},
  },
  data() {
    return {
      DEFAULT_TYPES: [
        {name: ' پیش فرض است', value: true},
        {name: 'غیر پبش فرض', value: false},
      ],
      STATUS_TYPE: [
        {name: ' فعال', value: true},
        {name: 'غیر فعال', value: false},
      ],

      BASE_PAY_TYPES: [
        {name: 'مزد مبنای روزانه', value: 'd'},
        {name: 'مزد مبنای ماهانه', value: 'm'},
      ],
      PAY_TYPES: [
        {name: 'حداقل حقوق روزانه', value: 'd'},
        {name: 'مزد مبنا', value: 'b'},
      ],
      SANAVAT_TYPES: [
        {name: 'پیوسته', value: 'c'},
        {name: 'نا پیوسته', value: 'n'},
      ],

      printUrl: 'payroll/workshop/all',
      isWorkshopConfirmed: false,
      worshopId: 0,
      baseUrl: "payroll/workshop",
      permissionBasename: "workshop",
      appendSlash: true,
      hasList: false,
      no_edit_dialog: false,
      hasIdProp: true,
      show_setting: false,
      hasLock: false,
      error_dialog: false,
      error_message: null,
      isDefinable: false,
      myClass: '',
      ss: null,
      factors: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
      first: false,
      rules: {
        required: value => !!value || 'Required.',
        code_len: v => v.length < 10 || '10 characters',
      },

    };
  },
  computed: {
    headers() {
      return [];
    },
  },
  updated() {
    if (!this.first && this.$route.params.id) {
      this.first = true
      this.isEditing = false
    }
  },
  methods: {
    goDefault(id) {
      this.request({
        url: this.endpoint(`payroll/workshop/default/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('کارگاه به حالت پیش فرض در آمد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },
    goUnDefault(id) {
      this.request({
        url: this.endpoint(`payroll/workshop/undefault/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('کارگاه از حالت پیش فرض خارج شد', 'success')
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
    addContractRow(item) {
      this.$router.push('/panel/contract_row' + '?workshop=' + item.id)
    },
    setting(item) {
      this.$router.push('/panel/workshopSetting/' + item.id)
    },

    goWorkshop(item) {
      this.$router.push('/panel/info/workshop?workshop=' + item.id)
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کارگاه رد شد', 'warning')
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
    NumbersToTenOnly(evt) {
      if (this.$refs.code.$props.value.length >= 10) {
        evt.preventDefault();
      }

      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
        ;
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
        evt.preventDefault();
        ;
      }
    },
    verifyWorkshop(item) {
      this.request({
        url: this.endpoint(`payroll/workshop/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  کارگاه نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

        }
      })

    },
    UnVerifyWorkshop(item) {
      this.request({
        url: this.endpoint(`payroll/workshop/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('کارگاه از نهایی خارج شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },

    show() {
      console.log(this.ss)
    }


  },
}
</script>

<style scoped lang="scss"></style>

