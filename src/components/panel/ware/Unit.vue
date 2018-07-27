<template>
  <div class="row rtl">
    <div class="col-12 col-lg-12">
      <div class="title">واحد های شمارش</div>
      <button @click="createUnit()" type="button" class="btn btn-info">افزودن واحد</button>
      <br>
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>نام</th>
            <th>توضیحات</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(unit, i) in units" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ unit.name }}</td>
            <td>{{ unit.explanation }}</td>
            <td>
              <i class="fas fa-pencil-alt text-warning" @click="editUnit(unit)" />
            </td>
            <td>
              <i class="fas fa-trash-alt text-danger" @click="deleteUnit(unit)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" id="unit" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">واحد</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span arunit-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="form-group col-12">
                  <label for="">کد واحد</label>
                  <input type="text" class="form-control" disabled :value="unitCode" />
                </div>
                <div class="form-group col-12">
                  <label for="">نام واحد</label>
                  <input type="text" class="form-control" v-model="unit.name">
                </div>
                <div class="form-group col-12">
                  <label>توضیحات</label>
                  <textarea class="form-control" rows="3" v-model="unit.explanation"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="!unit.id" @click="storeUnit()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="updateUnit()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import wareMixin from "@/mixin/ware";
export default {
  mixins: [wareMixin],
  name: "Unit",
  data() {
    return {
      unit: {}
    };
  },
  created() {},
  methods: {
    editUnit(unit) {
      this.unit = this.copy(unit);
      $("#unit").modal("show");
    },
    updateUnit() {
      this.request({
        url: this.endpoint("wares/units/" + this.unit.id),
        method: "put",
        data: this.unit,
        success: data => {
          this.notify("واحد با موفقیت ویرایش شد", "success");
          this.getUnits(true);
          $("#unit").modal("hide");
          this.unit = {};
        }
      });
    },
    createUnit() {
      $("#unit").modal("show");
    },
    storeUnit() {
      this.request({
        url: this.endpoint("wares/units"),
        method: "post",
        data: this.unit,
        success: data => {
          this.notify("واحد با موفقیت ساخته شد", "success");
          this.getUnits(true);
          $("#unit").modal("hide");
          this.unit = {};
        }
      });
    },
    deleteUnit(unit) {
      this.request({
        url: this.endpoint("wares/units/" + unit.id),
        method: "delete",
        success: data => {
          this.notify("واحد با موفقیت حذف شد", "success");
          this.getUnits(true);
        }
      });
    }
  },
  computed: {
    unitCode() {
      if(this.unit.id) return this.unit.id;
      let unit = _.maxBy(this.units, u => u.id);
      if (unit) return unit.id + 1;
      else return 1;
    }
  }
};
</script>

<style scoped lang="scss">
i {
  margin: 0px;
  cursor: pointer !important;
  padding: 5px;
  border-radius: 3px;
  &:hover {
    background-color: #eee;
  }
}
button {
  margin-bottom: 8px;
}
</style>

