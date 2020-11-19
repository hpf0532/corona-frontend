<template>
  <div
    v-loading="loading"
    class="post-container"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <h1 class="artical-title">{{ post.title }}</h1>
    <div class="artical-title-list">
      <div class="article-info">
        <img class="img-circle" :src="post.avatar+avatarPrefix">
        <span class="author-name">{{ post.author }}</span>
        <span class="time fr">{{ post.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </div>
    </div>
    <div class="markdown-body content" v-html="post.body" />
    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="300" :back-position="50" transition-name="fade" />
    </el-tooltip>
  </div>
</template>
<script>
import 'github-markdown-css'
import hljs from 'highlight.js'
import { parseTime } from '@/utils'
import { getPostDetail } from '@/api/wiki'
import BackToTop from '@/components/BackToTop'

const highlightCode = () => {
  console.log('hight')
  const preEl = document.querySelectorAll('pre')

  preEl.forEach((el) => {
    hljs.highlightBlock(el)
  })
}

const avatarPrefix = '?imageView2/1/w/80/h/80'
export default {
  components: { BackToTop },
  props: {
    id: {
      type: Number
    }
  },
  data() {
    return {
      loading: false,
      post: {},
      avatarPrefix
    }
  },
  created() {
    this.fetchPostDetail()
  },
  mounted() {
    highlightCode()
  },
  updated() {
    highlightCode()
  },
  methods: {
    fetchPostDetail() {
      this.loading = true
      getPostDetail(this.id).then(response => {
        this.post = response
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.post-container {
    .artical-title {
        font-size: 36px;
        line-height: 1.2;
        font-weight: normal;
        margin-top: 20px;
    }
    .artical-title-list {
        margin-top: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
    }

    .img-circle {
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 12px;
        // float: left;
    }

    .time {
        font-size: 12px;
        color: #bababa;
        line-height: 35px;
        cursor: default;

    }
    .fr {
        float: right;
    }
    .content {
        margin-top: 15px;
        margin-bottom: 20px;
    }

}

</style>
