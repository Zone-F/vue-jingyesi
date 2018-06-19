<template>
    <div>
      <el-tabs v-model="activeName" @tab-click="showOld">
        <el-tab-pane label="参加活动" name="first">
          <el-form ref="form.newAct" :model="form.newAct" status-icon label-width="80px" :rules="formrules.actRule">
            <el-form-item label="活动主题" prop="topic">
              <el-input v-model="form.newAct.topic" placeholder="活动主题"></el-input>
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
            <el-form-item size="small">
              <el-button type="primary" native-type="submit" @click="newTopic" :disabled="!islive" plain>立即创建</el-button>
              <el-button native-type="reset">重置</el-button>
            </el-form-item>
          </el-form>
          当前主题:<b>{{form.actInfo.topic}}</b>
          <br>
          <el-form ref="form.joinAct" :model="form.joinAct" status-icon label-width="80px" :rules="formrules.joinRule">
            <el-form-item label="图书1" prop="book">
              <el-input v-model="form.joinAct.book" placeholder="不用加书名号"></el-input>
            </el-form-item>
            <el-form-item label="图书2" prop="rebook">
              <el-input v-model="form.joinAct.rebook" placeholder="不用加书名号"></el-input>
            </el-form-item>
            <el-form-item label="图书3" prop="rebook2">
              <el-input v-model="form.joinAct.rebook2" placeholder="不用加书名号"></el-input>
            </el-form-item>
            <el-form-item label="影视">
              <el-input v-model="form.joinAct.film" placeholder="若有多条,用逗号隔开"></el-input>
            </el-form-item>
            <el-form-item label="音乐">
              <el-input v-model="form.joinAct.music" placeholder="若有多条,用逗号隔开"></el-input>
            </el-form-item>
            <el-form-item size="small">
              <el-button type="primary" @click="userJoin" :disabled="islive" plain>立即加入</el-button>
              <el-button native-type="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="正在进行" name="second">
          <!--参与人员列表-->
          <p>发起人:<span style="margin: 5px;" class="username">{{form.actInfo.user}}</span></p>
          <hr/>
          <p >参与人员:<span style="margin: 5px;" v-for="user in form.actInfo.users" :key="user.id" class="username">{{user}}</span></p>
          <hr/>
          活动时间: <span class="username">{{form.actInfo.begDate}}--{{form.actInfo.endDate}}</span>
          <hr>
          <!--图书选择多选框-->
          主选图书：
          <el-checkbox-group v-model="bookList">
            <el-checkbox  style="margin-left: 10px" v-for="book in form.actInfo.bookList" :label="book" :key="book"><p class="check-box">{{book}}</p></el-checkbox>
          </el-checkbox-group>
          <el-button type="primary"
                     class="margin-top"
                      plain
                      @click="newTopicList"
                      :disabled="islive">
            <i class="el-icon-tickets"></i>生成书单</el-button>
          <hr>
          相关电影: <p v-for="film in form.actInfo.filmList" :key="film"> <span>{{film}}</span></p>
          <hr>
          相关音乐: <p v-for="music in form.actInfo.musicList" :key="music"><span>{{music}}</span></p>
        </el-tab-pane>
        <el-tab-pane label="活动详情" name="third">
          <!--参与人员书单详情-->
          <el-table :data="userInfo">
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
          <el-dialog  title="读后感提交" :visible.sync="articleFormVisible">
            <el-form v-model="form.articleForm">
              <el-form-item label="读后感标题" >
                <el-input v-model="form.articleForm.articleTitle" placeHolder="文章标题"></el-input>
              </el-form-item>
              <el-form-item label="读后感链接">
              <el-input v-model="form.articleForm.article" placeHolder="文章网页"></el-input>
            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="articleFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="newarticle">确 定</el-button>
            </div>
          </el-dialog>
          <!--提交读后感操作框结束-->
        </el-tab-pane>
        <el-tab-pane label="往期活动" name="fourth" >
          <el-card class="box-card">
            <div slot="header">
              <span>主题: <b>{{oldData.allData[oldData.currentPage - 1].topic}}</b></span>
            </div>
            <el-collapse v-model="oldData.activeName" accordion>
              <el-collapse-item title="参与用户" name="1">
                <p><b>发起人:{{oldData.allData[oldData.currentPage - 1].user}}</b></p>
                <p><b>参与用户:<span v-for="user in oldData.allData[oldData.currentPage - 1].users" :key="user">{{user}}</span></b></p>
              </el-collapse-item>
              <el-collapse-item title="活动时间" name="2">
                <p><b>开始时间: {{oldData.allData[oldData.currentPage - 1].begdate}}</b></p>
                <p><b>结束时间: {{oldData.allData[oldData.currentPage - 1].enddata}}</b></p>
              </el-collapse-item>
              <el-collapse-item title="书单" name="3">
                <span v-for="book in oldData.allData[oldData.currentPage - 1].book" :key="book"><b>{{book}}</b></span>
              </el-collapse-item>
              <el-collapse-item title="影单及音乐" name="4">
                <b><p>影单:<span v-for="film in oldData.allData[oldData.currentPage - 1].film" :key="film">{{film}}</span></p></b>
                <b><p>音乐:<span v-for="music in oldData.allData[oldData.currentPage - 1].music" :key="music">{{music}}</span></p></b>
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
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Topic',
  data () {
    return {
      islive: true,
      activeName: 'first',
      bookList: [],
      form: {
        newAct: {
          topic: '',
          begdate: '',
          enddate: ''
        },
        joinAct: {
          book: '《》',
          rebook: '《》',
          rebook2: '《》',
          film: '',
          music: ''
        },
        actInfo: {
          topic: '',
          user: '',
          users: [],
          bookList: [],
          filmList: [],
          musicList: [],
          begDate: '',
          endDate: ''
        },
        articleForm: {
          article: '',
          articleTitle: ''
        }
      },
      formrules: {
        actRule: {
          topic: [{required: true, message: '主题不能为空', trigger: 'blur'}]
        },
        joinRule: {
          book: [{required: true, message: '不能为空', trigger: 'blur'}],
          rebook: [{required: true, message: '不能为空', trigger: 'blur'}],
          rebook2: [{required: true, message: '不能为空', trigger: 'blur'}]
        },
        articleRule: {
          title: [{required: true, message: '不能为空', trigger: 'blur'}],
          body: [{required: true, message: '不能为空', trigger: 'blur'}]
        }
      },
      articleFormVisible: false,
      userInfo: [{user: '1', booklist: ['1', '2'], articlelist: [{title: '123', body: 'https://cn.vuejs.org/'}]}],
      oldData: {
        currentPage: 1,
        // 总页数
        dataLength: 1,
        activeName: 1,
        allData: [
          {
            topic: '群众',
            user: '123',
            users: ['1', '2'],
            book: ['1', '2'],
            film: ['1', '2'],
            music: ['1', '2'],
            begdate: '2016-1-21',
            enddata: '2016-1-21',
            userinfo: [{user: '1', booklist: ['1', '2'], articlelist: [{title: '1', body: 'https://cn.vuejs.org/'}]}]
          }
        ]
      }
    }
  },
  methods: {
    // 获取行中活动的数据
    nowdata () {
      axios.post('/topic/getdata', {})
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
            this.$set(this.$data.form.actInfo, 'users', response.data[0].users)
            this.$set(this.$data.form.actInfo, 'bookList', response.data[0].book)
            this.$set(this.$data.form.actInfo, 'filmList', response.data[0].film)
            this.$set(this.$data.form.actInfo, 'musicList', response.data[0].music)
            this.$set(this.$data.form.actInfo, 'begDate', response.data[0].begdate)
            this.$set(this.$data.form.actInfo, 'endDate', response.data[0].enddate)
            this.$set(this.$data.form.actInfo, 'user', response.data[0].user)
            this.$set(this.$data.form.actInfo, 'topic', response.data[0].topic)
            this.$set(this.$data, 'userInfo', response.data[0].userinfo)
          }
          if (new Date() < new Date(this.$data.form.actInfo.endDate.replace(/-/g, '/'))) {
            // 活动尚在进行中
            this.$set(this.$data, 'islive', false)
          } else {
            // 当前活动已经结束
            this.$set(this.$data, 'islive', true)
          }
        })
    },
    // 发起新的主题阅读
    newTopic () {
      axios.post('/topic/new', {
        topic: this.form.newAct.topic,
        begdate: this.form.newAct.begdate,
        enddate: this.form.newAct.enddate,
        user: this.$store.state.user
      })
        .then((response) => {
          if (response.status === 200) {
            console.log(response)
            this.$set(this.$data.form.actInfo, 'users', response.data.users)
            this.$set(this.$data.form.actInfo, 'topic', response.data.topic)
            this.$set(this.$data.form.actInfo, 'begDate', response.data.begdate)
            this.$set(this.$data.form.actInfo, 'endDate', response.data.enddate)
            this.$set(this.$data.form.actInfo, 'user', response.data.user)
            this.$set(this.$data, 'islive', false)
            this.$message({
              message: '发起活动成功',
              type: 'success'
            })
          }
        })
    },
    // 新用户加入活动
    userJoin () {
      const user = this.form.actInfo.users.find((value) => { return value === this.$store.state.user })
      if (new Date() < new Date(this.$data.form.actInfo.begDate.replace(/-/g, '/'))) {
        if (!user) {
          axios.post('/topic/userjoin', {
            user: this.$store.state.user,
            book: this.form.joinAct.book,
            rebook: this.form.joinAct.rebook,
            rebook2: this.form.joinAct.rebook2,
            film: this.form.joinAct.film,
            music: this.form.joinAct.music
          })
            .then((response) => {
              console.log(response)
              if (response.status === 200) {
                this.$set(this.$data.form.actInfo, 'users', response.data.users)
                this.$set(this.$data.form.actInfo, 'bookList', response.data.book)
                this.$set(this.$data.form.actInfo, 'filmList', response.data.filmList)
                this.$set(this.$data.form.actInfo, 'musicList', response.data.musicList)
                this.$message.success('加入活动成功')
                this.activeName = 'second'
              }
            })
        } else { this.$message.error('该用户已经参加活动') }
      } else { this.$message.error('活动已经开始，暂不能参加') }
    },
    // 用户生成书单
    newTopicList () {
      // 检查用户是否具备加入资格
      let user = this.form.actInfo.users.find((value) => { return value === this.$store.state.user })
      if (!user) {
        this.$message.error('您还未加入活动，请先加入')
      } else {
        if (!user) {
          this.$message.error('已经生成你的书单')
        } else {
          if (this.bookList.length === 0) {
            this.$message.warning('请选择书籍来生成书单')
          } else {
            let loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading'
            })
            axios.post('/topic/newlist', {
              user: this.$store.state.user,
              booklist: this.bookList
            })
              .then((response) => {
                console.log(response)
                if (response.status === 200) {
                  this.$set(this.$data, 'userInfo', response.data.userinfo)
                  console.log(loading.close())
                  this.$message.success('书单生成成功')
                  this.activeName = 'third'
                }
              })
          }
        }
      }
    },
    // 用户提交读后感
    newarticle () {
      axios.post('/topic/newarticle', {
        user: this.$store.state.user,
        body: this.form.articleForm.article,
        title: this.form.articleForm.articleTitle
      })
        .then((response) => {
          if (response.status === 200) {
            console.log(response)
            this.$set(this.$data, 'userInfo', response.data.userinfo)
            this.$message.success('读后感提交成功')
          }
        })
      this.articleFormVisible = false
    },
    // 获取往期活动的全部数据
    showOld  () {
      if (this.activeName === 'fourth') {
        axios.post('/topic/getold', {})
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
  span{
    margin-right: 10px;
  }
</style>
