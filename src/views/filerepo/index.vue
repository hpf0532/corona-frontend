<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文件</span>
        <!-- <span>df</span> -->
        <el-button
          style="float: right; padding:4px 3px"
          icon="el-icon-circle-plus-outline"
          type="success"
          @click="handleCreate"
        >新建文件夹</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form ref="folderForm" :rules="rules" :model="folderForm">
        <el-form-item label="文件夹名称" :label-width="formLabelWidth" prop="folderName">
          <el-input
            style="width: 300px"
            v-model="folderForm.folderName"
            autocomplete="off"
            placeholder="请输入文件夹名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createFolder('folderForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validFolderExist } from '@/utils/validate'

export default {
  name: "File",
  data() {
    const validateFolder = (rule, value, callback) => {
      validFolderExist(value).then(result => {
        if (result) {
          return callback(new Error('文件夹已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: "编辑文件夹",
        create: "新建文件夹"
      },
      folderForm: {
        folderName: "",
      },
      formLabelWidth: "120px",
      rules: {
        folderName: [
          { required: true, message: '文件夹必填', trigger: 'blur' },
          { required: true, validator: validateFolder, trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    handleCreate() {
      this.dialogStatus = "create"
      this.dialogFormVisible = true
    },
    createFolder(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
  }
}
</script>

<style scoped>
</style>