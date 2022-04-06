<template>
  <m-form
      title="الحاقیه"
      :showList="false"
      :listRoute="{name:'،ُSupplementList'}"
      exportBaseUrl="reports/lists/Supplement"
      :exportParams="{id: this.id}"
      :canDelete="false"
      :canSubmit="canSubmit"
      :isEditing.sync="isEditing"
      @goToForm="getItemByPosition"
      @submit="submit"
      @delete="deleteItem"
      @clearForm="clear()"
  >
    <template>
      <v-row>
        <v-col cols="12" md="3">
          <v-autocomplete
              label="قرارداد"
              :items="contracts"
              v-model="contract"
              item-text="name"
              item-value="id"
              :disabled="!isEditing"
              @change="setValues"
          />
        </v-col>

        <v-col cols="12" md="1">
          <v-text-field disabled label="حداکثر" v-model="min"
                        background-color="white"/>
        </v-col>
        <v-col cols="12" md="1">
          <v-text-field disabled label="حداقل " v-model="max"
                        background-color="white"/>
        </v-col>
        <v-col cols="12" md="2">
          <money
              label=" مبلغ تغییر"
              v-model="value"
              background-color="white"
              :rules="rules1"
              :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="2">
          <v-switch
              @click="setSts"
              v-model="switch1"
              :label=status
          ></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <date v-model="new_date" label="تاریخ جدید قرارداد" :default="true" :disabled="!isEditing"/>
        </v-col>


        <v-col cols="12" md="3">
          <v-textarea label="توضیحات" v-model="explanation" :disabled="!isEditing"></v-textarea>
        </v-col>

        <v-col cols="12" md="2">
          <date v-model="date" label="تاریخ" :default="true" :disabled="!isEditing"/>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="شماره سریال " v-model="code" background-color="white"/>
        </v-col>

      </v-row>
      <v-btn
          large
          class="float-left ma-1"
          color="green"
          @click="saveSupplement"
      >ثبت
      </v-btn>
    </template>
  </m-form>
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


export default {
  name: "DistributionForm",
  mixins: [MFormMixin, DistributionApiMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, money},
  props: {
    id: {},
  },
  data() {
    return {
      contracts:[],
      contract:'',
      new_date: '',
      date :'',
      code: '',
      explanation:'',
      value:'',

      switch1: false,
      status : 'کاهش',
      type: [
        {name: 'معمولی', value: 'n'},
        {name: 'تعدیل', value: 'a'},
        {name: 'تحویل موقت', value: 'td'},
        {name: 'مشاوره', value: 'dd'},
      ],
      baseUrl: "contracting/tender",
      permissionBasename: "tender",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      filters: {
        type: "sale",
        is_defined: true,
        is_loaded: false,
      },
      isFullDelivery: null,
      min : null,
      max: null,
      rules1: [v => v <= this.max && v >= this.min],
    };
  },
  mounted(){
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
        console.log(this.contracts)

      }
    })

  },

  computed: {
    headers() {
      return [
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "خریدار",
          value: "account.name",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "مبلغ کل فاکتور",
          value: "total_sum",
          type: "numeric",
        },
        {
          text: "مبلغ برگشتی",
          value: "backFactor.total_sum",
          type: "numeric",
        },
        {
          text: "مبلغ دریافت شده",
          value: "paidValue",
          type: "numeric",
        },
        {
          text: "مبلغ قابل دریافت",
          value: "payable_value",
        },

      ];
    },

  },
  methods: {
    clear(){
      this.contract = ''
      this.max = ''
      this.min = ''
      this.value = ''
      this.explanation = ''
      this.date = ''
      this.new_date = ''
      this.code = ''
      this.switch1 = false


    },

    setSts(){
      if(this.switch1==true){
        this.status = 'افزایش'
      }
      else {
        this.status = 'کاهش'
      }
    },
    saveSupplement(){
      this.request({
        url: this.endpoint(`contracting/supplement/`),
        method: "post",
        data:{
          contract: this.contract,
          new_conteract_date: this.new_date,
          date: this.date,
          increase: this.switch1,
          value : this.value,
          code: this.code,
        },
        success: data => {
          console.log(data);
        }
      })


    },
    setValues() {
      this.request({
        url: this.endpoint(`contracting/contract/change/` + this.contract + '/'),
        method: "get",
        success: data => {
          this.min = data.min
          this.max = data.max
          console.log(this.min)
        }
      })
    }

  },
};
</script>

<style scoped lang="scss"></style>

