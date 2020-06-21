<template>
  <div class="d-flex">
    <v-autocomplete
      :label="label"
      :items="wares"
      v-model="ware"
      item-text="name"
      :disabled="disabled"
      prepend-icon="fa-boxes"
      @click:prepend="ware && showInventory()"
    ></v-autocomplete>

    <v-dialog v-if="ware" v-model="dialog" scrollable max-width="500px">
      <v-card>
        <v-card-title>موجودی انبار ها برای {{ ware.name }}</v-card-title>

        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th>#</th>
                <th>انبار</th>
                <th>مانده</th>
                <th>فی خرید</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(inventory, i) in ware.inventory" :key="inventory.id">
                <td>{{ i + 1 }}</td>
                <td>{{ inventory.warehouse.name }}</td>
                <td>{{ inventory.count }}</td>
                <td>{{ inventory.fee }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      dialog: false
    };
  },
  created() {
    this.getWares();
    this.setWare();
  },
  methods: {
    showInventory() {
      this.dialog = true;
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
