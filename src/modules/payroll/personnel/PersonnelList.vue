<template>
  <v-card>
    <v-card-title>لیست پرسنل ها</v-card-title>
    <v-card-text>
      <m-datatable :headers="headers" :apiUrl="url" :filters.sync="filters" @dblclick:row="(e, row) => $router.push(to(row.item))"
                   ref="datatable">
        <template #item.detail="{ item }">
          <detail-link :to="to(item)" />
        </template>

      </m-datatable>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "PersonnelList",
  props: {},
  data() {
    return {
      url: "payroll/personnel/all",
      filters: {},
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "نام",
          value: "name",
        },
        {
          text: "نام خانوادگی",
          value: "last_name",
        },
        {
          text: "نام پدر",
          value: "father_name",
        },
        {
          text: "کد پرسنلی",
          value: "personnel_code",
        },
        {
          text: "ملیت",
          value: "nationality_display",
        },
        {
          text: "جنسیت",
          value: "gender_display",
        },
        {
          text: "خدمت سربازی",
          value: "military_service_display",
        },
        {
          text: "شماره شناسنامه",
          value: "identity_code",
        },

        {
          text: "کد ملی",
          value: "national_code",
        },
        {
          text: "وضعیت تاهل",
          value: "marital_status_display",
        },
        {
          text: "تعداد فرزندان",
          value: "number_of_childes",
        },
        {
          text: "تاریخ تولد",
          value: "date_of_birth",
        },
        {
          text: "تاریخ صدور شناسنامه",
          value: "date_of_exportation",
        },
        {
          text: "محل تولد",
          value: "birth_city",
          filterable: false
        },
        {
          text: "محل صدور شناسنامه",
          value: "exportation_city",
          filterable: false
        },
        {
          text: "بخش محل صدور",
          value: "exportation_sector",
          filterable: false
        },
        {
          text: "کد تلفن",
          value: "city_phone_code",
        },
        {
          text: "تلفن ثابت",
          value: "phone_number",
        },
        {
          text: "آدرس",
          value: "address",
        },
        {
          text: "کد پستی",
          value: "postal_code",
        },
        {
          text: "شماره همراه 1",
          value: "mobile_number_1",
        },
        {
          text: "شماره همراه 2",
          value: "mobile_number_2",
        },
        {
          text: "بیمه تامین اجتماعی",
          value: "insurance",
          type: 'boolean'

        },
        {
          text: "شماره بیمه",
          value: "insurance_code",
        },
        {
          text: "مدرک تحصیلی",
          value: "degree_education_display",
        },
        {
          text: "رشته تحصیلی",
          value: "field_of_study",
        },
        {
          text: "نوع دانشگاه",
          value: "university_type_display",
        },
        {
          text: "نام دانشگاه",
          value: "university_name",
        },
        {
          text: "نام بانک",
          value: "bank_name",
          filterable: false,
        },
        {
          text: "شماره حساب حقوق",
          value: "account_bank_number",
        },
        {
          text: "شماره کارت حقوق",
          value: "bank_cart_number",
        },
        {
          text: "شماره شبا",
          value: "sheba_number",
        },
        {
          text: "فعال",
          value: "is_personnel_active",
          type: 'boolean'


        },
        {
          text: "نهایی",
          value: "is_personnel_verified",
          type: 'boolean'

        },

      ];

    },
  },
  methods: {
    to(item) {
      return {
        name: "PersonnelDetail",
        params: {
          id: item.id,
        },
      };
    },

  },
};
</script>

<style scoped lang="scss">
</style>