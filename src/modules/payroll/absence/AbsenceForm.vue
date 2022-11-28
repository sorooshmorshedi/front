<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <m-form
            title="ثبت مرخصی یا غیبت"
            :showList="false"
            :listRoute="{name:'AbsenceList'}"
            :exportBaseUrl="printUrl"
            :exportParams="{id: item.id}"
            :canDelete="false"
            :canSubmit="canSubmit"
            :isEditing.sync="isEditing"
            @submit="submit"
            @delete="deleteItem"
            @clearForm="clearForm()"
            ref="AbsenceForm"

        >

          <template>

            <v-row v-if="item.leave_type == 'e'">
              <v-col cols="12" md="4">
                <v-autocomplete
                    v-if="!this.workshopPersonnel"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    @change
                    :disabled="!isEditing"
                />
                <v-text-field
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    label="نوع"
                    :items="ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    v-if="item.leave_type == 'e'"
                    label="نوع مرخصی استحقاقی"
                    :items="ENTITLEMENT_LEAVE_TYPES"
                    v-model="item.entitlement_leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </v-col>
            </v-row>
            <v-row v-if="item.leave_type == 'm'">
              <v-col cols="12" md="4">
                <v-autocomplete
                    v-if="!this.workshopPersonnel"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    @change
                    :disabled="!isEditing"
                />
                <v-text-field
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    label="نوع"
                    :items="ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-autocomplete
                    v-if="item.leave_type == 'm'"
                    label="دلیل مرخصی ماده 73"
                    :items="MATTER_73_LEAVE_TYPES"
                    v-model="item.matter73_leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                />
              </v-col>
              <v-col cols="12" md="12">
                <v-banner
                    class="mt-2 ئ-ذ-2"
                    outlined
                    rounded
                    single-line
                    sticky
                >
                  <v-icon
                      color="orange"
                      large
                  >info
                  </v-icon>
                  در مرخصی ماده 73 حداکثر مدت زمان سه روز ثبت  می شود
                </v-banner>
              </v-col>

            </v-row>
            <v-row v-if="item.leave_type != 'e' && item.leave_type != 'm'">
              <v-col cols="12" md="6">
                <v-autocomplete
                    v-if="!this.workshopPersonnel"
                    label=" پرسنل در کارگاه"
                    :items="workshopPersonnels"
                    v-model="item.workshop_personnel"
                    item-text="name"
                    item-value="id"
                    @change
                    :disabled="!isEditing"
                />
                <v-text-field
                    label="پرسنل در کارگاه"
                    v-if="this.workshopPersonnel"
                    disabled="true"
                    v-model="item.workshop_personnel = this.workshopPersonnel"

                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-autocomplete
                    label="نوع"
                    :items="ABSENCE_TYPES"
                    v-model="item.leave_type"
                    item-text="name"
                    item-value="value"
                    :disabled="!isEditing"
                    @change="setValues(item)"
                />
              </v-col>
            </v-row>
            <v-row
                v-if="item.leave_type != 'e'"

            >
              <v-col cols="9" md="6">
                <date v-model="item.from_date" label="* از تاریخ" :default="true" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="9" md="6">
                <date v-model="item.to_date" label="* تا تاریخ " :default="true" :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row
                v-if="item.leave_type == 'e' && item.entitlement_leave_type != 'h'"

            >
              <v-col cols="9" md="6">
                <date v-model="item.from_date" label="* از تاریخ" :default="true" :disabled="!isEditing"/>
              </v-col>
              <v-col cols="9" md="6">
                <date v-model="item.to_date" label="* تا تاریخ " :default="true" :disabled="!isEditing"/>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12" v-if="item.leave_type == 'i'"
              >

                <v-text-field label="علت حادثه" v-model="item.cause_of_incident" background-color="white"
                              :disabled="!isEditing"/>

              </v-col>
            </v-row>
            <v-row
                v-if="item.entitlement_leave_type == 'h' && item.leave_type == 'e' "
            >
              <v-col cols="12" md="4">
                <date v-model="item.date" label="* تاریخ " :default="true" :disabled="!isEditing"/>
              </v-col>

              <v-col
                  cols="12"
                  sm="4"
              >
                <v-dialog
                    ref="dialog"
                    v-model="modal2"
                    :return-value.sync="time"
                    persistent
                    width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        :disabled="!isEditing"
                        v-model="item.from_hour"
                        label="از ساعت"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                      v-if="modal2"
                      v-model="item.from_hour"
                      full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="secondary"
                        @click="modal2 = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(time)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>
              <v-col
                  cols="12"
                  sm="4"
              >
                <v-dialog
                    ref="dialog1"
                    v-model="menu1"
                    :return-value.sync="time"
                    persistent
                    width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                        :disabled="!isEditing"
                        v-model="item.to_hour"
                        label="تا ساعت"
                        prepend-icon="mdi-clock-time-four-outline"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                      v-if="menu1"
                      v-model="item.to_hour"
                      full-width
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                        text
                        color="primary"
                        @click="menu1 = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog1.save(time)"
                    >
                      OK
                    </v-btn>
                  </v-time-picker>
                </v-dialog>
              </v-col>

            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field label="توضیحات" v-model="item.explanation" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>
              <v-col cols="12" md="4" v-if="item.id">
                <v-text-field label="مدت مرخصی به روز" v-model="item.time_period" background-color="white"
                              :disabled="!isEditing"/>
              </v-col>

            </v-row>

          </template>
        </m-form>
      </v-col>
      <v-col cols="12" md="6">
        <summary-absence-list></summary-absence-list>
      </v-col>
    </v-row>
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
import SummaryAbsenceList from "@/modules/payroll/absence/SummaryAbsenceList";


