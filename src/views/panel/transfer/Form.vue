<template>
  <m-form
    title="انتقال بین انبار ها"
    :listRoute="{name:'List', params:{form: 'transfer'}}"
    :showList="false"
    :exportParams="{id: this.id}"
    :isEditing.sync="isEditing"
    :canDelete="canDelete"
    :canSubmit="canSubmit"
    @clearForm="clearForm(true)"
    @goToForm="getItemByPosition"
    @submit="validate"
    @delete="deleteItem"
  >
    <template>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="شماره انتقال" disabled v-model="item.code" />
        </v-col>
        <v-col cols="12" md="2">
          <date label=" * تاریخ" v-model="item.date" :default="true" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12" md="5">
          <v-textarea
            label="توضیحات"
            class="form-control"
            v-model="item.explanation"
            :disabled="!isEditing"
          />
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-if="item.created_by"
            label="ثبت کننده"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-simple-table>
            <thead>
              <tr>
                <th>#</th>
                <th>* نام/کد کالا</th>
                <th>* از انبار</th>
                <th>* تعداد</th>
                <th>واحد</th>
                <th>* به انبار</th>
                <th>توضیحات</th>
                <th class="d-print-none"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,i) in rows" :key="i">
                <td class="tr-counter">{{ i+1 }}</td>
                <td class="tr-ware">
                  <ware-select v-model="rows[i].ware" :disabled="!isEditing" />
                </td>
                <td class="tr-warehouse">
                  <v-autocomplete
                    :return-object="true"
                    v-if="rows[i].ware"
                    :items="warehouses"
                    v-model="rows[i].output_warehouse"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                  />
                  <span v-else>-</span>
                </td>
                <td>
                  <money v-model="rows[i].count" :disabled="!isEditing" />
                </td>
                <td>{{ rows[i].ware?rows[i].ware.unit_name:' - ' }}</td>
                <td class="tr-warehouse">
                  <v-autocomplete
                    :return-object="true"
                    v-if="rows[i].ware"
                    :items="warehouses"
                    v-model="rows[i].input_warehouse"
                    item-text="name"
                    item-value="id"
                    :disabled="!isEditing"
                  />
                  <span v-else>-</span>
                </td>
                <td>
                  <v-text-field v-model="rows[i].explanation" :disabled="!isEditing" />
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
                <td :colspan="2"></td>
                <td>جمع</td>
                <td>{{ sum | toMoney }}</td>
                <td :colspan="3"></td>
                <td>
                  <v-btn @click="deleteRow(-1)" icon class="red--text" :disabled="!isEditing">
                    <v-icon>delete_sweep</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
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
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  name: "Form",
  components: { money, date, mtime },
  mixins: [formsMixin, wareApiMixin, MFormMixin],
  props: {
    id: {},
  },
  data() {
    return {
      baseUrl: "factors/transfers",
      permissionBasename: "transfer",
      leadingSlash: true,
      rowKey: "ware",
      hasList: false,
      hasIdProp: true,
      inventory: {
        ware: null,
        warehouses: [],
      },
    };
  },
  methods: {
    getData() {
      this.getWarehouses();
    },
    validate(clearForm = false) {
      let isValid = true;
      if (this.rows.length == 1) {
        this.notify(`حداقل یک ردیف وارد کنید`, "danger");
        isValid = false;
      }
      this.rows.forEach((r, i) => {
        if (i == this.rows.length - 1) return;
        if (!r.count || r.count == 0) {
          this.notify(`لطفا تعداد ردیف ${i + 1} را وارد کنید`, "danger");
          isValid = false;
        }
        if (!r.input_warehouse || !r.output_warehouse) {
          this.notify(
            `لطفا انبار ورودی و خروجی ردیف ${i + 1} را وارد کنید`,
            "danger"
          );
          isValid = false;
        }
        if (r.input_warehouse == r.output_warehouse) {
          this.notify(
            `لطفا انبار ورودی و خروجی ردیف ${i + 1} نمی تواند یکی باشد`,
            "danger"
          );
          isValid = false;
        }
      });
      if (!isValid) return;
      this.submit(clearForm);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      let items = this.rows.slice(0, this.rows.length - 1);
      items = items.map(this.extractIds);
      item.items = items;
      return item;
    },
    setItem(transfer) {
      this.item = transfer;
      this.rows = transfer.items;
      this.rows.push(this.copy(this.rowTemplate));

      this.changeRouteTo(transfer.id);
    },
  },
  computed: {
    sum() {
      let res = 0;
      this.rows.forEach((row) => {
        if (row.count) res += +row.count;
      });
      return res;
    },
  },
};
</script>

<style scoped lang="scss"></style>

