<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right">
        <div class="card-body">
          <div class="title">
            {{ title }}
            <button
              type="button"
              class="btn btn-info btn-sm"
              data-toggle="modal"
              data-target="#accounts"
              v-if="showTree"
            >جستوجوی حساب</button>
          </div>
          <router-view/>
        </div>
      </div>
    </div>

    <div class="modal fade" id="accounts" tabindex="-1" v-if="showTree">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">جستوجوی حساب</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <tree no-context="1"/>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">بستن</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tree from "@/components/panel/account/Tree";
export default {
  name: "Account",
  components: { Tree },
  data() {
    return {
      title: "",
      showTree: null
    };
  },
  created() {
    this.setTitle();
  },
  watch: {
    $route(to, from) {
      this.setTitle();
    }
  },
  methods: {
    setTitle() {
      this.setDefaultconfig();
      let routeName = this.$router.currentRoute.name.toLowerCase();
      if (routeName.includes("edit")) this.title = "ویرایش حساب";
      if (routeName.includes("create")) this.title = "تعریف حساب";
      if (routeName.includes("tree")) {
        this.title = "نمودار درختی حساب ها";
        this.showTree = false;
      }
      if (routeName.includes("independentaccount")) this.title = "حساب مستقل";
    },
    setDefaultconfig() {
      this.showTree = true;
    }
  }
};
</script>

<style scoped lang="scss">
</style>

