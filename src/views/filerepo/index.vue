<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
          <el-button 
              icon="el-icon-s-home"
              type="text"
              @click="changeFolder(null)">
              文件库
          </el-button>
        </span>
        <span v-for="(item, i) in breadcrumbList" :key="item.id">
          <el-button 
              icon="el-icon-caret-right"
              type="text"
              @click="changeFolder(item.id)">
              {{ item.name }}
          </el-button>&nbsp;
        </span>
        <el-button
          size="small"
          style="float: right; padding:6px 6px; margin-top:8px"
          icon="el-icon-circle-plus-outline"
          type="success"
          @click="handleCreate()"
        >新建文件夹</el-button>
        <el-upload
          class="upload-demo"
          style="float: right"
          ref='upload'
          action=""
          :before-upload="beforeUpload"
          :show-file-list="false"
          :on-change="hanldeChange"
          :on-remove="handleRemove"
          :http-request="upLoad"
          :limit="3"
          multiple
          :on-exceed="handleExceed"
          :file-list="fileList"
          >
          <el-button 
            style="padding:6px 6px; margin-top:8px; margin-right:3px"
            icon="el-icon-upload" 
            size="small" type="primary">上传文件
          </el-button>
        </el-upload>
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
          <span v-if="row.file_type == 2">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-edit"
              @click="handleUpdate(row)"
            >编辑</el-button>
          </span>

          <span v-if="row.file_type == 1">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-download"
              @click="handleDownload(row)"
            >下载</el-button>
          </span>

          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="handleDelete(row, $index)"
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
        <el-button type="primary" @click="dialogStatus==='create'?createFolder():updateFolder()">确 定</el-button>
      </div>
    </el-dialog>

    <el-card v-if="showProgress" class="progress-card">
      <div slot="header" class="clear">
        <i class="el-icon-upload2"></i>
        <span>上传进度条</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="closeCard">关闭</el-button>
      </div>
      <div v-for="(val,key,index) in progressObj" :key="key" class="text item">
        <div style="margin-bottom:10px">
          <span>{{ key }}</span>
        </div>
        
        <el-progress :text-inside="true" :stroke-width="26" :percentage="val"></el-progress>
        <br/>
      </div>
    </el-card>
  </div>
</template>

<script>
import { validFolderExist } from "@/utils/validate"
import { getFileList, addFolder, editFolder, deleteFile, getSTSToken, postFile } from "@/api/file"
import { parseTime } from '@/utils'
import { client } from '@/utils/oss'


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
      dataObj:{},
      fileList:[],
      progressObj:{},
      fileData: null,
      listLoading: true,
      dialogStatus: "",
      showProgress: false,
      dialogFormVisible: false,
      // 导航条
      breadcrumbList: [],
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
    hanldeChange(file, fileList){
      // console.log(fileList)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeUpload(file) {
        return new Promise((resolve, reject) => {
        //从后台获取第一步所需的数据
        //getSTSToken 获取OSS秘钥的接口地址
        const fileInfo = {"name": file.name, "size": file.size}
        getSTSToken(fileInfo).then(response => {
          this.dataObj = response
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    upLoad(file) {
      this.progressObj = {}
      this.$refs.upload.clearFiles()
      const self = this
      let files = file.file,
          // point = files.name.lastIndexOf('.'),
          // suffix = files.name.substr(point),
          // fileName = files.name.substr(0, point),
          date = Date.parse(new Date()),
          fileNames = `${date}_${files.name}`

      console.log(files)
      
      
      // this.progressObj[files.name] = 0

      //fileNames上传文件的名称
      //file.file上传文件的内容

      setTimeout(
        () => {
          client(this.dataObj).multipartUpload(fileNames, file.file,
            {
              progress: function(p) {
                // 显示进度条
                self.showProgress = true
                self.progressObj[files.name] = Math.round(p * 100)
                self.$forceUpdate()
              }
            }
          
          ).then(result => {
            //下面是如果对返回结果再进行处理，根据项目需要
            let etag = result.etag.replace(/\"/g,"")
            // console.log(result, etag)
            const file = {
              "filename": files.name, 
              "file_size": files.size,
              "parent_id": this.fileQuery.folder?this.fileQuery.folder:0,
              "key": fileNames,
              "etag": etag
            }

            // setTimeout(
            //   () => {

            postFile(file).then(response => {
              this.fileData.unshift(response)
            })
            self.$message({
              message: `文件${files.name}上传成功`,
              type: 'success'
            })
            // Math.round(Math.random()* 4000)
            // )
          }).catch(err => {
            console.log(err)
            self.$message.error(`文件${files.name}上传失败`);
          })
        }, Math.round(Math.random()* 4000)
      )

      // setTimeout(function(){ uploadFile() }, Math.round(Math.random()* 1500))
    },
    handleDownload(row) {
      location.href = row.download_url
    },
    closeCard() {
      this.showProgress = false
    },
    handleCreate() {
      // this.$refs.folderForm.resetFields();
      this.dialogStatus = "create";
      console.log(this.fileQuery)

      this.dialogFormVisible = true;
      this.$nextTick(() => {
        //重置表单
        this.$refs["folderForm"].resetFields()
        this.$refs["folderForm"].clearValidate()
      })
    },
    handleUpdate(row) {
      // this.$refs.folderForm.resetFields();
      this.dialogStatus = "update"
      this.folderForm.id = row.id // copy obj
      this.folderForm.folderName = row.filename
      this.dialogFormVisible = true
      this.$nextTick(() => {
        //重置表单
        // this.$refs.folderForm.resetFields()
        this.$refs["folderForm"].clearValidate()
      })
    },
    handleDelete(row, index) {
        this.$confirm('文件夹包含的所有文件都会被删除?', '是否确定要删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        deleteFile(row.id).then(data => {
          this.fileData.splice(index, 1)
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
    createFolder() {
      this.$refs["folderForm"].validate(valid => {
        if (valid) {
          const formData = { 
            "name": this.folderForm.folderName.trim(),
            "folder_id": this.fileQuery.folder?this.fileQuery.folder:0
          }
          addFolder(formData).then((response) => {
            // const { id } = response
            // this.temp.id = id
            this.fileData.unshift(response)
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

    updateFolder() {
      this.$refs["folderForm"].validate(valid => {
        if (valid) {
          const formData = { 
            "name": this.folderForm.folderName.trim(),
            "folder_id": this.fileQuery.folder?this.fileQuery.folder:0
          }
          const { id } = this.folderForm
          editFolder(id, formData).then((response) => {
            // const { id } = response
            // this.temp.id = id
            const index = this.fileData.findIndex(v => v.id === this.folderForm.id)
            this.fileData.splice(index, 1, response)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功',
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
      const { items, parent_id, breadcrumb_list } = await getFileList(query)
      this.breadcrumbList = breadcrumb_list
      this.fileData = items
      this.fileQuery.folder = parent_id
      // setTimeout(() => {
      //     this.listLoading = false
      // }, 100)
      this.listLoading = false
      console.log(this.fileData)
    },
    changeFolder(id) {
      this.fileQuery.folder = id
      this.getFileData()

    }
  }
}
</script>

<style scoped>
.clear:before,
.clear:after {
  display: table;
  content: "";
}
.clear:after {
  clear: both
}
.progress-card {
  width: 480px;
  position: fixed;
  right: 15px;
  bottom: 15px;
}
</style>