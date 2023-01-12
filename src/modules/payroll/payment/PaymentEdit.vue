<template>
  <v-card class=" "
          elevation="3"
          outlined
          tile>
    <v-toolbar color="indigo darken-2">
      <v-toolbar-title class="white--text">ویرایش لیست حقوق {{ list_name }}</v-toolbar-title>
    </v-toolbar>
    <v-row class="mt-4 pr-2 pl-2">
      <v-col class="mt-5" cols="12" md="4">
        <v-text-field
            label="کارگاه"
            disabled="true"
            v-model="workshop"

        >
        </v-text-field>
      </v-col>
      <v-col class="mt-5" cols="12" md="4">
        <v-text-field
            label="سال"
            v-model="year"
            disabled="true"
        >
        </v-text-field>
      </v-col>
      <v-col class="mt-5" cols="12" md="4">
        <v-text-field
            label="ماه"
            v-model="month"
            disabled="true"
        >

        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="12">
        <v-row class="mt-2 pr-2 pl-2">
          <v-col cols="12" md="6">
            <v-text-field
                label="نام لیست"
                :disabled="list_edit"
                v-model="list_name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-autocomplete
                label="محاسبه بیمه و مالیات"
                :items="CALCULATE_TYPES"
                :disabled="list_edit"
                v-model="calculate"
                item-text="name"
                item-value="value"
            />
          </v-col>
        </v-row>
        <v-card-actions class="mt-4 d-flex justify-center justify-md-end ">
          <v-btn
              @click="EditList"
              left
              large
              class=" green white--text mb-5  pl-4 pr-4 "
          >ادامه
          </v-btn>
        </v-card-actions>

      </v-col>
    </v-row>

    <v-row>
      <v-simple-table v-if="list_generated" class="ma-6 " dense>
        <template v-slot:default>
          <thead class="style: blue lighten-4">
          <tr>
            <th class="text-center">
              لحاظ کردن در لیست حقوق
            </th>
            <th class="text-center">
              نام و نام خانوادگی
            </th>
            <th class="text-center">
              ردیف پیمان
            </th>
            <th class="text-center">
              اضافه کاری
            </th>

            <th class="text-center">
              تعطیل کاری
            </th>
            <th class="text-center">
              کسر کار
            </th>
            <th class="text-center">
              شب کاری
            </th>

            <th class="text-center">
              نوبت کاری صبح و عصر
            </th>
            <th class="text-center">
              نوبت کاری صبح و شب
            </th>

            <th class="text-center">
              نوبت کاری عصر و شب
            </th>

            <th class="text-center">
              نوبت کاری صبح و عصر و شب
            </th>
            <th class="text-center">
              مزایای غیر مستمر غیرنقدی
            </th>
            <th class="text-center">
              سایر اضافات
            </th>

            <th class="text-center">
              سایرکسورات
            </th>

          </tr>
          </thead>
          <tbody class="grey lighten-4 ma-2">
          <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
            <td class="text-center pb-5 pt-5">
              <v-switch
                  color="green"
                  background-color="rey lighten-4"
                  :false-value="false"
                  :true-value="true"
                  v-model="items[person.id]['is_in']"
              ></v-switch>
            </td>
            <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>
            <td>
              <v-autocomplete
                  :items="contractRows"
                  v-model="items[person.id]['contract_row']"
                  item-text="name"
                  item-value="id"
                  :disabled="!items[person.id].is_in"
              />
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['ezafe_kari'] "
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['tatil_kari'] "
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['kasre_kar'] "
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['shab_kari']"
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_asr'] "
                            class="currency-input"
                            label="روز"
                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_shab'] "
                            class="currency-input"
                            label="روز"

                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['asr_shab'] "
                            class="currency-input"
                            label="روز"

                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_asr_shab'] "
                            class="currency-input"
                            label="روز"

                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <money
                  v-model="items[person.id]['mazaya_gheyr_mostamar'] "
                  background-color="white"
                  :disabled="!items[person.id].is_in"
              />
            </td>

            <td>
              <money
                  v-model="items[person.id]['sayer_ezafat'] "
                  background-color="white"
                  :disabled="!items[person.id].is_in"
              />
            </td>

            <td>
              <money
                  v-model="items[person.id]['sayer_kosoorat'] "
                  background-color="white"
                  :disabled="!items[person.id].is_in"
              />

            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-card-actions v-if="list_generated" class="mt-4 d-flex justify-center justify-md-end mt-2">
      <div class="text-center">
        <v-dialog
            v-model="dialog"
            width="1500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="blue"
                class="white--text ml-5 pl-10 pr-10"
                dark
                v-bind="attrs"
                v-on="on"
                @click="sayerDone = true"
            >
              مرخصی و ماموریت تجمیعی
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 indigo white--text">
              مرخصی و ماموریت تجمیعی
            </v-card-title>
            <v-simple-table class="border_all b ma-4 " dense>
              <template v-slot:default>
                <thead class="style: blue lighten-4">
                <tr>
                  <th>
                    مشخصات

                  </th>
                  <th class="text-center" colspan="3">
                    ماموریت (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    مرخصی استحقاقی (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    مرخصی استعلاجی (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    مرخصی بدون حقوق (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    غیبت (روز)
                  </th>

                </tr>
                </thead>
                <thead class="style: blue lighten-4">
                <tr>
                  <th class="text-center">
                    نام و نام خانوادگی
                  </th>
                  <th class="text-center">
                    ماموریت ثبت شده
                  </th>
                  <th class="text-center">
                    ماموریت تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    مرخصی استحقاقی ثبت شده
                  </th>
                  <th class="text-center">
                    مرخصی استحقاقی تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    مرخصی استعلاجی ثبت شده
                  </th>
                  <th class="text-center">
                    مرخصی استعلاجی تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    مرخصی بدون حقوق ثبت شده
                  </th>
                  <th class="text-center">
                    مرخصی بدون حقوق تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    غیبت ثبت شده
                  </th>
                  <th class="text-center">
                    غیبت تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>

                </tr>
                </thead>
                <tbody class="grey lighten-4 ma-2">
                <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
                  <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>
                  <td class="text-center">
                    {{ items[person.id]['mission'] }}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_mission'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td class="text-center">
                    {{ total[person.id].mission }}
                  </td>
                  <td class="text-center">
                    {{ items[person.id]['entitlement'] }}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_entitlement'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"

                    ></v-text-field>
                  </td>
                  <td>
                    {{ total[person.id].entitlement }}
                  </td>
                  <td class="text-center">
                    {{ items[person.id]['illness'] }}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_illness'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td>
                    {{ total[person.id].illness }}
                  </td>
                  <td class="text-center">
                    {{ items[person.id]['without_salary'] }}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_without_salary'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td>
                    {{ total[person.id].without_salary }}
                  </td>
                  <td class="text-center">
                    {{ items[person.id]['absence'] }}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_absence'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td>
                    {{ total[person.id].absence }}
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>


            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green"
                  dark
                  @click="dialog = false ; sayerDone = true"
              >
                تایید
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <div class="text-center">
        <v-dialog
            v-model="dialog1"
            width="1500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="blue"
                class="white--text ml-5 pl-10 pr-10"
                dark
                v-bind="attrs"
                v-on="on"
            >
              سایر معافیت ها
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 indigo white--text">
              سایر معافیت ها
            </v-card-title>
            <v-simple-table class="ma-4 " dense>
              <template v-slot:default>
                <thead class="style: blue lighten-4">
                <tr>
                  <th class="text-center">
                    نام و نام خانوادگی
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
                    سایر معافیت های مالیات
                  </th>
                  <th class="text-center">
                  </th>

                </tr>
                </thead>
                <tbody class="grey lighten-4 ma-2">
                <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
                  <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>

                  <td>
                    <money
                        v-model="items[person.id]['hazine_made_137'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['kosoorat_insurance'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['manategh_tejari_moafiat'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>

                  <td>
                    <money
                        v-model="items[person.id]['ejtenab_maliat_mozaaf'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['sayer_moafiat'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>


            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green"
                  dark
                  @click="dialog1 = false"
              >
                ادامه
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </div>

    </v-card-actions>
    <v-card-actions class="mt-4 mb-4 d-flex justify-center justify-md-end mt-2">
      <v-btn large v-if="list_generated && !calculateDone && sayerDone" @click="accept_dialog = true" color="green"
             class="white--text float-left ma-3">محاسبه حقوق و دستمزد
      </v-btn>

    </v-card-actions>
    <v-row justify="center">
      <v-dialog
          v-model="accept_dialog"
          persistent
          @click:outside="accept_dialog=false"
          max-width="400"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            توجه!
          </v-card-title>
          <v-card-text>
            با توجه به اینکه امکان ویرایش بعد از ثبت نیست، آیا از ساخت لیست حقوق و انجام محاسبات با این اطلاعات اطمینان
            دارید؟
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="accept_dialog = false"
            >
              بستن
            </v-btn>
            <v-btn
                color="green"
                text
                @click="calculatePayment"
            >
              محاسبه حقوق و دستمزد
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import HourPicker from "@/components/scomponents//HourPicker";


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";


export default {
  name: "paymentEdit",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money, HourPicker},
  props: {
    id: {},
  },
  data() {
    return {
      years: [],
      year: null,
      export_filter: {workshop: this.search_workshop, month: this.search_month},
      url: 'payroll/listOfPay/all',
      items: {},
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
      PAYMENT_TYPES: [
        {name: ' جدید', value: true},
        {name: ' کپی از ماه های قبل', value: false},
      ],
      CALCULATE_TYPES: [
        {name: 'محاسبه شود', value: true},
        {name: ' محاسبه نشود', value: false},
      ],
      payment_type: true,
      lists_of_month: true,
      time: null,
      search_workshop: null,
      search_month: null,
      menu1: false,
      modal2: false,
      dialog1: false,
      list_name: '',
      total: {},
      type: null,
      entitlement: null,
      calculate: null,
      bime: true,
      list_status: false,
      appendSlash: true,
      a: 1,
      b: 2,
      hasList: false,
      hasIdProp: true,
      error_dialog: false,
      accept_dialog: false,
      error_message: null,
      contractRows: [],
      hasLock: true,
      isDefinable: true,
      myClass: '',
      workshop: null,
      workshops: [],
      workshop_list_of_pay: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      pay_id: '',
      copy_id: '',
      performClearForm: true,
      month: null,
      workshop_name: null,
      list_generated: false,
      list_edit: false,
      payList: null,
      list_of_pay: null,
      show_list_of_pay: false,
      id: this.$route.query.pay_id,
      calculateDone: false,
      dialog: false,
      payment_start: false,
      payListCreated: false,
      id_set: null,
      sayerDone: false,
    };
  },
  computed: {
    my_total: function () {
      let res = {}
      for (let item in this.items) {
        this.$set(res, item, {
          'mission': this.items.item.mission + this.items.item.cumulative_mission
        })
      }
      return res;
    },
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop_display",
          filterable: false,
        },
        {
          text: " نام لیست",
          value: "name",
        },
        {
          text: "سال",
          value: "year",
          filterable: false,
        },
        {
          text: "ماه",
          value: "month_name",
          filterable: false,
        },
        {
          text: "محاسبه در بیمه و مالیات",
          value: "use_in_calculate",
          type: 'boolean'
        },
        {
          text: "نهایی",
          value: "ultimate",
          type: 'boolean',
        },

      ];
    },
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/listOfPay/edit/` + this.$route.query.pay_id + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.workshop = data['workshop_name']
        this.month = data['get_month_display']
        this.year = data['get_year']
        this.list_name = data['name']
        this.calculate = data['use_in_calculate']
      }
    })
    this.request({
      url: this.endpoint(`payroll/paylist/edit/item/` + this.$route.query.pay_id + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.payList = data
      }
    })

  },

  methods: {
    EditList() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/edit/` + this.$route.query.pay_id + '/'),
        method: "put",
        data: {
          'name': this.list_name,
          'use_in_calculate': this.calculate,
        },
        success: data => {
          this.getList()
          this.list_edit = true
          this.list_generated = true
          this.notify('نام و وضعیت بیمه و مالیات  ویرایش شد', 'success')
        }
      })
    },

    get_total() {
      console.log('okok')
      for (let item in this.items) {
        if (this.items[item] != null) {
          this.$set(this.total, this.items[item].id, {
            'mission': parseInt(this.items[item]['mission']) + parseInt(this.items[item]['cumulative_mission']),
            'absence': parseInt(this.items[item]['absence']) + parseInt(this.items[item]['cumulative_absence']),
            'entitlement': parseInt(this.items[item]['entitlement']) + parseInt(this.items[item]['cumulative_entitlement']),
            'illness': parseInt(this.items[item]['illness']) + parseInt(this.items[item]['cumulative_illness']),
            'without_salary': parseInt(this.items[item]['illness']) + parseInt(this.items[item]['cumulative_without_salary']),
          })
        }
      }

    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    getList() {
      for (let item in this.payList) {
        this.$set(this.items, this.payList[item].id, {
          'is_in': true,
          'id': this.payList[item].id,
          'ezafe_kari': this.payList[item].get_ezafe_kari_time,
          'tatil_kari': this.payList[item].get_tatil_kari_time,
          'kasre_kar': this.payList[item].get_kasre_kar_time,
          'shab_kari': this.payList[item].get_shab_kari_time,
          'sob_shab': this.payList[item].get_sob_shab,
          'sob_asr': this.payList[item].get_sob_asr,
          'asr_shab': this.payList[item].get_asr_shab,
          'sob_asr_shab': this.payList[item].get_sob_asr_shab,
          'mazaya_gheyr_mostamar': this.payList[item].mazaya_gheyr_mostamar,
          'sayer_ezafat': this.payList[item].sayer_ezafat,
          'contract_row': this.payList[item].contract_row,
          'hazine_made_137': this.payList[item].hazine_made_137,
          'kosoorat_insurance': this.payList[item].kosoorat_insurance,
          'sayer_moafiat': this.payList[item].sayer_moafiat,
          'manategh_tejari_moafiat': this.payList[item].manategh_tejari_moafiat,
          'ejtenab_maliat_mozaaf': this.payList[item].ejtenab_maliat_mozaaf,
          'sayer_kosoorat': this.payList[item].sayer_kosoorat,
          'cumulative_absence': this.payList[item].cumulative_absence,
          'cumulative_mission': this.payList[item].cumulative_mission,
          'cumulative_entitlement': this.payList[item].cumulative_entitlement,
          'cumulative_illness': this.payList[item].cumulative_illness,
          'cumulative_without_salary': this.payList[item].cumulative_without_salary,
          'absence': this.payList[item].get_absence,
          'mission': this.payList[item].get_mission,
          'entitlement': this.payList[item].get_entitlement,
          'illness': this.payList[item].get_illness,
          'without_salary': this.payList[item].get_with_out_salary,
        })

        this.get_total()
        console.log(this.items)
        this.notify('لیست حقوق ساخته شد، جهت تکمیل و انجام محاسبات روی دکمه انجام محاسبات کلیک کنید', 'success')
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
            this.$refs.exportTable.getDataFromApi()
            this.$refs.exportTable.getDataFromApi()
          }
        })
      }
    },
    calculatePayment() {
      for (let payitem in this.items) {
        this.request({
          url: this.endpoint(`payroll/paylist/item/` + payitem + '/'),

          method: "put",
          data: {
            'is_in': this.items[payitem]['is_in'],
            'ezafe_kari': this.items[payitem]['ezafe_kari'],
            'tatil_kari': this.items[payitem]['tatil_kari'],
            'kasre_kar': this.items[payitem]['kasre_kar'],
            'sayer_kosoorat': this.items[payitem]['sayer_kosoorat'],
            'shab_kari': this.items[payitem]['shab_kari'],
            'nobat_kari_sob_asr': this.items[payitem]['sob_asr'],
            'nobat_kari_sob_shab': this.items[payitem]['sob_shab'],
            'nobat_kari_asr_shab': this.items[payitem]['asr_shab'],
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
            'cumulative_absence': this.items[payitem]['cumulative_absence'],
            'cumulative_mission': this.items[payitem]['cumulative_mission'],
            'cumulative_entitlement': this.items[payitem]['cumulative_entitlement'],
            'cumulative_illness': this.items[payitem]['cumulative_illness'],
            'cumulative_without_salary': this.items[payitem]['cumulative_without_salary'],
            'calculate_payment': true,
          },
          success: data => {
            console.log(data)
            this.get_payment_list()
          },
        })

      }
    }
    ,

    get_payment_list() {
      this.$router.push('/panel/listOfPayItem/' + this.$route.query.pay_id)
    }
    ,

    sayer(id) {
      this.id_set = id
      console.log(id)
    }
    ,

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

    }
    ,
    createListOfPayByPervious() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/copy/` + this.copy_id + '/'),
        method: "post",
        data: {
          'year': parseInt(this.serverNow.format('jYYYY')),
          'name': this.list_name,
          'ultimate': this.list_status,
          'use_in_calculate': this.calculate,
          'month': this.search_month
        },
        success: data => {
          this.$router.push('/panel/listOfPayItem/' + data['id'])


        }

      })

    }
    ,
    paymentStart() {
      this.request({
        url: this.endpoint(`payroll/PaymentVerify/` + this.year + '/' + this.search_month + '/' + this.search_workshop + '/'),
        method: "get",
        success: data => {
          this.export_filter['workshop'] = this.search_workshop
          this.export_filter['month'] = this.search_month
          this.export_filter['year'] = parseInt(this.serverNow.format('jYYYY'))
        },
        error: data => {
          this.payment_start = false
        }

      })

    },
    show(item) {
      console.log(item)
    },

  },

}
</script>

<style scoped lang="scss">
table th + th {
  border-left: 2px solid #dddddd;
}

table td + td {
  border-left: 1px solid #dddddd;
}
</style>
