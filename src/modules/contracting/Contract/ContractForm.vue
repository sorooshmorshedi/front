<template>
  <m-form
      title="ثبت قرارداد"
      :showList="false"
      :listRoute="{name:'،ContractsList'}"
      exportBaseUrl="reports/lists/contract"
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
        <v-col cols="12" md="2">
          <v-autocomplete
              label="مناقصه"
              :items="tenders"
              v-model="tender"
              item-text="name"
              item-value="id"
              :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="عنوان قرارداد" v-model="title" background-color="white"/>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="شماره قرارداد" v-model="code" background-color="white"/>
        </v-col>
        <v-col cols="12" md="2">
          <money
              label=" مبلغ قرارداد"
              v-model="value"
              background-color="white"
              :disabled="!isEditing"

          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="حداکثر میزان تغییر مبلغ قرارداد" v-model="max_change_amount" background-color="white"/>
        </v-col>
      </v-row>
      <v-row>

        <v-col cols="12" md="3">
          <account-select label="پیمانکار" v-model="contractor"/>
        </v-col>

        <v-col cols="12" md="3">
          <date v-model="start_date" label="شروع قرارداد" :default="true" :disabled="!isEditing"/>
        </v-col>
        <v-col cols="12" md="3">
          <date v-model="end_date" label="پایان قرارداد" :default="true" :disabled="!isEditing"/>
        </v-col>
      </v-row>
      <v-row>

        <v-col cols="12" md="2">
          <v-text-field label="حسن انجام کار" v-model="doing_job_well" background-color="white"/>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="علی الحساب بیمه" v-model="registration" background-color="white"/>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field label="سایر" v-model="other" background-color="white"/>
        </v-col>



      </v-row>
      <v-btn
          large
          class="float-left ma-1"
          color="green"
          @click="saveContract"
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
import date from "@/components/mcomponents/cleave/Date";
import accountSelect from "@/components/selects/AccountSelect";
export default {
  name: "ContractForm",
  mixins: [MFormMixin, DistributionApiMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, accountSelect},
  props: {
    id: {},
  },
  data() {
    return {
      tender: null,
      title: '',
      code: '',
      value: '',
      max_change_amount: '',
      contractor: '',
      start_date: '',
      end_date: '',
      doing_job_well: 10,
      registration: 5,
      other: 2,
      accounts:[],
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
      tenders:[],
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
          text: "شماره",
          value: "code",
          type: "numeric",

        },
        {
          text: "مبلغ",
          value: "value",
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
          text: "شروع قرارداد",
          value: "start_date",
          type: "date",
        },
        {
          text: "پایان قرارداد",
          value: "end_date",
          type: "date",
        },
        {
          text: "حسن انجام کار",
          value: "doing_job_well",
          type: "numeric",
        },
        {
          text: "علی الحساب بیمه",
          value: "registration",
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
  mounted(){
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
    saveContract(){
      this.request({
        url: this.endpoint(`contracting/contract/`),
        method: "post",
        data:{
          tender: this.tender,
          title: this.title,
          code: this.code,
          value: this.value,
          max_change_amount: this.max_change_amount,
          contractor: this.contractor,
          start_date: this.start_date,
          end_date: this.end_date,
          doing_job_well: this.doing_job_well,
          registration: this.registration,
          other: this.other,

        },
        success: data => {
          console.log('ok');
        }
      })
    },
    clear(){
      console.log('clear')
      this.code = ''
      this.title = ''
      this.tender = ''
      this.value = ''
      this.max_change_amount = ''
      this.contractor =''
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

