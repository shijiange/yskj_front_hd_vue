<template>
  <!-- 多车型排行榜 -->
  <div id="turnaroundTimeRank">
    <div class="logo">
      <img :src="list.logo" alt="" />
    </div>
    <div class="head">
      <span>{{ typeMap + "(" + week + ")" }}</span>
    </div>
    <div class="lis">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="(item, index) in info" :key="index">
          <div class="listbox">
            <div class="listTop">{{ item.name }}</div>
            <div class="lisTtBottom">
              <div class="lisUser" v-for="(datas, ind) in item.data" :key="ind">
                <div class="left">
                  <div class="noOne" v-if="ind == 0"></div>
                  <div class="noTwo" v-else-if="ind == 1"></div>
                  <div class="noThr" v-else-if="ind == 2"></div>
                  <div class="no" v-else>{{ ind + 1 }}</div>
                  <div class="img">
                    <img :src="datas.avatar_image" alt="" />
                  </div>
                  <div class="name">
                    {{ datas.nickname }}
                    <div class="seconds" v-if="ind == 0">{{ datas.fine | isSecond }}</div>
                  </div>
                </div>
                <div class="right">{{ datas.fine | isSecond }}</div>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>
<script>
import turnaroundTimeRank_controller from "./turnaroundTimeRank_controller";

export default turnaroundTimeRank_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

#turnaroundTimeRank {
  width: 100%;
  min-height: 100vh;
  background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankBJ.png");
  background-size: cover;
  background-repeat: no-repeat;
  padding-bottom: 50px;

  .lis {
    margin: 0 20px;
    display: flex;
    justify-content: space-between;

    .listbox:hover {
      background-color: rgba(0, 0, 0, 0.7);
      border-top: none;

      .listTop.listTop {
        background-color: #4994ec;
      }
    }

    .listbox {
      width: 443px;
      height: 821px;
      border-top: 6px solid #fccd0c;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .lisTtBottom {
        flex: 1;
        overflow-y: scroll;

        .lisUser {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 26px 28px 21px;
          box-sizing: border-box;

          .right {
            font-size: 22px;
            color: #fff;
          }

          .left {
            display: flex;
            align-items: center;
            flex: 1;
            overflow: hidden;

            .noOne {
              width: 41px;
              height: 44px;
              background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankone.png");
              background-size: 220% 220%;
              background-position: center;
              margin-right: 10px;
            }

            .noTwo {
              width: 41px;
              height: 44px;
              background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRanktwo.png");
              background-size: 220% 220%;
              background-position: center;
              margin-right: 10px;
            }

            .noThr {
              width: 41px;
              height: 44px;
              background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankthr.png");
              background-size: 220% 220%;
              background-position: center;
              margin-right: 10px;
            }

            .no {
              width: 41px;
              height: 44px;
              margin-right: 10px;
              font-size: 28px;
              color: #fff;
            }

            .img {
              width: 48px;
              height: 48px;
              background-color: #ffad37;
              border-radius: 50%;
              margin-right: 14px;

              img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }

            .name {
              font-size: 30px;
              color: #fff;
              text-align: left;
              white-space: nowrap; /* 超出的空白区域不换行 */
              overflow: hidden; /* 超出隐藏 */
              text-overflow: ellipsis;
              flex: 1;
              padding-right: 10px;
              box-sizing: border-box;

              .seconds {
                font-size: 20px;
                color: #b20eda;
              }
            }
          }
        }
      }

      .listTop {
        width: 443px;
        height: 64px;
        background-color: #000;
        font-size: 30px;
        color: #fff;
        text-align: center;
        line-height: 64px;
      }
    }
  }

  .head {
    width: 72.19rem;
    height: 5.57rem;
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
    margin-bottom: 86px;

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
