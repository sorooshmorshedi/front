<template>
  <div>
    <v-row>
      <m-form
          title="تنظیمات کارگاه"
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
          <v-banner v-if="item.is_verified" class="mt-3 mb-5 red--text">
            <v-avatar
                slot="icon"
                color="red"
                size="25"
            >
              <v-icon
                  color="white"
              >
                fa-info
              </v-icon>
            </v-avatar>
            برای ایجاد تغییر در تنظیمات، ابتدا کارگاه را از حالت نهایی خارج کنید
          </v-banner>

          <v-toolbar
              v-if="is_pop"
              class="mb-5"
              flat
              color="red"
              dark
          >
            <v-toolbar-title>
              قبل از ثبت نهایی کارگاه، تنظیمات کارگاه بررسی و تایید شود
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-toolbar
              class="mb-5"
              flat
              color="indigo"
              dark
          >
            <v-toolbar-title>
              تنظیمات کلی حقوق و مزایا کارگاه {{ item.name }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-autocomplete
              label="نحوه محاسبه مزد مبنا"
              :items="BASE_PAY_TYPES"
              v-model="item.base_pay_type = 'd'"
              item-text="name"
              item-value="value"
              v-show="false"
          />
          <v-row class=" mb-6">
            <v-col cols="12" md="12">
              <v-row>
                <v-col cols="12" md="3" v-if="1 == 0">
                  <v-autocomplete
                      label="نحوه محاسبه پایه سنوات "
                      :items="SANAVAT_TYPES"
                      v-model="item.sanavat_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <money
                      label="حداقل حقوق روزانه اداره کار"
                      class="currency-input"
                      v-model="item.hade_aghal_hoghoogh"
                      :disabled="true"
                  >
                  </money>
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                      label="معافیت مالیاتی حق بیمه سهم بیمه شده"
                      :items="TAX_EMPLOYER_TYPES"
                      v-model="item.tax_employer_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-tooltip top color="primary">
                    <template v-slot:activator="{ on, attrs }">

                      <v-autocomplete
                          v-bind="attrs"
                          v-on="on"

                          label="نحوه محاسبه حق سنوات "
                          :items="HAGHE_SANAVAT_TYPES"
                          v-model="item.haghe_sanavat_type"
                          item-text="name"
                          item-value="value"
                          :disabled="!isEditing"
                      />
                    </template>
                    <span v-if="!item.haghe_sanavat_type">نحوه محاسبه حق سنوات را انتخاب کنید</span>
                    <span v-if="item.haghe_sanavat_type == 'c'">پرداختی سالانه یا ماهانه حق سنوات به کارگر، جنبه تسویه حساب حق سنوات را دارد</span>
                    <span v-if="item.haghe_sanavat_type == 'o'"> پرداختی سالانه یا ماهانه حق سنوات بصورت علی الحساب ، با تغییر حقوق و دستمزد سالانه، در پایان آن سال بروز رسانی میشود و محاسبات حق سنوات قبل نیز با آخرین حکم کارگزینی در سال جاری انجام میشود</span>
                  </v-tooltip>

                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                      label="نحوه لحاظ مرخصی استعلاجی جهت پرداخت عائله مندی "
                      :items="ILLNESS_TYPES"
                      v-model="item.illness_absence_in_real_work"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </v-col>

              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <percent label="نرخ حق بیمه سهم کارفرما" v-model="item.employee_insurance_nerkh"
                           :disabled="!isEditing"></percent>
                </v-col>
                <v-col cols="12" md="3">
                  <percent label="نرخ حق بیمه سهم بیمه شده" v-model="item.worker_insurance_nerkh"
                           :disabled="!isEditing"></percent>
                </v-col>
                <v-col cols="12" md="3">
                  <percent label="نرخ حق بیمه سهم بیکاری" v-model="item.unemployed_insurance_nerkh"
                           :disabled="!isEditing"></percent>
                </v-col>
                <v-col cols="12" md="3">
                  <percent label="نرخ تبصره 1 ماده 86 ق.م.م" v-model="item.made_86_nerkh"
                           :disabled="true"></percent>
                </v-col>

              </v-row>
            </v-col>
          </v-row>
          <v-simple-table>
            <thead class="mt-3">
            <tr>
              <th class="text-center">
                عنوان
              </th>
              <th class="text-center">
                محاسبه بر مبنای
              </th>
              <th class="text-center">
                نحوه شناسایی
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>عیدی و پاداش</td>
              <td>
                <v-autocomplete
                    :items="EYDI_PAY_TYPES"
                    v-model="item.eydi_padash_pay_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-autocomplete
                    :items="REWARD_TYPES"
                    v-model="item.eydi_padash_identification"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </td>

            </tr>

            <tr>
              <td>حق سنوات</td>
              <td>
                <v-autocomplete
                    :items="SANAVAT_PAY_TYPES"
                    v-model="item.haghe_sanavat_pay_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-autocomplete
                    :items="REWARD_TYPES"
                    v-model="item.haghe_sanavat_identification"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </td>

            </tr>
            <tr>
              <td>ذخیره ایام مرخصی</td>
              <td>
                <v-autocomplete
                    :items="LEAVE_PAY_TYPES"
                    v-model="item.leave_save_pay_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </td>
              <td class="pr-10 ">
                <v-switch
                    v-model="item.save_absence_limit"
                    label="محاسبه تا 9 روز"
                    color="success"
                    :false-value="false"
                    :true-value="true"
                    :disabled="!isEditing"
                    hide-details
                ></v-switch>
                <v-switch
                    v-model="item.save_absence_transfer_next_year"
                    label="انتقال به سال بعد"
                    color="success"
                    :false-value="false"
                    :true-value="true"
                    :disabled="!isEditing"
                    hide-details
                ></v-switch>
              </td>
            </tr>
            </tbody>
          </v-simple-table>
          <v-toolbar
              class="mt-5 mb-5"
              flat
              color="indigo"
              dark
          >
            <v-toolbar-title>
              مبانی محاسباتی حقوق و دستمزد کارگاه {{ item.name }}
            </v-toolbar-title>
          </v-toolbar>

          <v-simple-table class="">
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-center">
                  عنوان حقوق و مزایا
                </th>
                <th class="text-center">
                  نرخ قانونی اضافه بر مزد
                </th>

                <th class="text-center">
                  محاسبه بر مبنای
                </th>
                <th class="text-center">
                  نرخ پبش فرض اضافه بر مزد
                </th>


              </tr>
              </thead>
              <tbody>
              <tr>
                <td>عائله مندی</td>
                <td>
                  <ratio
                      v-on:keypress="NumbersOnly"
                      class="currency-input"
                      v-model="aele"
                      :disabled="true"
                  >
                  </ratio>
                </td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.aele_mandi_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <ratio
                      v-on:keypress="NumbersOnly"
                      class="currency-input"
                      v-model="item.aele_mandi_nerkh"
                      :disabled="!isEditing"
                  >
                  </ratio>
                </td>
              </tr>

              <tr>
                <td>اضافه کاری</td>
                <td>
                  <percent v-model="ezafe" :disabled="true"></percent>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.ezafe_kari_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <percent v-model="item.ezafe_kari_nerkh" :disabled="!isEditing"></percent>
                </td>
              </tr>
              <tr>
                <td>تعطیل کاری</td>
                <td>
                  <percent v-model="tatil" :disabled="true"></percent>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.tatil_kari_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />

                </td>
                <td>
                  <percent v-model="item.tatil_kari_nerkh" :disabled="!isEditing"></percent>
                </td>
              </tr>
              <tr>
                <td>کسر کار</td>
                <td>
                  <v-text-field append-icon="fa-percent"
                                class="currency-input"
                                v-model="kasr" :disabled="true"></v-text-field>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.kasre_kar_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <percent v-model="item.kasre_kar_nerkh" :disabled="!isEditing"></percent>
                </td>
              </tr>
              <tr>
                <td>شب کاری</td>
                <td>
                  <percent v-model="shab" :disabled="true"></percent>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.shab_kari_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <percent v-model="item.shab_kari_nerkh" :disabled="!isEditing"></percent>
                </td>
              </tr>
              <tr>
                <td>نوبت کاری صبح و عصر</td>
                <td>
                  <percent v-model="nobat_sob_asr" :disabled="true"></percent>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_sob_asr_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_sob_asr_nerkh" :disabled="!isEditing"></percent>
                </td>

              </tr>
              <tr>
                <td>نوبت کاری صبح و شب</td>
                <td>
                  <percent v-model="nobat_sob_shab" :disabled="true"></percent>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_sob_shab_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_sob_shab_nerkh" :disabled="!isEditing"></percent>
                </td>

              </tr>
              <tr>
                <td>نوبت کاری عصر و شب</td>
                <td>
                  <percent v-model="nobat_asr_shab" :disabled="true"></percent>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_asr_shab_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_asr_shab_nerkh" :disabled="!isEditing"></percent>
                </td>

              </tr>
              <tr>
                <td>نوبت کاری صبح و عصر و شب</td>
                <td>
                  <percent v-model="nobat_sob_asr_shab" :disabled="true"></percent>
                </td>

                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_sob_asr_shab_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="!isEditing"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_sob_asr_shab_nerkh" :disabled="!isEditing"></percent>
                </td>
              </tr>
              </tbody>

            </template>
          </v-simple-table>

        </template>
        <v-btn
            class="light-blue white--text mt-6 mb-6  mr-2 float-left"
            @click="$router.push('/panel/workshop/' + item.id + '/')"
        >بازگشت به کارگاه

        </v-btn>

      </m-form>
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
import percent from "@/components/scomponents/Percent";
import ratio from "@/components/scomponents/Ratio";


export default {
  name: "WorkshopForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    WorkshopSettingForm,
    SummaryWorkshopList,
    WorkshopList,
    mtime,
    TreeSelect,
    citySelect,
    TenderList,
    MDatatable,
    TransactionForm,
    money,
    mobile,
    WorkTitleSelect,
    percent,
    ratio
  },
  props: {
    id: {},
  },
  data() {
    return {
      TAX_EMPLOYER_TYPES: [
        {name: '7/7', value: 1},
        {name: '2/7', value: 2},
      ],
      ILLNESS_TYPES: [
        {name: 'در پرداخت لحاظ شود', value: true},
        {name: 'در پرداخت لحاظ نشود', value: false},
      ],
      BASE_PAY_TYPES: [
        {name: 'مزد مبنا بر اساس مدل روزانه', value: 'd'},
        {name: 'مزد مبنای ماهانه', value: 'm'},
      ],
      PAY_TYPES: [
        {name: 'حداقل حقوق روزانه', value: 'd'},
        {name: 'مزد مبنا', value: 'b'},
      ],
      SANAVAT_PAY_TYPES: [
        {name: 'حداقل حقوق روزانه اداره کار', value: 'd'},
        {name: 'مزد مبنا', value: 'b'},
      ],
      EYDI_PAY_TYPES: [
        {name: 'حداقل حقوق روزانه اداره کار', value: 'd'},
        {name: 'مزد مبنا با رعایت سقف قانونی', value: 'b'},
      ],
      LEAVE_PAY_TYPES: [
        {name: 'حداقل حقوق روزانه اداره کار', value: 'd'},
        {name: 'جمع تمام مزایای حکم کارگزینی', value: 'h'},
      ],
      SANAVAT_TYPES: [
        {name: 'پیوسته', value: 'c'},
        {name: 'نا پیوسته', value: 'n'},
      ],
      HAGHE_SANAVAT_TYPES: [
        {name: 'قطعی', value: 'c'},
        {name: 'علی الحساب', value: 'o'},
      ],
      REWARD_TYPES: [
        {name: 'ماهانه', value: 'm'},
        {name: 'سالانه', value: 'y'},
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
      aele: 3,
      ezafe: 0.4,
      kasr: '---',
      tatil: 0.4,
      shab: 0.35,
      nobat_sob_shab: 0.225,
      nobat_sob_asr: 0.1,
      nobat_asr_shab: 0.225,
      nobat_sob_asr_shab: 0.15,
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
      this.$router.push('/panel/setting/' + item.id)
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

