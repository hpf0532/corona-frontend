<template>
    <div class="info-container">
       <el-card shadow="never">
            <div slot="header" class="clearfix">
                <span>文章分类</span>
            </div>
            <div class="category-item all-posts">
                <span><el-button type="text" @click="filterPost()">所有文章</el-button></span>

            </div>
            <hr/>
            <div v-for="item in categoryList" :key="item.id" class="text item">
                <div class="category-item">
                    <span><el-button type="text" @click="filterPost(item.id)">{{ item.name }}</el-button></span>
                    <span style="float: right">
                        <el-badge class="item" :value="item.posts" type="primary"></el-badge>
                        
                    </span>
                </div>
                <hr/>
            </div>
        </el-card>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        query: {
        type: Object,
        default: () => {
            return {
                page: 1,
                limit: 20,
            }
        }
    }
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters([
        'categoryList',
        'filterQuery'
    ]),
    },
    created() {

    },
    methods: {
        fetCategorys() {
            this.$store.dispatch('wiki/getCategorys').then(response => {
            }).catch(e => {
                console.log(e)
            })
        },
        filterPost(id) {
            this.$set(this.query, "category_id", id)
            this.$store.commit('wiki/SET_QUERY', this.query)

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
.category-item {
    margin: 10px 0px 10px 0px;
    .item {
        padding: 15px 15px 15px 15px;
    }
}
.all-posts {
    margin-top: -5px;
}
</style>