<template>
  <div id="app">
    <el-container>
      <el-header style="height: auto"> <Nav></Nav> </el-header>
      <el-main > <router-view style="max-width: 600px; margin: auto;"></router-view> </el-main>
    </el-container>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'
export default {
  name: 'App',
  components: {
    Nav
  }
}
</script>

<style>
</style>
