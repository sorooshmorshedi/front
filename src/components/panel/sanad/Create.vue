<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <div class="title">
            سند حسابداری
            <span class="d-print-none">
              <a @click.prevent="clearSanad()" href="#/" class="btn btn-info">جدید</a>
              <router-link
                class="btn btn-info"
                :to="{name: 'List', params: {form: 'sanad'}}"
              >انتخاب سند</router-link>
              <router-link
                v-if="sanad.factor"
                class="btn btn-info"
                :to="{name: 'FactorForm', params: {factorType: sanad.factor.type, id: sanad.factor.id }}"
              >مشاهده فاکتور این سند</router-link>
              <router-link
                v-if="sanad.transaction"
                class="btn btn-info"
                :to="{name: 'TransactionForm', params: {transactionType: sanad.transaction.type, id: sanad.transaction.id }}"
              >
                <span>مشاهده دریافت/پرداخت</span>
              </router-link>
              <button class="btn btn-info" @click="print()">چاپ</button>

              <div class="dropdown open d-inline-block" v-if="id">
                <button
                  class="btn btn-info dropdown-toggle"
                  type="button"
                  data-toggle="dropdown"
                >کپی سند</button>
                <div class="dropdown-menu">
                  <a
                    @click.prevent="copySanadToNewSanad()"
                    class="dropdown-item"
                    href="#!"
                  >به سند جدید</a>
                  <h6 class="dropdown-header"></h6>
                  <a class="dropdown-item" href="#!">Another action</a>
                </div>
              </div>
            </span>
          </div>
          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-6 col-sm-2">
                  <label>شماره سند</label>
                  <input
                    v-if="sanad.id"
                    type="text"
                    class="form-control"
                    disabled
                    v-model="sanad.code"
                  >
                  <input v-else type="text" class="form-control" disabled :value="sanadCode">
                </div>
                <div class="form-group col-lg-6 col-sm-2">
                  <label>تاریخ سند</label>
                  <date class="form-control" v-model="sanad.date" :default="true"/>
                </div>
                <div class="form-group col-lg-6 col-sm-4">
                  <label>صادر کننده سند</label>
                  <input type="text" class="form-control" disabled>
                </div>

                <div class="form-group col-lg-6 col-sm-4">
                  <label>نوع سند</label>
                  <div style="margin-top: 8px;margin-right: 15px;">
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios1"
                        value="temporary"
                        v-model="sanad.type"
                      >
                      <label class="form-check-label" for="exampleRadios1">موقت</label>
                    </div>
                    <div class="form-check form-check-inline" style="margin-right: 50px;">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios2"
                        value="definite"
                        v-model="sanad.type"
                      >
                      <label class="form-check-label" for="exampleRadios2">قطعی</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات سند</label>
              <textarea class="form-control" rows="5" v-model="sanad.explanation"></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>شماره - نام حساب</th>
                      <th>توضیحات</th>
                      <th>تفضیلی شناور</th>
                      <th>مرکز هزینه</th>
                      <th>بدهکار</th>
                      <th class="d-print-none">
                        <a @click.prevent="exchangeValue()" href>
                          <i class="fas fa-exchange-alt"></i>
                        </a>
                      </th>
                      <th>بستانکار</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(row,i) in rows"
                      :key="i"
                      :class="{'d-print-none': i == rows.length-1}"
                    >
                      <td>{{ i+1 }}</td>
                      <td v-tooltip="accountParentsName(row.account).join(' > ')">
                        <multiselect
                          dir="rtl"
                          :options="accountsSelectValues.levels[3]"
                          v-model="rows[i].account"
                          track-by="id"
                          label="title"
                        />
                      </td>
                      <td>
                        <input type="text" class="form-control" v-model="rows[i].explanation">
                      </td>
                      <td
                        v-tooltip="floatAccounts(rows[i]).length?row.account.floatAccountGroup.name:''"
                      >
                        <multiselect
                          dir="rtl"
                          :options="floatAccounts(rows[i])"
                          v-model="rows[i].floatAccount"
                          track-by="id"
                          label="name"
                        />
                      </td>
                      <td
                        v-tooltip="costCenters(rows[i]).length?row.account.costCenterGroup.name:''"
                      >
                        <multiselect
                          dir="rtl"
                          :options="costCenters(rows[i])"
                          v-model="rows[i].costCenter"
                          track-by="id"
                          label="name"
                        />
                      </td>
                      <td>
                        <money
                          :disabled="rows[i].bes != ''"
                          class="form-control"
                          v-model="rows[i].bed"
                        />
                      </td>
                      <td class="d-print-none">
                        <a @click.prevent="exchangeValue(rows[i])" href v-if="i != rows.length-1">
                          <i class="fas fa-exchange-alt"></i>
                        </a>
                      </td>
                      <td>
                        <money
                          :disabled="rows[i].bed != ''"
                          class="form-control"
                          v-model="rows[i].bes"
                        />
                      </td>
                      <td class="d-print-none">
                        <button
                          v-if="i != rows.length-1"
                          @click="deleteRow(i)"
                          type="button"
                          class="btn btn-warning"
                        >حذف ردیف</button>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr class="bg-info text-white">
                      <td colspan="2">
                        <span
                          v-if="bedSum != besSum"
                        >اختلاف: {{ Math.abs(bedSum - besSum) | toMoney }} {{ (bedSum > besSum)?'بستانکار':'بدهکار' }}</span>
                      </td>
                      <td colspan="2"></td>
                      <td class="text-left">مجموع:</td>
                      <td class>{{ bedSum | toMoney }}</td>
                      <td class="d-print-none"></td>
                      <td class>{{ besSum | toMoney }}</td>
                      <td class="d-print-none">
                        <button
                          @click="deleteRow(0)"
                          type="button"
                          class="btn btn-danger"
                        >حذف همه ردیف ها</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="row rtl d-print-none">
            <div class="col-12 col-md-6">
              <button
                @click="goToSanad('first')"
                :disabled="!hasFirstSanad"
                type="button"
                class="btn btn-info"
              >اولین سند</button>
              <button
                @click="goToSanad('prev')"
                :disabled="!hasPrevSanad"
                type="button"
                class="btn btn-info"
              >سند قبلی</button>
              <button
                @click="goToSanad('next')"
                :disabled="!hasNextSanad"
                type="button"
                class="btn btn-info"
              >سند بعدی</button>
              <button
                @click="goToSanad('last')"
                :disabled="!hasLastSanad"
                type="button"
                class="btn btn-info"
              >آخرین سند</button>
            </div>
            <div class="col-12 col-md-6 ltr text-left" dir="ltr">
              <button
                @click="validate(true)"
                type="button"
                class="btn submit btn-primary foat-left"
                :disabled="sanad.createType == 'auto'"
              >ثبت و صدور سند جدید</button>
              <button
                @click="validate(false)"
                type="button"
                class="btn submit btn-primary loat-left w-100px"
                :disabled="sanad.createType == 'auto'"
              >ثبت</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountApi";
