<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="keyword">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" @click="addUserDialogToggle" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="type" label="状态">
        <template v-slot="{ row }">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleType(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" plain size="mini" @click="editUserDialogToggle(row)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" plain size="mini" @click="delUser(row)">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button type="success" plain size="mini" @click="RolesDialogShow(row)">
            <i class="el-icon-check"></i>
            <span>分配角色</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      @current-change="pageChange"
    ></el-pagination>

    <!-- 添加用户弹出框 -->
    <el-dialog title="添加用户" :visible.sync="isAddUserDialogShow">
      <el-form label-width="80px" :rules="addRules" :model="addUserInput" ref="addUserForm">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="addUserInput.username" autocomplete="off" autofocus></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="addUserInput.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="addUserInput.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话">
          <el-input v-model="addUserInput.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="btnAddUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户模态框 -->
    <el-dialog title="添加用户" :visible.sync="isEditUserDialogShow">
      <el-form label-width="80px" :rules="editRules" :model="editUserData" ref="editUserForm">
        <el-form-item label="用户名">
          <div class="tag-group">
            <el-tag type="info" effect="dark">
              {{
              editUserData.username
              }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editUserData.email" autocomplete="off" autofocus></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话">
          <el-input v-model="editUserData.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditUserDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="btnEdit(editUserData.id)">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色模态框 -->
    <el-dialog title="分配角色" :visible.sync="isRolesDialogShow">
      <el-form label-position="right">
        <el-form-item label="用户名">
          <div class="tag-group">
            <el-tag type="info" effect="dark">
              {{
              roleDate.username
              }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="角色">
          <el-select placeholder="请选择" v-model="roleDate.rid">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isRolesDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      keyword: "",
      total: 0,
      pagenum: 1,
      pagesize: 3,
      isAddUserDialogShow: false,
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 6,
            message: "用户名长度在 2 到 6 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "密码长度在 6 到 12 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      addUserInput: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      isEditUserDialogShow: false,
      editUserData: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      editRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      isRolesDialogShow: false,
      roleDate: [],
      rolesList: []
    };
  },
  // computed() {},
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http({
        url: "http://localhost:8888/api/private/v1/users",
        method: "get",
        params: {
          query: this.keyword,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        let {
          data: { data, meta }
        } = res;
        this.tableData = data.users;
        this.total = data.total;
        // console.log(this.total);
      });
    },
    search() {
      // console.log(1);
      this.getUserList();
    },
    addUserDialogToggle() {
      this.isAddUserDialogShow = true;
      this.getUserList();
    },
    async btnAddUsers() {
      // console.log(11);
      try {
        await this.$refs.addUserForm.validate();
        // console.log("校验成功");
        this.$http({
          url: "http://localhost:8888/api/private/v1/users",
          method: "post",
          data: this.addUserInput,
          headers: {
            Authorization: localStorage.getItem("token")
          }
        }).then(({ data: { data, meta } }) => {
          console.log(meta);
          if (meta.status === 201) {
            this.$message({
              message: meta.msg,
              type: "success",
              duration: 1000
            });
            this.getUserList();
            this.isAddUserDialogShow = false;
          }
        });
      } catch (err) {
        // console.log("校验失败");
      }
    },
    pageChange(page) {
      // console.log(page);
      this.pagenum = page;
      this.getUserList();
    },
    toggleType(row) {
      // console.log(row);
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${row.id}/state/${row.mg_state}`,
        method: "put",
        data: {
          uld: "row.id",
          type: "row.mg_state"
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        let {
          data: { data, meta }
        } = res;
        if (meta === 200) {
          this.$message({
            type: "success",
            message: meta.msg,
            duration: 1000
          });
        } else {
          this.$message({
            type: "error",
            message: meta.msg,
            duration: 1000
          });
        }
      });
    },
    delUser(row) {
      // console.log(11)
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${row.id}`,
        method: "delete",
        data: {
          id: row.id
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(({ data: { data, meta } }) => {
        console.log(meta);
        if (meta.status === 200) {
          this.$message({
            type: "success",
            message: meta.msg,
            duration: 1000
          });
        } else {
          this.$message({
            type: "error",
            message: meta.msg,
            duration: 1000
          });
        }
        this.getUserList();
      });
    },
    editUserDialogToggle(row) {
      this.isEditUserDialogShow = true;
      this.$http({
        url: `http://localhost:8888/api/private/v1/users/${row.id}`,
        method: "get",
        data: {
          id: row.id
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(({ data: { data, meta } }) => {
        // this.editUserData.username = data.username;
        // this.editUserData.email = data.email;
        // this.editUserData.mobile = data.mobile;
        this.editUserData = data;
      });
    },
    async btnEdit(id) {
      // console.log(id);

      await this.$refs.editUserForm.validate();
      let res = await this.$http({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "put",
        data: {
          email: this.editUserData.email,
          mobile: this.editUserData.mobile
        }
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success"
        });
        this.getUserList();
        this.isEditUserDialogShow = false;
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: "error"
        });
      }
    },
    async RolesDialogShow(row) {
      this.isRolesDialogShow = true;
      // console.log(row);
      // this.rolesList = row;
      let res = await this.$http({
        url: `users/${row.id}`
      });

      // console.log(res);
      this.roleDate = res.data.data;

      let roleList = await this.$http({
        url: "roles"
      });

      // console.log(roleList);
      this.rolesList = roleList.data.data;
    },
    async updateRole() {
      // console.log(123);
      let res = await this.$http({
        url: `users/${this.roleDate.id}/role`,
        method: "put",
        data: {
          id: this.roleDate.id,
          rid: this.roleDate.rid
        }
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: "success"
        });
        this.isRolesDialogShow = false;
      }
    }
  }
};
</script>

