<template>
  <div id="course">
    <c-title :hide="false" text="课程"></c-title>
    <div class="search">
      <input
        type="text"
        class="s_input input_enter_placeholder"
        placeholder="搜索课程/讲师"
        v-model="searchVal"
        @click="moreGoods('all')"
      />
      <i slot="icon" class="iconfont icon-sousuo"
               style="position: absolute; right: 2.25rem; z-index: 8888; color: #c9c9c9; font-size: 16px;"></i>
    </div>
    <div class="tupian" style="">
      <van-swipe autoplay="30000" v-if="showCarousel" style="">
        <van-swipe-item v-for="(item,i) in carouselInfo" :key='i'>
          <a :href="item.link ? item.link : 'javascript:;'">
            <div style="padding-right: 1px; padding-left: 1px;">
              <img :src="item.thumb" style="width: 100%;" />
            </div>
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>
<!--    <div class="video_list">-->
<!--      <div class="video_icon">-->
<!--        <div class="top">-->
<!--          <img src="https://dev5.yunzmall.com/attachment/images/2/2018/11/afAxalczOSaS22XuymUx46uX22z542.jpg" alt="">-->
<!--        </div>-->
<!--        <div class="bottom">-->
<!--          推荐视频-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div class="ment">
      <van-swipe
        :autoplay="0"
        indicator-color="#f15353"
        class="sw_list"
        :width="fun.getPhoneEnv() == 3 ? 375 : clientWidths"
        :class="{
      sw_list_6: navigatioData != null && navigatioData.length > 0 && navigatioData[0].length <= 5,
      sw_list_12: navigatioData != null && navigatioData.length > 0 && navigatioData[0].length > 5,
      sw_list_0: navigatioData.length == 0
    }"
      v-if="isNavigatioy" >
        <van-swipe-item v-for="(items, index) in navigatioData" :key="index">
            <div class="video_list">
              <div class="video_icon"  v-for="(item, index) in items" :key="index">
                <a :href="item.link ? item.link : 'javascript:;'">
                  <div class="top" v-if="item.thumb">
                    <img :src="item.thumb" alt="">
                  </div>
                  <div class="" v-if="!item.thumb">
                    <img src="../../../assets/images/img_default.png" alt="">
                  </div>
                  <div class="bottom">
                    {{ item.navigation_name }}
                  </div>
                </a>
              </div>
            </div>
<!--          <ul>-->
<!--            <li v-for="(item, index) in items" :key="index" style="float:left;">-->
<!--              <a :href="item.link ? item.link : 'javascript:;'">-->
<!--                <div class="image" v-if="item.thumb"><img :src="item.thumb" /></div>-->
<!--                <div class="image" v-if="!item.thumb">-->
<!--                  <img src="../../../assets/images/img_default.png" />-->
<!--                </div>-->
<!--                <p class="text">{{ item.navigation_name }}</p>-->
<!--              </a>-->
<!--            </li>-->
<!--          </ul>-->
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="carefully_chosen_more"  v-if="showRec"  @click="moreGoods('is_recommand')">
        <div class="left">推荐</div>
        <div class="right">更多<i class="fa fa-angle-right"></i></div>
    </div>
    <div class="recommend_List">
      <ul :style="{marginLeft:-listMarginLeft+'rem' }" @touchstart="recommend_startBtn" @touchmove="recommend_moveBtn" @touchend="recommend_endBtn">
        <li :class="[i==activeIndex?'active':'']" v-for="(item,i) in recGoodList" :key="i" @click.stop="goToDetail(item.goods_id)">
          <div class="recommend_List_top">
            <img :src="item.thumb" alt="">
          </div>
          <div class="recommend_List_bottom">
            <div class="top">{{ item.title }}</div>
            <div class="bottom">
              <div class="left" v-if="item.has_one_lecturer"><i class="iconfont icon-home-line5"></i>讲师：{{ item.has_one_lecturer.real_name }}</div>
