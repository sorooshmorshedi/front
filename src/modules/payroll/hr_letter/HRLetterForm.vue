<template xmlns="http://www.w3.org/1999/html">
  <div>
    <m-form
        title="ثبت حکم کارگزینی"
        :showList="false"
        :listRoute="{name:'HRLetterList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :show-actions="item.id || createOne "
        :show-submit-and-clear-btn="false"
        :show-navigation-btns="false"
        :items.sync="item"
        :canDelete="false"
        :canSubmit="item.is_calculated"
        :can-edit="item.is_calculated && !item.is_verified"
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="HRLetterFrom"
    >
      <template>
        <v-toolbar color="indigo">
          <v-toolbar-title class="white--text">
            مشخصات
          </v-toolbar-title>
        </v-toolbar>
        <v-row v-show="false">
          <v-text-field
              v-model="item.is_template = 'p'"
          />
        </v-row>

        <v-row class="pt-3 pb-3 pr-3 pl-3">
          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <v-row>
                <v-col cols="12" md="12">
                  <v-autocomplete
                      v-if="!item.id"
                      label=" کارگاه"
                      :items="workshops"
                      item-text="name"
                      ref="workshopSelect"
                      item-value="id"
                      v-model="workshop"
                      @change="getPersonnel(workshop)"
                  />
                  <v-autocomplete
                      v-if="item.id"
                      label=" کارگاه"
                      :items="workshops"
                      item-text="name"
                      item-value="id"
                      v-model="item.workshop_id"
                      :disabled="!isEditing"
                      @change="getPersonnel(item.workshop_id)"
                  />

                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-autocomplete
                      v-if="!item.id"
                      :rules="[rules.required,]"
                      label=" پرسنل"
                      :items="workshopPersonnels"
                      v-model="personnel"
                      item-text="name"
                      item-value="id"
                      :disabled="!workshop"
                      @change="getContracts(personnel)"
                  />
                  <v-autocomplete
                      v-if="item.id"
                      :rules="[rules.required,]"
                      label=" پرسنل"
                      :items="workshopPersonnels"
                      v-model="item.personnel_id"
                      item-text="name"
                      item-value="id"
                      :disabled="!isEditing"
                      @change="getContracts(item.personnel_id)"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                      v-if="!item.id && personnel"
                      :rules="[rules.required,]"
                      label=" نام پدر"
                      :items="workshopPersonnels"
                      v-model="personnel"
                      item-text="father_name"
                      item-value="id"
                      :disabled="true"
                  />
                  <v-autocomplete
                      v-if="item.id"
                      :rules="[rules.required,]"
                      label=" نام پدر"
                      :items="workshopPersonnels"
                      v-model="item.personnel_id"
                      item-text="father_name"
                      item-value="id"
                      :disabled="true"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                      v-if="!item.id && personnel"
                      :rules="[rules.required,]"
                      label=" کد ملی"
                      :items="workshopPersonnels"
                      v-model="personnel"
                      item-text="identity"
                      item-value="id"
                      :disabled="true"
                  />
                  <v-autocomplete
                      v-if="item.id"
                      :rules="[rules.required,]"
                      label=" کد ملی"
                      :items="workshopPersonnels"
                      v-model="item.personnel_id"
                      item-text="identity"
                      item-value="id"
                      :disabled="true"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="12">
                  <v-autocomplete
                      v-if="personnel && !item.id"
                      :rules="[rules.required,]"
                      label=" قرارداد"
                      :items="contracts"
                      v-model="item.contract"
                      item-text="name"
                      item-value="id"
                      @change="saveContract = item.contract  ; filter['contract'] = item.contract"
                  />
                  <v-autocomplete
                      v-if="item.id"
                      :rules="[rules.required,]"
                      label=" قرارداد"
                      :items="contracts"
                      v-model="item.contract"
                      item-text="name"
                      item-value="id"
                      :disabled="!isEditing"
                      @change="saveContract = item.contract  ; filter['contract'] = item.contract"

                  />

                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-autocomplete
                      v-if="item.contract"
                      :rules="[rules.required,]"
                      label=" شروع "
                      :items="contracts"
                      v-model="item.contract"
                      item-text="start"
                      item-value="id"
                      :disabled="true"
                  />

                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                      v-if="item.contract"
                      :rules="[rules.required,]"
                      label=" پایان"
                      :items="contracts"
                      v-model="item.contract"
                      item-text="end"
                      item-value="id"
                      :disabled="true"
                  />

                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md=" 12" class="text-center">
                  <v-btn large block color="green darken-1"
                         class="white--text"
                         v-if="!item.id"
                         :disabled="!item.contract"
                         @click="createOne=true"
                  >
                    ایجاد حکم کارگزینی جدید
                  </v-btn>
                </v-col>

              </v-row>
              <v-row>
                <v-col cols="12" md=" 12" class="text-center">
                  <v-autocomplete
                      v-if="!item.id && createOne"
                      label=" کپی از قالب های پیشفرض"
                      :items="templates"
                      item-text="name"
                      item-value="info"
                      v-model="item"
                      @change="item.is_template = 'p' ; item.id = null ; item.name = null ; item.is_verified = false ;
                      item.contract = saveContract"
                  />

                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <summary-h-r-letter-list ref="hrlist" :filter="filter" v-if="!item.id && item.contract" :contract.sync="item.contract" ></summary-h-r-letter-list>
            <summary-h-r-letter-list ref="hrlist" :filter="{'is_template': 'p' , 'contract': item.contract}"
                                     v-if="item.id" :contract.sync="item.contract" ></summary-h-r-letter-list>
          </v-col>
        </v-row>
        <v-card v-if="item.id || createOne">
          <v-toolbar color="indigo">
            <v-toolbar-title class="white--text">
              عناوین حکمی
            </v-toolbar-title>
          </v-toolbar>
          <v-row class="mt-10">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حداقل مزد روزانه :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  :rules="[rules.required,]"
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.hoghooghe_roozane_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.hoghooghe_roozane_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.hoghooghe_roozane_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.hoghooghe_roozane_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.hoghooghe_roozane_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">پایه سنوات روزانه:</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  :rules="[rules.required,]"
                  label="* مبلغ "
                  v-on:keypress="NumbersOnly"
                  v-model="item.paye_sanavat_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.paye_sanavat_nature"
                  item-text="name"
                  value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.paye_sanavat_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.paye_sanavat_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.paye_sanavat_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق مسکن :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.haghe_maskan_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_maskan_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_maskan_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_maskan_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_maskan_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">بن خوار و بار :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.bon_kharo_bar_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.bon_kharo_bar_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.bon_kharo_bar_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.bon_kharo_bar_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.bon_kharo_bar_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق سرپرستی :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.haghe_sarparasti_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_sarparasti_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_sarparasti_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_sarparasti_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_sarparasti_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق مدیریت :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.haghe_modiriyat_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_modiriyat_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_modiriyat_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_modiriyat_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_modiriyat_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق جذب :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.haghe_jazb_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_jazb_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_jazb_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_jazb_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_jazb_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">فوق العاده شغل :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.fogholade_shoghl_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.fogholade_shoghl_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_shoghl_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_shoghl_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.fogholade_shoghl_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق تحصیلات :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.haghe_tahsilat_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_tahsilat_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_tahsilat_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_tahsilat_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_tahsilat_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">فوق العاده سختی کار :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.fogholade_sakhti_kar_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.fogholade_sakhti_kar_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_sakhti_kar_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"

              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_sakhti_kar_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.fogholade_sakhti_kar_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق آنکال :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.haghe_ankal_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_ankal_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_ankal_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_ankal_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_ankal_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">فوق العاده بدی هوا :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.fogholade_badi_abohava_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.fogholade_badi_abohava_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_badi_abohava_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_badi_abohava_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.fogholade_badi_abohava_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">محرومیت از تسهیلات :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.mahroomiat_tashilat_zendegi_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.mahroomiat_tashilat_zendegi_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.mahroomiat_tashilat_zendegi_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.mahroomiat_tashilat_zendegi_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.mahroomiat_tashilat_zendegi_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">فوق العاده محل خدمت :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.fogholade_mahal_khedmat_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.fogholade_mahal_khedmat_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_mahal_khedmat_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_mahal_khedmat_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.fogholade_mahal_khedmat_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">فوق العاده محیط کار :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.fogholade_sharayet_mohit_kar_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.fogholade_sharayet_mohit_kar_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_sharayet_mohit_kar_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.fogholade_sharayet_mohit_kar_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.fogholade_sharayet_mohit_kar_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">ایاب و ذهاب :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.ayabo_zahab_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.ayabo_zahab_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.ayabo_zahab_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.ayabo_zahab_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.ayabo_zahab_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">یارانه غذا :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.yarane_ghaza_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.yarane_ghaza_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.yarane_ghaza_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.yarane_ghaza_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.yarane_ghaza_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>

          <v-row v-if="gender[item.personnel_id] == 'f' || gender[personnel] == 'f'">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق شیر :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.haghe_shir_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_shir_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_shir_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_shir_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_shir_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>

          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق تاهل :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  label="* مبلغ "
                  v-on:keypress="NumbersOnly"
                  v-model="item.haghe_taahol_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_taahol_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_taahol_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.haghe_taahol_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">کمک هزینه مهدکودک :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.komakhazine_mahdekoodak_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.komakhazine_mahdekoodak_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.komakhazine_mahdekoodak_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.komakhazine_mahdekoodak_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.komakhazine_mahdekoodak_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">کمک هزینه ورزش :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.komakhazine_varzesh_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.komakhazine_varzesh_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.komakhazine_varzesh_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.komakhazine_varzesh_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.komakhazine_varzesh_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">کمک هزینه موبایل :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.komakhazine_mobile_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.komakhazine_mobile_nature"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.komakhazine_mobile_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.komakhazine_mobile_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.komakhazine_mobile_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>


          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">مزایای مستمر غیرنقدی :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <money
                  v-on:keypress="NumbersOnly"
                  label="* مبلغ "
                  v-model="item.mazaya_mostamar_gheyre_naghdi_amount"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.mazaya_mostamar_gheyre_naghdi_nature = 'p'"
                  item-text="name"
                  item-value="value"
                  :disabled="true"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.mazaya_mostamar_gheyre_naghdi_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.mazaya_mostamar_gheyre_naghdi_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
              <v-switch
                  v-model="item.mazaya_mostamar_gheyre_naghdi_base"
                  label="مزد پایه"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>

          <v-toolbar color="indigo" class="mt-10">

            <v-toolbar-title class="white--text">
              عناوین غیر حکمی
            </v-toolbar-title>

          </v-toolbar>

          <v-row class="mt-10">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق اولاد :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_owlad_nature = 'u'"
                  :disabled="true"
                  item-text="name"
                  item-value="value"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_owlad_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_owlad_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2" v-if="item.is_verified && item.is_template == 'p'">
              <money label="تعداد فرزندان مشمول" class="text-center" v-model="item.get_aele_mandi_sum"
                     disabled="true"></money>

            </v-col>
          </v-row>
          <v-row class="">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">اضافه کاری :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.ezafe_kari_nature = 'u'"
                  :disabled="true"
                  item-text="name"
                  item-value="value"

              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.ezafe_kari_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.ezafe_kari_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">شب کاری :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.shab_kari_nature = 'u'"
                  item-text="name"
                  item-value="value"
                  :disabled="true"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.shab_kari_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.shab_kari_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">تعطیل کاری :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.tatil_kari_nature = 'u'"
                  :disabled="true"
                  item-text="name"
                  item-value="value"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.tatil_kari_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.tatil_kari_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">نوبت کاری :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.nobat_kari_nature = 'u'"
                  item-text="name"
                  item-value="value"
                  :disabled="true"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.nobat_kari_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.nobat_kari_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق ماموریت :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* ماهیت عناوین شغلی"
                  :items="NATURE_TYPES"
                  v-model="item.haghe_maamooriat_nature = 'u'"
                  :disabled="true"
                  item-text="name"
                  item-value="value"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_maamooriat_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_maamooriat_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">حق سنوات :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                  :disabled="true"
                  v-model="sanavat_msg"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_sanavat_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.haghe_msanavat_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">عیدی و پاداش :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-text-field
                  :disabled="true"
                  v-model="sanavat_msg"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.eydi_padash_use_insurance"
                  label="معاف از بیمه"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>

            <v-col cols="12" md="2">
              <v-checkbox
                  v-model="item.eydi_padash_use_tax"
                  label=" معاف از مالیات"
                  color="indigo"
                  :false-value="true"
                  :true-value="false"
                  hide-details
                  :disabled="!isEditing"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="2">
            </v-col>
          </v-row>

          <v-toolbar color="indigo" class="mt-10">

            <v-toolbar-title class="white--text">
              سایر
            </v-toolbar-title>
          </v-toolbar>

          <v-row class="mt-10 ml-3 ">
            <v-col cols="12" md="2">
              <v-card-text class="text-h6 text-center">نرخ حق بیمه سهم کارفرما</v-card-text>
            </v-col>
            <v-col cols="12" md="2" class="pt-8">
              <money
                  label="نرخ"
                  v-model="item.employer_insurance_nerkh"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-card-text class="text-h6 text-center">نرخ حق بیمه سهم کارگر</v-card-text>
            </v-col>
            <v-col cols="12" md="2" class="pt-8">
              <money
                  label="نرخ"
                  v-model="item.worker_insurance_nerkh"
                  background-color="white"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-card-text class="text-h6 text-center">نرخ حق بیمه سهم بیکاری</v-card-text>
            </v-col>
            <v-col cols="12" md="2" class="pt-8">
              <money
                  label="نرخ"
                  v-model="item.unemployed_insurance_nerkh"
                  background-color="white"
                  :disabled="!isEditing"
              />

            </v-col>

          </v-row>
          <v-row class="ml-3 mt-5">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">مسکن :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* مسکن"
                  :items="MASKAN_TYPE"
                  v-model="item.maskan"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">وسیله نقلیه :</v-card-text>
            </v-col>
            <v-col cols="12" md="2">
              <v-autocomplete
                  label="* وسیله نقلیه"
                  :items="OTOMOBIL_TYPE"
                  v-model="item.otomobil"
                  item-text="name"
                  item-value="value"
                  :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-card-text class="text-h6 text-center">مشمول ماده یک تبصره 86 ق.م.م :</v-card-text>
            </v-col>
            <v-col cols="12" md="2" class="pt-8">
              <v-switch
                  class="mr-16"
                  v-model="item.include_made_86"
                  color="success"
                  :false-value="false"
                  :true-value="true"
                  hide-details
                  :disabled="!isEditing"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row v-if="item.include_made_86" class="ma-2">
            <v-col cols="12" md="12">
              <v-banner class="mt-3 mb-5 orange--text text--darken-3">
                <v-avatar
                    slot="icon"
                    color="orange darken-2"
                    size="40"
                >
                  <v-icon
                      color="white"
                  >
                    fa-info
                  </v-icon>
                </v-avatar>
                تبصره 1- در مورد پرداخت هایی که از طرف غیر از پرداخت کننده اصلی حقوق به اشخاص حقیقی، به عمل می­ آید،پرداخت­ کنندگان مکلفند هنگام هر پرداخت، مالیات متعلق را با رعایت معافیت­ های قانونی مربوط به حقوق به جز معافیت موضوع ماده (84) این قانون، به نرخ مقطوع ده درصد (10%) محاسبه،کسر و حداکثر تا پایان ماه بعد با فهرستی حاوی نام و نشانی دریافت­ کنندگان و میزان آن به اداره امور مالیاتی محل، پرداخت کنند و در صورت تخلف، مسوول پرداخت مالیات و جریمه­ های متعلق خواهندبود.
              </v-banner>
            </v-col>
          </v-row>


          <v-toolbar v-if="item.id" color="indigo" class="mt-10">

            <v-toolbar-title class="white--text">
              مبنا
            </v-toolbar-title>
          </v-toolbar>

          <v-row v-if="item.id" class="mt-10">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">مزد مبنا :</v-card-text>
            </v-col>

            <v-col cols="12" md="2">
              <money
                  label=" مزد مبنا روزانه "
                  v-model="item.daily_pay_base"
                  background-color="white"
                  disabled=true
              />
            </v-col>
            <v-col cols="12" md="2">
              <money
                  label=" مزد مبنا ماهانه "
                  v-model="item.monthly_pay_base"
                  background-color="white"
                  disabled=true
              />
            </v-col>
          </v-row>
          <v-row v-if="item.id">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">مزد مبنا ساعتی :</v-card-text>
            </v-col>

            <v-col cols="12" md="2">
              <money
                  label=" مزد مبنا ساعتی مدل روزانه "
                  v-model="item.day_hourly_pay_base"
                  background-color="white"
                  disabled=true
              />
            </v-col>
            <v-col cols="12" md="2">
              <money
                  label=" مزد مبنا ساعتی مدل ماهانه "
                  v-model="item.month_hourly_pay_base"
                  background-color="white"
                  disabled=true
              />
            </v-col>
          </v-row>
          <v-row v-if="item.id">
            <v-col cols="12" md="2" class="text-center">
              <v-card-text class="text-h6">دستمزد روزانه بیمه :</v-card-text>
            </v-col>

            <v-col cols="12" md="2">
              <money
                  label=" دستمزد روزانه بیمه "
                  v-model="item.insurance_pay_day"
                  background-color="white"
                  disabled=true
              />
            </v-col>
          </v-row>
        </v-card>
        <v-row class="ma-5">
          <v-col cols="12" md="12" v-if="item.id && !item.is_calculated">
            <v-banner
                class="red white--text"
                elevation="6"
                outlined
                rounded
                single-line
                sticky
            >
              <v-icon
                  class="mr-6 ml-10"
                  color="white"
                  large
              >info
              </v-icon>
              به دلیل اینکه با این حکم کارگزینی محاسبات حقوق و دستمزد ثبت شده است قادر به ویرایش نمی باشید
              در صورت تمایل به تغییر برای قرارداد خود حکم جدید ثبت کنید
            </v-banner>
          </v-col>

        </v-row>
      </template>
      <v-btn
          class="light-blue white--text mt-6  mr-2 float-left"
          @click="verifyHRL(item)"
          v-if="item.id && item.is_calculated && !item.is_verified && !isEditing">ثبت نهایی
      </v-btn>
      <v-btn
          class="red white--text mt-12 mr-2 ml-2 float-left "
          @click="UnVerifyHRL(item)"
          v-if="item.id && item.is_verified && item.is_calculated"> خروج از وضعیت نهایی
      </v-btn>
      <v-btn
          class="primary darken-2 white--text mt-12 mr-2 float-left "
          v-if="item.id && item.is_verified  && item.is_active && item.is_calculated"
          @click="UnActiveHR(item)"
      >غیر فعال کردن</v-btn>
      <v-btn
          class="green darken-1 white--text mt-12 mr-2 float-left "
          v-if="item.id && item.is_verified  && !item.is_active && item.is_calculated"
          @click="sure_dialog = true"
      > فعال کردن</v-btn>

    </m-form>
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
    <v-row justify="center">
      <v-dialog
          v-model="sure_dialog"
          persistent
          @click:outside="error_dialog=false"
          max-width="430"
      >
        <v-card>
          <v-card-title class="red--text text-h5">
            آیا از فعال کردن حکم اطیمنان دارید؟!
          </v-card-title>
          <v-card-text>
            <v-row class="mt-5 mr-4">
              با فعال کردن این حکم تمامی حکم های دیگر قرارداد غیر فعال میشود
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red darken-1"
                text
                @click="sure_dialog = false"
            >
              بستن
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                @click="ActiveHR(item)"
            >
              فعال شود
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

  </div>

