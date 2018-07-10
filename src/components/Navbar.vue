<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top rtl">
    <a class="navbar-brand " href="#">سبحان حساب</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse " id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">خانه
            <span class="sr-only">(current)</span>
          </a>
        </li>
        <li class="nav-item dropdown">

          <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#">اطلاعات پایه</a>
          <div class="dropdown-menu dropdown-menu-right " aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" :to="{name:'UpdateCompany', params:{id: 1}}">مشخصات شرکت</router-link>
            <div class="dropdown-divider"></div>
            <div class="dropdown-submenu ">
              <a class="dropdown-item dropdown-toggle " data-toggle="dropdown" href="#">حساب</a>
              <div class="dropdown-menu " aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{name:'CreateAccount'}">تعریف حساب</router-link>
                <router-link class="dropdown-item" :to="{name:'EditAccount'}">ویرایش حساب</router-link>
                <router-link class="dropdown-item" :to="{name:'AccountTree'}">نمودار درختی حساب ها</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" :to="{name:'IndependentAccount'}">حساب مستقل</router-link>
              </div>
            </div>
            <div class="dropdown-divider"></div>
            <router-link class="dropdown-item" :to="{name:'CostCenter'}">مرکز هزینه</router-link>

          </div>

        </li>
        <li class="nav-item dropdown d-none">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li>
        <li class="nav-item d-none">
          <a class="nav-link disabled" href="#">Disabled</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped lang="scss">
nav {
  margin-bottom: 50px;
}

.dropdown-submenu {
  position: relative;
}

.dropdown-submenu > .dropdown-menu {
  top: 0;
  right: 100%;
  margin-top: -6px;
  margin-left: -1px;
  -webkit-border-radius: 6px 0px 6px 6px;
  -moz-border-radius: 6px 0px 6px 6px;
  border-radius: 6px 0px 6px 6px;
  width: auto;
}

.dropdown-submenu:hover > .dropdown-menu {
  display: block;
  min-width: 200px;
}

.dropdown-submenu > a:after {
  display: block;
  content: " ";
  float: left;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-width: 5px 5px 5px 0px;
  border-right-color: #c9c9c9;
  margin-top: 5px;
  margin-left: -10px;
}

.dropdown-submenu:hover > a:after {
  border-right-color: #fff;
}
</style>
