var Watcher = require("./watcher.js")

function Compiler(vm) {
  this.vm = vm
  this.el = vm.$el
  //创建 compiler 对象后，立即对模版进行编译
  // this.compiler(this.el)
}

Compiler.prototype = {
  constructor: Compiler,
  //编译模版，处理文本节点和元素节点
  compiler: function (el) {
    var that = this
    //先拿到 el 中的所有子节点 childNodes，childNodes 是一个伪数组
    var childNodes = el.childNodes
    //先将 childNodes 转换为数组，再对其进行遍历,分别对文本和元素节点进行处理
    Array.from(childNodes).forEach(function (node) {
      if (that.isTextNode(node)) {
        this.compilerText(node)
      } else if (that.isElementNode(node)) {
        that.compilerElement(node)
      }
      
      //判断 node 是否有子节点，如果有则递归调用 compiler，处理子节点
      if (node.childNodes && node.childNodes.length) {
        that.compiler(node)
      }
    })
  },
  
  //编译文本节点，处理差值表达式
  compilerText: function (node) {
    //用正则匹配 {{msg}}
    var reg = /\{\{(.+?)\}\}/
    //获取文本节点中的内容
    var value = node.textContent
    //判断文本节点中的内容是否与正则匹配
    if (reg.test(value)) {
      //获取正则中第一个分组的内容，即为绑定在节点上的变量名
      var key = RegExp.$1.trim()
      //将文本节点的内容替换为 key 变量对应的值,
      //todo 这里如果使用 this.vm.key 获取的话，值为 undefined，不明白为啥
      node.textContent = value.replace(reg, this.vm[key])
      
      //创建 watcher 对象，当数据变化时更新视图
      new Watcher(this.vm, key, function (newValue) {
        node.textContent = newValue
      })
    }
  },
  
  //编译元素节点，处理指令
  compilerElement: function (node) {
    var that = this
    //先获取节点的所有属性，这是一个数组，数组的每一项就是一个属性，其中 name：属性名，value：属性值
    Array.from(node.attributes).forEach(function (attr) {
      //判断属性是否是指令，指令的属性名都是以 v- 开头的
      var attrName = attr.name
      if (that.isDirective(attrName)) {
        //去掉指令前面的 v-
        attrName = attrName.substr(2)
        //获取属性对应的值，也就是指令绑定的数据变量
        var key = attr.value
        //更新元素节点
        that.updateElement(node, key, attrName)
      }
    })
  },
  
  //更新元素节点，node：需要更新的节点，key：该节点上绑定的数据变量，attrName：节点上绑定的指令名
  updateElement: function (node, key, attrName) {
    //attrName 即为去掉了 v- 后的指令名字，这里通过拼接字符串的方式找到指令对应的 update 方法
    var updateFunction = this[attrName + 'Updater']
    if (updateFunction) {
      //这里通过 call 函数将 updateFunction 的 this 指向到 compiler 对象，以方便在其内部可以获取到 vm 对象
      updateFunction.call(this, node, this.vm[key], key);
    }
  },
  
  //处理 v-text 指令
  textUpdater: function (node, value, key) {
    node.textContent = value
    //创建观察者对象，当数据变化时更新视图
    new Watcher(this.vm, key, function (newValue) {
      node.textContent = newValue
    })
  },
  
  //处理 v-model 指令,v-model 是用于表单元素的，给表单元素赋值就是给它的 value 属性赋值
  modelUpdater: function (node, value, key) {
    var that = this
    node.value = value
    //创建观察者对象，当数据变化时更新视图
    new Watcher(this.vm, key, function (newValue) {
      node.value = newValue
    })
    
    //给 v-model 绑定的元素注册事件，在事件处理函数中将元素当前值赋值给它绑定的变量，从而实现双向绑定
    node.addEventListener('input', function () {
      that.vm[key] = node.value
    })
  },
  
  //判断元素属性是否是指令,即判断元素属性是否是以 v- 开头
  isDirective: function (attrName) {
    return attrName.startsWith('v-')
  },
  
  //判断节点是否是文本节点，每个节点都有一个 nodeType 属性，表示节点的类型，1：元素节点，3：文本节点
  isTextNode: function (node) {
    return node.nodeType === 3
  },
  
  //判断节点是否是元素节点
  isElementNode: function (node) {
    return node.nodeType === 1
  }
}
