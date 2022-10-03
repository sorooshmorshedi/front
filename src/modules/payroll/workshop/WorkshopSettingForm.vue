<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="تنطیمات حقوق و مزایای شناور ماهیانه"
            :showList="false"
            :canDelete="false"
            :canSubmit="canSubmit"
            :showClearBtn="false"
            :showListBtn="false"
            :isEditing.sync="isEditing"
            @submit="submit"
            @delete="deleteItem"
            ref="workshopForm"
        >
          <template>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                    label="نام کارگاه "
                    class="currency-input"
                    v-model="item.name"
                    disabled="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                    label="کد کارگاه"
                    class="currency-input"
                    v-model="item.code"
                    disabled="true"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                    label="کارفرما"
                    class="currency-input"
                    v-model="item.employer_name"
                    disabled="true"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-8 mb-6">
              <v-col cols="12" md="12">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                        label="نحوه محاسبه سنوات "
                        :items="SANAVAT_TYPES"
                        v-model="item.sanavat_type"
                        item-text="name"
                        item-value="value"
                        :disabled="!isEditing"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                        label="نحوه محاسبه حق سنوات "
                        :items="HAGHE_SANAVAT_TYPES"
                        v-model="item.haghe_sanavat_type"
                        item-text="name"
                        item-value="value"
                        :disabled="!isEditing"
                    />
                  </v-col>

                  <v-col cols="12" md="4">
                    <v-autocomplete
                        label="نحوه محاسبه مزد مبنا"
                        :items="BASE_PAY_TYPES"
                        v-model="item.base_pay_type"
                        item-text="name"
                        item-value="value"
                        :disabled="!isEditing"
                    />

                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                        label="نرخ حق بیمه سهم کارفرما"
                        class="currency-input"
                        v-model="item.employee_insurance_nerkh"
                        :disabled="!isEditing"

                    ></v-text-field>

                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                        label="نرخ حق بیمه سهم بیمه شده"
                        class="currency-input"
                        v-model="item.worker_insurance_nerkh"
                        :disabled="!isEditing"

                    ></v-text-field>

                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                        label="نرخ حق بیمه سهم بیکاری"
                        class="currency-input"
                        v-model="item.unemployed_insurance_nerkh"
                        :disabled="!isEditing"

                    ></v-text-field>

                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                        label="حداقل حقوق اداره کار"
                        class="currency-input"
                        v-model="item.hade_aghal_hoghoogh"
                        :disabled="!isEditing"

                    ></v-text-field>

                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                        label="نرخ تبصره 1 ماده 86 ق.م.م"
                        class="currency-input"
                        v-model="item.made_86_nerkh"
                        :disabled="!isEditing"

                    ></v-text-field>

                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                        label="معافیت مالیاتی حق بیمه سهم بیمه شونده"
                        :items="TAX_EMPLOYER_TYPES"
                        v-model="item.tax_employer_type"
                        item-text="name"
                        item-value="value"
                        :disabled="!isEditing"
                    />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </template>
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
                    :items="PAY_TYPES"
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
                    :items="PAY_TYPES"
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
                    hide-details
                ></v-switch>
                <v-switch
                    v-model="item.save_absence_transfer_next_year"
                    label="انتقال به سال بعد"
                    color="success"
                    :false-value="false"
                    :true-value="true"
                    hide-details
                ></v-switch>

              </td>

            </tr>

            </tbody>

          </v-simple-table>
        </m-form>

      </v-col>
      <v-divider vertical inset></v-divider>
      <v-col cols="12" md="6">
        <v-simple-table class="mt-10">
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
                نرخ پبش فرض
              </th>


            </tr>
            </thead>
            <tbody>
            <tr>
              <td>اضافه کاری</td>
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
                <v-text-field
                    class="currency-input"
                    v-model="item.ezafe_kari_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
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
                    :disabled="!isEditing"
                />

              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="item.tatil_kari_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
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
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="item.kasre_kar_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
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
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="item.shab_kari_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>عائله مندی</td>
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
                <v-text-field
                    class="currency-input"
                    v-model="item.aele_mandi_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
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
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="item.nobat_kari_sob_asr_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
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
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="item.nobat_kari_sob_shab_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
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
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="item.nobat_kari_asr_shab_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
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
                    :disabled="!isEditing"
                />
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="item.nobat_kari_sob_asr_shab_nerkh"
                    :disabled="!isEditing"

                ></v-text-field>
              </td>
            </tr>
            </tbody>

          </template>
        </v-simple-table>

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


export default {
  name: "WorkshopSettingForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryWorkshopList,
    WorkshopList, mtime, TreeSelect, citySelect, MDatatable, TransactionForm, money
  },
  props: {
    id: {},
  },
  data() {
    return {
      TAX_EMPLOYER_TYPES: [
        {name: '7/7', value: 1},
        {name: '2/7', value: 2 / 7},
      ],
      BASE_PAY_TYPES: [
        {name: 'مزد مبنای روزانه', value: 'd'},
        {name: 'مزد مبنای ماهانه', value: 'm'},
      ],
      PAY_TYPES: [
        {name: 'حداقل حقوق روزانه', value: 'd'},
        {name: 'مزد مبنا', value: 'b'},
      ],
      LEAVE_PAY_TYPES: [
        {name: 'حداقل حقوق روزانه', value: 'd'},
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
      setting_workshop: null,
      items: null,
      factors: [],
      PathLevels,
      msg: 'سالانه',
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
    };
  },
  computed: {
    headers() {
    },
  },
  methods: {
    to(item) {
      return {
        name: 'WorkshopSettingDetail',
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

