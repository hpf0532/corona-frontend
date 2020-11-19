<template>
  <div class="app-container">
    <div class="table-title">
      <span class="title-1">CMDB</span>
      <span class="title-2">服务器列表</span>
    </div>
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="主机名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.group" placeholder="主机组" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" />
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" min-width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.hostname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP地址" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
          <!-- <el-tag>{{ row.type | typeFilter }}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="主机组" min-width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group | groupFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" min-width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
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
          <!-- <el-button type="primary" size="mini">编辑</el-button> -->
          <!-- @click="handleDelete(row,$index)" -->
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="主机名" prop="hostname">
          <el-input v-model="temp.hostname" />
        </el-form-item>
        <el-form-item label="ip" prop="ip">
          <el-input v-model="temp.ip" />
        </el-form-item>
        <el-form-item label="主机组" prop="group">
          <el-select v-model="temp.group" clearable class="filter-item" placeholder="请选择">
            <el-option v-for="item in groupList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model.number="temp.port" />
        </el-form-item>
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
import { getHost, getGroup, createHost, updateHost, deleteHost } from '@/api/inventory'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import { validIP } from '@/utils/validate'

export default {
  components: { Pagination },
  directives: { waves },
  filters: {
    groupFilter(id) {
      // console.log(that.temp)
      return that.groupsObj[id]
    }
  },
  data() {
    const validateIP = (rule, value, callback) => {
      if (!validIP(value)) {
        callback(new Error('请输入正确的IP地址'))
      } else {
        callback()
      }
    }
    const checkPort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('端口不能为空'))
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'))
      } else {
        if (value > 65535 || value <= 0) {
          callback(new Error('端口范围1-65535'))
        } else {
          callback()
        }
      }
    }
    return {
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      list: null,
      listLoading: true,
      total: 0,
      groupsObj: '',
      groupList: '',
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        group: undefined,
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
        hostname: '',
        ip: '',
        port: 22,
        group: ''
      },
      rules: {
        hostname: [{ required: true, message: '主机名必填', trigger: 'change' }],
        ip: [{ required: true, validator: validateIP, trigger: 'change' }],
        port: [{ required: true, validator: checkPort, trigger: 'change' }]
      }
    }
  },
  beforeCreate() {
    that = this
  },
  created() {
    this.getList()
    this.getGroupName()
  },
  methods: {
    getList() {
      this.listLoading = true
      getHost(this.listQuery).then(response => {
        // console.log(response)
        this.list = response.items
        this.total = response.count
        console.log(this.list)
        console.log(this.total)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    async getGroupName() {
      const data = await getGroup()
      this.groupList = data.items
      console.log(this.groupList)
      this.groupsObj = this.groupList.reduce((acc, cur) => {
        acc[cur.id] = cur.name
        return acc
      }, {})
      console.log(this.groupsObj)
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
        hostname: '',
        ip: '',
        port: 22,
        group: ''
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const { id, hostname, group, ip, port } = this.temp
          if (!group) {
            var createData = {
              hostname: hostname.trim(),
              ip: ip,
              port: port
            }
          } else {
            var createData = {
              hostname: hostname.trim(),
              group_id: group,
              ip: ip,
              port: port
            }
          }

          // const createData = {
          //     hostname: hostname.trim(),
          //     group_id: group,
          //     ip: ip,
          //     port: port
          //   }

          console.log(createData)

          createHost(createData).then((response) => {
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
          const tempData = Object.assign({}, this.temp)
          const { id, hostname, group, ip, port } = tempData

          if (!group) {
            var editData = {
              hostname: hostname.trim(),
              ip: ip,
              port: port
            }
          } else {
            var editData = {
              hostname: hostname.trim(),
              group_id: group,
              ip: ip,
              port: port
            }
          }
          updateHost(id, editData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
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
        deleteHost(row.id).then(data => {
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