<!--              <div class="right" v-if="item.vip_level_status&&item.vip_level_status.status==1">-->
<!--                {{$i18n.t('money')}} <span class="cost2">{{ item.vip_level_status.word }}</span>-->
<!--              </div>-->
<!--              <div class="right" v-else>{{$i18n.t('money')}} {{ item.price }}</div>-->
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="carefully_chosen_more" v-if="showHot" @click="moreGoods('is_hot')">
      <div class="left">热卖</div>
      <div class="right">更多<i class="fa fa-angle-right"></i></div>
    </div>
    <ul class="hot_lsit" v-if="showHot">
        <li v-for="(item,i) in hotGoodList" :key='i' @click="goToDetail(item.goods_id)">
          <div class="hot_top">
            <img :src="item.thumb" alt="">
          </div>
          <div class="hot_bottom">
              <div class="top">{{ item.title }}</div>
              <div class="bottom">
                <div class="left" v-if="item.vip_level_status&&item.vip_level_status.status==1">
                      {{$i18n.t('money')}} <span class="cost2">{{ item.vip_level_status.word }}</span>
                </div>
                <div class="left" v-else>{{$i18n.t('money')}} {{ item.price }}</div>
                <div class="right">已购买{{item.total_sales}}</div>
              </div>
          </div>
        </li>
      </ul>
    <div class="carefully_chosen_more" v-if="showNew" @click="moreGoods('allGoods')">
      <div class="left">全部视频</div>
      <div class="right">更多<i class="fa fa-angle-right"></i></div>
    </div>
        <div class="full_video" v-if="showNew">
          <ul class="full_video_list">
            <li  v-for="(item,i) in newGoodList" :key='i'  @click="goToDetail(item.goods_id)">
              <div class="full_video_left">
                <img :src="item.thumb"  alt="">
              </div>
              <div class="full_video_right">
                <div class="video_name">{{ item.title }}</div>
                <div class="full_video_bottom">
                  <div class="leftContent">
                    <div class="pitch_number">共{{ item.course_chapter_num }}小节</div>
                    <div class="left" v-if="item.has_one_lecturer"> 讲师：{{ item.has_one_lecturer.real_name }}</div>
                  </div>
                  <div class="price" v-if="item.vip_level_status&&item.vip_level_status.status==1">
                    {{$i18n.t('money')}} <span class="cost2">{{ item.vip_level_status.word }}</span>
                  </div>
                  <div class="price" v-else>{{$i18n.t('money')}} {{ item.price }}</div>
<!--                  <div class="gratis">免费</div>-->
                </div>
              </div>
            </li>
          </ul>
          <div class="video_more" @click="getMoreData" v-if="isLoadMore">
              <span>{{ $i18n.t("加载更多") }}</span>
          </div>
        </div>
  </div>
</template>

