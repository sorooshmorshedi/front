<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right ">
        <div class="card-body">
          <vue-form-generator tag="div" :schema="schema" :model="company" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Form",
  props: ['value'],
  created(){
    if(this.value){
      this.company = this.value;
    }
  },
  data() {
    return {
      company: {},
      schema: {
        groups: [
          {
            legend: "مشخصات شرکت",
            styleClasses: 'row',
            fields: [
              {
                label: "نام شرکت",
                type: "input",
                inputType: "text",
                model: "name",
                styleClasses: "col-sm-4 col-md-6"
              },
              {
                label: "شروع سال مالی",
                type: "input",
                inputType: "text",
                model: "fiscal_year_start",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "پایان سال مالی",
                type: "input",
                inputType: "text",
                model: "fiscal_year_end",
                styleClasses: "col-sm-4 col-md-3 "
              },
              {
                label: "آدرس 1",
                type: "input",
                inputType: "text",
                model: "address1",
                styleClasses: "col-sm-4 col-md-3 "
              },
              {
                label: "آدرس 2",
                type: "input",
                inputType: "text",
                model: "address2",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "کشور",
                type: "input",
                inputType: "text",
                model: "country",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "شماره ثبت",
                type: "input",
                inputType: "text",
                model: "sabt_number",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "تلفن 1",
                type: "input",
                inputType: "text",
                model: "phone1",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "تلفن 2",
                type: "input",
                inputType: "text",
                model: "phone2",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "فکس",
                type: "input",
                inputType: "text",
                model: "fax",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "ایمیل",
                type: "input",
                inputType: "email",
                model: "email",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "وبسایت",
                type: "input",
                inputType: "text",
                model: "website",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "کد پستی",
                type: "input",
                inputType: "text",
                model: "postal_code",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "کد اقتصادی",
                type: "input",
                inputType: "text",
                model: "eghtesadi_code",
                styleClasses: "col-sm-4 col-md-3"
              },
              {
                label: "شناسه ملی / کد ملی", type: "input",
                inputType: "text",
                model: "shenase",
                styleClasses: "col-sm-4 col-md-3"
              }
            ]
          }
        ]
      }
    };
  },
  watch: {
    company: {
      handler(val) {
        this.$emit('input', this.company)
      },
      deep: true,
    }
  }
};
</script>

<style scoped lang="scss">
* {
}
</style>
