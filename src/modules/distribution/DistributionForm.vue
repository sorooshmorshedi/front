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
    @goToForm="getItemByPosition"
    @submit="submit"
    @delete="deleteItem"
    @clearForm="clearForm()"
  >
    <template #header-btns>
      <v-btn
        color="blue white--text"
        class="mr-1 "
        :to="{name:'DistributionRemittance', params: {id: id}}"
      >حواله توزیع</v-btn>
    </template>

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

        <v-col cols="12" v-if="id">
          <v-card-subtitle
            v-if="isEditing"
          >فاکتور های فعلی (برای حذف فاکتور آن را از انتخاب خارج کنید)</v-card-subtitle>
          <m-datatable
            :headers="selectedFactorsHeaders"
            :filters.sync="filters"
            v-model="factors"
            :showExportBtns="false"
            :items="item.factors"
            ref="datatable"
          >
            <template #item.payable_value="{ item }">{{ getFactorPayableValue(item) | toMoney }}</template>

            <template #item.operations="{ item }">
              <div class="pa-1">
                <v-btn
                  x-small
                  depressed
                  color="green white--text"
                  block
                  :to="getFactorTransactionLink(item).to"
                >ثبت دریافت</v-btn>

                <v-btn
                  depressed
                  block
                  color="orange white--text"
                  class="mt-1"
                  :to="getReverseFactorLink(item).to"
                >ثبت برگشت از فروش</v-btn>
              </div>
            </template>

            <template #item.status="{ item }">
              <v-btn
                :disabled="item.backFactor != null"
                block
                x-small
                depressed
                color="red white--text"
                class
              >مرجوع کامل</v-btn>
              <v-btn block x-small depressed color="blue white--text" class="mt-1">تحویل شد</v-btn>
            </template>
          </m-datatable>
        </v-col>

        <template v-if="isEditing">
          <v-col cols="12" v-if="id">
            <v-card-subtitle>فاکتور هایی که میخواهید اضافه کنید از لیست پایین انتخاب کنید</v-card-subtitle>
          </v-col>
          <v-col cols="12" class="py-1">
            <tree-select
              :levelsCount="5"
              :items="paths"
              :labels="PathLevels"
              :itemsIn.sync="filters.path__in"
              item-text="name"
            />
          </v-col>
          <v-col cols="12" class="py-1">
            <tree-select
              :levelsCount="4"
              :items="visitors"
              :labels="VisitorLevels"
              :itemsIn.sync="filters.visitor__in"
              item-text="user.name"
            />
          </v-col>
          <v-col cols="12" class="py-1">
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
      </v-row>
    </template>
  </m-form>
</template>

<script>
import { MFormMixin } from "@/components/m-form";
import DistributionApiMixin from "@/modules/distribution/api";
import mtime from "@/components/mcomponents/cleave/Time";
import FormsMixin from "@/mixin/forms";
import FactorMixin from "@/views/panel/factor/mixin";
import TreeSelect from "@/components/selects/TreeSelect";
import { PathLevels, VisitorLevels } from "@/variables";

export default {
  name: "DistributionForm",
  mixins: [MFormMixin, DistributionApiMixin, FormsMixin, FactorMixin],
  components: { mtime, TreeSelect },
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
        is_defined: true,
        is_loaded: false,
      },
      factors: [],
      factor: null,
      isFullDelivery: null,
      PathLevels,
      VisitorLevels,
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
          text: "مبلغ برگشتی",
          value: "backFactor.total_sum",
          type: "numeric",
        },
        {
          text: "مبلغ دریافت شده",
          value: "paidValue",
          type: "numeric",
        },
        {
          text: "مبلغ قابل دریافت",
          value: "payable_value",
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
    selectedFactorsHeaders() {
      return [
        ...this.headers,
        {
          text: "عملیات ها",
          value: "operations",
        },
        {
          text: "ثبت وضعیت",
          value: "status",
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
      this.getPaths();
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