import sanadApiMixin from "@/mixin/sanadApi";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Create",
  components: { money, date },
  mixins: [accountApiMixin, sanadApiMixin],
  props: ["id"],
  data() {
    return {
      sanad: {
        type: "temporary"
      },
      rows: [
        {
          bed: "",
          bes: ""
        }
      ],
      itemsToDelete: []
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  computed: {
    bedSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bed) sum += +r.bed;
      });
      return sum;
    },
    besSum() {
      let sum = 0;
      this.rows.forEach(r => {
        if (r.bes) sum += +r.bes;
      });
      return sum;
    },
    hasFirstSanad() {
      if (this.sanadCode == 1) return false;
      return true;
    },
    hasNextSanad() {
      if (this.sanad.code == this.sanadCode - 1) return false;
      if (!this.id) return false;
      return true;
    },
    hasPrevSanad() {
      if (this.sanad.code == 1) return false;
      return true;
    },
    hasLastSanad() {
      if (this.sanadCode == 1) return false;
      return true;
    }
  },
  watch: {
    rows: {
      handler() {
        let row = this.rows[this.rows.length - 1];
        if (row && row.account) {
          this.rows.push({
            bed: "",
            bes: ""
          });
        }
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.getAccounts();
      this.getCostCenterGroups();
      this.getSanadCode();

      if (this.id) this.getSanad(this.id);
    },
    goToSanad(pos) {
      let newCode = null;
      switch (pos) {
        case "next":
          newCode = this.sanad.code + 1;
          break;
        case "prev":
          newCode = this.sanad.code ? this.sanad.code - 1 : this.sanadCode - 1;
          break;
        case "first":
          newCode = 1;
          break;
        case "last":
          newCode = this.sanadCode - 1;
          break;
      }
      if (newCode) this.getSanadByCode(newCode);
    },
    selectSanad(sanad) {
      this.$router.push({
        name: "CreateSanad",
        params: { id: sanad.id }
      });
      this.sanad = sanad;
      this.itemsToDelete = [];
      this.rows = [];
      sanad.items.forEach(item => {
        let row = {
          ...item,
          bed: "",
          bes: ""
        };
        row[item.valueType] = item.value;
        this.rows.push(row);
      });
      this.rows.push({ bed: "", bes: "" });
      $("#sanad-selection-modal").modal("hide");
    },
    copySanadToNewSanad() {
      let rows = this.copy(this.rows);
      this.clearSanad();
      this.rows = [];
      for (const row of rows) {
        this.rows.push({
          ...row,
          id: null
        });
      }
    },
    deleteRow(index) {
      if (index == 0) {
        this.rows.forEach(row => {
          if (row.id) this.itemsToDelete.push(row.id);
        });
        this.rows.splice(0, this.rows.length - 1);
      } else {
        let row = this.rows[index];
        if (row.id) this.itemsToDelete.push(row.id);
        this.rows.splice(index, 1);
      }
    },
    validate(clearSanad = false) {
      if (this.sanad.id) this.updateSanad(clearSanad);
      else this.storeSanad(clearSanad);
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
    storeSanad(clearSanad) {
      let data = this.copy(this.sanad);
      data = this.extractIds(data);
      data.code = this.sanadCode;
      this.request({
        url: this.endpoint("sanads/sanads"),
        method: "post",
        data: data,
        success: data => {
          this.sanad = data;
          this.syncSanadItems(clearSanad);
        }
      });
    },
    updateSanad(clearSanad) {
      let data = this.copy(this.sanad);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      });
      this.request({
        url: this.endpoint("sanads/sanads/" + this.sanad.id),
        method: "put",
        data: data,
        success: data => {
          this.sanad = data;
          this.syncSanadItems(clearSanad);
        }
      });
    },
    syncSanadItems(clearSanad) {
      let updatedItems = [];
      let newItems = [];
      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;

        let item = this.copy(row);
        item = this.extractIds(item);

        if (row.bed) {
          item.value = row.bed;
          item.valueType = "bed";
        } else {
          item.value = row.bes;
          item.valueType = "bes";
        }
        if (item.id) {
          updatedItems.push(item);
        } else {
          item.sanad = this.sanad.id;
          newItems.push(item);
        }
      });
      Promise.all([
        this.storeSanadItems(newItems),
        this.updateSanadItems(updatedItems),
        this.deleteSanadItems()
      ]).then(data => {
        if (clearSanad) {
          this.clearSanad();
          this.$router.push({
            name: "CreateSanad"
          });
        } else {
          this.$router.push({
            name: "CreateSanad",
            params: { id: this.sanad.id }
          });
        }
        this.getSanadCode();
        this.successNotify();
      });
    },
    storeSanadItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("sanads/sanadItems/"),
        method: "post",
        data: items,
        success: data => {
          this.log(items.length + " sanad items created");
        }
      });
    },
    updateSanadItems(items) {
      if (!items.length) return;
      return this.request({
        url: this.endpoint("sanads/sanadItems/mass"),
        method: "put",
        data: items,
        success: data => {
          this.log(items.length + " sanad items updated");
        }
      });
    },
    deleteSanadItems() {
      if (!this.itemsToDelete.length) return;
      return this.request({
        url: this.endpoint("sanads/sanadItems/mass"),
        method: "delete",
        data: this.itemsToDelete,
        success: data => {
          this.log(this.itemsToDelete.length + " sanad items deleted");
          this.itemsToDelete = [];
        }
      });
    },
    floatAccounts(row) {
      if (row.account && row.account.floatAccountGroup) {
        return row.account.floatAccountGroup.floatAccounts;
      } else {
        return [];
      }
    },
    costCenters(row) {
      if (row.account && row.account.costCenterGroup) {
        return row.account.costCenterGroup.costCenters;
      } else {
        return [];
      }
    }
  }
};
</script>

<style scoped lang="scss">
.table-responsive {
  overflow: visible;
  th,
  td,
  input {
    text-align: center;
  }
}
</style>

