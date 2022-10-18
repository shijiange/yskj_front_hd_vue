<template>
  <div id="daily_red_home">
    <div class="content" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
      <div class="headImg" :style="{ backgroundColor: color.bg_color }">
        <div class="header" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
          <i class="iconfont icon-back" @click="goback"></i>
          <span>{{ info.plugin_name }}</span>
        </div>
        <!-- <img :src="redData.thumb" alt="" @click="golink" /> -->
      </div>
      <div class="ImgBg" :style="{ backgroundColor: color.bg_color }">
        <div class="red-box">
          <div class="head">
            <span>今日红包</span>
            <div class="getTimeYS" v-if="info.time_between">领取时间：{{ info.time_between.start_time }}-{{ info.time_between.end_time }}</div>
            <div class="surplus">
              剩余次数<em>{{ info.surplus_number }}</em
              >次
            </div>
            <div class="get-red" v-if="info.status_button" @click="sureGet(info.status_button.value)" :style="{ backgroundColor: info.status_button.color }">
              <em>{{ info.status_button.tilte }}</em>
            </div>
          </div>
          <div class="red-number">
            <div class="red-Vdi">
              <span>本轮红包额度</span>
              <span v-if="info.redpack_info">{{ info.redpack_info.redpack_amount_total || 0 }}</span>
            </div>
            <div class="red-Vdi">
              <span>本轮红包数量</span>
              <span v-if="info.redpack_info">{{ info.redpack_info.redpack_number || 0 }}</span>
            </div>
            <div class="red-Vdi">
              <span>本轮剩余数量</span>
              <span v-if="info.redpack_info">{{ info.redpack_info.surplus_number }}</span>
            </div>
          </div>
          <div style="margin-top: 0.6rem;">
            <span style="font-size: 14px;">个人额度</span>
          </div>
          <div class="process" v-if="info.quota_info">
            <span class="bar" :style="{ width: bfb + '%' }"></span>
          </div>
          <div class="much">
            <div class="num" style="text-align: left;">
              <span>已领取</span>
              <span v-if="info.quota_info">{{ $i18n.t("money") }}{{ Number(info.quota_info.use_total).toFixed(2) }}</span>
            </div>
            <div class="num" style="text-align: right;">
              <span>剩余</span>
              <span v-if="info.quota_info">{{ $i18n.t("money") }}{{ Number(info.quota_info.surplus_total).toFixed(2) }}</span>
            </div>
          </div>

          <div class="get-ab">
            <div class="gray" @click="toPage('GetRedRecord')">领取记录</div>
            <div class="orange" @click="toPage('RedAmount')">我的额度</div>
            <div class="orange" @click="toPage('redRank')" style="margin-top: 0.5rem;">红包排名</div>
          </div>
        </div>

        <div class="list-box">
          <div class="title">
            <span>今日领取记录</span>
            <!-- <span class="gray-text">有{{ amount.totle }}人已领取</span> -->
          </div>
          <ul v-if="!this.fun.isTextEmpty(info.receive_logs)">
            <van-swipe vertical height="65" :loop="true" :autoplay="3000" :initial-swipe="0" :show-indicators="false" :touchable="false" ref="swipe" @change="swipeToTop">
              <van-swipe-item v-for="(item, index) in info.receive_logs.data" :key="index">
                <li>
                  <div class="left" v-if="item.member">
                    <img :src="item.member.avatar_image" alt="" v-if="item.member" />
                  </div>
                  <div class="right">
                    <div class="right-box">
                      <div class="name" v-if="item.member">{{ item.member.nickname }}</div>
                      <span class="price">{{ item.amount }}元</span>
                    </div>
                    <div class="right-box">
                      <span class="time" style="text-align: left;">{{ item.created_at }}</span>
                      <span class="time">已领取</span>
                    </div>
                  </div>
                </li>
              </van-swipe-item>
            </van-swipe>
          </ul>
        </div>

        <div class="text-box">
          <div class="title">活动介绍</div>
          <div style="margin: 0.5rem 1rem; text-align: left; font-size: 12px; color: #333;">
            <div v-html="info.introduction"></div>
          </div>
        </div>

        <div class="good-box">
          <div class="title">红包商品</div>
          <ul class="goods" v-if="info.goods_list">
            <li @click="toGood(item.id)" v-for="item in info.goods_list.data" :key="item.id">
              <div class="good-img">
                <img :src="item.thumb" alt="" />
              </div>
              <div class="good-title" style="-webkit-box-orient: vertical;">
                {{ item.title }}
              </div>
              <span class="amount" v-if="!fun.isTextEmpty(item.quota_proportion)">红包额度:{{ item.quota_proportion }}%</span>
              <div class="buy">
                <span>{{ $i18n.t("money") }}{{ item.price }}</span>
                <span class="red-buy">立即抢购</span>
              </div>
            </li>
          </ul>
          <div class="text" v-if="goods_list_page < goods_list_lastPage" @click="getMore('goods', goods_list_page)">点击加载更多</div>
          <div class="text" v-else>没有更多了</div>
        </div>
      </div>
    </div>
    <div class="posImg" @click="tapPerson" v-if="ru_open">
      <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/getred.png" alt="" />
    </div>
    <van-popup v-model="show" :overlay="true">
      <div class="red-popup">
        <img src="../../../assets/images/bg_redenvelope@2x.png" alt="" />
        <div class="pop-text">
          <span class="money">{{ $i18n.t("money") }}{{ amount }}</span>
          <span class="tip">恭喜您成功领取到红包！</span>
          <span class="sure-btn" @click="closeShow">确定</span>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="show1" :overlay="true" close-on-click-overlay>
      <div class="hint">
        <div class="txtHint">今天抢红包次数已用完，完成任务 增加红包次数</div>
        <div class="titleHint">任务奖励</div>
        <div class="rankBox" v-if="info.invite_set">
          <template v-if="info.invite_set.length > 6">
            <van-swipe vertical height="25" :loop="true" :autoplay="4000" :initial-swipe="0" :show-indicators="false" :touchable="false" ref="swipe" @change="swipeToTop">
              <van-swipe-item v-for="(item, index) in info.invite_set" :key="index">
                <div class="textLine">
                  <!-- <div style="font-size: 0.75rem; color: #333333; white-space: nowrap;">推荐 <span style="color: #ce2906;">N</span> 人可获得 <span style="color: #ce2906;">N</span> 次抢红包机会</div> -->
                  {{ item }}
                </div>
              </van-swipe-item>
            </van-swipe>
          </template>
          <template v-else>
            <div v-for="(item, index) in info.invite_set" :key="index">
              <div class="textLine">
                {{ item }}
              </div>
            </div>
          </template>
        </div>
        <div class="hintBtn" @click="show1 = false">我知道了</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import daily_red_home_controller from "./daily_red_home_controller";

