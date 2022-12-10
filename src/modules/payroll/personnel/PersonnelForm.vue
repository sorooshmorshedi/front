<template>
  <div>
    <m-form
        title="ثبت پرسنل"
        :showList="false"
        :listRoute="{name:'PersonnelList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :show-navigation-btns="false"
        :isEditing.sync="isEditing"
        :show-submit-and-clear-btn="false"
        :show-actions="!item.verified"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="workshopForm"

    >

      <template>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field label="* نام" v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]" v-model="item.name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* نام خانوادگی" v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]"  v-model="item.last_name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* نام پدر" v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]" v-model="item.father_name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="کد پرسنلی" v-on:keypress="NumbersOnly" v-model="item.personnel_code" background-color="white" :disabled="true">
            </v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* ملیت"
                :items="NATIONALITY_TYPE"
                v-model="item.nationality"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-if="item.nationality == 1" label="* کشور" v-model="iran" background-color="white" :disabled="true"/>
            <v-autocomplete
                v-if="item.nationality !== 1"
                :rules="[rules.required,]"
                label="* کشور"
                :items="Country"
                v-model="item.country"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />

          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* جنسیت"
                :items="GENDER_TYPE"
                v-model="item.gender"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3" v-if="item.nationality !== 2">
            <v-text-field v-show="false" v-if="item.gender == 'f'" label="* خدمت سربازی" v-model="item.military_service = 'x'" background-color="white" :disabled="true"/>
            <v-text-field v-show="item.gender == 'f'" label="* خدمت سربازی" v-model="female" background-color="white" :disabled="true"/>
            <v-autocomplete
                :rules="[rules.required,]"
                v-if="item.gender !== 'f' "
                label="* خدمت سربازی"
                :items="MILITARY_SERVICE_STATUS"
                v-model="item.military_service"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3" v-if="item.nationality == 2">
            <v-text-field v-on:keypress="NumbersOnly" :rules="[rules.required,]" label="* کد فراگیر تابعیت"  v-model="item.national_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3" v-if="item.nationality !== 2">
            <v-text-field v-on:keypress="NumbersOnly" :rules="[rules.required,]" label="* شماره شناسنامه" counter v-model="item.identity_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3" v-if="item.nationality !== 2">
            <v-text-field v-on:keypress="NumbersOnly" :rules="[rules.required,]" label="* کد ملی"  v-model="item.national_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* وضعیت تاهل"
                :items="MARITAL_STATUS_TYPES"
                v-model="item.marital_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label=" تعداد فرزندان" v-model="item.number_of_childes"  background-color="white" :disabled="true"/>
          </v-col>
          <v-col cols="12" md="3">
            <date v-model="item.date_of_birth" label="* تاریخ تولد" :default="false" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="3" v-if="item.nationality !== 2">
            <date v-model="item.date_of_exportation" label="* تاریخ صدور شناسنامه" :default="false" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="2" v-if="item.nationality !== 2">
            <city-select  v-if="item.nationality !== 2" label=" * محل تولد "
                         v-model="item.location_of_birth"  background-color="white"
                         :disabled="!isEditing" :rules="[rules.required,]"></city-select>
          </v-col>
          <v-col cols="12" md="3" v-if="item.nationality == 2">
            <v-text-field v-if="item.nationality == 2"
                          v-on:keypress="NoneNumbersOnly"
                          label="* محل تولد"
                          v-model="item.location_of_foreign_birth"
                          :rules="[rules.required,]"
                          background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2" v-if="item.nationality !== 2">
            <city-select label="* محل صدور شناسنامه"
                         v-model="item.location_of_exportation"
                         background-color="white" :disabled="!isEditing"
                         :rules="[rules.required,]"></city-select>
          </v-col>
          <v-col cols="12" md="2" v-if="item.nationality !== 2">
            <city-select  label="بخش محل صدور" v-model="item.sector_of_exportation"   background-color="white" :disabled="!isEditing"></city-select>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="تلفن ثابت " v-model="item.phone_number"   background-color="white" :disabled="!isEditing" v-on:keypress="NumbersOnly" />
          </v-col>
          <v-col cols="12" md="1">
            <v-text-field label="کد تلفن" v-model="item.city_phone_code"   background-color="white" :disabled="!isEditing" v-on:keypress="NumbersOnly" />
          </v-col>
          <v-col cols="12" md="2">
            <city-select label="* شهر محل سکونت" v-model="item.city"  background-color="white" :disabled="!isEditing" :rules="[rules.required,]"></city-select>
          </v-col>
          <v-col cols="12" md="5">
            <v-text-field label="* آدرس " v-model="item.address"   background-color="white" :disabled="!isEditing"  :rules="[rules.required,]"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="* کد پستی " v-model="item.postal_code"   background-color="white" :disabled="!isEditing" v-on:keypress="NumbersOnly" :rules="[rules.required,]"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* شماره همراه 1" v-model="item.mobile_number_1" background-color="white" :disabled="!isEditing" v-on:keypress="NumbersOnly" :rules="[rules.required,]"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label=" شماره همراه 2 " v-model="item.mobile_number_2" background-color="white" :disabled="!isEditing" v-on:keypress="NumbersOnly" />
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                @change="item.insurance_code = null"
                v-model="item.insurance"
                label= 'بیمه تامین اجتماعی دارد'
                :disabled="!isEditing"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-on:keypress="NumbersOnly"
                          :rules="[rules.required,]"
                          label=" شماره بیمه" v-model="item.insurance_code"
                          background-color="white"
                          :disabled="!item.insurance || !isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                @change="item.field_of_study = null"
                :rules="[rules.required,]"
                label="* مدرک تحصیلی"
                :items="DEGREE_TYPE"
                v-model="item.degree_education"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
                v-on:keypress="NoneNumbersOnly"
                :rules="[rules.required,]"
                label="* رشته تحصیلی"
                v-model="item.field_of_study"
                background-color="white"
                :disabled="!isEditing || item.degree_education == 1 || item.degree_education == 2 "/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* نوع دانشگاه"
                :items="UNIVERSITY_TYPES"
                v-model="item.university_type"
                item-text="name"
                item-value="value"
                :disabled="!isEditing || item.degree_education == 1 || item.degree_education == 2 || item.degree_education == 3 "/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* نام دانشگاه"
                          v-on:keypress="NoneNumbersOnly"
                          :rules="[rules.required,]"
                          v-model="item.university_name"
                          background-color="white"
                          :disabled="!isEditing || item.degree_education == 1 || item.degree_education == 2 || item.degree_education == 3 "/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                v-on:keypress="NoneNumbersOnly"
                :rules="[rules.required,]"
                label="* نام بانک"
                :items="BANK_NAMES"
                v-model="item.account_bank_name"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"/>

          </v-col>
          <v-col cols="12" md="3">

            <v-text-field :rules="[rules.required,]" v-on:keypress="NumbersOnly" label="* شماره حساب حقوق" v-model="item.account_bank_number"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <cart :rules="[rules.max_cart, rules.min_cart, rules.required]"
                  v-on:keypress="NumbersTo16Only"
                  ref="cart"
                  label="* شماره کارت حقوق"
                  v-model="item.bank_cart_number"
                  :disabled="!isEditing">

            </cart>
          </v-col>
          <v-col cols="12" md="3">
            <cart :rules="[rules.max_sheba, rules.min_sheba, rules.required]"
                  v-on:keypress="NumbersTo24Only"
                  ref="sheba"
                  label="* شماره شبا" v-model="item.sheba_number"
                  :disabled="!isEditing"
                  append-icon="IR">
            </cart>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* وضعیت پرسنل "
                :items="PERSONNEL_STATUS"
                v-model="item.is_personnel_active"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>

        </v-row>
      </template>
      <v-btn
          class="light-blue white--text mt-6  mr-2 float-left"
          @click="verifyPersonnel(item.id)"
          v-if="item.id && !item.verified" >ثبت نهایی</v-btn>
      <v-btn
          class="red white--text mt-6  mr-2 float-left"
          @click="verifyUnPersonnel(item.id)"

          v-if="item.id && item.verified" > خروج از وضعیت نهایی</v-btn>

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
import cart from "@/components/scomponents/Cart";


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";
import {range} from "lodash";


