<template>
  <div id="evaluate"
       :class="[this.fun.getPhoneEnv() == 3?'pcStyle':''] ">
    <c-title :hide="false"
             text="品牌详情"></c-title>
    <div class="detail-box">
      <div class="logo">
        <div class="img">
          <img :src="
              brandLogo ? brandLogo : require('../../assets/images/loading.jpg')
            "
               alt="" />
        </div>
        <span>{{ brandTit }}</span>
      </div>
      <div class="syn">
        <div class="title">
          <div class="spare"></div>
          <h1>品牌介绍</h1>
        </div>
        <div class="text">
          <p v-html="desc"></p>
        </div>
      </div>
      <div class="logo-goods">
        <div class="title">
          <div class="spare"></div>
          <h1>品牌商品</h1>
        </div>

        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <div class="goods-list">
            <!-- <div class="goods"
                 v-for="(item,i) in goodsList" :key='i'
                 @click.stop.prevent="gotoDetail(item.goods_id)">
              <div class="img">
                <img :src="item.thumb"
                     style="width: 100%; height: 100%;" />
              </div>
              <ul>
                <li class="name">
                  <h3 style="-webkit-box-orient: vertical;">
                    {{ item.title }}
                  </h3>
                </li>
                <li class="price">
                  {{$i18n.t('money')}}<b>{{ item.price }}</b><span v-if="item.price != item.market_price" v-show="parseInt(item.market_price)">{{$i18n.t('money')}}{{ item.market_price }}</span>
                </li>
              </ul>
            </div> -->
            <div class="goods"
                 v-for="(item,i) in goodsList" :key='i'
                 @click.stop.prevent="gotoDetail(item.goods_id)">
              <div class="img">
                <img :src="item.thumb"
                     style="width: 100%; height: 100%;" />
              </div>
              <ul>
                <li class="name">
                  <h3 style="-webkit-box-orient: vertical;">
                    {{ item.title }}
                  </h3>
                </li>
                <li class="price">
                  {{$i18n.t('money')}}<b>{{ item.price }}</b><span v-if="item.price != item.market_price" v-show="parseInt(item.market_price)">{{$i18n.t('money')}}{{ item.market_price }}</span>
                </li>
              </ul>
            </div>
          </div>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>
<script>
import brand from "./goods_brand_controller";
export default brand;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#evaluate {
  .logo {
    background-color: #fff;
    padding: 0.625rem 0.875rem;
    display: flex;

    .img {
      width: 1.875rem;
      height: 1.875rem;
      margin-right: 0.625rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    span {
      font-size: 14px;
      line-height: 1.875rem;
    }
  }

  .syn {
    margin-top: 0.625rem;
    text-align: left;
    background-color: #fff;

    .title {
      margin-left: 0.875rem;
      display: flex;
      border-bottom: solid 0.0625rem #f3f3f3;

      .spare {
        width: 0.25rem;
        height: 1rem;
        margin-top: 0.5625rem;
        background-color: #f15353;
        margin-right: 0.375rem;
        border-radius: 0.0625rem;
      }

      h1 {
        font-size: 14px;
        line-height: 2.25rem;
      }
    }

    .text {
      padding: 0.625rem 0.875rem;

      p {
        line-height: 1.5rem;
      }
    }
  }

  .logo-goods {
    margin-top: 0.625rem;

    .title {
      background-color: #fff;
      padding-left: 0.875rem;
      display: flex;

      .spare {
        width: 0.25rem;
        height: 1rem;
        margin-top: 0.5625rem;
        background-color: #f15353;
        margin-right: 0.375rem;
        border-radius: 0.0625rem;
      }

      h1 {
        font-size: 14px;
        line-height: 2.25rem;
      }
    }

    .goods-list {
      margin-top: 0.125rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .goods {
        width: 10rem;
        background-color: #fff;
        margin: 10px;

        .img {
          height: 10rem;
          width: 10rem;
          background-color: #f15353;
        }

        ul {
          padding: 0.3125rem;
          text-align: left;

          .name {
            font-size: 14px;
            color: #333;
            height: 2.5rem;

            h3 {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              line-height: 1.25rem;
              font-weight: normal;
            }
          }

          .price {
            color: #f15353;
            font-size: 12px;
            line-height: 1.25rem;
            margin-top: 0.375rem;
            position: relative;

            b {
              font-size: 18px;
              font-weight: normal;
            }

            span {
              text-decoration: line-through;
              color: #888;
              font-size: 12px;
              margin-left: 0.625rem;
              position: absolute;
              right: 0;
            }
          }
        }
      }
    }
  }
}

.pcStyle {
  .logo-goods {
    #olis {
      .goods-list {
        .goods {
          width: 49%;
          margin-right: 2%;
          margin-bottom: 0.875rem;

          .img {
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            position: relative;

            img {
              position: absolute;
              top: 0;
              left: 0;
            }
          }
        }

        .goods:nth-child(2n) {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
