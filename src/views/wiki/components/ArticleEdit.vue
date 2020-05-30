<template>
    <div class="createPost-container">
        <div class="createPost-main-container">
            <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
                <el-row>
                    <el-col :span="16">
                        <el-form-item label="标题" prop="title">
                            <el-input class="title" size="big" v-model="postForm.title" placeholder="请输入标题, 您可以输入50字"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <div class="editor-container">
                            <!-- <markdown-editor ref="markdownEditor" v-model="content" :language="language" height="300px" /> -->
                            <el-form-item prop="body">
                              <markdown-editor ref="markdownEditor" v-model="postForm.body" height="900px" />
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=16>
                      <el-form-item>
                          <el-select clearable  v-model="postForm.category_id" placeholder="请选择文章分类" style="width:60%">
                            <el-option
                              v-for="item in categoryList"
                              :key="item.id"
                              :label="item.name"
                              :value="item.id">
                            </el-option>
                          </el-select>
                      </el-form-item>
                    </el-col>
                </el-row>
                <el-row style="height:50px">
                  <el-card class="box-card">
                    <el-button type="primary" class="deploy" @click="submitForm">发布文章</el-button>
                    <el-button type="info" class="deploy">保存草稿</el-button>
                  </el-card>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
const content = `
**This is test**
* vue
* element
* webpack
`
import MarkdownEditor from '@/components/MarkdownEditor'
import { getCategorys, createPost } from '@/api/wiki'
export default {
  name: 'ArticleDetail',
  components: { MarkdownEditor },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
      const validateRequire = (rule, value, callback) => {
        if (value === '') {
          this.$message({
            message: rule.field + '为必传项',
            type: 'error'
          })
          callback(new Error(rule.field + '为必传项'))
        } else {
          callback()
        }
      }
      return {
        categoryList: [],
        query: {
          page: 1,
          limit: 20
        },
        html: '',
        postForm: {
            title: '',
            body: '',
            category_id: 1
        },
        content: content,
        loading: false,
        languageTypeList: {
        'en': 'en_US',
        'zh': 'zh_CN',
        'es': 'es_ES'
        },
        rules: {
          title: [{ required: true, validator: validateRequire, trigger: 'blur' }],
          body: [{ validator: validateRequire }],

      },
      }
  },
  computed: {
    language() {
      return this.languageTypeList['en']
    },
    categroy() {
      return this.postForm.category_id?this.postForm.category_id:null
    }
  },
  created() {
    this.getCategory()
  },
  methods: {
    async getCategory() {
      const data = await getCategorys()
      this.categoryList = data.items
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          console.log(this.postForm)
          this.html = this.$refs.markdownEditor.getHtml()

          const data = {title: this.postForm.title, body:this.html, category_id: this.categroy }

          createPost(data).then(res => {
            console.log(this.html)
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.$store.commit('wiki/SET_QUERY', this.query)
            this.$router.push({path: "/wiki/posts"})
          }).catch(err => {
            console.log(err)
          })

          // this.postForm.body = this.html

          // import('showdown').then(showdown => { //用了 Dynamic import
          //   const converter = new showdown.Converter();//初始化
          //   this.postForm.body = converter.makeMarkdown(this.html)//转化
          // })


          // this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>
<style lang="scss">
@import "~@/styles/mixin.scss";

.title .el-input__inner {
      height: 60px;
  } 
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.editor-container{
  margin-bottom: 30px;
}

.box-card {
  // margin-top: 20px;
  display: block;
  width: 100%;
  position: fixed;
  bottom: 0px;
  right: 0px;
}
.deploy {
  float:right;
  margin-right:20px;
  margin-bottom:10px
}
</style>