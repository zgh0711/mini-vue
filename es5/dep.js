/*
  Dep 类的作用是手机依赖和发送通知，我们需要为没一个响应式数据创建一个 dep 对象，在使用响应式数据的时候
  收集依赖，也就是创建观察者对象，当数据变化时通知所有的观察者，调用观察者的 update 方法来更新视图。
  所以我们需要在 observer 中创建 dep 对象，在 get 中收集依赖，在 set 中发送通知，更新视图
 */

//发布者 - 目标
function Dep() {
  this.subs = []
}

Dep.prototype = {
  constructor:Dep,
  //添加观察者
  addSub:function (sub) {
    //如果 sub 对象存在且存在 update 方法，则将其加入到订阅者数组中
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  },
  
  //发布通知
  notify:function () {
    this.subs.forEach(function (sub){
      sub.update()
    })
  }
}

module.exports = Dep
