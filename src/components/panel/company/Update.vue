<template>
<div class="row">
  <div class="col-12">
    <c-form v-model="company" v-if="company.id"/>
    <button @click="updateCompany()" type="button" class="btn submit btn-primary">ثبت</button>
  </div>
</div>
</template>

<script>
import CForm from './Form';
export default {
  components: { CForm },
  props: ['id'],
  name: 'Update',
  data() {
    return {
      company: {}
    }
  },
  methods: {
    updateCompany(){
      this.request({
        url: this.endpoint('companies/' + this.company.id),
        method: 'put',
        data: this.company,
        success: data => {
          this.notify('شرکت با موفقیت ویرایش شد','success');
          this.$router.push({
            name: 'CompaniesList'
          })
        }
      })
    },
    getCompany(){
      this.request({
        url: this.endpoint('companies/' + this.id),
        method: 'get',
        success: data => {
          this.company = data;
        }

      })
    }
  },
  created(){
    this.getCompany();
  }
}
</script>

<style scoped lang="scss">
  .submit{
    margin-top:30px;
    width: 200px;;
  }
</style>

