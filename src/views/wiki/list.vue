<template>
    <div class="index-container">
        <div class="filter-container"></div>
        <el-row :gutter="10">
            <el-col :span="18">
                <post-list></post-list>

            </el-col>
            <el-col :span="6">
                <div>
                <router-link to="/wiki/posts/create">
                    <el-button>我要写文章</el-button>
                </router-link>
                <category-info class="category-list"></category-info>
                </div>
            </el-col>
        </el-row>

    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import PostList from './components/PostList'
import CategoryInfo from './components/CategoryInfo'
// import 'tui-editor/dist/tui-editor.css' // editor ui
// import 'tui-editor/dist/tui-editor-contents.css' // editor content

export default {
    name: "Wiki",
    components: { PostList, CategoryInfo },
    data() {
        return {
            query: {
                page: 1,
                limit: 20
            }
        }
    },
    created() {
        this.getCategoryList()
    },
    mounted() {
         this.$store.commit('wiki/SET_QUERY', this.query)
    },
    methods: {
        async getCategoryList() {
            try{
                await this.$store.dispatch('wiki/getCategorys')
            } catch (error){
                console.log(error)
            }
        },
        test() {
            console.log(this.categoryList)
            console.log(this.haha)
        }
    },
    computed: {
        ...mapGetters([
        'categoryList',
        ]),

  },
    
}
</script>
<style lang="scss" scoped>
.category-list {
    margin-top: 20px;
}
.index-container {
    padding: 20px 20px 20px 45px;
}
</style>