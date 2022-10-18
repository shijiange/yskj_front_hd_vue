<template>
  <div id="auction_good" ref="auction_good">

    <div class="content" v-if="is_verify==1">
      <div id="hoid"
           @click="goto"
      >
        <div id="back">
          <i class="iconfont icon-member-left"></i>
        </div>
      </div>
      <div id="cart"
           @click="gotoCart"

      >
        <div id="back">
          <i class="iconfont icon-ai-home"></i>
        </div>
      </div>
      <div id="member"
           @click="gotoMember"
      >
        <div id="back">
          <i class="iconfont icon-wode-wode"></i>
        </div>
      </div>
      <div style="overflow: hidden;">
        <viewer :images="auction.thumb_url"
                style="background-color: #333;"
                class="section">
          <c-myswipe :style="{ height:fun.getPhoneEnv() == 3 ? '375px' : '100vw' }"
                     :pagination-visible="true"
                     :slides="auction.thumb_url"
                     :repeating="true"
                     :auto="0"
                     class="banner_pcStyle">
            <div v-if="!fun.isTextEmpty(auction.goods_video)">
              <video id="goods_vedio"
                     style="width: 100%; height: 100%; object-fit: scale-down;"
                     :poster="auction.video_image"
                     :src="auction.goods_video"
                     controls
                     webkit-playsinline="true"
                     playsinline="true"
                     x5-playsinline="true"
                     x-webkit-airplay="true"
                     x5-video-ignore-metadata="true"
                     width="100%"
                     height="100%">
                <source :src="auction.goods_video"/>
              </video>
            </div>
            <div v-if="fun.isTextEmpty(auction.thumb_url)">
              <img :src="auction.thumb"
                   width="100%"/>
            </div>
            <div v-for="(ithumb, index) in auction.thumb_url"
                 :key="index">
              <template v-if="ithumb">
                <img :src="ithumb"
                     width="100%"/>
              </template>
            </div>
          </c-myswipe>
        </viewer>
      </div>
      <div class="count-time" v-show="now<auction.start_shooting">
        <div class="txt">
          <i class="iconfont icon-fontclass-liulan"></i>
          距离开拍时间</div>

        <van-count-down :time="fun.getTimeDifference(auction.start_shooting)" class="time" format="DD天HH时mm分ss秒S" :millisecond="true"
                        @finish="timeEnd('ready')" v-if="now<auction.start_shooting">
          <template #default="timeData">
            <em class="time-item" v-if="timeData.days">{{ timeData.days <10 ? `0${timeData.days}` :timeData.days}} </em>{{timeData.days?'天':''}}
            <em class="time-item" v-if="timeData.hours">{{ timeData.hours <10 ?`0${timeData.hours}` :timeData.hours }}
            </em>
            <b v-if="timeData.hours">时</b>
            <em class="time-item" v-if="timeData.minutes">{{ timeData.minutes <10 ?`0${timeData.minutes}` :timeData.minutes }}
            </em>
            <b v-if="timeData.minutes">分</b>
            <em class="time-item" >{{ timeData.seconds <10 ?`0${timeData.seconds}` :timeData.seconds }}
            </em>
            <b>秒</b>
            <em class="time-item">0{{ reversedMessage(timeData.milliseconds) }}
            </em>
          </template>
        </van-count-down>
      </div>
      <div class="count-time" v-show="auction.start_shooting<=now&&now<auction.end_shooting">

        <div class="txt">
          <i class="iconfont icon-fontclass-liulan"></i>
          正在进行</div>

        <van-count-down :time="fun.getTimeDifference(auction.end_shooting)" class="time" format="DD天HH时mm分ss秒S" :millisecond="true"
                        @finish="timeEnd('start')" v-if="auction.start_shooting<=now&&now<auction.end_shooting">
          <template #default="timeData">
            <em class="time-item" v-if="timeData.days">{{ timeData.days <10 ? `0${timeData.days}` :timeData.days}} </em>{{timeData.days?'天':''}}
            <em class="time-item" v-if="timeData.hours">{{ timeData.hours <10 ?`0${timeData.hours}` :timeData.hours }}
            </em>
            <b v-if="timeData.hours">时</b>
            <em class="time-item" v-if="timeData.minutes">{{ timeData.minutes <10 ?`0${timeData.minutes}` :timeData.minutes }}
            </em>
            <b v-if="timeData.minutes">分</b>
            <em class="time-item" >{{ timeData.seconds <10 ?`0${timeData.seconds}` :timeData.seconds }}
            </em>
            <b>秒</b>
            <em class="time-item">0{{ reversedMessage(timeData.milliseconds) }}
            </em>
          </template>
        </van-count-down>
      </div>
      <div class="count-time" v-show="now >= auction.end_shooting || isEnd"
           style="background-color: #999 !important; height: 2.5625rem; display: flex; align-items: center; padding: 0 1rem; background-image: none;">
        <div class="txt">本场拍卖活动已结束</div>
      </div>
      <div class="title">
        <div class="top">
          <div class="left">
            <span style="color: #ed0606;">起拍价{{$i18n.t("money")}}</span>
            <span style="color: #ed0606; font-size: 24px;">{{auction.start_price}}</span>
            <span style="margin-left: 0.2rem;"><span style="color: #999; font-size: 12px;">原价 {{$i18n.t("money")}}{{auction.market_price}}</span>
            </span>
          </div>
          <div>
            <i class="iconfont icon-life-code" @click="postShow()" style="font-size: 18px; color: #666;"></i>
            <i class="iconfont icon-bc_share_card" style="font-size: 18px; color: #666; margin-left: 1.25rem;"
               @click="shareWeixin()"></i>
          </div>
        </div>
        <div class="mid">{{auction.title}}</div>
        <div class="bottom"><span>浏览 {{auction.browse_times}}次</span><span>参拍{{auction.participants_num}}人</span></div>
      </div>
      <div class="item" @click="toRecord">
        <div class="left">拍卖纪录<span>({{record_length}})</span></div>
        <div style="font-size: 12px;">更多 <i class="fa fa-angle-right"></i></div>
      </div>
      <div class="record-list" v-if="record.length>0">
        <div class="list" v-for="(item,index) in record" :key="index">
          <div class="item-top">
            <div class="name">
              <div class="avator" v-if="item.has_one_member">
                <img :src="item.has_one_member.avatar">
              </div>
              <div class="nick">
                {{item.has_one_member.nickname}}
              </div>
            </div>
            <div style="color: #f22121; flex: 1;" v-if="item.status==1">当前最高</div>
            <div style="color: #999; flex: 1;" v-if="item.status==-1">出局</div>
            <div style="flex: 0 0 8rem;"><span>{{item.created_at}}</span></div>
          </div>
          <div class="item-bottom">
            <div style="color: #f22121; flex: 1; text-align: left;">{{$i18n.t("money")}}{{item.price}}</div>
            <div style="flex: 1; text-align: right;" v-if="item.status==1">{{item.number}}次出价</div>
            <div style="flex: 1; color: #999; text-align: right;" v-if="item.status==-1">{{item.number}}次出价</div>
          </div>
        </div>

      </div>
      <div class="price" v-if="auction.start_price">
        <div class="price-item">
          <span class="tit">起拍价</span>
          <span>{{$i18n.t("money")}}{{auction.start_price}}</span>
        </div>
        <div class="price-item">
          <span class="tit">加一口</span>
          <span>{{$i18n.t("money")}}{{auction.mini_markup}}</span>
        </div>
        <div class="price-item">
          <span class="tit">保证金</span>
          <span>{{$i18n.t("money")}}{{auction.prepayment}}</span>
        </div>
        <div class="price-item">
          <span class="tit">保留价</span>
          <span>{{$i18n.t("money")}}{{auction.mini_deal}}</span>
        </div>
        <!-- <div class="price-item">
          <span class="tit">出价奖励</span>
          <span>{{$i18n.t('money')}}120</span>
      </div>
      <div class="price-item">
        <span class="tit">代言费</span>
        <span>{{$i18n.t('money')}}{{auction.endorsement}}</span>
    </div> -->
        <div class="price-item">
          <span class="tit">开拍时间</span>
          <span>{{timestampToTime(auction.start_shooting)}}</span>
        </div>
        <div class="price-item">
          <span class="tit">结束时间</span>
          <span>{{timestampToTime(auction.end_shooting)}}</span>
        </div>
        <div class="price-item" v-if="auction.delay_plan && auction.delay_plan.enabled" style="width: 100%;">
          <span class="tit" v-if="auction.delay_plan" style="color: black;">周期延时时间：{{auction.delay_plan.delay_cycle_minute}}分钟/次</span>
        </div>
        <div class="price-item">
          <span class="tit">一口价</span>
          <span>{{$i18n.t("money")}}{{auction.fixed_price}}</span>
        </div>
      </div>
      <div class="shop">
        <div class="left">
          <div class="avator">
            <img :src="auctioneer.avarat">
          </div>
          <div class="txt">
            <div style="margin-bottom: 1rem;">{{auctioneer.nick_name}}</div>
            <div><span class="check"><i class="iconfont icon-pm_auction_certification" style="color: #ff6333;"></i>{{auctioneer.type_status}}</span><span
              style="margin-left: 0.5rem; color: #999;">拍品:{{auctioneer.lot_num || 0}}</span></div>
          </div>
        </div>
        <div class="right">
          <div class="btn-one" @click="toCollect" v-if="auctioneer.is_collection==0 && auctioneer.type == 1">收藏</div>
          <div class="btn-one" @click="toCollect" v-if="auctioneer.is_collection==1 && auctioneer.type == 1">已收藏</div>
          <div class="btn-two" @click="toShop" v-if="auctioneer.auctioneer_id">
            进店逛逛
          </div>
        </div>
      </div>
      <div class="good-detail">
        <h2 style="margin-bottom: 1rem;">拍品描述</h2>
        <p>{{auction.describe || '暂无描述'}}</p>
      </div>
      <div class="good-detail">
        <h2 style="margin-bottom: 1rem;">拍品详情</h2>
        <div v-if="auction.content" v-html="auction.content"></div>
        <div v-else>暂无详情</div>
      </div>
      <div class="foot" :class="[fun.getPhoneEnv() == 3 ? 'pc' : '']">
        <div class="my" @click="toMy">
          <i class="iconfont icon-home-line6"></i> <span>我的</span>
        </div>
        <div class="puzi" @click="todian" v-if="auctioneer.auctioneer_id">
          <i class="iconfont icon-info_store"></i>
          <span>店铺</span>
        </div>
        <div class="bid-btn" @click="bid" v-if="auction.start_shooting<=now&&now<auction.end_shooting && !isEnd">
          立即出价
        </div>
        <div class="bid-btn" style="background-color: #999 !important;"
             v-show="now<auction.start_shooting||now>auction.end_shooting || isEnd">
          立即出价
        </div>
        <div class="bid-btn" @click="toBuy" style="background-color: #ff7d4d; margin-left: 1rem;"
             v-if="auction.start_shooting<=now&&now<auction.end_shooting && !isEnd">
          一口价
        </div>
        <div class="bid-btn" v-show="now<auction.start_shooting||now>auction.end_shooting || isEnd"
             style="background-color: #999 !important; margin-left: 1rem;">
          一口价
        </div>
      </div>
    </div>
    <van-popup v-model="rewardPayshow"
               position="bottom"
               :overlay="true">
      <div class="rewardPay">
        <div class="payMode">
          <ul>
            <li @click="payBtn(item.value, item.name)"
                v-for="(item, index) in btnData"
                :key='index'>
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="cancel"
             @click="rewardPayCancelBtn">取消
        </div>
      </div>
    </van-popup>
    <van-popup v-model="show2" position="bottom" style="width: 100%; height: 40%;">
      <div class="bid-pop">
        <div class="now-price">
          当前价格:{{auction.now_price}}
        </div>
        <div class="price-input">
          <div class="jian" @click="down"><strong>-</strong></div>
          <input type="num" v-model="price" disabled="true" />
          <div class="jia" @click="up"><strong>+</strong></div>
        </div>
        <div class="want">你将出价{{price}}元</div>
        <div class="bid-btn" @click="bidTo">
          出价
        </div>
      </div>
    </van-popup>
    <van-popup v-model="show1" position="bottom" :close-on-masker="false" style="width: 100%; height: 40%;">
      <div class="pop">
        <div class="title">请输入店铺密码</div>
        <div class="check">
          <span>密码</span>
          <input type="password" v-model="password">
        </div>
        <div class="bottom-btn" @click="confirm(item)">
          确定
        </div>
      </div>
    </van-popup>
    <van-popup
      v-model="posterShow"
      closeOnClickModal="true"
      style="width: 17.8125rem; height: 34.5rem; padding: 0; background: none;"
    >
      <div style="width: 100%; height: 100%; overflow: hidden;" class="code_box">
        <div style="width: 100%; height: 31.25rem; border-radius: 0.375rem;">
          <img
            :src="'data:' + posterImg.mime + ';base64,' + posterImg.base64Image"
            v-if="posterImg.base64Image"
            style="width: 100%; border-radius: 0.375rem;"
          />
        </div>
        <!-- 关闭图标 -->
        <div class="icon_close" @click="posterShow = false">
          <i class="iconfont icon-close11"></i>
        </div>
        <!--  -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import auction_good_controller from "./auction_good_controller";

