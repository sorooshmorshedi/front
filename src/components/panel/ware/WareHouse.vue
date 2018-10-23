<template>
  <div class="row rtl">
    <div class="col-12 col-lg-12">
      <div class="title">انبار</div>
      <button @click="createWH()" type="button" class="btn btn-info">افزودن انبار</button>
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
          <tr v-for="(wh, i) in warehouses" :key="i">
            <td>{{ i+1 }}</td>
            <td>{{ wh.name }}</td>
            <td>{{ wh.explanation }}</td>
            <td>
              <i class="fas fa-pencil-alt text-warning" @click="editWH(wh)" />
            </td>
            <td>
              <i class="fas fa-trash-alt text-danger" @click="deleteWH(wh)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade" id="wh" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">انبار</h4>
            <button type="button" class="close" data-dismiss="modal">
              <span arwh-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="form-group col-12">
                <label for="">کد انبار</label>
                <input type="text" class="form-control" :value="warehouseCode" disabled>
              </div>
              <div class="form-group col-12">
                <label for="">نام انبار</label>
                <input type="text" class="form-control" v-model="warehouse.name">
              </div>
              <div class="form-group col-12">
                <label>توضیحات</label>
                <textarea class="form-control" rows="3" v-model="warehouse.explanation"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button v-if="!warehouse.id" @click="storeWH()" type="button" class="btn btn-primary">ثبت</button>
            <button v-else @click="updateWH()" type="button" class="btn btn-primary">ثبت</button>
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
  name: "Warehouse",
  data() {
    return {
      warehouse: {}
    };
  },
  created() {},
  methods: {
    editWH(wh) {
      this.warehouse = this.copy(wh);
      $("#wh").modal("show");
    },
    updateWH() {
      this.request({
        url: this.endpoint("wares/warehouses/" + this.warehouse.id),
        method: "put",
        data: this.warehouse,
        success: data => {
          this.notify("انبار با موفقیت ویرایش شد", "success");
          this.getWarehouses(true);
          $("#wh").modal("hide");
          this.warehouse = {};
        }
      });
    },
    createWH() {
      $("#wh").modal("show");
    },
    storeWH() {
      this.request({
        url: this.endpoint("wares/warehouses"),
        method: "post",
        data: this.warehouse,
        success: data => {
          this.notify("انبار با موفقیت ساخته شد", "success");
          this.getWarehouses(true);
          $("#wh").modal("hide");
          this.warehouse = {};
        }
      });
    },
    deleteWH(wh) {
      this.request({
        url: this.endpoint("wares/warehouses/" + wh.id),
        method: "delete",
        success: data => {
          this.notify("انبار با موفقیت حذف شد", "success");
          this.getWarehouses(true);
        }
      });
    }
  },
  computed: {
    warehouseCode() {
      if (this.warehouse.id) return this.warehouse.id;
      let wh = _.maxBy(this.warehouses, wh => wh.id);
      if (wh) return wh.id + 1;
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

