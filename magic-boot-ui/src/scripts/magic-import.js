import * as vue from "vue";
// import ElementPlus from "element-plus";
import * as Antd from "ant-design-vue";
const libs = {
    vue,
    'ant-design-vue': Antd
}

window.___magic__import__ = function(lib, name){
    if(Object.prototype.toString.call(libs[lib]) != '[object Module]' && name == '*'){
        return libs[lib]
    }
    return (libs[lib] || {})[name]
}