export default auction_good_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #auction_good {
    #hoid {
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      height: 2.25rem;
    }

    #cart {
      right: 0;
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
    }

    #member {
      right: 2rem;
      padding: 0.3125rem;
      width: 1.6rem;
      position: fixed;
      z-index: 2;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
    }

    #back {
      width: 1.6rem;
      height: 1.6rem;
      border-radius: 100%;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.4);
      text-indent: 0;
      line-height: 1.7rem;
      overflow: hidden;
    }

    .content {
      padding-bottom: 4.2rem;
      overflow: hidden;

      .banner_pcStyle {
        height: 375px !important;
      }

      .count-time {
        width: 100%;
        bottom: 0;
        height: 2.5625rem;
        display: flex;
        align-items: center;
        padding: 0 1rem;
        background: #b52149;
        // justify-content: space-between;
        margin-top: -2.5625rem;
        position: relative;

        .txt {
          color: #fff;
          margin-right: 0.5rem;
          padding-bottom: 0.2rem;
          font-weight: 600;
        }

        .time {
          display: flex;
          align-items: center;
          color: #fff;

          .block {
            width: 1.375rem;
            height: 1.4375rem;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            border-radius: 0.25rem;
          }
        }

        .time-item {
          padding: 0 0.125rem;
          color: #fff;
        }
      }

      .title {
        padding: 1rem;
        background-color: #fff;

        .top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mid {
          margin-top: 1rem;
          font-size: 16px;
          text-align: left;
        }

        .bottom {
          margin-top: 1.3125rem;
          display: flex;
          justify-content: space-between;
          color: #999;
          font-size: 12px;
        }
      }

      .item {
        margin-top: 0.5rem;
        display: flex;
        background-color: #fff;
        height: 2.625rem;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.9375rem;

        i {
          font-size: 18px;
        }

        span {
          color: #999;
        }
      }

      .record-list {
        background: #fff;
        padding: 0 0.9375rem 0.5rem 0.9375rem;

        .list {
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom: 1px solid #eee;

          .item-top,
          .item-bottom {
            width: 100%;
            display: flex;
            align-items: center;
            font-size: 12px;
          }

          .item-top {
            padding-bottom: 0.5rem;
          }

          .item-bottom {
            justify-content: space-between;
          }

          .name {
            flex: 0 0 8rem;
            align-items: center;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;

            .avator {
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 50%;
              margin-right: 0.25rem;
              display: flex;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .nick {
              font-size: 12px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: flex;
              flex: 1;
            }
          }
        }
      }

      .price {
        margin-top: 0.5rem;
        display: flex;
        background-color: #fff;
        padding: 1rem 0.75rem;
        flex-wrap: wrap;

        .price-item {
          margin-bottom: 1.6875rem;
          width: 50%;
          text-align: left;

          .tit {
            color: #999;
          }
        }
      }

      .shop {
        padding: 1rem 0.75rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;

          .avator {
            width: 3rem;
            height: 3rem;
            border-radius: 0.3125rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 0.3125rem;
            }
          }

          .txt {
            display: flex;
            margin-left: 1rem;
            flex-direction: column;
            font-size: 12px;
            align-items: baseline;
          }
        }

        .right {
          display: flex;

          .btn-one {
            width: 2.8125rem;
            height: 1.1875rem;
            border-radius: 0.625rem;
            border: solid 0.0625rem #ff2c29;
            align-items: center;
            justify-content: center;
            display: flex;
            color: #ff2c29;
            font-size: 12px;
            margin-right: 1rem;
          }

          .btn-two {
            width: 3.875rem;
            height: 1.1875rem;
            background-image:
              linear-gradient(
                270deg,
                #ff6333 0%,
                #ff2c29 100%
              ),
              linear-gradient(
                #000,
                #000
              );
            border-radius: 0.625rem;
            align-items: center;
            justify-content: center;
            display: flex;
            color: #fff;
            font-size: 12px;
          }
        }
      }

      .good-detail {
        padding: 1rem 0.75rem;
        margin-top: 1.3125rem;
        text-align: left;
        background-color: #fff;
      }

      .foot {
        height: 3.0625rem;
        width: 100%;
        position: fixed;
        bottom: 0;
        background: #fff;
        padding: 0 0.75rem;
        display: flex;
        align-items: center;

        .my {
          display: flex;
          flex-direction: column;
          color: #666;
          font-size: 12px;
          flex: 1;

          i {
            font-size: 24px;
          }
        }

        .puzi {
          display: flex;
          flex-direction: column;
          color: #666;
          font-size: 12px;
          margin-left: 2.5rem;
          margin-right: 1.875rem;

          i {
            font-size: 24px;
          }
        }

        .bid-btn {
          width: 7.125rem;
          height: 2.125rem;
          background-color: #ff2c29;
          border-radius: 1.0625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 12px;
        }
      }
    }

    .pop {
      padding: 0 0.75rem;

      .check {
        display: flex;
        padding-bottom: 1rem;

        input {
          flex: 1;
          border: none;
          outline: none;
          margin-left: 1rem;
          border-bottom: solid 1px #ccc;
        }
      }

      .title {
        font-size: 18px;
        padding: 1.5rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .bottom-btn {
        height: 2.8125rem;
        background-image:
          linear-gradient(
            #ff2c29,
            #ff2c29
          ),
          linear-gradient(
            #ff590f,
            #ff590f
          );
        background-blend-mode:
          normal,
          normal;
        border-radius: 1.4375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #fff;
        margin-top: 6.25rem;
      }
    }

    .bid-pop {
      padding-bottom: 2rem;
      padding-left: 0.75rem;
      padding-top: 1rem;
      padding-right: 0.75rem;

      .now-price {
        text-align: left;
      }

      .price-input {
        margin-top: 2rem;
        margin-bottom: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;

        .jia {
          font-size: 32px;
        }

        .jian {
          font-size: 32px;
        }

        input {
          border: none;
          outline: none;
          padding: 0.2rem;
          border-bottom: solid 1px #ccc;
          width: 10rem;
          margin: 0 1rem;
          text-align: center;
        }
      }

      .want {
        color: #999;
        text-align: center;
        margin-top: 1rem;
      }

      .bid-btn {
        width: 100%;
        height: 2.8125rem;
        background-color: #ff2c29;
        border-radius: 1.4375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
        margin-top: 1.5rem;
      }
    }

    .rewardPay {
      background-color: #f2f2f2;

      .content {
        background-color: #fff;

        span {
          color: #1c96fe;
        }

        text-align: left;
        padding: 0.6rem;
        min-height: 3.44rem;
        font-size: 0.8rem;
        line-height: 1rem;
        width: 100%;
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
      }

      .payMode {
        ul {
          li {
            background-color: #fff;
            height: 3.44rem;
            border-bottom: 0.06rem solid #eee;
            font-size: 1rem;
            color: #333;
            line-height: 3.44rem;
          }

          li:last-of-type {
            border-bottom: none;
            margin-bottom: 0.69rem;
          }
        }
      }

      .cancel {
        background-color: #fff;
        height: 3.44rem;
        border-bottom: 0.06rem solid #eee;
        font-size: 1rem;
        color: #333;
        line-height: 3.44rem;
      }
    }
  }

  .pcStyle {
    #hoid,
    .Go_settle {
      width: 375px !important;
    }

    #cart {
      right: 50% !important;
      margin-right: -186px;
    }

    #member {
      right: 50% !important;
      margin-right: -150px;
    }

    #foot {
      width: 375px !important;
    }
  }

  .pc {
    width: 375px !important;
  }
</style>
