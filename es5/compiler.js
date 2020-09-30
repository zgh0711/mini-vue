var Watcher = require("./watcher.js")

function Compiler(vm) {
  this.vm = vm
  this.widgets = vm.$widgets
  //创建 compiler 对象后，立即对模版进行编译
  this.compiler(this.widgets)
}

Compiler.prototype = {
  constructor: Compiler,
  compiler: function (widgets) {
    var that = this
    
    widgets.forEach(function (widget) {
      that.compilerWidget(widget)
    })
  },
  
  //编译节点，处理指令
  compilerWidget: function (widget) {
    var that = this
    //判断属性是否是指令，指令的属性名都是以 v- 开头的
    var directive = widget.directive
    console.log('directive',directive)
    if (that.isDirective(directive)) {
      //去掉指令前面的 v-
      directive = directive.substr(4)
      //获取属性对应的值，也就是指令绑定的数据变量
      var key = widget.model
      //更新元素节点
      that.updateWidget(widget, key, directive)
    }
  },
  
  //更新元素节点，Widget：需要更新的节点，key：该节点上绑定的数据变量，attrName：节点上绑定的指令名
  updateWidget: function (widget, key, attrName) {
    //attrName 即为去掉了 v- 后的指令名字，这里通过拼接字符串的方式找到指令对应的 update 方法
    var updateFunction = this[attrName + 'Updater']
    if (updateFunction) {
      //这里通过 call 函数将 updateFunction 的 this 指向到 compiler 对象，以方便在其内部可以获取到 vm 对象
      updateFunction.call(this, widget, this.vm[key], key);
    }
  },
  
  //处理 v-text 指令
  textUpdater: function (widget, value, key) {
    var that = this
    //创建一个对象，它的第一个键为 widget.id，值为它绑定的数据的值，然后用 page,setData 方法给其赋值
    var data = {}
    data[widget.id] = this.getObjectValue(this.vm,key)
    that.vm.$page.setData(data)
    //创建观察者对象，当数据变化时更新视图
    new Watcher(this.vm, key, function (newValue) {
      console.log('this.vn',vm)
      console.log('key',key)
      var data = {}
      data[widget.id] = newValue
      that.vm.$page.setData(data)
    })
  },
  
  //处理 v-model 指令,v-model 是用于表单元素的，给表单元素赋值就是给它的 value 属性赋值
  modelUpdater: function (widget, value, key) {
    //对于绑定了 v-model 的控件来说，前半部分的处理逻辑与 v-text 的一样
    this.textUpdater(widget,value,key)
  
    var that = this
    //todo 怎么获取到控件的 input 事件
    this.vm.$page.textChange = function (exent) {
      //更新视图
      var data = {}
      data[widget.id] = exent.detail.value
      that.vm.$page.setData(data)
      //给 data 中相应的变量赋值
      that.vm[key] = exent.detail.value
    };
  },
  
  //判断元素属性是否是指令,即判断元素属性是否是以 v- 开头
  isDirective: function (attrName) {
    return attrName.indexOf('rtt-') === 0;
  },
  
  getObjectValue: function (vm, model) {
    var value = vm
    model = model.split('.')
    model.forEach(function (key) {
      value = value[key]
    })
    return value
  },
  
  _setVMVal: function (comp, exp, value) {
    var val = comp
    exp = exp.split('.')
    exp.forEach(function (k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k]
      } else {
        val[k] = value
      }
    })
  }
}

module.exports = Compiler
