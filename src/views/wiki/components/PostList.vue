<template>
  <div class="post-list">
    <div v-if="postList.count">
      <div v-for="item in postList.items" class="post-container">
        <div class="user-block">
          <img class="img-circle" :src="item.avatar+avatarPrefix">
          <span class="username text-muted">{{ item.author }}</span>
          <span class="description">发布于: {{ item.create_time | parseTime('{y}-{m}-{d}') }}</span>
        </div>
        <div class="post">
          <div class="title">
            <router-link :to="'/wiki/posts/detail/'+item.id" class="link-type">
              <h2>{{ item.title }}</h2>
            </router-link>
          </div>
          <div class="summary">
            <p>{{ item.desc }}</p>
          </div>
          <div v-if="isAuthor" class="action fr">
            <router-link :to="'/wiki/posts/edit/'+item.id" class="action-type">
              编辑
            </router-link>
            <el-button class="delete" type="text" @click="handleDelete(item.id)">删除</el-button>
          </div>
        </div>
        <hr>
      </div>
    </div>
    <div v-else class="none-post">
      还没有文章哦
      <router-link class="link-create" to="/wiki/posts/create">
        动手写一篇
      </router-link>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="filterQuery.page"
      :limit.sync="filterQuery.limit"
      @pagination="fetchPosts"
    />
  </div>
</template>
<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
import { mapGetters } from 'vuex'
import { parseTime } from '@/utils'
import { deletePost } from '@/api/wiki'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  props: {
    query: {
      type: Object,
      default: () => {
        return {
          page: 1,
          limit: 20
        }
      }
    },
    isAuthor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      avatarPrefix
    }
  },
  computed: {
    ...mapGetters([
      'postList',
      'total',
      'filterQuery',
      'uid'
    ])
  },
  watch: {
    filterQuery: {
      handler(newName, oldName) {
        this.fetchPosts()
      },
      // 页面中处理
      // immediate: true,
      deep: true
    }
  },
  created() {
  },
  methods: {
    fetchPosts() {
      this.$store.dispatch('wiki/getPosts', this.filterQuery).then(response => {
        // this.total = this.postList.count
      }).catch(e => {
        console.log(e)
      })
    },
    async handleDelete(id) {
      await this.$confirm('确认删除这篇文档?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        deletePost(id).then(data => {
          this.$store.dispatch('wiki/getPosts', this.filterQuery)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch((e) => {
          console.log(e)
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
  hr {
      height: 2px;
      border: none;
      border-top:2px solid #EEEEEE;
  }
  .user-block {
    .username,
    .description {
      display: block;
      margin-left: 50px;
      padding: 2px 0;
    }
    .username{
      font-size: 16px;
      color: #000;

    }
    :after {
      clear: both;
    }
    .img-circle {
      border-radius: 50%;
      width: 40px;
      height: 40px;
      float: left;
    }
    span {
      font-weight: 500;
      font-size: 12px;
    }
  }
.post-container {
    margin-bottom: 10px;;
}
.post {
    margin: 10px 0px 10px 0px;
    .link-type,
    .link-type:focus {
        color: black;
        cursor: pointer;
    }
    .link-type:hover {
        color: rgb(32, 160, 255);
    }
    .action-type {
        margin-right: 10px;
    }
    .delete,
    .delete:focus,
    .action-type,
    .action-type:focus {
        color: #999;
        cursor: pointer;
    }
    .delete:hover,
    .action-type:hover {
        color: rgb(32, 160, 255);
    }
    .summary {
        line-height: 1.5;
    }
    .delete {
        font-size: 12px;
    }
    .action {
        color: #999;
        font-size: 12px;
    }
    .fr {
        float: right;
    }
    &:after {
        content: '';
        display: block;
        clear: both;
    }
}
.none-post {
    background-color: #FAFBFC;
    font-size: 16px;
    height: 200px;
    text-align: center;
    line-height: 200px;
    font-family: inherit;
    color: #909399;
    .link-create {
        color: #2780E3;
    }
}
</style>>
