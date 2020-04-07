<template>
</template>
<script>
import { confirmEmail } from '@/api/user'
export default {
    data() {
        return {
            params: '',
            loading: null,
            token: ''
        }
    },
    created() {
        this.loading = this.$loading({
            lock: true,
            text: '邮箱确认中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })
        this.validate_email()
        console.log(this.$route.fullPath)
    },
    methods: {
        async validate_email() {
            const query = this.$route.query
            this.params = this.$qs.parse(query)
            this.token = this.params.token
            if(!this.token) {
                this.$message({
                    showClose: true,
                    message: '邮箱确认失败，token缺失',
                    type: 'error'
                })
                this.$router.push({path: '/'})
                this.loading.close()
                return
            }
            console.log(query)

            const data = await confirmEmail(this.token)
            if(data.code === 20001 || data.code === 20002 ){
                this.$message({
                    showClose: true,
                    message: data.message,
                    type: 'success'
                })
            }else if(data.code === 50001){
                this.$message({
                    showClose: true,
                    message: data.message,
                    type: 'error'
                })
            }
            this.$router.push({path: '/'})
            this.loading.close()
            // console.log(this.params)
            // setTimeout(() => {
            //     this.loading.close();
            // }, 2000);

        }
    }
}
</script>
<style>
</style>