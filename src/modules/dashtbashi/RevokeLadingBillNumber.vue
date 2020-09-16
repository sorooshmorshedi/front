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
            color="blue white--text"
          >لغو ابطال</v-btn>
          <v-btn @click="openRevokeDialog(item)" v-else color="red white--text">ابطال</v-btn>
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
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import MDatatable from "@/components/mcomponents/datatable/MDatatable";

export default {
  mixins: [GetApi, ListModalFormMixin],
  components: { MDatatable },
  data() {
    return {
      filters: {},
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
          if (!item.is_revoked) item.revoked_at = null;
          this.dialog = false;
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
</style>

