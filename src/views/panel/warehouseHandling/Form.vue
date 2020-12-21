<template>
  <m-form
    title="انبار گردانی"
    :showList="false"
    :listRoute="{name:'WarehouseHandlingList'}"
    exportBaseUrl="reports/lists/warehouseHandlings"
    :exportParams="{id: this.id}"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    :isEditing.sync="isEditing"
    :confirmBtnText="confirmBtnText"
    :cancelConfirmBtnText="cancelConfirmBtnText"
    :canConfirm="canConfirm"
    :canCancelConfirm="canCancelConfirm"
    @cancelConfirm="cancelConfirm"
    @confirm="confirm"
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
    @clearForm="clearForm()"
    ref="mForm"
  >
    <template #header-btns>
      <template v-if="item.is_definite">
        <v-btn
          :to="{name: 'AdjustmentForm', params: {id:item.inputAdjustment, type: 'ia'}}"
          class="blue white--text mr-1"
        >مشاهده حواله</v-btn>

        <v-btn
          :to="{name: 'AdjustmentForm', params: {id:item.outputAdjustment, type: 'oa'}}"
          class="blue white--text mr-1"
        >مشاهده رسید</v-btn>
      </template>

      <template v-if="$refs.mForm">
        <v-btn
          small
          class="export-btn mr-1"
          :href="$refs.mForm.printUrl + '&hide_remains=true'"
          target="_blank"
          rel="noopener noreferrer"
        >چاپ بدون مانده</v-btn>
        <v-btn
          small
          class="export-btn mr-1"
          :href="$refs.mForm.pdfUrl + '&hide_remains=true'"
          rel="noopener noreferrer"
        >PDF بدون مانده</v-btn>
        <v-btn
          small
          class="export-btn mr-1"
          @click="downloadUrl($refs.mForm.excelUrl + '&hide_remains=true')"
        >اکسل بدون مانده</v-btn>
      </template>
    </template>

    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field disabled label="شماره" v-model="item.code" />
        </v-col>
        <v-col cols="12" md="2">
          <date
            v-model="item.start_date"
            label=" * تاریخ آغاز"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="2">
          <date
            v-model="item.counting_date"
            label=" * تاریخ شمارش"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="2">
          <date
            v-model="item.submit_date"
            label=" * تاریخ ثبت انبار گردانی"
            :default="true"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="* انبار گردان" v-model="item.handler" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <v-autocomplete
            :return-object="false"
            label="* انبار"
            :items="warehouses"
            v-model="filters.warehouse"
            item-text="title"
            item-value="id"
            :disabled="id != undefined"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            :items="waresStatuses"
            v-model="filters.status"
            label="وضعیت کالا"
            :disabled="id != undefined"
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-textarea label="شرح" v-model="item.explanation" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-if="item.created_by"
            label="کاربر"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>

        <v-col cols="12">
          <input-table v-model="rows" v-if="filters.warehouse">
            <template #thead>
              <tr>
                <th>#</th>
                <th>کد کالا</th>
                <th>نام کالا</th>
                <th>* موجودی شمارش شده انبار</th>
                <th>مانده سیستم</th>
                <th>مغایرت</th>
              </tr>
            </template>
            <template #tbody v-if="inventory.length">
              <tr v-for="(row, i) in rows" :key="i">
                <td class="tr-counter">{{ i+1 }}</td>
                <td>{{ row.ware.code }}</td>
                <td>{{ row.ware.name }}</td>
                <td>
                  <money v-model="row.warehouse_remain" :disabled="!isEditing" />
                </td>
                <td>{{ getSystemRemain(row) | toMoney }}</td>
                <td
                  dir="ltr"
                  :class="getContradictionStyle(row)"
                >{{ getContradiction(row) | toMoney }}</td>
              </tr>
            </template>
          </input-table>
        </v-col>
      </v-row>
    </template>

    <template #footer-outside-btns>
      <v-btn
        v-if="id"
        @click="definite"
        :disabled="item.is_definite"
        class="blue white--text mr-1"
      >ثبت نهایی</v-btn>
    </template>
  </m-form>
</template>

<script>
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import wareApiMixin from "@/mixin/wareApi";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  name: "Form",
  components: { money, date },
  mixins: [wareApiMixin, MFormMixin],
  props: ["id"],
  data() {
    return {
      baseUrl: "factors/warehouseHandlings",
      permissionBasename: "warehouseHandling",
      leadingSlash: true,
      hasList: false,
      hasIdProp: true,
      filters: {},
      inventory: [],
      rows: [],
    };
  },
  watch: {
    filters: {
      handler() {
        this.getWareInventory();
      },
      deep: true,
    },
  },
  created() {
    this.getWares();
    this.getWarehouses();
    this.filters = this.getFilterTemplate();
  },
  methods: {
    getWareInventory() {
      this.request({
        url: this.endpoint("reports/inventory/warehouse/all"),
        params: {
          ...this.filters,
          level: 3,
          limit: 1000000,
          offset: 0,
        },
        success: (data) => {
          data = data.results.slice(0, data.results.length - 1)
          this.inventory = data;
          if (!this.id) {
            this.rows = data.map((o) => {
              return {
                id: null,
                ware: o,
                system_remain: o.remain,
              };
            });
          }
        },
      });
    },
    definite() {
      this.request({
        url: this.endpoint("factors/warehouseHandlings/definite"),
        method: "post",
        data: {
          id: this.id,
        },
        success: (data) => {
          this.successResponse(data);
        },
      });
    },
    clearForm() {
      this.isEditing = true;
      this.item = this.getItemTemplate();
      this.filters = this.getFilterTemplate();
      this.changeRouteTo(null);
    },
    getFilterTemplate() {
      return {
        warehouse: null,
        level: 3,
        status: "all",
      };
    },
    getSystemRemain(row) {
      if (this.item.is_definite) {
        return row.system_remain;
      } else {
        return this.inventory.filter((o) => o.id == row.ware.id)[0]["remain"];
      }
    },
    getContradiction(row) {
      if (!row.warehouse_remain) return "-";
      row.contradiction = row.warehouse_remain - this.getSystemRemain(row) || 0;
      return row.contradiction;
    },
    getContradictionStyle(row) {
      let contradiction = this.getContradiction(row);
      if (!row.warehouse_remain) return "";
      if (contradiction > 0) return "green--text";
      else return "red--text";
    },
    getItemTemplate() {
      return {};
    },
    setItem(item) {
      this.item = item;
      this.filters.warehouse = item.warehouse.id;
      this.filters.status = item.ware_status;
      this.itemsToDelete = [];
      this.rows = [];
      item.items
        .sort((a, b) => a.order - b.order)
        .forEach((item) => {
          let row = { ...item };
          this.rows.push(row);
        });
      this.changeRouteTo(item.id);
      this.isEditing = false;
    },
    getSerialized() {
      let item = {
        ...this.item,
        warehouse: this.filters.warehouse,
        ware_status: this.filters.status,
      };
      let data = {
        item: this.extractIds(item),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: this.rows.map((o) => this.extractIds(o)),
        },
      };
      return data;
    },
  },
};
</script>

<style scoped lang="scss"></style>

