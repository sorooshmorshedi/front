<template>
  <div>
    <m-form
        title="ثبت قرارداد"
        :showList="false"
        :listRoute="{name:'ContractList'}"
        exportBaseUrl="reports/contract/all"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :items="item"
        :isEditing.sync="isEditing"
        @goToForm="getItemByPosition"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="contractForm"
    >
      <template>
        <v-row>
          <v-col cols="12" md="2">
            <v-autocomplete
                v-if="!this.tender"
                label="مناقصه"
                :items="tenders"
                v-model="item.tender"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
            <v-text-field
                label="مناقصه"
                v-if="this.tender"
                disabled="true"
                v-model="item.tender = this.tender"

            ></v-text-field>
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field label="عنوان قرارداد" v-model="item.title" background-color="white" :disabled="!isEditing" />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="شماره قرارداد" v-model="item.code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <money
                label=" مبلغ قرارداد"
                v-model="item.amount"
                background-color="white"
                :disabled="!isEditing"

            />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="حداکثر میزان تغییر مبلغ قرارداد (درصد)" v-model="item.max_change_amount" background-color="white" :disabled="!isEditing"/>
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12" md="2">
            <account-select label="پیمانکار" v-model="item.contractor" :disabled="!isEditing"/>
          </v-col>

          <v-col cols="12" md="2">
            <date v-model="item.from_date" label="از تاریخ" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.to_date" label="تا تاریخ" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.registration" label="تاریخ ثبت" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.inception" label="تاریخ شروع" :default="true" :disabled="!isEditing"/>
          </v-col>

        </v-row>
        <v-row>

          <v-col cols="12" md="2">
            <v-text-field label="حسن انجام کار" v-model="item.doing_job_well" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="علی الحساب بیمه" v-model="item.insurance_payment" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field label="سایر" v-model="item.other"  background-color="white" :disabled="!isEditing"/>
          </v-col>
        </v-row>
      </template>
      <v-btn @click="$router.push('/panel/statement/?contract=' + item.id )" v-if="item.id && item.is_defined" class="blue white--text darken-3 mt-6 mr-2 float-left">ثبت صورت وضعیت</v-btn>
      <v-btn @click="dialog = true" v-if="item.id && item.is_defined" class="blue white--text darken-3 mt-6 mr-2 float-left">ثبت الحاقیه</v-btn>
      <v-btn class="light-blue white--text mt-6  mr-2 float-left"  v-if="item.id && item.is_defined" @click="setPayment(item)">ثبت سند ضمانتی
        پرداخت
      </v-btn>
      <v-btn class="light-blue white--text mt-6 mr-6  float-left"  v-if="item.id && item.is_defined" @click="setReceive(item)">ثبت
        دریافت
      </v-btn>
      <v-dialog v-model="dialog">
        <supplement-form
            :modal-mode="true"
            :contract="item.id"
            :max-change="parseFloat(item.amount) + (parseFloat(item.amount) / 100 * parseFloat(item.max_change_amount))"
            :min-change="parseFloat(item.amount) - (parseFloat(item.amount) / 100 * parseFloat(item.max_change_amount))"
        />
      </v-dialog>

    </m-form>
    <v-dialog v-model="paymentDialog">
      <transaction-form
          type="paymentGuarantee"
          :modal-mode="false"
          :id="payment.id"
          @submit="submit"
          ref="transactionPForm"
      />
    </v-dialog>
    <v-dialog v-model="receivedDialog">
      <transaction-form
          type="receive"
          :modal-mode="false"
          :id="payment.id"
          @submit="submit"
          ref="transactionRForm"
      />
    </v-dialog>
  </div>
</template>

