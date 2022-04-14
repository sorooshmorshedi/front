<template>

  <div>
    <m-form
        title="ثبت قرارداد"
        :showList="false"
        :listRoute="{name:'ContractList'}"
        exportBaseUrl="reports/lists/contract"
        :exportParams="{id: this.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @goToForm="getItemByPosition"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"

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
      <v-btn @click="$router.push('/panel/statement/?contract=' + item.id )" v-if="item.id" class="accent darken-3 mt-6 mr-2 float-left">ثبت صورت وضعیت</v-btn>
      <v-btn @click="Dialog = true" v-if="item.id" class="accent darken-3 mt-6 mr-2 float-left">ثبت الحاقیه</v-btn>
      <v-btn class="red mt-6  mr-2 float-left" color="primary" v-if="item.id" @click="paymentDialog = true">ثبت سند ضمانتی
        پرداخت
      </v-btn>
      <v-btn class="red mt-6 mr-6  float-left" color="primary" v-if="item.id" @click="receivedDialog = true">ثبت
        دریافت
      </v-btn>
      <v-dialog v-model="Dialog">
        <supplement-form
            :modal-mode="true"
            :contract="item.id"
            :dmax="parseFloat(item.amount) + (parseFloat(item.amount) / 100 * parseFloat(item.max_change_amount))"
            :dmin="parseFloat(item.amount) - (parseFloat(item.amount) / 100 * parseFloat(item.max_change_amount))"
        />
      </v-dialog>

    </m-form>
    <v-dialog v-model="paymentDialog">
      <transaction-form
          type="paymentGuarantee"
          :modal-mode="false"
          :id="payment.id"
          @submit="submit"
          ref="transactionForm"
      />
    </v-dialog>
    <v-dialog v-model="receivedDialog">
      <transaction-form
          type="receive"
          :modal-mode="false"
          :id="payment.id"
          @submit="submit"
          ref="transactionForm"
      />
    </v-dialog>


  </div>
</template>

<script>
import SupplementForm from "@/modules/contracting/Supplement/SupplementForm";
import ContractList from "@/modules/contracting/Contract/ContractList";
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
      paymentDialog: false,
      receivedDialog: false,
      Dialog: false,
      insurance_payment: 5,
      tender: this.$route.query.tender,
      title: '',
      code: '',
      value: '',
      max_change_amount: '',
      contractor: '',
      start_date: '',
      end_date: '',
      to_date: '',
      from_date: '',
      save_date: '',
      modalMode: true,
      payment: {},
      doing_job_well: 10,
      other: 2,
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
    if (this.tender){
    }
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
  methods: {
    t(){console.log('ok')},
    saveContract() {
      this.request({
        url: this.endpoint(`contracting/contract/`),
        method: "post",
        data: {
          tender: this.tender,
          title: this.title,
          code: this.code,
          amount: this.value,
          max_change_amount: this.max_change_amount,
          contractor: this.contractor,
          from_date: this.from_date,
          to_date: this.to_date,
          registration: this.save_date,
          inception: this.start_date,
          doing_job_well: this.doing_job_well,
          insurance_payment: this.insurance_payment,
          other: this.other,

        },
        success: data => {
          this.notify(' قرارداد ثبت شد' , 'success')
          this.clear()        }
      })
    },
    saveContractAndReload() {
      this.request({
        url: this.endpoint(`contracting/contract/`),
        method: "post",
        data: {
          tender: this.tender,
          title: this.title,
          code: this.code,
          amount: this.value,
          max_change_amount: this.max_change_amount,
          contractor: this.contractor,
          from_date: this.from_date,
          to_date: this.to_date,
          registration: this.save_date,
          inception: this.start_date,
          doing_job_well: this.doing_job_well,
          insurance_payment: this.insurance_payment,
          other: this.other,

        },
        success: data => {
          this.notify(' قرارداد ثبت شد' , 'success')
          this.$router.go()
        }
      })
    },

    clear() {
      console.log('clear')
      this.code = ''
      this.title = ''
      this.tender = ''
      this.value = ''
      this.max_change_amount = ''
      this.contractor = ''
      this.start_date = ''
      this.end_date = ''
      this.doing_job_well = 10
      this.registration = 5
      this.other = 2

    },

  },
};
</script>

<style scoped lang="scss"></style>

