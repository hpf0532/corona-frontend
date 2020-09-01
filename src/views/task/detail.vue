<template>
  <div class="app-container">
    <!-- <table v-loading="dataLoading" class="table table-bordered text-nowrap"> -->
    <el-button style="float:right;margin-bottom:5px" type="primary" @click="handleCancel" plain :disabled="cancelled">发错了？点我取消</el-button>
    <table v-loading="dataLoading" class="table table-bordered text-nowrap">
      <tbody>
        <tr style="background-color: #3c8dbc80;font-weight: bold;">
          <td>Name</td>
          <td>Content</td>
        </tr>
        <tr>
          <td class="t-title">AnsibleID</td>
          <td class="t-body">{{ taskDetail.ansible_id }}</td>
        </tr>
        <tr>
          <td class="t-title">CeleryID</td>
          <td class="t-body">{{ taskDetail.celery_id }}</td>
        </tr>
        <tr>
          <td class="t-title">操作人员</td>
          <td class="t-body">{{ taskDetail.user }}</td>
        </tr>
        <tr>
          <td class="t-title">playbook</td>
          <td class="t-body">{{ taskDetail.playbook }}</td>
        </tr>
        <!-- <tr>
                    <td class="t-title">ExtraVar</td>
                    <td  class="t-body" style="padding:0px 12px">
                            <pre style="margin:0px" v-highlightjs="taskDetail.extra_vars">
                                <code  class="json">
                                </code>
                            </pre>
                    </td>
                </tr> -->
        <tr>
          <td class="t-title">ExtraVar</td>
          <td class="t-body" style="padding:0px 12px">
            <json-view class="code" :data="extraVars" />
          </td>
        </tr>
        <tr>
          <td class="t-title">AnsibleResult
            </br>
            <el-button
              style="margin-top:50px"
              type="success"
              size="small"
              :disabled="buttonStatus"
              @click="getData"
            >
              结果轮询
            </el-button>
          </td>
          <td class="t-body" style="padding:0px 12px">
            <json-view v-if="buttonStatus" class="code" :data="ansibleResult" />
            <div v-else style="margin-top:10px">
              <span class="no-result">
                暂无结果
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="t-title">CeleryResult</td>
          <td class="t-body" style="padding:0px 12px">
            <json-view v-if="celeryStatus" class="code" :data="celeryResult" />
            <div v-else style="margin-top:10px">
              <span class="no-result">
                暂无结果
              </span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="t-title">createTime</td>
          <td class="t-body">{{ taskDetail.create_time | parseTime }}</td>
        </tr>
      </tbody>

    </table>
  </div>
</template>
<script>
import jsonView from '@/components/json-view'
import { getTaskDetail, flushTask, taskCancel } from '@/api/task'
import { parseTime } from '@/utils'
export default {
  components: {
    jsonView
  },
  data() {
    return {
      id: '',
      dataLoading: true,
      taskDetail: {},
      ansibleResult: {},
      extraVars: {},
      celeryResult: {},
      buttonStatus: false,
      celeryStatus: false,
      cancelled: false,
      timer: null
    }
  },
  mounted() {
    this.getData()
    //   setInterval(()=>{console.log(1)},2000)
    this.flushResult()
    // this.getResult()
  },
  destroyed() {
    // 路由改变时清楚timer
    if(this.timer){
      clearInterval(this.timer)
    }
  },
  methods: {
    async getData() {
      this.dataLoading = true
      this.id = this.$route.params.id
      this.taskDetail = await getTaskDetail(this.id)
      this.extraVars = this.taskDetail.extra_vars
      this.cancelled = this.taskDetail.cancelled

      this.ansibleResult = this.taskDetail.ansible_result
      // 关闭轮询按钮
      if (this.ansibleResult) {
        this.buttonStatus = true
      }
      this.celeryResult = this.taskDetail.celery_result
      if (this.celeryResult) {
        this.celeryStatus = true
      }
      // 结束轮询
      if (this.buttonStatus || this.celeryStatus) {
        if (this.timer) {
          clearInterval(this.timer)
        }
      }
      this.dataLoading = false
    },
    async getResult() {
      const { ansible_result, celery_result } = await flushTask(this.id)
      this.ansibleResult = ansible_result
      // 关闭轮询按钮
      if (this.ansibleResult) {
        this.buttonStatus = true
      }
      this.celeryResult = celery_result
      if (this.celeryResult) {
        this.celeryStatus = true
      }
      // 结束轮询
      if (this.buttonStatus || this.celeryStatus) {
        if (this.timer) {
          clearInterval(this.timer)
        }
      }
    },
    async handleCancel() {
      const result = await taskCancel({"task_id": this.taskDetail.celery_id})
      this.cancelled = result.cancelled
      this.$message({
        message: result.msg,
        type: 'success'
      });
    },
    // 刷新任务数据
    flushResult() {
      this.timer = setInterval(
        () => {
          setTimeout(this.getResult, 0)
        }, 2000)
    }
    // async getData() {
    //   this.dataLoading = true
    //   const data = await getPlayBookDetail()
    //   const items = data.items
    //   this.list = items.map(v => {
    //     this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
    //     v.originalName = v.name //  will be used when user click the cancel botton
    //     v.originalDesc = v.description
    //     return v
    //   })
    //   this.listLoading = false
    // },
  }

}
</script>

<style>
.t-title {
    width: 30%;
    font-weight: bold;
    background-color: #88cae8c4;
}
.t-body {
    background-color: #bddbbee0;
}
.code {
    margin-top: 10px;
    margin-bottom: 10px;
}
.no-result {
    margin-top: 10px;
    padding: 5px;
    background-color: #FFFFFF;
}
/* .t-header {
    width: 30%;
    font-weight: bold;
    background-color: gray;
} */
</style>
