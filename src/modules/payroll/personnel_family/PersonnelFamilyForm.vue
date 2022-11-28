<template>
  <div>
    <m-form
        title="تعریف اعضای خانواده"
        :showList="false"
        :listRoute="{name:'PersonnelFamilyList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :show-submit-and-clear-btn="false"
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="personnelForm"

    >

      <template>
        <v-row class="mt-1">
          <v-col cols="12" md="4">
            <v-autocomplete
                v-if="!this.personnel"
                label="پرسنل"
                :items="personnels"
                v-model="item.personnel"
                @change="setFilter(item.personnel)"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
            <v-text-field
                label="پرسنل"
                v-if="this.personnel"
                disabled="true"
                v-show="false"
                v-model="item.personnel = this.personnel"
            ></v-text-field>
            <v-text-field
                label="پرسنل"
                v-if="this.personnel"
                disabled="true"
                v-model="this.personnel_name"
            ></v-text-field>

          </v-col>
        </v-row>
        <v-row class="mt-15">
          <v-col cols="12" md="4">
            <v-text-field label="* نام  " v-model="item.name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="* نام خانوادگی " v-model="item.last_name" background-color="white" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field label="* کد ملی " v-model="item.national_code" background-color="white" :disabled="!isEditing"/>
          </v-col>

          <v-col cols="12" md="4">
            <date v-model="item.date_of_birth" label="* تاریخ  تولد " :default="true" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                label="* نسبت"
                :items="RELATIVE_TYPE"
                v-model="item.relative"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                label="* وضعیت تاهل"
                :items="MARITAL_STATUS_TYPES"
                v-model="item.marital_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                label="* خدمت سربازی"
                :items="MILITARY_SERVICE_STATUS"
                v-model="item.military_service"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
                label="* وضعیت تحصیل"
                :items="STUDY_TYPE"
                v-model="item.study_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                label="* وضعیت جسمی"
                :items="PHYSICAL_TYPE"
                v-model="item.physical_condition"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
        </v-row>
      </template>
    </m-form>
    <template v-if="this.personnel || item.personnel && !slug">
      <v-card class="mt-8">
        <v-card-title> خانواده {{personnel_name}} </v-card-title>
        <v-card-text>
          <m-datatable :headers="headers" :apiUrl="printUrl" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                       ref="familyDatatable">
            <template #item.detail="{ item }">
              <detail-link :to="to(item)" />
            </template>

          </m-datatable>
        </v-card-text>
      </v-card>
    </template>
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
import PersonnelFamilyList from "@/modules/payroll/personnel_family/PersonnelFamilyList";


export default {
  name: "ContractRowFrom",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {PersonnelFamilyList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      RELATIVE_TYPE: [
        {name: ' پدر', value: 'f'},
        {name: 'مادر', value: 'm'},
        {name: 'فرزند', value: 'c'},
        {name: 'همسر', value: 's'},
      ],
      MARITAL_STATUS_TYPES: [
        {name: ' مجرد', value: 's'},
        {name: 'متاهل', value: 'm'},
        {name: 'سرپرست فرزند', value: 'c'},
      ],
      MILITARY_SERVICE_STATUS: [
        {name: ' انجام داده', value: 'd'},
        {name: 'انجام نداده', value: 'n'},
        {name: 'معاف', value: 'e'},
        {name: 'هیچ کدام', value: 'x'},
      ],
      STUDY_TYPE: [
        {name: ' محصل', value: 's'},
        {name: 'غیر محصل', value: 'n'},
      ],
      PHYSICAL_TYPE: [
        {name: ' سالم', value: 'h'},
        {name: 'بیمار', value: 'p'},
        {name: 'نفص عضو', value: 'm'},
      ],

      printUrl: 'payroll/personnel/family/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/personnel/family",
      permissionBasename: "personnel_family",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      isDefinable: false,
      myClass: '',
      personnel: this.$route.query.personnel,
      personnels: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      performClearForm: true,
      personnel_name: null,
      personnel_filter: null,
      filters:{},
      slug: this.$route.params.id,

    };
  },
  computed: {
    headers() {
      return [
        {
          text: "پرسنل",
          value: "personnel",
        },
        {
          text: "نام",
          value: "name",
        },
        {
          text: "نام خانوادگی",
          value: "last_name",
        },
        {
          text: "کد ملی",
          value: "national_code",
        },
        {
          text: "تاریخ  تولد",
          value: "date_of_birth",
        },
        {
          text: "نسبت",
          value: "relative_display",
        },
        {
          text: "وضعیت تاهل",
          value: "marital_status_display",
        },
        {
          text: "خدمت سربازی",
          value: "military_service_display",
        },
        {
          text: "خدمت سربازی",
          value: "military_service_display",
        },
        {
          text: "وضعیت تحصیل",
          value: "study_status_display",
        },
        {
          text: "وضعیت جسمی",
          value: "physical_condition_display",
        },

      ];

    },
  },
  mounted() {
    console.log(this.slug)
    if(!this.personnel){
      this.request({
        url: this.endpoint(`payroll/personnel/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.personnels.push({
              'name': data[t].name + ' ' + data[t].last_name,
              'id': data[t].id,
            })
          }
          console.log(this.personnels)
        }
      })}
    if(this.personnel){
      this.filters['personnel'] = this.personnel
      this.request({
        url: this.endpoint(`payroll/personnel/` + this.personnel + '/'),
        method: "get",
        success: data => {
          this.personnel_name = data.name + ' ' + data.last_name
        }
      })}
  },
  methods: {
    to(item) {
      return {
        name: 'PersonnelFamilyDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت اعضای خانواده رد شد', 'warning')
    },
    setFilter(id) {
      this.filters['personnel'] = id
      this.$refs.familyDatatable.getDataFromApi()
    },

  },
}
</script>

<style scoped lang="scss"></style>

