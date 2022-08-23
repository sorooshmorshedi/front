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
          <v-col cols="12" md="3" v-if="item.is_template != 't'">
            <v-autocomplete
                v-if="!this.contract"
                label=" قرارداد در کارگاه"
                :items="contracts"
                v-model="item.contract"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
            <v-text-field
                label="قرارداد در کارگاه"
                v-if="this.contract"
                disabled="true"
                v-model="item.contract = this.contract"
            ></v-text-field>
          </v-col>
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
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.hoghooghe_roozane_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.hoghooghe_roozane_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.hoghooghe_roozane_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.hoghooghe_roozane_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">پایه سنوات :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.paye_sanavat_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.paye_sanavat_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.paye_sanavat_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.paye_sanavat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق سرپرستی :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_sarparasti_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_sarparasti_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_sarparasti_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_sarparasti_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق مدیریت  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_modiriyat_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_modiriyat_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_modiriyat_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_modiriyat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق جذب  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_jazb_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_jazb_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_jazb_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_jazb_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده شغل  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_shoghl_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_shoghl_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_shoghl_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_shoghl_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق شیفت  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_shift_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_shift_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_shift_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_shift_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده سختی کار  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_sakhti_kar_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_sakhti_kar_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_sakhti_kar_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_sakhti_kar_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>



        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده نوبت کاری  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_nobat_kar_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_nobat_kar_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_nobat_kar_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_nobat_kar_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده شب کاری  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_shab_kari_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_shab_kari_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_shab_kari_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_shab_kari_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق آنکال :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_ankal_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_ankal_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_ankal_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_ankal_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده بدی هوا :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_badi_abohava_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_badi_abohava_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_badi_abohava_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_badi_abohava_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">محرومیت از تسحیلات :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.mahroomiat_tashilat_zendegi_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.mahroomiat_tashilat_zendegi_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.mahroomiat_tashilat_zendegi_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.mahroomiat_tashilat_zendegi_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده محل خدمت :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_mahal_khedmat_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_mahal_khedmat_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_mahal_khedmat_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_mahal_khedmat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده محیط کار :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_sharayet_mohit_kar_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_sharayet_mohit_kar_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_sharayet_mohit_kar_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_sharayet_mohit_kar_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق مسکن :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_maskan_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_maskan_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_maskan_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_maskan_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">ایاب و ذهاب :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.ayabo_zahab_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.ayabo_zahab_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.ayabo_zahab_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.ayabo_zahab_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">بن خار و بار :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.bon_kharo_bar_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.bon_kharo_bar_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.bon_kharo_bar_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.bon_kharo_bar_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">یارانه غذا :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.yarane_ghaza_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.yarane_ghaza_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.yarane_ghaza_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.yarane_ghaza_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق شیر :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_shir_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_shir_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_shir_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_shir_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق تاهل :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_taahol_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_taahol_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_taahol_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_taahol_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">پورسانت فروش :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.poorsant_foroosh_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.poorsant_foroosh_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.poorsant_foroosh_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.poorsant_foroosh_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">افزایش بهره وری تولید :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_afzayesh_bahrevari_tolid_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_afzayesh_bahrevari_tolid_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_afzayesh_bahrevari_tolid_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_afzayesh_bahrevari_tolid_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">فوق العاده تولید :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.fogholade_tolid_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.fogholade_tolid_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_tolid_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.fogholade_tolid_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">اضافه کاری :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.ezafe_kari_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.ezafe_kari_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.ezafe_kari_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.ezafe_kari_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">جمعه کاری :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.jome_kari_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.jome_kari_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.jome_kari_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.jome_kari_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="style=text-size:20px;">مزایای غیر نقدی پرداختی به کارگران:</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.mazaya_gheyr_naqdi_pardakhti_kargaran_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.mazaya_gheyr_naqdi_pardakhti_kargaran_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.mazaya_gheyr_naqdi_pardakhti_kargaran_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.mazaya_gheyr_naqdi_pardakhti_kargaran_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق لوازم تحریر :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_lavazem_tahrir_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_lavazem_tahrir_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_lavazem_tahrir_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_lavazem_tahrir_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">کمک هزینه مهدکودک :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.komakhazine_mahdekoodak_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.komakhazine_mahdekoodak_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_mahdekoodak_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_mahdekoodak_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">کمک هزینه ورزش :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.komakhazine_varzesh_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.komakhazine_varzesh_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_varzesh_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_varzesh_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">کمک هزینه موبایل :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.komakhazine_mobile_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.komakhazine_mobile_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_mobile_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.komakhazine_mobile_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق اولاد :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_owlad_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_owlad_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_owlad_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_owlad_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق ماموریت :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_mamooriat_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_mamooriat_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_mamooriat_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_mamooriat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">ذخیره ایام مرخصی :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.zakhire_ayam_morakhasi_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.zakhire_ayam_morakhasi_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.zakhire_ayam_morakhasi_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.zakhire_ayam_morakhasi_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">حق سنوات :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.haghe_sanavat_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.haghe_sanavat_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_sanavat_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.haghe_sanavat_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>


        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">پاداش آخر سال :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.eydi_salane_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.eydi_salane_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.eydi_salane_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.eydi_salane_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">مسکن با اثاثیه :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.maskan_ba_asasiye_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.maskan_ba_asasiye_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.maskan_ba_asasiye_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.maskan_ba_asasiye_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">مسکن بدون اثاثیه :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.maskan_bi_asasiye_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.maskan_bi_asasiye_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.maskan_bi_asasiye_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.maskan_bi_asasiye_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">اتوموبیل با راننده  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.otomobil_shakhsi_ba_ranande_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.otomobil_shakhsi_ba_ranande_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.otomobil_shakhsi_ba_ranande_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.otomobil_shakhsi_ba_ranande_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>
        </v-row>

        <v-row >
          <v-col cols="12" md="2" class="text-center">
            <v-card-text class="text-h6">اتوموبیل بدون راننده  :</v-card-text>
          </v-col>
          <v-col cols="12" md="3">
            <money
                label="* مبلغ "
                v-model="item.otomobil_shakhsi_bi_ranande_amount"
                background-color="white"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-autocomplete
                label="* ماهیت عناوین شغلی"
                :items="NATURE_TYPES"
                v-model="item.otomobil_shakhsi_bi_ranande_nature"
                item-text="name"
                item-value="id"
                :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.otomobil_shakhsi_bi_ranande_use_insurance"
                label="بیمه تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
          </v-col>

          <v-col cols="12" md="2">
            <v-checkbox
                v-model="item.otomobil_shakhsi_bi_ranande_use_tax"
                label="مالیات تعلق می گیرد"
                color="indigo"
                value="indigo"
                hide-details
            ></v-checkbox>
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
              'name': data[t].personnel_name + ' ' + data[t].personnel_last_name + ' in ' + data[t].workshop_name,
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

