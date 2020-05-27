<template>
  <div class="rtl">
    <list-modal-form
      title="سال مالی"
      :items="items"
      :cols="cols"
      :deletable="item.id"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
      ref="listModelForm"
    >
      <template #header-buttons>
        <v-btn
          v-if="item.id"
          @click="activeFinancialYear"
          class="blue white--text mr-1"
        >فعال کردن سال مالی</v-btn>
      </template>
      <template #default>
        <v-row>
          <v-col cols="12">
            <v-text-field label="نام" v-model="item.name" />
          </v-col>
          <v-col cols="12" md="6">
            <date label="شروع" v-model="item.start" />
          </v-col>
          <v-col cols="12" md="6">
            <date label="پایان" v-model="item.end" />
          </v-col>
          <v-col cols="12">
            <v-textarea label="توضیحات" v-model="item.explanation" />
          </v-col>
        </v-row>
      </template>
    </list-modal-form>
  </div>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import GetUserApi from "@/views/panel/user/getUserApi.js";

export default {
  mixins: [ListModalFormMixin, GetUserApi],
  props: {},
  data() {
    return {
      baseUrl: "companies/financialYears",
      items: [],
      cols: [
        {
          th: "نام",
          td: "name",
          type: "text",
          filters: ["name__icontains"]
        },
        {
          th: "شروع",
          td: "start",
          type: "text",
          filters: ["start__icontains"]
        },
        {
          th: "پایان",
          td: "end",
          type: "text",
          filters: ["end__icontains"]
        }
      ]
    };
  },
  computed: {
    createUrl() {
      return `${this.baseUrl}/`;
    },
    updateUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}/`;
    },
    deleteUrl() {
      return this.item.id && `${this.baseUrl}/${this.item.id}/`;
    }
  },
  methods: {
    getData() {
      this.getUser();
    },
    getSerialized() {
      this.item.company = this.company.id;
      return this.item;
    },
    activeFinancialYear() {
      this.request({
        url: this.endpoint("users/setActiveFinancialYear"),
        method: "post",
        data: {
          financial_year: this.item.id
        },
        success: data => {
          this.successNotify();
          this.$store.commit("setUser", data);
          $("#financial-years").modal("hide");
        }
      });
    }
  },
  watch: {
    company() {
      this.items = this.company.financial_years;
    }
  }
};
</script>