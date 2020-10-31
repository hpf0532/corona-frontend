<template>
  <div class="app-container">
    <div class="task-title">
      <h3>执行PlayBook任务</h3>
    </div>

    <el-form ref="taskForm" :model="taskForm" label-width="80px" :label-position="labelPosition">
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple" style="margin-right:20px">
          <el-form-item label="主机列表">
          <el-select v-model="taskForm.hosts" multiple placeholder="请选择主机" style="width:100%">
            <el-option-group
              class="group"
              v-for="group in list"
              :key="group.group_id"
              :label="group.group_name"
              @click.native="test">
              <el-option
                v-for="item in group.hosts"
                :key="item.host_id"
                :label="item.hostname"
                :value="item.host_id">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content bg-purple-light" style="margin-right:20px">
          <el-form-item label="PlayBook列表">
          <el-select v-model="taskForm.playbook" placeholder="请选择playbook" style="width:100%" @change="getPlayOptions">
            <el-option
              v-for="item in playbooks"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :item="playItem">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
      </el-col>
    </el-row>

    <el-row>
    <el-col :span="12">
        <div class="grid-content bg-purple" style="margin-right:20px">
          <el-form-item label="参数列表">
          <el-select v-model="optionValue" placeholder="请选择参数" style="width:100%" filterable @change="editOption">
              <el-option
                v-for="item in taskOptions.items"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
        <el-form-item v-show="isEnv" label="运行环境">
        <el-switch
          style="display: block;margin-top:10px"
          v-model="taskQuery.env"
          :active-value=2
          :inactive-value=1
          active-color="#ff4949"
          inactive-color="#13ce66"
          active-text="生产环境"
          inactive-text="测试环境"
          @change="changeSwitch"
          >
        </el-switch>
        </el-form-item>
      </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div>
          <el-upload
            v-if="showUpload"
            ref="upload"
            class="upload-demo"
            :limit="1"
            action="sdf"
            :http-request="customUpload"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.zip文件</div>
          </el-upload>
        </div>
      </el-col>
    </el-row>
    
    <div class="editor-container" style="margin-top:15px">
      <json-editor ref="jsonEditor" v-model="taskForm.extra_vars" />
    </div>

    <el-button type="primary" style="margin-top:10px;" @click.native.prevent="handleSubmit">提交</el-button>
    <el-checkbox v-model="checked" style="margin-left:30px">提交锁，防止误提交</el-checkbox>
  </el-form>
  <el-divider></el-divider>
  <div>
      <el-button type="success" size="medium" round @click="startSSHTest">测试ssh连接</el-button>
      <el-button type="danger" size="medium" round @click="stopSSHTest">停止测试</el-button>
      <el-checkbox style="margin-left:30px" v-model="clean">停止时,清空测试记录</el-checkbox>
      <el-card class="ssh-card">
        <div v-for="line, index in testSSHResult" :key="index">
          <p :class="line[1]?'green-class':'red-class'">{{ index + 1 }} <span>{{ line[0] }}</span> 用时{{ line[2] }}秒 &nbsp;&nbsp; {{ line[3] | parseTime('{h}:{i}:{s}') }} </p>
        </div>
      </el-card>
    </div>

  </div>
