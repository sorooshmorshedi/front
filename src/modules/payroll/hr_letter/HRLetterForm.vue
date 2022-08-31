<template>
  <div>
    <m-form
        title="ثبت حکم کارگزینی"
        :showList="false"
        :listRoute="{name:'HRLetterList'}"
        :exportBaseUrl="printUrl"
        :exportParams="{id: item.id}"
        :canDelete="false"
        :canSubmit="canSubmit"
        :isEditing.sync="isEditing"
        @submit="submit"
        @delete="deleteItem"
        @clearForm="clearForm()"
        ref="HRLetterFrom"

    >

      <template>

        <v-row>
          <v-col cols="12" md="3">
            <v-autocomplete
                v-if="!this.contract"
                label="نوع"
                :items="HRLETTER_TYPES"
                v-model="item.is_template"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
                @change="show(item.is_template)"
            />
          </v-col>

          <v-col cols="12" md="3" v-if="item.is_template != 't'">
            <v-autocomplete
                v-if="!this.contract"
                label=" قرارداد در کارگاه"
                :items="contracts"
                v-model="item.contract"
                item-text="name"
                item-value="id"
                @change="show(item.contract)"
                :disabled="!isEditing"
            />
            <v-text-field
                label="قرارداد در کارگاه"
                v-if="this.contract"
                disabled="true"
                v-model="item.contract = this.contract"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" >
            <v-text-field
                v-if="item.is_template == 't'"
                label="نام قالب"
                v-model="item.name"
            ></v-text-field>

          </v-col>

        </v-row>



        <v-row class="mt-10">
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حقوق روزانه :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.hoghooghe_roozane_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.hoghooghe_roozane_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">پایه سنوات روزانه:</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
                label="* مبلغ "
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.paye_sanavat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.paye_sanavat_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق سرپرستی :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_sarparasti_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_sarparasti_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق مدیریت  :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_modiriyat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_modiriyat_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق جذب  :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_jazb_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_jazb_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده شغل  :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_shoghl_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.fogholade_shoghl_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق تحصیلات  :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_tahsilat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_tahsilat_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده سختی کار  :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_sakhti_kar_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.fogholade_sakhti_kar_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق آنکال :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_ankal_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_ankal_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده بدی هوا :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_badi_abohava_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.fogholade_badi_abohava_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">محرومیت از تسحیلات :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.mahroomiat_tashilat_zendegi_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.mahroomiat_tashilat_zendegi_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده محل خدمت :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_mahal_khedmat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.fogholade_mahal_khedmat_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده محیط کار :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_sharayet_mohit_kar_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.fogholade_sharayet_mohit_kar_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق مسکن :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_maskan_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_maskan_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">ایاب و ذهاب :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.ayabo_zahab_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.ayabo_zahab_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">بن خار و بار :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.bon_kharo_bar_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.bon_kharo_bar_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">یارانه غذا :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.yarane_ghaza_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.yarane_ghaza_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق شیر :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_shir_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_shir_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>

        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق تاهل :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
                label="* مبلغ "
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_taahol_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_taahol_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">کمک هزینه مهدکودک :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_mahdekoodak_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.komakhazine_mahdekoodak_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">کمک هزینه ورزش :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_varzesh_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.komakhazine_varzesh_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">کمک هزینه موبایل :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
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
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_mobile_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.komakhazine_mobile_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق اولاد :</v-card-text>
          </v-col>
          <v-col cols="12" md="2">
            <money
                label="* مبلغ "
                v-model="item.haghe_owlad_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_owlad_nature"
                item-text="name"
                item-value="value"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_owlad_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_owlad_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value= true
                hide-details
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="2">
            <v-switch
                v-model="item.haghe_owlad_base"
                label="مزد پایه"
                color="success"
                value= true
                hide-details
            ></v-switch>
          </v-col>
        </v-row>
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
        <v-row v-if="item.id" >
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

      </template>
    </m-form>
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


export default {
  name: "HRLetterForm",
  mixins: [MFormMixin, LadingMixin, formsMixin, FormsMixin, FactorMixin],
  components: {mtime, TreeSelect, citySelect, TenderList, MDatatable, TransactionForm, money},
  props: {
    id: {},
  },
  data() {
    return {
      NATURE_TYPES: [
        {name: ' حقوق پایه', value: 'b'},
        {name: 'مستمر', value: 'p'},
        {name: 'غیر مستمر', value: 'u'},
      ],
      HRLETTER_TYPES: [
        {name: ' شخصی', value: 'p'},
        {name: 'قالب', value: 't'},
      ],

      printUrl: 'payroll/hrletter/all',
      isWorkshopConfirmed: false,
      baseUrl: "payroll/hrletter",
      permissionBasename: "hr_letter",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      hasLock: true,
      isDefinable: true,
      myClass: '',
      contract: this.$route.query.contract,
      contracts: [],
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
          value: "workshp_personnel",
        },
        {
          text: "شماره قرارداد",
          value: "code",
        },
        {
          text: "تاریخ شروع قرارداد",
          value: "contract_from_date",
        },
        {
          text: "تاریخ پایان قرارداد",
          value: "contract_to_date",
        },
        {
          text: "تاریخ ترک کار",
          value: "quit_job_date",
        },
      ];
    },
  },
  mounted() {
    if (!this.contract) {
      this.request({
        url: this.endpoint(`payroll/contract/`),
        method: "get",
        success: data => {
          console.log(data);
          for (let t in data) {
            this.contracts.push({
              'name': data[t].personnel_name + ' ' + data[t].personnel_last_name + ' در ' + data[t].workshop_name,
              'id': data[t].id,
            })
          }
          console.log(this.contracts)
        }
      })
    }
  },

  methods: {
    to(item) {
      return {
        name: 'HRLetterDetail',
        params: {
          id: item.id,
        },
      };
    },
    show(item){
      console.log(item)
    },
    unConfirm() {
      this.$router.go()
      this.notify(' ثبت حکم کارگزینی رد شد', 'warning')
    },
  },
}
</script>

<style scoped lang="scss"></style>

