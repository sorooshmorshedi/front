<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
      <div class="card right">
        <div class="card-body">
          <div class="title">{{ title }}</div>
          <router-view/>
        </div>
      </div>
    </div>

    <div class="col-sm-6 float-accounts-container" v-if="showFloats">
      <div class="card right">
        <div class="card-body">
          <div class="title secondary">گروه های حساب تفضیلی شناور</div>
          <div id="accordion">
            <div class="card" v-for="(fag, i) in floatAccountGroups" :key="fag.id">
              <div class="card-header">
                <h6 class="mb-0">
                  <a
                    data-toggle="collapse"
                    :href="'#collapse-fag' + i"
                    class="collapsed"
                  >{{ fag.name }}</a>
                </h6>
              </div>

              <div :id="'collapse-fag' + i" class="collapse">
                <div class="card-body">
                  <div v-for="fa in fag.floatAccounts" :key="fa.id">{{ fa.name }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
export default {
  name: "Account",
  mixins: [accountMixin],
  data() {
    return {
      title: "",
      showTree: true,
      showFloats: false
    };
  },
  created() {
    this.setTitle();
    this.getAllAccounts();
  },
  mounted() {},
  watch: {
    $route(to, from) {
      this.setTitle();
    }
  },
  methods: {
    setTitle() {
      this.setDefaultconfig();
      let routeName = this.$router.currentRoute.name.toLowerCase();
      if (routeName.includes("edit")) this.title = "ویرایش ";
      else if (routeName.includes("create")) this.title = "تعریف ";

      if (routeName.includes("personaccounts")) this.title += "حساب اشخاص";
      else if (routeName.includes("bankaccounts")) this.title += "بانک";
      else if (routeName.includes("floataccounts"))
        this.title += "گروه و حساب شناور";
      else if (routeName.includes("accounts")) this.title += "حساب";

      if (routeName.includes("tree")) {
        this.title = "نمودار درختی حساب ها";
      }

      if (routeName.includes("independentaccount")) this.title = "حساب مستقل";
      if (routeName.includes("createfloataccounts")) {
        this.showFloats = true;
      }
    },
    setDefaultconfig() {
      this.showTree = true;
      this.showFloats = false;
    }
  }
};
</script>

<style scoped lang="scss">
.float-accounts-container {
  margin-top: 15px;
}
</style>

