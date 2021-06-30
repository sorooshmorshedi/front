<template>
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
          <v-text-field label="* عنوان" v-model="item.title" :disabled="!isEditing" />
        </v-col>
        <v-col cols="12">
          <v-textarea label="* توضیحات" v-model="item.explanation" :disabled="!isEditing" />
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
          <v-switch label="ارسال زماندار" v-model="item.has_schedule" :disabled="!isEditing"></v-switch>
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
      </v-row>
    </template>
  </m-form>
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
        cols.push({
          text: "تاریخ",
          value: "created_at",
          type: "date",
        });
      }
      return cols;
    },
  },
  methods: {
    getData() {
      this.getUsers();
    },
  },
};
</script>