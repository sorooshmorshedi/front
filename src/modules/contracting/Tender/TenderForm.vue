<template>
  <div>
    <m-form
        title="ثبت مناقصه"
        :showList="false"
        :listRoute="{name:'،TendersList'}"
        exportBaseUrl="reports/lists/tender"
        :exportParams="{id: this.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clear()"
    >

      <template>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field label="شماره مناقصه" v-model="code" background-color="white"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="عنوان مناقصه" v-model="title" background-color="white"/>
          </v-col>
          <v-col cols="12" md="8">
            <v-textarea label="شرح مناقصه" v-model="explanation" :disabled="!isEditing"></v-textarea>
          </v-col>
          <v-col cols="12" md="2">
            <CitySelect label="استان محل اجرا" v-model="province"/>
          </v-col>
          <v-col cols="12" md="2">
            <CitySelect label="شهر محل اجرا" v-model="city"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                label="طبقه بندی موضوعی"
                :items="classification"
                v-model="myClass"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field label="مناقصه گزار" v-model="bidder" background-color="white"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="کد پستی مناقصه گزار" v-model="bidder_post" background-color="white"/>
          </v-col>
          <v-col cols="12" md="8">
            <v-textarea label="آدرس مناقصه گزار" v-model="bidder_address" :disabled="!isEditing"></v-textarea>
          </v-col>

          <v-col cols="12" md="2">
            <date v-model="received_deadline" label="مهلت دریافت اسناد" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="send_offer_deadline" label="مهلت ارسال پاکت های پیشنهاد" :default="true"
                  :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="opening_date" label="زمان بازگشایی پاکت ها" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="offer_expiration" label="زمان اعتبار پیشنهاد" :default="true" :disabled="!isEditing"/>
          </v-col>
        </v-row>
        <v-btn
            large
            class="float-left ma-1"
            color="green"
            @click="saveTender"
        >ثبت
        </v-btn>
      </template>
    </m-form>
    <TenderList/>
  </div>
</template>

<script>
import TenderList from "@/modules/contracting/Tender/TenderList";
import {MFormMixin} from "@/components/m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import mtime from "@/components/mcomponents/cleave/Time";
import FormsMixin from "@/mixin/forms";
import FactorMixin from "@/views/panel/factor/mixin";
import TreeSelect from "@/components/selects/TreeSelect";
import {PathLevels, VisitorLevels} from "@/variables";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import axios from "axios";
import citySelect from "@/components/selects/CitySelect";

export default {
  name: "TenderForm",
  mixins: [MFormMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList},
  props: {
    id: {},
  },
  data() {
    return {
      offer_expiration: '',
      opening_date: '',
      send_offer_deadline: '',
      received_deadline: '',
      classification: [
        {name: 'کالا', value: 'w'},
        {name: 'خدمات با فهرست بها', value: 'spl'},
        {name: 'خدمات بدون فهرست بها', value: 'npl'},
        {name: 'مشاوره', value: 'c'},
        {name: 'سایر', value: 'o'},
      ],
      code: '',
      title: '',
      explanation: '',
      province: '',
      city: '',
      bidder: '',
      bidder_post: '',
      bidder_address: '',

      baseUrl: "contracting/tender",
      permissionBasename: "tender",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      myClass: '',
      factors: [],
      PathLevels,
      VisitorLevels,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "شماره",
          value: "code",
          type: "numeric",

        },
        {
          text: "عنوان",
          value: "title",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "استان",
          value: "province",
        },

        {
          text: "شهر",
          value: "city",
        },
        {
          text: "مناقصه گزار",
          value: "bidder",
        },
        {
          text: "کد پستی مناقصه گزار",
          value: "bidder_post",
          type: "numeric",

        },
        {
          text: "آدرس مناقصه گزار",
          value: "bidder_address",
        },


        {
          text: "مهلت دریافت اسناد",
          value: "received_deadline",
          type: "date",
        },
        {
          text: "مهلت ارسال پاکت های پیشنهاد",
          value: "send_offer_deadline",
          type: "date",
        },

        {
          text: "زمان بازگشایی پاکت ها",
          value: "opening_date",
          type: "date",
        },

        {
          text: "زمان اعتبار پیشنهاد",
          value: "offer_expiration",
          type: "date",
        },

      ];
    },
  },
  methods: {
    clear() {
      console.log('clear')
      this.code = ''
      this.explanation = ''
      this.city = ''
      this.province = ''
      this.title = ''
      this.bidder = ''
      this.bidder_post = ''
      this.bidder_address = ''
      this.received_deadline = ''
      this.send_offer_deadline = ''
      this.opening_date = ''
      this.offer_expiration = ''
      this.myClass = ''
    },
    saveTender() {
      this.request({
        url: this.endpoint(`contracting/tender/`),
        method: "post",
        data: {
          code: this.code,
          explanation: this.explanation,
          city: this.city,
          province: this.province,
          title: this.title,
          bidder: this.bidder,
          bidder_postal_code: this.bidder_post,
          bidder_address: this.bidder_address,
          received_deadline: this.received_deadline,
          send_offer_deadline: this.send_offer_deadline,
          opening_date: this.opening_date,
          offer_expiration: this.offer_expiration,
          classification: this.myClass


        },
        success: data => {
          console.log(data);
        }
      })
    }
  }
};
</script>

<style scoped lang="scss"></style>

