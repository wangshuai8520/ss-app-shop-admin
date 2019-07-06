<template>
  <div>
    <!-- 这是商品分类 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain style="margin-top:20px" @click="addCate">添加分类</el-button>

    <el-table :data="categoriesList" style="width: 100%">
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        file-icon="el-icon-goods"
        folder-icon="el-icon-s-goods"
        tree-key="cat_id"
        parent-key="cat_pid"
        :indent-size="20"
        level-key="cat_level"
      ></el-table-tree-column>
      <el-table-column label="是否有效">
        <template v-slot="{row}">{{row.cat_delete?"否":"是"}}</template>
      </el-table-column>
      <el-table-column label="层级">
        <template v-slot="{row}">{{row.cat_level | levelfilter}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" plain size="mini">
          <i class="el-icon-edit"></i>
        </el-button>
        <el-button type="danger" plain size="mini">
          <i class="el-icon-delete"></i>
        </el-button>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="pagechange"
    ></el-pagination>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <el-form ref="form" :model="cateForm" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="cateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader v-model="cateForm.parentArr" :options="cateOption" :props="defaultProps"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const ElTreeGrid = require("element-tree-grid");
// Vue.component(ElTreeGrid.name,ElTreeGrid);
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      dialogVisible: false,
      cateForm: {
        cat_name: "",
        parentArr: []
      },
      cateOption: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.categoriesList = res.data.data.result;
        this.total = res.data.data.total;
      }
    },
    pagechange(currentPage) {
      this.pagenum = currentPage;
      this.getCateList();
    },
    addCate() {
      this.dialogVisible = true;
      this.$http({
        url: "categories"
      }).then(res => {
        console.log(res);
        if (res.data.meta.status === 200) {
          this.cateOption = res.data.data;
          // console.log(this.cateOption);
        }
      });
    },
    async btnAddCate() {
      // 1. 获取表单数据
      // this.addCateFormData.cat_name
      let cat_name = this.cateForm.cat_name;
      // cat_level其实可以直接用 parentArr.length
      let cat_level = this.cateForm.parentArr.length;
      // this.addCateFormData.parentArr  这个里面放的是所有的父分类的id
      // 我们只需要最后一个就可以
      let cat_pid = this.cateForm.parentArr.pop() || 0;
      let res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_pid,
          cat_name,
          cat_level
        }
      });

      this.dialogVisible = false;
      this.$message({
        message: res.data.meta.msg,
        type: "success"
      });
      this.getCateList();
    }
  },
  filters: {
    levelfilter(value) {
      switch (value) {
        case 0:
          return "一级";
        case 1:
          return "二级";
        case 2:
          return "三级";
      }
    }
  }
};
</script>


<style scoped>
</style>

