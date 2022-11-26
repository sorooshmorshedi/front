<template>
  <v-card class=" "
          elevation="3"
          outlined
          tile>
    <v-toolbar color="indigo darken-2">
      <v-toolbar-title class="white--text">محاسبه حقوق</v-toolbar-title>
    </v-toolbar>
    <v-row class="mt-4 mr-3">
      <v-col  class="mt-5" cols="12" md="2">
        <v-autocomplete
            v-if="!this.workshop"
            label="کارگاه"
            :items="workshops"
            v-model="search_workshop"
            :disabled="list_generated"
            item-text="name"
            @change="getWorkshopListOfPay"
            item-value="id"
        />
        <v-text-field
            label="کارگاه"
            v-if="this.workshop"
            disabled="true"
            v-show="false"
            v-model="search_workshop"
        ></v-text-field>
        <v-text-field
            label="کارگاه"
            v-if="this.workshop"
            disabled="true"
            v-model="this.workshop_name "
        ></v-text-field>
      </v-col>
      <v-col class="mt-5" cols="12" md="2">
        <v-autocomplete
            v-if="this.search_workshop"
            label="نوع محاسبه"
            :items="PAYMENT_TYPES"
            v-model="payment_type"
            :disabled="list_generated"
            item-text="name"
            item-value="value"
        />
      </v-col>
      <v-col class="mt-5" cols="12" md="2">
        <v-autocomplete
            v-if="!this.payment_type"
            label="بر اساس"
            :items="workshop_list_of_pay"
            v-model="copy_id"
            :disabled="list_generated"
            item-text="name"
            item-value="id"
        />
      </v-col>
    </v-row>
    <v-row v-if="search_workshop" class="pr-2 pl-2 pt-8 mr-3">
      <v-col cols="12" md="2">
        <v-text-field
            label="نام لیست"
            :disabled="list_generated"
            v-model="list_name"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="2">
        <v-text-field
            label="سال"
            v-model="this.serverNow.format('jYYYY') "
            disabled=true
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
            v-if="payment_type"
            label="ماه"
            :items="MONTHS"
            :disabled="list_generated"
            v-model="search_month"
            item-text="name"
            item-value="id"
        />
        <v-autocomplete
            v-if="!payment_type"
            label="ماه"
            :items="MONTHS"
            :disabled="list_generated"
            v-model="search_month"
            item-text="name"
            item-value="id"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
            label="وضعیت"
            :items="TYPES"
            :disabled="list_generated"
            v-model="list_status"
            item-text="name"
            item-value="value"
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
            label="بیمه و مالیات"
            :items="CALCULATE_TYPES"
            :disabled="list_generated"
            v-model="calculate"
            item-text="name"
            item-value="value"
        />
      </v-col>
    </v-row>
    <v-card-actions v-if="!list_generated" class="mt-4 d-flex justify-center justify-md-end mt-2"
    >
      <v-btn
          @click="getList"
          large
          v-if="payment_type"
          left
          class=" green white--text "
      >لیست پرسنل فعال
      </v-btn>
      <v-btn
          @click="createListOfPayByPervious"
          large
          v-if="!payment_type"
          left
          class=" green white--text "
      >ثبت حقوق و دستمزد
      </v-btn>

    </v-card-actions>
    <v-row v-if="list_generated && !calculateDone">
      <v-simple-table class="ma-6 " dense>
        <template v-slot:default>
          <thead class="style: blue lighten-4">
          <tr>
            <th class="text-center">
              نام و نام خانوادگی
            </th>
            <th class="text-center">
              ردیف پیمان
            </th>
            <th class="text-center">
              کسر کار (ساعت)
            </th>

            <th class="text-center">
              اضافه کاری (ساعت)
            </th>

            <th class="text-center">
              تعطیل کاری (ساعت)
            </th>
            <th class="text-center">
              شب کاری (ساعت)
            </th>
            <th class="text-center">
              نوبت کاری صبح و عصر (روز)
            </th>
            <th class="text-center">
              نوبت کاری صبح و شب (روز)
            </th>

            <th class="text-center">
              نوبت کاری عصر و شب (روز)
            </th>

            <th class="text-center">
              نوبت کاری صبح و عصر و شب (روز)
            </th>
            <th class="text-center">
              مزایای غیر مستمر غیرنقدی (ریال)
            </th>
            <th class="text-center">
              سایر اضافات (ریال)
            </th>
            <th class="text-center">
              هزینه های درمانی ماده 137 ق.م.م
            <th class="text-center">
              سایر حق بیمه پرداختی ماده 137 ق.م.م
            </th>
            <th class="text-center">
              معافیت مربوط به مناطق آزاد تجاری
            </th>
            <th class="text-center">
              معافیت قانون اجتناب از اخذ مالیات مضاعف
            </th>
            <th class="text-center">
              سایر معافیت های مالیات(ریال)
            </th>
            <th class="text-center">
              سایرکسورات (ریال)
            </th>
          </tr>
          </thead>
          <tbody class="grey lighten-4 ma-2">
          <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
            <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>
            <td>
              <v-autocomplete
                  :items="contractRows"
                  v-model="items[person.id]['contract_row']"
                  item-text="name"
                  item-value="id"
              />
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['kasre_kar'] "
                  prepend-inner-icon="fa-clock"
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['ezafe_kari'] "
                  prepend-inner-icon="fa-clock"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['tatil_kari'] "
                  prepend-inner-icon="fa-clock"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['shab_kari'] "
                  prepend-inner-icon="fa-clock"
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['sob_asr'] "
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['sob_shab'] "
              ></v-text-field>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['asr_shab'] "
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['sob_asr_shab'] "
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['mazaya_gheyr_mostamar'] "
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['sayer_ezafat'] "
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['hazine_made_137'] "
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['kosoorat_insurance'] "
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['manategh_tejari_moafiat'] "
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['ejtenab_maliat_mozaaf'] "
              ></v-text-field>
            </td>

            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['sayer_moafiat'] "
              ></v-text-field>
            </td>
            <td>
              <v-text-field
                  class="currency-input"
                  v-model="items[person.id]['sayer_kosoorat'] "
              ></v-text-field>
            </td>

          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-row>
      <v-col>
        <v-btn v-if="list_generated && !calculateDone" @click="calculatePayment" color="green lighten-2"
               class="float-left ma-3">محاسبه حقوق و دستمزد
        </v-btn>
      </v-col>
    </v-row>
  </v-card>


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
  name: "payment",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      items: [],
      MONTHS: [
        {name: ' فروردین', value: 'fa', 'id': 1},
        {name: ' اردیبهشت', value: 'or', 'id': 2},
        {name: ' خرداد', value: 'kh', 'id': 3},
        {name: ' تیر', value: 'ti', 'id': 4},
        {name: ' مرداد', value: 'mo', 'id': 5},
        {name: ' شهریور', value: 'sh', 'id': 6},
        {name: ' مهر', value: 'me', 'id': 7},
        {name: ' آبان', value: 'ab', 'id': 8},
        {name: ' آذر', value: 'az', 'id': 9},
        {name: ' دی', value: 'de', 'id': 10},
        {name: ' بهمن', value: 'ba', 'id': 11},
        {name: ' اسفند', value: 'es', 'id': 12},
      ],
      TYPES: [
        {name: ' قطعی', value: true},
        {name: ' غیر قطعی', value: false},
      ],
      PAYMENT_TYPES: [
        {name: ' محاسبه کامل', value: true},
        {name: ' ماه های قبل', value: false},
      ],
      CALCULATE_TYPES: [
        {name: 'محاسبه شود', value: true},
        {name: ' محاسبه نشود', value: false},
      ],
      payment_type: true,
      time: null,
      search_workshop: null,
      search_month: null,
      menu1: false,
      modal2: false,
      list_name: '',
      type: null,
      entitlement: null,
      calculate: false,
      list_status: false,
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      contractRows: [],
      hasLock: true,
      isDefinable: true,
      myClass: '',
      workshop: this.$route.query.workshop,
      workshops: [],
      workshop_list_of_pay: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      pay_id: '',
      copy_id: '',
      performClearForm: true,
      workshop_name: null,
      list_generated: false,
      payList: null,
      list_of_pay: null,
      show_list_of_pay: false,
      calculateDone: false,
      dialog: false,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop",
        },
        {
          text: "ماه",
          value: "month",
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
              'name': data[t].name + ' ' + data[t].code,
              'id': data[t].id,
            })
          }
          console.log(this.workshops)
        }
      })
    }
    if (this.workshop) {
      this.request({
        url: this.endpoint(`payroll/workshop/` + this.workshop + '/'),
        method: "get",
        success: data => {
          this.workshop_name = data.name + ' ' + data.code
        }
      })
    }
  },

  methods: {
    Show(item) {
      console.log(item)
    },

    getList() {
      this.request({
        url: this.endpoint(`payroll/payment/` + this.serverNow.format('jYYYY') + '/' + this.search_month + '/' + this.search_workshop + '/'),
        method: "post",
        data: {'name': this.list_name, 'ultimate': this.list_status, 'use_in_calculate': this.calculate},

        success: data => {
          this.pay_id = data.id
          this.payList = data.list_of_pay_item
          this.list_generated = true
          for (let item in this.payList) {
            this.items[this.payList[item].id] = {
              'id': this.payList[item].id,
              'ezafe_kari': 0,
              'tatil_kari': 0,
              'kasre_kar': 0,
              'shab_kari': 0,
              'jome_kar': 0,
              'sob_shab': 0,
              'sob_asr': 0,
              'asr_shab': 0,
              'sob_asr_shab': 0,
              'mazaya_gheyr_mostamar': 0,
              'sayer_ezafat': 0,
              'contract_row': null,
              'hazine_made_137': 0,
              'kosoorat_insurance': 0,
              'sayer_moafiat': 0,
              'manategh_tejari_moafiat': 0,
              'ejtenab_maliat_mozaaf': 0,
              'sayer_kosoorat': 0
            }
          }
        }
      })
      this.request({
        url: this.endpoint(`payroll/workshop/contract/row/` + this.search_workshop + '/'),
        method: "get",
        success: data => {
          for (let t in data) {
            this.contractRows.push({
              'name': data[t].contract_row,
              'id': data[t].id,
            })
            console.log(this.contractRows)
            this.contractRows.push({
              'name': 'هبچ کدام',
              'id': null,
            })

          }

        }
      })
    },

    calculatePayment() {
      for (let payitem in this.items) {
        this.request({
          url: this.endpoint(`payroll/paylist/item/` + payitem + '/'),

          method: "put",
          data: {
            'ezafe_kari': this.items[payitem]['ezafe_kari'],
            'tatil_kari': this.items[payitem]['tatil_kari'],
            'kasre_kar': this.items[payitem]['kasre_kar'],
            'shab_kari': this.items[payitem]['shab_kari'],
            'nobat_kari_sob_asr': this.items[payitem]['sob_asr'],
            'nobat_kari_sob_shab': this.items[payitem]['sob_shab'],
            'nobat_kari_asr_shab': this.items[payitem]['asr_shab'],
            'jome_kar': this.items[payitem]['jome_kar'],
            'nobat_kari_sob_asr_shab': this.items[payitem]['sob_asr_shab'],
            'sayer_ezafat': this.items[payitem]['sayer_ezafat'],
            'contract_row': this.items[payitem]['contract_row'],
            'mazaya_gheyr_mostamar': this.items[payitem]['mazaya_gheyr_mostamar'],
            'hazine_made_137': this.items[payitem]['hazine_made_137'],
            'kosoorat_insurance': this.items[payitem]['kosoorat_insurance'],
            'sayer_moafiat': this.items[payitem]['sayer_moafiat'],
            'manategh_tejari_moafiat': this.items[payitem]['manategh_tejari_moafiat'],
            'ejtenab_maliat_mozaaf': this.items[payitem]['ejtenab_maliat_mozaaf'],
            'sayer_kosoorat': this.items[payitem]['sayer_kosoorat'],
            'calculate_payment': true,
          },
          success: data => {
            console.log(data)
            this.get_payment_list()
          },
        })

      }
    },

    get_payment_list() {
      this.$router.push('/panel/listOfPayItem/' + this.pay_id)
    },

    getWorkshopListOfPay() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/workshop/` + this.search_workshop + '/'),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshop_list_of_pay.push({
              'name': data[t].name,
              'id': data[t].id
            })
            console.log(this.workshop_list_of_pay)
          }
        }
      })

    },
    createListOfPayByPervious() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/copy/` + this.copy_id + '/'),
        method: "post",
        data: {
          'year': 1401,
          'name': this.list_name,
          'ultimate': this.list_status,
          'use_in_calculate': this.calculate,
          'month': this.search_month},
        success: data => {
          this.$router.push('/panel/listOfPayItem/' + data['id'])


        }

      })

    }


  },
}
</script>

<style scoped lang="scss"></style>

