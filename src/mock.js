import Mock from 'mockjs'

Mock.mock('/login', function (options) {
  // console.log(options)
  return Mock.mock({
    'token': '6-ara forever',
    'user': '圆圆圆圆圆'
  })
})
Mock.mock('/register', function (options) {
  console.log(options)
  return Mock.mock({
    'number': '1'
  })
})
Mock.mock('/newact', function (options) {
  console.log(options)
  return Mock.mock({
    'number': '1'
  })
})
Mock.mock('/getactdata', function (options) {
  console.log(options)
  return Mock.mock({
    'users': ['宝蓝一米五', '圆圆圆圆圆'],
    'book': ['《狂热分子1》', '《狂热分子2》'],
    'rebook': ['《论语别裁1》备选', '《论语别裁2》备选'],
    'begdate': '2015年5月8日',
    'enddate': '2018年5月8日',
    'booklist': [{
      user: '1',
      bookList: ['《狂热分子1》', '《狂热分子2》'],
      artList: ['http://1', 'http://2']
    },
    {
      user: '2',
      bookList: ['《1》', '《2》', '《3》']
    }]
  })
})
Mock.mock('/userjoin', function (options) {
  console.log(options)
  return Mock.mock({
    'number': '1'
  })
})
