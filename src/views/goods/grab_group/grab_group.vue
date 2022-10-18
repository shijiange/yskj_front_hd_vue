<template>
  <!-- 抢团商品详情页 -->
  <div id="grab_group">
    <div class="content" v-show="showGood" :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div id="navTab" :class="{ hoet: hoet }">
        <a class="nav1" :class="{ current: currentClass == 0 }" @click.stop="jump(0)">商品</a>
        <a class="nav1" :class="{ current: currentClass == 1 }" @click.stop="jump(1)">评价</a>
        <a class="nav1" :class="{ current: currentClass == 2 }" @click.stop="jump(2)">详情</a>
      </div>
      <div id="hoid" @click="goto" :class="{ hoet: hoet }">
        <div class="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <div id="cart" @click="gotoHome" :class="{ hoet: hoet }">
        <div class="back">
          <i class="iconfont icon-ai-home"></i>
        </div>
      </div>
      <div id="member" @click="gotoMember" :class="{ hoet: hoet }">
        <div class="back">
          <!-- <i class="fa fa-user"></i> -->
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <div ref="onePage" id="onePage" style="overflow: hidden; min-height: 100vh;">
        <div style="-webkit-overflow-scrolling: touch;" id="main">
          <viewer :images="gooddatas.thumb_url" class="section">
            <c-myswipe :style="{ height: this.fun.getPhoneEnv() == 3 ? '375px' : '100vw' }" :pagination-visible="true" :slides="gooddatas.thumb_url" :repeating="true" :auto="0" class="banner_pcStyle">
              <div v-if="!fun.isTextEmpty(gooddatas.goods_video)">
                <video
                  id="goods_vedio"
                  style="width: 100%; height: 100%; object-fit: scale-down;"
                  :poster="gooddatas.video_image"
                  :src="gooddatas.goods_video"
                  controls
                  webkit-playsinline="true"
                  playsinline="true"
                  x5-playsinline="true"
                  x-webkit-airplay="true"
                  x5-video-ignore-metadata="true"
                  width="100%"
                  height="100%"
                >
                  <source :src="gooddatas.goods_video" />
                </video>
              </div>
              <div v-if="!gooddatas.thumb_url || gooddatas.thumb_url == null|| gooddatas.thumb_url.length == 0">
                <img :src="gooddatas.thumb" width="100%" />
              </div>
              <div v-for="(ithumb, index) in gooddatas.thumb_url" :key="index">
                <template v-if="ithumb">
                  <img :src="ithumb" width="100%" />
                </template>
                <template v-if="!ithumb">
                  <img src="../../../assets/images/img_default.png" width="100%" />
                </template>
              </div>
            </c-myswipe>
          </viewer>
          <div class="rob-time" v-if="gooddatas.end_time">
            <div class="active-text">{{ timestamp < gooddatas.start_time ? "活动开始倒计时" : "活动截止倒计时" }}</div>
            <div class="active-time">
              <van-count-down :time="fun.getTimeDifference(istimestamp)" class="bottom_time" format="DD天HH时mm分ss秒" @finish="begTimeBtn">
                <template #default="timeData">
                  <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.days < 10 ? `0${timeData.days}` : timeData.days }}</em> 天
                  <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.hours < 10 ? `0${timeData.hours}` : timeData.hours }}</em>
                  <b>:</b>
                  <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.minutes < 10 ? `0${timeData.minutes}` : timeData.minutes }}</em>
                  <b>:</b>
                  <em style="padding: 0.25rem 0.1875rem; border-radius: 0.125rem;">{{ timeData.seconds < 10 ? `0${timeData.seconds}` : timeData.seconds }}</em>
                </template>
              </van-count-down>
            </div>
          </div>
          <div class="title_number">
            <div class="good_title">{{ gooddatas.title }}</div>
            <div class="title_Main">
              <h1 style="-webkit-box-orient: vertical;">
                <font style="font-size: 0.875rem;">{{ $i18n.t("money") }}</font> {{ gooddatas.price_num
                }}<font class="market-price" v-if="Number(gooddatas.market_price) > 0">{{ fun.getMarketPrice() }}: {{ gooddatas.market_price }}</font>
              </h1>
              <i class="iconfont icon-erweima" @click="postShow()"></i>
              <i class="iconfont icon-fenxiang" @click="shareWeixin()"></i>
              <div class="share_text" @click="shareWeixin()">分享</div>
            </div>
            <ul class="number">
              <li>
                <span>库存{{ gooddatas.stock }}</span>
                <span>销量{{ gooddatas.show_sales }}件</span>
              </li>
            </ul>
          </div>
          <div class="group_play">
            <h2>抢团玩法</h2>
            <ul class="play">
              <li>
                <span>1</span>
                <span>选择商品付款开团/参团</span>
              </li>
              <li class="border_lr">
                <span>2</span>
                <span>邀请并等好友支付参团</span>
              </li>
              <li>
                <span>3</span>
                <span>达到人数抢团</span>
              </li>
            </ul>
          </div>

          <div class="member-reward" v-if="gooddatas.is_profit == 1">
            <div class="member-reward-btn">团长奖励</div>
            交易成功团长可获得
            <div class="member-reward-price">{{ $i18n.t("money") }} {{ gooddatas.profit }}</div>
          </div>

          <div class="group_into" v-if="!this.fun.isTextEmpty(team)">
            <h2>以下小伙伴抢团中，可直接参与</h2>
            <div class="more">
              <span @click="showGroupMore()">查看更多</span>
              <i class="fa fa-angle-right"></i>
            </div>
            <div class="into_bg_color" @touchmove.stop>
              <van-swipe :style="` height:${team.length>0?team[0].length>0?'120px':'60px':'auto'} `" vertical :autoplay="2000" :show-indicators="false">
                <van-swipe-item v-for="(teamItem,itemIndex) in team" :key="itemIndex">
                  <div class="into_user" v-for="userItem in teamItem" :key="userItem.id">
                    <div class="user">
                      <img :src="userItem.avatar" />
                    </div>
                    <ul class="time">
                      <li class="time_a">
                        <div>{{ userItem.nickname }}</div>
                        <div>还差{{ userItem.surplus_member }}人成团</div>
                      </li>
                      <li class="time_b">
                        <div>
                          剩余<span>
                            <van-count-down :time="fun.getTimeDifference(userItem.end_time)" format="DD天HH时mm分ss秒" @finish="hideIdexbb"></van-count-down>
                          </span>
                        </div>
                        <div>{{ gooddatas.limit_num }}人团</div>
                      </li>
                    </ul>
                    <button @click="clickAdd(userItem.leader_id)" v-if="userItem.is_oneself == 0" type="button">去参团</button>
                    <button @click="clickAdd(userItem.leader_id)" v-else type="button">邀请好友</button>
                  </div>
                </van-swipe-item>
              </van-swipe>
            </div>
          </div>

          <div class="act-box">
            <ul class="act" @click="showParameter = true">
              <li class="act1" style="color: #999;">参数</li>
              <li class="act2">商品参数详情</li>
              <li class="act3"><span></span></li>
              <i class="fa fa-angle-right"></i>
            </ul>
          </div>

          <c-comment
            class="section"
            :commentInfo="commentLimit"
            :tatal="commentLimit.length"
            :rate="favorable_rate"
            :goods_id="this.$route.params.id"
            :isCup="this.isCup"
            v-on:RouterTo="FromTo"
          ></c-comment>
          <div class="pullUp" v-if="!showPageB">
            <img src="../../../assets/images/goods/pull_up@2x.png" alt="" id="imgs" :class="[isPullUp ? 'rotateImg' : 'normalImg']" /><i id="loadMore">{{
              isPullUp ? "释放展开图文详情" : "上拉展开图文详情"
            }}</i>
          </div>
          <span v-if="!showPageB" style="display: inline-block; width: 100%; height: 1.5rem;"></span>
          <div id="shopInfo" ref="goodinfo" class="section isMarginBottom" :class="{ goodTop: goodTop == true }" v-if="showPageB">
            <p style="" class="title-text">商品详情</p>
            <div id="tabs">
              <div ref="goodPage" id="goodPage">
                <div>
                  <div id="goods_content" v-html="first_content"></div>
                  <p v-if="fun.isTextEmpty(first_content)" style="color: #666;">暂无该商品详情 ~</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="group_btn">
        <ul class="item">
          <li class="item_a" @click="gotoGrabGroupHome()">
            <i class="iconfont icon-info_store"></i>
            <span>主页</span>
          </li>
          <!-- <a class="item_a" :href="cservice" v-if="!fun.isTextEmpty(cservice)">
            <i class="iconfont icon-goods_kefu"></i>
            <span>客服</span>
          </a> -->
          <div class="group_btn_box">
            <template v-if="timestamp > gooddatas.start_time && timestamp < gooddatas.end_time">
              <!-- 活动进行 -->
              <li
                class="item_b "
                :style="{
                  background: '#ff6000',
                  width: leader_partake == 1 ? '8rem' : '90%'
                }"
                @click="openOrder(1)"
              >
                开团
                <div class="text">(不参与抢团)</div>
              </li>
              <li v-if="leader_partake == 1" class="item_b" style=" background: #ff2c29;" @click="openOrder(2)">
                开团
                <div class="text">(参与抢团)</div>
              </li>
            </template>
            <li class="item_c" v-if="timestamp < gooddatas.start_time">活动未开始</li>
            <li class="item_c" v-if="timestamp > gooddatas.end_time">活动已结束</li>
          </div>
        </ul>
      </div>
      <van-popup v-model="showComment" position="right" duration="0" :style="{ height: '100%', width: '100%' }">
        <van-nav-bar title="全部评价" class="pcStyle_ydT">
          <template #left>
            <span>
              <van-icon name="arrow-left" size="18" @click.native="showComment = false" color="#333" />
            </span>
          </template>
        </van-nav-bar>
        <!-- 商品评价 -->
        <c-commentlist v-on:clickMore="getCommentData" :list="third_content" :noMoreComment="noMoreComment" :isCup="isCup" v-if="showComment"></c-commentlist>
      </van-popup>
      <!-- 商品分享二维码 -->
      <van-popup v-model="posterShow" closeOnClickModal="true" style="width: 17.8125rem; height: 34.5rem; padding: 0; background: none;">
        <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
          <img :src="'data:' + posterImg.mime + ';base64,' + posterImg.base64Image" v-if="posterImg.base64Image" style="width: 98%; border-radius: 0.375rem;" />
          <!-- 关闭图标 -->
          <div class="icon_close" @click="posterShow = false">
            <i class="iconfont icon-close11"></i>
          </div>
          <!--  -->
        </div>
      </van-popup>
      <van-popup v-model="show2" position="center" round :style="{ width: this.fun.getPhoneEnv() == 3 ? '375px' : '88%' }">
        <div class="open_group">
          <p>以下小伙伴抢团中，可直接参与</p>
          <div class="icon_close" @click="show2 = false">
            <i class="iconfont icon-close11"></i>
          </div>
          <div class="setMaxH">
            <div class="into_bg_color" v-if="!fun.isTextEmpty(team) && show2">
              <div v-for="(item, index) in team" :key="index">
                <div class="into_user" v-for="userItem in item" :key="userItem.id" @click.stop="clickAdd(userItem.leader_id)">
                  <div class="user">
                    <img :src="userItem.avatar" />
                  </div>
                  <ul class="time">
                    <li class="time_a">
                      <div>{{ userItem.nickname }}</div>
                      <div>还差{{ userItem.surplus_member }}人成团</div>
                    </li>
                    <li class="time_b">
                      <div>
                        剩余<span v-if="userItem.end_time">
                          <van-count-down :time="fun.getTimeDifference(userItem.end_time)" format="DD天HH时mm分ss秒" @finish="hideIdexbb"></van-count-down>
                        </span>
                      </div>
                      <div>{{ gooddatas.limit_num }}人团</div>
                    </li>
                  </ul>
                  <button @click.stop="clickAdd(userItem.leader_id)" v-if="userItem.is_self == 0" type="button">加入该团</button>
                  <button @click.stop="clickAdd(userItem.leader_id)" v-else type="button">邀请好友</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-popup>
      <van-popup v-model="showParameter" position="bottom" :style="{ height: '60%' }">
        <van-nav-bar title="商品参数" class="pcStyle_ydT">
          <template #right>
            <i class="iconfont icon-close11" style="color: #666; size: 1.25rem;" @click="showParameter = false"></i>
          </template>
        </van-nav-bar>
        <div style="clear: both;" class="pcStyle_ydC">
          <ul class="parameterClass">
            <li v-for="(items, index) in gooddatas.has_many_param" :key="index">
              <span class="leftb">{{ items.title }}</span>
              <span class="rightb">{{ items.value }}</span>
            </li>
            <p class="notext" v-if="fun.isTextEmpty(gooddatas.has_many_param)"><br />抱歉，暂无该商品参数 ~</p>
          </ul>
        </div>
      </van-popup>

      <yz-specs :goodsInfo="gooddatas" ref="goodSku" v-model="popupSpecs" v-on:closeSpecsPopup="close_yz_specs_popup">
        <div class="slot_style">
          <span>{{ gooddatas.limit_num }}人团</span>
        </div>
      </yz-specs>
    </div>
    <div class="play-video" v-if="showShare" style="z-index: 9999;" @click="closeShare">
      <img src="../../../assets/images/share_bg1.png" alt />
      <p>请点击右上角进行分享</p>
    </div>
  </div>
