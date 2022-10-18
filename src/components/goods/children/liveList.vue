<!-- 直播列表组件 -->
<template>
  <div id="liveList">
    <div class="title_live" v-if="showtitle">
      <i class="iconfont icon-all_zhibojian"></i>
      <h3 class="title_l">直播间</h3>
    </div>
    <div style="height: 0.875rem; background: #fff;" v-if="!showtitle"></div>
    <img
      style="width: 5rem;"
      src="../../../assets/images/blank.png"
      v-if="fun.isTextEmpty(recordsList)"
    />
    <div class="living-box" v-if="!fun.isTextEmpty(recordsList)">
      <ul ref="newArray1"
        class="zq-waterfall-left living-item">
          <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoRoom(item.play_type,item.id,item.back_id)">
            <div class="bg">
              <img :src="item.cover" alt="">
            </div>
            <div class="title">
              <img id="avatar" :src="item.avatar" alt="">
              <span class="name">{{item.nickname}}</span>
            </div>
            <div class="top" v-if="item.play_type != 3"><span class="red" :class="[ item.play_type == 2?'huifan_color':''] ">{{item.play_type == 1?'直播中':'回放'}}</span>{{item.view_num}}人观看</div>
            <div class="top" v-if="item.play_type == 3"><span class="red">预告</span></div>
            <div class="goods_icon" v-if="item.play_type != 3"><i class="iconfont icon-zb_goods"></i><span>{{item.goods_num}}</span></div>
            <div class="bottom overflow1">{{item.title}}</div>
          </li>
      </ul>
      <ul ref="newArray2"
        class="zq-waterfall-right living-item">
          <li class="" v-for="(item, index) in newArray2" :key="index" @click="gotoRoom(item.play_type,item.id,item.back_id)">
            <div class="bg">
              <img :src="item.cover" alt="">
            </div>
            <div class="title">
              <img id="avatar" v-if="isCard" :src="item.has_one_member.avatar" alt="">
              <img id="avatar" v-if="!isCard" :src="item.avatar" alt="">
              <span class="name">{{isCard?item.has_one_member.nickname:item.nickname}}</span>
            </div>
            <div class="top" v-if="item.play_type != 3"><span class="red" :class="[ item.play_type == 2?'huifan_color':''] ">{{item.play_type == 1?'直播中':'回放'}}</span>{{item.view_num}}人观看</div>
            <div class="top" v-if="item.play_type == 3"><span class="red">预告</span></div>
            <div class="goods_icon" v-if="item.play_type != 3"><i class="iconfont icon-zb_goods"></i><span>{{item.goods_num}}</span></div>
            <div class="bottom overflow1">{{item.title}}</div>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props:['recordsList','showtitle', 'isCard'],
  data () {
    return {
      newArray1: [],
      newArray2: [],
      list:[]
    };
  },
  mounted() {
    if(!this.fun.isTextEmpty(this.recordsList)){
      this.newArray1 = [];
      this.newArray2 = [];
      this.sort(0, this.recordsList);
    }
  },
  methods: {
    gotoRoom(type,rid,bid){
      if(type == 1){
        //直播中，跳转到主播间
        console.log("直播中，跳转到主播间");
        this.$router.push(this.fun.getUrl("livePage", {id:rid, type:'livePlay'}, {from: 'back'}));
      }else if(type == 2){
        //直播回放中，跳转到主播间
        console.log("直播回放中，跳转到主播间回放");
        this.$router.push(this.fun.getUrl("livePage", {id:rid,backid:bid,type:'playBack'}, {from: 'back'}));
      }else if(type == 3){
        //预告页面
        console.log("预告页面");
        this.$router.push(this.fun.getUrl("foreshow", {id:rid}));
      }else{
        console.log("error:::");
      }
    },
    // 图片加载完回调
    getImg(url, callback, callback2) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(
            img.width,
            img.height,
            Number(img.height) / Number(img.width)
          );
        };

        img.onerror = function() {
          callback2();
        };
      }
    },
    sort(arg, list) {
      let that = this;
      let index = arg || 0;
      if (list.length > index) {
        that.getImg(
          list[index].cover,
          function(w, h, r) {
            let boxA = 0;
            let boxB = 0;

            if (document.getElementsByClassName("zq-waterfall-left")[0]) {
              boxA = document.getElementsByClassName("zq-waterfall-left")[0]
                .clientHeight;
            }

            if (document.getElementsByClassName("zq-waterfall-right")[0]) {
              boxB = document.getElementsByClassName("zq-waterfall-right")[0]
                .clientHeight;
            }
            if (boxA <= boxB) {
              that.newArray1.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list); //加载完再递归
              });
            } else {
              that.newArray2.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list);
              });
            }
          },
          function() {
            list[index].cover = "https://www.yunzmall.com/addons/yun_shop/static/app/img/agreen_video@2x.png";
            that.$nextTick(() => {
              that.sort(index, list);
            });
          }
        );
      }
      if (list.length - 1 == index) {
        this.isLoadMore = true;
        this.showLoading = true;
      }
    },
  },
  watch:{
    recordsList: function(newVal, oldVal) {
      this.newArray1 = [];
      this.newArray2 = [];
      this.sort(0, this.recordsList);
    }
  }
};
</script>
<style lang='scss' scoped>
#liveList {
  width: 100%;

  .title_live {
    font-size: 1rem;
    text-align: left;
    display: flex;
    align-items: center;
    height: 2.5rem;
    line-height: 2.5rem;
    background-color: #fff;

    i {
      color: #ff2c29;
      font-size: 1.5rem;
      margin: 0 0.5rem 0 0.875rem;
    }

    h3 {
      margin: 0;
      color: #000;
      font-weight: bold;
    }
  }

  .living-box {
    background: #fff;
    padding: 0.875rem;
    padding-top: 0;
  }

  .living-item {
    margin: 0;
    margin-bottom: 0.875rem;
    width: 48%;
    overflow: hidden;
    vertical-align: top;
    display: inline-block;

    li {
      margin-bottom: 0.875rem;
      position: relative;
    }

    .bg {
      width: 100%;
      // height: 13.125rem;
      border-radius: 0.313rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      display: flex;

      #avatar {
        flex: 0 0 1.656rem;
        width: 1.656rem;
        height: 1.656rem;
        border-radius: 50%;
        margin-top: -0.625rem;
        border: 0.125rem solid #fff !important;
      }

      .name {
        display: inline-block;
        flex: 1;
        text-align: left;
        line-height: 1rem;
        margin-left: 0.25rem;
        overflow: hidden;/* 超出部分隐藏 */
        text-overflow: ellipsis;/* 超出部分显示省略号 */
        white-space: nowrap;/* 规定段落中的文本不进行换行 */
      }
    }

    .top {
      position: absolute;
      top: 0.5rem;
      left: 0.25rem;
      background-color: rgba(0, 0, 0, 0.4);
      border-radius: 0.15rem;
      color: #fff;
      padding: 0 0.15rem 0 0;
      font-size: 12px;
      height: 1.25rem;
      line-height: 1.25rem;

      .red {
        background-color: #f10303;
        border-radius: 0.15rem;
        padding: 0 0.25rem;
        margin-right: 0.2rem;
        display: inline-block;
        height: 100%;
      }

      .huifan_color {
        background-color: #999;
      }
    }

    .goods_icon {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 12px;
      height: 1.25rem;
      line-height: 1.25rem;

      i {
        font-size: 1.625rem;
        color: #ffa303;
      }

      span {
        background-color: #fff;
        border-radius: 0.266rem;
        color: #f00;
        position: absolute;
        right: -4px;
        height: 0.875rem;
        line-height: 0.875rem;
        font-size: 0.625rem;
        padding: 0 0.15rem;
      }
    }

    .bottom {
      width: 100%;
      height: 2.5rem;
      line-height: 1.25rem;
      position: absolute;
      bottom: 1.875rem;
      left: 0;
      font-weight: bold;
      font-size: 0.875rem;
      color: #fff;
      text-align: left;
      padding: 0 0.5rem;
      // background: rgba(0, 0, 0, 0.4);
    }

    .overflow1 {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .purple {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      color: #fff;
      font-size: 12px;
      background-color: #8415f5;
      border-radius: 0.625rem 0 0.625rem 0;
      padding: 0.2rem 0.6rem;
    }

    .gray {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      color: #fff;
      font-size: 12px;
      background-color: #999;
      border-radius: 0.625rem 0 0.625rem 0;
      padding: 0.2rem 0.6rem;
    }
  }

  .zq-waterfall-left {
    margin-right: 0.5rem;
  }
}
</style>
