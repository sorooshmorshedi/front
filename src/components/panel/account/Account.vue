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
            <tree no-context="1" ref="accountsTree"/>
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
import accountMixin from "@/mixin/account";
export default {
  name: "Account",
  mixins: [accountMixin],
  components: { Tree },
  data() {
    return {
      title: "",
      showTree: true,
      showFloats: false
    };
  },
  created() {
    this.setTitle();
  },
  mounted() {
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.$refs.accountsTree.collapse();
    });
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
      console.log(routeName);
      if (routeName.includes("edit")) this.title = "ویرایش حساب";
      if (routeName.includes("create")) this.title = "تعریف حساب";
      if (routeName.includes("tree")) {
        this.title = "نمودار درختی حساب ها";
        this.showTree = false;
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

