let data = {
  msg:'msg',
  count:1
}

let vm = {}
proxyData()

function proxyData() {
  Object.keys(data).forEach(key =>{
    //数据劫持，当访问或设置 vm 中的属性时，做一些干预操作
    Object.defineProperty(vm, key,{
      enumerable:true,//是否可枚举（是否可遍历）
      configurable:true,//是否可配置（可以用 delete 删除，可以用 defineProperty 重新定义）
      //当获取值的时候执行
      get() {
        console.log('get:', key, data[key])
        return data[key]
      },
      //当设置值额时候执行
      set(newValue) {
        console.log('set:', key, newValue)
        if (newValue === data[key]) {
          return
        }
        data[key] = newValue
        //todo 数据变化，更新视图
      }
    })
  })
}


vm.msg = 'msg change'
vm.count = 10
console.dir('vm:',vm)
console.dir('data:',data)
