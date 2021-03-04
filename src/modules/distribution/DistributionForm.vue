<template>
  <m-form
    title="تحویل فاکتور ها جهت توزیع"
    :showList="false"
    :listRoute="{name:'DistributionsList'}"
    exportBaseUrl="reports/lists/distributions"
    :exportParams="{id: this.id}"
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
        <v-col cols="12" md="2">
          <v-text-field disabled label="عطف" v-model="item.local_id" background-color="white" />
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field disabled label="شماره" v-model="item.code" background-color="white" />
        </v-col>
        <v-col cols="12" md="2">
          <date v-model="item.date" label=" * تاریخ " :default="true" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="2">
          <mtime label=" * ساعت" v-model="item.time" :default="true" :disabled="!isEditing" />
        </v-col>

        <v-col cols="12" md="4">
          <v-autocomplete
            label="* ماشین"
            :items="cars"
            v-model="item.car"
            item-text="car_number"
            item-value="id"
            :disabled="!isEditing"
          />
        </v-col>

        <v-col cols="12" md="8">
          <v-textarea label="توضیحات" v-model="item.explanation" :disabled="!isEditing"></v-textarea>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            v-if="item.created_by"
            label="کاربر"
            disabled
            v-model="item.created_by.name"
          />
        </v-col>

        <template v-if="isEditing">
          <v-col cols="12">
            <path-select :pathIn.sync="filters.path__in" />
          </v-col>
          <v-col cols="12">
            <m-datatable
              :headers="headers"
              :filters.sync="filters"
              v-model="factors"
              :showExportBtns="false"
              apiUrl="reports/lists/factors"
              ref="datatable"
            ></m-datatable>
          </v-col>
        </template>

        <v-col cols="12" v-else>
          <m-datatable
            :headers="headers"
            :filters.sync="filters"
            v-model="factors"
            :showExportBtns="false"
            :items="item.factors"
            ref="datatable"
          ></m-datatable>
        </v-col>
      </v-row>
    </template>
  </m-form>
</template>

<script>
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import mtime from "@/components/mcomponents/cleave/Time";
import FormsMixin from "@/mixin/forms";
import PathSelect from "@/modules/distribution/PathSelect";

export default {
  name: "DistributionForm",
  mixins: [MFormMixin, DistributionApiMixin, FormsMixin],
  components: { mtime, PathSelect },
  props: {
    id: {},
  },
  data() {
    return {
      baseUrl: "distributions/distributions",
      permissionBasename: "distributions",
      appendSlash: true,
      hasList: false,
      hasIdProp: true,
      filters: {
        type: "sale",
        is_definite: true,
      },
      factors: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "تاریخ",
          value: "date",
          type: "date",
        },
        {
          text: "خریدار",
          value: "account.name",
        },
        {
          text: "شرح",
          value: "explanation",
        },
        {
          text: "مبلغ کل فاکتور",
          value: "total_sum",
          type: "numeric",
        },
        {
          text: "ویزیتور",
          value: "visitor",
          items: this.visitors
            .filter((o) => o.level == 3)
            .map((o) => {
              return { text: o.user.name, value: o.id };
            }),
          itemText: "user.name",
          itemValue: "id",
        },
      ];
    },
  },
  methods: {
    getItemTemplate() {
      return {
        factors: [],
      };
    },
    getItemByPosition(position) {
      return this.request({
        url: this.endpoint(`${this.baseUrl}/byPosition`),
        method: "get",
        params: {
          id: this.item.id,
          position: position,
        },
        success: (data) => {
          this.setItem(data);
        },
      });
    },
    getData() {
      this.getCars();
      this.getVisitors();
    },
    setItem(item) {
      this.item = item;
      this.changeRouteTo(item.id);
      this.factors = this.copy(item.factors);
    },
    getSerialized() {
      let item = this.extractIds(this.item);
      item.factors = this.factors.map((o) => o.id);
      return item;
    },
  },
};
</script>

<style scoped lang="scss"></style>

