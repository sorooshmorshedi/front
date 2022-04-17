<template>
  <span v-if="user && systemOptions">
    <router-view />

    <notification-dialog
      v-if="userPopUps.length != 0"
      :detailDialog="notificationDialog"
      @update:detailDialog="showNextNotification"
      :item="notification"
    />
  </span>
</template>

<script>
import GetUserApi from "@/views/panel/user/getUserApi.js";
import GetOptionsApi from "@/views/panel/options/getOptionsApi.js";
import NotificationDialog from "@/views/panel/user/NotificationDialog.vue";
export default {
  name: "Panel",
  mixins: [GetUserApi, GetOptionsApi],
  components: { NotificationDialog },
  data() {
    return {
      notificationDialog: false,
      notification: null,
      notificationIndex: -1,
    };
  },
  created() {
    this.getUser(() => {
      this.showNextNotification();
    });
    this.getOptions();
  },
  methods: {
    showNextNotification() {
      this.notificationDialog = false;
      if (
        this.userPopUps.length &&
        this.userPopUps.length > this.notificationIndex + 1
      ) {
        if (!this.notification) {
          this.notification = this.userPopUps[0];
          this.notificationIndex = 0;
          this.notificationDialog = true;
        } else {
          setTimeout(() => {
            this.notificationIndex += 1;
            this.notification = this.userPopUps[this.notificationIndex];
            this.notificationDialog = true;
          }, 500);
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
</style>
