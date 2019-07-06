<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps :active="step" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" style :value="tabName" @tab-click="tabChange">
      <el-tab-pane label="基本信息" name="info">
        <el-form ref="form" label-width="80px" :model="addGoodsDate">
          <el-form-item label="商品名称">
            <el-input placeholder="请输入内容" v-model="addGoodsDate.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input placeholder="请输入内容" v-model="addGoodsDate.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input placeholder="请输入内容" v-model="addGoodsDate.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input placeholder="请输入内容" v-model="addGoodsDate.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsDate.goods_cats"
              :options="cateOptions"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio label="1" v-model="addGoodsDate.is_promote">是</el-radio>
            <el-radio label="0" v-model="addGoodsDate.is_promote">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="nextStep(1,'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          v-model="addGoodsDate.pics"
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="onFileUploadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="nextStep(2,'main')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="main">
        <quill-editor v-model="addGoodsDate.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGoods">完成</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      step: 0,
      tabName: "info",
      addGoodsDate: {
        goods_name: "",
        goods_cats: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        is_promote: "",
        pics: []
      },
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      },
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    // console.log(res);
    this.cateOptions = res.data.data;
  },
  methods: {
    nextStep(num, active) {
      this.tabName = active;
      this.step = num;
    },
    tabChange(info) {
      // console.log(info);
      this.step = +info.index;
    },
    onFileUploadSuccess(res) {
      console.log(res);
      this.addGoodsDate.pics.push(res.data.tmp_path);
    },
    async addGoods() {
      let newGoods = {
        goods_name: this.addGoodsDate.goods_name,
        goods_cat: this.addGoodsDate.goods_cats.join(),
        goods_price: this.addGoodsDate.goods_price,
        goods_number: this.addGoodsDate.goods_number,
        goods_weight: this.addGoodsDate.goods_weight,
        goods_introduce: this.addGoodsDate.goods_introduce,
        is_promote: this.addGoodsDate.is_promote,
        pics: this.addGoodsDate.pics
      };
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: newGoods
      });
      console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          message: res.data.meta.msg,
          type: "success"
        });
        this.$router.push("/Goods");
      }
    }
  }
};
</script>

<style scoped>
.el-steps {
  margin-top: 20px;
}
</style>
