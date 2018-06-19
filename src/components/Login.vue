<template>
  <div style="max-width: 600px;height: auto">
  <el-radio-group>
      <el-button @click="loginLive=true">登陆</el-button>
      <el-button style=" margin-left: 0;" @click="loginLive=false">注册</el-button>
    </el-radio-group>
    <div v-if="loginLive">
      <el-row>
        <div class="grid-content bg-purple">
          <el-form  ref="loginForm" :model="loginForm" status-icon :rules="loginRule" :label-position="loginForm.labelPosition" label-width="80px">
            <el-form-item label="用户名" prop="user">
              <el-input v-model="loginForm.user"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input v-model="loginForm.pass"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitLogin('loginForm')">立即登陆</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-row>
    </div>
    <div v-else>
      <el-form :model="registerForm" status-icon :rules="registerRule" ref="registerForm"
               :label-position="registerForm.labelPosition" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="用户名" prop="user">
          <el-input v-model.trim="registerForm.user"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model.trim="registerForm.pass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model.trim="registerForm.checkPass" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRegister('registerForm')">注册</el-button>
          <el-button @click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data () {
    var checkEmpty = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('该项不能为空'))
      }
      callback()
    }
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 控制登陆/注册框的切换
      loginLive: true,
      loginForm: {
        labelPosition: 'top',
        user: '',
        pass: ''
      },
      loginRule: {
        user: [{ required: true, trigger: 'blur', validator: checkEmpty }],
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      registerForm: {
        labelPosition: 'top',
        user: '',
        pass: '',
        email: '',
        checkPass: ''
      },
      registerRule: {
        user: [{ required: true, trigger: 'blur', validator: checkEmpty }],
        pass: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        checkPass: [{ required: true, trigger: 'change', validator: checkPass }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册提交
    submitRegister () {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          axios.post('/register', {
            user: this.registerForm.user,
            pass: this.registerForm.pass,
            email: this.registerForm.email
          }).then((response) => {
            if (response.data === 1) {
              this.$message.success('注册成功')
              this.$data.loginLive = true
            } else if (response.data === -1) {
              this.$message.warning('用户名已经存在')
            }
          }).catch((error) => {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 登陆提交
    submitLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          axios.post('/login', {
            user: this.loginForm.user,
            pass: this.loginForm.pass
          })
            .then((response) => {
              if (response.data === -1) {
                this.$message.error('用户名或密码错误')
              } else {
                this.$store.commit('SET_TOKEN', response.data.token)
                this.$store.commit('GET_USER', response.data.user)
                this.$message.success('登陆成功')
                this.loading = false
                this.$router.push({name: 'index'})
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
