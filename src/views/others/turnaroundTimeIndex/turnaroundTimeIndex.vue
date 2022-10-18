<template>
  <!-- 排队信息 -->
  <div id="turnaroundTimeIndex">
    <div class="logo">
      <img :src="info.logo" alt="" />
    </div>
    <div class="head">
      <span>排队信息({{ nowTime | timestampYear }})</span>
    </div>
    <div class="listBox">
      <div class="listLfet">
        <div class="leftTop">
          <div class="rightTopLeft">#{{ list.serial }}</div>
          <div class="rightTopRight">
            <span class="sta">等待中</span>
            <span>预计发车：{{ list.estimated_at | timestampToTime }}</span>
          </div>
        </div>
        <div class="leftBottom">
          <div class="ddasbox">
            <vue-seamless-scroll :data="list.member" class="seamless-warp" :class-option="optionSetting">
              <div class="leftBottom_lis" v-for="(datas, index) in list.member" :key="index">
                <div class="ind">{{ index + 1 }}</div>
                <div class="userInfo">
                  <img :src="datas.avatar" alt="" />
                  <div class="userName">{{ datas.nickname }}</div>
                </div>
                <div class="cart">{{ datas.kart_type_name }}</div>
                <div class="cartNum">{{ datas.kart_serial }}</div>
              </div>
            </vue-seamless-scroll>
          </div>
        </div>
      </div>
      <div class="listRight">
        <div class="rightTop">
          <div class="rightTopLeft">#{{ lis.serial }}</div>
          <div class="rightTopRight">
            <span class="sta">等待中</span>
            <span>预计发车：{{ lis.estimated_at | timestampToTime }}</span>
          </div>
        </div>
        <div class="rightBottom">
          <vue-seamless-scroll :data="lis.member" class="seamless-warp" :class-option="optionSettingTwo">
            <div class="list">
              <div class="listLeft" v-for="(datas, index) in lis.member" :key="index">
                <div class="ind">{{ index + 1 }}</div>
                <div class="userInfo">
                  <img :src="datas.avatar" alt="" />
                  <div class="userName">{{ datas.nickname }}</div>
                </div>
                <div class="cart">{{ datas.kart_type_name }}</div>
                <div class="cartNum">{{ datas.kart_serial }}</div>
              </div>
            </div>
          </vue-seamless-scroll>
        </div>
      </div>
    </div>
    <div class="announcements">
      <div class="announcementsTitle">注意事项</div>
      <div class="txt">
        {{ info.matters_need_attention ? info.matters_need_attention : "" }}
      </div>
    </div>
  </div>
</template>
<script>
import turnaroundTimeIndex_controller from "./turnaroundTimeIndex_controller";

export default turnaroundTimeIndex_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

#turnaroundTimeIndex {
  width: 100%;
  min-height: 100vh;
  background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeIndexBJ.png");
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  padding-bottom: 35px;
  box-sizing: border-box;

  .announcements {
    width: 1793px;
    border-radius: 6px;
    border: solid 1px #007dff;
    margin: 0 66px;
    margin-top: 22px;

    .announcementsTitle {
      margin: 0 auto;
      font-size: 24px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 30px;
      letter-spacing: 0;
      color: #fff;
      padding: 17px 0;
    }

    .txt {
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 30px;
      letter-spacing: 0;
      color: #fff;
      text-align: left;
      padding: 0 22px;
      padding-bottom: 64px;
    }
  }

  .listBox {
    margin: 0 65px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .listRight {
      .rightTop {
        width: 1179px;
        height: 66px;
        background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankLong.png");
        background-size: cover;
        background-repeat: no-repeat;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 32px;
        box-sizing: border-box;

        .rightTopLeft {
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 9px;
          letter-spacing: 0;
          color: #28f7ff;
        }

        .rightTopRight {
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 9px;
          letter-spacing: 0;
          color: #28f7ff;

          .sta {
            margin-right: 15px;
          }
        }
      }

      .rightBottom {
        width: 1182px;
        height: 618px;
        background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankRight.png");
        background-size: cover;
        background-repeat: no-repeat;
        padding: 51px 70px;
        box-sizing: border-box;

        .seamless-warp {
          height: 100%;
          overflow: hidden;
        }

        .list {
          display: flex;
          flex-wrap: wrap;
          // overflow-y: scroll;
          // scrollbar-width: none; /* firefox */
          // -ms-overflow-style: none; /* IE 10+ */
          // height: 100%;
          .listLeft:nth-child(2n) {
            margin-left: 100px;
          }

          .listLeft {
            width: 453px;
            height: 26px;
            display: flex;
            font-size: 18px;
            font-weight: normal;
            font-stretch: normal;
            line-height: 30px;
            letter-spacing: 0;
            color: #fff;
            margin-bottom: 27px;

            .ind {
              flex: 0.2;
            }

            .userInfo {
              flex: 1.2;
              display: flex;
              align-items: center;
              padding-left: 70px;
              box-sizing: border-box;
              overflow: hidden;

              img {
                width: 26px;
                height: 26px;
                background-color: #ffad37;
                margin: 0;
                margin-right: 8px;
                border-radius: 50%;
              }

              .userName {
                font-size: 18px;
                font-weight: normal;
                font-stretch: normal;
                line-height: 30px;
                letter-spacing: 0;
                color: #fff;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            .cart {
              flex: 1;
            }

            .cartNum {
              flex: 1;
            }
          }
        }
      }
    }

    .listLfet {
      margin-right: 58px;

      .leftTop {
        width: 545px;
        height: 66px;
        background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankxk.png");
        background-size: cover;
        background-repeat: no-repeat;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 32px;

        .rightTopLeft {
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 9px;
          letter-spacing: 0;
          color: #28f7ff;
        }

        .rightTopRight {
          font-size: 24px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 9px;
          letter-spacing: 0;
          color: #28f7ff;

          .sta {
            margin-right: 15px;
          }
        }
      }

      .leftBottom {
        width: 553px;
        height: 618px;
        background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankLeft.png");
        background-size: cover;
        background-repeat: no-repeat;
        padding: 51px 53px 51px 47px;
        box-sizing: border-box;
        overflow: hidden;

        .ddasbox {
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          overflow-y: scroll;
          width: 100%;

          .seamless-warp {
            height: 100%;
            overflow: hidden;
          }
        }

        .leftBottom_lis {
          height: 33px;
          margin-bottom: 27px;
          font-size: 18px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 30px;
          letter-spacing: 0;
          color: #fff;
          display: flex;
          width: 100%;

          .ind {
            flex: 0.2;
          }

          .userInfo {
            flex: 1.2;
            display: flex;
            align-items: center;
            padding-left: 70px;
            box-sizing: border-box;
            overflow: hidden;

            img {
              width: 26px;
              height: 26px;
              background-color: #ffad37;
              margin: 0;
              margin-right: 8px;
              border-radius: 50%;
            }

            .userName {
              font-size: 18px;
              font-weight: normal;
              font-stretch: normal;
              line-height: 30px;
              letter-spacing: 0;
              color: #fff;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }

          .cart {
            flex: 1;
          }

          .cartNum {
            flex: 1;
          }
        }
      }
    }
  }

  .head {
    width: 1155px;
    height: 93px;
    margin: 0 auto;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankhead.png");
    background-size: cover;
    background-repeat: no-repeat;
    font-size: 40px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0;
    color: #fff;
    line-height: 93px;
    text-align: center;
    margin-bottom: 56px;

    span {
      margin-left: 40px;
    }
  }

  .logo {
    position: absolute;
    top: 30px;
    left: 49px;
    width: 100px;
    height: 100px;
    background: #fff;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
