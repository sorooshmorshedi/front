<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body">
          <form-header
            title="سند حسابداری"
            formName="سند"
            :ListRouteParams="{form: 'sanad'}"
            :exportParams="{id: this.id}"
            @clearForm="clearSanad()"
          >
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
          </form-header>

          <div class="row">
            <div class="col-lg-6">
              <div class="row">
                <div class="form-group col-lg-6 col-sm-2">
                  <label class="required">شماره سند</label>
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
                  <label class="required">تاریخ سند</label>
                  <date
                    class="form-control"
                    v-model="sanad.date"
                    :default="true"
                    :disabled="!editable"
                  />
                </div>
                <div class="form-group col-lg-6 col-sm-4">
                  <label>صادر کننده سند</label>
                  <input type="text" class="form-control" disabled>
                </div>

                <div class="form-group col-lg-6 col-sm-4">
                  <label class="required">نوع سند</label>
                  <div style="margin-top: 8px;margin-right: 15px;">
                    <div class="form-check form-check-inline">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="exampleRadios"
                        id="exampleRadios1"
                        value="temporary"
                        v-model="sanad.type"
                        :disabled="!editable"
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
                        :disabled="!editable"
                      >
                      <label class="form-check-label" for="exampleRadios2">قطعی</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-lg-6">
              <label>توضیحات سند</label>
              <textarea
                class="form-control"
                rows="5"
                v-model="sanad.explanation"
                :disabled="!editable"
              ></textarea>
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <div class="table-responsive">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th class="required">شماره - نام حساب</th>
                      <th>توضیحات</th>
                      <th class="required">تفضیلی شناور</th>
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
                          :disabled="!editable"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control"
                          v-model="rows[i].explanation"
                          :disabled="!editable"
                        >
                      </td>
                      <td
                        v-tooltip="getFloatAccounts(rows[i]).length?row.account.floatAccountGroup.name:''"
                      >
                        <multiselect
                          v-if="getFloatAccounts(rows[i]).length"
                          dir="rtl"
                          :options="getFloatAccounts(rows[i])"
                          v-model="rows[i].floatAccount"
                          track-by="id"
                          label="name"
                          :disabled="!editable"
                        />
                        <span v-else>-</span>
                      </td>
                      <td
                        v-tooltip="getCostCenters(rows[i]).length?row.account.costCenterGroup.name:''"
                      >
                        <multiselect
                          v-if="getCostCenters(rows[i]).length"
                          dir="rtl"
                          :options="getCostCenters(rows[i])"
                          v-model="rows[i].costCenter"
                          track-by="id"
                          label="name"
                          :disabled="!editable"
                        />
                        <span v-else>-</span>
                      </td>
                      <td>
                        <money
                          :disabled="!editable || rows[i].bes != 0"
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
                          :disabled="!editable || rows[i].bed != 0"
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
                          :disabled="!editable"
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
                          @click="deleteRow(-1)"
                          type="button"
                          class="btn btn-danger"
                          :disabled="!editable"
                        >حذف همه ردیف ها</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <form-footer
            formName="سند"
            :hasFirst="hasFirst"
            :hasLast="hasLast"
            :hasPrev="hasPrev"
            :hasNext="hasNext"
            :canSubmit="canSubmit"
            :editable="editable"
            :deletable="deletable"
            @goToForm="goToForm"
            @validate="validate"
            @edit="makeFormEditable()"
            @delete="deleteSanad"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import sanadApiMixin from "@/mixin/sanadApi";
import formsMixin from "@/mixin/forms";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";
export default {
  name: "Form",
  components: { money, date },
  mixins: [formsMixin, accountApiMixin, sanadApiMixin],
  props: ["id"],
  data() {
    return {
      sanad: {
        type: "temporary"
      },
      rows: [
        {
          bed: 0,
          bes: 0
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
    hasFirst() {
      if (this.sanadCode == 1) return false;
      return true;
    },
    hasNext() {
      if (this.sanad.code == this.sanadCode - 1) return false;
      if (!this.id) return false;
      return true;
    },
    hasPrev() {
      if (this.sanad.code == 1) return false;
      return true;
    },
    hasLast() {
      if (this.sanadCode == 1) return false;
      return true;
    },
    deletable() {
      if (!this.id) return false;
      if (!this.hasNext) return true;
      return false;
    }
  },
  watch: {
    rows: {
      handler() {
        let row = this.rows[this.rows.length - 1];
        if (row && row.account) {
          this.rows.push({
            bed: 0,
            bes: 0
          });
        }
      },
      deep: true
    }
  },
  methods: {
    getData() {
      this.getAccounts();
      this.getSanadCode();

      if (this.id) this.getSanad(this.id);
    },
    canSubmit() {
      if (!this.sanad.createType) return true;
      return this.sanad.createType == "auto";
    },
    goToForm(pos) {
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
      this.makeFormUneditable();
      this.$router.push({
        name: "SanadForm",
        params: { id: sanad.id }
      });
      this.sanad = sanad;
      this.itemsToDelete = [];
      this.rows = [];
      sanad.items.forEach(item => {
        let row = { ...item };
        this.rows.push(row);
      });
      this.rows.push({ bed: 0, bes: 0 });
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
      if (index == -1) {
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
    getSerialized() {
      let data = {
        sanad: this.extractIds(this.sanad),
        items: {
          ids_to_delete: this.itemsToDelete,
          items: []
        }
      };

      this.rows.forEach((row, i) => {
        if (i == this.rows.length - 1) return;

        let item = this.copy(row);
        item = this.extractIds(item);

        data.items.items.push(item);
      });

      return data;
    },
    setSanad(sanad) {
      this.makeFormUneditable();
      this.$router.push({
        name: "SanadForm",
        params: { id: sanad.id }
      });
    },
    deleteSanad() {
      this.request({
        url: this.endpoint("sanads/sanads/" + this.sanad.id),
        method: "delete",
        success: data => {
          this.clearSanad();
          this.getSanadCode();
          this.successNotify();
        }
      });
    },
    storeSanad(clearSanad) {
      let data = this.getSerialized();
      this.request({
        url: this.endpoint("sanads/sanads"),
        method: "post",
        data: data,
        success: data => {
          if (clearSanad) {
            this.clearSanad();
          } else {
            this.setSanad(data);
          }
          this.getSanadCode();
          this.successNotify();
        }
      });
    },
    updateSanad(clearSanad) {
      let data = this.getSerialized();
      this.request({
        url: this.endpoint("sanads/sanads/" + this.sanad.id),
        method: "put",
        data: data,
        success: data => {
          if (clearSanad) {
            this.clearSanad();
          } else {
            this.setSanad(data);
          }
          this.getSanadCode();
          this.successNotify();
        }
      });
    },
    getFloatAccounts(row) {
      if (row.account && row.account.floatAccountGroup) {
        return row.account.floatAccountGroup.floatAccounts;
      } else {
        return [];
      }
    },
    getCostCenters(row) {
      if (row.account && row.account.costCenterGroup) {
        return row.account.costCenterGroup.floatAccounts;
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

