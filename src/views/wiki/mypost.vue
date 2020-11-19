<template>
  <div class="index-container">
    <!-- <div class="filter-container">filter</div> -->
    <el-row :gutter="10">
      <el-col :span="18">
        <post-list :is-author="true" />

      </el-col>
      <el-col :span="6">
        <div>
          <router-link to="/wiki/posts/create">
            <el-button>我要写文章</el-button>
          </router-link>
          <!-- <category-info class="category-list"></category-info> -->
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PostList from './components/PostList'

export default {
  name: 'MyDoc',
  components: { PostList },
  data() {
    return {
      query: {
        page: 1,
        limit: 20
      }
    }
  },
  computed: {
    ...mapGetters([
      'uid'
    ])
  },
  mounted() {
    this.$set(this.query, 'author_id', this.uid)
    console.log('------------------------')
    console.log(this.query)
    this.$store.commit('wiki/SET_QUERY', this.query)
  }
}
</script>
<style lang="scss" scoped>
.index-container {
    padding: 20px 20px 20px 45px;
}
</style>
