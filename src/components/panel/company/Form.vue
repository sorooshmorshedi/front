<template>
  <div class="row">
    <div class="col">
  
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Form',
    data() {
      return {
        companey: {},
        fields: [{
          label: 'نام شرکت',
          model: 'name',
          type: 'text',
          class: 'col-12'
        }, {
          label: 'آدرس 1',
          model: 'address1',
          type: 'text',
          class: 'col-12'
        }, {
          label: 'آدرس 2',
          model: 'address2',
          type: 'text',
        }, {
          label: 'کشور',
          model: 'country',
          type: 'text',
        }, {
          label: 'شماره ثبت',
          model: 'sabtNumber',
          type: 'text',
        }, {
          label: 'تلفن 1',
          model: 'phone1',
          type: 'text',
        }, {
          label: 'تلفن 2',
          model: 'phone2',
          type: 'text',
        }, {
          label: 'فکس',
          model: 'fax',
          type: 'text',
        }, {
          label: 'ایمیل',
          model: 'email',
          type: 'email',
        }, {
          label: 'وبسایت',
          model: 'website',
          type: 'text',
        }, {
          label: 'کد پستی',
          model: 'postalCode',
          type: 'text',
        }, {
          label: 'کد اقتصادی',
          model: 'eghtesadiCode',
          type: 'text',
        }, {
          label: 'شناسه',
          model: 'shenase',
          type: 'text',
        }, ]
      }
    }
  }
</script>

<style scoped lang="scss">
  * {}
</style>
