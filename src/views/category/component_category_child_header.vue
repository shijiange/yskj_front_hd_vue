<template>
  <div class="page">

    <div class="c-swipe">
      <!--<template v-if="cat_adv_img!=''">
       <van-swipe
         :autoplay="4000"
         :show-indicators="false"
         :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
       >
         <van-swipe-item
           v-for="(slide, index) in carousels"
           :key="index"
           @click.native="bannerClick(slide)"
         >
           <div style="margin: 0.5rem">
             <img width="100%" style="height:11.25rem" :src="slide.thumb" />
           </div>
         </van-swipe-item>
       </van-swipe>

     </template>-->
      <div style="margin: 0 0.5rem;">
        <img width="100%" style="height: auto;" @click.native="bannerClick" :src="top_img"/>
      </div>
    </div>

    <van-sticky offset-top="2.55rem">

      <div class="ment" style="background: #fff;">
        <!-- <c-ment :datas="fun.chunk(category, 10)"></c-ment> -->
        <van-swipe
          v-if="!fun.isTextEmpty(category)"
          :autoplay="0"
          indicator-color="#f15353"
          :show-indicators="false"
          class="sw_list"
          :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
          :class="{
                sw_list_6: datas != null && datas.length > 0 && datas[0].length <= 5,
                sw_list_12: datas != null && datas.length > 0 && datas[0].length > 5,
                sw_list_0: datas.length == 0
              }"
        >
          <van-swipe-item v-for="(items, i) in datas" :key="i">
            <ul>
              <li
                v-for="(item, i) in items"
                :key="i"
                style="float: left;"
                :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
              >
                <div @click="bindCategory(item.id)">
                  <div class="image" v-if="item.thumb"><img :src="item.thumb"/></div>
                  <div class="image" v-if="!item.thumb">
                    <img src="../../assets/images/img_default.png"/>
                  </div>
                  <p class="text">{{ item.name }}</p>
                </div>
              </li>

            </ul>
          </van-swipe-item>
        </van-swipe>
        <van-row id="sort">
          <!--<el-row id='sort'>-->
          <!--<el-col :span="show?6:8">-->
          <van-col :span="7">
            <div
              class="grid-content"
              :class="{ active: sort.tab == 1, up: sort.up == 1, down: sort.down == 1 }"
              @click="toggle($event, 1)"
              v-if="!supplier"
            >
              综合推荐
            </div>
            <div
              class="grid-content"
              :class="{ active: sort.tab == 5, up: sort.up == 5, down: sort.down == 5 }"
              @click="toggle($event, 5)"
              v-if="supplier"
            >
              综合
            </div>
          </van-col>
          <!--</el-col>-->
          <van-col :span="7">
            <!--<el-col :span="show?6:8">-->
            <div
              class="grid-content"
              :class="{ active: sort.tab == 2, up: sort.up == 2, down: sort.down == 2 }"
              @click="toggle($event, 2)"
            >
              销量
            </div>
            <!--</el-col>-->
          </van-col>
          <van-col :span="7">
            <!--<el-col :span="show?6:8">-->
            <div
              class="grid-content"
              :class="{ active: sort.tab == 3, up: sort.up == 3, down: sort.down == 3 }"
              @click="toggle($event, 3)"
            >
              价格
            </div>
            <!--</el-col>-->
          </van-col>
          <van-col :span="3">
            <div class="sort_icon">
              <i class="iconfont icon-sort_b"
                 v-show="view"
                 @click="$store.commit('views')"></i>
              <i class="iconfont icon-sort_a"
                 v-show="!view"
                 @click="$store.commit('views')"></i>
            </div>
          </van-col>
        </van-row>
      </div>

    </van-sticky>


  </div>


</template>

<script>

// import cSort from "components/sort";/
import { mapState } from "vuex";

