<template>
  <!-- 实时成绩和单一车型 -->
  <div id="turnaroundTimeActual">
    <div class="logo">
      <img :src="info.logo" alt="" />
    </div>
    <div class="head">
      <span v-if="screen_id == 'real_time'">{{ lisArr.serial }}组成绩 ({{ lisArr.started_at | timestampToTime }})</span>
      <span v-if="screen_id != 'real_time'">{{ lisArr.name + "(" + week + ")" }}</span>
    </div>
    <!-- 实时成绩 -->
    <template v-if="screen_id == 'real_time'">
      <div class="ranking">
        <div class="two" :style="kart_match_first[1] ? '' : 'opacity: 0;'">
          <div class="title">第二名</div>
          <div class="name">
            <img :src="kart_match_first[1].member.avatar_image" alt="" v-if="kart_match_first[1]" />
            <div class="isname" v-if="kart_match_first[1]">{{ kart_match_first[1].member.nickname }}</div>
          </div>
          <div class="isbottom" style="font-size: 30px; color: #6fa738;" v-if="kart_match_first[1]">{{ kart_match_first[1].fine | isSecond }}</div>
        </div>
        <div class="one" :style="kart_match_first[0] ? '' : 'opacity: 0;'">
          <div class="title" style="font-size: 36px; height: 60px;">本场最佳</div>
          <div class="name" style="height: 143px;">
            <img :src="kart_match_first[0].member.avatar_image" alt="" v-if="kart_match_first[0]" />
            <div class="isname" v-if="kart_match_first[0]">{{ kart_match_first[0].member.nickname }}</div>
          </div>
          <div class="isbottom" style="font-size: 30px; color: #9200b5;" v-if="kart_match_first[0]">{{ kart_match_first[0].fine | isSecond }}</div>
        </div>
        <div class="thr" :style="kart_match_first[2] ? '' : 'opacity: 0;'">
          <div class="title" style="color: #b06155;">第三名</div>
          <div class="name">
            <img :src="kart_match_first[2].member.avatar_image" alt="" v-if="kart_match_first[2]" />
            <div class="isname" v-if="kart_match_first[2]">{{ kart_match_first[2].member.nickname }}</div>
          </div>
          <div class="isbottom" style="font-size: 30px; color: #6fa738;" v-if="kart_match_first[2]">{{ kart_match_first[2].fine | isSecond }}</div>
        </div>
      </div>
      <div class="list" :style="kart_match.length >= '21' ? 'height: 517px;' : ''">
        <template v-for="(item, ind) in kart_match">
          <div class="lis" :key="ind" v-if="kart_match">
            <div class="no">{{ ind + 4 }}</div>
            <div class="userInfo">
              <div class="userInfoLeft">
                <div>
                  <img v-if="item.member" :src="item.member.avatar_image" alt="" />
                </div>
                <div v-if="item.member" class="name">{{ item.member.nickname }}</div>
              </div>
              <div class="userInfoRight">{{ item.fine | isSecond }}</div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <!-- 单一排行榜 -->
    <template v-else>
      <div class="ranking">
        <div class="two" :style="kart_match_first[1] ? '' : 'opacity: 0;'">
          <div class="title">第二名</div>
          <div class="name">
            <img :src="kart_match_first[1].avatar_image" alt="" v-if="kart_match_first[1]" />
            <div class="isname" v-if="kart_match_first[1]">{{ kart_match_first[1].nickname }}</div>
          </div>
          <div class="isbottom" style="font-size: 30px; color: #6fa738;" v-if="kart_match_first[1]">{{ kart_match_first[1].fine | isSecond }}</div>
        </div>
        <div class="one" :style="kart_match_first[1] ? '' : 'opacity: 0;'">
          <div class="title" style="font-size: 36px; height: 60px;">本场最佳</div>
          <div class="name" style="height: 143px;">
            <img :src="kart_match_first[0].avatar_image" alt="" v-if="kart_match_first[0]" />
            <div class="isname" v-if="kart_match_first[0]">{{ kart_match_first[0].nickname }}</div>
          </div>
          <div class="isbottom" style="font-size: 30px; color: #9200b5;" v-if="kart_match_first[0]">{{ kart_match_first[0].fine | isSecond }}</div>
        </div>
        <div class="thr" :style="kart_match_first[2] ? '' : 'opacity: 0;'">
          <div class="title" style="color: #b06155;">第三名</div>
          <div class="name">
            <img :src="kart_match_first[2].avatar_image" alt="" v-if="kart_match_first[2]" />
            <div class="isname" v-if="kart_match_first[2]">{{ kart_match_first[2].nickname }}</div>
          </div>
          <div class="isbottom" style="font-size: 30px; color: #6fa738;" v-if="kart_match_first[2]">{{ kart_match_first[2].fine | isSecond }}</div>
        </div>
      </div>
      <div class="list" :style="kart_match.length >= '21' ? 'height: 517px;' : ''">
        <div class="lis" v-for="(item, ind) in kart_match" :key="ind">
          <div class="no">{{ ind + 4 }}</div>
          <div class="userInfo">
            <div class="userInfoLeft">
              <img v-if="item" :src="item.avatar_image" alt="" />
              <span v-if="item">{{ item.nickname }}</span>
            </div>
            <div class="userInfoRight">{{ item.fine | isSecond }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import turnaroundTimeActual_controller from "./turnaroundTimeActual_controller";

export default turnaroundTimeActual_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.inNone {
  opacity: 0;
}

#turnaroundTimeActual {
  width: 100%;
  height: 1080px;
  background: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/turnaroundTimeRankBJ.png");
  background-size: cover;
  background-repeat: no-repeat;

  .list {
    margin: 0 101px 0 89px;
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;

    .lis:nth-child(3n) {
      margin-right: 0;
    }

    .lis {
      width: 530px;
      height: 67px;
      background-color: rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: space-between;
      margin-bottom: 23px;
      margin-right: 40px;

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
        // justify-content: space-between;
        align-items: center;
        overflow: hidden;

        .userInfoRight {
          color: #fff;
          font-size: 30px;
          margin-right: 23px;
        }

        .userInfoLeft {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 30px;
          color: #fff;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding-right: 10px;
          box-sizing: border-box;

          .name {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: left;
          }

          img {
            width: 46px;
            height: 46px;
            background-color: #ffad37;
            border-radius: 50%;
            margin: 0;
            margin-right: 11px;
          }
        }
      }
    }
  }

  .ranking {
    height: 257px;
    margin: 0 254px 0 228px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 57px;

    .two,
    .thr,
    .one {
      width: 338px;
      height: 217px;
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
        height: 50px;
        width: 100%;
        font-size: 30px;
        color: rgba(230, 222, 80, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #000;
      }

      .name {
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
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
          font-size: 36px;
          color: #fff;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .one {
      width: 368px;
      height: 257px;
      background-color: rgba(0, 0, 0, 0.3);
      border-top: 3px solid rgba(241, 234, 44, 1);
    }

    .thr {
      width: 338px;
      height: 217px;
      background-color: rgba(0, 0, 0, 0.3);
      border-top: 3px solid rgba(176, 97, 85, 1);
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
    margin-bottom: 76px;

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
