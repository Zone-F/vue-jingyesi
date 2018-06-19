<template>
    <div>
      <el-menu :default-active="$route.path" class="el-menu-demo"  router mode="horizontal">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/activity">常规活动</el-menu-item>
        <el-menu-item index="/topic">主题阅读</el-menu-item>
        <el-menu-item index="/login"  v-if="!this.$store.state.token">登陆</el-menu-item>
        <el-menu-item index="/user" v-else>{{this.$store.state.user}}</el-menu-item>
        <el-menu-item index="" @click="logout" v-show="this.$store.state.token">退出登录</el-menu-item>
      </el-menu>
      <div class="line"></div>
    </div>
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
      activeIndex: '/'
    }
  },
  methods: {
    logout () {
      this.$store.commit('LOGOUT')
      this.$router.push({path: '/'})
      // location.reload()
      this.$message({
        message: '退出登录成功',
        type: 'success'
      })
    }
  }
}
</script>
<style scoped>

</style>
