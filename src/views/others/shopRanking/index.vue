<template>
  <div id="shopRanking">
    <!-- <c-title :hide="false" :text="'商品排行榜'"> </c-title> -->
    <div class="title">{{ setting.title }}</div>
    <div class="banner">
      <img :src="setting.banner" alt="" />
      <div class="posbtn" @click="show = true">榜单说明</div>
    </div>
    <div class="list">
      <div class="lis" v-for="(item, index) in rank_list" :key="index">
        <div class="shopTitle">
          <span>{{ item.name }}</span>
          <div class="tapBd" @click="toBd(item.id)">
            查看榜单
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="listBox">
          <div class="shoplist" v-for="(info, ind) in item.goods_list" :key="ind" @click="goDetail(info.id)">
            <div class="shopImg">
              <img :src="info.thumb" alt="" class="shopimg" />
              <div class="posimg" style="background: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking.png');" v-if="ind == 0">{{ ind + 1 }}</div>
              <div class="posimg" style="background: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking2.png');" v-if="ind == 1">{{ ind + 1 }}</div>
              <div class="posimg" style="background: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking3.png');" v-if="ind == 2">{{ ind + 1 }}</div>
            </div>
            <div class="shopTxt">{{ info.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="show" position="right" :style="{ height: '100%', width: '100%' }">
      <van-nav-bar title="榜单说明" left-arrow @click-left="onClickLeft" />
      <div class="contenTxt" v-html="setting.summary"></div>
    </van-popup>
  </div>
</template>

<script>
import index_controller from "./index_controller";

export default index_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#shopRanking {
  .contenTxt {
    padding: 0.94rem 1.03rem 0.94rem 0.91rem;
    color: #333;
    font-size: 0.94rem;
    text-align: left;
  }

  .posbtn {
    width: 3.41rem;
    height: 1.25rem;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 0.63rem 0 0 0.63rem;
    position: absolute;
    right: 0;
    top: 0.44rem;
    font-size: 0.69rem;
    color: #fff;
    line-height: 1.25rem;
    text-align: center;
  }

  .list {
    position: absolute;
    top: 10.88rem;
    width: 100%;
    padding: 0 0.94rem;
    padding-bottom: 5rem;

    .lis {
      .listBox {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }

      .shoplist:first-child {
        margin-left: 0;
      }

      .shoplist {
        display: flex;
        flex-direction: column;
        width: 6.22rem;
        height: 7.5rem;
        justify-content: space-between;
        margin-left: 0.63rem;

        .shopTxt {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.75rem;
        }

        .shopImg {
          width: 6.22rem;
          height: 6.22rem;
          border-radius: 0.31rem;
          position: relative;

          .shopimg {
            width: 100%;
            height: 100%;
            border-radius: 0.31rem;
          }

          .posimg {
            width: 1.06rem;
            height: 1.3rem;
            position: absolute;
            top: 0;
            left: 0.28rem;
            // background: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking.png');
            background-size: cover;
            color: #fff;
          }
        }
      }

      width: 21.56rem;
      background: #fff;
      border-radius: 0.63rem;
      padding: 0.78rem 0.84rem 0.75rem 0.81rem;

      .shopTitle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 1rem;
        color: #333;
        margin-bottom: 0.94rem;

        .tapBd {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #757575;
        }
      }
    }
  }

  .banner {
    width: 100%;
    height: 10rem;
    background-color: #c8c8c8;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .title {
    height: 2.78rem;
    width: 100%;
    background: #fff;
    text-align: center;
    line-height: 2.78rem;
    font-size: 1rem;
  }
}
</style>
