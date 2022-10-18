<template>
  <div class="fe-mod fe-mod-1" :style="{'color':datas.params.color,'backgroundColor':datas.params.bgcolor}">
    <a :href="datas.params.noticehref|| '#'">
      <div class="wrap" id="wrap" v-show="datas.params.scroll == 1">
        <div :id="'box'+datas.id" class="box">
          <div :id="'marquee'+datas.id" class="marquee">{{datas.params.notice|| "请填写内容,可设置是否滚动显示"}}</div>
          <div :id="'copy'+datas.id" class="copy"></div>
        </div>
        <div :id="'node'+datas.id" class="node">{{datas.params.notice|| "请填写内容,可设置是否滚动显示"}}</div>
      </div>
      <!--<div class="scroll-notice" style="line-height: 2rem;height:2rem;overflow: hidden; white-space: nowrap; text-overflow: ellipsis; content:'...';" v-show="datas.params.scroll == 1">-->
      <!--<van-notice-bar :background="datas.params.bgcolor" :color="datas.params.color" v-show="datas.params.scroll == 1">-->
      <!--<div :style="{minWidth:noticeWidth}">-->
      <!--{{datas.params.notice|| "请填写内容,可设置是否滚动显示"}}-->
      <!--</div>-->
      <!--</van-notice-bar>-->
      <!--<marquee  scrollamount="3" :style="{'color':datas.params.color}">{{datas.params.notice|| '请填写内容,可设置是否滚动显示'}}</marquee>-->
      <!--</div>-->
      <div class="scroll-notice" :style="{'overflow': 'hidden','color':datas.params.color}"  v-show="datas.params.scroll == 0">
        {{datas.params.notice|| "请填写内容,可设置是否滚动显示"}}
      </div>
    </a>
  </div>
</template>
<script>
export default {
  props: ["datas"],
  data() {
    return {
      noticeWidth: "100%"
    };
  },
  mounted() {
    //添加宽度，让文字满足滚动
    // var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    // this.noticeWidth = w + "px";

    // let times = setTimeout(() => {
    //   let wrapw = document.getElementById("wrap").offsetWidth;
    //   let nodew = document.getElementById("node").offsetWidth;
    // if (wrapw <= nodew) {  //判断文字长度大于盒子宽度时，执行滚动
    this.move();
    // }
    // clearTimeout("times");
    // }, 1000);  //页面更新1s后执行
  },
  methods: {
    move() {
      // 获取文字text 的计算后宽度  （由于overflow的存在，直接获取不到，需要独立的node计算）
      let width = document.getElementById("node"+this.datas.id).getBoundingClientRect().width;
      let box = document.getElementById("box"+this.datas.id);
      let copy = document.getElementById("copy"+this.datas.id);
      copy.innerText = this.datas.params.notice; // 文字副本填充
      let distance = 0; // 位移距离
      //设置位移
      setInterval(function() {
        distance = distance - 1;
        // 如果位移超过文字宽度，则回到起点
        if (-distance >= width) {
          distance = 16;
        }
        box.style.transform = "translateX(" + distance + "px)";
      }, 20);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .scroll-notice {
    line-height: 2rem;
    white-space: nowrap;
    margin: 0 5px;
    text-overflow: ellipsis;
    content: '...';
  }

  // 限制外框宽度，隐藏多余的部分
  .wrap {
    white-space: nowrap;
    overflow: hidden;
    height: 2rem; //设置此两行代码可以防止文字错位
    line-height: 2rem;
  }

  // 移动框宽度设置
  .box {
    width: 80000%;
  }

  // 文字一行显示
  .box div {
    float: left;
  }

  // 设置前后间隔
  .marquee {
    min-width: 23rem;
    margin: 0 16px 0 0;
  }

  .copy {
    min-width: 23rem;
  }

  // 获取宽度的节点，隐藏掉
  .node {
    min-width: 23rem;
    position: absolute;
    z-index: -999;
    top: -999999px;
  }
</style>
