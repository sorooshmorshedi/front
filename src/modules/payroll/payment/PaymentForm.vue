<template>
  <v-card class="pa-3 ma-4 m">
    <v-card-title>محاسبه حقوق</v-card-title>
    <v-row>
      <v-col cols="12" md="3" >
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
            disabled = true
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
      <v-col cols="12" md="3" class="pr-16">
        <v-btn  color="green" class="justify-center white--text" @click="getList">لیست حقوق</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="list_generated" v-for="person in payList">
      <v-col cols="12" md="1">
        {{ person.id }}
      </v-col>
      <v-col cols="12" md="2">
        {{ person.name}}
      </v-col>
      <v-col cols="12" md="1">
        <v-text-field
            disabled="true"
            label=""
            v-model="person.normal_work"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="1">
        <v-text-field
            disabled="true"
            label="اضافه کاری"
            v-model="person.real_work"
        ></v-text-field>

      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
            label="اضافه کاری"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
            label="تعطیل کاری"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-text-field
            label="کسر کار"
        ></v-text-field>
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

    getList(){
      this.request({
        url: this.endpoint(`payroll/payment/` + this.serverNow.format('jYYYY') + '/' + this.search_month + '/' + this.search_workshop + '/'),
        method: "get",
        success: data => {
          console.log(data)
          this.payList = data
          this.list_generated = true
        }
      })
    }


  },
}
</script>

<style scoped lang="scss"></style>

