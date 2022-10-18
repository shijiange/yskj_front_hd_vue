<template>
  <div id="personRed">
    <c-title :hide="false" text="红包雨" />
    <div class="centenBox">
      <div class="posRedlist" @click="goIssue('personRedList')">个人记录</div>
      <div class="topTxt">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/txt.png" alt="" />
      </div>
      <div class="bj">
        <div class="btnimg1" v-if="info.show_button" @click="goIssue('personRedissue')">发红包</div>
        <img class="bjimg" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/send.png" alt="" />
      </div>
      <div class="lis">
        <div class="list" v-for="(item, index) in list" :key="index">
          <div class="listTop">
            <div class="leftImg">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="rightConten">
              <div class="redName">{{ item.title }}</div>
              <div class="middle">
                <div class="middleImg" v-if="item.member">
                  <img :src="item.member.avatar_image" alt="" />
                </div>
                <span v-if="item.member">发放人：{{ item.member.nickname }}</span>
              </div>
              <div class="redTime">红包截止时间：{{ item.created_at }}——{{ item.valid_time_date }}</div>
            </div>
          </div>
          <div class="vrbox">
            <template v-for="(datas, ind) in item.buttons">
              <div class="listbottom" :key="ind" v-if="datas.status == 1" @click="getRedpack(item, ind)">{{ datas.name }}</div>
              <div v-if="datas.status == 0" :key="ind">
                <div :class="[datas.api == '' ? 'lrbox' : 'rrbox']" v-if="datas.status == 0" :key="ind" @click="toList(datas)">{{ datas.name }}</div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="isLoadMore && list.length > 0" style="color: #fff; font-size: 0.75rem;" @click="getMoreData">显示更多<van-icon name="arrow-down" /></div>
        <div v-if="!isLoadMore && list.length > 0" style="color: #fff; font-size: 0.75rem;">没有更多了</div>
        <van-empty image="default" v-if="list.length <= 0" />
      </div>
    </div>
    <van-popup v-model="show" :style="{ background: '' }">
      <div class="popGetReed">
        <div class="popGetReed_txt">
          <div class="popGetReed_text" v-if="getinfo.member">
            <span style="margin-right: 1rem;">{{ getinfo.member.nickname }}</span
            ><span>发出的红包</span>
          </div>
          <div class="popGetReed_img">
            <img :src="getinfo.thumb" alt="" />
          </div>
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/btn1.png" class="btnImg" @click="postRedpack(getinfo.id)" alt="" />
        </div>
      </div>

      <div class="closeBtn">
        <i class="iconfont icon-adsystem_icon_cancle" @click="show = false"></i>
      </div>
    </van-popup>
    <van-popup v-model="show1" :style="{ background: '' }">
      <div class="popGetReed_two">
        <div class="popGetReed_two_txt">
          您已成功领取<span>{{ getName }}</span
          >的红包 可到{{ balance }}里查看
        </div>
        <div class="popGetReed_two_price">￥{{ amount }}</div>
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/btn2.png" @click="sureGet" class="popGetReed_two_btn" alt="" />
      </div>
    </van-popup>
  </div>
</template>
<script>
import personRed_controller from "./personRed_controller";

export default personRed_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.posRedlist {
  position: fixed;
  right: 50%;
  top: 2.8rem;
  width: 4.38rem;
  height: 1.56rem;
  background-color: #fff;
  border-radius: 0.78rem 0 0 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #f20b06;
  transform: translateX(11.7rem);
  z-index: 9899;
}

#personRed {
  background: #fe2400;
  min-height: 100vh;
}
// 红包弹窗
/deep/ .van-popup {
  background: transparent;
}

