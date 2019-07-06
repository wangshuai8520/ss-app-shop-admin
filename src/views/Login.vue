<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6">
      <el-form
        ref="ruleForm"
        :model="form"
        label-width="80px"
        class="login"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      // ruleForm: {
      //   username: "",
      //   password: ""
      // },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "change" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    onSubmit(ruleForm) {
      console.log("submit!");
      this.$refs[ruleForm].validate(valid => {
        axios({
          url: "http://localhost:8888/api/private/v1/login",
          method: "post",
          data: this.form
        }).then(({ data: { data, meta } }) => {
          // console.log(res);
          // console.log(data, meta);
          if (meta.status === 200) {
            console.log("登录成功");
            localStorage.setItem("token", data.token);
            this.$router.push("/home");
            return;
          }
          if (meta.status !== 200) {
            alert("用户名或者密码错误");
            return false;
          }
        });
      });
    },
    resetForm(ruleForm) {
      this.$refs[ruleForm].resetFields();
    }
  }
};
</script>

<style>
.row-bg {
  height: 100%;
  background-color: #2d434c;
}
.login {
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 10px;
}
</style>
