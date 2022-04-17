<template>
  <m-form
    :title="title"
    :showList="false"
    :listRoute="{name:'AdjustmentsList', params:{type: type}}"
    exportBaseUrl="reports/lists/adjustments"
    :exportParams="{id: id}"
    :isEditing.sync="isEditing"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    @clearForm="clearForm(true)"
    @goToForm="getItemByPosition"
    @submit="validate"
    @delete="deleteItem"
    @define="defineItem"
  >
    <template #header-btns>
      <open-sanad-btn v-if="item.sanad" :sanad="item.sanad" />
    </template>
    <template>
      <v-row>
        <v-col cols="8">
          <v-row>
            <v-col cols="12" md="2">
              <v-text-field label="شماره" disabled v-model="item.code" />
            </v-col>
            <v-col cols="12" md="2">
              <date label=" * تاریخ" v-model="item.date" :default="true" :disabled="!isEditing" />
            </v-col>
            <v-col cols="12" md="2">
              <mtime
                label=" * ساعت"
                required
                v-model="item.time"
                :default="true"
                :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-text-field
                v-if="item.created_by"
                label="کاربر"
                disabled
                v-model="item.created_by.name"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-switch v-if="item.id" label="قطعی شده" v-model="item.is_defined" disabled />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4">
          <v-row>
            <v-col cols="12">
              <v-textarea
                label="توضیحات"
                class="form-control"
                v-model="item.explanation"
                :disabled="!isEditing"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <input-table v-model="rows">
            <template #thead>
              <tr>
                <th>#</th>
                <th>* نام/کد کالا</th>
                <th>* واحد</th>
                <th>* انبار</th>
                <th>* تعداد</th>
                <th>توضیحات</th>
                <th class="d-print-none"></th>
              </tr>
            </template>
            <template #tbody>
              <tr v-for="(row,i) in rows" :key="i">
                <td class="tr-counter">{{ i+1 }}</td>
                <td class="tr-ware">
                  <ware-select
                    v-model="rows[i].ware"
                    :disabled="!isEditing"
                    :show-main-unit="false"
                  />
                </td>
                <td style="max-width:100px">
                  <v-autocomplete
                    v-if="rows[i].ware"
                    :items="getWareUnits(row.ware)"
                    v-model="rows[i].unit"
                    :title="rows[i].unit?rows[i].unit.title:''"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                    :return-object="true"
                    :suffix="getUnitSuffix(row.ware, row.unit)"
                  ></v-autocomplete>
                </td>

                <td class="tr-warehouse">
                  <v-autocomplete
                    :return-object="true"
                    v-if="rows[i].ware"
                    :items="warehouses"
                    v-model="rows[i].warehouse"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                  />
                  <span v-else>-</span>
                </td>
                <td>
                  <money v-model="rows[i].unit_count" :disabled="!isEditing" />
                </td>
                <td>
                  <row-textarea
                    v-model="rows[i].explanation"
                    :disabled="!isEditing"
                    :i="i"
                    @updateRowsExplanation="updateRowsExplanation"
                  />
                </td>
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
              <tr class="bg-info text-white">
                <td colspan="3"></td>
                <td>جمع</td>
                <td>{{ sum | toMoney }}</td>
                <td colspan="1"></td>
                <td>
                  <v-btn @click="deleteRow(-1)" icon class="red--text" :disabled="!isEditing">
                    <v-icon>delete_sweep</v-icon>
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
import wareApiMixin from "@/mixin/wareApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
import _ from "lodash";
import { MFormMixin } from "@/components/m-form";

export default {
  name: "Form",
  components: { money, date, mtime },
  mixins: [formsMixin, wareApiMixin, MFormMixin],
  props: {
    id: {},
    type: {
      required: true,
    },
  },
  data() {
    return {
      baseUrl: "factors/adjustments",
      permissionBasename: "adjustment",
      appendSlash: true,
      rowKey: "ware",
      hasList: false,
      hasIdProp: true,
      isDefinable: true,
      hasLock: true,
      inventory: {
        ware: null,
        warehouses: [],
      },
    };
  },
  methods: {
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint(`${this.baseUrl}/byPosition`),
        method: "get",
        params: {
          id: this.item.id,
          position: position,
          type: this.type,
        },
        success: (data) => {
          this.setItem(data);
        },
      });
    },
    getData() {
      this.getWarehouses();
      this.getUnits();
    },
    validate(clearForm = false) {
      let isValid = true;
      if (this.rows.length == 1) {
        this.notify(`حداقل یک ردیف وارد کنید`, "danger");
        isValid = false;
      }
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!r.unit_count || r.unit_count == 0) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
      });
      if (!isValid) return;
      this.submit(clearForm);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      let items = this.rows.slice(0, this.rows.length - 1);
      items = items.map((o) => {
        o.count = this.convertToMainUnit(o.ware, o.unit_count, o.unit);
        return this.extractIds(o);
      });
      item.items = items;
      item.type = this.type;
      return {
        adjustment: item,
      };
    },
    setItem(adjustment) {
      this.item = adjustment;
      this.rows = adjustment.items.sort((a, b) => a.order - b.order);
      this.rows.push(this.copy(this.rowTemplate));

      this.changeRouteTo(adjustment.id);
    },
  },
  computed: {
    title() {
      if (this.type == "ia") return "رسید تعدیل انبار";
      return "حواله تعدیل انبار";
    },
    sum() {
      let res = 0;
      this.rows.forEach((row) => {
        if (row.unit_count) res += +row.unit_count;
      });
      return res;
    },
  },
};
</script>

<style scoped lang="scss"></style>

