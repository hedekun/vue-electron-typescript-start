/**
 * 外部模块定义,主要为项目内所有的 vue 文件做模块声明，毕竟 ts 默认只识别 .d.ts、.ts、.tsx 后缀的文件.
 * 如果引入vue组件的时候，不添加.vue后缀名，会报错。这里就是原因
 */
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