export default {
  name: "AbsenceForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {SummaryAbsenceList, mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      ABSENCE_TYPES: [
        {name: ' استحقاقی', value: 'e'},
        {name: 'ماده 73', value: 'm'},
        {name: 'استعلاجی', value: 'i'},
        {name: 'بدون حقوق', value: 'w'},
        {name: 'غیبت', value: 'a'},
      ],
      MATTER_73_LEAVE_TYPES: [
        {name: ' زایمان', value: 'c'},
        {name: 'ازدواج', value: 'm'},
        {name: 'مرگ همسر', value: 's'},
        {name: 'مرگ فرزند', value: 'd'},
        {name: 'مرگ پدر یا مادر', value: 'p'},
      ],
      ENTITLEMENT_LEAVE_TYPES: [
        {name: ' ساعتی', value: 'h'},
        {name: 'روزانه', value: 'd'},

      ],
      time: null,
      menu1: false,
      modal2: false,
      printUrl: 'payroll/absence/request',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/absence",
      type: null,
      entitlement: null,
      permissionBasename: "absence",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: false,
      isDefinable: false,
      myClass: '',
      workshopPersonnel: this.$route.query.workshop_personnel,
      workshopPersonnels: [],
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
          text: " پرسنل در کارگاه",
          value: "workshop_personnel",
        },
        {
          text: "نوع",
          value: "leave_type_display",
        },
        {
          text: "مدت به روز",
          value: "time_period",
        },
      ];
    },
  },
  mounted() {
    if (!this.workshopPersonnel) {
      this.request({
        url: this.endpoint(`payroll/workshop/personnel/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshopPersonnels.push({
              'name': data[t].personnel_name + ' در کارگاه ' + data[t].workshop_name,
              'id': data[t].id,
            })
          }
          console.log(this.workshopPersonnels)
        }
      })
    }
  },

  methods: {
    setValues(item) {
      if (item.leave_type == 'e') {
        console.log('ok')
        this.entitlement = true
      }
    },

    to(item) {
      return {
        name: 'WorkshopContractDetail',
        params: {
          id: item.id,
        },
      };
    },

    unConfirm() {
      this.$router.go()
      this.notify(' ثبت قرارداد رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

