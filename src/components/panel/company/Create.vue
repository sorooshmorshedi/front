<template>
<div class="row">
  <div class="col-12">
    <c-form v-model="company" />
    <button @click="createCompany()" type="button" class="btn submit btn-primary">ثبت</button>
  </div>
</div>
</template>

<script>
import CForm from './Form';
export default {
  components: { CForm },
  name: 'Create',
  data() {
    return {
      company: {
        name: Math.random(),
        fiscal_year_start: '1397-01-01',
        fiscal_year_end: '1398-01-01',
      }
    }
  },
  methods: {
    createCompany(){
      this.request({
        url: this.endpoint('companies'),
        method: 'post',
        data: this.company,
        success: data => {
          this.notify('شرکت با موفقیت ساخته شد','success');
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
  .submit{
    margin-top:30px;
    width: 200px;;
  }
</style>
