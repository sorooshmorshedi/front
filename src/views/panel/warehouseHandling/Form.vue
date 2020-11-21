<template>
  <m-form
    title="انبار گردانی"
    :showList="false"
    :listRoute="{name:'WarehouseHandlingList'}"
    exportBaseUrl="reports/lists/warehouseHandlings"
    :exportParams="{id: this.id}"
    :canEdit="canEdit"
    :canDelete="false"
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
  >
    <template #header-btns></template>

    <template>
      <v-row>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field disabled label="شماره" v-model="item.code" />
            </v-col>
            <v-col cols="12" lg="6">
              <date
                class="form-control"
                v-model="item.date"
                label=" * تاریخ "
                :default="true"
                :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" lg="12">
              <v-text-field
                v-if="item.created_by"
                label="کاربر"
                disabled
                v-model="item.created_by.name"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="6">
          <v-row>
            <v-col cols="12" lg="12">
              <v-textarea
                label="شرح سند"
                v-model="item.explanation"
                :disabled="!isEditing"
                height="105"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <input-table v-model="rows">
            <template #thead>
              <tr>
                <th>#</th>
                <th>کد کالا</th>
                <th>نام کالا</th>
                <th>* مانده</th>
                <th>تعداد موجودی</th>
                <th>مغایرت</th>
              </tr>
            </template>
            <template #tbody>
              <tr v-for="(ware, i) in wares" :key="i">
                <td class="tr-counter">{{ i+1 }}</td>
                <td>{{ ware.code }}</td>
                <td>{{ ware.name }}</td>
                <td>
                  <money />
                </td>
                <td>1</td>
                <td>3</td>
                <td class="d-print-none">
                  <v-btn
                    v-if="i != rows.length-1"
                    @click="deleteRow(i)"
                    class="red--text"
                    icon
                    :disabled="!isEditing"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </input-table>
        </v-col>
      </v-row>
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
      baseUrl: "sanads",
      permissionBasename: "sanad",
      leadingSlash: true,
      hasList: false,
      hasIdProp: true,
      rowKey: "account",
    };
  },
  computed: {
    canEdit() {
      if (!this.item.id) return true;
      return !this.item.is_auto_created;
    },
    bedSum() {
      let sum = 0;
      this.rows.forEach((r) => {
        if (r.bed) sum += +r.bed;
      });
      return sum;
    },
    besSum() {
      let sum = 0;
      this.rows.forEach((r) => {
        if (r.bes) sum += +r.bes;
      });
      return sum;
    },
  },
  methods: {
    getItemTemplate() {
      return {
        type: "temporary",
      };
    },
    getRowTemplate() {
      return {
        bed: 0,
        bes: 0,
      };
    },
    getSanadByCode(code) {
      this.log("Get sanad by code: ", code);
      return this.request({
        url: this.endpoint("sanads/getSanadByCode"),
        method: "get",
        params: {
          code,
        },
        success: (data) => {
          this.selectSanad(data);
        },
      });
    },
    setItem(item) {
      this.item = item;
      this.itemsToDelete = [];
      this.rows = [];
      item.items
        .sort((a, b) => a.order - b.order)
        .forEach((item) => {
          let row = { ...item };
          this.rows.push(row);
        });
      this.rows.push(this.getRowTemplate());
      this.changeRouteTo(item.id);
      this.isEditing = false;
    },
    copySanadToNewSanad() {
      let rows = this.copy(this.rows);
      this.clearForm();
      this.$nextTick(() => {
        this.rows = [];
        for (const row of rows) {
          if (row.id) delete row.id;
          this.rows.push({
            ...row,
          });
        }
      });
    },
    exchangeValue(row) {
      if (row) {
        let tmp = row.bed;
        row.bed = row.bes;
        row.bes = tmp;
      } else {
        for (const row of this.rows) {
          let tmp = row.bed;
          row.bed = row.bes;
          row.bes = tmp;
        }
      }
    },
    getSerialized() {
      let data = {
        item: this.extractIds(this.item),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: [],
        },
      };

      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;

        let item = this.copy(row);
        item = this.extractIds(item);
        item.bed = +item.bed;
        item.bes = +item.bes;

        data.items.items.push(item);
      });

      return data;
    },
  },
};
</script>

<style scoped lang="scss"></style>

