/*
  watcher 需要具备的功能
  1.数据变化时，触发依赖，dep 通知所有的 watcher 实例更新视图
  2.自身实例化时往 dep 对象中添加自己
 */

class Watcher {
  constructor(vm, key, callback) {
    this.vm = vm
    this.key = key

    //回调函数，负责更新视图
    this.callback = callback
    //把 watcher 对象记录到 Dep 类的静态属性 target 中
    Dep.target = this
    //在我们访问某个属性时，会调用它的 get 方法，在 get 方法中会把当前 watcher 对象添加到 dep 中
    //触发 get 方法，在 get 方法中调用 addSub,这一步是在 observer 中做的

    this.oldValue = vm[key]
    //在将 watcher 添加到 dep 中之后，为了防止重复添加，需要将其置空
    Dep.target = null
  }

  //数据变化时更新视图
  update() {
    //先获取到新的数据，判断新数据与老数据是否相等,不等则调用回调函数
    let newValue = this.vm[this.key]
    if (this.oldValue === newValue) {
      return
    }
    this.callback(newValue)
  }
}
