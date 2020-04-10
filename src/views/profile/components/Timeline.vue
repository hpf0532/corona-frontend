<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.create_time | parseTime('{y}/{m}/{d}')" placement="top">
        <el-card>
            <router-link :to="'/inventory/task/detail/'+item.id" class="link-type">
              <h4>{{ item.ansible_id }}</h4>
            </router-link>
          <p>{{ item.user }} executed {{ item.playbook }} at {{ item.create_time | parseTime('{y}/{m}/{d} {h}:{i}') }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getTimeLine } from '@/api/user'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      // timeline: [
      //   {
      //     timestamp: '2019/4/20',
      //     title: 'Update Github template',
      //     content: 'admin committed 2019/4/20 20:46'
      //   },
      //   {
      //     timestamp: '2019/4/21',
      //     title: 'Update Github template',
      //     content: 'admin committed 2019/4/21 20:46'
      //   },
      //   {
      //     timestamp: '2019/4/22',
      //     title: 'Build Template',
      //     content: 'admin committed 2019/4/22 20:46'
      //   },
      //   {
      //     timestamp: '2019/4/23',
      //     title: 'Release New Version',
      //     content: 'admin committed 2019/4/23 20:46'
      //   }
      // ]
      timeline: '',
      count: ''
    }
  },
  created() {
    this.getUserTask()
  },
  methods: {
    async getUserTask() {
      const data = await getTimeLine()
      this.timeline = data.items
      this.count = data.count
    }
  }
}
</script>