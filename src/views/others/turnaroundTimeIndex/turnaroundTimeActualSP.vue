<template>
  <div id="turnaroundTimeActualSP">
    <div class="logo">
      <img :src="info.logo" alt="" />
    </div>
    <div class="head">
      <span>{{ typeMap + "(" + week + ")" }}</span>
    </div>
    <div class="ranking">
      <div class="two">
        <div class="title">第二名</div>
        <div class="name">
          <img :src="kart_match_first[1].avatar_image" v-if="kart_match_first[1]" alt="" />
          <div class="isname" v-if="kart_match_first[1]">{{ kart_match_first[1].nickname }}</div>
        </div>
        <div class="isbottom" style="font-size: 26.03px; color: #6fa738;" v-if="kart_match_first[1]">{{ kart_match_first[1].fine | isSecond }}</div>
      </div>
      <div class="one">
        <div class="title" style="height: 53px; font-size: 31.24px;">本场最佳</div>
        <div class="name" style="height: 123px;">
          <img :src="kart_match_first[0].avatar_image" v-if="kart_match_first[0]" alt="" />
          <div class="isname" v-if="kart_match_first[0]">{{ kart_match_first[0].nickname }}</div>
        </div>
        <div class="isbottom" style="font-size: 31.24px; color: #9200b5; height: 47px;" v-if="kart_match_first[0]">{{ kart_match_first[0].fine | isSecond }}</div>
      </div>
      <div class="thr">
        <div class="title" style="color: #b06155;">第三名</div>
        <div class="name">
          <img :src="kart_match_first[2].avatar_image" v-if="kart_match_first[2]" alt="" />
          <div class="isname" v-if="kart_match_first[2]">{{ kart_match_first[2].nickname }}</div>
        </div>
        <div class="isbottom" style="font-size: 26.03px; color: #6fa738;" v-if="kart_match_first[2]">{{ kart_match_first[2].fine | isSecond }}</div>
      </div>
    </div>
    <div class="list">
      <div class="lis" v-for="(item, ind) in kart_match" :key="ind">
        <div class="no">{{ ind + 4 }}</div>
        <div class="userInfo">
          <div class="userInfoLeft">
            <img :src="item.avatar_image" alt="" />
            <span>{{ item.nickname }}</span>
          </div>
          <div class="userInfoRight" v-if="item.fine">{{ item.fine | isSecond }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import turnaroundTimeActualSP_controller from "./turnaroundTimeActualSP_controller";

export default turnaroundTimeActualSP_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

#turnaroundTimeActualSP {
  position: relative;
  width: 1080px;
  min-height: 1920px;
  margin: 0 auto;
  background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankBJ2.png");
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;

  .list {
    margin: 0 44px 0 41px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    .lis:nth-child(2n) {
      margin-right: 0;
    }

    .lis {
      width: 478px;
      height: 67px;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      margin-bottom: 23px;
      margin-right: 19px;

      .no {
        width: 60px;
        height: 67px;
        background-color: #000;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 30px;
      }

      .userInfo {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        overflow: hidden;

        .userInfoRight {
          color: #fff;
          font-size: 30px;
          margin-right: 23px;
        }

        .userInfoLeft {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-size: 30px;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          img {
            width: 46px;
            height: 46px;
            background-color: #ffad37;
            border-radius: 50%;
            margin-right: 11px;
          }
        }
      }
    }
  }

  .ranking {
    height: 257px;
    margin: 0 45px 0 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 57px;

    .two,
    .thr,
    .one {
      width: 294px;
      height: 189px;
      background-color: rgba(0, 0, 0, 0.3);
      border-top: 3px solid rgba(177, 179, 184, 1);
      display: flex;
      flex-direction: column;

      .isbottom {
        flex: 1;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .title {
        height: 44px;
        width: 100%;
        font-size: 26.03px;
        color: rgba(230, 222, 80, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #000;
      }

      .name {
        height: 103px;
        width: 100%;
        padding: 0 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        img {
          width: 62px;
          height: 62px;
          background-color: #ffad37;
          margin: 0;
          margin-right: 14px;
          border-radius: 50%;
        }

        .isname {
          font-size: 31.24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
        }
      }
    }

    .one {
      width: 321px;
      height: 223px;
      background-color: rgba(0, 0, 0, 0.3);
      border-top: 3px solid rgba(241, 234, 44, 1);
    }

    .thr {
      width: 294px;
      height: 189px;
      background-color: rgba(0, 0, 0, 0.3);
      border-top: 3px solid rgba(176, 97, 85, 1);
    }
  }

  .head {
    width: 792px;
    height: 81px;
    margin: 74px auto 67px auto;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankheadHp.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-size: 36px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0;
    color: #fff;
    text-align: center;

    span {
      margin-left: 20px;
    }
  }

  .logo {
    position: absolute;
    top: 12px;
    left: 19px;
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
