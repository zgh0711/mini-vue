/*
  observer 需要实现的功能
  1.负责把 data 中的属性转换成响应式数据
  2.data 中的某个属性也可能是对象，要把该属性中的属性也转换为响应式数据
  3.数据变化时发送通知
 */

var Dep = require("./dep.js")

function Observer(data) {
  this.data = data
  this.walk(data)
}

Observer.prototype = {
  constructor:Observer,
  //遍历 data 中的所有属性
  walk:function (data) {
    var that = this
    //判断 data 是否为空或是对象
    if (!data || typeof data !== 'object') {
      return
    }
    
    //遍历 data 对象的所有属性
    Object.keys(data).forEach(function (key){
      that.defineReactive(data, key, data[key])
    })
  },
  
  //定义响应式数据
  defineReactive:function (data, key, value) {
    var that = this
    //为没一个属性创建 dep 对象，负责收集依赖并发送通知
    var dep = new Dep()
    //如果 value 是对象，则将 value 的属性也转换成响应式
    that.walk(value)
    Object.defineProperty(data,key,{
      enumerable:true,
      configurable:false,
      get:function () {
        //收集依赖
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return value;
      },
      set:function (newValue) {
        if (newValue === value) {
          return
        }
        value = newValue
        //如果给 data 中的 value 被修改为了一个对象，那么也要将这个对象的所有属性转换为响应式
        that.walk(newValue)
        
        //发送通知
        dep.notify()
      }
    })
  }
}

module.exports = Observer
