<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="title">لیست شرکت ها</div>
      <vuetable :fields="fields" :data="companies" class="table table-striped table-hover"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Vuetable from 'Vuetable-2'
import VuetableAction from './VuetableAction'

Vue.component('VuetableAction', VuetableAction);

export default {
  name: "List",
  components: {
    Vuetable,
  },
  data() {
    return {
      companies: [],
      fields: [
        {
          title: "نام شرکت",
          name: "name",
        },
        {
          title: "شروع سال مالی",
          name: "fiscal_year_start",
        },
        {
          title: "پایان سال مالی",
          name: "fiscal_year_end",
        },
        {
          title: "آدرس 1",
          name: "address1",
        },
        {
          title: "آدرس 2",
          name: "address2",
        },
        {
          title: "کشور",
          name: "country",
        },
        {
          title: "شماره ثبت",
          name: "sabt_number",
        },
        {
          title: "تلفن 1",
          name: "phone1",
        },
        {
          title: "تلفن 2",
          name: "phone2",
        },
        {
          title: "فکس",
          name: "fax",
        },
        {
          title: "ایمیل",
          name: "email",
        },
        {
          title: "وبسایت",
          name: "website",
        },
        {
          title: "کد پستی",
          name: "postal_code",
        },
        {
          title: "کد اقتصادی",
          name: "eghtesadi_code",
        },
        {
          title: "شناسه ملی / کد ملی",
          name: "shenase",
        },
        {
          name:'__component:vuetable-action',
          title: '',
        },
      ]
    };
  },
  created() {
    this.getCompany();
  },
  methods: {
    getCompany() {
      this.request({
        url: this.endpoint("companies"),
        method: "get",
        success: data => {
          this.companies = data;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
* {
}
</style>
