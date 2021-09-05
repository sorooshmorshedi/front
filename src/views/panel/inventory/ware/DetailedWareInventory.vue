<template>
  <v-card>
    <v-card-title>کاردکس کالا</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <ware-select label="کالا" v-model="inventory.ware" @input="setWarehouse" />
        </v-col>

        <v-col cols="12" md="6">
          <v-autocomplete
            :return-object="false"
            label="انبار"
            :items="warehouses"
            v-model="filters.warehouse"
            item-text="title"
            item-value="id"
          />
        </v-col>

        <v-col cols="12" class="detailed-ware-inventory">
          <m-datatable
            v-if="inventory.ware"
            :api-url="url"
            :headers="headers"
            :filters.sync="filters"
          >
            <template #item.code="{ item }">
              <v-btn
                v-if="item.factor.code"
                text
                color="blue"
                icon
                rounded
                :to="getDetailLink(item)"
              >{{item.factor.code}}</v-btn>
            </template>
          </m-datatable>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import _ from "lodash";
import queryBinding from "@/components/m-query-binding";
import wareApiMixin from "@/mixin/wareApi";
import Template from "@/views/Template.vue";
export default {
  components: { Template },
  mixins: [queryBinding, wareApiMixin],
  data() {
    return {
      url: "reports/inventory/ware",
      inventory: {
        ware: null,
      },
      filters: {
        ware: null,
        warehouse: null,
      },
      headers: [
        {
          text: "تاریخ",
          value: "factor.date",
          type: "date",
          sortable: false,
        },
        {
          text: "نوع فاکتور",
          value: "factor.type",
          type: "select",
          sortable: false,
          items: [
            {
              text: "موجودی اول دوره",
              value: "fpi",
            },
            {
              text: "خرید",
              value: "buy",
            },
            {
              text: "برگشت از خرید",
              value: "backFromBuy",
            },
            {
              text: "فروش",
              value: "sale",
            },
            {
              text: "برگشت از فروش",
              value: "backFromSale",
            },
            {
              text: "وارده از انتقال",
              value: "it",
            },
            {
              text: "صادره با انتقال",
              value: "ot",
            },
            {
              text: "حواله کالای مصرفی",
              value: "cw",
            },
            {
              text: "رسید تعدیل انبار",
              value: "ia",
            },
            {
              text: "حواله تعدیل انبار",
              value: "oa",
            },
          ],
        },
        {
          text: "شماره",
          value: "code",
          type: "number",
          sortable: false,
          filterable: false,
        },
        {
          text: "شرح فاکتور",
          value: "factor.explanation",
          type: "text",
          sortable: false,
          filterable: false,
        },
        {
          text: "نام حساب",
          value: "factor.account.name",
          type: "text",
          sortable: false,
          filterable: false,
        },
        // {
        //   text: "نام انبار",
        //   value: "warehouse_name",
        //   sortable: false,
        //   filterable: false,
        // },
        {
          text: "مقدار وارده",
          value: "input.count",
          type: "numeric",
          sortable: false,
          filterable: false,
        },
        {
          text: "فی وارده",
          value: "input.fee",
          type: "numeric",
          sortable: false,
          filters: [],
          filterable: false,
        },
        {
          text: "مبلغ وارده",
          value: "input.value",
          type: "numeric",
          sortable: false,
          filterable: false,
          filters: [],
        },
        {
          text: "مقدار صادره",
          value: "output.count",
          type: "numeric",
          sortable: false,
          filterable: false,
          filters: [],
        },
        {
          text: "فی صادره",
          value: "output.fee",
          type: "numeric",
          sortable: false,
          filterable: false,
          filters: [],
        },
        {
          text: "مبلغ صادره",
          value: "output.value",
          type: "numeric",
          sortable: false,
          filterable: false,
          filters: [],
        },
        {
          text: "مقدار مانده",
          value: "remain.count",
          type: "numeric",
          sortable: false,
          filterable: false,
          filters: [],
        },
        {
          text: "فی مانده",
          value: "remain.fee",
          type: "numeric",
          sortable: false,
          filterable: false,
          filters: [],
        },
        {
          text: "مبلغ مانده",
          value: "remain.value",
          type: "numeric",
          sortable: false,
          filterable: false,
          filters: [],
        },
      ],
    };
  },
  created() {
    this.getWarehouses();
  },
  methods: {
    setWarehouse(ware) {
      if (ware) this.filters.warehouse = ware.warehouse.id;
    },
    getDetailLink(item) {
      let factor = item.factor;
      let type = factor.type;
      if (["it", "ot"].includes(type)) {
        return {
          name: "TransferForm",
          params: {
            id: item.origin.id,
          },
        };
      } else if (["ia", "oa"].includes(type)) {
        return {
          name: "AdjustmentForm",
          params: {
            id: item.origin.id,
          },
        };
      }

      return {
        name: "FactorForm",
        params: {
          id: factor.id,
          type: factor.type,
          isPreFactor: factor.is_pre_factor,
        },
      };
    },
  },
  watch: {
    "inventory.ware": {
      handler() {
        if (this.inventory.ware) {
          this.filters.ware = this.inventory.ware.id;
        }
      },
      deep: true,
    },
  },
  computed: {
    wares() {
      return this.$store.state.wares.wares;
    },
  },
};
</script>

<style lang="scss">
.detailed-ware-inventory > #datatable > div.v-data-table__wrapper > table tr {
  td,
  th {
    &:nth-child(8),
    &:nth-child(11),
    &:nth-child(14) {
      border-right: 1px solid #e0e0e0 !important;
    }
  }
}
</style>