export default {
  name: "PersonnelForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money, cart},
  props: {
    id: {},
  },
  data() {
    return {
      NATIONALITY_TYPE: [
        {name: ' ایرانی', value: 1},
        {name: 'غیر ایرانی', value: 2},
      ],
      PERSONNEL_STATUS: [
        {name: ' فعال', value: true},
        {name: 'غیر فعال', value: false},
      ],
      GENDER_TYPE: [
        {name: ' آقا', value: 'm'},
        {name: 'خانم', value: 'f'},
      ],
      MILITARY_SERVICE_STATUS: [
        {name: ' انجام داده', value: 'd'},
        {name: 'انجام نداده', value: 'n'},
        {name: 'معاف', value: 'e'},
        {name: 'هیچ کدام', value: 'x'},
      ],
      MARITAL_STATUS_TYPES: [
        {name: ' مجرد', value: 's'},
        {name: 'متاهل', value: 'm'},
        {name: 'سرپرست فرزند', value: 'c'},
      ],
      DEGREE_TYPE: [
        {name: ' کم سواد', value: 1},
        {name: ' زیر دیپلم', value: 2},
        {name: ' دیپلم', value: 3},
        {name: 'کاردانی', value: 4},
        {name: 'لیسانس', value: 5},
        {name: 'فوق لیسانس', value: 6},
        {name: 'دکترا', value: 7},
        {name: 'فوق دکترا', value: 8},
      ],

      BANK_NAMES: [
        {name: ' آینده', value: 'BAYAN'},
        {name: 'استاندارد چارترد', value: 'CHART'},
        {name: ' اقتصاد نوین', value: 'BEGHTE'},
        {name: ' ایران زمین ', value: 'ZAMIN'},
        {name: ' پارسیان', value: 'BPARSI'},
        {name: ' پاسارگاد', value: 'BPASAR'},
        {name: 'پست بانک ', value: 'BPOST'},
        {name: ' توسعه صادرات  ایران', value: 'BEDIRA'},
        {name: ' تجارت ', value: 'BTEJAR'},
        {name: ' تجاری ایران و اروپا', value: 'EURO'},
        {name: 'تعاون اسلامی برای سرمایه‌گذاری', value: 'ESLA'},
        {name: ' توسعه تعاون', value: 'BCDEVE'},
        {name: ' خاورمیانه ', value: 'KHAVA'},
        {name: ' دی', value: 'BDAY'},
        {name: ' رفاه کارگران ', value: 'BREFAH'},
        {name: ' سامان ', value: 'BSAMAN'},
        {name: ' سرمایه ', value: 'BSARMA'},
        {name: ' سپه ', value: 'BSEPAH'},
        {name: ' سینا ', value: 'BSINA'},
        {name: ' شهر', value: 'BCITY'},
        {name: ' صنعت و معدن ', value: 'BINDMI'},
        {name: ' صادرات ', value: 'BSADER'},
        {name: 'فیوچر بانک (المستقبل)', value: 'FUTU'},
        {name: ' قرض الحسنه رسالت ', value: 'BRESALA'},
        {name: ' قرض الحسنه مهر ایران', value: 'BGHARZ'},
        {name: ' کارآفرین', value: 'BKARAF'},
        {name: ' کشاورزی', value: 'BKESHA'},
        {name: ' گردشگری ', value: 'BTOURI'},
        {name: ' مسکن', value: 'BMASKA'},
        {name: ' ملت', value: 'BMELLA'},
        {name: '  ملی ایران', value: 'BMELLI'},
        {name: ' مشترک ایران - ونزوئلا ', value: 'VENE'},
        {name: 'مؤسسه اعتباری غیربانکی کاسپین ', value: 'CASP'},
        {name: 'مؤسسه اعتباری غیربانکی  توسعه ', value: 'TOSE'},
        {name: 'مؤسسه اعتباری غیربانکی  ملل ', value: 'MELAL'},
        {name: 'مؤسسه اعتباری غیربانکی نور ', value: 'NOR'},
      ],
      UNIVERSITY_TYPES: [
        {name: ' دولتی', value: 'st'},
        {name: 'آزاد', value: 'op'},
        {name: 'غیر انتفاعی', value: 'np'},
      ],
      Country: [
        {name: ' انگلیس', value: 'انگلیس'},
        {name: 'آلمان', value: 'آلمان'},
        {name: 'افغانستان', value: 'افغانستان'},
      ],

      testt: '',
      printUrl: 'payroll/personnel/all',
      isWorkshopConfirmed: false,
      worshopId: 0,
      baseUrl: "payroll/personnel",
      permissionBasename: "personnel",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      isDefinable: false,
      myClass: '',
      factors: [],
      cart_number: '################',
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      female: 'هیچ کدام',
      iran: 'ایران',
      performClearForm: true,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        max_cart: v => v.length <= 19 || 'Max 19 characters',
        max_sheba: v => v.length <= 29 || 'max 29 characters',
        min_cart: v => v.length >= 19 || 'Min 19 characters',
        min_sheba: v => v.length >= 29 || 'Min 29 characters',
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "نام",
          value: "name",
        },
        {
          text: "نام خانوادگی",
          value: "last_name",
        },
        {
          text: "نام پدر",
          value: "father_name",
        },
        {
          text: "کد پرسنلی",
          value: "personnel_code",
        },
        {
          text: "ملیت",
          value: "nationality",
        },
        {
          text: "جنسیت",
          value: "gender",
        },
        {
          text: "خدمت سربازی",
          value: "military_service",
        },
        {
          text: "شماره شناسنامه",
          value: "identity_code",
        },

        {
          text: "کد ملی",
          value: "national_code",
        },
        {
          text: "وضعیت تاهل",
          value: "marital_status",
        },
        {
          text: "تعداد فرزندان",
          value: "number_of_childes",
        },
        {
          text: "تاریخ تولد",
          value: "date_of_birth",
        },
        {
          text: "تاریخ صدور شناسنامه",
          value: "date_of_exportation",
        },
        {
          text: "محل تولد",
          value: "location_of_birth",
        },
        {
          text: "محل صدور شناسنامه",
          value: "location_of_exportation",
        },
        {
          text: "بخش محل صدور",
          value: "sector_of_exportation",
        },
        {
          text: "کد تلفن",
          value: "city_phone_code",
        },
        {
          text: "تلفن ثابت",
          value: "phone_number",
        },
        {
          text: "آدرس",
          value: "address",
        },
        {
          text: "کد پستی",
          value: "postal_code",
        },
        {
          text: "شماره همراه 1",
          value: "mobile_number_1",
        },
        {
          text: "شماره همراه 2",
          value: "mobile_number_2",
        },
        {
          text: "بیمه تامین اجتماعی",
          value: "insurance",
        },
        {
          text: "شماره بیمه",
          value: "insurance_code",
        },
        {
          text: "مدرک تحصیلی",
          value: "degree_education",
        },
        {
          text: "رشته تحصیلی",
          value: "field_of_study",
        },
        {
          text: "نوع دانشگاه",
          value: "university_type",
        },
        {
          text: "نام دانشگاه",
          value: "university_name",
        },
        {
          text: "نام بانک",
          value: "account_bank_name",
        },
        {
          text: "شماره حساب حقوق",
          value: "account_bank_number",
        },
        {
          text: "شماره کارت حقوق",
          value: "bank_cart_number",
        },
        {
          text: "شماره شبا",
          value: "sheba_number",
        },
      ];

    },
  },
  mounted() {
    if (this.$route.params.id) {
      this.isEditing = false
    }
  },
  methods: {
    put_under_line(str) {
      this.testt = this.cardNumberSpace(str, 4, '-')
      for (let i in range(0, (this.testt.length) + 1)){
        this.cart_number = this.testt.replace('-', '')
        console.log(this.cart_number)
      }},
    cardNumberSpace: function spacify(str, after, c) {
      if (!str) {
        return '';
      }
      var v = str.replace(/[^\dA-Z]/g, ''),
          reg = new RegExp(".{" + after + "}", "g");
      return v.replace(reg, function (a) {
        return a + c;
      }).replace(/[^0-9]+$/, "");
    },

    NumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();;
      } else {
        return true;
      }
    },
    NumbersTo16Only(evt) {
      if (this.$refs.cart.$props.value.length >= 16){
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
    NumbersTo24Only(evt) {
      if (this.$refs.sheba.$props.value.length >= 24){
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

    verifyPersonnel(id){
      this.request({
        url: this.endpoint(`payroll/personnel/verify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  پرسنل نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })

    },
    verifyUnPersonnel(id){
      this.request({
        url: this.endpoint(`payroll/personnel/unverify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('پرسنل از نهایی خارج شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })

    },
    set(value){

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
      this.notify(' ثبت پرسنل رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

