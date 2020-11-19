<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="draftList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="标题"
        width="900"
      >
        <template slot-scope="{row,$index}">{{ row.title }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="保存时间"
        width="300"
      >
        <template slot-scope="{row,$index}">{{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作"
      >
        <template slot-scope="{row,$index}">
          <el-button
            type="text"
            @click="editDraft(row)"
          >编辑</el-button>
          <el-button
            type="text"
            @click="handleDelete(row, $index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="toggleSelect(draftList)">全选/取消</el-button>
      <el-button type="primary" @click="batchDelete()">删除</el-button>
    </div>

  </div>
</template>
<script>
import { getDrafts, deleteDraft, batchDeleteDraft } from '@/api/wiki'
import { parseTime } from '@/utils'

export default {
  data() {
    return {
      draftList: [],
      multipleSelection: [],
      allSelect: false
    }
  },
  mounted() {
    this.fetchDrafts()
  },
  methods: {
    async fetchDrafts() {
      const data = await getDrafts()
      this.draftList = data.items
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    toggleSelect(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, !this.allSelect)
        })
        this.allSelect = !this.allSelect
      }
    },

    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = []
      val.forEach(item => {
        this.multipleSelection.push(item.id)
      })
    },

    async batchDelete() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择草稿'
        })
        return false
      }
      await this.$confirm('确认删除这些文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        batchDeleteDraft(this.multipleSelection).then(data => {
          this.draftList = data.items
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
    },

    editDraft(row) {
      this.$router.push({ name: 'Draft', params: { id: row.id }})
    },
    async handleDelete(row, index) {
      await this.$confirm('确认删除此条记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deleteDraft(row.id).then(data => {
          this.draftList.splice(index, 1)
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
<style lang="scss" scoped>

</style>
