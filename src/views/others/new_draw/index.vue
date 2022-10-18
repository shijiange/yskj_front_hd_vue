<!-- 新抽奖活动 -->
<template>
  <div id="new_draw" :style="{ backgroundImage: 'url(' + 'https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/newdraw_bg.png' + ')' }">
    <c-title :hide="false" text="抽奖活动"></c-title>
    <div class="top-main">
      <div class="award-life  flex-column-stlye" @click.stop="gotoUrl('winnersList', { num: info.current_round, id: $route.params.id })">
        <i class="icon-fontclass-dashang iconfont"></i>
        <div class="text-color-box">中奖名单</div>
      </div>
      <div class="text-img">
        <img class="text-img-src" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/images/text-img.png" alt="" />
      </div>
      <div class="share-sheet ">
        <div class="sheet-chilid flex-column-stlye" @click.stop="showShare = true">
          <i class="icon-share iconfont"></i>
          分享
        </div>
        <div class="sheet-chilid flex-column-stlye" v-if="info.is_complaint" @click.stop="gotoUrl('lotteryComplaint', { id: $route.params.id })">
          <i class="icon-fontclass-tousu iconfont"></i>
          投诉
        </div>
      </div>
    </div>
    <!-- main -->
    <div class="main">
      <div class="active-time" v-show="info.start_time">活动时间：{{ fun.timestampToTime(info.start_time) }} - {{ fun.timestampToTime(info.end_time) }}</div>
      <div class="active-introduce">
        <div class="active-big-title">{{ info.activity_name }}</div>
        <div class="ul">
          <div class="li">共{{ info.turn_num }}轮</div>
          <div class="li">每轮{{ info.limit_num }}次机会</div>
          <div class="li">参加次数达到{{ info.max_num }}次自动开奖</div>
          <div class="li" v-show="info.is_share">邀请1位好友参与可获得1次参与机会，限获得{{ info.share_num }}次</div>
        </div>
        <div class="active-rounds">
          当前第<em>{{ info.current_round }}</em
          >轮，<em>{{ info.activity_num }}</em> 人可参与
        </div>
        <div class="active-num">
          剩余次数：<em>{{ info.member_num }}次</em>
        </div>
        <div class="lottery-btn" :class="[!addBtn_status ? 'dont' : '']" @click.stop="addActivity">{{ btn_text }}</div>
        <div class="add-member">
          <img v-for="(item, i) in info.participants" :key="i" class="member-info" :src="item" />
        </div>
        <div class="schedule">
          <div class="progress-text">进度</div>
          <div class="progress"><van-progress color="#ffb700" stroke-width="8px" :percentage="parseInt(Number((info.max_num - info.activity_num) / info.max_num) * 100)" /></div>
        </div>
      </div>
      <!--  -->
      <div class="template-box">
        <div class="template-box-title">奖品</div>
        <div class="template-box-main">
          <div class="reward-good flex-column-stlye" @click.stop="showGoodPup(info.goods_id)">
            <img :src="info.goods_thumb" alt="" class="good-img" />
            <div class="good-title">{{ info.goods_title }}</div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="template-box">
        <div class="template-box-title">抽奖规则</div>
        <div class="template-box-main">{{ info.rule }}</div>
      </div>
      <!--  -->
      <div class="template-box">
        <div class="template-box-title">活动介绍</div>
        <div class="template-box-main">
          <div v-html="info.explain" class="msg-text"></div>
        </div>
      </div>
    </div>
    <!-- 右侧悬浮按钮 -->
    <div class="fiexd-btn-right">
      <div class="btn-child" @click.stop="getComment">
        <i class="iconfont icon-fontclass-pinglun1"></i>
        {{ info.comment_num }}
      </div>
      <div class="btn-child" @click.stop="getCollection" :style="{ color: info.is_collection == 1 ? '#f14e4e' : '#939393' }">
        <i class="iconfont icon-fontclass-pingfen"></i>
        {{ info.collection_num }}
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="nav-bottom set-pc-styleLeft" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
      <div class="nav-b-chlid" @click.stop="gotoUrl('luckyDraw', { tag: 'activity' })">
        <i class="iconfont icon-fontclass-dashang"></i>
        更多抽奖
      </div>
      <div class="nav-b-chlid" @click.stop="gotoUrl('mydraw', {})">
        <i class="iconfont icon-fontclass-wode"></i>
        我的抽奖
      </div>
    </div>
    <!-- 评论弹窗 -->
    <van-popup v-model="showcomment" position="bottom" :style="{ height: '80%' }" closeable round>
      <div class="comment-box flex-column-stlye">
        <div class="comment-titel">{{ commentlist.length }}条评论</div>
        <div class="comment-list">
          <div class="comment-child" v-for="item in commentlist" :key="item.id">
            <img :src="item.avatar" alt="" class="member-img" />
            <div class="comment-child-right flex-column-stlye">
              <div class="member-name">{{ item.nickname }}</div>
              <div class="comment-text">{{ item.content }}</div>
              <div class="comment-time">{{ item.created_at | timeSlice }}</div>
            </div>
          </div>
          <div v-if="total_page != 0 && isLoadMore && page < total_page" @click="getMoreData">点击加载更多...</div>
        </div>
        <div class="send-box">
          <input type="text" v-model="comment_input" id="send-input" placeholder="留下你精彩的评论吧~" />
          <div class="send-btn" @click.stop="sendComment" :style="{ color: comment_input ? '#f14e4e' : '#999' }">发送</div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showInfo" class="award-information" position="bottom" :style="{ height: '80%' }">
      <van-nav-bar title="参与抽奖" right-text="返回" @click-right="showInfo = false" />
      <div class="add-num">
        <div class="add-num-name flex-column-stlye">
          <div class="name1">参与次数</div>
          <div class="name2">您最多可参与{{ activityInfo.activity_num > activityInfo.surplus_num ? activityInfo.surplus_num : activityInfo.activity_num }}次</div>
        </div>
        <div class="add-num-tepper">
          <van-stepper
            v-model="addNum"
            theme="round"
            button-size="22"
            disable-input
            :max="activityInfo.activity_num > activityInfo.surplus_num ? activityInfo.surplus_num : activityInfo.activity_num"
          />
        </div>
      </div>
      <van-cell-group v-if="activityInfo.type == 2 && activityInfo.need_address == 1">
        <van-field v-model="tel" type="tel" label="手机号" placeholder="请输入手机号" />
      </van-cell-group>
      <div class="address-box" v-else @click.stop="getAddress">
        <div class="address-title">收货地址</div>
        <div class="addr" v-if="!fun.isTextEmpty(activityInfo.address)">
          <i class="fa fa-map-marker"></i>
          <div class="address-info">
            <div class="address-namenick">收货人:{{ activityInfo.address.username }} {{ activityInfo.address.mobile }}</div>
            <div class="address-shipping">
              {{ activityInfo.address.province }} {{ activityInfo.address.city }} {{ activityInfo.address.district }} {{ activityInfo.address.street || "" }} {{ activityInfo.address.address }}
            </div>
          </div>
          <i class="fa fa-angle-right"></i>
        </div>
        <div v-else class="addr">
          <i class="fa fa-map-marker"></i>
          <div class="address-info" style="padding: 0.875rem;">
            请选择收货地址
          </div>
          <i class="fa fa-angle-right"></i>
        </div>
      </div>
      <div class="confirm-address-btn" @click.stop="joinActivity">确定</div>
    </van-popup>
    <yz-address-list v-model="showAddress" v-on:confirm="confirmSelectAddress"></yz-address-list>

    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
    <!-- 海报弹窗 -->
    <van-popup v-model="showposter" position="center" style="background-color: transparent;">
      <img :src="poster_url" alt="" style="width: 16rem;" />
    </van-popup>
    <!-- 商品详情页弹窗 -->
    <yzGoodsPopup v-model="showgp" :addCartBtn="false" :goodsInfo="goodinfo"></yzGoodsPopup>
    <!-- 商品规格弹窗 -->
  </div>
