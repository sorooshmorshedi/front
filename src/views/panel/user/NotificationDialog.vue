<template>
  <v-dialog
    :value="detailDialog"
    @click:outside="closeDetailDialog"
    max-width="600px"
    transition="dialog-transition"
  >
    <v-card v-if="item">
      <v-card-title class="grey lighten-3">
        {{ item.title }}
        <v-spacer></v-spacer>
        <span dir="ltr" class="font-weight-light subtitle-1">{{ item.created_at }}</span>
      </v-card-title>

      <v-card-text class="py-3">
        <p> <pre v-html="item.explanation"/> </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="changeStatus(item, 'r')"
          color="blue white--text"
          class="w-100px"
          :disabled="item.status_codename == 'r'"
        >خوانده شد</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "NotificationDialog",
  props: {
    item: {
      required: true,
    },
    detailDialog: {},
  },
  data() {
    return {};
  },
  methods: {
    changeStatus(item, status_codename) {
      if (item.status_codename != status_codename) {
        this.request({
          url: this.endpoint("users/notifications/changeStatus"),
          method: "post",
          loading: false,
          data: {
            id: item.id,
            new_status: status_codename,
          },
          success: (data) => {
            let user = this.user;
            user.unread_notifications_count -= 1;
            this.$store.commit("setUser", user);

            this.closeDetailDialog();
            this.$emit("statusChanged");
          },
        });
      } else {
        this.closeDetailDialog();
      }
    },
    closeDetailDialog() {
      this.$emit("update:detailDialog", false);
    },
  },
};
</script>

<style lang="scss">
pre {
  font-family: IRANSans !important;
  font-weight: normal;
}
</style>