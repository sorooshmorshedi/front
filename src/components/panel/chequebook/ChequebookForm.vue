<template>
  <div class="row rtl">
    <div class="col-12">
      <div class="card right">
        <div class="card-body" @keyup.enter="validate(true)">
          <form-header
            formName="دسته چک"
            title="دسته چک"
            :ListRouteParams="{form: 'chequebook'}"
            @clearForm="clearChequebook(true)"
          >
            <router-link
              v-if="id"
              class="btn btn-info"
              :to="{name: 'List', params: {form: 'cheque'}, query: {filters: JSON.stringify({chequebook__id: id})}}"
            >مشاهده چک ها</router-link>
          </form-header>

          <div class="row">
            <div class="form-group col-12 col-md-3">
              <label for>سری دسته چک</label>
              <input
                v-if="chequebook.id"
                type="text"
                class="form-control"
                disabled
                v-model="chequebook.code"
              >
              <input v-else type="text" class="form-control" disabled>
            </div>
            <div class="form-group col-12 col-md-9">
              <label for>حساب بانک</label>
              <multiselect
                :disabled="!editable"
                dir="rtl"
                label="name"
                track-by="id"
                :options="accountsSelectValues.banks"
                v-model="chequebook.account"
              />
            </div>
            <div
              class="form-group col-12 col-md-9 offset-md-3"
              v-if="chequebook.account && chequebook.account.floatAccountGroup"
            >
              <label for>حساب شناور</label>
              <multiselect
                :disabled="!editable"
                dir="rtl"
                label="name"
                track-by="id"
                :options="chequebook.account.floatAccountGroup.floatAccounts"
                v-model="chequebook.floatAccount"
              />
            </div>
            <div
              class="form-group col-12 col-md-9 offset-md-3"
              v-if="chequebook.account && chequebook.account.costCenterGroup"
            >
              <label for>مرکز هزینه</label>
              <multiselect
                :disabled="!editable"
                dir="rtl"
                label="name"
                track-by="id"
                :options="chequebook.account.costCenterGroup.floatAccounts"
                v-model="chequebook.costCenter"
              />
            </div>
            <div class="form-group col-12">
              <label for>از شماره سریال</label>
              <input
                type="number"
                class="form-control"
                v-model="chequebook.serial_from"
                :disabled="!editable"
              >
            </div>
            <div class="form-group col-12">
              <label for>تا شماره سریال</label>
              <input
                type="number"
                class="form-control"
                v-model="chequebook.serial_to"
                :disabled="!editable"
              >
            </div>
            <div class="form-group col-12">
              <label>توضیحات</label>
              <textarea
                class="form-control"
                rows="3"
                v-model="chequebook.explanation"
                :disabled="!editable"
              ></textarea>
            </div>
          </div>

          <hr>

          <form-footer
            formName="دسته چک"
            :hasFirst="true"
            :hasLast="true"
            :hasPrev="true"
            :hasNext="true"
            :editable="editable"
            :deletable="this.id"
            :canDelete="true"
            :canSubmit="true"
            @edit="makeFormEditable()"
            @goToForm="getChequebookByPosition"
            @validate="validate"
            @delete="deleteChequebook"
          ></form-footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import accountApiMixin from "@/mixin/accountMixin";
import money from "@/components/mcomponents/cleave/Money";
import date from "@/components/mcomponents/cleave/Date";

import formsMixin from "@/mixin/forms";
export default {
  name: "ChequebookForm",
  props: {
    id: {
      default: null
    }
  },
  components: { money, date },
  mixins: [accountApiMixin, formsMixin],
  data() {
    return {
      chequebook: {},
      editable: false
    };
  },
  computed: {
    canDeleteChequebook() {
      return false;
    },

    canEditCheque() {
      return false;
    }
  },
  created() {
    this.getAccounts();
    if (this.id) {
      this.getChequebook(this.id);
    }
  },
  methods: {
    makeFormEditable() {
      this.editable = true;
    },
    validate() {
      if (this.id) this.updateChequebook();
      else this.storeChequebook();
    },
    clearChequebook() {
      this.$router.push({
        name: "ChequebookForm"
      });
      this.chequebook = {};
    },
    getChequebookByPosition(pos) {
      return this.request({
        url: this.endpoint("cheques/getChequebookByPosition"),
        method: "get",
        params: {
          id: this.id,
          position: pos
        },
        success: data => {
          this.setChequebook(data);
        },
        error: error => {
          if (error.response.status == 404) {
            this.notify("دسته چک وجود ندارد", "warning");
          }
        }
      });
    },
    setChequebook(chequebook) {
      this.$router.push({
        name: "ChequebookForm",
        params: {
          id: chequebook.id
        }
      });
      this.chequebook = chequebook;
    },
    getChequebook(id) {
      return this.request({
        url: this.endpoint(`cheques/chequebooks/${id}/`),
        method: "get",
        success: data => {
          this.setChequebook(data);
        }
      });
    },
    storeChequebook() {
      let data = this.copy(this.chequebook);
      data = this.extractIds(data);
      this.request({
        url: this.endpoint("cheques/chequebooks/"),
        method: "post",
        data: data,
        success: data => {
          this.setChequebook(data);
          this.editable = false;
          this.notify("دسته چک با موفقیت ساخته شد", "success");
        }
      });
    },
    updateChequebook() {
      let data = this.copy(this.chequebook);
      Object.keys(data).forEach(key => {
        if (data[key] && data[key].id) data[key] = data[key].id;
      });
      this.request({
        url: this.endpoint("cheques/chequebooks/" + data.id + "/"),
        method: "put",
        data: data,
        success: data => {
          this.editable = false;
          this.notify("دسته چک با موفقیت ویرایش شد", "success");
        }
      });
    },
    deleteChequebook() {
      this.request({
        url: this.endpoint("cheques/chequebooks/" + this.id + "/"),
        method: "delete",
        success: data => {
          this.$router.push({
            name: "List",
            params: {
              form: "chequebook"
            }
          });
          this.notify("دسته چک با موفقیت حذف شد", "success");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>

