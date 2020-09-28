class Compiler {
  constructor(vm) {
    this.vm = vm
    this.el = vm.$el
    //创建 compiler 对象后，立即对模版进行编译
    this.compiler(this.el)
  }

  //编译模版，处理文本节点和元素节点
  compiler(el) {
    //先拿到 el 中的所有子节点 childNodes，childNodes 是一个伪数组
    let childNodes = el.childNodes
    //先将 childNodes 转换为数组，再对其进行遍历,分别对文本和元素节点进行处理
    Array.from(childNodes).forEach(node =>{
      if (this.isTextNode(node)) {
        this.compilerText(node)
      } else if (this.isElementNode(node)) {
        this.compilerElement(node)
      }

      //判断 node 是否有子节点，如果有则递归调用 compiler，处理子节点
      if (node.childNodes && node.childNodes.length) {
        this.compiler(node)
      }
    })
  }

  //编译文本节点，处理差值表达式
  compilerText(node) {
    //用正则匹配 {{msg}}
    let reg = /\{\{(.+?)\}\}/
    //获取文本节点中的内容
    let value = node.textContent
    //判断文本节点中的内容是否与正则匹配
    if (reg.test(value)) {
      //获取正则中第一个分组的内容，即为绑定在节点上的变量名
      let key = RegExp.$1.trim()
      //将文本节点的内容替换为 key 变量对应的值,
      //todo 这里如果使用 this.vm.key 获取的话，值为 undefined，不明白为啥
      node.textContent = value.replace(reg,this.vm[key])
    }
  }

  //编译元素节点，处理指令
  compilerElement(node) {
    //先获取节点的所有属性，这是一个数组，数组的每一项就是一个属性，其中 name：属性名，value：属性值
    Array.from(node.attributes).forEach(attr =>{
      //判断属性是否是指令，指令的属性名都是以 v- 开头的
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        //去掉指令前面的 v-
        attrName = attrName.substr(2)
        //获取属性对应的值，也就是指令绑定的数据变量
        let key = attr.value
        //更新元素节点
        this.updateElement(node, key, attrName)
      }
    })
  }

  //更新元素节点，node：需要更新的节点，key：该节点上绑定的数据变量，attrName：节点上绑定的指令名
  updateElement(node, key, attrName) {
    //attrName 即为去掉了 v- 后的指令名字，这里通过拼接字符串的方式找到指令对应的 update 方法
    let updateFunction = this[`${attrName}Updater`]
    if (updateFunction) {
      updateFunction(node, this.vm[key]);
    }
  }

  //处理 v-text 指令
  textUpdater(node, value) {
    node.textContent = value
  }

  //处理 v-model 指令,v-model 是用于表单元素的，给表单元素赋值就是给它的 value 属性赋值
  modelUpdater(node, value) {
    node.value = value
  }

  //判断元素属性是否是指令,即判断元素属性是否是以 v- 开头
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }

  //判断节点是否是文本节点，每个节点都有一个 nodeType 属性，表示节点的类型，1：元素节点，3：文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }

  //判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