export default {
  // components:{cSort},
  props: ["cat_set", "category", "top_img"],
  data() {
    return {
      show: true,
      sort: { up: false, dows: false, tab: 0 },
      supplier: false,
      clientWidths: "",
      view_mode: "01",
      // category:[
      //   {"id":2,"uniacid":2,"sort":1,"name":"快餐","thumb":"https://b.yunzmall.com/images/2/2018/08/L8Ia553RrZH83rEiLocYIY3L9o5885.jpg","is_open":1,"created_at":"2018-09-04 10:22:53","updated_at":"2019-08-20 15:15:37","deleted_at":null,"open_name":"开启"},
      //   {"id":6,"uniacid":2,"sort":0,"name":"其他","thumb":"https://b.yunzmall.com/images/2/2018/12/NV0sbs0rpq0Kwh069WR60HVVrER60V.jpg","is_open":1,"created_at":"2018-12-18 13:41:08","updated_at":"2020-04-01 11:29:12","deleted_at":null,"open_name":"开启"},
      //   {"id":11,"uniacid":2,"sort":0,"name":"测试4","thumb":"https://dev5.yunzmall.com/attachment/images/2/2018/12/juKUL31Zs3a37NLuEnM3lun4t1kfF5.jpg","is_open":1,"created_at":"2018-12-19 16:08:27","updated_at":"2020-04-01 11:29:21","deleted_at":null,"open_name":"开启"},
      //   {"id":13,"uniacid":2,"sort":0,"name":"测试6","thumb":"https://b.yunzmall.com/images/2/2018/11/QjQDYPSEj8dWj28xYCezJ2LuCUaAJd.jpg","is_open":1,"created_at":"2018-12-19 16:09:07","updated_at":"2020-04-01 11:28:04","deleted_at":null,"open_name":"开启"},
      //   {"id":15,"uniacid":2,"sort":0,"name":"测试8","thumb":"https://b.yunzmall.com/images/2/2018/11/Q99iJ3gjJjSRwWw3Wj3s392wz38979.jpg","is_open":1,"created_at":"2018-12-19 16:09:56","updated_at":"2020-04-01 11:29:30","deleted_at":null,"open_name":"开启"},
      //   {"id":17,"uniacid":2,"sort":0,"name":"测试9","thumb":"https://b.yunzmall.com/images/2/2018/11/afAxalczOSaS22XuymUx46uX22z542.jpg","is_open":1,"created_at":"2018-12-19 16:10:56","updated_at":"2020-04-01 11:29:40","deleted_at":null,"open_name":"开启"},
      //   {"id":19,"uniacid":2,"sort":0,"name":"测试11","thumb":"https://b.yunzmall.com/images/2/2018/11/h15iM3y456M6Mx13lqfIxqygZLyQ64.jpg","is_open":1,"created_at":"2018-12-19 16:11:31","updated_at":"2020-04-01 11:29:02","deleted_at":null,"open_name":"开启"},
      //   {"id":22,"uniacid":2,"sort":0,"name":"牛奶","thumb":"https://5b0988e595225.cdn.sohucs.com/images/20171025/e7f0b52b12874aa19971d1c0db2006a8.gif","is_open":1,"created_at":"2019-06-29 10:49:06","updated_at":"2020-03-24 15:38:39","deleted_at":null,"open_name":"开启"},
      //   {"id":13,"uniacid":2,"sort":0,"name":"测试6","thumb":"https://b.yunzmall.com/images/2/2018/11/QjQDYPSEj8dWj28xYCezJ2LuCUaAJd.jpg","is_open":1,"created_at":"2018-12-19 16:09:07","updated_at":"2020-04-01 11:28:04","deleted_at":null,"open_name":"开启"},
      //   {"id":15,"uniacid":2,"sort":0,"name":"测试8","thumb":"https://b.yunzmall.com/images/2/2018/11/Q99iJ3gjJjSRwWw3Wj3s392wz38979.jpg","is_open":1,"created_at":"2018-12-19 16:09:56","updated_at":"2020-04-01 11:29:30","deleted_at":null,"open_name":"开启"},
      //   {"id":17,"uniacid":2,"sort":0,"name":"测试9","thumb":"https://b.yunzmall.com/images/2/2018/11/afAxalczOSaS22XuymUx46uX22z542.jpg","is_open":1,"created_at":"2018-12-19 16:10:56","updated_at":"2020-04-01 11:29:40","deleted_at":null,"open_name":"开启"},
      //   {"id":19,"uniacid":2,"sort":0,"name":"测试11","thumb":"https://b.yunzmall.com/images/2/2018/11/h15iM3y456M6Mx13lqfIxqygZLyQ64.jpg","is_open":1,"created_at":"2018-12-19 16:11:31","updated_at":"2020-04-01 11:29:02","deleted_at":null,"open_name":"开启"},
      //   {"id":22,"uniacid":2,"sort":0,"name":"牛奶","thumb":"https://5b0988e595225.cdn.sohucs.com/images/20171025/e7f0b52b12874aa19971d1c0db2006a8.gif","is_open":1,"created_at":"2019-06-29 10:49:06","updated_at":"2020-03-24 15:38:39","deleted_at":null,"open_name":"开启"},
      //   {"id":23,"uniacid":2,"sort":0,"name":"洗发","thumb":"https://b.yunzmall.com/洗发222222","is_open":1,"created_at":"2019-08-07 10:44:49","updated_at":"2019-08-08 11:48:29","deleted_at":null,"open_name":"开启"}
      //  ],
      carousels: [
        {
          "id": 3,
          "uniacid": 2,
          "name": "11",
          "link": "https://dev5.yunzshop.com/addons/yun_shop/?menu#/home?i=2",
          "thumb": "https://dev5.yunzmall.com/attachment/images/2/2019/05/hV12AOIipHh4VoR1iI4yoL6SFV41f2.jpg",
          "display_order": 1,
          "is_open": 1,
          "created_at": "2019-05-16 16:13:45",
          "updated_at": "2019-05-16 16:13:45",
          "deleted_at": null,
          "min_link": "",
          "min_url": ""
        },
        {
          "id": 5,
          "uniacid": 2,
          "name": "2",
          "link": "https://dev6.yunzmall.com/addons/yun_shop/?menu#/home?i=12",
          "thumb": "https://dev5.yunzmall.com/attachment/images/2/2019/12/SxZA32XxuaUi233I49ZMMWDsD94IxG.jpg",
          "display_order": 0,
          "is_open": 1,
          "created_at": "2019-12-27 08:58:54",
          "updated_at": "2019-12-27 09:23:06",
          "deleted_at": null,
          "min_link": "",
          "min_url": ""
        },
        {
          "id": 6,
          "uniacid": 2,
          "name": "33",
          "link": "https://dev6.yunzmall.com/addons/yun_shop/?menu#/home?i=12",
          "thumb": "https://b.yunzmall.com/image/e95d14a1b91aa82a7ba17d6870d33d10.png",
          "display_order": 2,
          "is_open": 1,
          "created_at": "2019-12-27 08:59:20",
          "updated_at": "2020-05-14 15:08:49",
          "deleted_at": null,
          "min_link": "",
          "min_url": "12121"
        }
      ]
    };
  },
  computed: {
    ...mapState(["view"]),
    datas() {
      return this.fun.chunk(this.category, 10);
    }
  },
  methods: {
    sortOut(e) {
      //console.log(e)
      this.$emit("watchSort", e);
    },
    bindCategory(id) {
      this.$emit("bindCategory", id);
    },
    showbox(e) {
      console.log(e);
    },
    toggle(event, n) {
      this.sort.up = n;
      let sort_name = "";
      if (n == 4) {
        this.$emit("showscreen");
      } else {
        if (n == 1) sort_name = "1";
        if (n == 2) sort_name = "2";
        if (n == 3) sort_name = "3";
        if (n == 5) sort_name = "id";
        if (event.target.className == "grid-content up") {
          event.target.className = "grid-content down";
          this.sortOut({ sort_name, sort_status: "1" });
        } else {
          event.target.className = "grid-content up";
          this.sortOut({ sort_name, sort_status: "2" });
        }
      }
    },
    //banner点击
    bannerClick() {
      if (!this.fun.isTextEmpty(this.cat_set.cat_adv_url)) {
        window.location.href = this.cat_set.cat_adv_url; //跳转
      }
    }
  },
  mounted() {
    this.clientWidths = document.body.clientWidth;
  },
  created() {
    this.clientWidths = document.body.clientWidth;
  },
  activated() {
    this.clientWidths = document.body.clientWidth;
  }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .c-swipe {
    background-color: #fff;
  }

  ul {
    margin: 0.875rem 0;
    margin-bottom: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    li {
      list-style: none;
      width: 20%;
      float: left;
      margin: 0;
      padding: 0;
      margin-bottom: 0.625rem;

      a {
        color: #2b2f33;
      }

      .image {
        height: 11vw;
        width: 100%;
        overflow: hidden;
      }

      img {
        width: 50%;
        vertical-align: middle;
        height: 90%;
        border-radius: 50%;
      }

      p {
        margin: 0;
        font-size: 12px;
        line-height: 1.125rem;
        max-height: 2.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 0 0.5rem;
        display: block;
      }
    }

    .pcStyle {
      .image {
        height: 2.625rem;
      }
    }
  }

  .sw_list {
    background-color: #fff;
  }

  .sw_list_6 {
    min-height: 5.4rem;
  }

  .sw_list_12 {
    // min-height: 10rem;
  }

  .sw_list_0 {
    min-height: 0;
  }

  @media all and (max-width: 400px) {
    .sw_list_12 {
      /* height: 12rem; */
    }
  }

  #sort {
    background: #fff;
    padding-bottom: 0.5rem;
    border-bottom: solid 0.0625rem #f9f9f9;
    font-size: 12px;
    color: #333;

    .grid-content.up::after {
      background-position: -10.625rem -0.9375rem;
    }

    .grid-content.down::after {
      background-position: -10.625rem 0;
    }

    .grid-content.up,
    .grid-content.down {
      color: #f15353;
    }

    .grid-content::after {
      content: '';
      display: inline-block;
      width: 0.5rem;
      height: 0.625rem;
      background: url(../../assets/images/jd-sprites.png) no-repeat;
      background-size: 12.5rem 12.5rem;
      background-position: -10.625rem -1.875rem;
      margin-left: 0.25rem;
    }

    i {
      color: #555;
    }
  }

</style>