</template>
<script>
import store from '@/store'
import { getToken } from '@/utils/auth'
import JsonEditor from '@/components/JsonEditor'
import { hostGroupSelect, getPlayBooks } from '@/api/inventory'
import { submitTask, getTaskOptions, distUpload, testSSHConn } from '@/api/task'
import { getStoken } from '@/api/wiki'
export default {
  name: 'TaskEditPage',
  components: { JsonEditor },
  data() {
    return {
      showUpload: false,
      stoken: '',
      isEnv: false,
      playItem: '',
      checked: false,
      labelPosition: 'top',
      taskForm: {
        hosts: '',
        playbook: '',
        options: '',
        extra_vars: null
      },
      list: '',
      playbooks: '',
      playsObj: '',
      taskOptObj: '',
      options: '',
      oldOptions: '',
      taskOptions: '',
      taskQuery: {
        playbook: undefined,
        env: 1
      },
      fileList: [],
      optName: '',
      testSSHResult: [],
      timer: null,
      clean: false,
      optionValue: null,
      is_upload: false,
      errObj: null
    }
  },
  created() {
    this.getData()
    this.getPlay()
    this.fetchStoken()
  },
  destroyed() {
    // 路由改变时清楚timer
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // 设置请求头中的token
    setToken() {
      if (store.getters.token) {
        return {'X-Token': getToken()}
      }
    },
    // 返回文件上传地址
    getURL() {
      return process.env.VUE_APP_BASE_API + "upload_dist" + "?option=" + this.optName
    },
    // 上传之前判断文件名
    beforeUpload(file) {
      // 先选择参数才可上传
      if(!this.optName) {
        this.$message.error('请先选择参数')
        return false
      }
      // 判断文件名后缀是否为.zip
      let fileArr = file.name.split(".")
      let suffix = fileArr[fileArr.length - 1]
      if(suffix != "zip") {
        this.$message.error('请上传zip文件')
        return false
      }
    },
    // 删除文件之前的钩子
    beforeRemove(file, fileList) {
      this.is_upload = false
    },
    // 文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$message.warning("当前限制选择 1 个文件")
    },
    // 上传成功钩子
    handleUploadSuccess(res, file, fileList) {
      if (res.code === 2000) {
        this.$message.success('文件上传成功')
        this.is_upload = true
      } else {
        this.$message.error('文件上传失败')
        this.is_upload = false
      }
    },
    // 上传失败钩子
    handleUploadFailed(err, file, fileList) {
      console.log(err)
      this.errObj = JSON.parse(err.message)
      this.$message.error(this.errObj.message)
      this.is_upload = false
    },
    customUpload(file) {
      // this.generatorFileMd5(file.file)
      // 自定义上传
      const param = new FormData()
      param.append('files', file.file)
      const query = { 'option': this.optName }
      distUpload(param, query).then(res => {
        console.log(res)
        if (res.code === 2000) {
          this.$message.success('文件上传成功')
          this.is_upload = true
        } else {
          this.$message.error('文件上传失败')
          this.$refs.upload.clearFiles()
          this.is_upload = false
        }
      }).catch(err => {
        console.log(err)
        this.$refs.upload.clearFiles()
        this.is_upload = false
      })
    },
    fetchStoken() {
      getStoken().then(res => {
        this.stoken = res.stoken
      }).catch(err => {
        console.log(err)
      })
    },

    async getData() {
      const { data } = await hostGroupSelect()
      this.list = data
      console.log(data)
    },

    async getPlay() {
      const { items } = await getPlayBooks()
      this.playbooks = items
      this.playsObj = this.playbooks.reduce((acc, cur) => {
        acc[cur.id] = cur
        return acc
      }, {})
      console.log(this.playsObj)
    },

    async changeSwitch() {
      this.taskForm.extra_vars = null
      this.taskOptions = ''
      this.optionValue = ''
      this.taskOptions = await getTaskOptions(this.taskQuery)
      if (this.taskOptions.items.length === 0) {
        this.taskOptions = ''
        this.optionValue = ''
      }
    },

    async getPlayOptions(val) {
      this.taskForm.extra_vars = null
      this.taskQuery.env = undefined
      this.taskOptions = ''
      this.optionValue = ''
      this.isEnv = this.playsObj[val].is_env
      this.taskQuery.playbook = val
      this.taskQuery.env = 1
      this.taskOptions = await getTaskOptions(this.taskQuery)
      if (this.taskOptions.items.length === 0) {
        this.taskOptions = ''
        this.optionValue = ''
      }
      this.taskQuery.env = undefined

      // 判断是否需要上传
      if (this.playsObj[val].upload) {
        this.showUpload = true
      } else {
        this.showUpload = false
      }
    },
    test(event) {
      console.log(event.target.innerText)
      // let a = this.list.find(event.target.innerText)
      // console.log(a)
    },
    async editOption(val) {
      const data = await getTaskOptions(this.taskQuery)
      this.taskOptions = data
      console.log(this.taskOptions.items)
      this.taskForm.options = val
      this.taskOptObj = data.items.reduce((acc, cur) => {
        acc[cur.id] = cur
        return acc
      }, {})
      this.optName = this.taskOptObj[val].name
      this.taskForm.extra_vars = this.taskOptObj[val].content
    },
    async handleSubmit() {
      console.log(this.taskForm)
      if (!this.checked) {
        this.$message({
          showClose: true,
          message: '请打开锁',
          type: 'error'
        })
        // 重新获取stoken
        this.fetchStoken()
        return false
      }
      console.log(this.taskForm.extra_vars)
      if (!this.taskForm.extra_vars) {
        this.taskForm.extra_vars = {}
        // console.log(111)
      } else {
        this.taskForm.extra_vars = JSON.parse(this.taskForm.extra_vars)
      }
      const params = { stoken: this.stoken }
      const taskResult = await submitTask({
        hosts: this.taskForm.hosts,
        playbook: this.taskForm.playbook,
        option: this.taskForm.options,
        extra_vars: this.taskForm.extra_vars,
        is_upload: this.is_upload
      }, params).catch(err => {
        this.fetchStoken()
      })
      this.$router.push({ name: 'TaskDetail', params: { id: taskResult.pk }})
    },
    async getSSHResult() {
      const { time, status, msg, timestamp } = await testSSHConn()
      this.testSSHResult.push([msg, status, time, timestamp])
      // 滚动到窗口底部
      const container = this.$el.querySelector('.ssh-card')
      console.log(container.scrollHeight)
      container.scrollTop = container.scrollHeight
    },
    flushResult() {
      this.timer = setInterval(
        () => {
          setTimeout(this.getSSHResult, 0)
        }, 2000)
    },
    startSSHTest() {
      if (this.timer) {
        console.log(this.timer)
        return
      }
      this.testSSHResult = []
      this.flushResult()
      // 滚动到页面最底部
      this.$nextTick(() => {
        // window.scrollTo(0,0)
        window.scrollTo(0, document.documentElement.clientHeight)
      })
      this.$message({
        message: '开始测试ssh连接',
        type: 'success'
      })
    },
    stopSSHTest() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.clean) {
        this.testSSHResult = []
      }
      this.$message({
        message: '测试已结束',
        type: 'success'
      })
    }
    // cleanTestResult() {
    //   this.clean = !this.clean
    // }
  }
}
</script>
<style>
.group:hover {
  cursor:pointer;
}
.task-title {
  color: #5B8DBC;
  text-align: center  ;
}
.ssh-card {
  margin-top: 15px;
  width: 480px;
  height: 300px;
  overflow-y: scroll;
}
.red-class {
  color: red;
}
.green-class {
  color: green;
}
</style>