</template>

<script>

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
import HRLetterList from "@/modules/payroll/hr_letter/HRLetterList";
import SummaryHRLetterList from "@/modules/payroll/hr_letter/SummeryHRList";


export default {
  name: "HRLetterForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {
    SummaryHRLetterList,
    HRLetterList, mtime, TreeSelect, citySelect, MDatatable, TransactionForm, money
  },
  props: {
    id: {},
  },
  data() {
    return {

      NATURE_TYPES: [
        {name: ' دستمزد رورانه', value: 'b'},
        {name: 'مستمر', value: 'p'},
        {name: 'غیر مستمر', value: 'u'},
      ],
      HRLETTER_TYPES: [
        {name: ' شخصی', value: 'p'},
        {name: 'قالب', value: 't'},
      ],
      MASKAN_TYPE: [
        {name: ' استفاده از مسکن ', value: true},
        {name: 'عدم استفاده از مسکن', value: false},
      ],
      OTOMOBIL_TYPE: [
        {name: ' استفاده از اتوموبیل ', value: true},
        {name: 'عدم استفاده از اتوموبیل', value: false},
      ],

      printUrl: 'payroll/hrletter/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/hrletter",
      permissionBasename: "hr_letter",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      saveContract: null,
      error_dialog: false,
      error_message: null,
      hasLock: false,
      first: false,
      filter: {'is_template': 'p', 'contract': null },
      isDefinable: false,
      createOne: false,
      myClass: '',
      templates: [],
      sanavat_msg: 'سالانه یا ماهانه',
      template: null,
      contract: this.$route.query.contract,
      contracts: [],
      gender: {},
      PathLevels,
      sure_dialog: false,
      VisitorLevels,
      paymentDialog: false,
      payment: '',
      workshops: [],
      workshopPersonnels: [],
      workshop: null,
      personnel: null,
      performClearForm: true,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },

    };
  },
  computed: {
    headers() {
    },
  },
  updated() {
    if (!this.first && this.$route.params.id) {
      this.first = true
      this.isEditing = false
    }
    if (this.$route.params.id) {
      console.log('ok')
    }

  },

  mounted() {
    this.request({
      url: this.endpoint(`payroll/hrletter/templates/`),
      method: "get",
      success: data => {
        console.log(data);
        for (let t in data) {
          this.templates.push({
            'name': data[t].name,
            'info': data[t]
          })
        }
      }
    })

    if (!this.$route.params.id) {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
              'id': data[t].id,
            })
          }
        }
      })
      this.request({
        url: this.endpoint(`payroll/workshop/default/`),
        method: "get",
        success: data => {
          this.workshop = data.id
          this.$refs.workshopSelect.$props.value = data.id
          console.log(this.$refs.workshopSelect.$props)
          console.log(this.$refs.workshopSelect.$props.value)
          this.getPersonnel(data.id)
        }
      })
      this.request({
        url: this.endpoint(`payroll/contract/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.contracts.push({
              'name': data[t].code + ' ' + data[t].personnel_name,
              'id': data[t].id,
            })
          }
          console.log(this.contracts)
        }
      })
    } else {
      this.request({
        url: this.endpoint(`payroll/workshop/`),
        method: "get",
        success: data => {
          for (let t in data) {
            this.workshops.push({
              'name': data[t].name + ' ' + data[t].workshop_code,
              'id': data[t].id,
            })
          }
        }
      })
      this.request({
        url: this.endpoint(`payroll/hrletter/` + this.$route.params.id + '/'),
        method: "get",
        success: data => {
          this.request({
            url: this.endpoint(`payroll/workshop/personnel/contract/` + data.personnel_id + '/'),
            method: "get",
            success: data => {
              this.contracts = []
              for (let t in data) {
                this.contracts.push({
                  'name': 'قرارداد ' + data[t].code,
                  'start': data[t].contract_from_date,
                  'end': data[t].contract_to_date,
                  'id': data[t].id,
                })
              }
              this.request({
                url: this.endpoint(`payroll/workshop/workshop_personnel/` + data[0].workshop_id + '/'),
                method: "get",
                success: data => {
                  this.workshopPersonnels = []
                  for (let t in data) {
                    this.workshopPersonnels.push({
                      'name': data[t].personnel_name,
                      'father_name': data[t].personnel_father,
                      'identity': data[t].personnel_identity_code,
                      'id': data[t].id,
                    })
                    this.gender[data[t].id] = data[t].personnel_gender
                  }
                  console.log(this.gender)
                }
              })
            }
          })


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
    to(item) {
      return {
        name: 'HRLetterDetail',
        params: {
          id: item.id,
        },
      };
    },
    show(item) {
      if (item == true) {
        console.log(item)
      }
    },
    unConfirm() {
      this.$router.go()
      this.notify(' ثبت حکم کارگزینی رد شد', 'warning')
    },

    verifyHRL(item) {
      this.request({
        url: this.endpoint(`payroll/hrletter/verify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('  حکم کارگزینی نهایی شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.error_message = data.response.data['وضعیت']
          this.error_dialog = true

        }
      })

    },
    UnVerifyHRL(item) {
      this.request({
        url: this.endpoint(`payroll/hrletter/unverify/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('حکم کارگزینی از نهایی خارج شد', 'success')
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },
    getPersonnel(id) {
      this.workshopPersonnels = []
      this.request({
        url: this.endpoint(`payroll/workshop/workshop_personnel/` + id + '/'),
        method: "get",
        success: data => {
          this.workshopPersonnels = []
          for (let t in data) {
            this.workshopPersonnels.push({
              'name': data[t].personnel_name,
              'father_name': data[t].personnel_father,
              'identity': data[t].personnel_identity_code,
              'id': data[t].id,
            })
            this.gender[data[t].id] = data[t].personnel_gender
          }
          console.log(this.gender)
        }
      })

    },
    getContracts(id) {
      this.contracts = []
      this.request({
        url: this.endpoint(`payroll/workshop/personnel/contract/` + id + '/'),
        method: "get",
        success: data => {
          this.contracts = []
          for (let t in data) {
            this.contracts.push({
              'name': 'قرارداد ' + data[t].code,
              'start': data[t].contract_from_date,
              'end': data[t].contract_to_date,
              'id': data[t].id,
            })
          }
        }
      })

    },
    UnActiveHR(item) {
      this.request({
        url: this.endpoint(`payroll/hrletter/unactive/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify('غیر فعال  کردن حکم کارگزینی انجام شد', 'success')
          this.to(item)
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },
    ActiveHR(item) {
      this.request({
        url: this.endpoint(`payroll/hrletter/active/` + item.id + '/'),
        method: "get",
        success: data => {
          console.log(data);
          this.notify(' فعال  کردن حکم کارگزینی انجام شد', 'success')
          this.to(item)
          window.location.reload();
        },
        error: data => {
          this.notify(data.response.data[0].messages[0], 'warning')

        }
      })
    },


  },
}
</script>

<style scoped lang="scss"></style>

