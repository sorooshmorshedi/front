<template>
  <div class="text-center ltr" style="width: 100%">
    <span class="mr-3">{{ systemBarDate }}</span>
    <span>{{ systemBarTime}}</span>
  </div>
</template>

<script>
import moment from "moment-jalaali";
export default {
  name: "Footer",
  data() {
    return {
      systemBarDate: "",
      systemBarTime: ""
    };
  },
  mounted() {
    this.updateTime();
    setInterval(() => {
      this.updateTime();
    }, 1000 * 60);
  },
  methods: {
    updateTime() {
      this.systemBarDate = this.now.format("jYYYY/jMM/jDD");
      this.systemBarTime = this.now.format("HH:mm");
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
