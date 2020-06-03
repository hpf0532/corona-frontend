<template>
  <div class="app-container">
    <div class="table-title">
      <span class="title-1">wiki</span>
      <span class="title-2">分类列表</span>
    </div>
    <div class="group-title">
      <el-button
        type="success"
        size="small"
        @click="createItem"
      >
        新建
      </el-button>
    </div>
    <div>

      <el-table v-loading="listLoading" :data="list" :cell-style="{'vertical-align':'middle'}" border fit highlight-current-row style="width: 100%">
        <el-table-column
          label="ID"
          type="index"
          width="100"
        />

        <el-table-column label="Name">
          <template slot-scope="{row, $index}">
            <template v-if="row.edit">
              <el-input v-model="row.name" class="edit-input" size="small" />
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Posts">
          <template slot-scope="{row}">
            <span>{{ row.posts }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions">
          <template slot-scope="{row, $index}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click.native.prevent="confirmEdit(row, $index)"
            >
              保存
            </el-button>
            <el-button
              v-if="row.edit"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              取消
            </el-button>
            <el-button
              v-if="!row.edit  && row.name != 'Default'"
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              编辑
            </el-button>
            <el-button
              v-if="!row.edit  && row.name != 'Default'"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteItem(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { createCategory, editCategory, deleteCategory, getCategorys } from '@/api/wiki'
export default {
  name: 'CategoryList',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      newItem: null,
      item: null,
      list: null,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getCategoryList()
    console.log(this.$route.query)
  },
  computed: {
    ...mapGetters([
    'categoryList',
    ]),
    // categoryList() {
    //   return this.$store.state.wiki.categoryList.map(v => {
    //     this.$set(v, 'edit', false)
    //     v.originalName = v.name 
    //     return v
    //   })
    // }
  },
  methods: {
    async getCategoryList() {
      this.listLoading = true
      const data = await getCategorys()
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalName = v.name //  will be used when user click the cancel botton
        return v
      })
      this.listLoading = false
    },
    createItem() {
      console.log(this.categoryList)
      this.item = { id: '', name: '', originalName: '', posts: 0 }
      this.$set(this.item, 'edit', true)
      this.list.push(this.item)
    },

    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({
        message: '取消编辑',
        type: 'warning'
      })
    },
    async deleteItem(row) {
      if (row.id) {
        await this.$confirm('确认删除此条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then(() => {
          deleteCategory(row.id).then(data => {
            this.list = this.list.filter(({ id }) => id !== row.id)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(() => {
            this.$message.error('删除失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.list = this.list.filter(({ id }) => id !== row.id)
      }
    },
    async confirmEdit(row, index) {
      console.log(row)
      if (row.name.trim() === '') {
        this.$notify({
          message: '分类名不能为空',
          type: 'error',
          title: '错误'
        })
        return
      }

      const { id, name } = row

      if (!row.id) {
        this.newItem = await createCategory({ name: name.trim() })
        // this.$store.dispatch('wiki/addCategory', { name: name.trim() })
        row.id = this.newItem.id
      } else {
        // this.$store.dispatch('wiki/changeCategory', { index: index, id: row.id, name: name.trim() })
        this.newItem = await editCategory(row.id, { name: name.trim() })
      }

      row.edit = false
      row.originalName = row.name
      this.$message({
        message: '已保存',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.group-title {
  margin-bottom: 10px;
}
</style>