export default daily_red_home_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.getTimeYS {
  margin-top: 0.8rem;
}

.posImg {
  position: fixed;
  right: 1rem;
  bottom: 7.13rem;
  width: 3.31rem;
  height: 3.03rem;

  img {
    width: 100%;
  }
}

.hint {
  width: 17rem;
  height: 19.34rem;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/daily_red24.png");
  padding-top: 3.53rem;
  padding-left: 2.34rem;
  padding-right: 2.81rem;
  display: flex;
  flex-direction: column;

  .rankBox {
    height: 6rem;
    overflow: hidden;

    .textLine {
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .hintBtn {
    width: 11.53rem;
    height: 2.44rem;
    background-image: linear-gradient(0deg, #ffbd05 0%, #fff15d 100%);
    box-shadow: 0 0.31rem 0.94rem 0 rgba(0, 0, 0, 0.2), inset 0 -0.12rem 0 0 #d8bd40;
    border-radius: 1.21rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.94rem;
    color: #ce2906;
    margin-top: 0.35rem;
  }

  .txtHint {
    text-align: left;
    font-size: 0.81rem;
  }

  .titleHint {
    font-size: 0.94rem;
    color: #ce2906;
    margin-top: 0.81rem;
    margin-bottom: 0.4rem;
  }
}

#daily_red_home {
  background: #f70034;

  .headImg {
    width: 100%;
    min-height: 3rem;

    .header {
      color: white;
      font-weight: bold;
      line-height: 22px;
      font-size: 18px;
      position: absolute;
      top: 0;
      width: 100%;
      text-align: center;
      padding: 0.5rem 0;
    }

    .icon-back {
      position: absolute;
      left: 1.5rem;
      font-weight: bolder;
    }

    img {
      width: 100%;
    }
  }

  .ImgBg {
    padding: 1rem 0;
    margin-top: -1rem;

    /* background: url("/addons/yun_shop/static/img/bg_2@2x.png") no-repeat; */
  }

  .red-box,
  .list-box,
  .text-box,
  .good-box {
    margin: 0 auto 1rem auto;
    padding-bottom: 1rem;
    width: 22rem;
    background-color: #fff;
    border-radius: 5px;
  }

  .title {
    font-size: 14px;
    color: #fd2352;
    font-weight: bold;
    padding: 0.8rem;
    margin: 0 1rem;
    border-bottom: 0.01rem solid #dcdbdb;
  }

  .list-box {
    overflow: hidden;

    .title {
      display: flex;
      flex-direction: column;
    }

    .gray-text {
      font-size: 12px;
      color: #6e6e6e;
    }

    ul {
      margin: 0.5rem 1rem;
      max-height: 16rem;

      li {
        display: flex;
      }

      .left {
        flex: 0 0 2.5rem;
        align-self: center;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
      }

      .right-box {
        display: flex;

        .name {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-align: left;
        }

        .price {
          text-align: right;
          color: #ff2a50;
        }

        .time {
          flex: 1;
          text-align: right;
          color: #999;
        }
      }
    }
  }

  .red-Vdi {
    display: flex;
    flex-direction: column;
  }

  .red-box {
    position: relative;

    .head {
      padding: 0.5rem;

      .surplus {
        em {
          margin: 0 0.3rem;
          color: red;
        }
      }
    }

    .red-color {
      font-size: 46px;
      color: #fe3055;
      margin: 1rem;

      span {
        color: #fe3055;
      }
    }

    .get-red,
    .get-gray {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      color: #fff;
      text-align: center;
      margin: 0.5rem auto 0 auto;

      em {
        line-height: 100px;
        font-size: 18px;
      }
    }

    .get-reds {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      span {
        color: #fff;
        font-size: 16px;
      }
    }

    .get-red {
      // background-image: linear-gradient(0deg, #ff3961 0%, #ffb65a 100%),
      // linear-gradient(#ff3255, #ff3255);
      background-blend-mode: normal, normal;
    }

    .get-gray {
      background-color: #e1e1e1;
    }

    .red-number {
      display: flex;

      div {
        flex: 1;
      }
    }

    .process {
      width: 20rem;
      height: 6px;
      background-color: #dfdfdf;
      border-radius: 3px;
      margin: 1rem auto;
      margin-top: 0.5rem;
      position: relative;

      .bar {
        position: absolute;
        left: 0;
        height: 6px;
        border-radius: 3px;
        background-color: #fd2352;
      }
    }

    .much {
      display: flex;
      width: 20rem;
      margin: 0 auto;

      .num {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
    }

    span {
      font-size: 12px;
      color: #666;
    }
  }

  .get-ab {
    position: absolute;
    top: 1rem;
    right: 0;
    font-size: 12px;
    color: #fff;
  }

  .gray {
    padding: 0.1rem 0.5rem;
    background-color: #d8d8d8;
    border-radius: 8px 0 0 8px;
    margin-bottom: 0.5rem;
  }

  .orange {
    padding: 0.1rem 0.5rem;
    background-color: #ff9f59;
    border-radius: 8px 0 0 8px;
  }

  .good-box {
    .text {
      font-size: 0.9rem;
      color: #9999;
      text-align: center;
    }

    .goods {
      margin: 0.5rem 1rem;
      display: flex;
      flex-wrap: wrap;

      li {
        width: 48%;
        text-align: left;
        font-size: 12px;
        margin-bottom: 0.5rem;
      }

      li:nth-child(odd) {
        margin-right: 0.7rem;
      }

      .good-img {
        width: 9.6rem;
        height: 9.6rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .good-title {
        word-break: break-all;
        color: #333;
        min-height: 2rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .amount {
        color: #fd2352;
        border: 1px solid #fd2352;
        line-height: 2rem;
        padding: 0.2rem;
        border-radius: 3px;
      }

      .buy {
        display: flex;
        font-size: 14px;

        span:first-child {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .red-buy {
        flex: 0 0 4rem;
        margin-left: 0.4rem;
        font-size: 12px;
        background-color: #fd2352;
        border-radius: 7px;
        color: #fff;
        padding: 0.1rem 0.3rem;
        text-align: center;
      }
    }
  }

  .red-popup {
    width: 17rem;
    margin: 0 auto;
    position: relative;

    .pop-text {
      color: #fff;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 3rem;
      display: flex;
      flex-direction: column;
      width: 90%;
    }

    .money {
      font-size: 44px;
    }

    .tip {
      font-size: 12px;
      margin: 1rem;
    }

    .sure-btn {
      background-color: #ffc900;
      border-radius: 20px;
      padding: 0.5rem;
      font-size: 20px;
    }

    img {
      width: 100%;
    }
  }

  .van-popup {
    background-color: transparent;
  }
}
</style>
