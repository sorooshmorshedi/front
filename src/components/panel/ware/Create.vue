<template>
  <div class="row rtl">
    <div class="col-12 col-lg-7 rtl">
      <div class="card right">
        <div class="card-body">
          <div class="title">تعریف کالا</div>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              <a
                class="nav-item nav-link active"
                id="nav-0-tab"
                data-toggle="tab"
                href="#nav-nature"
                role="tab"
              >ماهیت</a>
              <a
                class="nav-item nav-link"
                id="nav-1-tab"
                data-toggle="tab"
                href="#nav-group"
                role="tab"
              >گروه</a>
              <a
                class="nav-item nav-link"
                id="nav-2-tab"
                data-toggle="tab"
                href="#nav-category"
                role="tab"
              >دسته بندی</a>
              <a
                class="nav-item nav-link"
                id="nav-3-tab"
                data-toggle="tab"
                href="#nav-ware"
                role="tab"
              >کالا</a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div class="tab-pane fade show active" id="nav-nature" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[0]" :model="wareLevel"/>
              <button @click="storeWareLevel()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-group" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[1]" :model="wareLevel"/>
              <button @click="storeWareLevel()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-category" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[2]" :model="wareLevel"/>
              <button @click="storeWareLevel()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-ware" role="tabpanel">
              <vue-form-generator tag="div" :schema="createSchema[3]" :model="ware"/>
              <button @click="storeWare()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-5">
      <wares-list :wares="waresList"/>
    </div>
  </div>
</template>

<script>
import wareMixin from "@/mixin/ware";
import WaresList from "./WaresList";

export default {
  name: "Create",
  mixins: [wareMixin],
  components: { WaresList },
  data() {
    return {};
  },
  created() {
    this.mode = "create";
  },
  mounted() {
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.clearWares();
      this.wareLevel.level = e.target.id.split("-")[1];
    });
  },
  computed: {
    waresList() {
      if (this.wareLevel.level == 3) return this.waresSelectValues.wares;
      else return this.waresSelectValues.levels[this.wareLevel.level];
    }
  }
};
</script>

<style scoped lang="scss">
.tab-content {
  padding-top: 15px;
}
.submit-btn {
  width: 100px;
}
</style>

