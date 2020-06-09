<template>
  <daily-form
    formName="انتقال"
    title="انتقال بین انبار ها"
    @clearForm="clearForm(true)"
    :ListRouteParams="{form: 'transfer'}"
    :exportParams="{id: this.id}"
    :hasFirst="true"
    :hasLast="true"
    :hasPrev="true"
    :hasNext="true"
    :editable="editable"
    :deletable="this.id"
    @goToForm="goToForm"
    @validate="validate"
    @edit="makeFormEditable()"
    @delete="deleteTransfer()"
  >
    <template #inputs>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="شماره انتقال" disabled v-model="transfer.code" />
        </v-col>
        <v-col cols="12" md="2">
          <date label="تاریخ" v-model="transfer.date" :default="true" :disabled="!editable" />
        </v-col>
        <v-col cols="12" md="8">
          <v-textarea
            label="توضیحات"
            class="form-control"
            rows="5"
            v-model="transfer.explanation"
            :disabled="!editable"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-simple-table>
            <thead>
              <tr>
                <th>#</th>
                <th>نام/کد کالا</th>
                <th>از انبار</th>
                <th>تعداد</th>
                <th>واحد</th>
                <th>به انبار</th>
                <th>توضیحات</th>
                <th class="d-print-none"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row,i) in rows" :key="i">
                <td>{{ i+1 }}</td>
                <td>
                  <ware-select v-model="rows[i].ware" :disabled="!editable" />
                </td>
                <td>
                  <v-autocomplete
                    v-if="rows[i].ware"
                    :items="warehouses"
                    v-model="rows[i].output_warehouse"
                    item-text="name"
                    :disabled="!editable"
                  />
                  <span v-else>-</span>
                </td>
                <td>
                  <money v-model="rows[i].count" :disabled="!editable" />
                </td>
                <td>{{ rows[i].ware?rows[i].ware.unit.name:' - ' }}</td>
                <td>
                  <v-autocomplete
                    v-if="rows[i].ware"
                    :items="warehouses"
                    v-model="rows[i].input_warehouse"
                    item-text="name"
                    :disabled="!editable"
                  />
                  <span v-else>-</span>
                </td>
                <td>
                  <v-text-field v-model="rows[i].explanation" :disabled="!editable" />
                </td>
                <td class="d-print-none">
                  <v-btn
                    v-if="i != rows.length-1"
                    @click="deleteItemRow(i)"
                    class="red--text"
                    icon
                    :disabled="!editable"
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
                  <v-btn @click="deleteItemRow(-1)" icon class="red--text" :disabled="!editable">
                    <v-icon>delete_sweep</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </template>
  </daily-form>
</template>

<script>
import wareApiMixin from "@/mixin/wareApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
import mtime from "@/components/mcomponents/cleave/Time";
import _ from "lodash";

export default {
  name: "Form",
  components: { money, date, mtime },
  props: ["id"],
  mixins: [formsMixin, wareApiMixin],
  data() {
    return {
      transfer: {},
      rows: [],
      rowTemplate: {},
      idsToDelete: [],
      inventory: {
        ware: null,
        warehouses: []
      }
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    getData() {
      this.getWarehouses();
      this.getWares();
      if (this.id) this.getTransfer();
    },
    getTransfer() {
      this.request({
        url: this.endpoint(`factors/transfers/${this.id}/`),
        method: "get",
        success: data => {
          this.selectTransfer(data);
        }
      });
    },
    selectTransfer(transfer, changeRoute = false) {
      this.transfer = transfer;
      this.rows = transfer.items;
      this.rows.push(this.copy(this.rowTemplate));

      if (changeRoute) {
        this.makeFormUneditable();
        this.$router.push({
          name: "TransferForm",
          params: {
            id: transfer.id
          }
        });
      }
    },
    showInventory(ware) {
      this.inventory.ware = ware;
      this.getInventory(ware);
    },
    getInventory(ware) {
      this.request({
        url: this.endpoint(`wares/inventory/forWare`),
        method: "get",
        params: {
          ware: ware.id
        },
        success: data => {
          this.inventory.warehouses = data;
          $("#inventory-modal").modal("show");
        }
      });
    },
    initForm() {
      this.log("Init Form");
      this.clearForm();
      this.getData();
    },
    clearForm(changeRoute = false) {
      this.transfer = {};
      this.rows = [];
      this.rows.push(this.copy(this.rowTemplate));
      if (changeRoute) {
        this.$router.push({
          name: "TransferForm"
        });
      }
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
      if (this.transfer.id) this.updateTransfer(clearForm);
      else this.storeTransfer(clearForm);
    },
    storeTransfer(clearForm) {
      let items = this.rows.slice(0, this.rows.length - 1);
      items = items.map(this.extractIds);
      this.transfer.items = items;
      this.request({
        url: this.endpoint("factors/transfers/"),
        method: "post",
        data: {
          transfer: this.transfer
        },
        success: data => {
          this.successNotify();
          if (clearForm) {
            this.clearForm();
          } else {
            this.selectTransfer(data, true);
            this.makeFormUneditable();
          }
        }
      });
    },
    updateTransfer(clearForm) {
      let items = this.rows.slice(0, this.rows.length - 1);
      items = items.map(this.extractIds);
      this.transfer.items = items;
      this.request({
        url: this.endpoint(`factors/transfers/${this.transfer.id}/`),
        method: "put",
        data: {
          transfer: this.transfer
        },
        success: data => {
          this.successNotify();
          if (clearForm) {
            this.clearForm();
          } else {
            this.selectTransfer(data, true);
            this.makeFormUneditable();
          }
        }
      });
    },
    deleteTransfer() {
      this.request({
        url: this.endpoint(`factors/transfers/${this.transfer.id}/`),
        method: "delete",
        success: data => {
          this.successNotify();
          this.clearForm(true);
        }
      });
    },
    deleteItemRow(index) {
      if (index == -1) {
        this.rows.splice(0, this.rows.length - 1);
      } else {
        this.rows.splice(index, 1);
      }
    },
    goToForm(pos) {
      return this.request({
        url: this.endpoint("factors/getTransferByPosition"),
        method: "get",
        params: {
          id: this.transfer.id,
          position: pos
        },
        success: data => {
          this.selectTransfer(data, true);
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify("فاکتور وجود ندارد", "warning");
          }
        }
      });
    }
  },
  computed: {
    sum() {
      let res = 0;
      this.rows.forEach(row => {
        if (row.count) res += +row.count;
      });
      return res;
    }
  },
  watch: {
    rows: {
      handler(newRows, oldRows) {
        let row = this.rows[this.rows.length - 1];
        if (row && row.ware) {
          this.rows.push(this.copy(this.rowTemplate));
        }
      },
      deep: true
    }
  }
};
</script>

<style scoped lang="scss"></style>

