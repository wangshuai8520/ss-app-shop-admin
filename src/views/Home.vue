<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="6">
          <img src="../assets/logo.png" />
        </el-col>
        <el-col>
          <div class="title">品优购后台管理系统</div>
        </el-col>
        <el-col :span="6">
          <div class="logout">
            <span>欢迎光临</span>
            <a href @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-col>
          <el-menu
            :default-active="$router.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :router="true"
          >
            <el-submenu v-for="item in rightsList" :key="item.id" :index="item.id + '' ">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item
                v-for="children in item.children"
                :key="children.id"
                :index="'/'+children.path"
              >
                <i class="el-icon-menu"></i>
                {{children.authName}}
              </el-menu-item>
            </el-submenu>
            <!-- <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item index="/roles">
                <i class="el-icon-menu"></i>角色列表
              </el-menu-item>
              <el-menu-item index="/rights">
                <i class="el-icon-menu"></i>权限列表
              </el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="1-4-1">
                <i class="el-icon-menu"></i>商品列表
              </el-menu-item>
              <el-menu-item index="1-4-1">
                <i class="el-icon-menu"></i>分类参数
              </el-menu-item>
              <el-menu-item index="1-4-1">
                <i class="el-icon-menu"></i>商品分类
              </el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="1-4-1">
                <i class="el-icon-menu"></i>订单列表
              </el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>数据管理</span>
              </template>
              <el-menu-item index="1-4-1">
                <i class="el-icon-menu"></i>数据报表
              </el-menu-item>
            </el-submenu>-->
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.$http({
      url: "menus"
    }).then(res => {
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.rightsList = res.data.data;
      }
    });
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style>
.el-container {
  height: 100%;
}
.el-container .el-header {
  padding: 0;
  margin: 0;
  background-color: #b3c0d1;
}
.el-container .el-header img {
  width: 200px;
}
.el-container .el-header .title {
  font-size: 26px;
  font-weight: bold;
  color: #fff;
  text-align: center;
}
.el-container .el-header .logout {
  padding-right: 15px;
  text-align: right;
  font-weight: bold;
}
.el-container .el-header .logout a {
  text-decoration: none;
  color: orange;
  margin-left: 5px;
}
.el-container .el-aside .el-col {
  height: 100%;
}
.el-menu-vertical-demo.el-menu {
  height: 100%;
}
</style>
