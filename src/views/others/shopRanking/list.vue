<template>
  <div id="shopRankingList">
    <!-- <div class="title">商品排行榜</div> -->
    <c-title :hide="false" :text="setting.title"> </c-title>
    <div class="banner">
      <img :src="topBanner" alt="" />
      <!-- 分类 -->
      <div class="classifY" v-if="status == 1">
        <div :class="[calsst == 'z' ? 'classbtn' : 'selectBtn']" class="classMr" @click="tapClass('z')">{{ info.name }}</div>
        <div :class="[calsst == index ? 'classbtn' : 'selectBtn']" class="classMr" v-for="(inst, index) in info.other_rank_list" :key="index" @click="tapClass(index)">
          {{ inst.name }}
        </div>
      </div>
      <div class="listBox" :class="[status == '0' ? 'isfenlei' : '']">
        <div class="list" v-show="status == '1' && calsst != 'z'" v-for="(item, index) in navinfo.goods_list" :key="index" @click="goDetail(item.id)">
          <div class="left">
            <img :src="item.thumb" alt="" />
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking.png');" v-if="index == '0'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking2.png');" v-if="index == '1'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking3.png');" v-if="index == '2'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking4.png');" v-if="index > 2">
              {{ index + 1 }}
            </div>
          </div>
          <div class="right">
            <div class="rightTop">
              <div class="shoptitle">{{ item.title }}</div>
              <div class="seleNumber">
                <i class="iconfont icon-fontclass-shouchu"></i>
                {{ navinfo.rank_type | rankMet }}售出 <span class="p">{{ item.sales_volume }}</span> 件
              </div>
            </div>
            <div class="price">{{ $i18n.t("money") }}{{ item.price }}</div>
          </div>
        </div>
        <div class="list" v-show="status == '1' && calsst == 'z'" v-for="(item, index) in info.goods_list" :key="index" @click="goDetail(item.id)">
          <div class="left">
            <img :src="item.thumb" alt="" />
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking.png');" v-if="index == '0'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking2.png');" v-if="index == '1'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking3.png');" v-if="index == '2'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking4.png');" v-if="index > 2">
              {{ index + 1 }}
            </div>
          </div>
          <div class="right">
            <div class="rightTop">
              <div class="shoptitle">{{ item.title }}</div>
              <div class="seleNumber">
                <i class="iconfont icon-fontclass-shouchu"></i>
                {{ info.rank_type | rankMet }}售出 <span class="p">{{ item.sales_volume }}</span> 件
              </div>
            </div>
            <div class="price">{{ $i18n.t("money") }}{{ item.price }}</div>
          </div>
        </div>
        <div class="list" v-show="status == '0'" v-for="(item, index) in info.goods_list" :key="index" @click="goDetail(item.id)">
          <div class="left">
            <img :src="item.thumb" alt="" />
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking.png');" v-if="index == '0'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking2.png');" v-if="index == '1'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking3.png');" v-if="index == '2'">
              {{ index + 1 }}
            </div>
            <div class="posInd" style="background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking4.png');" v-if="index > 2">
              {{ index + 1 }}
            </div>
          </div>
          <div class="right">
            <div class="rightTop">
              <div class="shoptitle">{{ item.title }}</div>
              <div class="seleNumber">
                <i class="iconfont icon-fontclass-shouchu"></i>
                {{ info.rank_type | rankMet }}售出 <span class="p">{{ item.sales_volume }}</span> 件
              </div>
            </div>
            <div class="price">{{ $i18n.t("money") }}{{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import list_controller from "./list_controller";

export default list_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#shopRankingList {
  .classifY {
    height: 3.09rem;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 0.94rem;
    overflow-x: scroll;

    .classMr {
      padding: 0.38rem 1.13rem 0.41rem 1.06rem;
      font-size: 0.81rem;
      color: #fff;
      border-radius: 0.78rem;
      margin-right: 0.94rem;
      white-space: nowrap;
    }

    .classMr:last-child {
      margin-right: 0;
    }

    .classbtn {
      background-color: #f14e4e;
    }

    .selectBtn {
      background-color: #b4b4b4;
    }
  }

  .isfenlei {
    margin-top: -1.9rem;
  }

  .listBox {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 4rem;

    .list {
      width: 21.56rem;
      height: 6.31rem;
      background-color: #fff;
      border-radius: 0.63rem;
      padding: 0.78rem 0.78rem 0.78rem 0.81rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.63rem;

      .list:last-child {
        margin-bottom: 0;
      }

      .right {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        justify-content: space-between;

        .price {
          font-size: 1rem;
          color: #f14e4e;
          text-align: left;
        }

        .seleNumber {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          color: #999;
          margin-top: 0.38rem;

          i {
            color: #fb8615;
          }

          font-size: 0.75rem;

          .p {
            color: #f14e4e;
          }
        }

        .shoptitle {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
        }
      }

      .left {
        width: 4.69rem;
        height: 4.69rem;
        position: relative;
        border-radius: 0.31rem;
        margin-right: 0.59rem;

        .posInd {
          position: absolute;
          top: 0;
          left: 0.28rem;
          height: 1.22rem;
          width: 1.06rem;
          // background-image: url('https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/shopRanking.png');
          background-size: cover;
          color: #fff;
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.31rem;
        }
      }
    }
  }

  .banner {
    width: 100%;

    img {
      width: 100%;
      height: 10rem;
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
