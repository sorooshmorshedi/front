<template>
  <div>
    <m-form
        title="الحاقیه"
        :showList="false"
        :listRoute="{name:'SupplementList'}"
        exportBaseUrl="reports/supplement/all"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        :items="item"
        @goToForm="getItemByPosition"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm() "
        ref="supplementForm"
    >
      <template>
        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
                v-if="!modalMode"
                label="قرارداد"
                :items="contracts"
                v-model="item.contract"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
                @change="setValues(item.contract)"
            />
            <v-text-field
                v-if="modalMode"
                label="قرارداد"
                disabled="true"
                v-model="item.contract = contract"

            ></v-text-field>

          </v-col>

          <v-col cols="12" md="1">
            <v-text-field disabled label="حداقل" v-model="minValue" v-if="!modalMode"
                          background-color="white"/>
            <v-text-field
                label="حداقل"
                v-if="modalMode"
                disabled="true"
                v-model="minChange"
            ></v-text-field>

          </v-col>
          <v-col cols="12" md="1">
            <v-text-field disabled label="حداکثر " v-model="maxValue" v-if="!modalMode"
                          background-color="white"/>
            <v-text-field
                label="حداکثر"
                v-if="modalMode"
                disabled="true"
                v-model="maxChange"
            ></v-text-field>

          </v-col>
          <v-col cols="12" md="2">
            <money
                label=" مبلغ تغییر"
                v-model="item.value"
                background-color="white"
                :rules="changeValueRule"
                :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-switch
                v-model="item.increase"
                label= 'افزایشی'
                :disabled="!isEditing"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <date v-model="item.new_contract_date" label="تاریخ جدید قرارداد" :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="2">
            <date v-model="item.date" label="تاریخ ثبت الحاقیه" :default="true" :disabled="!isEditing"/>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="2">
            <v-text-field label="شماره سریال " v-model="item.code" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="5">
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
import SupplementList from "@/modules/contracting/supplement/SupplementList";
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
  name: "SupplementForm",
  mixins: [MFormMixin, DistributionApiMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, money, SupplementList,TransactionForm},
  props: {
    id: {},
    modalMode: {
      default: false,
    },
    contract: {},
    maxChange: {},
    minChange: {},

  },
  data() {
    return {
      receive: {},
      receivedDialog: false,
      contracts: [],
      contract: '',
      hasLock: true,
      isDefinable: true,
      value: '',
      modalMode: false,
      type: [
        {name: 'معمولی', value: 'n'},
        {name: 'تعدیل', value: 'a'},
        {name: 'تحویل موقت', value: 'td'},
        {name: 'مشاوره', value: 'dd'},
      ],
      baseUrl: "contracting/supplement",
      permissionBasename: "supplement",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      filters: {
        type: "sale",
        is_defined: true,
        is_loaded: false,
      },
      minValue: null,
      maxValue: null,
      changeValueRule: [v => v <= this.maxValue && v >= this.minValue],
    };
  },
  mounted() {
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
        if(this.$refs.supplementForm.$props.items.contract){
          this.setValues(this.$refs.supplementForm.$props.items.contract)
        }

      }
    })
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
          text: "قرارداد",
          value: "contract",
        },
        {
          text: "تاریخ جدید قرارداد",
          value: "new_contract_date",
          type: "date",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "مبلغ",
          value: "value",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },

      ];
    },

  },
  beforeDestroy() {
    if (this.$refs.transactionForm.item.id) {
      this.request({
        url: this.endpoint(`contracting/contract/received/` + this.$refs.supplementForm.items.contract + '/' + this.$refs.transactionForm.item.id + '/'),
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
        url: this.endpoint(`contracting/contract/change/` + id + '/'),
        method: "get",
        success: data => {
          this.minValue = data.min
          this.maxValue = data.max
        }
      })
    }
  },
};
</script>

<style scoped lang="scss"></style>

