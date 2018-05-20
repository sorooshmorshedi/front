<template>
<div class="row">
  <div class="col-12">
    <c-form />
    <button type="button" class="btn submit btn-primary">ثبت</button>
  </div>
</div>
</template>

<script>
import CForm from './Form';
export default {
  components: { CForm },
  name: 'Create',
  data() {
    return {}
  },
}
</script>

<style scoped lang="scss">
  .submit{
    margin-top:30px;
    width: 200px;;
  }
</style>
