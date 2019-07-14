<template>
  <div class="ware-select-container">
    <button
      :disabled="!ware"
      @click="showInventory(ware)"
      type="button"
      class="btn btn-info get-inventory-btn"
    >
      مم
      <!-- مشاهده مانده -->
    </button>

    <div class="select-container">
      <multiselect
        :option-height="104"
        dir="rtl"
        :options="waresSelectValues.wares"
        v-model="ware"
        track-by="id"
        label="name"
        :disabled="disabled"
      />
    </div>
    <div class="modal fade" :id="modalId" v-if="ware">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">موجودی انبار ها برای {{ ware.name }}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="container">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>انبار</th>
                    <th>مانده</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(warehouse, i) in warehousesInventory" :key="warehouse.id">
                    <td>{{ i }}</td>
                    <td>{{ warehouse.name }}</td>
                    <td>{{ warehouse.remain_count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
import wareApiMixin from "@/mixin/wareApi";
export default {
  mixins: [wareApiMixin],
  props: ["value", "disabled"],
  data() {
    return {
      ware: null,
      warehousesInventory: [],
      modalId: ""
    };
  },
  created() {
    this.modalId = this.getRandomId();
    this.getWares();
    this.setWare();
  },
  methods: {
    showInventory(ware) {
      this.request({
        url: this.endpoint(`wares/inventory/forWare`),
        method: "get",
        params: {
          ware: ware.id
        },
        success: data => {
          this.warehousesInventory = data;
          $(`#${this.modalId}`).modal("show");
        }
      });
    },
    setWare(value) {
      if (this.value != this.ware) this.ware = this.value;
    }
  },
  watch: {
    value() {
      this.setWare(this.value);
    },
    ware() {
      this.$emit("input", this.ware);
    }
  }
};
</script>

<style lang="scss" scoped>
.ware-select-container {
  width: 280px;
}
.multiselect__tags {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.get-inventory-btn {
  display: block;
  margin-top: 4px;
}

.select-container {
  width: 240px;
  float: right;
}
.btn {
  width: 40px;
  margin: 0px;
  height: 30px;
  padding: 0px;
  border: none;
  float: right;
}
</style>
