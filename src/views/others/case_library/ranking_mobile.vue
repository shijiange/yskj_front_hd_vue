<template>
  <div id="case-rangking-mobile">
    <headTemplate text="排行榜" choosed="ranking"></headTemplate>
    <div class="bg">
      <div class="list">
        <div class="li li-left" v-if="list.length >= 2">
          <div class="img1">
            <img src="../../../assets/images/case-ranking2.png" alt="" />
          </div>
          <div class="title">{{ list[1].case_name }}</div>
          <div class="img2">
            <img :src="list[1].img_src || emptyImage" alt="" />
          </div>
          <div class="button" @click="gotoDetail(list[1].id)">查看</div>
        </div>
        <div class="li-one" v-if="list.length >= 1">
          <div class="img1">
            <img src="../../../assets/images/case-ranking1.png" alt="" />
          </div>
          <div class="title">{{ list[0].case_name }}</div>
          <div class="img2">
            <img :src="list[0].img_src || emptyImage" alt="" />
          </div>
          <div class="button" @click="gotoDetail(list[0].id)">查看</div>
        </div>
        <div class="li li-right" v-if="list.length >= 3">
          <div class="img1">
            <img src="../../../assets/images/case-ranking3.png" alt="" />
          </div>
          <div class="title">{{ list[2].case_name }}</div>
          <div class="img2">
            <img :src="list[2].img_src || emptyImage" alt="" />
          </div>
          <div class="button" @click="gotoDetail(list[2].id)">查看</div>
        </div>
      </div>
    </div>
    <div class="ul">
      <div class="li" v-for="(item, index) in list" :key="index">
        <div class="one" v-if="index < 3">
          <img src="../../../assets/images/case-no1.png" alt="" v-if="index == 0" />
          <img src="../../../assets/images/case-no2.png" alt="" v-else-if="index == 1" />
          <img src="../../../assets/images/case-no3.png" alt="" v-else-if="index == 2" />
        </div>
        <div class="one-1" v-else>NO.{{ index + 1 }}</div>
        <div class="two">
          <img :src="item.img_src || emptyImage" alt="" />
        </div>
        <div class="three">
          {{ item.case_name }}
        </div>
        <div class="four" @click="gotoDetail(item.id)">详情</div>
      </div>
      <div style="width: 100%; height: 40px; line-height: 40px; text-align: center;" v-if="!isLoadMore">
        {{ $i18n.t('没有更多了') }}~
      </div>
    </div>
    <serviceTemplate></serviceTemplate>
  </div>
</template>

<script>
import ranking_mobile_controller from './ranking_mobile_controller';

export default ranking_mobile_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$orange: #ff5c00;

#case-rangking-mobile {
  .bg {
    height: 12.5rem;
    width: 100%;
    background-image: url('../../../assets/images/case-ranking.png');
    background-size: 100%;
    position: relative;

    .list {
      border-radius: 5px;
      background: #fff;
      display: flex;
      justify-content: space-between;
      height: 7.8rem;
      margin: 0 1rem;
      position: absolute;
      bottom: 1.5rem;
      width: calc(100% - 2rem);

      .li {
        width: 6.75rem;
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;

        .img1 {
          width: 1.5625rem;
          height: 1.5625rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0.5rem 0;
        }

        .img2 {
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .button {
          display: inline-block;
          color: $orange;
          border: 1px solid $orange;
          border-radius: 1.25rem;
          margin-top: 0.125rem;
          padding: 0.125rem 0.75rem;
          font-size: 0.75rem;
        }
      }

      .li-one {
        margin-top: -1.5625rem;
        background-color: #fff;
        border-radius: 0.625rem;
        padding-top: 0.375rem;
        // background: #fff;
        // position: absolute;
        // height: 9.375rem;
        width: 7.125rem;
        // top: -1.7rem;
        // right: 6.75rem;
        // text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        // padding: 0.5rem;
        // border-top-left-radius: 5px;
        // border-top-right-radius: 5px;
        // box-shadow: -0px -2px 3px #ffedea;
        .img1 {
          width: 1.5625rem;
          height: 1.5625rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0.5rem 0;
        }

        .img2 {
          width: 1.4rem;
          height: 1.4rem;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }

        .button {
          display: inline-block;
          color: $orange;
          border: 1px solid $orange;
          border-radius: 1.25rem;
          margin-top: 0.125rem;
          padding: 0.125rem 0.75rem;
          font-size: 0.75rem;
        }
      }

      .li-left::before {
        content: '';
        position: absolute;
        top: 0;
        width: 5px;
        height: 0;
        margin: 0 auto;
        border-top: 1.875rem solid #ffedea;
        border-left: 0.5rem solid transparent;
        right: -0.5rem;
      }

      .li-right::before {
        content: '';
        position: absolute;
        top: 0;
        width: 5px;
        height: 0;
        margin: 0 auto;
        border-top: 1.875rem solid #ffedea;
        border-right: 0.5rem solid transparent;
        left: -0.5rem;
      }
    }
  }

  .ul {
    margin: 0 0.625rem;
    margin-bottom: 1rem;
    text-align: left;

    .li {
      margin-top: 0.625rem;
      line-height: 2.8125rem;
      border-radius: 0.625rem;
      padding: 0 0.625rem;
      background: #fff;
      display: flex;
      align-items: center;

      .one {
        width: 2.5rem;
        height: 1.5625rem;

        img {
          width: 1.5625rem;
          height: 100%;
        }
      }

      .one-1 {
        width: 2.5rem;
      }

      .two {
        width: 1.5625rem;
        height: 1.5625rem;
        margin: 0 1rem;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .three {
        width: 12.5rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .four {
        color: $orange;
      }
    }
  }
}
</style>
