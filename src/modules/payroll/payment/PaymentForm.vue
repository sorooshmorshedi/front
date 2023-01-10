<template>
  <v-card class=" "
          elevation="3"
          outlined
          tile>
    <v-toolbar color="indigo darken-2">
      <v-toolbar-title class="white--text">محاسبه حقوق</v-toolbar-title>
    </v-toolbar>
    <v-row class="mt-4 mr-3 ml-3">
      <v-col class="mt-5" cols="12" md="4">
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
      <v-col class="mt-5" cols="12" md="4">
        <v-autocomplete
            label="سال"
            v-model="year"
            :disabled="list_generated"
            :items="years"
        ></v-autocomplete>
      </v-col>
      <v-col class="mt-5" cols="12" md="4">
        <v-autocomplete
            v-if="payment_type"
            label="ماه"
            :items="MONTHS"
            :disabled="list_generated"
            v-model="search_month"
            @change="paymentStart"
            item-text="name"
            item-value="id"
        />
        <v-autocomplete
            v-if="!payment_type"
            label="ماه"
            :items="MONTHS"
            :disabled="list_generated"
            v-model="search_month"
            @change="paymentStart"
            item-text="name"
            item-value="id"
        />
      </v-col>
    </v-row>
    <v-card-actions v-if="!payment_start" class="mt-4 d-flex justify-center justify-md-end mt-2">
      <v-btn
          @click="paymentStart ; payment_start = true"
          left
          large
          v-if="search_workshop && search_month"
          class=" green white--text mb-5 ml-4 pl-4 pr-4 "
      >ادامه
      </v-btn>

    </v-card-actions>
    <v-row v-if="payment_start && !list_generated">
      <v-col cols="12" md="6">
        <v-card class="ma-5">
          <v-toolbar color="indigo">
            <v-toolbar-title class="white--text">
              حقوق و دستمزد
            </v-toolbar-title>
          </v-toolbar>
          <v-col class="mt-5 pr-10 pl-10" cols="12" md="12" v-if="payment_type">

            <v-autocomplete
                label="نوع لیست"
                :items="PAYMENT_TYPES"
                v-model="payment_type"
                :disabled="list_generated"
                item-text="name"
                item-value="value"

            />

          </v-col>
          <v-row v-if="!payment_type" class="mt-5 pr-10 pl-10">
            <v-col cols="12" md="6">
              <v-autocomplete
                  label="نوع لیست"
                  :items="PAYMENT_TYPES"
                  v-model="payment_type"
                  :disabled="list_generated"
                  item-text="name"
                  item-value="value"
              />

            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                  @change="getListsOfMonth(lists_of_month)"
                  label="ماه"
                  :items="MONTHS"
                  v-model="lists_of_month"
                  :disabled="list_generated"
                  item-text="name"
                  item-value="id"
              />

            </v-col>
          </v-row>
          <v-row class="mt-2 pr-10 pl-10">
            <v-col cols="12" md="12" v-if="!payment_type"
            >
              <v-autocomplete
                  label=" کپی بر اساس"
                  :items="workshop_list_of_pay"
                  v-model="copy_id"
                  :disabled="list_generated"
                  item-text="name"
                  item-value="id"
              />
            </v-col>
          </v-row>
          <v-row class="mt-2 pr-10 pl-10">

            <v-col cols="12" md="12">
              <v-text-field
                  label="نام لیست"
                  :disabled="list_generated"
                  v-model="list_name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-2 pr-10 pl-10">
            <v-col cols="12" md="12">
              <v-autocomplete
                  label="محاسبه بیمه و مالیات"
                  :items="CALCULATE_TYPES"
                  :disabled="list_generated"
                  v-model="calculate"
                  item-text="name"
                  item-value="value"
              />
            </v-col>
          </v-row>
          <v-card-actions class="mt-4 d-flex justify-center justify-md-end mt-2">
            <v-btn
                @click="getList"
                v-if="payment_type && !payListCreated"
                left
                class=" green white--text mb-5 ml-8 pl-4 pr-4 "
            >ثبت
            </v-btn>
            <v-btn
                @click="list_generated = true"
                v-if="payment_type && payListCreated"
                left
                large
                class=" blue white--text mb-5 ml-8 pl-4 pr-4 "
            > انجام محاسبات
            </v-btn>
            <v-btn
                @click="createListOfPayByPervious"
                v-if="!payment_type"
                left
                class=" green white--text mb-5 ml-8 pl-4 pr-4 "
            >ثبت
            </v-btn>

          </v-card-actions>
        </v-card>

        <v-row justify="center">
          <v-dialog
              v-model="error_dialog"
              persistent
              @click:outside="error_dialog=false"
              max-width="400"
          >
            <v-card>
              <v-card-title class="red--text text-h5">
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
                    color="green darken-1"
                    text
                    @click="error_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

      </v-col>
      <v-col cols="12" md="6">
        <v-card class="ma-5">
          <v-toolbar color="indigo">
            <v-toolbar-title class="white--text">
              لیست های این کارگاه برای {{ search_month }} / {{ year }}
            </v-toolbar-title>
          </v-toolbar>
          <m-datatable class="ma-3" :show-export-btns="false" :headers="headers"
                       :apiUrl="url" exportUrl="payroll" :filters.sync="export_filter"
                       ref="exportTable">
          </m-datatable>

        </v-card>

      </v-col>
    </v-row>

    <v-row>
      <v-simple-table v-if="list_generated && !calculateDone" class="ma-6 " dense>
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
              نوبت کاری صبح و عصر و شب (روز)
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
              />
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['ezafe_kari'] "
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['tatil_kari'] "
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['kasre_kar'] "
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['shab_kari']"
              ></hour-picker>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_asr'] "
                            class="currency-input">
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_shab'] "
                            class="currency-input">
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['asr_shab'] "
                            class="currency-input">
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_asr_shab'] "
                            class="currency-input">
              </v-text-field>
            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-card-actions v-if="payment_start && list_generated" class="mt-4 d-flex justify-center justify-md-end mt-2">
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
            <v-simple-table class="ma-4 " dense>
              <template v-slot:default>
                <thead class="style: blue lighten-4">
                <tr>
                  <th class="text-center">
                    نام و نام خانوادگی
                  </th>
                  <th class="text-center">
                    ماموریت ثبت شده (روز)
                  </th>
                  <th class="text-center">
                    ماموریت تجمیعی (روز)
                  </th>
                  <th class="text-center">
                    مرخصی استحقاقی ثبت شده (روز)
                  </th>
                  <th class="text-center">
                    مرخصی استحقاقی تجمیعی (روز)
                  </th>
                  <th class="text-center">
                    مرخصی استعلاجی ثبت شده (روز)
                  </th>
                  <th class="text-center">
                    مرخصی استعلاجی تجمیعی (روز)
                  </th>
                  <th class="text-center">
                    مرخصی بدون حقوق ثبت شده (روز)
                  </th>
                  <th class="text-center">
                    مرخصی بدون حقوق تجمیعی (روز)
                  </th>
                  <th class="text-center">
                    غیبت ثبت شده (روز)
                  </th>
                  <th class="text-center">
                    غیبت تجمیعی (روز)
                  </th>

                </tr>
                </thead>
                <tbody class="grey lighten-4 ma-2">
                <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
                  <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>
                  <td>
                    <v-text-field
                        disabled="true"
                        class="currency-input"
                        v-model="items[person.id]['mission'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_mission'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        disabled="true"
                        class="currency-input"
                        v-model="items[person.id]['entitlement'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_entitlement'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        disabled="true"
                        class="currency-input"
                        v-model="items[person.id]['illness'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_illness'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        disabled="true"
                        class="currency-input"
                        v-model="items[person.id]['without_salary'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_without_salary'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        disabled="true"
                        class="currency-input"
                        v-model="items[person.id]['absence'] "
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_absence'] "
                    ></v-text-field>
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
                  @click="dialog = false"
              >
                ادامه
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
                @click="sayerDone = true"
            >
              سایر
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 indigo white--text">
              سایر اضافات و کسورات
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
                    مزایای غیر مستمر غیرنقدی (ریال)
                  </th>
                  <th class="text-center">
                    سایر معافیت های مالیات(ریال)
                  </th>
                  <th class="text-center">
                    سایر اضافات (ریال)
                  </th>

                  <th class="text-center">
                    سایرکسورات (ریال)
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
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['kosoorat_insurance'] "
                        background-color="white"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['manategh_tejari_moafiat'] "
                        background-color="white"
                    />
                  </td>

                  <td>
                    <money
                        v-model="items[person.id]['ejtenab_maliat_mozaaf'] "
                        background-color="white"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['mazaya_gheyr_mostamar'] "
                        background-color="white"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['sayer_moafiat'] "
                        background-color="white"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['sayer_ezafat'] "
                        background-color="white"
                    />
                  </td>

                  <td>
                    <money
                        v-model="items[person.id]['sayer_kosoorat'] "
                        background-color="white"
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
                  @click="dialog = false"
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
            با توجه به اینکه امکان ویرایش بعد از ثبت نیست، آیا از ساخت لیست حقوق و انجام محاسبات با این اطلاعات اطمینان دارید؟
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
  name: "payment",
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
      type: null,
      entitlement: null,
      calculate: null,
      bime: true,
      list_status: false,
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      error_dialog: false,
      accept_dialog: false,
      error_message: null,
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
      payment_start: false,
      payListCreated: false,
      id_set: null,
      sayerDone: false,
    };
  },
  computed: {
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
    this.year = parseInt(this.serverNow.format('jYYYY'))
    let counter = 0
    while (counter < 6) {
      if (counter == 0) {
        this.years.push(parseInt(this.serverNow.format('jYYYY')))
      } else {
        this.years.push(parseInt(this.serverNow.format('jYYYY')) + counter)
        this.years.push(parseInt(this.serverNow.format('jYYYY')) - counter)
      }
      counter += 1
    }
    this.years.sort()
    console.log(this.years)

    if (!this.workshop) {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
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
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    getList() {
      this.request({
        url: this.endpoint(`payroll/payment/` + this.year + '/' + this.search_month + '/' + this.search_workshop + '/'),
        method: "post",
        data: {
          'name': this.list_name,
          'ultimate': this.list_status,
          'use_in_calculate': this.calculate,
          'use_in_bime': this.bime
        },

        success: data => {
          this.pay_id = data.id
          this.payList = data.list_of_pay_item
          this.payListCreated = true
          for (let item in this.payList) {
            this.items[this.payList[item].id] = {
              'is_in': true,
              'id': this.payList[item].id,
              'ezafe_kari': "00:00",
              'tatil_kari': "00:00",
              'kasre_kar': "00:00",
              'shab_kari': "00:00",
              'jome_kar': "00:00",
              'sob_shab': null,
              'sob_asr': null,
              'asr_shab': null,
              'sob_asr_shab': null,
              'mazaya_gheyr_mostamar': null,
              'sayer_ezafat': null,
              'contract_row': null,
              'hazine_made_137': null,
              'kosoorat_insurance': null,
              'sayer_moafiat': null,
              'manategh_tejari_moafiat': null,
              'ejtenab_maliat_mozaaf': null,
              'sayer_kosoorat': null,
              'cumulative_absence': null,
              'cumulative_mission': null,
              'cumulative_entitlement': null,
              'cumulative_illness': null,
              'cumulative_without_salary': null,
              'absence': this.payList[item].absence_day,
              'mission': this.payList[item].mission_day,
              'entitlement': this.payList[item].entitlement_leave_day,
              'illness': this.payList[item].illness_leave_day,
              'without_salary': this.payList[item].without_salary_leave_day,
            }
          }
          for (let item of this.items){
            console.log(item)
          }
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
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true
        }

      })
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
    },

    get_payment_list() {
      this.$router.push('/panel/listOfPayItem/' + this.pay_id)
    },

    sayer(id) {
      this.id_set = id
      console.log(id)
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

    },
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

    getListsOfMonth(month) {
      this.request({
        url: this.endpoint(`payroll/listOfPay/workshop/` + this.search_workshop + '/' + month + '/' +
            this.year + '/'),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshop_list_of_pay.push({
              'name': data[t].name,
              'id': data[t].id
            })
          }
        }

      })

    },
    show(item) {
      console.log(item)
    }

  },
}
</script>

<style scoped lang="scss"></style>

