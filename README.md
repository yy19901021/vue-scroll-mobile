# vue-scroll-mobile
## 参数说明
``` /**scroll宽度
     *  */
      scrollContentWidth:{
        type: Number,
        default: null
      },
      top:{
        type: Number,
        default: 0
      },
       bottom:{
        type: Number,
        default: 0
      },
    /*better-scroll 配置*/
    /**
       * 1 滚动的时候会派发scroll事件，会截流。
       * 2 滚动的时候实时派发scroll事件，不会截流。
       * 3 除了实时派发scroll事件
       */
      probeType: {
        type: Number,
        default: 2
      },
      /**
       * 点击列表是否派发click事件
       */
      click: {
        type: Boolean,
        default: true
      },
      /**
       * 是否开启横向滚动
       */
      scrollX: {
        type: Boolean,
        default: false
      },
      scrollY: {
        type: Boolean,
        default: true
      },
      /**
       *  /**
       * 是否派发滚动事件
       */
      listenScroll: {
        type: Boolean,
        default: false
      },
      /**
       * 列表是否达到底部
       */
      arriveBottom: {
        type: Boolean,
        default: false
      },
      arriveBottomText: {
        type: String,
        default: '我也是有底线的哦'
      },
      /**
       * 是否派发滚动到底部的事件，用于上拉加载
       */
      pullup: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发顶部下拉的事件，用于下拉刷新
       */
      pulldown: {
        type: Boolean,
        default: false
      },
      /**
       * 是否派发列表滚动开始的事件
       */
      beforeScroll: {
        type: Boolean,
        default: false
      },
      /**
       * 当数据更新后，刷新scroll的延时。
       */
      refreshDelay: {
        type: Number,
        default: 300
      },
      /**
       * 派发滚动结束事件。
       */
      scrollEnd: {
        type: Boolean,
        default: false
      },
      
      bindToWrapper:{
        type: Boolean,
        default: false
      },
      bounce:{
        type: Object | Boolean,
        default:()=>{
          return {}
        }
      },
      bounceTime:{
        type: Number,
        default: 700
      },
      /**
       * 立即停止。
       */
      momentum:{
        type: Boolean,
        default: true
  ```

  ## 组件事件
  事件|说明
  --|:--:|--:
  scroll| 滚动事件， 容器滚动时触发
  scrollEnd| 容器滚动到底部触发
  beforeScroll| 容器开始滚动触发
  pulldown| 容器下拉时触发
  pullup| 容器上拉时触发

  ## 外部链接
  [Better-scroll文档]（http://ustbhuangyi.github.io/better-scroll/doc/api.html）