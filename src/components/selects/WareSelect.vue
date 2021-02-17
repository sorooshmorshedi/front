<template>
  <div class="d-flex">
    <v-icon
      v-if="factorType"
      title="آخرین قیمت"
      @click="showPrices"
      color="cyan"
      :disabled="!ware"
    >fa-dollar-sign</v-icon>
    <open-inventory-btn :wareId="ware && ware.id" class="mr-2" />
    <v-icon
      title="موجودی"
      @click="showInventory"
      color="cyan"
      class="pl-2 mr-2"
      :disabled="!ware"
    >fa-boxes</v-icon>
    <v-autocomplete
      :title="ware && ware.name"
      :label="label"
      :items="wares.filter(o => o.level == 3)"
      v-model="ware"
      item-text="name"
      item-value="id"
      :disabled="disabled"
      :return-object="true"
      :suffix="ware && ware.main_unit_name"
    ></v-autocomplete>

    <v-dialog v-if="inventories.length" v-model="dialog" scrollable max-width="500px">
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

    <v-dialog v-if="ware" v-model="pricesDialog" scrollable max-width="1000px">
      <v-card>
        <v-card-title>آخرین قیمت های {{ ware.name }}</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <m-datatable
                :headers="pricesHeaders"
                api-url="reports/buySale"
                :filters.sync="pricesFilters"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import wareApiMixin from "@/mixin/wareApi";
import OpenInventoryBtn from "@/components/btns/OpenInventoryBtn.vue";
export default {
  mixins: [wareApiMixin],
  components: { OpenInventoryBtn },
  props: {
    value: {},
    disabled: {},
    label: {},
    returnObject: {
      default: true,
    },
    factorType: {
      default: null,
    },
  },
  data() {
    return {
      ware: null,
      dialog: false,
      wareInventory: [],
      pricesDialog: false,
      pricesHeaders: [
        {
          text: "شماره فاکتور",
          value: "factor.code",
        },
        {
          text: "تاریخ",
          value: "factor.date",
          type: "date",
        },
        {
          text: "تعداد",
          value: "count",
          type: "numeric",
        },
        {
          text: "واحد",
          value: "unit.name",
        },
        {
          text: "خریدار/فروشنده",
          value: "factor.account.name",
          type: "text",
        },
        {
          text: "فی",
          value: "fee",
          type: "numeric",
          sortable: false,
        },
        {
          text: "مبلغ کل",
          value: "total_value",
          type: "numeric",
          sortable: false,
        },
      ],
      pricesFilters: {
        offset: 0,
        limit: 5,
        factor__type__in: null,
      },
    };
  },
  computed: {
    inventories() {
      let inventories = this.wareInventory.reduce((v, inventory) => {
        let member = v.filter((o) => o.warehouse.id == inventory.warehouse.id);
        if (member.length) {
          member = member[0];
          member.count += +inventory.count;
        } else {
          v.push({
            warehouse: inventory.warehouse,
            count: +inventory.count,
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
      this.request({
        url: this.endpoint(`wares/wares/${this.ware.id}`),
        method: "get",
        success: (data) => {
          this.wareInventory = data.inventory;
          this.dialog = true;
        },
      });
    },
    showPrices() {
      this.pricesFilters.factor__type__in = this.factorType;
      this.pricesDialog = true;
    },
    setWare(value) {
      if (this.value != this.ware) {
        this.ware = this.value;
        this.pricesFilters.ware = this.ware.id;
      }
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
