<template>
  <v-card>
    <v-card-title>
      {{ title }}
      <v-spacer></v-spacer>
      <v-btn
          :block="isXs"
          small
          depressed
          @click="reorderSanads('date')"
          class="rounded-lg accent white--text mr-md-1"
      >مرتب کردن کد اسناد بر اساس تاریخ
      </v-btn
      >
      <v-btn
          :block="isXs"
          small
          depressed
          @click="reorderSanads('local_id')"
          class="rounded-lg accent white--text mr-md-1 mt-1 mt-md-0"
      >مرتب کردن کد اسناد بر اساس عطف
      </v-btn>
      <v-btn
          :block="isXs"
          small
          depressed
          @click="reorderSanads(null)"
          class="rounded-lg accent white--text mr-md-1 mt-1 mt-md-0"
      >بازگردانی کد اسناد به حالت اولیه
      </v-btn>
      <div @mouseenter="list_export">
        <v-btn depressed @click="$refs.datatable.exportTo('html')" class="rounded-lg export-btn mr-3 block">چاپ لیست اسناد</v-btn>
        <v-btn depressed @click="$refs.datatable.exportTo('pdf')" class="rounded-lg export-btn mt-2 mt-sm-0 mr-md-1">خروجی PDF لیست اسناد
        </v-btn>
        <v-btn depressed @click="$refs.datatable.exportTo('xlsx')" class="rounded-lg export-btn mt-2 ml-4 mt-sm-0 mr-md-1">خروجی اکسل لیست
          اسناد
        </v-btn>
      </div>
    </v-card-title>

    <v-card-text>
      <div @mouseenter="normal_view">
        <m-datatable
            :headers="headers"
            :apiUrl="url"
            :filters.sync="filters"
            @dblclick:row="(e, row) => $router.push(to(row.item))"
            ref="datatable"
        >
          <template #item.detail="{ item }">
            <detail-link :to="to(item)"/>
          </template>
        </m-datatable>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {jsPDF} from "jspdf";
import XLSX from "xlsx";

export default {
  name: "SanadsList",
  props: {

    type: {
      default: "all",
    },
  },
  data() {
    return {
      filters: {},
    };
  },
  computed: {
    url() {
      this.filters = {};
      switch (this.type) {
        case "all":
          return "reports/lists/sanads";
        case "unbalanced":
          return "reports/lists/sanads/unbalanced";
        case "empty":
          return "reports/lists/sanads/empty";
        case "notDefined":
          this.filters = {is_defined: false};
          return "reports/lists/sanads";
      }
    },
    title() {
      switch (this.type) {
        case "all":
          return "لیست اسناد";
        case "unbalanced":
          return "لیست اسناد نامتوازن";
        case "empty":
          return "لیست اسناد خالی";
        case "notDefined":
          return "لیست اسناد غیر قطعی";
      }
    },
    headers() {
      let headers = [
        {
          text: "عطف",
          value: "local_id",
        },
        {
          text: "شماره",
          value: "code",
        },
        {
          text: "بدهکار",
          value: "bed",
        },
        {
          text: "بستانکار",
          value: "bes",
        },
        {
          text: "تاریخ",
          value: "date",
        },
        {
          text: "سیستمی",
          value: "is_auto_created",
          type: "boolean",
        },
        {
          text: "قطعی",
          value: "is_defined",
          type: "boolean",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
        {
          text: "کاربر",
          value: "created_by.name",
        },
      ];

      headers.push({
        text: "جزئیات",
        value: "detail",
        sortable: false,
        filterable: false,
      });

      return headers;
    },
  },
  methods: {
    list_export() {
      this.$refs.datatable.$data.list_view = true
    },
    normal_view() {
      this.$refs.datatable.$data.list_view = false
    },

    cl(e, row) {
      console.log(this.to(row.item));
    },
    to(item) {
      return {
        name: "SanadForm",
        params: {
          id: item.id,
        },
      };
    },
    confirm() {
      if (
          confirm(
              "با انجام این عملیات کد اسناد تغییر میکنند. میخواهید ادامه دهید؟"
          )
      ) {
        if (confirm("از انجام این عملیات اطمینان دارید؟")) {
          return true;
        }
      }
      return false;
    },
    reorderSanads(order) {
      if (!this.confirm()) {
        return;
      }
      this.request({
        url: this.endpoint("sanads/reorder"),
        method: "post",
        data: {
          order: order,
        },
        success: (data) => {
          this.successNotify();
          this.$refs.datatable.getDataFromApi();
        },
      });
    },
  },

};
</script>

<style scoped lang="scss"></style>