<script>
import SupplementForm from "@/modules/contracting/supplement/SupplementForm";
import ContractList from "@/modules/contracting/contract/ContractList";
import {MFormMixin} from "@/components/m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import mtime from "@/components/mcomponents/cleave/Time";
import FormsMixin from "@/mixin/forms";
import FactorMixin from "@/views/panel/factor/mixin";
import TreeSelect from "@/components/selects/TreeSelect";
import {PathLevels, VisitorLevels} from "@/variables";
import date from "@/components/mcomponents/cleave/Date";
import accountSelect from "@/components/selects/AccountSelect";
import accountMixin from "@/mixin/accountMixin";
import TransactionForm from "@/views/panel/transaction/Form";

export default {
  name: "ContractForm",
  mixins: [MFormMixin, DistributionApiMixin, FormsMixin, FactorMixin, accountMixin],
  components: {mtime, TreeSelect, accountSelect, ContractList, SupplementForm,TransactionForm},
  props: {
    id: {},

  },
  data() {
    return {
      contractId : null,
      paymentDialog: false,
      receivedDialog: false,
      dialog: false,
      tender: this.$route.query.tender,
      hasLock: true,
      isDefinable: true,
      modalMode: true,
      payment: {},
      accounts: [],
      classification: [
        {name: 'کالا', value: 'w'},
        {name: 'خدمات با فهرست بها', value: 'spl'},
        {name: 'خدمات بدون فهرست بها', value: 'npl'},
        {name: 'مشاوره', value: 'c'},
        {name: 'سایر', value: 'o'},
      ],
      baseUrl: "contracting/contract",
      permissionBasename: "contract",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      tenders: [],
      PathLevels,
      VisitorLevels,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "عنوان",
          value: "title",
        },
        {
          text: "مناقصه",
          value: "tender",
        },

        {
          text: "شماره",
          value: "code",
          type: "numeric",

        },
        {
          text: "مبلغ",
          value: "amount",
          type: "numeric",

        },
        {
          text: "حداکثر میزان تغییر",
          value: "max_change_amount",
          type: "numeric",

        },
        {
          text: "پیمانکار",
          value: "contractor",
        },
        {
          text: "از تاریخ",
          value: "from_date",
          type: "date",
        },

        {
          text: "تا تاریخ",
          value: "to_date",
          type: "date",
        },

        {
          text: "تاریخ ثبت قرارداد",
          value: "registration",
          type: "date",
        },

        {
          text: "تاریخ شروع قرارداد",
          value: "inception",
          type: "date",
        },

        {
          text: "حسن انجام کار",
          value: "doing_job_well",
          type: "numeric",
        },
        {
          text: "علی الحساب بیمه",
          value: "insurance_payment",
          type: "numeric",
        },
        {
          text: "سایر",
          value: "other",
          type: "numeric",
        },
      ];
    },

  },
  mounted() {
    this.request({
      url: this.endpoint(`contracting/tender/`),
      method: "get",
      success: data => {
        console.log(data);
        for (let t in data) {
          this.tenders.push({
            'name': data[t].title,
            'code': data[t].code,
            'id': data[t].id,
          })
        }
        console.log(this.tenders)
      }
    })
  },
  beforeDestroy(){
    if(this.$refs.transactionRForm.item.id){
      this.request({
        url: this.endpoint(`contracting/contract/received/` + this.$refs.contractForm.$props.exportParams.id + '/' + this.$refs.transactionRForm.item.id + '/'),
        method: "get",
        success: data => {
          this.notify(' سند ثبت شد', 'success')
        }
      })
    }
    if(this.$refs.transactionPForm.item.id){
      this.request({
        url: this.endpoint(`contracting/contract/payment/` + this.$refs.contractForm.$props.exportParams.id + '/' + this.$refs.transactionPForm.item.id + '/'),
        method: "get",
        success: data => {
          this.notify(' سند ثبت شد', 'success')
        }
      })
    }
  },

  methods: {
    setReceive(item){
      this.contractId = item.id
      this.receivedDialog = true
    },

    setPayment(item){
      this.contractId = item.id
      this.paymentDialog = true
    },
  },
};
</script>

<style scoped lang="scss"></style>

