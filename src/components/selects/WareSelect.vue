<template>
  <div class="d-flex">
    <v-btn :disabled="!ware" @click="showInventory(ware)" height="30px" depressed class="mr-1 pa-0" >
      <v-icon>fas fa-boxes</v-icon>
    </v-btn>
    <v-autocomplete
      :label="label"
      :items="wares"
      v-model="ware"
      item-text="name"
      :disabled="disabled"
    ></v-autocomplete>

    <div class="modal fade d-none" :id="modalId" v-if="ware">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">موجودی انبار ها برای {{ ware.name }}</h5>
            <v-btn type="v-btn" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </v-btn>
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
            <v-btn type="v-btn" class="btn btn-secondary" data-dismiss="modal">بستن</v-btn>
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
  props: ["value", "disabled", "label"],
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
