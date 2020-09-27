/*
  observer 需要实现的功能
  1.负责把 data 中的属性转换成响应式数据
  2.data 中的某个属性也可能是对象，要把该属性中的属性也转换为响应式数据
  3.数据变化时发送通知
 */
import Dep from "./dep";
export default class Observer {
  constructor(data) {
    this.walk(data)
  }
  //遍历 data 中的所有属性
  walk(data) {
    //判断 data 是否为空或是对象
    if (!data || typeof data !== 'object') {
      return
    }
    
    //遍历 data 对象的所有属性
    Object.keys(data).forEach(key =>{
      this.defineReactive(data, key, data[key])
    })
  }
  
  //定义响应式数据
  defineReactive(data, key, value) {
    let that = this
    //负责手机依赖并发送通知
    let dep = new Dep()
    //如果 value 是对象，则将 value 的属性也转换成响应式
    that.walk(value)
    Object.defineProperty(data,key,{
      enumerable:true,
      configurable:true,
      get() {
        if (dep.target) {
          dep.addSub(dep.target)
        }
        return value;
      },
      set(newValue) {
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