</template>

<script>
import index_controller from "./index_controller";
export default index_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#new_draw {
  padding: 0 15px 80px;
  background-color: #ff7405;
  background-position: top left;
  background-repeat: no-repeat;
  background-size: contain;

  .fixed-btn-top {
    position: fixed;
    top: 4.375rem;
    z-index: 999;
  }

  .award-life {
    left: 20px;

    i {
      font-size: 24px;
      color: #feca03;
    }

    .text-color-box {
      background-color: #ff9000;
      border-radius: 0.531rem;
      color: #fff;
      font-size: 12px;
      padding: 0 8px;
    }
  }

  .share-sheet {
    right: 20px;
    color: #fff;

    i {
      font-size: 18px;
    }

    .sheet-chilid {
      margin-bottom: 0.875rem;
    }
  }

  .flex-column-stlye {
    display: flex;
    flex-direction: column;
  }

  .top-main {
    display: flex;
    justify-content: space-between;
    padding: 1.875rem 0 12.875rem;

    .text-img {
      .text-img-src {
        height: 3.25rem;
        object-fit: contain;
      }
    }
  }

  .main {
    .active-time {
      color: #fff;
      font-size: 12px;
      margin-bottom: 0.75rem;
    }

    .active-introduce {
      color: #fff;
      width: 100%;
      height: auto;
      padding: 1.375rem 1rem;
      border-radius: 12px;
      border: 3px solid #f2cb76;
      overflow: hidden;
      background: #ec4231;

      .active-big-title {
        font-weight: 700;
        font-size: 18px;
      }

      .ul {
        display: flex;
        flex-wrap: wrap;
        padding: 0.75rem 0;

        .li {
          list-style: disc;
          margin-right: 0.875rem;
          position: relative;
          text-align: left;
          font-size: 12px;
          line-height: 1.25rem;
        }

        .li::after {
          content: "●";
          width: 0;
          height: 0;
          position: absolute;
          top: 0%;
          left: -0.75rem;
        }
      }

      .active-rounds {
        text-align: left;
        font-size: 12px;
        color: #ffed76;

        em {
          color: #fff;
        }
      }

      .active-num {
        font-weight: bold;
        color: #ffed76;
        padding: 0.875rem 0 0.375rem;

        em {
          color: #fff;
          font-weight: bold;
        }
      }

      .lottery-btn {
        width: 10.938rem;
        height: 2.188rem;
        line-height: 2.188rem;
        margin: 0 auto;
        background-color: #ffb700;
        box-shadow: 0 0.063rem 0.25rem 0 rgba(192, 52, 38, 0.48);
        border-radius: 1rem;
        font-size: 15px;
        font-weight: 700;
      }

      .dont {
        background-color: #a8a8a8;
      }

      .add-member {
        display: flex;
        flex-wrap: wrap;
        margin-top: 1.25rem;

        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 0.375rem 0.375rem 0;
          object-fit: contain;
        }

        img:nth-child(8n) {
          margin-right: 0;
        }
      }

      .schedule {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-top: 1.875rem;

        .progress {
          flex: 1;
          padding: 0 0.5rem;

          /deep/.van-progress__pivot {
            top: -250%;
            border-radius: 0.25rem;
          }
        }
      }
    }

    .template-box {
      position: relative;
      padding-top: 2rem;

      .template-box-title {
        width: 14.125rem;
        height: 3.625rem;
        line-height: 2.875rem;
        font-size: 20px;
        color: #5a250d;
        background-image: url(https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/images/nav-img.png);
        background-size: 100% 100%;
        background-position: center;
        margin: 0 auto;
        font-weight: 700;
        position: absolute;
        top: 10px;
        left: 50%;
        margin-left: -7.0625rem;
      }

      .template-box-main {
        text-align: left;
        background-image: linear-gradient(0deg, #faded4 0%, #fbddd0 100%);
        border-radius: 12px;
        padding: 2.5rem 0.75rem 1rem;

        .reward-good {
          justify-content: center;
          align-items: center;

          .good-img {
            width: 8.75rem;
            height: 8.75rem;
            border-radius: 0.375rem;
            object-fit: contain;
            overflow: hidden;
            background: #fff;
          }

          .good-title {
            text-align: center;
            width: 12rem;
            font-size: 12px;
            line-height: 1rem;
            margin-top: 0.75rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
    }
  }

  .msg-text {
    width: 100%;
    overflow: hidden;

    /deep/img {
      width: 100%;
      display: block;
    }
  }

  .fiexd-btn-right {
    position: fixed;
    bottom: 6.375rem;
    right: 50%;
    transform: translateX(10rem);

    .btn-child {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0.047rem 0.081rem 0.156rem 0 rgba(209, 209, 209, 0.36);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      line-height: 14px;
      margin-bottom: 0.875rem;
      color: #939393;
    }
  }

  .nav-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-around;
    background-color: #fff;

    .nav-b-chlid {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-weight: 700;
      font-size: 12px;
      color: #9e9e9e;

      i {
        font-size: 18px;
      }
    }
  }

  .iphoneXStyle {
    box-sizing: content-box;
    padding-bottom: 24px;
  }

  .comment-box {
    height: 100%;
    position: relative;

    .comment-titel {
      height: 4rem;
      line-height: 4rem;
      color: #666;
    }

    .comment-list {
      flex: 1;
      padding-bottom: 6rem;
      overflow: scroll;

      .comment-child {
        display: flex;
        padding: 0 0.938rem 1rem;

        .member-img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          overflow: hidden;
          margin: 0;
          margin-right: 0.625rem;
          flex-shrink: 0;
          object-fit: contain;
        }

        .comment-child-right {
          text-align: left;

          .member-name {
            font-size: 16px;
            color: #2e2e2e;
            font-weight: 700;
            margin-bottom: 0.875rem;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .comment-text {
            font-size: 15px;
            color: #2e2e2e;
            line-height: 1.25rem;
            margin-bottom: 0.625rem;
          }

          .comment-time {
            color: #767676;
            font-size: 12px;
          }
        }
      }
    }

    .send-box {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 2.75rem;
      background-color: #fff;
      box-shadow: -0.00625rem -0.125rem 0.125rem 0 rgba(232, 232, 232, 0.41);
      display: flex;
      align-items: center;
      justify-content: space-around;

      #send-input {
        border: none;
        width: 19.125rem;
        height: 1.875rem;
        padding: 0 0.875rem;
        background-color: #f5f5f5;
        border-radius: 0.938rem;
      }

      .send-btn {
        color: #f14e4e;
        padding: 0 0.5rem;
      }
    }
  }

  .award-information {
    background-color: #f2f2f2;

    .add-num {
      padding: 0 0.875rem;
      margin-bottom: 0.875rem;
      height: 4.875rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .add-num-name {
        text-align: left;

        .name1 {
          font-size: 16px;
          margin-bottom: 0.375rem;
        }

        .name2 {
          font-size: 12px;
          color: #f14e4e;
        }
      }
    }

    .address-box {
      padding: 0 0.875rem;
      background: #fff;
      text-align: left;

      .address-title {
        height: 3rem;
        line-height: 3rem;
        font-size: 16px;
      }

      .addr {
        display: flex;
        align-items: center;

        i {
          font-size: 18px;
        }

        .address-info {
          padding: 0 0.875rem 0.875rem;
          flex: 1;

          .address-namenick {
            font-weight: 700;
            margin-bottom: 0.25rem;
          }
        }
      }
    }
  }

  .confirm-address-btn {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 21.625rem;
    height: 2.75rem;
    background-color: #f14e4e;
    border-radius: 1.375rem;
    font-weight: 700;
    font-size: 16px;
    color: #fff;
    line-height: 2.75rem;
  }

  .address-list {
    max-height: 18rem;
    overflow: scroll;
    padding: 0 0.875rem 0;
    position: relative;

    .address-list-child {
      display: flex;
      align-items: center;
      padding: 0.875rem 0 0;

      .address-list-child-left {
        flex: 1;
        text-align: left;
        padding-right: 0.5rem;

        .address-namenick {
          display: flex;
          flex-direction: column;
          font-weight: 700;
        }
      }

      .address-list-child-right {
        width: 3.75rem;
        height: 1.75rem;
        line-height: 1.75rem;
        background-color: #f14e4e;
        border-radius: 0.375rem;
        color: #fff;
      }
    }
  }
}
</style>
