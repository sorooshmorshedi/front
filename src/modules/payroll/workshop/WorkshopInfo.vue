<template>
  <div>
    <v-card
        elevation="2"
        class="ma-5 pa-1 rounded"
    >
      <v-toolbar
          color="indigo"
          dark
      >
        <v-app-bar-nav-icon
            @click="$router.push('/panel/setting/' + workshop.id)"

        ></v-app-bar-nav-icon>

        <v-toolbar-title>کارگاه {{ workshop.name }} {{ workshop.code }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn
            class="ml-2 mr-2 rounded blue-grey--text text--darken-2"
            color="blue lighten-4 "
            @click="$router.push('/panel/setting/' + workshop.id)"
        >
          تنظیمات کارگاه
        </v-btn>
        <v-btn
            class="ml-2 mr-2 rounded grey--text text--darken-2"
            color="green lighten-3 "
            @click="$router.push('/panel/workshop_personnel?workshop=' + workshop.id)"
        >
          ثبت پرسنل
        </v-btn>
        <v-btn
            class="ml-2 mr-2 rounded grey--text text--darken-2"
            color="green lighten-3 "
            @click="$router.push('/panel/contract_row?workshop=' + workshop.id)"
        >
          ثبت ردیف پیمان
        </v-btn>
      </v-toolbar>
      <v-simple-table
          class="ma-2 mt-5"
      >
        <template v-slot:default>
          <thead class="style: indigo darken-2">

          <tr>
            <th
                class="text-center"
                colspan="10">
              <h2 class="white--text"
                  v-if="!show_contract_row && show_personnel"
              >پــرسـنـل کــارگــاه </h2>
              <h2 class="white--text"
                  v-if="show_contract_row && !show_personnel"
              >ردیـف پـیـمان های کــارگــاه </h2>
            </th>
            <th class="text-left" >
              <v-btn
                  v-if="show_contract_row && !show_personnel"
                  @click="show_contract_row = false , show_personnel = true"
              > مشاهده پرسنل کارگاه
              </v-btn>
              <v-btn
                  v-if="!show_contract_row && show_personnel"
                  @click="show_contract_row = true , show_personnel = false"

              >مشاهده ردیف پیمان های کارگاه
              </v-btn>

            </th>
          </tr>
          </thead>
          <thead class="style: indigo lighten-1"
                 v-if="!show_contract_row && show_personnel"
          >
          <tr>
            <th class="text-center white--text">
              نام و نام خانوادگی
            </th>
            <th class="text-center white--text">
              شماره ملی
            </th>
            <th class="text-center white--text">
              جنسیت
            </th>
            <th class="text-center white--text">
              وضعیت تاهل
            </th>
            <th class="text-center white--text">
              شماره موبایل
            </th>
            <th class="text-center white--text">
              عنوان شغلی
            </th>
            <th class="text-center white--text">
              رسته شغلی
            </th>
            <th class="text-left" colspan="7">
            </th>
          </tr>
          </thead>
          <tbody
              v-if="!show_contract_row && show_personnel"
          >
          <tr
              v-for="item in personnel"
              :key="item.id"
          >
            <td class="text-center">{{ item.personnel_name }}</td>
            <td class="text-center">{{ item.personnel_identity_code }}</td>
            <td class="text-center">{{ item.gender_display }}</td>
            <td class="text-center">{{ item.marital_display }}</td>
            <td class="text-center">{{ item.mobile_number }}</td>
            <td class="text-center">{{ item.work_title }}</td>
            <td class="text-center">{{ item.job_group_display }}</td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-2"
                  color="green lighten-3 "
                  @click="$router.push('/panel/absence?workshop_personnel=' + item.id)"
              >
                مرخصی یا غیبت
              </v-btn>

            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-2"
                  color="green lighten-3 "
                  @click="$router.push('/panel/mission?workshop_personnel=' + item.id)"
              >
                ماموریت
              </v-btn>
            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-2"
                  color="green lighten-3 "
                  @click="$router.push('/panel/workshop_contract?workshop_personnel=' + item.id)"
              >
                ثبت قرارداد
              </v-btn>

            </td>
            <td class="text-center">
              <v-btn
                  class="ml-2 mr-2 rounded grey--text text--darken-2"
                  color="green lighten-3 "
                  @click="$router.push('/panel/personnel_family?personnel=' + item.personnel)"
              >
                ثبت خانواده
              </v-btn>

            </td>
          </tr>
          </tbody>
          <thead class="style: indigo lighten-1"
                 v-if="show_contract_row && !show_personnel"
          >
          <tr>
            <th class="text-center white--text">
              ردیف پیمان
            </th>
            <th class="text-center white--text">
              شماره قرارداد
            </th>
            <th class="text-center white--text">
              تاریخ قرارداد
            </th>
            <th class="text-center white--text">
              تاریخ شروع قرارداد
            </th>
            <th class="text-center white--text">
              تاریخ پایان قرارداد
            </th>
            <th class="text-center white--text">
              شناسه ملی واگذار کننده
            </th>
            <th class="text-center white--text">
              نام واگذار کننده
            </th>
            <th class="text-center white--text">
              کد کارگاه واگذار کننده
            </th>
            <th class="text-center white--text">
              شعبه
            </th>
            <th class="text-center white--text">
              مبلغ اولیه قرارداد
            </th>
            <th class="text-center white--text">
              وضعیت
            </th>
          </tr>
          </thead>
          <tbody
              v-if="show_contract_row && !show_personnel"
          >
          <tr
              v-for="item in contractRows"
              :key="item.id"
          >
            <td class="text-center">{{ item.contract_row }}</td>
            <td class="text-center">{{ item.contract_number }}</td>
            <td class="text-center">{{ item.registration_date }}</td>
            <td class="text-center">{{ item.from_date }}</td>
            <td class="text-center">{{ item.to_date }}</td>
            <td class="text-center">{{ item.assignor_national_code }}</td>
            <td class="text-center">{{ item.assignor_name }}</td>
            <td class="text-center">{{ item.assignor_workshop_code }}</td>
            <td class="text-center">{{ item.branch }}</td>
            <td class="text-center">{{ item.contract_initial_amount }}</td>
            <td class="text-center">{{ item.status_display }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
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


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";
import WorkshopList from "@/modules/payroll/workshop/WorkshopList";
import SummaryWorkshopList from "@/modules/payroll/workshop/SummaryWorkshopList";


export default {
  name: "WorkshopInfo",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryWorkshopList,
    WorkshopList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money
  },
  props: {
    id: {},
  },
  data() {
    return {
      show_contract_row: false,
      show_personnel: true,
      workshop: null,
      personnel: null,
      contractRows: null,
      workshopId: this.$route.query.workshop,
      permissionBasename: "workshop",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      myClass: '',
      factors: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
    };
  },
  mounted() {
    this.request({
      url: this.endpoint(`payroll/workshop/` + this.workshopId + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.workshop = data
      }
    })

    this.request({
      url: this.endpoint(`payroll/workshop/worksho_personnel/` + this.workshopId + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.personnel = data
      }
    })


    this.request({
      url: this.endpoint(`payroll/workshop/contract/row/` + this.workshopId + '/'),
      method: "get",
      success: data => {
        console.log(data);
        this.contractRows = data
      }
    })


  },
  methods: {
    to(item) {
      return {
        name: 'WorkshopDetail',
        params: {
          id: item.id,
        },
      };
    },
    addContractRow(item) {
      this.$router.push('/panel/contract_row' + '?workshop=' + item.id)
    },
    setting(item) {
      this.$router.push('/panel/setting/' + item.id)
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت کارگاه رد شد', 'warning')
    },
  },
}
</script>

<style>

@page {
  size: auto;
  margin: 20mm;
}

.nowrap {
  white-space: nowrap;
}
</style>
