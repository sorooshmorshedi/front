<template>
  <div class="row rtl">
    <div class="col-12 col rtl">
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
              <div class="row">
                <div class="form-group col-md-4">
                  <label for>کد</label>
                  <multiselect
                    dir="rtl"
                    :options="waresSelectValues.levels[0]"
                    v-model="wareLevel"
                    track-by="id"
                    label="title"
                  />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[0]" :model="wareLevel"/>
              <button @click="updateWareLevel()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-group" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for>کد</label>
                  <multiselect
                    dir="rtl"
                    :options="waresSelectValues.levels[1]"
                    v-model="wareLevel"
                    track-by="id"
                    label="title"
                  />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[1]" :model="wareLevel"/>
              <button @click="updateWareLevel()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-category" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for>کد</label>
                  <multiselect
                    dir="rtl"
                    :options="waresSelectValues.levels[2]"
                    v-model="wareLevel"
                    track-by="id"
                    label="title"
                  />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[2]" :model="wareLevel"/>
              <button @click="updateWareLevel()" class="btn btn-primary float-left submit-btn">ثبت</button>
            </div>
            <div class="tab-pane fade" id="nav-ware" role="tabpanel">
              <div class="row">
                <div class="form-group col-md-4">
                  <label for>کد</label>
                  <multiselect
                    dir="rtl"
                    :options="waresSelectValues.wares"
                    v-model="ware"
                    track-by="id"
                    label="title"
                  />
                </div>
              </div>
              <vue-form-generator tag="div" :schema="editSchema[3]" :model="ware"/>
              <button @click="updateWare()" class="btn btn-primary float-left submit-btn">ثبت</button>
              <button
                @click="deleteWare(ware)"
                class="btn btn-danger float-left submit-btn"
                style="margin-left: 15px;"
              >حذف</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import wareMixin from "@/mixin/ware";

export default {
  name: "Edit",
  mixins: [wareMixin],
  created() {
    this.mode = "edit";
  },
  mounted() {
    $('a[data-toggle="tab"]').on("shown.bs.tab", e => {
      this.clearWares();
      this.wareLevel.level = e.target.id.split("-")[1];
    });
  },
  data() {
    return {};
  },
  watch: {
    ware() {
      if (this.ware && this.ware.code) {
        if (this.ware.price.includes(",")) return;
        this.ware.price = this.toMoney(this.ware.price);
      }
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

