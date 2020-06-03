<template>
  <daily-form
    formName="دسته چک"
    title="دسته چک"
    :ListRouteParams="{form: 'chequebook'}"
    @clearForm="clearChequebook(true)"
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
  >
    <template #header-btns>
      <v-btn
        v-if="id"
        class="blue white--text mr-1"
        :to="{name: 'List', params: {form: 'cheque'}, query: {filters: JSON.stringify({chequebook__id: id})}}"
      >مشاهده چک ها</v-btn>
    </template>
    <template #inputs>
      <v-row>
        <v-col cols="12" md="2">
          <v-text-field label="سری دسته چک" disabled v-model="chequebook.code" />
        </v-col>
        <v-col cols="12" md="10">
          <account-select
            items-type="banks"
            label="حساب بانک"
            v-model="chequebook.account"
            :disabled="!editable"
            :floatAccount="chequebook.floatAccount"
            @update:floatAccount="v => chequebook.floatAccount = v"
            :costCenter="chequebook.costCenter"
            @update:costCenter="v => chequebook.costCenter = v"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            label="از شماره سریال"
            type="number"
            v-model="chequebook.serial_from"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field
            type="number"
            label="تا شماره سریال"
            v-model="chequebook.serial_to"
            :disabled="!editable"
          />
        </v-col>
        <v-col cols="12" md="8">
          <v-textarea label="توضیحات" v-model="chequebook.explanation" :disabled="!editable"></v-textarea>
        </v-col>
      </v-row>
    </template>
  </daily-form>
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

