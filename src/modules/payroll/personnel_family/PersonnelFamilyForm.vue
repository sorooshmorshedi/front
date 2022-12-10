<template>
  <div>
    <m-form
        title="تعریف اعضای خانواده"
        :showList="false"
        :listRoute="{name:'PersonnelFamilyList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :can-edit="!item.is_verified"
        :canSubmit="canSubmit"
        :show-submit-and-clear-btn="false"
        :isEditing.sync="isEditing"
        :show-navigation-btns="false"
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
                :rules="[rules.required,]"
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
          <v-col cols="12" md="4" v-if="item.personnel">
            <v-text-field v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]"
                          label="نام پدر پرسنل" v-model="father_naming[item.personnel]"
                          background-color="white" :disabled="true"/>

          </v-col>
          <v-col cols="12" md="4" v-if="item.personnel">
            <v-text-field v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]"
                          label="کد ملی پرسنل  " v-model="nat[item.personnel]"
                          background-color="white" :disabled="true"/>

          </v-col>
        </v-row>
        <v-row class="mt-15" v-if="item.personnel">
          <v-col cols="12" md="4">
            <v-autocomplete
                v-if="marital[item.personnel] == 's'"
                label="* نسبت"
                :items="SINGLE_RELATIVE_TYPE"
                v-model="item.relative"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
                :rules="[rules.required,]"
                @change="item.gender = null ; item.marital_status = null; item.name = null ; item.last_name = null"
            />

            <v-autocomplete
                v-if="marital[item.personnel] !== 's'"
                label="* نسبت"
                :items="RELATIVE_TYPE"
                v-model="item.relative"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
                @click="item.name = null"
                @change="item.last_name = null ;item.name = null ; item.gender = null ; item.marital_status = null"
                :rules="[rules.required,]"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]"
                          v-if="item.relative != 'f'"

                          label="* نام  " v-model="item.name"
                          background-color="white" :disabled="!isEditing"/>

            <v-text-field v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]"
                          v-if="item.relative == 'f'"
                          label="* نام  " v-model="item.name = father_naming[item.personnel]"
                          background-color="white" :disabled="true"/>

          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]"
                          label="* نام خانوادگی "
                          v-if="item.relative != 'f' && item.relative != 'c'"
                          v-model="item.last_name" background-color="white" :disabled="!isEditing"/>
            <v-text-field v-on:keypress="NoneNumbersOnly" :rules="[rules.required,]"
                          v-if="item.relative == 'f' || item.relative == 'c'"
                          label="* نام خانوادگی "
                          v-model="item.last_name = naming[item.personnel]" background-color="white" :disabled="true"/>

          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-on:keypress="NumbersOnly" :rules="[rules.required,]" label="* کد ملی "
                          v-model="item.national_code" background-color="white" :disabled="!isEditing"/>
          </v-col>

          <v-col cols="12" md="4">
            <date v-model="item.date_of_birth" label="* تاریخ  تولد " :default="false" :disabled="!isEditing"/>
          </v-col>
          <v-col cols="12" md="4" v-if="item.relative == 's'">
            <v-text-field v-if="item.relative == 's' && gender[item.personnel] == 'f'" v-show="false" label="* جنسیت "
                          v-model="item.gender = 'm'" background-color="white" :disabled="!isEditing"/>
            <v-text-field v-if="item.relative == 's' && gender[item.personnel] == 'm'" v-show="false" label="* جنسیت "
                          v-model="item.gender = 'f'" background-color="white" :disabled="!isEditing"/>
            <v-text-field v-if="item.relative == 's' && gender[item.personnel] == 'f'" label="* جنسیت " v-model="men"
                          background-color="white" :disabled="true"/>
            <v-text-field v-if="item.relative == 's' && gender[item.personnel] == 'm'" label="* جنسیت " v-model="women"
                          background-color="white" :disabled="true"/>
          </v-col>
          <v-col cols="12" md="4" v-if="item.relative == 'm'">
            <v-text-field v-if="item.relative == 'm'" v-show="false" label="* جنسیت " v-model="item.gender = 'f'"
                          background-color="white" :disabled="!isEditing"/>
            <v-text-field v-if="item.relative == 'm'" label="* جنسیت " v-model="women" background-color="white"
                          :disabled="true"/>
          </v-col>
          <v-col cols="12" md="4" v-if="item.relative == 'f'">
            <v-text-field v-if="item.relative == 'f'" v-show="false" label="* جنسیت " v-model="item.gender = 'm'"
                          background-color="white" :disabled="!isEditing"/>
            <v-text-field v-if="item.relative == 'f'" label="* جنسیت " v-model="men" background-color="white"
                          :disabled="true"/>
          </v-col>
          <v-col cols="12" md="4" v-if="item.relative == 'c' || !item.relative">
            <v-autocomplete
                label=" * جنسیت فرزند"
                :items="CHILD_TYPES"
                v-model="item.gender"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
                @change="item.military_service = null"
            />
          </v-col>


          <v-col cols="12" md="4">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* وضعیت تاهل"
                v-if="item.relative!=='s'"
                :items="MARITAL_STATUS_TYPES"
                v-model="item.marital_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"

            />
            <v-text-field
                label="* وضعیت تاهل"
                v-if="item.relative=='s'"
                disabled="true"
                v-show="false"
                v-model="item.marital_status = 'm'"
            ></v-text-field>
            <v-text-field
                label="* وضعیت تاهل"
                v-if="item.relative=='s'"
                disabled="true"
                v-model="this.married"
            ></v-text-field>

          </v-col>

          <v-col cols="12" md="4">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* وضعیت تحصیل"
                :items="STUDY_TYPE"
                v-model="item.study_status"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field v-show="item.gender == 'f'" label="* خدمت سربازی" v-model="female" background-color="white"
                          :disabled="true"/>
            <v-text-field v-show="false" v-if="item.gender == 'f'" label="* خدمت سربازی"
                          v-model="item.military_service = 'x'" background-color="white" :disabled="true"/>
            <v-autocomplete
                :rules="[rules.required,]"
                v-if="item.gender == 'm' || !item.gender"
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
                :rules="[rules.required,]"
                label="* وضعیت جسمی"
                :items="PHYSICAL_TYPE"
                v-model="item.physical_condition"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-autocomplete
                :rules="[rules.required,]"
                label="* وضعیت  "
                :items="PERSONNEL_STATUS"
                v-model="item.is_active"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>

        </v-row>
      </template>
      <v-btn
          class="light-blue white--text mt-6  mr-2 float-left"
          @click="verifyPersonnel(item.id)"
          v-if="item.id && !item.is_verified">ثبت نهایی
      </v-btn>
      <v-btn
          class="red white--text   mr-2 float-left "
          @click="verifyUnPersonnel(item.id)"
          v-if="item.id && item.is_verified"> خروج از وضعیت نهایی
      </v-btn>


    </m-form>
    <template v-if="item.personnel">
      <v-card class="mt-8">
        <v-card-title> خانواده {{ personnel_name }}</v-card-title>
        <v-card-text>
          <m-datatable :headers="headers" :apiUrl="printUrl" :filters.sync="filters"
                       @dblclick:row="(e, row) => $router.push(to(row.item))"
                       ref="familyDatatable">
            <template #item.detail="{ item }">
              <detail-link :to="to(item)"/>
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
      PERSONNEL_STATUS: [
        {name: ' فعال', value: true},
        {name: 'غیر فعال', value: false},
      ],
      RELATIVE_TYPE: [
        {name: ' پدر', value: 'f'},
        {name: 'مادر', value: 'm'},
        {name: 'فرزند', value: 'c'},
        {name: 'همسر', value: 's'},
      ],
      SINGLE_RELATIVE_TYPE: [
        {name: ' پدر', value: 'f'},
        {name: 'مادر', value: 'm'},
      ],
      MARITAL_STATUS_TYPES: [
        {name: ' مجرد', value: 's'},
        {name: 'متاهل', value: 'm'},
        {name: 'سرپرست فرزند', value: 'c'},
      ],
      GENDER_TYPES: [
        {name: ' آقا', value: 'm'},
        {name: 'خانم', value: 'f'},
      ],
      CHILD_TYPES: [
        {name: ' فرزند پسر', value: 'm'},
        {name: 'فرزند دختر', value: 'f'},
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
        {name: 'نقض عضو', value: 'm'},
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
      marital: {},
      naming: {},
      gender: {},
      father_naming: {},
      nat: {},
      performClearForm: true,
      personnel_name: null,
      personnel_filter: null,
      filters: {},
      slug: this.$route.params.id,
      female: 'هیچ کدام',
      married: 'متاهل',
      men: 'آقا',
      women: 'خانم',
      first: false,
      rules: {
        required: value => !!value || 'Required.',
      },


    };
  },
  updated() {
    if (!this.first && this.$route.params.id) {
      this.first = true
      this.isEditing = false
    }
  },

  computed: {
    headers() {
      return [
        {
          text: "پرسنل",
          value: "personnel_name",
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
    if (this.$route.params.id) {
      this.isEditing = false
    }
    if (!this.personnel) {
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
            this.marital[data[t].id] = data[t].marital_status
            this.naming[data[t].id] = data[t].last_name
            this.father_naming[data[t].id] = data[t].father_name
            this.gender[data[t].id] = data[t].gender
            this.nat[data[t].id] = data[t].national_code
          }
          console.log(this.personnels)
        }
      })
    }
    if (this.personnel) {
      this.filters['personnel'] = this.personnel
      this.request({
        url: this.endpoint(`payroll/personnel/` + this.personnel + '/'),
        method: "get",
        success: data => {
          this.personnel_name = data.name + ' ' + data.last_name
        }
      })
    }
    if (this.$route.params.id){
      this.request({
        url: this.endpoint(`payroll/personnel/family/` + this.$route.params.id + '/'),
        method: "get",
        success: data => {
          this.filters['personnel'] = data.personnel
          console.log(data.personnel)
        }
      })


    }
  },
  methods: {
    NumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
        ;
      } else {
        return true;
      }
    },
    NoneNumbersOnly(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        return true;
      } else {
        evt.preventDefault();
        ;
      }
    },

    verifyPersonnel(id) {
      this.request({
        url: this.endpoint(`payroll/personnel/family/verify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  خانواده نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })

    },
    verifyUnPersonnel(id) {
      this.request({
        url: this.endpoint(`payroll/personnel/family/unverify/` + id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('خانواده از نهایی خارج شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })

    },

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

