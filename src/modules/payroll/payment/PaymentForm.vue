<template>
  <v-card class="pa-3 ma-4 m">
    <v-card-title>محاسبه حقوق</v-card-title>
    <v-row>
      <v-col cols="12" md="3">
        <v-autocomplete
            v-if="!this.workshop"
            label="کارگاه"
            :items="workshops"
            @change="Show(search_workshop)"
            v-model="search_workshop"
            item-text="name"
            item-value="id"
        />
        <v-text-field
            label="کارگاه"
            v-if="this.workshop"
            disabled="true"
            v-show="false"
            @change="Show(search_workshop)"
            v-model="search_workshop"
        ></v-text-field>
        <v-text-field
            label="کارگاه"
            v-if="this.workshop"
            v-model="this.workshop_name "
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
            label="سال"
            v-model="this.serverNow.format('jYYYY') "
            disabled=true
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="3">
        <v-autocomplete
            label="ماه"
            :items="MONTHS"
            v-model="search_month"
            item-text="name"
            item-value="value"
        />
      </v-col>
      <v-col cols="12" md="3" class="pr-16" v-if="!list_generated">
        <v-btn color="green" class="justify-center white--text" @click="getList">لیست پرسنل فعال</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="list_generated">
      <v-col cols="12" md="12">
        <v-simple-table class="mt-10">
          <template v-slot:default>
            <thead class="style: blue lighten-4">
            <tr>
              <th class="text-center">
                ردیف
              </th>
              <th class="text-center">
                نام و نام خانوادگی
              </th>
              <th class="text-center">
                کارکرد عادی
              </th>
              <th class="text-center">
                کارکرد واقعی
              </th>
              <th class="text-center">
                اضافه کاری (ساعت)
              </th>
              <th class="text-center">
                تعطیل کاری (ساعت)
              </th>
              <th class="text-center">
                کسر کار (ساعت)
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
                 نوبت کاری صبح و عصر و شب  (روز)
              </th>
              <th class="text-center">
               سایر اضافات (ریال)
              </th>


            </tr>
            </thead>
            <tbody>
            <tr v-for="person in payList" :key="person.id">
              <td> * </td>
              <td>{{ person.personnel_name }}</td>
              <td>{{ person.normal_worktime }}</td>
              <td>{{ person.real_worktime }}</td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['ezafe_kari'] "
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['tatil_kari'] "
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['kasre_kar'] "
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['shab_kari'] "
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
              </td>
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
                <money v-model="items[person.id]['sayer_ezafat'] "
                ></money>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn @click="calculatePayment" color="green lighten-2" class="float-left">محاسبه حقوق و دستمزد</v-btn>

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
      time: null,
      search_workshop: null,
      search_month: null,
      menu1: false,
      modal2: false,
      type: null,
      entitlement: null,
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      myClass: '',
      workshop: this.$route.query.workshop,
      workshops: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
      workshop_name: null,
      list_generated: false,
      payList: null
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
        method: "get",
        success: data => {
          this.payList = data.list_of_pay_item
          this.list_generated = true
          for(let item in this.payList){
            this.items[this.payList[item].id] = {'id': this.payList[item].id,'ezafe_kari':0, 'tatil_kari':0, 'kasre_kar':0, 'shab_kari':0, 'sob_shab':0, 'sob_asr':0, 'asr_shab':0, 'sob_asr_shab': 0, 'sayer_ezafat': 0}
          }
        }
      })
    },

    calculatePayment() {
      for( let payitem in this.items){
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
            'nobat_kari_sob_asr_shab': this.items[payitem]['sob_asr_shab'],
            'sayer_ezafat': this.items[payitem]['sayer_ezafat'],
          },
          success: data => {
          }
        })

      }
    }

  },
}
</script>

<style scoped lang="scss"></style>

