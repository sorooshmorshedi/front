<template>

  <div>
    <v-card>
      <m-form
          :show-submit-and-clear-btn="false"
          :show-navigation-btns="false"
          :show-actions="true"
          :showList="false"
          :can-edit="!item.is_verified && !is_pop"
          :canDelete="false"
          :canSubmit="!item.is_verified && !is_pop"
          :showClearBtn="false"
          :showListBtn="false"
          :isEditing.sync="isEditin"
          @submit="submit"
          @delete="deleteItem"
          ref="workshopSettingForm"
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
                      :disabled="true"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                      label="نحوه محاسبه حق سنوات "
                      :items="HAGHE_SANAVAT_TYPES"
                      v-model="item.haghe_sanavat_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-autocomplete
                      label="نحوه لحاظ مرخصی استعلاجی جهت پرداخت عائله مندی "
                      :items="ILLNESS_TYPES"
                      v-model="item.illness_absence_in_real_work"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
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
                      :disabled="true"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <percent label="نرخ حق بیمه سهم کارفرما" v-model="item.employee_insurance_nerkh"
                           :disabled="true"
                  ></percent>
                </v-col>
                <v-col cols="12" md="3">
                  <percent label="نرخ حق بیمه سهم بیمه شده" v-model="item.worker_insurance_nerkh"
                           :disabled="true"
                  ></percent>
                </v-col>
                <v-col cols="12" md="3">
                  <percent label="نرخ حق بیمه سهم بیکاری" v-model="item.unemployed_insurance_nerkh"
                           :disabled="true"
                  ></percent>
                </v-col>
                <v-col cols="12" md="3">
                  <percent label="نرخ تبصره 1 ماده 86 ق.م.م" v-model="item.made_86_nerkh"
                           :disabled="true"
                  ></percent>
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
              <th class="text-center" colspan="2">
                نحوه شناسایی
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>عیدی و پاداش</td>
              <td >
                <v-autocomplete
                    :items="EYDI_PAY_TYPES"
                    v-model="item.eydi_padash_pay_type"
                    item-text="name"
                    item-value="value"
                    :disabled="true"
                />
              </td>
              <td colspan="2">
                <v-autocomplete
                    :items="REWARD_TYPES"
                    v-model="item.eydi_padash_identification"
                    item-text="name"
                    item-value="value"
                    :disabled="true"
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
                    :disabled="true"
                />
              </td>
              <td colspan="2">
                <v-autocomplete
                    :items="REWARD_TYPES"
                    v-model="item.haghe_sanavat_identification"
                    item-text="name"
                    item-value="value"
                    :disabled="true"
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
                    :disabled="true"
                />
              </td>
              <td>
                <v-text-field v-model="item.save_leave_limit"
                              :disabled="true"
                              class="currency-input"
                              label="حد نصاب مرخصی سالانه"

                ></v-text-field>
              </td>
              <td class="pr-10 ">
                <v-switch
                    v-model="item.save_absence_limit"
                    label="محاسبه تا 9 روز"
                    color="success"
                    :false-value="false"
                    :true-value="true"
                    :disabled="true"
                    hide-details
                ></v-switch>
                <v-switch
                    v-model="item.save_absence_transfer_next_year"
                    label="انتقال به سال بعد"
                    color="success"
                    :false-value="false"
                    :true-value="true"
                    :disabled="true"
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
                  محاسبه بر مبنای
                </th>
                <th class="text-center">
                  نرخ پبش فرض مازاد بر مزد
                </th>


              </tr>
              </thead>
              <tbody>
              <tr>
                <td>عائله مندی</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.aele_mandi_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <ratio
                      v-on:keypress="NumbersOnly"
                      class="currency-input"
                      v-model="item.aele_mandi_nerkh"
                      :disabled="true"
                  >
                  </ratio>
                </td>
              </tr>

              <tr>
                <td>اضافه کاری</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.ezafe_kari_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <percent v-model="item.ezafe_kari_nerkh"  :disabled="true"
                  ></percent>
                </td>
              </tr>
              <tr>
                <td>تعطیل کاری</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.tatil_kari_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />

                </td>
                <td>
                  <percent v-model="item.tatil_kari_nerkh" :disabled="true"></percent>
                </td>
              </tr>
              <tr>
                <td>کسر کار</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.kasre_kar_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <percent v-model="item.kasre_kar_nerkh" :disabled="true"></percent>
                </td>
              </tr>
              <tr>
                <td>شب کاری</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.shab_kari_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <percent v-model="item.shab_kari_nerkh" :disabled="true"></percent>
                </td>
              </tr>
              <tr>
                <td>نوبت کاری صبح و عصر</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_sob_asr_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_sob_asr_nerkh" :disabled="true"></percent>
                </td>

              </tr>
              <tr>
                <td>نوبت کاری صبح و شب</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_sob_shab_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_sob_shab_nerkh" :disabled="true"></percent>
                </td>

              </tr>
              <tr>
                <td>نوبت کاری عصر و شب</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_asr_shab_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_asr_shab_nerkh" :disabled="true"></percent>
                </td>

              </tr>
              <tr>
                <td>نوبت کاری صبح و عصر و شب</td>
                <td>
                  <v-autocomplete
                      :items="PAY_TYPES"
                      v-model="item.nobat_kari_sob_asr_shab_pay_type"
                      item-text="name"
                      item-value="value"
                      :disabled="true"
                  />
                </td>
                <td>
                  <percent v-model="item.nobat_kari_sob_asr_shab_nerkh" :disabled="true"></percent>
                </td>
              </tr>
              </tbody>

            </template>
          </v-simple-table>

        </template>
      </m-form>

    </v-card>
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
import percent from "@/components/scomponents/Percent";
import ratio from "@/components/scomponents/Ratio";


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";
import WorkshopList from "@/modules/payroll/workshop/WorkshopList";
import SummaryWorkshopList from "@/modules/payroll/workshop/SummaryWorkshopList";


export default {
  name: "WorkshopSettingForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryWorkshopList,
    WorkshopList, mtime, TreeSelect, citySelect, MDatatable, TransactionForm, money, percent, ratio
  },
  props: {
    id: {},
    is_pop: false,
    show_edit: false,
    isEditing: false,
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

      printUrl: 'payroll/workshop/',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/workshop",
      permissionBasename: "workshop",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      isEditin: false,
      setting_workshop: null,
      items: null,
      factors: [],
      PathLevels,
      first: false,
      msg: 'سالانه',
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
    };
  },
  mounted() {
    this.isEditing = true
  },
  computed: {
    headers() {
    },
  },
  methods: {
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
      this.notify(' ثبت تنظیمات کارگاه رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

