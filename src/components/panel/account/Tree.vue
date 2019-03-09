<template>
  <div class="row rtl">
    <div class="col-12">
      <datatable :cols="datatableOptions.cols" :data="treeAccounts" @rowContextMenu="contextMenu"/>
    </div>

    <div class="modal" id="account-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">مشخصات حساب</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <vue-form-generator
              tag="div"
              :schema="(account.id)?editSchema[account.level]:createSchema[account.level]"
              :model="account"
            />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">انصراف</button>
            <button
              v-if="account.id"
              @click="updateAccount()"
              type="button"
              class="btn btn-primary"
            >ثبت</button>
            <button v-else @click="storeAccount()" type="button" class="btn btn-primary">ثبت</button>
          </div>
        </div>
      </div>
    </div>

    <vue-context ref="menu" class="context-menu">
      <ul slot-scope="child" v-if="child.data">
        <li @click="editAccount(child.data.account)">
          <i class="fas fa-pencil-alt text-warning"/>
          <span>ویرایش حساب</span>
        </li>
        <li @click="createAccount(child.data.account)" v-if="child.data.account != 3">
          <i class="fas fa-plus text-success"/>
          <span>افزودن حساب فرزند</span>
        </li>
        <li @click="deleteAccount(child.data.account)">
          <i class="fas fa-trash-alt text-danger"/>
          <span>حذف حساب</span>
        </li>
        <li @click="openLedger(child.data.account)">
          <i class="fas fa-book-open text-danger"/>
          دفتر این حساب
        </li>
      </ul>
    </vue-context>
  </div>
</template>

<script>
import accountMixin from "@/mixin/account";
import datatable from "@/components/mcomponents/datatable/Client";
import datatableOptions from "./TreeDatatableCols";

export default {
  mixins: [accountMixin],
  components: { datatable },
  data() {
    return {
      account: {},
      datatableOptions
    };
  },
  methods: {
    editAccount(node) {
      this.mode = "edit";
      this.account = node;
      this.modal("#account-modal", "show");
    },
    createAccount(node) {
      this.mode = "create";
      this.account = {};
      this.account.parent = node;
      this.account.level = node.level + 1;
      this.modal("#account-modal", "show");
    },
    contextMenu(e, item) {
      e.preventDefault();
      this.account = item;
      this.$refs.menu.open(e, { account: item });
    }
  },
  watch: {},
  computed: {
    treeAccounts() {
      let res = [];
      this.accountsSelectValues.all.forEach(o => {
        if (o) {
          o.classes = "level-" + o.level;
          res.push(o);
        }
      });
      return res;
    }
  }
};
</script>

<style lang="scss">
$pad: 30px;
.level-1 td:nth-child(4) {
  padding-right: $pad;
}
.level-2 td:nth-child(4) {
  padding-right: $pad * 2;
}
.level-3 td:nth-child(4) {
  padding-right: $pad * 3;
}
</style>