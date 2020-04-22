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
            <label class="required">نام</label>
            <input type="text" class="form-control" v-model="item.first_name" />
          </div>
          <div class="form-group col-12">
            <label class="required">نام خانوادگی</label>
            <input type="text" class="form-control" v-model="item.last_name" />
          </div>
          <div class="form-group col-12">
            <label>نام کاربری</label>
            <input type="text" class="form-control" v-model="item.username" />
          </div>
          <div class="form-group col-12" v-if="!item.id">
            <label>کلمه عبور</label>
            <input type="text" class="form-control" v-model="item.password" />
          </div>

          <div class="form-group col-12">
            <label>نقش ها</label>
            <multiselect
              dir="rtl"
              :options="roles"
              v-model="item.roles"
              track-by="id"
              label="name"
              :multiple="true"
            />
          </div>
        </div>
      </template>
      <template #actions>
        <button
          v-if="item.id"
          @click="modal('#change-password', 'show')"
          type="button"
          class="btn btn-info ml-1"
        >تغیر کلمه عبور</button>
      </template>
    </list-modal-form>

    <div class="modal fade" id="change-password">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">تغیر کلمه عبور</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group col-12">
              <label>کلمه عبور جدید</label>
              <input type="text" class="form-control" v-model="newPassword" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button @click="changePassword" type="button" class="btn btn-primary w-100px">ثبت</button>
          </div>
        </div>
      </div>
    </div>
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
          this.modal("#change-password", "hide");
        }
      });
    },
    getSerialized() {
      let user = { ...this.item }
      user.roles = this.item.roles.map(o => o.id);
      return user;
    }
  }
};
</script>