.popGetReed_two {
  width: 19.19rem;
  height: 17.22rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/succeed.png");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;

  .popGetReed_two_btn {
    width: 8.13rem;
    margin-top: 1.09rem;
  }

  .popGetReed_two_price {
    font-size: 1.88rem;
    color: #fff;
    font-weight: 600;
    width: 14.59rem;
    margin: 0 auto;
    margin-top: 5.06rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .popGetReed_two_txt {
    width: 8.97rem;
    text-align: center;
    margin: 0 auto;
    margin-top: 3.25rem;
    color: #262626;
    font-size: 0.75rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;

    span {
      color: #f41100;
      font-size: 0.75rem;
    }
  }
}

.popGetReed {
  width: 22.5rem;
  height: 20.94rem;
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/gethb.png");
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;

  .popGetReed_txt {
    margin-top: 8.22rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .popGetReed_text {
      font-size: 0.94rem;
      color: #fff;
    }

    .popGetReed_img {
      width: 5.34rem;
      height: 5.34rem;
      margin-top: 1.03rem;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .btnImg {
    width: 10.38rem;
    margin-top: 0.97rem;
  }
}

.closeBtn {
  color: #fff;
  font-size: 1rem;
  // width: 1.94rem;
  // height: 1.94rem;
  i {
    font-size: 2rem;
  }
}

// 红包弹窗 end
// 背景end
.centenBox {
  background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/personRed/bj.png");
  background-repeat: no-repeat;
  background-size: 100%;
  overflow: hidden;
  width: 100%;
  margin-top: -5rem;

  .lis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-top: -1rem;
    position: relative;
    padding-bottom: 2rem;

    .list {
      width: 21.88rem;
      height: 8.47rem;
      background-color: #fff;
      border-radius: 0.94rem;
      padding: 0.81rem 1.13rem 0.63rem 0.53rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-direction: column;
      margin-bottom: 0.63rem;
      overflow: hidden;
      box-sizing: border-box;

      .vrbox {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;

        .lrbox {
          width: 8.13rem;
          height: 2.19rem;
          border-radius: 1.09rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #eaeaea;
          color: #9b9b9b;
          font-size: 0.88rem;
        }

        .rrbox {
          width: 8.13rem;
          height: 2.19rem;
          border-radius: 1.09rem;
          border: solid 0.03rem #f69a00;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f69a00;
          font-size: 0.88rem;
        }
      }

      .listbottom {
        width: 11.25rem !important;
        height: 2.19rem;
        background-image: -webkit-linear-gradient(20deg, #f4c679 0%, #fae3ae 100%);
        background-image: linear-gradient(70deg, #f4c679 0%, #fae3ae 100%);
        border-radius: 1.09rem;
        font-size: 0.88rem;
        color: #873d43;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        font-weight: 600;
        letter-spacing: 0.09rem;
      }

      .listTop {
        display: flex;
        width: 100%;

        .leftImg {
          width: 3.75rem;
          height: 3.75rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .rightConten {
          flex: 1;
          overflow: hidden;
          margin-left: 0.56rem;

          .redName {
            text-align: left;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 0.2rem;
          }

          .middle {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 0.2rem;
            color: #ce2e06;
            font-size: 0.81rem;

            .middleImg {
              width: 1.13rem;
              height: 1.13rem;
              background-color: #999;
              border-radius: 50%;
              margin-right: 0.22rem;

              img {
                width: 100%;
              }
            }
          }

          .redTime {
            font-size: 0.63rem;
            text-align: left;
            color: #ce2e06;
          }
        }
      }
    }
  }

  .bj {
    width: 13.72rem;
    height: 10.97rem;
    margin: 0 auto;
    margin-top: 2.83rem;
    position: relative;

    .btnimg1 {
      position: absolute;
      left: 1.75rem;
      bottom: 1.84rem;
      font-size: 1.56rem;
      color: #f20a06;
      width: 10.84rem;
      height: 2.81rem;
      margin: 0 auto;
      margin-top: -4rem;
      background-image: -webkit-gradient(linear, left top, left bottom, from(#f9e698), to(#e7b81f)), -webkit-gradient(linear, left top, left bottom, from(#ffd90d), to(#ffd90d));
      background-image: -webkit-linear-gradient(top, #f9e698 0%, #e7b81f 100%), -webkit-linear-gradient(#ffd90d, #ffd90d);
      background-image: linear-gradient(180deg, #f9e698 0%, #e7b81f 100%), linear-gradient(#ffd90d, #ffd90d);
      background-blend-mode: normal, normal;
      border-radius: 1.41rem;
      line-height: 2.81rem;
      font-weight: 600;
    }

    .bjimg {
      width: 100%;
      height: 100%;
    }
  }

  .topTxt {
    width: 18.88rem;
    height: 3.59rem;
    margin-top: 7.16rem;
    margin-left: 2.5rem;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
