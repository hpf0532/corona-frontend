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
          <el-select v-model="taskOptions" placeholder="请选择参数" style="width:100%" filterable @change="editOption">
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
        <el-form-item v-if="isEnv" label="运行环境">
        <el-switch
          style="display: block;margin-top:10px"
          v-model="taskQuery.env"
          active-value="2"
          inactive-value="1"
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
            action="https://jsonplaceholder.typicode.com/posts/"
            :http-request = "customUpload"
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
  </div>
</template>
<script>
import JsonEditor from '@/components/JsonEditor'
import { hostGroupSelect, getPlayBooks } from '@/api/inventory'
import { submitTask, getTaskOptions, distUpload } from '@/api/task'
export default {
    name: 'TaskEditPage',
    components: { JsonEditor },
    data() {
      return {
        showUpload: false,
        upload: false,
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
          env: undefined
        },
        fileList: [],
        optName: ''
      }
    },
    created() {
      this.getData(),
      this.getPlay()
    },
    methods: {
      customUpload(file) {
        // this.generatorFileMd5(file.file)
        // 自定义上传
        let param = new FormData()
        param.append('files',file.file)
        let query = {"option": this.optName}
        distUpload(param, query).then(res => {
          if (res.code === 2000){
            this.$message.success("文件上传成功")

          }else{
            this.$message.error("文件上传失败")

          }
          this.$refs.upload.clearFiles()


        })
      },

      async getData(){
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
        this.taskOptions = await getTaskOptions(this.taskQuery)
        if(this.taskOptions.items.length == 0){
          this.taskOptions = ''
        }

      },

      async getPlayOptions(val) {
        this.taskForm.extra_vars = null
        this.taskQuery.env = undefined
        this.taskOptions = ''
        this.isEnv = this.playsObj[val].is_env
        this.taskQuery.playbook = val
        this.taskOptions = await getTaskOptions(this.taskQuery)
        if(this.taskOptions.items.length == 0){
          this.taskOptions = ''
        }
        this.taskQuery.env = undefined

        // 判断是否需要上传
        if(this.playsObj[val].upload){
          this.upload = true
        }else{
          this.upload = false
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

        // 显示上传按钮
        if (this.upload) {
          this.showUpload = true
        }else{
          this.showUpload = false
        }
        this.optName = this.taskOptObj[val].name
        this.taskForm.extra_vars = this.taskOptObj[val].content
      },
      async handleSubmit() {
        console.log(this.taskForm)
        if(!this.checked) {
          this.$message({
            showClose: true,
            message: '请打开锁',
            type: 'error'
         })
         return false
        }
        console.log(this.taskForm.extra_vars)
        if(!this.taskForm.extra_vars) {
          this.taskForm.extra_vars = {}
          // console.log(111)
        }else{
          this.taskForm.extra_vars = JSON.parse(this.taskForm.extra_vars)
        }        
        const taskResult = await submitTask({
          hosts: this.taskForm.hosts,
          playbook: this.taskForm.playbook,
          option: this.taskForm.options,
          extra_vars: this.taskForm.extra_vars
        })
        this.$router.push({name:'TaskDetail', params: {id: taskResult.pk}})
      }
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





</style>