</template>

<script>
import grab_group_controller from "./grab_group_controller";

export default grab_group_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#grab_group {
  padding-bottom: 50px;

  #navTab {
    position: fixed;
    z-index: 999;
    width: 12rem;
    left: 50%;
    margin-left: -6rem;
    display: none;
    background: #fdfdfd;

    a {
      padding: 0 0.8rem;
      height: 2.25rem;
      line-height: 2.25rem;
    }

    .current {
      color: #1f1f1f;
      font-weight: bold;
      border-bottom: 0.1875rem transparent solid;
      border-width: 100%;
      border-color: #f15353;
    }
  }

  #navTab .current {
    color: #1f1f1f;
    font-weight: bold;
    border-bottom: 0.1875rem transparent solid;
    border-width: 100%;
    border-color: #f15353;
  }

  #navTab.hoet {
    display: flex;
    justify-content: space-around;
  }

  .section {
    position: relative;
  }

  .share_text {
    font-size: 10px;
    color: #9b9b9b;
    margin-left: 0.125rem;
    line-height: 1.5rem;
  }

  .act-box {
    height: 2.625rem;
    line-height: 2.625rem;
    font-size: 14px;
    background-color: #fff;
    margin-top: 0.625rem;
    padding: 0 0.75rem;
    color: #333;

    .act {
      display: flex;
    }

    .act1 {
      margin-right: 1.25rem;
    }

    .act3 {
      flex: 2.5;
      margin-left: 0.625rem;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    i {
      text-align: right;
      float: right;
      line-height: 2.75rem;
      font-size: 20px;
      color: #999;
    }
  }

  .content {
    position: relative;

    #hoid {
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
    }

    #cart {
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      box-sizing: content-box;
    }

    #member {
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      box-sizing: content-box;
    }

    #cart {
      right: 0;
    }

    #member {
      right: 2rem;
    }

    #hoid.hoet {
      background: #fdfdfd;
      width: 100%;
      color: #1f1f1f;
    }

    .back {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 100%;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.4);
      text-indent: 0;
      line-height: 1.7rem;
      overflow: hidden;
    }

    .hoet .back {
      transition: 0.1s;
      background-color: rgba(237, 237, 237, 0);
      color: #1f1f1f;
    }

    .title_number {
      background: #fff;
      padding: 0.875rem;

      .good_title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        text-align: left;
        font-size: 0.875rem;
        line-height: 1.5rem;
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #000;
      }

      .title_Main {
        display: flex;

        h1 {
          flex: 3;
          font-size: 1.5rem;
          text-align: left;
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: #ed0606;
        }

        i {
          font-size: 1.125rem;
          color: #666;
          margin-left: 1rem;
          line-height: 1.5rem;
        }

        .market-price {
          font-size: 0.75rem;
          color: #999;
          font-weight: 400;
          margin-left: 0.5rem;
          text-decoration: line-through;
        }
      }

      .number {
        margin-top: 0.5rem;

        li {
          display: flex;

          span {
            font-size: 12px;
            color: #8c8c8c;
            margin-right: 1.375rem;
          }
        }
      }
    }

    .group_play {
      margin-top: 0.625rem;
      background: #fff;
      padding: 0.875rem;

      h2 {
        font-weight: normal;
        font-size: 15px;
        margin-bottom: 0.625rem;
        text-align: left;
        color: #000;
      }

      .play {
        display: flex;
        padding: 0.375rem;

        li {
          width: 33.3%;
          margin-right: 0.25rem;
          color: #333;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;

          span:first-child {
            display: inline-table;
            width: 1rem;
            height: 1rem;
            color: #ff6333;
            font-size: 12px;
            border-radius: 1rem;
            background: rgba(255, 96, 0, 0.1);
            text-align: center;
            margin-right: 0.375rem;
          }

          span:last-child {
            width: 5.625rem;
            text-align: center;
            line-height: 1rem;
            margin-top: 0.5rem;
          }
        }

        li:last-child {
          margin: 0;
        }

        .border_lr::before,
        .border_lr::after {
          content: "";
          position: absolute; /* 定位背景横线的位置 */
          top: 0.5rem;
          background: #ccced0; /* 背景横线颜色 */
          width: 70%; /* 单侧横线的长度 */
          height: 1px;
        }

        .border_lr::before {
          left: -40%; /* 调整背景横线的左右距离 */
        }

        .border_lr::after {
          right: -40%;
        }
      }
    }

    .rob-time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.875rem;
      height: 2.75rem;
      background: url(../../../assets/images/goods/time_buy_bg@2x.png) no-repeat center;
      background-size: 100%;
      color: #fff;
      font-size: 0.875rem;
      font-weight: bold;

      span {
        color: #fff;
        font-size: 0.75rem;
      }

      em {
        background-color: #fff;
        color: #000;
        font-weight: bold;
      }

      .bottom_time {
        margin-top: 0.125rem;
        line-height: 1rem;
        color: #fff;
      }
    }

    .member-reward {
      display: flex;
      align-items: center;
      padding: 0 0.875rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background: #fff;
      margin-top: 0.625rem;
      font-size: 0.75rem;

      .member-reward-btn {
        height: 1.5rem;
        line-height: 1.5rem;
        background-color: rgba(255, 93, 0, 0.1);
        border-radius: 0.75rem;
        padding: 0 0.5rem;
        margin-right: 0.625rem;
        color: #ff6000;
      }

      .member-reward-price {
        color: #ff2c29;
        margin-left: 0.5rem;
      }
    }

    .group_into {
      background: #fff;
      margin: 0.625rem 0;
      padding: 0.875rem;
      position: relative;

      h2 {
        font-weight: normal;
        font-size: 15px;
        margin-bottom: 0.625rem;
        text-align: left;
      }

      .more {
        position: absolute;
        top: 0.875rem;
        right: 0.875rem;
        display: flex;
        color: #8c8c8c;
        font-size: 12px;

        .fa {
          font-size: 1rem;
          margin-left: 0.375rem;
        }
      }

      .into_bg_color {
        background-color: #f5f5f5;
        border-radius: 0.125rem;
        padding: 0.375rem;
      }

      .into_user {
        display: flex;
        align-items: center;
        background: #fff;
        padding: 0.5rem;
        margin-bottom: 10px;

        .user {
          width: 2.25rem;
          height: 2.25rem;
          background: #f2f2f2;
          border-radius: 2rem;
          overflow: hidden;
          flex-shrink: 0;

          img {
            width: 100%;
          }
        }

        .time {
          width: 14.3125rem;
          text-align: left;

          li {
            margin: 0 0.625rem;
            display: flex;
            justify-content: space-between;
          }

          .time_a {
            font-size: 0.75rem;
          }

          .time_b {
            font-size: 0.75rem;
            color: #8c8c8c;

            span {
              color: #f15353;
              display: inline-block;

              .van-count-down {
                font-size: 0.75rem;
                color: #f15353;
              }
            }
          }
        }

        button {
          border: none;
          background: #ff6000;
          color: #fff;
          width: 3.875rem;
          height: 1.625rem;
          border-radius: 1rem;
          font-size: 12px;
        }
      }
    }

    .group_detail {
      margin-top: 0.625rem;
      background: #fff;
    }

    .group_btn {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 3.125rem;
      background: #fff;
      border-top: solid 0.0625rem #ebebeb;

      .item {
        height: 3.125rem;
        display: flex;

        .item_a {
          width: 4.75rem;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .iconfont {
            color: #666;
            font-size: 1.5rem;
          }

          span {
            color: #666;
            font-size: 12px;
            display: block;
          }
        }

        .item_b,
        .item_c {
          width: 8rem;
          height: 2.25rem;
          background: #ff6000;
          color: #fff;
          font-size: 14px;
          border-radius: 1.125rem;
          display: flex;
          flex-direction: column;
        }

        .item_c {
          background: #999;
          width: 100%;
          line-height: 2.25rem;
          margin-right: 0.875rem;
        }

        .endClass {
          background: #c9c9c9 !important;
        }

        .group_btn_box {
          flex: 1;
          display: flex;
          justify-content: space-around;
          align-items: center;

          .text {
            font-size: 0.75rem;
          }
        }
      }
    }

    .mint-popup-4 {
      width: 100%;
    }

    .open_group {
      background: #fff;
      padding: 0.625rem;
      border-radius: 0.5rem;

      p {
        font-size: 14px;
        margin-bottom: 0.625rem;
      }

      .icon_close {
        position: absolute;
        top: 0.25rem;
        right: 0;
        width: 2.5rem;
        height: 2.5rem;

        .iconfont {
          line-height: 2.5rem;
          font-size: 0.875rem;
          color: #999;
        }
      }

      .setMaxH {
        max-height: 12rem;
        overflow: scroll;

        .into_bg_color {
          background-color: #f5f5f5;
          border-radius: 0.125rem;
          padding: 0.375rem;
        }

        .into_user {
          display: flex;
          align-items: center;
          background: #fff;
          padding: 0.5rem;

          .user {
            width: 2.25rem;
            height: 2.25rem;
            background: #f2f2f2;
            border-radius: 2rem;
            overflow: hidden;

            img {
              width: 100%;
            }
          }

          .time {
            width: 11.5rem;
            text-align: left;

            li {
              margin: 0 0.625rem;
              display: flex;
              justify-content: space-between;
            }

            .time_a {
              font-size: 0.75rem;
            }

            .time_b {
              font-size: 0.75rem;
              color: #8c8c8c;

              span {
                color: #f15353;
              }
            }
          }

          button {
            border: none;
            background: #ff6000;
            color: #fff;
            width: 3.875rem;
            height: 1.625rem;
            border-radius: 1rem;
            font-size: 12px;
          }
        }
      }
    }

    .icon_close {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .isMarginBottom {
      margin-top: 0.625rem;

      .title-text {
        display: block;
        position: relative;
        color: #999;
        text-align: center;
        font-weight: 400;
        padding: 0.875rem 5rem;
        background: #fff;
      }

      .title-text::before,
      .title-text::after {
        content: "";
        position: absolute; /* 定位背景横线的位置 */
        top: 50%;
        background: #ccced0; /* 背景横线颜色 */
        width: 20%; /* 单侧横线的长度 */
        height: 1px;
      }

      .title-text::before {
        left: 15%; /* 调整背景横线的左右距离 */
      }

      .title-text::after {
        right: 15%;
      }
    }

    .pullUp {
      display: flex;
      height: 3.125rem;
      line-height: 3.125rem;
      justify-content: center;
      align-items: center;
      color: #666;
      background: #fff;
      margin: 0.75rem 0 -2.625rem;

      img {
        width: 1rem;
        height: 1rem !important;
        margin: 0 0.5rem 0 0;
      }

      .rotateImg {
        transform: rotate(180deg);
        -webkit-transform: rotate(180deg);
        transition: transform 0.5s;
      }

      .normalImg {
        transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        transition: transform 0.5s;
      }
    }
  }

  .code_box {
    position: relative;

    .icon_close {
      position: absolute;
      bottom: 0;
      top: auto;
      right: 50%;
      width: 2.5rem;
      height: 2.5rem;
      margin-right: -1.25rem;
      border: 1px solid #fff;
      border-radius: 100%;

      i {
        line-height: 2.5rem;
        font-size: 1.125rem;
        color: #fff;
      }
    }
  }

  .icon_close {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
  }

  .parameterClass {
    li {
      width: 100%;
      display: flex;
      text-align: left;
      padding: 0.75rem 0.75rem;
      position: relative;

      .leftb {
        flex: 0 0 20%;
        margin-right: 1.25rem;
        font-size: 12px;
        color: #000;
      }

      .rightb {
        flex: 1;
        font-size: 14px;
        color: #5d5d5d;
      }
    }

    .notext {
      color: #fd8900;
      line-height: 1.8rem;
    }

    li::before {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -11rem;
      width: 22rem;
      height: 1px;
      background: #e4e4e4;
    }
  }

  .pcStyle {
    #hoid {
      width: 375px !important;
    }

    #cart {
      right: 50%;
      margin-right: -186px;
    }

    #member {
      right: 50%;
      margin-right: -150px;
    }

    .banner_pcStyle {
      height: 375px !important;
    }

    .mint-popup-4 {
      width: 375px;
    }

    .group_btn {
      width: 375px;
    }
  }

  .slot_style {
    display: flex;
    padding: 0 0.625rem;
    margin: 0.875rem 0;

    span {
      height: 1.625rem;
      line-height: 1.625rem;
      display: inline-block;
      border: 1px solid #fb4a4a;
      border-radius: 0.25rem;
      color: #fb4a4a;
      padding: 0 0.5rem;
    }
  }

  .play-video {
    position: fixed;
    z-index: 9;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }

    p {
      position: fixed;
      top: 40%;
      width: 100%;
      text-align: center;
      font-size: 1.5rem;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
