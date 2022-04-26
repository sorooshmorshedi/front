<template>
  <div>
    <m-form
        title="صورت وضعیت"
        :showList="false"
        :listRoute="{name:'StatementList'}"
        exportBaseUrl="reports/statement/all"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :items="item"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @goToForm="getItemByPosition"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="statementForm"
    >
      <template>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
                v-if="!this.contract"
                label="قرارداد"
                :items="contracts"
                v-model="item.contract"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
                @change="setValues(item.contract)"
            />
            <v-text-field
                label="قرارداد"
                v-if="this.contract"
                disabled="true"
                v-model="item.contract = this.contract"

            ></v-text-field>

          </v-col>

          <v-col cols="12" md="3">
            <v-autocomplete
                label="دسته بندی"
                :items="type"
                v-model="item.type"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="2">
            <money
                label=" مبلغ ناخالص کارکرد این صورت وضعیت "
                v-model="item.value"
                background-color="white"
                :disabled="!isEditing"
                @change="present_statement_value = previous_statement_value + item.value"

            />
          </v-col>

          <v-col cols="12" md="2">
            <v-text-field disabled label="مبلغ ناخالص کارکرد تا صورت وضعیت قبلی" v-model="previous_statement_value"
                          background-color="white"/>
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field disabled label="مبلغ ناخالص کارکرد تا این صورت وضعیت " v-model="present_statement_value"
                          background-color="white" />
          </v-col>
        </v-row>
        <v-row>

          <v-col cols="12" md="2">
            <v-text-field label="شماره" v-model="item.serial" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.date" label="تاریخ" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
          </v-col>
        </v-row>
      </template>
      <v-btn class="light-blue white--text mt-6 mr-6  float-left"  v-if="item.id && item.is_defined" @click="receivedDialog = true">ثبت
        دریافت
      </v-btn>
      <v-dialog v-model="receivedDialog">
        <transaction-form
            type="receive"
            :modal-mode="false"
            :contract-modal-mode="true"
            :id="receive.id"
            @submit="submit"
            ref="transactionForm"
        />
      </v-dialog>
    </m-form>
  </div>
</template>
<script>
import {MFormMixin} from "@/components/m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import mtime from "@/components/mcomponents/cleave/Time";
import FormsMixin from "@/mixin/forms";
import FactorMixin from "@/views/panel/factor/mixin";
import TreeSelect from "@/components/selects/TreeSelect";
import {PathLevels, VisitorLevels} from "@/variables";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import TransactionForm from "@/views/panel/transaction/Form";


export default {
  name: "StatementForm",
  mixins: [MFormMixin, DistributionApiMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect,  money, TransactionForm},
  props: {
    id: {},
  },
  data() {
    return {
      receive: {},
      receivedDialog: false,
      contracts: [],
      contract: this.$route.query.contract,
      value: '',
      hasLock: true,
      isDefinable: true,
      previous_statement_value: '',
      present_statement_value: '',
      type: [
        {name: 'معمولی', value: 'n'},
        {name: 'تعدیل', value: 'a'},
        {name: 'تحویل موقت', value: 'td'},
        {name: 'تحویل قطعی', value: 'dd'},
      ],
      baseUrl: "contracting/statement",
      permissionBasename: "statement",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      filters: {
        type: "sale",
        is_defined: true,
        is_loaded: false,
      },
      factors: [],
      factor: null,
      isFullDelivery: null,
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
          type: "numeric"
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "قرارداد",
          value: "contract",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
        {
          text: "سریال",
          value: "serial",
          type: "numeric"
        },
        {
          text: "دسته بندی",
          value: "type",
        },

        {
          text: "مبلغ ناخالص کارکرد این صورت وضعیت",
          value: "value",
          type: "numeric",
        },
        {
          text: "مبلغ ناخالص کارکرد تا صورت وضعیت قبلی",
          value: "previous_statement_value",
          type: "numeric",
        },
        {
          text: "مبلغ ناخالص کارکرد تا این صورت وضعیت",
          value: "present_statement_value",
          type: "numeric",
        },
      ];
    },
  },
  mounted() {
    if(this.contract){
      this.setValues(this.contract)
    }
    this.request({
      url: this.endpoint(`contracting/contract/`),
      method: "get",
      success: data => {
        console.log(data);
        for (let t in data) {
          this.contracts.push({
            'name': data[t].title,
            'code': data[t].code,
            'id': data[t].id,
          })
        }
      }
    })
  },
  beforeDestroy() {
    if (this.$refs.transactionForm.item.id) {
      this.request({
        url: this.endpoint(`contracting/contract/received/` + this.$refs.statementForm.items.contract + '/' + this.$refs.transactionForm.item.id + '/'),
        method: "get",
        success: data => {
          this.notify(' سند ثبت شد', 'success')
        }
      })
    }
  },

  methods: {
    setValues(id) {
      this.request({
        url: this.endpoint(`contracting/supplement/previous/` + id + '/'),
        method: "get",
        success: data => {
          this.previous_statement_value = data
          this.present_statement_value = data + this.value
        }
      })
    },
  }
};
</script>

<style scoped lang="scss"></style>

