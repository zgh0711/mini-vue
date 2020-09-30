/*
 vue 需要实现的功能
 1.负责接收初始化的参数（选项）
 2.负责把 data 中的属性注入到 vue 实例，转换成 getter/setter
 3.负责调用 observer 监听 data 中所有属性的变化
 4.负责调用 compiler 解析指令或差值表达式
 */

var Observer = require("./observer.js")
var Compiler = require("./compiler.js")

function Vue(page) {
  //通过属性保存选项的数据
  this.$page = page || {}
  this.$data = page.data || {}
  this.$widgets = page.widgets
  
  //把 data 中的成员转换为 getter/setter，并注入到 vue 实例中
  this.proxyData(this.$data)
  
  
  //调用 observer 对象，监听数据变化
  new Observer(this.$data)
  //调用 compiler 对象，解析指令和差值表达式
  new Compiler(this)
}

Vue.prototype = {
  constructor:Vue,
  proxyData:function (data) {
    var that = this
    //遍历 data 中的所有属性
    Object.keys(data).forEach(function (key) {
      //将 data 中的所有属性注入到 vue 实例中，这里的 this 就是 vue 实例，这样的话就可以通过 vue.msg 的方式访问变量了
      Object.defineProperty(that, key, {
        enumerable:true,
        configurable:false,
        get:function () {
          return data[key]
        },
        set:function (newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}

module.exports = Vue
