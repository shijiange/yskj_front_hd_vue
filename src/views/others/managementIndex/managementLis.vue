<template>
  <div id="managementLis">
    <c-title :hide="false" :text="'厂家列表'"> </c-title>
    <div class="lisBox" v-for="(item, index) in info" :key="index">
      <div id="management">
        <div style="display: flex;">
          <div class="mana_o">
            <img :src="item.logo_url" alt="" />
          </div>
          <div class="nameMana">
            <div class="nameMana_a">{{ item.producer_name }}</div>
            <div class="nameMana_b">
              热销<em>{{ item.sell_total }}</em
              >件
            </div>
          </div>
        </div>
        <div class="tapMana" @click="toIndex(item.id)">进入店铺</div>
      </div>
      <div style="display: flex; padding: 0 0 0.78rem; width: 100%; overflow-x: scroll;">
        <div class="lis" v-for="(data, ind) in item.goods_list" :key="ind" @click="toDetail(data.id, item.id)">
          <div class="lisImg" v-if="ind < 7">
            <!-- <div class="posDiv">独家精品{{ind}}</div> -->
            <img :src="data.thumb_url" alt="" />
          </div>
          <div class="lisImg" v-if="ind == 7" @click.stop="toIndex(item.id)">
            <div class="nextBox">
              <i class="iconfont icon-shangcheng2"></i>
              <span>更多商品 ></span>
            </div>
          </div>
          <div class="lisBottom">
            <div class="title">{{ data.title }}</div>
            <div class="money">{{ $i18n.t("money") }}{{ data.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import managementLis_controller from "./managementLis_controller";

export default managementLis_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#managementLis {
  .lisBox .lis:last-child {
    margin-right: 0.69rem;
    border-radius: 0.31rem;
  }

  .lisBox {
    margin: 0.94rem;
    background: #fff;
    width: 21.56rem;
    height: 14.31rem;
    background-color: #fff;
    border-radius: 0.63rem;

    .lis {
      width: 6.19rem;
      height: 9rem;
      display: flex;
      flex-direction: column;
      margin-left: 0.63rem;

      .lisImg {
        width: 6.19rem;
        height: 6.19rem;
        border-radius: 0.31rem;
        position: relative;

        .nextBox {
          width: 100%;
          height: 100%;
          border-radius: 0.4rem;
          background: #f8f8f8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          i {
            font-size: 50px;
            color: #d3d3d3;
          }

          span {
            font-size: 0.75rem;
            color: #666;
          }
        }

        img {
          width: 100%;
          height: 100%;
          border-radius: 0.31rem;
        }

        .posDiv {
          position: absolute;
          top: 0;
          left: 0;
          width: 3.81rem;
          height: 1.03rem;
          background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/exclusive@3x.png");
          background-repeat: no-repeat;
          background-size: contain;
          font-size: 0.75rem;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .lisBottom {
        flex: 1;
        padding: 0.58rem 0.53rem 0 0.19rem;

        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          font-size: 0.81rem;
          line-height: 1.5rem;
        }

        .money {
          text-align: left;
          font-size: 0.75rem;
          color: #f14e4e;
        }
      }
    }

    #management {
      height: 4.75rem;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.19rem 0.94rem 0.94rem 1.06rem;

      .mana_o {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        margin-right: 0.69rem;

        img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
        }
      }

      .nameMana {
        display: flex;
        flex-direction: column;

        .nameMana_a {
          font-size: 1.06rem;
          color: #333;
          text-align: left;
          margin-bottom: 0.5rem;
        }

        .nameMana_b {
          font-size: 0.75rem;
          text-align: left;
          color: #333;

          em {
            color: #f14e4e;
          }
        }
      }

      .tapMana {
        width: 4.69rem;
        height: 1.69rem;
        background-color: #f14e4e;
        border-radius: 0.84rem;
        font-size: 0.75rem;
        color: #fff;
        text-align: center;
        line-height: 1.69rem;
      }
    }
  }
}
</style>
