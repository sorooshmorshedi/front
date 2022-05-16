<template>
  <div>
    <m-form
        title="ثبت مناقصه"
        :showList="false"
        :listRoute="{name:'TenderList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="tenderFrom"

    >

      <template>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field label="شماره مناقصه" v-model="item.code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="عنوان مناقصه" v-model="item.title" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea label="شرح مناقصه" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <CitySelect label="استان محل اجرا" v-model="item.province" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <CitySelect label="شهر محل اجرا" v-model="item.city" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                label="طبقه بندی موضوعی"
                :items="classification"
                v-model="item.classification"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field label="مناقصه گزار" v-model="item.bidder" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="کد پستی مناقصه گزار" v-model="item.bidder_postal_code" background-color="white"
                          :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea label="آدرس مناقصه گزار" v-model="item.bidder_address" :disabled="!isEditing"></v-textarea>
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12" md="2">
            <date v-model="item.received_deadline" label="مهلت دریافت اسناد" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.send_offer_deadline" label="مهلت ارسال پاکت های پیشنهاد" :default="true"
                  :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.opening_date" label="زمان بازگشایی پاکت ها" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.offer_expiration" label="زمان اعتبار پیشنهاد" :default="true" :disabled="!isEditing"/>
          </v-col>

        </v-row>
        <v-dialog v-model="paymentDialog">
          <transaction-form
              type="receivedGuarantee"
              :modal-mode="false"
              :contract-modal-mode="true"
              @submit="submit"
              ref="transactionForm"
          />
        </v-dialog>
      </template>

      <v-btn @click="confirmed(item)" v-if="item.id && !item.is_confirmed && !isTenderConfirmed && item.is_defined "
             class="blue mt-6 mr-2 float-left">تایید
      </v-btn>
      <v-btn @click="unConfirm(item)" v-if="item.id && !item.is_confirmed && !isTenderConfirmed && item.is_defined"
             class="red mt-6  mr-4 float-left">رد
      </v-btn>
      <v-btn class="blue white--text mt-6 ml-2 float-left"
             v-if="item.is_confirmed || isTenderConfirmed && item.is_defined" @click="addContract(item)">ثبت قرارداد
      </v-btn>

      <v-btn class="light-blue white--text mt-6 ml-2 float-left"
             v-if="item.is_confirmed || isTenderConfirmed && item.is_defined" @click="paymentDialog = true">ثبت اسناد ضمانتی
        دریافتی
      </v-btn>
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
  name: "TenderForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      printUrl: 'reports/tender/all',
      isTenderConfirmed: false,
      tenderId: 0,
      classification: [
        {name: 'کالا', value: 'w'},
        {name: 'خدمات با فهرست بها', value: 'spl'},
        {name: 'خدمات بدون فهرست بها', value: 'npl'},
        {name: 'مشاوره', value: 'c'},
        {name: 'سایر', value: 'o'},
      ],
      baseUrl: "contracting/tender",
      permissionBasename: "tender",
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
  beforeDestroy() {
    if (this.$refs.transactionForm.item.id) {
      this.request({
        url: this.endpoint(`contracting/tender/transaction/` + this.$refs.tenderFrom.$props.exportParams.id + '/' + this.$refs.transactionForm.item.id + '/'),
        method: "get",
        success: data => {
          console.log(data)
          this.notify(' سند ثبت شد', 'success')
        }
      })
    }
  },

  methods: {
    to(item) {
      return {
        name: 'TenderDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' مناقصه رد شد', 'warning')
    },
    addContract(item) {
      this.$router.push('/panel/contract/' + '?tender=' + item.id)

    },
    confirmed(item) {
      this.request({
        url: this.endpoint(`contracting/tender/confirmed/` + item.id + '/'),
        method: "get",
        success: data => {
          this.notify(' مناقصه تایید شد', 'success')
          this.isTenderConfirmed = true
        }
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>

