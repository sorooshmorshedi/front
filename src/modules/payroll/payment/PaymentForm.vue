<template>
  <v-card class="pa-3 ma-4 m">
    <v-card-title>محاسبه حقوق</v-card-title>
    <v-row>
      <v-col cols="12" md="3">
        <v-autocomplete
            v-if="!this.workshop"
            label="کارگاه"
            :items="workshops"
            v-model="search_workshop"
            :disabled="show_list_of_pay"
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
            :disabled="show_list_of_pay"
            v-model="search_month"
            item-text="name"
            item-value="value"
        />
      </v-col>
      <v-col cols="12" md="3" class="pr-16" v-if="!list_generated">
        <v-btn color="green" class="justify-center white--text" @click="getList">لیست پرسنل فعال</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="list_generated && !calculateDone">
      <v-col cols="12" md="6"
             v-for="person in payList" :key="person.id">
        <v-simple-table class="mt-10">
          <template v-slot:default>
            <thead class="style: blue lighten-4">
            <tr>
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
                ردیف پیمان
              </th>
            </tr>
            <tr class="white">
              <td class="text-center">{{ person.personnel_name }}</td>
              <td class="text-center">{{ person.normal_worktime }}</td>
              <td class="text-center">{{ person.real_worktime }}</td>
              <td>
                <v-autocomplete
                    :items="contractRows"
                    v-model="items[person.id]['contract_row']"
                    item-text="name"
                    item-value="id"
                />
              </td>
            </tr>
            <tr>
              <th class="text-center" colspan="2">
                اضافات
              </th>
              <th class="text-center" colspan="2">
                کسورات
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                اضافه کاری (ساعت)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['ezafe_kari'] "
                ></v-text-field>
              </td>
              <td>
                هزینه های درمانی ماده 137 ق.م.م
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['hazine_made_137'] "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>
                تعطیل کاری (ساعت)

              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['tatil_kari'] "
                ></v-text-field>
              </td>
              <td>
                 سایر حق بیمه پرداختی ماده 137 ق.م.م
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['kosoorat_insurance'] "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>
                شب کاری (ساعت)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['shab_kari'] "
                ></v-text-field>
              </td>
              <td>
                معافیت مربوط به مناطق آزاد تجاری
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['manategh_tejari_moafiat'] "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>
                نوبت کاری صبح و عصر (روز)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['sob_asr'] "
                ></v-text-field>
              </td>
              <td>
                معافیت قانون اجتناب از اخذ مالیات مضاعف
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['ejtenab_maliat_mozaaf'] "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>
                نوبت کاری صبح و شب (روز)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['sob_shab'] "
                ></v-text-field>
              </td>
              <td>
                سایر معافیت ها
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['sayer_moafiat'] "
                ></v-text-field>
              </td>
            </tr>
            <tr>
              <td>
                نوبت کاری عصر و شب (روز)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['asr_shab'] "
                ></v-text-field>
              </td>
              <td>
              </td>
              <td>
              </td>
            </tr>
            <tr>
              <td>
                نوبت کاری صبح و عصر و شب  (روز)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['sob_asr_shab'] "
                ></v-text-field>
              </td>
              <td>
              </td>
              <td>
              </td>
            </tr>
            <tr>
              <td>
                مزایای غیر مستمر غیرنقدی  (ریال)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['mazaya_gheyr_mostamar'] "
                ></v-text-field>
              </td>
              <td>
              </td>
              <td>
              </td>
            </tr>
            <tr>
              <td>
                سایر اضافات (ریال)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['sayer_ezafat'] "
                ></v-text-field>
              </td>
              <td>
                کسر کار (ساعت)
              </td>
              <td>
                <v-text-field
                    class="currency-input"
                    v-model="items[person.id]['kasre_kar'] "
                ></v-text-field>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn v-if="list_generated && !calculateDone" @click="calculatePayment" color="green lighten-2"
               class="float-left">محاسبه حقوق و دستمزد
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="show_list_of_pay">
      <v-col cols="12" md="12">
        <v-simple-table class="mt-10">
          <template v-slot:default>
            <thead class="style: blue lighten-4 ">
            <tr>
              <th class="text-center">
                ردیف
              </th>
              <th class="text-center">
                نام و نام خانوادگی
              </th>
              <th class="text-center">
                بیمه شود؟
              </th>
              <th class="text-center">
                سابقه بیمه در کارگاه به ماه
              </th>
              <th class="text-center">
                ردیف پیمان
              </th>
              <th class="text-center">
                کارکرد عادی
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
                مرخصی استحقاقی
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
                مرخصی ماده 73
              </th>
              <th class="text-center">
                مرخصی استعلاجی
              </th>
              <th class="text-center">
                مرخصی بدون حقوق
              </th>
              <th class="text-center">
                غیبت
              </th>
              <th class="text-center">
                کارکرد واقعی
              </th>
              <th class="text-center">
                حداقل مزد روزانه
              </th>
              <th class="text-center">
                حقوق پایه ماهانه
              </th>
              <th class="text-center">
                نرخ پایه سنوات روزانه
              </th>
              <th class="text-center">
                نرخ پایه سنوات ماهانه
              </th>
              <th class="text-center">
                اضافه کاری
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
                تعطیل کاری
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
                کسر کار
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
                ماموریت
              </th>
              <th class="text-center">
                مبلغ ماموریت
              </th>

              <th class="text-center">
                تعداد فرزندان مشمول عائله مندی
              </th>
              <th class="text-center">
                عائله مندی
              </th>
              <th class="text-center">
                سایر اضافات
              </th>
              <th class="text-center">
                حقوق و مزایای کل ماهانه
              </th>


            </tr>

            </thead>
            <tbody>
            <tr>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
                ساعتی
              </th>
              <th class="text-center">
                روزانه
              </th>
              <th class="text-center">
                جمع (روز)
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
                ساعت
              </th>
              <th class="text-center">
                مبلغ
              </th>
              <th class="text-center">
                ساعت
              </th>
              <th class="text-center">
                مبلغ
              </th>
              <th class="text-center">
                ساعت
              </th>
              <th class="text-center">
                مبلغ
              </th>
              <th class="text-center">
                روز
              </th>
              <th class="text-center">
                مبلغ
              </th>
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>
              <th class="text-center">
              </th>


            </tr>

            <tr v-for="person in list_of_pay" :key="person.id">
              <td> *</td>
              <td>{{ person.personnel_name }}</td>
              <td>{{ person.is_insurance_display }}</td>
              <td>{{ person.insurance_workshop }}</td>
              <td>{{ person.contract_row_title }}</td>
              <td>{{ person.normal_worktime }}</td>
              <td>{{ person.hourly_entitlement_leave_day }}</td>
              <td>{{ person.daily_entitlement_leave_day }}</td>
              <td>{{ person.entitlement_leave_day }}</td>
              <td>{{ person.matter_47_leave_day }}</td>
              <td>{{ person.illness_leave_day }}</td>
              <td>{{ person.without_salary_leave_day }}</td>
              <td>{{ person.absence_day }}</td>
              <td>{{ person.real_worktime }}</td>
              <td>
                <money :disabled="true" v-model="person.hoghoogh_roozane"></money>
              </td>
              <td>
                <money :disabled="true" v-model="person.montly_pay"></money>
              </td>
              <td>
                <money :disabled="true" v-model="person.sanavat_base"></money>
              </td>
              <td>
                <money :disabled="true" v-model="person.sanavat_montly_pay"></money>
              </td>
              <td>{{ person.ezafe_kari }}</td>
              <td>
                <money :disabled="true" v-model="person.ezafe_kari_total"></money>
              </td>
              <td>{{ person.tatil_kari }}</td>
              <td>
                <money :disabled="true" v-model="person.tatil_kari_total"></money>
              </td>
              <td>{{ person.kasre_kar }}</td>
              <td>
                <money :disabled="true" v-model="person.kasre_kar_total"></money>
              </td>
              <td>{{ person.mission_day }}</td>
              <td>
                <money :disabled="true" v-model="person.total_mission"></money>
              </td>
              <td>{{ person.aele_mandi_child }}</td>
              <td>
                <money :disabled="true" v-model="person.aele_mandi"></money>
              </td>
              <td>
                <money :disabled="true" v-model="person.sayer_ezafat"></money>
              </td>
              <td>
                <money :disabled="true" v-model="person.total_payment"></money>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
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
        method: "get",
        success: data => {
          this.payList = data.list_of_pay_item
          this.list_generated = true
          for (let item in this.payList) {
            this.items[this.payList[item].id] = {
              'id': this.payList[item].id,
              'ezafe_kari': 0,
              'tatil_kari': 0,
              'kasre_kar': 0,
              'shab_kari': 0,
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
              'ejtenab_maliat_mozaaf': 0
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
            'nobat_kari_sob_asr_shab': this.items[payitem]['sob_asr_shab'],
            'sayer_ezafat': this.items[payitem]['sayer_ezafat'],
            'contract_row': this.items[payitem]['contract_row'],
            'mazaya_gheyr_mostamar': this.items[payitem]['mazaya_gheyr_mostamar'],
            'hazine_made_137': this.items[payitem]['hazine_made_137'],
            'kosoorat_insurance': this.items[payitem]['kosoorat_insurance'],
            'sayer_moafiat': this.items[payitem]['sayer_moafiat'],
            'manategh_tejari_moafiat': this.items[payitem]['manategh_tejari_moafiat'],
            'ejtenab_maliat_mozaaf': this.items[payitem]['ejtenab_maliat_mozaaf'],
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
      setTimeout(1000)
      this.request({
        url: this.endpoint(`payroll/paylist/items/` + this.payList[0]['list_of_pay'] + '/'),
        method: "get",
        success: data => {
          this.calculateDone = true
          this.show_list_of_pay = true
          this.list_of_pay = data
          console.log(data)
        }
      })

    }

  },
}
</script>

<style scoped lang="scss"></style>

