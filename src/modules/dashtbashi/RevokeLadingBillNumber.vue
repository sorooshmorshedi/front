<template>
  <v-card>
    <v-card-title>ابطال شماره بارنامه</v-card-title>

    <v-card-text>
      <m-datatable
        api-url="dashtbashi/ladingBillNumbers"
        :headers="headers"
        :filters.sync="filters"
      >
        <template #item.detail="{ item }">
          <v-btn
            @click="revokeLadingBillNumber(item, null)"
            v-if="item.is_revoked"
            color="red white--text"
          >لغو ابطال</v-btn>
          <v-btn @click="openRevokeDialog(item)" v-else color="blue white--text">ابطال</v-btn>
        </template>
      </m-datatable>
    </v-card-text>

    <v-dialog v-model="dialog" max-width="500px" transition="dialog-transition" v-if="item">
      <v-card>
        <v-card-title>
          ابطال شماره بارنامه
          {{ item.number }}
          از سری بارنامه
          {{ item.series?item.series.serial:'' }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12">
              <date v-model="date" :default="true" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="revokeLadingBillNumber(item, date)" color="blue white--text">ابطال</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import GetApi from "./GetApi";
import { MFormMixin } from "@bit/mmd-mostafaee.vue.m-form";

export default {
  mixins: [GetApi, MFormMixin],
  data() {
    return {
      filters: {
        not_used: true,
      },
      item: null,
      date: null,
      dialog: false,
    };
  },
  computed: {
    headers() {
      return [
        {
          text: "سری بارنامه",
          value: "series.serial",
        },
        {
          text: "شماره بارنامه",
          value: "number",
        },
        {
          text: "ابطال شده",
          value: "is_revoked",
          type: "boolean",
        },
        {
          text: "تاریخ ابطال",
          value: "revoked_at",
        },
        {
          text: "",
          value: "detail",
          filterable: false,
          sortable: false,
        },
      ];
    },
  },
  methods: {
    openRevokeDialog(item) {
      this.item = item;
      this.dialog = true;
    },
    revokeLadingBillNumber(item, date) {
      this.request({
        url: this.endpoint("dashtbashi/ladingBillNumbers/revoke"),
        method: "post",
        data: {
          id: item.id,
          is_revoked: !item.is_revoked,
          date: date,
        },
        success: (data) => {
          this.successNotify();
          item.is_revoked = !item.is_revoked;
          item.revoked_at = date;
          this.dialog = false;
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>

