<template>
  <div class="app-container">
    <div class="table-title">
      <span class="title-1">CMDB</span>
      <span class="title-2">主机组列表</span>
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
      <!-- <el-form  :model="list"  ref="list"> -->
      <!-- <el-form v-model="row" :rules="rules"> -->

      <el-table v-loading="listLoading" :data="list" :cell-style="{'vertical-align':'middle'}" border fit highlight-current-row style="width: 100%">
        <el-table-column
          label="ID"
          type="index"
          width="100"
        />

        <!-- <el-table-column width="180px" align="center" label="Date">
          <template slot-scope="{row}">
            <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column> -->

        <el-table-column label="Name">
          <template slot-scope="{row}">
            <template v-if="row.edit">

              <!-- <el-form-item prop="name" style="margin:15px"> -->
              <el-input v-model="row.name" class="edit-input" size="small" />
              <!-- </el-form-item> -->
              <!-- </el-form> -->
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column width="120px" label="Importance">
          <template slot-scope="{row}">
            <svg-icon v-for="n in + row.importance" :key="n" icon-class="star" class="meta-item__icon" />
          </template>
        </el-table-column> -->

        <el-table-column label="Description">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.description" class="edit-input" size="small" />
            </template>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column min-width="300px" label="Title">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.title" class="edit-input" size="small" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >
                cancel
              </el-button>
            </template>
            <span v-else>{{ row.title }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-form-item> -->

        <el-table-column label="Actions">

          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click.native.prevent="confirmEdit(row)"
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
              v-else
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="row.edit=!row.edit"
            >
              编辑
            </el-button>
            <el-button
              v-if="!row.edit"
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="deleteItem(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
        <!-- </el-form-item> -->

      </el-table>
      <!-- </el-form> -->
    </div>
  </div>
</template>

<script>
import { getGroup, createGroup, deleteGroup, editGroup } from '@/api/inventory'
export default {
  name: 'InlineEditTable',
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
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      const data = await getGroup()
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        v.originalName = v.name //  will be used when user click the cancel botton
        v.originalDesc = v.description
        return v
      })
      this.listLoading = false
    },
    createItem() {
      this.item = { id: '', name: '', description: '', originalName: '', originalDesc: '' }
      console.log(this.item)
      this.$set(this.item, 'edit', true)
      this.list.push(this.item)
    },
    cancelEdit(row) {
      row.name = row.originalName
      row.description = row.originalDesc
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
          deleteGroup(row.id).then(data => {
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
    async confirmEdit(row) {
      if (row.name.trim() === '') {
        this.$notify({
          message: '组名不能为空',
          type: 'error',
          title: '错误'
        })
        return
      }

      const { id, name, description } = row
      console.log(name, description)
      // row.validate()

      if (!row.id) {
        this.newItem = await createGroup({ name: name.trim(), description: description.trim() })
        row.id = this.newItem.id
        // console.log(this.newItem)
      } else {
        this.newItem = await editGroup(row.id, { name: name.trim(), description: description.trim() })
      }

      row.edit = false
      row.originalName = row.name
      row.originalDesc = row.description
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
