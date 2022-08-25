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
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="workshopForm"

    >

      <template>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field label="* نام" v-model="item.name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* نام خانوادگی" v-model="item.last_name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* نام پدر" v-model="item.father_name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="کد پرسنلی" v-model="item.personnel_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ملیت"
                :items="NATIONALITY_TYPE"
                v-model="item.nationality"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* کشوز" v-model="item.country" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* جنسیت"
                :items="GENDER_TYPE"
                v-model="item.gender"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* خدمت سربازی"
                :items="MILITARY_SERVICE_STATUS"
                v-model="item.military_service"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* شماره شناسنامه" v-model="item.identity_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* کد ملی" v-model="item.national_code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* وضعیت تاهل"
                :items="MARITAL_STATUS_TYPES"
                v-model="item.marital_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label=" تعداد فرزندان" v-model="item.number_of_childes" readonly  background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <date v-model="item.date_of_birth" label="* تاریخ تولد" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <date v-model="item.date_of_exportation" label="* تاریخ صدور شناسنامه" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label=" محل تولد " v-model="item.location_of_birth"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label=" محل صدور شناسنامه" v-model="item.location_of_exportation"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="بخش محل صدور" v-model="item.sector_of_exportation"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="1">
            <v-text-field label="* کد تلفن" v-model="item.city_phone_code"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="* تلفن ثابت " v-model="item.phone_number"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="7">
            <v-text-field label="* آدرس " v-model="item.address"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="* کد پستی " v-model="item.postal_code"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* شماره همراه 1" v-model="item.mobile_number_1" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label=" شماره همراه 2 " v-model="item.mobile_number_2" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.insurance"
                label= 'ّبیمه تامین اجتماعی دارد'
                :disabled="!isEditing"
            ></v-switch>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label=" شماره بیمه" v-model="item.insurance_code"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* مدرک تحصیلی"
                :items="DEGREE_TYPE"
                v-model="item.degree_education"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* رشته تحصیلی" v-model="item.field_of_study"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="نوع دانشگاه"
                :items="UNIVERSITY_TYPES"
                v-model="item.university_type"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="نام دانشگاه" v-model="item.university_name"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* نام بانک " v-model="item.account_bank_name"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* شماره حساب حقوق" v-model="item.account_bank_number"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* شماره کارت حقوق" v-model="item.bank_cart_number"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field label="* شماره شبا" v-model="item.sheba_number"   background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
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
          v-if="item.id && !item.is_personnel_verified" >ثبت نهایی</v-btn>

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
  name: "PersonnelForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      NATIONALITY_TYPE: [
        {name: ' ایرانی', value: 'i'},
        {name: 'غیر ایرانی', value: 'a'},
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
        {name: 'هبچ کدام', value: 'x'},
      ],
      MARITAL_STATUS_TYPES: [
        {name: ' مجرد', value: 's'},
        {name: 'متاهل', value: 'm'},
        {name: 'سرپرست فرزند', value: 'c'},
      ],
      DEGREE_TYPE: [
        {name: ' زیر دیپلم', value: 'un'},
        {name: ' دیپلم', value: 'di'},
        {name: 'کاردانی', value: 'as'},
        {name: 'لیسانس', value: 'ba'},
        {name: 'فوق لیسانس', value: 'ma'},
        {name: 'دکترا', value: 'do'},
        {name: 'فوق دکترا', value: 'pd'},
      ],
      UNIVERSITY_TYPES: [
        {name: ' دولتی', value: 'st'},
        {name: 'آزاد', value: 'op'},
        {name: 'غیر انتفاعی', value: 'np'},
      ],


      printUrl: 'payroll/personnel/all',
      isWorkshopConfirmed: false,
      worshopId: 0,
      baseUrl: "payroll/personnel",
      permissionBasename: "personnel",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      myClass: '',
      factors: [],
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

  methods: {
    verifyPersonnel(id){
      this.request({
        url: this.endpoint(`payroll/personnel/verify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify(' ثبت پرسنل تایید  شد', 'success')
          window.location.reload();
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
      this.notify(' ثبت پرسنل رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

