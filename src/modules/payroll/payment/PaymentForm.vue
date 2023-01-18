<template>
  <v-card class=" "
          elevation="3"
          outlined
          tile>
    <v-toolbar color="indigo darken-2">
      <v-toolbar-title class="white--text">محاسبه حقوق</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
          small
          v-if="payment_start"
          outlined
          @click="reloadWindow"
          class="white--text mt-1 ml-1 mt-md-0"
          icon
          title="جدید"
      >
        <v-icon>fa-eraser</v-icon>
      </v-btn>
      <v-btn
          small
          class="light-blue white--text ml-2 mt-1 mt-md-0"
          icon
          @click="goToList"
          outlined
          title="لیست"
      >
        <v-icon>fa-th-list</v-icon>
      </v-btn>

    </v-toolbar>
    <v-row class="mt-4 mr-3 ml-3">
      <v-col class="mt-5" cols="12" md="4">
        <v-autocomplete
            v-if="!this.workshop"
            label="کارگاه"
            :items="workshops"
            v-model="search_workshop"
            :disabled="payment_start"
            item-text="name"
            item-value="id"
        />
        <v-text-field
            label="کارگاه"
            v-if="this.workshop"
            disabled="true"
            v-show="false"
            v-model="search_workshop"
        ></v-text-field>
        <v-text-field
            label="کارگاه"
            v-if="this.workshop"
            disabled="true"
            v-model="this.workshop_name "
        ></v-text-field>
      </v-col>
      <v-col class="mt-5" cols="12" md="4">
        <v-autocomplete
            label="سال"
            v-model="year"
            :disabled="payment_start || !search_workshop"
            :items="years"
        ></v-autocomplete>
      </v-col>
      <v-col class="mt-5" cols="12" md="4">
        <v-autocomplete
            v-if="payment_type"
            label="ماه"
            :items="MONTHS"
            :disabled="payment_start || !search_workshop || !year"
            v-model="search_month"
            @change="paymentStart"
            item-text="name"
            item-value="id"
        />
        <v-autocomplete
            v-if="!payment_type"
            label="ماه"
            :items="MONTHS"
            :disabled="payment_start"
            v-model="search_month"
            @change="paymentStart"
            item-text="name"
            item-value="id"
        />
      </v-col>
    </v-row>
    <v-card-actions v-if="!payment_start" class="mt-4 d-flex justify-center justify-md-end mt-2">
      <v-btn
          @click="paymentStart ; payment_start = true"
          left
          large
          v-if="search_workshop && search_month"
          class=" green white--text mb-5 ml-4 pl-4 pr-4 "
      >ادامه
      </v-btn>

    </v-card-actions>
    <v-row v-if="payment_start && !list_generated">
      <v-col cols="12" md="6">
        <v-card class="ma-5">
          <v-toolbar color="indigo">
            <v-toolbar-title class="white--text">
              حقوق و دستمزد
            </v-toolbar-title>
          </v-toolbar>
          <v-col class="mt-5 pr-10 pl-10" cols="12" md="12" v-if="payment_type">

            <v-autocomplete
                label="نوع لیست"
                :items="PAYMENT_TYPES"
                v-model="payment_type"
                :disabled="list_generated"
                item-text="name"
                item-value="value"

            />

          </v-col>
          <v-row v-if="!payment_type" class="mt-5 pr-10 pl-10">
            <v-col cols="12" md="6">
              <v-autocomplete
                  label="نوع لیست"
                  :items="PAYMENT_TYPES"
                  v-model="payment_type"
                  :disabled="list_generated"
                  item-text="name"
                  item-value="value"
              />

            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                  @change="getListsOfMonth(lists_of_month)"
                  label="ماه"
                  :items="MONTHS"
                  v-model="lists_of_month"
                  :disabled="list_generated"
                  item-text="name"
                  item-value="id"
              />

            </v-col>
          </v-row>
          <v-row class="mt-2 pr-10 pl-10">
            <v-col cols="12" md="12" v-if="!payment_type"
            >
              <v-autocomplete
                  label=" کپی بر اساس"
                  :items="workshop_list_of_pay"
                  v-model="copy_id"
                  :disabled="list_generated"
                  item-text="name"
                  item-value="id"
              />
            </v-col>
          </v-row>
          <v-row class="mt-2 pr-10 pl-10">

            <v-col cols="12" md="12">
              <v-text-field
                  label="نام لیست"
                  :disabled="list_generated"
                  v-model="list_name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-2 pr-10 pl-10">
            <v-col cols="12" md="12">
              <v-autocomplete
                  label="محاسبه بیمه و مالیات"
                  :items="CALCULATE_TYPES"
                  :disabled="list_generated"
                  v-model="calculate"
                  item-text="name"
                  item-value="value"
              />
            </v-col>
          </v-row>
          <v-card-actions class="mt-4 d-flex justify-center justify-md-end mt-2">
            <v-btn
                @click="getList"
                v-if="payment_type && !payListCreated"
                left
                class=" green white--text mb-5 ml-8 pl-4 pr-4 "
            >ثبت
            </v-btn>
            <v-btn
                @click="list_generated = true"
                v-if="payment_type && payListCreated"
                left
                large
                class=" blue white--text mb-5 ml-8 pl-4 pr-4 "
            > انجام محاسبات
            </v-btn>
            <v-btn
                @click="createListOfPayByPervious"
                v-if="!payment_type"
                left
                class=" green white--text mb-5 ml-8 pl-4 pr-4 "
            >ثبت
            </v-btn>

          </v-card-actions>
        </v-card>

        <v-row justify="center">
          <v-dialog
              v-model="error_dialog"
              persistent
              @click:outside="error_dialog=false"
              max-width="400"
          >
            <v-card>
              <v-card-title class="red--text text-h5">
                لطفا موارد زیر را تکمیل یا اصلاح کنید!
              </v-card-title>
              <v-card-text>
                <v-row v-for="item in error_message" class="mt-5 mr-10">
                  {{ item }}
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="green darken-1"
                    text
                    @click="error_dialog = false"
                >
                  بستن
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

      </v-col>
      <v-col cols="12" md="6">
        <v-card class="ma-5">
          <v-toolbar color="indigo">
            <v-toolbar-title class="white--text">
              لیست های این کارگاه برای {{ search_month }} / {{ year }}
            </v-toolbar-title>
          </v-toolbar>
          <m-datatable class="ma-3" :show-export-btns="false" :headers="headers"
                       :apiUrl="url" exportUrl="payroll" :filters.sync="export_filter"
                       ref="exportTable">
          </m-datatable>

        </v-card>

      </v-col>
    </v-row>

    <v-row>
      <v-simple-table v-if="list_generated && !calculateDone" class="ma-6 " dense>
        <template v-slot:default>
          <thead class="style: blue lighten-4">
          <tr>
            <th class="text-center">
              لحاظ کردن در لیست حقوق
            </th>
            <th class="text-center">
              نام و نام خانوادگی
            </th>
            <th class="text-center">
              ردیف پیمان
            </th>
            <th class="text-center">
              اضافه کاری
            </th>

            <th class="text-center">
              تعطیل کاری
            </th>
            <th class="text-center">
              کسر کار
            </th>
            <th class="text-center">
              شب کاری
            </th>

            <th class="text-center">
              نوبت کاری صبح و عصر
            </th>
            <th class="text-center">
              نوبت کاری صبح و شب
            </th>

            <th class="text-center">
              نوبت کاری عصر و شب
            </th>

            <th class="text-center">
              نوبت کاری صبح و عصر و شب
            </th>
            <th class="text-center">
              مزایای غیر مستمر غیرنقدی
            </th>
            <th class="text-center">
              سایر اضافات
            </th>

            <th class="text-center">
              سایرکسورات
            </th>

          </tr>
          </thead>
          <tbody class="grey lighten-4 ma-2">
          <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
            <td class="text-center pb-5 pt-5">
              <v-switch
                  color="green"
                  background-color="rey lighten-4"
                  :false-value="false"
                  :true-value="true"
                  v-model="items[person.id]['is_in']"
              ></v-switch>
            </td>
            <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>
            <td>
              <v-autocomplete
                  :items="contractRows"
                  v-model="items[person.id]['contract_row']"
                  item-text="name"
                  item-value="id"
                  :disabled="!items[person.id].is_in"
              />
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['ezafe_kari'] "
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['tatil_kari'] "
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['kasre_kar'] "
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <hour-picker
                  v-model="items[person.id]['shab_kari']"
                  :disabled="!items[person.id].is_in"
              ></hour-picker>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_asr'] "
                            class="currency-input"
                            label="روز"
                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_shab'] "
                            class="currency-input"
                            label="روز"

                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['asr_shab'] "
                            class="currency-input"
                            label="روز"

                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <v-text-field v-model="items[person.id]['sob_asr_shab'] "
                            class="currency-input"
                            label="روز"

                            :disabled="!items[person.id].is_in"
              >
              </v-text-field>
            </td>
            <td>
              <money
                  v-model="items[person.id]['mazaya_gheyr_mostamar'] "
                  background-color="white"
                  :disabled="!items[person.id].is_in"
              />
            </td>

            <td>
              <money
                  v-model="items[person.id]['sayer_ezafat'] "
                  background-color="white"
                  :disabled="!items[person.id].is_in"
              />
            </td>

            <td>
              <money
                  v-model="items[person.id]['sayer_kosoorat'] "
                  background-color="white"
                  :disabled="!items[person.id].is_in"
              />

            </td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-row>
    <v-card-actions v-if="payment_start && list_generated" class="mt-4 d-flex justify-center justify-md-end mt-2">
      <div class="text-center">
        <v-dialog
            v-model="dialog"
            width="1500"
            persistent
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="blue"
                class="white--text ml-5 pl-10 pr-10"
                dark
                v-bind="attrs"
                v-on="on"
            >
              مرخصی و ماموریت تجمیعی
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 indigo white--text">
              مرخصی و ماموریت تجمیعی
            </v-card-title>
            <v-simple-table class="border_all b ma-4 " dense>
              <template v-slot:default>
                <thead class="style: blue lighten-4">
                <tr>
                  <th>
                    مشخصات

                  </th>
                  <th class="text-center" colspan="3">
                    ماموریت (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    مرخصی استحقاقی (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    مرخصی استعلاجی (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    مرخصی بدون حقوق (روز)
                  </th>
                  <th class="text-center" colspan="3">
                    غیبت (روز)
                  </th>
                  <th class="text-center" colspan="1">
                    مرخصی ماده 73 (روز)
                  </th>
                </tr>
                </thead>
                <thead class="style: blue lighten-4">
                <tr>
                  <th class="text-center">
                    نام و نام خانوادگی
                  </th>
                  <th class="text-center">
                    ماموریت ثبت شده
                  </th>
                  <th class="text-center">
                    ماموریت تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    مرخصی استحقاقی ثبت شده
                  </th>
                  <th class="text-center">
                    مرخصی استحقاقی تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    مرخصی استعلاجی ثبت شده
                  </th>
                  <th class="text-center">
                    مرخصی استعلاجی تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    مرخصی بدون حقوق ثبت شده
                  </th>
                  <th class="text-center">
                    مرخصی بدون حقوق تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                    غیبت ثبت شده
                  </th>
                  <th class="text-center">
                    غیبت تجمیعی
                  </th>
                  <th class="text-center">
                    جمع
                  </th>
                  <th class="text-center">
                  </th>


                </tr>
                </thead>
                <tbody class="grey lighten-4 ma-2">
                <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
                  <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>
                  <td class="text-center">
                    {{items[person.id]['mission']}}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_mission'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td class="text-center">
                    {{ total[person.id].mission }}
                  </td>
                  <td class="text-center">
                    {{items[person.id]['entitlement']}}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_entitlement'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"

                    ></v-text-field>
                  </td>
                  <td>
                    {{total[person.id].entitlement}}
                  </td>
                  <td class="text-center">
                    {{items[person.id]['illness']}}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_illness'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td>
                    {{total[person.id].illness}}
                  </td>
                  <td class="text-center">
                    {{items[person.id]['without_salary']}}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_without_salary'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td>
                    {{total[person.id].without_salary}}
                  </td>
                  <td class="text-center">
                    {{items[person.id]['absence']}}
                  </td>
                  <td>
                    <v-text-field
                        class="currency-input"
                        v-model="items[person.id]['cumulative_absence'] "
                        :disabled="!items[person.id].is_in"
                        @change="get_total()"
                    ></v-text-field>
                  </td>
                  <td>
                    {{total[person.id].absence}}
                  </td>
                  <td class="text-center">
                    {{ items[person.id]['73'] }}
                  </td>
                </tr>

                </tbody>
              </template>
            </v-simple-table>


            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green"
                  dark
                  @click="dialog = false ; cumulativeDone = true"
              >
                تایید
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </div>
      <div class="text-center">
        <v-dialog
            v-model="dialog1"
            width="1500"
            persistent
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
                color="blue"
                class="white--text ml-5 pl-10 pr-10"
                dark
                v-bind="attrs"
                v-on="on"
            >
              سایر معافیت های مالیاتی
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 indigo white--text">
              سایر معافیت های مالیاتی
            </v-card-title>
            <v-simple-table class="ma-4 " dense>
              <template v-slot:default>
                <thead class="style: blue lighten-4">
                <tr>
                  <th class="text-center">
                    نام و نام خانوادگی
                  </th>
                  <th class="text-center">
                    هزینه های درمانی ماده 137 ق.م.م
                  <th class="text-center">
                    سایر حق بیمه پرداختی ماده 137 ق.م.م
                  </th>
                  <th class="text-center">
                    معافیت مربوط به مناطق آزاد تجاری
                  </th>
                  <th class="text-center">
                    معافیت قانون اجتناب از اخذ مالیات مضاعف
                  </th>
                  <th class="text-center">
                    سایر معافیت های مالیات
                  </th>

                </tr>
                </thead>
                <tbody class="grey lighten-4 ma-2">
                <tr v-for="person in payList" :key="person.id" class="ma-2 pa-2">
                  <td class="text-center pb-5 pt-5">{{ person.personnel_name }}</td>

                  <td>
                    <money
                        v-model="items[person.id]['hazine_made_137'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['kosoorat_insurance'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['manategh_tejari_moafiat'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>

                  <td>
                    <money
                        v-model="items[person.id]['ejtenab_maliat_mozaaf'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                  <td>
                    <money
                        v-model="items[person.id]['sayer_moafiat'] "
                        background-color="white"
                        :disabled="!items[person.id].is_in"
                    />
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>


            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green"
                  dark
                  @click="dialog1 = false ; sayerDone=true"
              >
                تایید
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


      </div>

    </v-card-actions>
    <v-card-actions class="mt-5">
      <v-row v-if="list_generated && !calculateDone">
        <v-col cols="12" md="4" class="text-center">
          <v-banner v-if="cumulativeDone" class="mt-3 mb-5 green--text">
            <v-avatar
                slot="icon"
                color="green"
                size="25"
            >
              <v-icon
                  color="white"
              >
                fa-check
              </v-icon>
            </v-avatar>
            ماموریت و مرخصی تجمیعی تایید شد
          </v-banner>
          <v-banner v-if="!cumulativeDone" class="mt-3 mb-5 red--text">
            <v-avatar
                slot="icon"
                color="red"
                size="25"
            >
              <v-icon
                  color="white"
              >
                fa-info
              </v-icon>
            </v-avatar>
            برای محاسبه حقوق، ماموریت و مرخصی تجمیعی را تایید کنید
          </v-banner>
        </v-col>
        <v-col cols="12" md="4">
          <v-banner v-if="sayerDone" class="mt-3 mb-5 green--text">
            <v-avatar
                slot="icon"
                color="green"
                size="25"
            >
              <v-icon
                  color="white"
              >
                fa-check
              </v-icon>
            </v-avatar>
            سایر معافیت های مالیاتی تایید شد
          </v-banner>
          <v-banner v-if="!sayerDone" class="mt-3 mb-5 red--text">
            <v-avatar
                slot="icon"
                color="red"
                size="25"
            >
              <v-icon
                  color="white"
              >
                fa-info
              </v-icon>
            </v-avatar>
            برای محاسبه حقوق، سایر معافیت های مالیاتی را تایید کنید
          </v-banner>

        </v-col>
        <v-col cols="12" md="4" class="text-center">
          <v-btn large v-if="list_generated && !calculateDone && sayerDone && cumulativeDone"
                 @click="accept_dialog = true" color="green"
                 block
                 class="white--text float-left ma-3 mt-6">ثبت و محاسبه حقوق و دستمزد
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-row justify="center">
      <v-dialog
          v-model="accept_dialog"
          persistent
          @click:outside="accept_dialog=false"
          max-width="450"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            توجه!
          </v-card-title>
          <v-card-text>
            آیا از ثبت این لیست و انجام محاسبات با این اطلاعات اطمینان
            دارید؟
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="accept_dialog = false"
            >
              بستن
            </v-btn>
            <v-btn
                color="green"
                text
                @click="calculatePayment"
            >
              محاسبه حقوق و دستمزد
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

  </v-card>


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
import HourPicker from "@/components/scomponents//HourPicker";


import TransactionForm from "@/views/panel/transaction/Form";
import LadingMixin from "@/modules/dashtbashi/LadingMixin";


export default {
  name: "payment",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money, HourPicker},
  props: {
    id: {},
  },
  data() {
    return {
      years: [],
      year: null,
      export_filter: {workshop: this.search_workshop, month: this.search_month},
      url: 'payroll/listOfPay/all',
      items: {},
      MONTHS: [
        {name: ' فروردین', value: 'fa', 'id': 1},
        {name: ' اردیبهشت', value: 'or', 'id': 2},
        {name: ' خرداد', value: 'kh', 'id': 3},
        {name: ' تیر', value: 'ti', 'id': 4},
        {name: ' مرداد', value: 'mo', 'id': 5},
        {name: ' شهریور', value: 'sh', 'id': 6},
        {name: ' مهر', value: 'me', 'id': 7},
        {name: ' آبان', value: 'ab', 'id': 8},
        {name: ' آذر', value: 'az', 'id': 9},
        {name: ' دی', value: 'de', 'id': 10},
        {name: ' بهمن', value: 'ba', 'id': 11},
        {name: ' اسفند', value: 'es', 'id': 12},
      ],
      PAYMENT_TYPES: [
        {name: ' جدید', value: true},
        {name: ' کپی از ماه های قبل', value: false},
      ],
      CALCULATE_TYPES: [
        {name: 'محاسبه شود', value: true},
        {name: ' محاسبه نشود', value: false},
      ],
      payment_type: true,
      lists_of_month: true,
      time: null,
      search_workshop: null,
      search_month: null,
      menu1: false,
      modal2: false,
      dialog1: false,
      list_name: '',
      total: {},
      type: null,
      entitlement: null,
      calculate: null,
      bime: true,
      list_status: false,
      appendSlash: true,
      a: 1,
      b: 2,
      hasList: false,
      hasIdProp: true,
      error_dialog: false,
      accept_dialog: false,
      cumulativeDone: false,
      error_message: null,
      contractRows: [],
      hasLock: true,
      isDefinable: true,
      myClass: '',
      workshop: this.$route.query.workshop,
      workshops: [],
      workshop_list_of_pay: [],
      PathLevels,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      pay_id: '',
      copy_id: '',
      performClearForm: true,
      workshop_name: null,
      list_generated: false,
      payList: null,
      list_of_pay: null,
      show_list_of_pay: false,
      calculateDone: false,
      dialog: false,
      payment_start: false,
      payListCreated: false,
      id_set: null,
      sayerDone: false,
    };
  },
  computed: {
    my_total: function () {
      let res = {}
      for (let item in this.items) {
        this.$set(res, item, {
          'mission': this.items.item.mission + this.items.item.cumulative_mission
        })
      }
      return res;
    },
    headers() {
      return [
        {
          text: " کارگاه",
          value: "workshop_display",
          filterable: false,
        },
        {
          text: " نام لیست",
          value: "name",
        },
        {
          text: "سال",
          value: "year",
          filterable: false,
        },
        {
          text: "ماه",
          value: "month_name",
          filterable: false,
        },
        {
          text: "محاسبه در بیمه و مالیات",
          value: "use_in_calculate",
          type: 'boolean'
        },
        {
          text: "نهایی",
          value: "ultimate",
          type: 'boolean',
        },

      ];
    },
  },
  mounted() {
    this.year = parseInt(this.serverNow.format('jYYYY'))
    let counter = 0
    while (counter < 6) {
      if (counter == 0) {
        this.years.push(parseInt(this.serverNow.format('jYYYY')))
      } else {
        this.years.push(parseInt(this.serverNow.format('jYYYY')) + counter)
        this.years.push(parseInt(this.serverNow.format('jYYYY')) - counter)
      }
      counter += 1
    }
    this.years.sort()
    console.log(this.years)

    if (!this.workshop) {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
              'id': data[t].id,
            })
          }
          console.log(this.workshops)
        }
      })
    }
    if (this.workshop) {
      this.request({
        url: this.endpoint(`payroll/workshop/` + this.workshop + '/'),
        method: "get",
        success: data => {
          this.workshop_name = data.name + ' ' + data.code
        }
      })
    }
  },

  methods: {
    get_total() {
      for (let item in this.items) {
        if (this.items[item] != null) {
          this.$set(this.total, this.items[item].id, {
            'mission': parseInt(this.items[item]['mission']) + parseInt(this.items[item]['cumulative_mission']),
            'absence': parseInt(this.items[item]['absence']) + parseInt(this.items[item]['cumulative_absence']),
            'entitlement': parseFloat(this.items[item]['entitlement']) + parseInt(this.items[item]['cumulative_entitlement']),
            'illness': parseInt(this.items[item]['illness']) + parseInt(this.items[item]['cumulative_illness']),
            'without_salary': parseInt(this.items[item]['without_salary']) + parseInt(this.items[item]['cumulative_without_salary']),
          })
        }
      }

    },
    Show(item) {
      console.log(item)
    },
    onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    },
    getList() {
      this.request({
        url: this.endpoint(`payroll/payment/` + this.year + '/' + this.search_month + '/' + this.search_workshop + '/'),
        method: "post",
        data: {
          'name': this.list_name,
          'ultimate': this.list_status,
          'use_in_calculate': this.calculate,
          'use_in_bime': this.bime
        },

        success: data => {
          this.pay_id = data.id
          this.payList = data.list_of_pay_item
          this.payListCreated = true
          for (let item in this.payList) {
            this.$set(this.items, this.payList[item].id, {
              'is_in': true,
              'id': this.payList[item].id,
              'ezafe_kari': "00:00",
              'tatil_kari': "00:00",
              'kasre_kar': "00:00",
              'shab_kari': "00:00",
              'jome_kar': "00:00",
              'sob_shab': null,
              'sob_asr': null,
              'asr_shab': null,
              'sob_asr_shab': null,
              'mazaya_gheyr_mostamar': null,
              'sayer_ezafat': null,
              'contract_row': null,
              'hazine_made_137': null,
              'kosoorat_insurance': null,
              'sayer_moafiat': null,
              'manategh_tejari_moafiat': null,
              'ejtenab_maliat_mozaaf': null,
              'sayer_kosoorat': null,
              'cumulative_absence': 0,
              'cumulative_mission': 0,
              'cumulative_entitlement': 0,
              'cumulative_illness': 0,
              'cumulative_without_salary': 0,
              'absence': this.payList[item].absence_day,
              '73': this.payList[item].get_matter_47_leave_day,
              'mission': this.payList[item].mission_day,
              'entitlement': this.payList[item].entitlement_leave_day,
              'illness': this.payList[item].illness_leave_day,
              'without_salary': this.payList[item].without_salary_leave_day,
            })
          }
          this.get_total()
          console.log(this.items)
          this.notify('لیست حقوق ساخته شد، جهت تکمیل و انجام محاسبات روی دکمه انجام محاسبات کلیک کنید', 'success')
          this.request({
            url: this.endpoint(`payroll/workshop/contract/row/` + this.search_workshop + '/'),
            method: "get",
            success: data => {
              for (let t in data) {
                this.contractRows.push({
                  'name': data[t].contract_row,
                  'id': data[t].id,
                })
                console.log(this.contractRows)
                this.contractRows.push({
                  'name': 'هبچ کدام',
                  'id': null,
                })

              }
              this.$refs.exportTable.getDataFromApi()
              this.$refs.exportTable.getDataFromApi()
            }
          })
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true
        }

      })
    },

    calculatePayment() {
      for (let payitem in this.items) {
        this.request({
          url: this.endpoint(`payroll/paylist/item/` + payitem + '/'),

          method: "put",
          data: {
            'is_in': this.items[payitem]['is_in'],
            'ezafe_kari': this.items[payitem]['ezafe_kari'],
            'tatil_kari': this.items[payitem]['tatil_kari'],
            'kasre_kar': this.items[payitem]['kasre_kar'],
            'shab_kari': this.items[payitem]['shab_kari'],
            'nobat_kari_sob_asr': this.items[payitem]['sob_asr'],
            'nobat_kari_sob_shab': this.items[payitem]['sob_shab'],
            'nobat_kari_asr_shab': this.items[payitem]['asr_shab'],
            'nobat_kari_sob_asr_shab': this.items[payitem]['sob_asr_shab'],
            'sayer_ezafat': this.items[payitem]['sayer_ezafat'],
            'contract_row': this.items[payitem]['contract_row'],
            'mazaya_gheyr_mostamar': this.items[payitem]['mazaya_gheyr_mostamar'],
            'hazine_made_137': this.items[payitem]['hazine_made_137'],
            'kosoorat_insurance': this.items[payitem]['kosoorat_insurance'],
            'sayer_moafiat': this.items[payitem]['sayer_moafiat'],
            'manategh_tejari_moafiat': this.items[payitem]['manategh_tejari_moafiat'],
            'ejtenab_maliat_mozaaf': this.items[payitem]['ejtenab_maliat_mozaaf'],
            'sayer_kosoorat': this.items[payitem]['sayer_kosoorat'],
            'cumulative_absence': this.items[payitem]['cumulative_absence'],
            'cumulative_mission': this.items[payitem]['cumulative_mission'],
            'cumulative_entitlement': this.items[payitem]['cumulative_entitlement'],
            'cumulative_illness': this.items[payitem]['cumulative_illness'],
            'cumulative_without_salary': this.items[payitem]['cumulative_without_salary'],
            'calculate_payment': true,
          },
          success: data => {
            console.log(data)
            this.get_payment_list()
          },
        })

      }
    },

    get_payment_list() {
      this.$router.push('/panel/listOfPayItem/' + this.pay_id)
    },
    reloadWindow() {
      if(this.pay_id){
        this.request({
          url: this.endpoint(`payroll/paylist/` + this.pay_id + '/'),
          method: "delete",
          success: data => {
            window.location.reload()
          }
        })
      } else {
        window.location.reload()
      }
    },

    sayer(id) {
      this.id_set = id
      console.log(id)
    },

    getWorkshopListOfPay() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/workshop/` + this.search_workshop + '/'),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshop_list_of_pay.push({
              'name': data[t].name,
              'id': data[t].id
            })
            console.log(this.workshop_list_of_pay)
          }
        }
      })

    },
    createListOfPayByPervious() {
      this.request({
        url: this.endpoint(`payroll/listOfPay/copy/` + this.copy_id + '/'),
        method: "post",
        data: {
          'year': parseInt(this.serverNow.format('jYYYY')),
          'name': this.list_name,
          'ultimate': this.list_status,
          'use_in_calculate': this.calculate,
          'month': this.search_month
        },
        success: data => {
          this.$router.push('/panel/payList/edit?pay_id=' + data['id'])
        }
      })
    },
    paymentStart() {
      this.request({
        url: this.endpoint(`payroll/PaymentVerify/` + this.year + '/' + this.search_month + '/' + this.search_workshop + '/'),
        method: "get",
        success: data => {
          this.export_filter['workshop'] = this.search_workshop
          this.export_filter['month'] = this.search_month
          this.export_filter['year'] = parseInt(this.serverNow.format('jYYYY'))
        },
        error: data => {
          this.payment_start = false
        }

      })

    },

    getListsOfMonth(month) {
      this.request({
        url: this.endpoint(`payroll/listOfPay/workshop/` + this.search_workshop + '/' + month + '/' +
            this.year + '/'),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshop_list_of_pay.push({
              'name': data[t].name,
              'id': data[t].id
            })
          }
        }

      })

    },
    goToList() {
      this.$router.push('/panel/ListOfPay')
    },
    show(item) {
      console.log(item)
    }

  },
}
</script>

<style scoped lang="scss">
table th + th { border-left:2px solid #dddddd; }
table td + td { border-left:1px solid #dddddd; }
</style>
