<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button 
            icon="el-icon-s-home"
            type="text"
            @click="changeFolder(null)">
            文件库
        </el-button>
        <!-- <span>df</span> -->
        <el-button
          style="float: right; padding:5px 5px; margin-top:8px"
          icon="el-icon-circle-plus-outline"
          type="success"
          @click="handleCreate"
        >新建文件夹</el-button>
      </div>
      <el-table 
        v-loading="listLoading"
        :data="fileData" 
        style="width: 100%"
        fit
        highlight-current-row
      >
        <el-table-column prop="filename" label="名称" width="250">
          <template slot-scope="{row}">
            <div v-if="row.file_type == 1">
              <i class="el-icon-document"></i>
              <span>{{ row.filename }}</span>
            </div>
            <div v-else>
              <el-button 
              icon="el-icon-folder"
              type="text"
              @click="changeFolder(row.id)"
              >{{ row.filename }}
              </el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="文件大小" width="250">
          <template slot-scope="{row}">
            <div v-if="row.file_type == 1">
              {{ row.file_size }}
            </div>
            <div v-else>
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新者" width="200">
          <template slot-scope="{row}">
            <span>{{ row.user }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="250">
          <template slot-scope="{row}">
            <!-- <span>{{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span> -->
            <span>{{ row.update_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
          </template>
        </el-table-column>
        <el-table-column
        label="操作"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row,$index}">
          <!-- @click="handleUpdate(row)" -->
          <el-button
            type="text"
            size="small"
            icon="el-icon-edit"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-delete"
          >删除</el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger">删除</el-button> -->
        </template>
      </el-table-column>
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
import { validFolderExist } from "@/utils/validate"
import { getFileList, addFolder } from "@/api/file"
import { parseTime } from '@/utils'


export default {
  name: "File",
  data() {
    const validateFolder = (rule, value, callback) => {
      if(!value.trim()){
        return callback(new Error("文件夹不能为空"));
      }
      validFolderExist(value, this.fileQuery.folder).then(result => {
        if (result) {
          return callback(new Error("文件夹已存在"));
        } else {
          callback();
        }
      });
    };
    return {
      fileData: null,
      listLoading: true,
      dialogStatus: "",
      dialogFormVisible: false,
      textMap: {
        update: "编辑文件夹",
        create: "新建文件夹"
      },
      folderForm: {
        folderName: ""
      },
      formLabelWidth: "120px",
      fileQuery: {
        folder: null
      },
      rules: {
        folderName: [
          { required: true, message: "文件夹必填", trigger: "blur" },
          { required: true, validator: validateFolder, trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getFileData()
  },
  methods: {
    handleCreate() {
      // this.$refs.folderForm.resetFields();
      this.dialogStatus = "create";
      console.log(this.fileQuery)

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //重置表单
        this.$refs.folderForm.resetFields();
        this.$refs["folderForm"].clearValidate();
      })
    },
    createFolder(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.fileQuery.folder)
          const formData = { 
            "name": this.folderForm.folderName.trim(),
            "folder_id": this.fileQuery.folder?this.fileQuery.folder:0
          }
          console.log(formData)
          addFolder(formData).then((response) => {
            console.log(response)
            const { id } = response
            // this.temp.id = id
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
    async getFileData() {
      this.listLoading = true
      // 是否有父级目录
      let query = this.fileQuery.folder?this.fileQuery:null
      const { items, parent_id } = await getFileList(query)
      this.fileData = items
      this.fileQuery.folder = parent_id
      setTimeout(() => {
          this.listLoading = false
      }, 500)
      // console.log(data)
    },
    changeFolder(id) {
      this.fileQuery.folder = id
      this.getFileData()

    }
  }
}
</script>

<style scoped>
</style>