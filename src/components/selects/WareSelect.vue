<template>
  <div class="d-flex">
    <v-icon
      @click="ware && showInventory()"
      color="cyan"
      class="pl-2 mr-3"
      :disabled="!ware"
    >fa-boxes</v-icon>
    <v-autocomplete
      :label="label"
      :items="wares"
      v-model="ware"
      item-text="name"
      item-value="id"
      :disabled="disabled"
      :return-object="true"
      :suffix="ware && ware.unit?ware.unit.name:''"
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="(inventory, i) in inventories" :key="inventory.id">
                <td>{{ i + 1 }}</td>
                <td>{{ inventory.warehouse.name }}</td>
                <td>{{ inventory.count | toMoney }}</td>
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
  props: {
    value: {},
    disabled: {},
    label: {},
    returnObject: {
      default: true,
    },
  },
  data() {
    return {
      ware: null,
      dialog: false,
    };
  },
  computed: {
    inventories() {
      let inventories = this.ware.inventory.reduce((v, inventory) => {
        let member = v.filter((o) => o.warehouse.id == inventory.warehouse.id);
        if (member.length) {
          member.count += inventory.count;
        } else {
          v.push({
            warehouse: inventory.warehouse,
            count: inventory.count,
          });
        }
        return v;
      }, []);

      return inventories.sort((a, b) => a.warehouse.id - b.warehouse.id);
    },
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
    },
  },
  watch: {
    value() {
      this.setWare(this.value);
    },
    ware() {
      let ware = this.ware;
      if (ware && ware.id && !this.returnObject) ware = ware.id;
      this.$emit("input", ware);
    },
  },
};
</script>

<style lang="scss" >
</style>
