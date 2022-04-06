<template>
  <m-form
      title="صورت وضییت"
      :showList="false"
      :listRoute="{name:'،ُStatementList'}"
      exportBaseUrl="reports/lists/statement"
      :exportParams="{id: this.id}"
      :canDelete="false"
      :canSubmit="canSubmit"
      :isEditing.sync="isEditing"
      @goToForm="getItemByPosition"
      @submit="submit"
      @delete="deleteItem"
      @clearForm="clear"
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

        <v-col cols="12" md="3">
          <v-autocomplete
              label="دسته بندی"
              :items="type"
              v-model="types"
              item-text="name"
              item-value="value"
              :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="2">
          <money
              label=" مبلغ ناخالص کارکرد این صورت وضعیت "
              v-model="value"
              background-color="white"
              :disabled="!isEditing"
              @change="present_statement_value = previous_statement_value + value"

          />
        </v-col>

        <v-col cols="12" md="2">
          <v-text-field disabled label="مبلغ ناخالص کارکرد تا صورت وضعیت قبلی" v-model="previous_statement_value"
                        background-color="white"/>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field disabled label="مبلغ ناخالص کارکرد تا این صورت وضعیت " v-model="present_statement_value"
                        background-color="white"/>
        </v-col>
      </v-row>
      <v-row>

        <v-col cols="12" md="2">
          <v-text-field label="شماره" v-model="code" background-color="white"/>
        </v-col>
        <v-col cols="12" md="2">
          <date v-model="date" label="تاریخ" :default="true" :disabled="!isEditing"/>
        </v-col>
        <v-col cols="12" md="6">
          <v-textarea label="توضیحات" v-model="explanation" :disabled="!isEditing"></v-textarea>
        </v-col>
      </v-row>
      <v-btn
          large
          class="float-left ma-1"
          color="green"
          @click="saveStatement"
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
  components: {mtime, TreeSelect},
  props: {
    id: {},
  },
  data() {
    return {
      contracts:[],
      contract:'',
      code:'',
      types: '',
      value: '',
      date: '',
      explanation:'',
      previous_statement_value: '',
      present_statement_value: '',
      type: [
        {name: 'معمولی', value: 'n'},
        {name: 'تعدیل', value: 'a'},
        {name: 'تحویل موقت', value: 'td'},
        {name: 'مشاوره', value: 'dd'},
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
          text: "سریال",
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
          text: "مبلغ",
          value: "value",
          type: "numeric",
        },
        {
          text: "دسته بندی",
          value: "type",
        },

      ];
    },
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

  methods: {
    saveStatement(){
      this.request({
        url: this.endpoint(`contracting/statement/`),
        method: "post",
        data:{
          contract: this.contract,
          title: this.title,
          serial: this.code,
          value: this.value,
          date: this.date,
          explanation : this.explanation,
          type: this.types,
        },
        success: data => {
          console.log(data);
        }
      })

    },
    setValues(){
      this.request({
        url: this.endpoint(`contracting/supplement/previous/` + this.contract + '/'),
        method: "get",
        success: data => {
          this.previous_statement_value = data
          this.present_statement_value = data + this.value
        }
      })

    },
    clear(){
      console.log('clear')
      this.code = ''
      this.title = ''
      this.contract = ''
      this.date = ''
      this.value = ''
      this.explanation = ''
      this.previous_statement_value = ''
      this.present_statement_value = ''
    },


  }
};
</script>

<style scoped lang="scss"></style>

