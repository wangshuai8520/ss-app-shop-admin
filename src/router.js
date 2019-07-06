import Vue from "vue";
import Router from "vue-router";
import login from "./views/Login.vue";
import home from "./views/Home.vue";
import user from "./views/User.vue";
import roles from "./views/Roles.vue"
import rights from "./views/Rights.vue"
import goods from "./views/Goods.vue"
import addGoods from "./views/addGoods.vue"
import categories from "./views/categoriesGoods.vue"

Vue.use(Router);

export default new Router({
  routes: [{
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      name: "login",
      component: login
    },
    {
      path: "/home",
      name: "home",
      component: home,
      children: [{
          path: "/users",
          name: "user",
          component: user
        },
        {
          path: "/roles",
          name: 'roles',
          component: roles
        },
        {
          path: '/rights',
          name: 'rights',
          component: rights
        },
        {
          path: '/goods',
          name: 'goods',
          component: goods
        },
        {
          path: '/addGoods',
          name: 'addGoods',
          component: addGoods
        },
        {
          path: '/categories',
          name: 'categories',
          component: categories
        }
      ]
    }
  ]
});