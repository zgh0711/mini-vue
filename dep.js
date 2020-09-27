//发布者 - 目标
export default class Dep {
  constructor() {
    //记录所有的观察者
    this.subs = []
  }
  
  //添加观察者
  addSub(sub) {
    //如果 sub 对象存在且存在 update 方法，则将其加入到订阅者数组中
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  
  //发布通知
  notify() {
    this.subs.forEach(sub =>{
      sub.update()
    })
  }
}


//订阅者 - 观察者
class Watcher {
  update() {
    console.log('update')
  }
}


let dep = new Dep()
let watcher = new Watcher()

dep.addSub(watcher)
dep.notify()
