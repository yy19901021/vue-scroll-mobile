<template> 
    <div class="wrapper"  ref="wrapper" :style="{'top':top + 'rem', 'bottom':bottom + 'rem'}">
        <div ref="content" :style="{'width':scrollContentWidth ? scrollContentWidth + 'rem' : '100%'}">
          <div v-if="pulldown && showPull " class="top" :style="{'top': y}">
            <div>{{pullText}}</div>
            <div>{{'最后更新于' +lastTime}}</div>
          </div> 
          <slot></slot> 
          <div v-if="pullup && showup" class="bottom">
            <div>{{arriveBottom ? '我也是有底线的哦' : pullupText}}</div>
          </div> 
        </div>
    </div> 
</template>
<script>
import BScroll from 'better-scroll'
function getElementRect(el){
   if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}
export default {
  name: 'VueBetterScroll',
  data() {
    return {
      showPull: false,
      pullText:'下拉即可刷新',
      y:0,
      lastTime:'',
      isEnd: false,
      pulldownInitPos:-60,
      beforePulldown: true,
      isPulldowning:false,
      scroll:null, //better-scroll实例对象
      isPulluping:false,//是否在上拉中,
      showup:true,
      pullupText:'上拉加载更多'
    }
  },
  props: {
    /**scroll宽度
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
       * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
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
      }
  }, 
  mounted() {
    // 保证在DOM渲染完毕后初始化better-scroll
    setTimeout(() => {
      this._initScroll() 
    }, 30)
  },
  methods: {
    _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        if(this.pulldown || this.listenScroll){
          this.$refs.content.style.minHeight = `${getElementRect(this.$refs.wrapper).height + 1}px`
        } 
        sessionStorage.setItem('lastTime', this.getLastTime())
        // better-scroll的初始化
        if(this.pulldown && typeof this.pulldown == 'boolean'){
          var configDown = {
            threshold: 60,
            stop: 45
          }
          var configUp = {
            threshold: -40
          }
        }
        let u = navigator.userAgent
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //安卓终端
        let useTransition = isAndroid
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          scrollX: this.scrollX,
          pullDownRefresh: this.pulldown ? configDown : this.pulldown,
          pullUpLoad: this.pullup ? configUp : this.pullup,
          scrollY:this.scrollY,
          bindToWrapper: this.bindToWrapper,
          useTransition:this.scrollEnd ? true : isAndroid, // ios抖动问题
          // useTransform:useTransition,
          momentum:this.momentum,
          bounce: this.bounce
        }) 
        // 是否派发滚动事件
        if (this.listenScroll || this.pullup || this.pulldown) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
            if(this.pulldown){
              this.pullDowmScroll(pos)
            }
          })
        }
        if(this.scrollEnd){
           this.scroll.on('scrollEnd', (pos) => {
            this.$emit('scrollEnd', pos)
          })
        }
       
         // 是否派发顶部下拉事件，用于下拉刷新
        if (this.pulldown) { 
          this._initPulldown()
        }
          // 是否派发上拉事件，用于上拉刷新
        if (this.pullup) {
          this._initPullup()
        }
        // 是否派发列表滚动开始的事件
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
    disable() {
        // 代理better-scroll的disable方法
        this.scroll && this.scroll.disable()
      },
      enable() {
        // 代理better-scroll的enable方法
        this.scroll && this.scroll.enable()
      },
      refresh() {
        sessionStorage.setItem('lastTime', this.getLastTime())
        this.lastTime = sessionStorage.getItem('lastTime')
        this._endPulldown() 
        this._endPullup() 
        // 代理better-scroll的refresh方法
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        // 代理better-scroll的scrollTo方法
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement(){
        // 代理better-scroll的scrollToElement方法
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      formatAdd0(str){
        return str.length > 1 ? str : '0' + str
      },
      getLastTime(){
        return this.formatAdd0(new Date().getHours() + '') + ":" + this.formatAdd0(new Date().getMinutes() + '') + ":" + this.formatAdd0(new Date().getSeconds() + '')
      },
      _initPulldown(){
        this.scroll.on('pullingDown', () => {
          this.beforePulldown = false
          this.isPulldowning = true
          this.pullText = '正在刷新'
          this.$emit('pulldown')
        })
      },
      pullDowmScroll (pos){ 
          if(this.isPulldowning){
            return
          } 
          const { threshold = 50} = this.pulldown
          if(this.beforePulldown){
            this.showPull = true
            this.y = `${Math.min(this.pulldownInitPos + pos.y, -40)/100}rem`
            if(pos.y >= threshold){
              this.pullText = '松手立即更新'
            }
          }else{
            // this.y = `${}px`
          } 
      },
      _endPulldown(){
        this.pullText = '下拉刷新'
        this.beforePulldown = true
        this.showPull = false
        this.isPulldowning = false 
        this.scroll.finishPullDown()
      },
      _initPullup(){
        this.scroll.on('pullingUp', () => { 
          if(!this.showup) return 
             this.pullupText = '正在加载更多'
             this.$emit('pullup')
        })
      }, 
      _endPullup(){ 
        this.showup = true
        this.pullupText = '上拉加载更多'
        this.scroll.finishPullUp()
      }
  },
  watch: {
    data(newVal, oldVal) {
        setTimeout(() => {
          this.refresh() 
        }, this.refreshDelay)
      }
  },
  created(){
    this.lastTime = sessionStorage.getItem('lastTime')
    this.y = this.pulldownInitPos
  }
}
</script>

<style scoped>
   .wrapper{
       overflow: hidden;
       position: absolute;
       left:0;
       right: 0;
   }
.hide-leave-to{
    opacity: 1;
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
}

.hide-leave-active{
    opacity: 0;
    -webkit-transform: translate(0, -100%);
    transform: translate(0, -100%);
}
.top{
  text-align:center; 
  color:#a2a2a2; 
  width:100%; 
  transition: all .3s ease;
  font-size: .12rem;
  text-align: center;
  position: absolute;
  left: 0;
}
.bottom{
  text-align:center; 
  color:#a2a2a2; 
  width:100%; 
  transition: all .3s ease;
  font-size: 12px;
  padding :15px 0;
}

</style>

