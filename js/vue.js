/*
 vue 需要实现的功能
 1.负责接收初始化的参数（选项）
 2.负责把 data 中的属性注入到 vue 实例，转换成 getter/setter
 3.负责调用 observer 监听 data 中所有属性的变化
 4.负责调用 compiler 解析指令或差值表达式
 */

class Vue {
  constructor(options) {
    //通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    //如果 options.el 是字符串则表示它是一个选择器，这时通过选择器名字找到 DOM 对象，如果不是字符串则表示它是一个 DOM 对象
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    //把 data 中的成员转换为 getter/setter，并注入到 vue 实例中
    this._proxyData(this.$data)
    //调用 observer 对象，监听数据变化
    new Observer(this.$data)
    //调用 compiler 对象，解析指令和差值表达式
    new Compiler(this)
  }

  _proxyData(data) {
    //遍历 data 中的所有属性
    Object.keys(data).forEach(key => {
      //将 data 中的所有属性注入到 vue 实例中，这里的 this 就是 vue 实例，这样的话就可以通过 vue.msg 的方式访问变量了
      Object.defineProperty(this, key, {
        enumerable:true,
        configurable:false,
        get() {
          return data[key]
        },
        set(newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}
