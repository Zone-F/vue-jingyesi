<template>
  <section>
    <el-tabs v-model="activeName" @tab-click="showOld">
      <el-tab-pane label="发起活动" name="first">
        <p>当前用户:<span class="username">{{this.$store.state.user}}</span></p>
        <el-form ref="form.newAct" :model="form.newAct" status-icon label-width="80px" :rules="formrules.actRule" @submit.native="newsubmit">
          <el-form-item label="主选图书" prop="book">
            <el-input v-model="form.newAct.book" placeholder="主选书籍，无需加书名号" ref="form.newAct.book" value="《》"></el-input>
          </el-form-item>
          <el-form-item label="备选图书" prop="rebook">
            <el-input v-model="form.newAct.rebook" placeholder="备选书籍，无需加书名号"></el-input>
          </el-form-item>
          <el-form-item label="活动时间">
            <el-col :span="11">
              <el-date-picker type="date" placeholder="开始日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" prop="begdata" v-model="form.newAct.begdate"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker type="date" placeholder="结束日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" prop="enddata" v-model="form.newAct.enddate"></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" native-type="submit" :disabled="!islive" plain>立即创建</el-button>
            <el-button native-type="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="正在进行" name="second">
        <!--参与人员列表-->
        <p>发起人:<span style="margin: 5px;" class="username">{{form.nowAct.user}}</span></p>
        <hr/>
        <p >参与人员:<span style="margin: 5px;" v-for="user in form.nowAct.users" :key="user.id" class="username">{{user}}</span></p>
        <hr/>
        活动时间: <span class="username">{{form.nowAct.begdate}}--{{form.nowAct.enddate}}</span>
        <hr/>
        <!--图书选择多选框-->
          主选图书：
          <el-checkbox-group v-model="bookList">
            <el-checkbox  style="margin-left: 10px" v-for="book in form.nowAct.bookList" :label="book" :key="book"><p class="check-box">{{book}}</p></el-checkbox>
          </el-checkbox-group>
        <hr/>
          备选图书:
          <el-checkbox-group v-model="bookList">
            <el-checkbox style="margin-left: 10px" class="check-box" v-for="book in form.nowAct.rebookList" :label="book" :key="book"><p class="check-box">{{book}}</p></el-checkbox>
          </el-checkbox-group>
        <!--图书选择多选框结束-->
          <el-button type="primary" @click.native="dialogFormVisible = true" class="margin-top" :disabled="islive" plain>我要加入</el-button>
          <el-button type="primary" class="margin-top" @click.native="newbooklist" :disabled="islive" plain>生成我的书单</el-button>
          <!--加入活动操作框-->
          <el-dialog title="提交书籍" :visible.sync="dialogFormVisible">
            <el-form :model="form.nowAct">
              <el-form-item label="主选图书" >
                <el-input v-model="form.nowAct.join.book" placeHolder="不需要加书名号"></el-input>
              </el-form-item>
              <el-form-item label="备选图书" >
                <el-input v-model="form.nowAct.join.rebook" placeholder="不需要加书名号"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click.native="userjoin">确 定</el-button>
            </div>
          </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="活动详情" name="third">
        <!--参与人员书单详情-->
        <el-table :data="userinfo">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="书单">
                  <p v-for="book in props.row.booklist" :key="book">{{ book }}</p>
                </el-form-item>
                <el-form-item label="读后感">
                  <p v-for="(article, index) in props.row.articlelist" :key="index">
                    <el-button type="text" @click="openArticle(article.body)">{{ article.title }}</el-button></p>
                  <el-button  type="primary" @click="articleFormVisible = true" class="margin-top" size="small">提交最新读后感</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            label="参与用户及个人书单"
            prop="user">
          </el-table-column>
        </el-table>
        <!--参与人员书单详情结束-->
        <!--提交读后感操作框-->
        <el-dialog title="读后感提交" :visible.sync="articleFormVisible">
          <el-form :model="form.nowAct">
            <el-form-item label="读后感标题" >
              <el-input v-model="form.nowAct.articleTitle" placeHolder="文章标题"></el-input>
            </el-form-item>
            <el-form-item label="读后感链接" >
              <el-input v-model="form.nowAct.article" placeHolder="文章网页"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="articleFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="newarticle">确 定</el-button>
          </div>
        </el-dialog>
        <!--提交读后感操作框结束-->
      </el-tab-pane>
      <el-tab-pane label="往期活动" name="fourth">
        <el-card class="box-card">
          <div slot="header">
            <span>发起人: <b>{{oldData.allData[oldData.currentPage - 1].user}}</b></span>
          </div>
          <el-collapse v-model="oldData.activeName" accordion>
            <el-collapse-item title="参与用户" name="1">
              <p><b>参与用户:<span v-for="user in oldData.allData[oldData.currentPage - 1].users" :key="user">{{user}}</span></b></p>
            </el-collapse-item>
            <el-collapse-item title="活动时间" name="2">
              <p><b>开始时间: {{oldData.allData[oldData.currentPage - 1].begdate}}</b></p>
              <p><b>结束时间: {{oldData.allData[oldData.currentPage - 1].enddate}}</b></p>
            </el-collapse-item>
            <el-collapse-item title="书单" name="3">
              <span v-for="book in oldData.allData[oldData.currentPage - 1].book" :key="book"><b>{{book}}</b></span>
            </el-collapse-item>
            <el-collapse-item title="备选书单" name="4">
              <span v-for="book in oldData.allData[oldData.currentPage - 1].rebook" :key="book"><b>{{book}}</b></span>
            </el-collapse-item>
            <el-collapse-item title="用户书单及读后感" name="5">
              <el-card shadow="always" v-for="item in oldData.allData[oldData.currentPage - 1].userinfo" :key="item.id">
                <p><b>用户: {{item.user}}</b></p>
                <p><b>书单:<span v-for="book in item.booklist" :key="book.id">{{book}}</span></b></p>
                <p><b>读后感地址:<span v-for="article in item.articlelist" :key="article.id">
                      <el-button type="text" @click="openArticle(article.body)">{{ article.title }}</el-button>
                    </span></b></p>
              </el-card>
            </el-collapse-item>
          </el-collapse>
        </el-card>
        <br>
        <el-pagination
          background
          @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :current-page="oldData.currentPage"
          :total="oldData.dataLength"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Activity',
  data () {
    return {
      // Tab菜单的值
      activeName: 'first',
      // 用户选择的书单列表
      bookList: [],
      // 活动是否进行中
      islive: true,
      form: {
        // 新活动
        newAct: {
          book: '《》',
          rebook: '《》',
          begdate: '',
          enddate: ''
        },
        // 正在进行的活动
        nowAct: {
          // 发起人
          user: '',
          users: [],
          bookList: [],
          rebookList: [],
          begdate: '',
          enddate: '',
          join: {
            book: '',
            rebook: ''
          },
          article: '',
          articleTitle: ''
        }
      },
      formrules: {
        actRule: {
          book: [{ required: true, message: '', trigger: 'blur' }],
          rebook: [{ required: true, message: '', trigger: 'blur' }]
        },
        articleRule: {
          title: [{ required: true, message: '不能为空', trigger: 'blur' }],
          body: [{ required: true, message: '不能为空', trigger: 'blur' }]
        }
      },
      // 我要加入活动操作框的隐显
      dialogFormVisible: false,
      articleFormVisible: false,
      // 用户书单，及读后感信息
      userinfo: [],
      oldData: {
        currentPage: 1,
        // 总页数
        dataLength: 1,
        activeName: 1,
        allData: [{
          user: '',
          users: ['', ''],
          book: ['', ''],
          rebook: ['', ''],
          begdate: '',
          enddata: '',
          userinfo: [{user: '', booklist: ['', ''], articlelist: [{title: '', body: ''}]}]
        }]
      }
    }
  },
  methods: {
    beBook () {
      alert(this.$refs.form.newAct.book)
    },
    // 检查活动时间是否已经过去
    // 获取行中活动的数据
    nowdata () {
      axios.post('/getactdata', {})
        .then((response) => {
          // console.log(response)
          if (response.status === 200) {
            this.$set(this.$data.form.nowAct, 'users', response.data[0].users)
            this.$set(this.$data.form.nowAct, 'bookList', response.data[0].book)
            this.$set(this.$data.form.nowAct, 'rebookList', response.data[0].rebook)
            this.$set(this.$data.form.nowAct, 'begdate', response.data[0].begdate)
            this.$set(this.$data.form.nowAct, 'enddate', response.data[0].enddate)
            this.$set(this.$data.form.nowAct, 'user', response.data[0].user)
            this.$set(this.$data, 'userinfo', response.data[0].userinfo)
          }
          if (new Date() < new Date(this.$data.form.nowAct.enddate.replace(/-/g, '/'))) {
            // 活动尚在进行中
            this.$set(this.$data, 'islive', false)
          } else {
            // 当前活动已经结束
            this.$set(this.$data, 'islive', true)
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 发起新活动
    newsubmit () {
      const mybook = this.form.newAct.book.BeBook()
      alert(mybook)
      axios.post('/newact', {
        book: this.form.newAct.book,
        rebook: this.form.newAct.rebook + '(备选)',
        begdate: this.form.newAct.begdate,
        enddate: this.form.newAct.enddate,
        user: this.$store.state.user
      })
        .then((response) => {
          if (response.status === 200) {
            this.$set(this.$data.form.nowAct, 'users', response.data.users)
            this.$set(this.$data.form.nowAct, 'bookList', response.data.book)
            this.$set(this.$data.form.nowAct, 'rebookList', response.data.rebook)
            this.$set(this.$data.form.nowAct, 'begdate', response.data.begdate)
            this.$set(this.$data.form.nowAct, 'enddate', response.data.enddate)
            this.$set(this.$data.form.nowAct, 'user', response.data.user)
            this.$set(this.$data, 'islive', false)
            this.$message({
              message: '发起活动成功',
              type: 'success'
            })
            this.activeName = 'second'
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 新用户加入活动
    userjoin () {
      let user = this.form.nowAct.users.find((value) => { return value === this.$store.state.user })
      if (new Date() < new Date(this.$data.form.nowAct.begdate.replace(/-/g, '/'))) {
        if (!user) {
          axios.post('/userjoin', {
            user: this.$store.state.user,
            book: this.form.nowAct.join.book,
            rebook: this.form.nowAct.join.rebook + '(备选)'
          })
            .then((response) => {
              console.log(response)
              if (response.status === 200) {
                this.$set(this.$data.form.nowAct, 'users', response.data.users)
                this.$set(this.$data.form.nowAct, 'bookList', response.data.book)
                this.$set(this.$data.form.nowAct, 'rebookList', response.data.rebook)
                this.$message.success('加入活动成功')
              }
            })
          this.dialogFormVisible = false
        } else {
          this.$message.error('该用户已经参加活动')
        }
      } else { this.$message.error('活动已经开始，暂不能参加') }
    },
    // 用户生成书单
    newbooklist () {
      // 检查用户是否具备加入资格
      let user = this.form.nowAct.users.find((value) => { return value === this.$store.state.user })
      const usernow = Boolean(user)
      if (usernow) {
        // 检查用户是否已经生成书单
        let user = this.form.nowAct.users.find((value) => { return value === this.$store.state.user })
        let usernow = Boolean(user)
        if (usernow) {
          this.$message.error('您已经生成了你的书单')
        } else {
          if (this.bookList.length === 0) {
            this.$message.warning('请选择书籍来生成书单')
          } else {
            axios.post('/newbooklist', {
              user: this.$store.state.user,
              booklist: this.bookList
            })
              .then((response) => {
                if (response.status === 200) {
                  this.$set(this.$data, 'userinfo', response.data.userinfo)
                  this.$message.success('书单生成成功')
                  this.activeName = 'third'
                }
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        }
      } else {
        this.$message.error('您还未加入活动，请先加入')
      }
    },
    // 用户提交读后感
    newarticle () {
      axios.post('/subarticle', {
        user: this.$store.state.user.BeBook(),
        title: this.form.nowAct.articleTitle.BeBook(),
        body: this.form.nowAct.article.BeBook()
      })
        .then((response) => {
          if (response.status === 200) {
            console.log(response)
            this.$set(this.$data, 'userinfo', response.data.userinfo)
            this.$message.success('读后感提交成功')
          }
        })
        .catch(function (error) {
          console.log(error)
        })
      this.articleFormVisible = false
    },
    // 获取往期活动的全部数据
    showOld  () {
      if (this.activeName === 'fourth') {
        axios.post('/getold', {})
          .then((response) => {
            console.log(response)
            this.$set(this.$data.oldData, 'allData', response.data)
            this.$set(this.$data.oldData, 'dataLength', response.data.length * 10)
          })
      }
    },
    // 分页发生变化
    handleCurrentChange (currentPage) {
      this.oldData.currentPage = currentPage
    },
    // 打开读后感
    openArticle (url) {
      window.open(url)
    }
  },
  created: function () {
    // 拿到活动数据
    this.nowdata()
  }
}
</script>

<style scoped>
.username{
  color: black;
}
.check-box{
  font-size: 17px;
}
.margin-top{
  margin-top: 10px
}
hr{
  color: black;
}
span{
  margin-right: 10px;
}
</style>
