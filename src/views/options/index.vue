<template>
  <div class="app-container">
    <div class="table-title">
      <span class="title-1">PlayBook</span>
      <span class="title-2">参数配置列表</span>
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="配置名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.playbook" placeholder="playbook" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in playbookList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select> 
      <el-select v-model="listQuery.env" placeholder="环境配置" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in envList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>   
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <!-- :key="tableKey" -->
    <!-- sort-change="sortChange" -->

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="序号" type="index" width="100" />
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="配置名称" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="playbook" min-width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.playbook | playbookFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境信息" min-width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.env | envFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目url" min-width="200px" align="center">
        <template slot-scope="{row}">
          <el-link :href="row.url" target="_blank">{{ row.url }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        min-width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <!-- @click="handleUpdate(row)" -->
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(row,$index)"
          >删除</el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :width="dialogWidth">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="85px" style="width: 800px; margin-left:50px;">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="项目地址" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="playbook" prop="playbook">
          <el-select v-model="temp.playbook" clearable class="filter-item" placeholder="请选择">
            <el-option v-for="item in playbookList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="环境配置" prop="env">
          <el-select v-model="temp.env" clearable class="filter-item" placeholder="请选择">
            <el-option v-for="item in envList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="配置参数" prop="content"> -->
        <json-editor ref="jsonEditor" v-model="temp.content" />
        <!-- </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let that
import { getPlayBooks, getHost, getGroup, createHost, updateHost, deleteHost } from '@/api/inventory'
import { getOptions, getEnvs, createOptions, updateOptions, deleteOptions } from '@/api/task'
import Pagination from '@/components/Pagination'
import JsonEditor from '@/components/JsonEditor'
import waves from '@/directive/waves' // waves directive
import { validIP } from '@/utils/validate'

export default {
  components: { Pagination, JsonEditor },
  directives: { waves },
  filters: {
    groupFilter(id) {
      // console.log(that.temp)
      return that.groupsObj[id]
    },
    playbookFilter(id) {
      return that.playbooksObj[id]
    },
    envFilter(id) {
      return that.envsObj[id]
    }
  },
  data() {
    return {
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      dialogWidth:"65%",
      list: null,
      listLoading: true,
      total: 0,
      playbooksObj: '',
      playbookList: '',
      envsObj: '',
      envList: '',

      listQuery: {
        page: 1,
        limit: 20,
        env: undefined,
        playbook: undefined,
        sort: '+id'
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        id: '',
        name: '',
        playbook: '',
        env: '',
        content: '',
        url: null
      },
      rules: {
        name: [{ required: true, message: '参数名必填', trigger: 'change' }],
        playbook: [{ required: true, message: '请选择PlayBook',  trigger:'change' }]

      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.getList()
    this.getPlayName()
    this.getEnvName()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOptions(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.items
        this.total = response.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    async getPlayName() {
      const data = await getPlayBooks()
      this.playbookList = data.items
      // console.log(this.groupList)
      this.playbooksObj = this.playbookList.reduce((acc, cur) => {
        acc[cur.id] = cur.name
        return acc
      }, {})
    },
    async getEnvName() {
      const data = await getEnvs()
      this.envList = data.items
      // console.log(this.groupList)
      this.envsObj = this.envList.reduce((acc, cur) => {
        acc[cur.id] = cur.name
        return acc
      }, {})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        playbook: '',
        env: '',
        content: null,
        url: null
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log("handle")
      console.log(typeof(this.temp.content))
      console.log(this.temp.content)
      // this.temp.content = JSON.parse(row.content)
      // this.temp.content = row.content
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { id, name, playbook, env, content, url } = this.temp

          if(!env) {
            var createData = {
              name: name.trim(),
              playbook_id: playbook,
              content: JSON.parse(content),
              url: url
            }
          }else{
            createData = {
              name: name.trim(),
              playbook_id: playbook,
              env_id: env,
              content: JSON.parse(content),
              url: url
            }
          }

          createOptions(createData).then((response) => {
            const { id } = response
            this.temp.id = id
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let { id, name, playbook, env, content, url } = this.temp

          try {
            var content_json = JSON.parse(content)
          } catch(e) {
            content_json = content
          }
          if(!env) {
            var editData = {
              name: name.trim(),
              playbook_id: playbook,
              content: content_json,
              url: url,
            }
          }else{
            editData = {
              name: name.trim(),
              playbook_id: playbook,
              env_id: env,
              url: url,
              content: content_json,
            }
          }
          updateOptions(id, editData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, response)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    async handleDelete(row, index) {
      await this.$confirm('确认删除此条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteOptions(row.id).then(data => {
          this.list.splice(index, 1)
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
    }
  }
}
</script>
<style>
</style>