<script>
import courseIndex_controller from "./course_index_controller";
export default courseIndex_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  #course {
    padding-bottom: 3.0625rem;

    .search {
      position: relative;
      background: #fff;
      height: 2.8125rem;
      line-height: 2.8125rem;
      padding-top: 0.2rem;

      input {
        width: 21.063rem;
        height: 1.969rem;
        background-color: #f8f8f8;
        border-radius: 0.984rem;
        padding-left: 1rem;
      }

      .icon-sousuo {
        font-size: 16px;
        color: rgb(201, 201, 201);
        position: absolute;
        right: 2.25rem;
        z-index: 8888;
      }
    }

    .ment {
      min-height: 1rem;
      background: #fff;

      .video_list {
        background: #fff;
        padding: 1.219rem 0.781rem 0.844rem 0.781rem;
        display: flex;
        flex-wrap: wrap;

        .video_icon {
          margin-left: 0.9rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .top {
            width: 2.875rem;
            height: 2.875rem;
            border-radius: 50%;
            margin: 0 auto 0.5rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .bottom {
            height: 1.844rem;
            line-height: 1.844rem;
            font-size: 0.875rem;
            width: 3.6rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        .video_icon:nth-of-type(1) {
          margin-left: 0;
        }

        .video_icon:nth-of-type(6) {
          margin-left: 0;
        }
      }

      /* .sw_list { */

      /*  padding-top: 0.6rem; */

      /* } */

      .sw_list_6 {
        /* height:  6rem; */
      }

      .sw_list_12 {
        height: 12rem;
      }

      .sw_list_0 {
        height: 0;
      }

      @media all and (max-width: 400px) {
        .sw_list_12 {
          height: 13rem;
        }
      }

      /* ul { */

      /*  margin: 0; */

      /*  padding: 0; */

      /*  li { */

      /*    list-style: none; */

      /*    width: 25%; */

      /*    float: left; */

      /*    margin: 0; */

      /*    padding: 0; */

      /*    margin-bottom: 0.625rem; */

      /*    a { */

      /*      color: #2b2f33; */

      /*    } */

      /*    .image { */

      /*      height: 3.28rem; */

      /*      overflow: hidden; */

      /*      line-height: 3.28rem; */

      /*      border-radius: 30%; */

      /*    } */

      /*    img { */

      /*      width: 50%; */

      /*      vertical-align: middle; */

      /*      height: 90%; */

      /*    } */

      /*    p { */

      /*      margin: 0; */

      /*      padding: 0; */

      /*      font-size: 12px; */

      /*      line-height: 1.25rem; */

      /*    } */

      /*  } */

      /* } */
    }
  }

  li {
    list-style: none;
  }

  img {
    display: block;
  }

  .tupian {
    background: #fff;
    padding-left: 0.781rem;
    padding-right: 0.781rem;
    position: relative;
    padding-top: 0.5rem;
  }

  .carefully_chosen_more {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;

    .left {
      line-height: 1.156rem;
      height: 1.156rem;
      font-size: 1rem;
      padding-left: 0.813rem;
    }

    .right {
      line-height: 1.156rem;
      height: 1.156rem;
      padding-right: 1.438rem;
      color: #999;
      font-size: 0.875rem;

      i {
        padding-left: 0.625rem;
        font-size: 1.2rem;
      }
    }
  }

  .recommend_List {
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    padding-bottom: 1.5rem;
    padding-top: 1rem;

    ul {
      margin-left: 0;
      padding-left: 6.6rem;
      display: flex;
      transition: 2s;

      li {
        flex-shrink: 0;
        background-color: #fff;
        width: 10.25rem;
        box-shadow:
          0.119rem 0.147rem 0.219rem 0
          rgba(133, 133, 133, 0.11);
        border-radius: 0.313rem;
        -moz-transform: scale(0.9, 0.9);
        -webkit-transform: scale(0.9, 0.9);
        -o-transform: scale(0.9, 0.9);
        transform: scale(0.9, 0.9);

        .recommend_List_top {
          min-height: 6.15rem;

          img {
            width: 100%;
          }
        }

        .recommend_List_bottom {
          text-align: left;

          .top {
            height: 2rem;
            line-height: 2.32rem;
            padding-left: 1rem;
            padding-right: 1rem;
            font-size: 0.875rem;
            color: #000;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 0.531rem;

            .left {
              font-size: 0.75rem;
              line-height: 0.938rem;
              height: 0.938rem;
              color: #999;
              padding-left: 0.594rem;
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .right {
              font-size: 0.875rem;
              line-height: 0.938rem;
              height: 0.938rem;
              color: #e20606;
              padding-right: 0.594rem;
              max-width: 6rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;

              .cost2 {
                color: #ccc;
                font-size: 0.75rem;
                padding-left: 0.4rem;
              }
            }
          }
        }
      }

      li.active {
        -moz-transform: scale(1, 1);
        -webkit-transform: scale(1, 1);
        -o-transform: scale(1, 1);
        transform: scale(1, 1);
        transition: 1s;
      }
    }
  }

  .hot_lsit {
    display: flex;
    justify-content: space-between;
    padding: 1.031rem 0.844rem 1.531rem 0.844rem;
    flex-wrap: wrap;
    background: #fff;

    li {
      background: #fff;
      width: 10.25rem;
      box-shadow:
        0 0 0.219rem 0
        rgba(133, 133, 133, 0.1);
      border-radius: 0.313rem;

      .hot_top {
        min-height: 6.15rem;

        img {
          border-top-left-radius: 0.4rem;
          border-top-right-radius: 0.4rem;
          width: 100%;
        }
      }

      .hot_bottom {
        padding-top: 0.375rem;
        border-top-left-radius: 0.4rem;
        border-top-right-radius: 0.4rem;
        width: 100%;

        .top {
          text-align: left;
          color: #000;
          line-height: 1rem;
          height: 2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 0.85rem;
          margin-bottom: 0.5rem;
          padding-left: 0.2rem;
        }

        .bottom {
          padding-bottom: 0.5rem;
          display: flex;
          justify-content: space-between;

          .left {
            font-size: 0.752rem;
            line-height: 0.938rem;
            height: 0.938rem;
            color: #e20606;
            padding-left: 0.216rem;
            max-width: 6rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-align: left;

            .cost2 {
              color: #ccc;
              font-size: 0.75rem;
              padding-left: 0.4rem;
            }
          }

          .right {
            font-size: 0.752rem;
            line-height: 0.938rem;
            height: 0.938rem;
            letter-spacing: 0;
            color: #999;
            padding-right: 0.438rem;
            max-width: 6rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .full_video {
    background: #fff;
    padding-top: 1.625rem;

    .full_video_list {
      margin-left: 0.781rem;
      margin-right: 0.781rem;

      li {
        padding-left: 0.375rem;
        border-bottom: 1px solid #f2f2f7;
        padding-bottom: 0.906rem;
        margin-bottom: 0.781rem;
        display: flex;

        .full_video_left {
          width: 6.281rem;
          height: 6.281rem;
          margin-right: 1.156rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .full_video_right {
          flex: 1;
          position: relative;
          padding-top: 0.2rem;

          .video_name {
            text-align: left;
            line-height: 1rem;
            height: 2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 0.25rem;
          }

          .full_video_bottom {
            position: absolute;
            bottom: 0.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .leftContent {
              .pitch_number {
                text-align: left;
                height: 0.9rem;
                line-height: 0.9rem;
                font-size: 0.875rem;
                color: #999;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 8rem;
              }

              .left {
                width: 8rem;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: 0.75rem;
                color: #999;
                text-align: left;
              }
            }

            .price {
              width: 6rem;
              white-space: nowrap;
              overflow: hidden;
              line-height: 0.938rem;
              height: 0.938rem;
              text-overflow: ellipsis;
              font-size: 0.875rem;
              color: #e20606;
              margin-right: 0.563rem;
              text-align: right;

              .cost2 {
                color: #ccc;
                font-size: 0.75rem;
                padding-left: 0.4rem;
              }
            }

            .gratis {
              width: 6rem;
              white-space: nowrap;
              overflow: hidden;
              line-height: 0.938rem;
              height: 0.938rem;
              text-overflow: ellipsis;
              color: #ff9d27;
              font-size: 0.875rem;
              text-align: right;
              margin-right: 0.563rem;
            }
          }
        }
      }
    }

    .video_more {
      font-size: 0.799rem;
      line-height: 0.938rem;
      height: 0.938rem;
      color: #999;
      padding-bottom: 1.531rem;
    }
  }

  .sousuo {
    width: 60%;
    height: 1.875rem;
    background-color: #f2f2f2;
    border-radius: 0.9375rem;
    position: absolute;
    top: 0.625rem;
    left: 20%;
    z-index: 999;
    opacity: 0.6;
  }

  .Recommend,
  .Hot,
  .Newest {
    width: 100%;
    background-color: white;
    padding-right: 0;
    padding-left: 0.75rem;
  }

  .touxiang {
    width: 4rem;
    height: 4rem;
    background-color: green;
    float: left;
  }

  .content {
    padding-top: 0.625rem;
  }

  .title {
    width: 17.4375rem;
    float: left;
    text-align: left;
    margin-left: 0.75rem;
  }

  .title02 {
    color: #999;
    font-size: 12px;
    margin-bottom: 0.125rem;
  }

  .title01 {
    margin-bottom: 0.5rem;
    font-size: 15px;
    color: #333;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .lecturer {
    float: left;
    color: #999;
    font-size: 12px;
  }

  .cost {
    float: right;
    color: red;
    line-height: 1rem;
    font-size: 12px;
  }

  .cost1 {
    font-size: 0.75rem;
    background: #f15353;
    color: white;
    padding: 0.2rem 0.5rem;
    border-top-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }

  #course {
    .course {
      margin-top: 2.5rem;
    }
  }

  .header {
    width: 6.25rem;
    height: 6.25rem;
    border-radius: 50%;
    background-color: red;
  }

  input {
    border: none;
    width: 90%;
    height: 1.75rem;
    color: #b89e9e;
    line-height: 1.75rem;
    background-color: #fafafa;
    border-radius: 0.9375rem;
    padding: 0 1.125rem 0 1.125rem;
    margin: 0 auto;
    position: relative;
  }

  .Recommend,
  .Hot,
  .Newest {
    width: 100%;
    background-color: white;
    padding-left: 12px;
  }

  .touxiang {
    width: 5rem;
    height: 5rem;
    background-color: green;
    float: left;
  }

  .content {
    padding-top: 0.625rem;
  }

  .title {
    width: calc(100% - 6.75rem);
    float: left;
    text-align: left;
    margin-left: 0.75rem;
    padding-right: 0.875rem;
  }

  .title02 {
    color: #999;
    font-size: 12px;
    margin-bottom: 0.125rem;
  }

  .title01 {
    margin-bottom: 0.5rem;
    font-size: 15px;
    color: #333;
  }

  .lecturer {
    float: left;
    color: #999;
    font-size: 12px;
  }

  .cost {
    float: right;
    color: #f15353;
    line-height: 1rem;
    font-size: 14px;
  }

  #course {
    .course {
      margin-top: 2.5rem;
    }
  }

  .header {
    width: 6.25rem;
    height: 6.25rem;
    border-radius: 50%;
  }
</style>
