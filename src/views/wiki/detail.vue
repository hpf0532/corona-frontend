<template>
  <div class="detail-container">
    <el-row :gutter="20">
      <el-col :span="14" :offset="5">
        <div>
          <article-detail :id="postId" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import ArticleDetail from './components/ArticleDetail'
export default {
  name: 'WikiDetail',
  components: { ArticleDetail },
  data() {
    return {
    }
  },
  computed: {
    postId: function() {
      return parseInt(this.$route.params.id)
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.detail-container {
    margin: 30px;
}
</style>
