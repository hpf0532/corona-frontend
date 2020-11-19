<template>
  <div class="app-container">
    <div class="table-title">
      <span class="title-1">Ansible</span>
      <span class="title-2">playbook列表</span>
    </div>
    <div class="playbook-title">
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
          <template slot-scope="{row}">

            <template v-if="row.create">
              <el-input v-model="row.name" class="edit-input" size="small" />
            </template>
            <span v-else>
              <router-link :to="'/inventory/playbook/detail/'+row.id" class="link-type">
                {{ row.name }}
              </router-link>
            </span>
          </template>

        </el-table-column>

        <el-table-column label="Author">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.author" class="edit-input" size="small" />
            </template>
            <span v-else>{{ row.author }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Information">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.information" class="edit-input" size="small" />
            </template>
            <span v-else>{{ row.information }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Is_env">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-radio-group v-model="row.is_env">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </template>
            <span v-else>{{ row.is_env }}</span>
          </template>
        </el-table-column>

        <el-table-column label="是否需上传">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-radio-group v-model="row.upload">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </template>
            <span v-else>{{ row.upload }}</span>
          </template>
        </el-table-column>

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
              @click="handleEdit(row)"
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
import { getPlayBooks, createPlayBook, deletePlayBook, editPlayBook } from '@/api/inventory'
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
      const data = await getPlayBooks()
      const items = data.items
      this.list = items.map(v => {
        this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
        this.$set(v, 'create', false)
        v.originalName = v.name //  will be used when user click the cancel botton
        v.originalAuthor = v.author
        v.originalInfo = v.information
        v.originalIsenv = v.is_env
        v.originalUpload = v.upload
        return v
      })
      this.listLoading = false
    },
    handleEdit(row) {
      for (const i of this.list) {
        if (i.edit) {
          return this.$message({
            message: '请先保存当前编辑项',
            type: 'error'
          })
        }
      }
      row.edit = !row.edit
    },
    createItem() {
      for (const i of this.list) {
        if (i.edit) {
          return this.$message({
            message: '请先保存当前编辑项',
            type: 'error'
          })
        }
      }
      this.item = {
        id: '',
        name: '',
        author: '',
        information: '',
        is_env: false,
        upload: false,
        originalName: '',
        originalAuthor: '',
        originalInfo: '',
        originalIsenv: '',
        originalUpload: ''
      }
      console.log(this.item)
      this.$set(this.item, 'create', true)
      this.$set(this.item, 'edit', true)

      this.list.push(this.item)
    },
    cancelEdit(row) {
      // 新建组未保存过点取消会直接删除
      if (!row.id) {
        this.deleteItem(row)
      }
      row.name = row.originalName
      row.author = row.originalAuthor
      row.information = row.originalInfo
      row.is_env = row.originalIsenv
      row.upload = row.originalUpload
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
          deletePlayBook(row.id).then(data => {
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
      if (row.author.trim() === '') {
        this.$notify({
          message: '作者不能为空',
          type: 'error',
          title: '错误'
        })
        return
      }
      if (row.information.trim() === '') {
        this.$notify({
          message: 'information不能为空',
          type: 'error',
          title: '错误'
        })
        return
      }

      const { id, name, author, information, is_env, upload } = row
      // console.log(name, description )
      // row.validate()

      if (!row.id) {
        this.newItem = await createPlayBook({
          name: name.trim(),
          author: author.trim(),
          information: information.trim(),
          is_env: is_env,
          upload: upload
        })
        row.id = this.newItem.id
        // console.log(this.newItem)
      } else {
        this.newItem = await editPlayBook(
          row.id,
          {
            name: name.trim(),
            author: author.trim(),
            information: information.trim(),
            is_env: is_env,
            upload: upload
          }
        )
      }

      row.edit = false
      row.create = false
      row.originalName = row.name
      row.originalAuthor = row.author
      row.originalInfo = row.infomation
      row.originalIsenv = row.is_env
      row.originalUpload = row.upload
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
.playbook-title {
  margin-bottom: 10px;
}

.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
}
.link-type:hover {
  color: rgb(32, 160, 255);
}

</style>
