<template>
  <div id="liveAuthorization_collection">
    <c-title :hide="false" text="直播授权码"></c-title>
    <div class="list" v-for="(item, ind) in info" :key="ind">
      <div class="lis">
        <div class="left">
          <div class="name">
            <div class="status" v-if="item.is_sold == 1">未售出</div>
            <div class="statusT" v-else>售出</div>
            {{ item.level_name }}
          </div>
          <div style="font-size: 0.75rem; color: #666;">{{ fun.timestampToTime(item.created_at) }}</div>
        </div>
        <div class="right">
          <div class="righrTop">￥{{ item.price }}</div>
          <div class="rightBottom">
            <span @click="tapCatch(item,ind)">{{ item.is_sold == "2" ? "查看" : "分享" }}</span>
            <i class="iconfont icon-advertise-next" style="margin-right: -0.3rem;"></i>
          </div>
        </div>
      </div>
      <div class="tapSelectShow" v-if="item.show">
        <div class="selectLeft">
          <div>购买会员：</div>
          <div class="user">
            <div class="img">
              <img :src="item.buy_avatar" alt="" />
            </div>
            <div class="userName">{{item.buy_name}}</div>
          </div>
        </div>
        <div class="selectRight">{{item.buy_time}}</div>
      </div>
    </div>

    <!-- 海报样式 -->
    <div class="c_imag">
      <div id="img_box" v-show="loadingImg" :style="{ backgroundImage: 'url(' + backgroundImg }">
        <div class="codeBox">
          <img :src="qr_code" alt="" />
        </div>
      </div>
    </div>
    <van-popup v-model="posterShow" round class="newcomerAward_popup" :style="{ height: '25.44rem', backgroundColor: 'transparent' }">
      <img style="width: 18.13rem; height: 25.44rem;" id="thecanvas" v-show="!loadingImg" />
    </van-popup>
    <!-- 弹窗 -->
    <van-popup v-model="popShow" position="bottom" :style="{ height: '10.76rem' }" round>
      <div class="btnTop">
        <div class="boxBtn" @click="inviteFirend">
          <i class="iconfont icon-all_wechat" style="color: #46bb36;"></i>
          <span style="font-size: 0.81rem; color: #333;">微信好友</span>
        </div>
        <div class="boxBtn" @click="getPoster">
          <i class="iconfont icon-jk_haibao" style="color: #ea6f1c;"></i>
          <span style="font-size: 0.81rem; color: #333;">海报</span>
        </div>
      </div>
      <div style="width: 100%; height: 0.28rem; background: #797979;"></div>
      <div class="cancel" @click="popShowClose">取消</div>
    </van-popup>
    <yz-wechat-share-img v-model="showWechatshar"></yz-wechat-share-img>
  </div>
</template>
<script>
import liveAuthorization_collection_controller from "./liveAuthorization_collection_controller";
export default liveAuthorization_collection_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#liveAuthorization_collection {
  .list {
    width: 100%;
    background: #fff;
    padding: 0.81rem 0.91rem;
    margin-bottom: 0.63rem;
    padding-bottom: 0;

    .lis {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.63rem;
    }

    .tapSelectShow {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.63rem 0;
      border-top: 1px solid #f2f2f2;

      .selectLeft {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .user {
          display: flex;
          align-content: center;
          margin-top: 0.5rem;

          .img {
            width: 1.13rem;
            height: 1.13rem;
            border-radius: 50%;
            margin-right: 0.25rem;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .userName {
            color: #666;
            font-size: 0.75rem;
          }
        }
      }

      .selectRight {
        font-size: 0.69rem;
        color: #666;
      }
    }

    .left {
      height: 100%;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .name {
        margin-bottom: 0.51rem;
        font-size: 1rem;
        display: flex;
        align-items: center;

        .status {
          background-color: #f14e4e;
          border-radius: 0.13rem;
          font-size: 0.69rem;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.22rem 0.31rem;
          margin-right: 0.41rem;
        }

        .statusT {
          background-color: #aeaeae;
          border-radius: 0.13rem;
          font-size: 0.69rem;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.22rem 0.31rem;
          margin-right: 0.41rem;
        }
      }
    }

    .right {
      font-size: 0.81rem;
      color: #f14e4e;

      .righrTop {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #333;
      }

      .rightBottom {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
// 弹窗
.btnTop {
  width: 100%;
  height: 7.63rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;

  .boxBtn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    i {
      font-size: 3rem;
    }
  }
}

.cancel {
  height: 2.84rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}
// end
// 海报
.newcomerAward_popup {
  background-color: transparent;
}

.c_imag {
  position: absolute;
  left: -100rem;
  top: 0;
  z-index: 999;
}

#img_box {
  width: 18.13rem;
  height: 25.44rem;
  // box-shadow: -0.01rem 0.16rem 0.61rem 0.02rem rgba(81, 81, 81, 0.45);
  border-radius: 0.65rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;

  .nameBox {
    position: absolute;
    bottom: 1.69rem;
    left: 1.34rem;
    width: 2.81rem;
    height: 2.81rem;
    background-color: #fff;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .codeBox {
    width: 5.5rem;
    height: 5.5rem;
    position: absolute;
    bottom: 1.63rem;
    right: 1.34rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .userName {
    position: absolute;
    bottom: 3.22rem;
    left: 4.84rem;
    color: #fff;
    font-size: 0.91rem;
  }

  .recommend {
    position: absolute;
    left: 4.91rem;
    bottom: 2.03rem;
    color: #fff;
    font-size: 0.72rem;
  }
}
</style>
