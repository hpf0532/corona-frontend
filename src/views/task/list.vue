<template>
  <div class="app-container">
    <div class="table-title">
      <span class="title-1">Ansible</span>
      <span class="title-2">任务列表</span>
    </div>
    <div class="filter-container">
      <el-date-picker
        v-model="timeQuery"
        style="margin-bottom:10px;vertical-align: middle;"
        type="datetimerange"
        align="right"
        :picker-options="pickerOptions"
        value-format="timestamp"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00', '08:00:00']"
      />
      <el-input v-model="listQuery.ansibleId" clearable placeholder="Ansible ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.user" placeholder="操作用户" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="100" />

      <el-table-column label="AnsibleID" min-width="150px">
        <template slot-scope="{row}">
          <span>
            <router-link :to="'/inventory/task/detail/'+row.id" class="link-type">
              {{ row.ansible_id }}
            </router-link>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" min-width="60px">
        <template slot-scope="{row}">
          <span>{{ row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.playbook }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务选项" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.option }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.state.state_code | statusFilter">
            {{ row.state.state_text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="130px">
        <template slot-scope="{row}">
          <span>{{ row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getTasks } from '@/api/task'
import { getUsers } from '@/api/user'
import { parseTime } from '@/utils'
import waves from '@/directive/waves' // waves directive

export default {
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'primary',
        2: 'success',
        3: 'danger',
        4: 'warning'
      }
      return statusMap[status]
    }
  },
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      timeQuery: null,
      userList: '',
      userObj: '',
      listQuery: {
        page: 1,
        limit: 20,
        ansibleId: undefined,
        user: undefined,
        startTime: null,
        endTime: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getUserName()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getTasks(this.listQuery).then(response => {
        this.list = response.items
        this.total = response.count
        setTimeout(() => {
          this.listLoading = false
        }, 500)
      })
    },
    async getUserName() {
      const data = await getUsers()
      this.userList = data.items
      // console.log(this.groupList)
      this.userObj = this.userList.reduce((acc, cur) => {
        acc[cur.id] = cur.name
        return acc
      }, {})
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.startTime = null
      this.listQuery.endTime = null
      if (this.timeQuery) {
        const timeStamp = this.timeQuery.map((val) => {
          return parseInt(val / 1000)
        })
        this.listQuery.startTime = timeStamp[0]
        this.listQuery.endTime = timeStamp[1]
      }

      this.getList()
    }
  }

}
</script>
<style scoped>
.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
}
.link-type:hover {
  color: rgb(32, 160, 255);
}
</style>
