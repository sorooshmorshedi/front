<template>
  <div>
    <m-form
      ref="form"
      :title="title"
      :cols="cols"
      :is-editing.sync="isEditing"
      :showListBtn="false"
      :show-navigation-btns="false"
      :api-url="baseUrl + '/'"
      :serverProcessing="serverProcessing"
      @click:row="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
    >
      <template #default>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="* عنوان"
              v-model="item.title"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              label="* توضیحات"
              v-model="item.explanation"
              :disabled="!isEditing"
            />
          </v-col>
          <v-col cols="12" v-if="!isReminder">
            <v-autocomplete
              label="* دریافت کننده ها"
              v-model="item.receivers"
              :items="users"
              item-text="name"
              item-value="id"
              :disabled="!isEditing"
              :multiple="true"
            />
          </v-col>
          <v-col cols="12" v-if="!isReminder">
            <v-switch
              label="ارسال زماندار"
              v-model="item.has_schedule"
              :disabled="!isEditing"
            ></v-switch>
          </v-col>

          <template v-if="item.has_schedule || isReminder">
            <v-col cols="6">
              <date
                label=" * تاریخ"
                required
                v-model="item.send_date"
                :default="true"
                :disabled="!isEditing"
              />
            </v-col>
            <v-col cols="6">
              <mtime
                label=" * ساعت"
                required
                v-model="item.send_time"
                :default="true"
                :disabled="!isEditing"
              />
            </v-col>
          </template>

          <v-col cols="12" v-if="!isReminder">
            <v-switch
              label="نمایش pop-up"
              v-model="item.show_pop_up"
              :disabled="!isEditing"
            ></v-switch>
          </v-col>
        </v-row>
      </template>

      <template #item.detail="{ item }">
        <v-btn
          color="light-blue whtie--text"
          icon
          @click="openReceiversDialog(item)"
        >
          <v-icon>fa fa-users</v-icon>
        </v-btn>
      </template>
    </m-form>

    <v-dialog v-model="receiversDialog" scrollable max-width="500px">
      <v-card>
        <m-datatable
          v-if="item"
          :filters.sync="receiversDatatableFilters"
          :showExportBtns="false"
          :showSelect="false"
          :showAppliedFilters="false"
          :headers="receiversDatatableHeaders"
          :items="item.userNotifications"
        ></m-datatable>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { MFormMixin } from "@/components/m-form";
import UserApiMixin from "@/views/panel/user/api";
import mtime from "@/components/mcomponents/cleave/Time";

export default {
  name: "NotificationForm",
  mixins: [MFormMixin, UserApiMixin],
  components: { mtime },
  props: {
    type: {
      // `reminder` or `send`
      required: true,
    },
  },
  data() {
    return {
      item: {},
      appendSlash: true,
      permissionBasename: "",
      serverProcessing: true,

      receiversDialog: false,
      receiversDatatableFilters: {},
      receiversDatatableHeaders: [
        {
          text: "کاربر",
          value: "user",
        },
        {
          text: "وضعیت",
          value: "status",
          type: "select",
          items: [
            {
              text: "خوانده شده",
              value: "خوانده شده",
            },
            {
              text: "خوانده نشده",
              value: "خوانده نشده",
            },
          ],
        },
      ],
    };
  },
  computed: {
    title() {
      if (this.isReminder) {
        return "یاداور";
      } else {
        return "ارسال اعلان";
      }
    },
    isReminder() {
      return this.type == "reminder";
    },
    baseUrl() {
      if (this.isReminder) return "users/reminderNotification";
      else return "users/sendNotification";
    },
    cols() {
      let cols = [
        {
          text: "عنوان",
          value: "title",
        },
        {
          text: "توضیحات",
          value: "explanation",
        },
      ];
      if (this.isReminder) {
        cols.push(
          {
            text: "تاریخ",
            value: "send_date",
            type: "date",
          },
          {
            text: "ساعت",
            value: "send_time",
          }
        );
      } else {
        cols.push(
          {
            text: "تاریخ",
            value: "created_at",
            type: "date",
          },
          {
            text: "وضعیت",
            value: "detail",
            sortable: false,
            filterable: false,
          }
        );
      }
      return cols;
    },
  },
  methods: {
    getData() {
      this.getUsers();
    },
    openReceiversDialog(item) {
      this.receiversDialog = true;
    },
  },
};
</script>
