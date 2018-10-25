<template>
  <footer class="rtl" v-if="user.id">
    <div class="row">
      <div class="col-sm-4">
        نام کاربری: <span>{{ user.username }}</span>
      </div>
      <div class="col-sm-4">
      </div>
      <div class="col-sm-4 d-none d-sm-inline-block text-left" dir="ltr" >
        ساعت و تاریخ روز: <span> {{ now }} </span>
      </div>
    </div>
  </footer>
</template>

<script>
import moment from "moment-jalaali";
export default {
  name: "Footer",
  data() {
    return {};
  },
  computed: {
    now(){
      return moment().format('jYYYY/jMM/jDD HH:mm')
    }
  }

};
</script>

<style scoped lang="scss">
footer {
  z-index: 1000;
  position: sticky;
  // margin-top: 50px;
  height: 35px;
  bottom: 0px;
  background-color: #eee;

  padding: 6px 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.28);
}
</style>
