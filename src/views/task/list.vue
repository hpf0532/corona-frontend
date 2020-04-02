<template>
  <div class="app-container">
    <div class="table-title">
      <span class="title-1">Ansible</span>
      <span class="title-2">任务列表</span>
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
      <el-table-column label="执行人" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.playbook }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务状态" class-name="status-col" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            {{ row.state | statusDisplayFilter }}
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
import { parseTime } from '@/utils'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    },
    statusDisplayFilter(status) {
      const displayMap = {
        true: '已完成',
        false: '执行中'
      }
      return displayMap[status]
    }
  },
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      const taskData = await getTasks(this.listQuery)
      this.list = taskData.items
      this.total = taskData.count
      setTimeout(() => {
        this.listLoading = false
      }, 500)
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
