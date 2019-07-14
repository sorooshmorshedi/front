<template>
  <div>
    <div class="select-container">
      <multiselect
        dir="rtl"
        :options="waresSelectValues.wares"
        v-model="ware"
        track-by="id"
        label="name"
        :disabled="disabled"
        :hasAddonBtn="true"
      >
        <button
          slot="addonBtn"
          :disabled="!ware"
          @click="showInventory(ware)"
          type="button"
          class="btn btn-info"
        >
          <i class="fas fa-boxes"></i>
        </button>
      </multiselect>
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

<style lang="scss" >
</style>
