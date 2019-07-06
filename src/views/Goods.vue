<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain style="margin-top:20px" @click="btnAddGoods">添加商品</el-button>
    <el-table ref="goodsList" :data="goodsList" highlight-current-row style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="创建时间"></el-table-column>
      <el-table-column property="address" label="操作">
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
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      pagesize: 6,
      goodsList: [],
      total: 0
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        method: "get",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.goodsList = res.data.data.goods;
        this.total = res.data.data.total;
      }
    },
    changePage(currentPage) {
      this.pagenum = currentPage;
      this.getGoodsList();
    },
    btnAddGoods() {
      this.$router.push("/addGoods");
    }
  }
};
</script>

