<template>
  <div class="rtl">
    <list-modal-form
      title="کاربر"
      :items="items"
      :cols="cols"
      :deletable="item.id"
      @rowClick="setItem"
      @clearForm="clearForm"
      @submit="submit"
      @delete="deleteItem"
      ref="listModelForm"
    >
      <template #default>
        <div class="row">
          <div class="form-group col-12">
            <v-text-field label="نام" v-model="item.first_name" />
          </div>
          <div class="form-group col-12">
            <v-text-field label="نام خانوادگی" v-model="item.last_name" />
          </div>
          <div class="form-group col-12">
            <label></label>
            <v-text-field label="نام کاربری" v-model="item.username" />
          </div>
          <div class="form-group col-12" v-if="!item.id">
            <v-text-field label="کلمه عبور" v-model="item.password" />
          </div>

          <div class="form-group col-12">
            <v-autocomplete
              label="نقش ها"
              :items="roles"
              v-model="item.roles"
              item-text="name"
              multiple
            ></v-autocomplete>
          </div>
        </div>
      </template>
      <template #actions>
        <v-btn
          v-if="item.id"
          @click=" showChangePasswordDialog = true "
          class="blue white--text"
        >تغیر کلمه عبور</v-btn>
      </template>
    </list-modal-form>

    <v-dialog v-model="showChangePasswordDialog" max-width="500px">
      <v-card>
        <v-card-title>تغیر کلمه عبور</v-card-title>
        <v-card-text>
          <v-text-field label="کلمه عبور جدید" v-model="newPassword" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="changePassword"  class="w-100px green white--text">ثبت</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import ListModalFormMixin from "@/components/mcomponents/form/ListModalForm.js";
import getRolesApi from "../role/getRolesApi";

export default {
  mixins: [ListModalFormMixin, getRolesApi],
  props: {},
  data() {
    return {
      baseUrl: "users/list",
      items: [],
      roles: [],
      newPassword: "",
      showChangePasswordDialog: false,
      itemTemplate: {
        roles: []
      },
      cols: [
        {
          th: "نام",
          td: "first_name",
          type: "text",
          filters: ["first_name__icontains"]
        },
        {
          th: "نام خانوادگی",
          td: "last_name",
          type: "text",
          filters: ["last_name__icontains"]
        },
        {
          th: "نام کاربری",
          td: "username",
          type: "text",
          filters: ["username__icontains"]
        }
      ]
    };
  },
  computed: {
    createUrl() {
      return "users/create";
    },
    updateUrl() {
      return this.item.id && `users/update/${this.item.id}`;
    },
    deleteUrl() {
      return this.item.id && `users/delete/${this.item.id}`;
    }
  },
  methods: {
    getData() {
      this.getUsers();
      this.getRoles(this.setRoles);
    },
    getUsers() {
      this.request({
        url: this.endpoint(`users/list`),
        method: "get",
        success: data => {
          this.items = data;
        }
      });
    },
    setRoles(data) {
      this.roles = data;
    },
    changePassword() {
      this.request({
        url: this.endpoint(`users/changePassword`),
        method: "post",
        data: {
          user: this.item.id,
          password: this.newPassword
        },
        success: data => {
          this.newPassword = "";
          this.successNotify();
          this.showChangePasswordDialog = false;
        }
      });
    },
    getSerialized() {
      let user = { ...this.item };
      user.roles = this.item.roles.map(o => o.id);
      return user;
    }
  }
};
</script>