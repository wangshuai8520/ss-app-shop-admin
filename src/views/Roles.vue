<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table ref="singleTable" :data="rolesData" highlight-current-row style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row type="flex" class="level1" v-for="level1 in row.children" :key="level1.id">
            <el-col :span="6">
              <el-tag closable @close="clostTag(row, level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row type="flex" class="level2" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="clostTag(row, level2.id)"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    type="warning"
                    class="level3"
                    closable
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    @close="clostTag(row,level3.id)"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column property="roleDesc" label="描叙" width="180"></el-table-column>
      <el-table-column property="operate" label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" plain size="mini">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="danger" plain size="mini">
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button type="success" plain size="mini" @click="roleDialog(row)">
            <i class="el-icon-check"></i>
            <span>分配权限</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限模态框 -->
    <el-dialog title="分配权限" :visible.sync="isRolesDialogShow" width="30%">
      <el-tree
        :data="rightsList"
        :props="defaultProps"
        show-checkbox
        :default-expand-all="true"
        :default-checked-keys="rightsHasRolesList"
        node-key="id"
        ref="rightsTree"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="isRolesDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updataRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.level1 {
  border-bottom: 1px dashed #ccc;
  padding: 10px 0;
}

.level1:last-child {
  border-bottom: none;
}

.level2 {
  margin-bottom: 15px;
}

.level3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>

<script>
export default {
  data() {
    return {
      rolesData: [],
      isRolesDialogShow: false,
      rightsList: [],
      rightsHasRolesList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      currentEditRoleId: -1
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList(callback) {
      this.$http({
        url: "roles",
        method: "get"
      }).then(res => {
        if (res.data.meta.status === 200) {
          this.rolesData = res.data.data;
        }
      });
      callback && callback();
    },
    async clostTag(row, id) {
      // console.log(row);
      // console.log(id);
      let res = await this.$http({
        url: `roles/${row.id}/rights/${id}`,
        method: "delete"
      });
      // console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.getRolesList(() => {
          this.$nextTick(() => {
            //让表格对应的项展开即可
            this.$refs.singleTable.toggleRowExpansion(
              this.rolesData.find(v => v.id === row.id),
              true
            );
            // console.log(row.id);
          });
        });
      }
    },
    async roleDialog(row) {
      // console.log(row.id);
      this.currentEditRoleId = row.id;
      // console.log(this.currentEditRoleId);
      this.isRolesDialogShow = true;
      let res = await this.$http({
        url: "rights/tree",
        method: "get"
      });
      if (res.data.meta.status === 200) {
        this.rightsList = res.data.data;
      }
      // console.log(res);
      // let rightsList = await this.$http({

      // })
      // console.log(row);
      let level3id = [];
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            level3id.push(level3.id);
            // this.rightsHasRolesList.push(level3);
          });
        });
      });
      // console.log(level3id);
      this.rightsHasRolesList = [...level3id];
      // console.log(this.rightsHasRolesList);
    },
    updataRights() {
      // console.log();
      // console.log(this.$refs.rightsTree);
      let checkedids = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ].join(",");
      // console.log(checkedids);

      console.log(this.currentEditRoleId);
      this.$http({
        url: `roles/${this.currentEditRoleId}/rights`,
        method: "post",
        data: {
          rids: checkedids
        }
      }).then(res => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.isRolesDialogShow = false;
          // console.log(this.rightsHasRolesList);
          this.getRolesList();
        }
      });
    }
  }
};
</script>
