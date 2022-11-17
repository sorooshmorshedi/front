<template>
  <v-card class=" "
          elevation="3"
          outlined
          tile>
    <v-toolbar color="indigo darken-2">
      <v-toolbar-title class="white--text">محاسبه حقوق</v-toolbar-title>
    </v-toolbar>
    <v-row class="pr-2 pl-2 pt-8">
      <v-col cols="12" md="2">
        <v-text-field
            label="نام لیست"
            :disabled="list_generated"
            v-model="list_name"
        ></v-text-field>
      </v-col>

      <v-col cols="12" md="2">
        <v-autocomplete
            v-if="!this.workshop"
            label="کارگاه"
            :items="workshops"
            v-model="search_workshop"
            :disabled="list_generated"
            item-text="name"
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
      <v-col cols="12" md="2">
        <v-text-field
            label="سال"
            v-model="this.serverNow.format('jYYYY') "
            disabled=true
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-autocomplete
            label="ماه"
            :items="MONTHS"
            :disabled="list_generated"
            v-model="search_month"
            item-text="name"
            item-value="value"
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
          v-if="isEditing"
          left
          class=" green white--text "
      >لیست پرسنل فعال
      </v-btn
      >

    </v-card-actions>
    <v-row v-if="list_generated && !calculateDone">
      <v-simple-table class="mt-7 ml-2 mr-2 " dense>
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
          <tbody>
          <tr v-for="person in payList" :key="person.id">
            <td class="text-center">{{ person.personnel_name }}</td>
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
               class="float-left">محاسبه حقوق و دستمزد
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
        {name: ' فروردین', value: 'fa'},
        {name: ' اردیبهشت', value: 'or'},
        {name: ' خرداد', value: 'kh'},
        {name: ' تیر', value: 'ti'},
        {name: ' مرداد', value: 'mo'},
        {name: ' شهریور', value: 'sh'},
        {name: ' مهر', value: 'me'},
        {name: ' آبان', value: 'ab'},
        {name: ' آذر', value: 'az'},
        {name: ' دی', value: 'de'},
        {name: ' بهمن', value: 'ba'},
        {name: ' اسفند', value: 'es'},
      ],
      TYPES: [
        {name: ' قطعی', value: true},
        {name: ' غیر قطعی', value: false},
      ],
      CALCULATE_TYPES: [
        {name: 'محاسبه شود', value: true},
        {name: ' محاسبه نشود', value: false},
      ],
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
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      pay_id: '',
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
    }


  },
}
</script>

<style scoped lang="scss"></style>

