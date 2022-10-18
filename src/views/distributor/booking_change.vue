<template>
  <div>
    <c-title :hide="false" :text="'补货'"> </c-title>
    <van-tabs v-model="activeName" @click="getData" sticky>
      <van-tab title="订货">
        <ul class="goods-box">
          <li v-for="(item, index) in listOne" :key="index">
            <div class="left">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="right">
              <p class="title">{{ item.title }}</p>
              <span class="spec text-over" v-if="item.replenish_number"
                >最少补货数：{{ item.replenish_number }}{{ item.sku }}</span
              >
              <p class="stock">
                补货价:<span class="price">{{ $i18n.t('money') }}{{ item.show_price }}</span>
              </p>
              <div class="ticket ">
                <p class="repertory text-over">
                  <!-- 规格:{{ item.has_many_options[0] ? item.has_many_options[0].title : '无' }} -->
                </p>
                <div class="select">
                  <transition name="fade">
                    <i
                      v-if="goodsCarts[item.id]"
                      class="iconfont icon-life-game-sign"
                      @click.stop="numberLeft(item.id, item.replenish_number)"
                    ></i>
                  </transition>
                  <input
                    type="tel"
                    title="number"
                    v-if="goodsCarts[item.id] && !goodsCarts[item.id].option_str"
                    @click.stop
                    v-model.lazy="goodsCartsTotal[item.id].total"
                    disabled="true"
                  />
                  <span v-if="goodsCarts[item.id] && goodsCarts[item.id].option_str" @click.stop>{{
                    goodsCartsTotal[item.id].total
                  }}</span>
                  <i @click.stop="numberRight(item.id, item.replenish_number)" class="iconfont icon-life-game-plus"></i>
                </div>
              </div>
            </div>
          </li>
          <img
            v-if="fun.isTextEmpty(listOne)"
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem auto;"
          />
        </ul>
      </van-tab>
      <van-tab title="换货">
        <ul class="goods-box">
          <li v-for="(item, index) in listOne" :key="index">
            <div class="left">
              <img :src="item.thumb" alt="" />
            </div>
            <div class="right">
              <p class="title">{{ item.title }}</p>
              <div class="ticket" style="margin-top: 3rem;">
                <p class="orange">兑换券 {{ item.goods_change ? item.goods_change.certificate : '0' }}张</p>
                <p @click="changeGood(item.id)" class="exchange">换货</p>
              </div>
            </div>
          </li>
          <img
            v-if="fun.isTextEmpty(listOne)"
            src="../../assets/images/blank.png"
            alt=""
            style="width: 5rem; margin: 2rem auto;"
          />
        </ul>
      </van-tab>
    </van-tabs>
    <div class="car-btn" v-show="activeName == '0'" @click.stop="gotoCart">
      <img src="../../assets/images/kc_buycar@2x.png" alt="" />
    </div>
    <van-popup v-model="showSpec" position="bottom" closeable close-icon="close">
      <!-- <specification-popup :goodsInfos="goodsInfo" v-if="showSpec"></specification-popup> -->
      <template>
        <div id="specificationPopup" v-if="showSpec">
          <div class="topDiv">
            <div class="shopimg">
              <div id="chooser_img">
                <img :src="popThumb == null || popThumb == '' || popThumb == undefined ? goodsInfo.thumb : popThumb" />
              </div>
              <div class="right">
                <template v-if="!diyHeaders">
                  <div class="title">{{ goodsInfo.title }}</div>
                  <div class="option">库存{{ popStock }}{{ goodsInfo.sku }}</div>
                  <div class="price">
                    <em style="font-size: 0.625rem;">{{ $i18n.t('money') }}</em
                    ><span id="option_price">{{ popPrice }}</span>
                  </div>
                </template>
                <!-- 这是自定义顶部右侧信息 -->
                <slot v-if="diyHeaders"></slot>
              </div>
            </div>
          </div>
          <div class="shopinfo noVantRadio">
            <dl v-for="(specs, i) in goodsInfo.has_many_specs" :key="i">
              <dt>{{ specs.title }}</dt>
              <dd>
                <van-radio-group v-model="specs.description" checked-color="#f15353" @change="selectSpecs">
                  <van-radio
                    :class="{ vantRadioshow: specs.description == specitem }"
                    :disabled="specitem.c"
                    v-for="(specitem, i) in specs.specitem"
                    :name="specitem"
                    :key="i"
                  >
                    {{ specitem.title }}
                  </van-radio>
                </van-radio-group>
              </dd>
            </dl>
          </div>
          <div>
            <van-row>
              <van-col :span="12" id="num">
                购买数量：
              </van-col>
              <van-col :span="11" v-show="popNum >= 1">
                <div class="num">
                  <div class="leftnav" @click="changeCount(popCard.id, popNum - 1, -1)">-</div>
                  <input type="number" class="shownum" v-model.lazy="popNum" disabled="true" />
                  <div class="rightnav" @click="changeCount(popCard.id, popNum + 1, 1)">+</div>
                </div>
              </van-col>
              <van-col :span="11" v-show="popNum < 1" class="bottomBox">
                <span class="btn" @click="submitAction">加入购物车</span>
              </van-col>
            </van-row>
          </div>
        </div>
      </template>
    </van-popup>
  </div>
</template>

<script>
import booking_change_controller from './booking_change_controller';

export default booking_change_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.goods-box {
  background: #fff;
  padding: 1rem;
  min-height: 100vh;

  .select {
    display: flex;

    span {
      outline: none;
      border: none;
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 14px;
      text-align: center;
    }

    input {
      outline: none;
      border: none;
      display: inline-block;
      width: 2.5rem;
      height: 1.5rem;
      line-height: 1.5rem;
      font-size: 14px;
      text-align: center;
    }

    i:first-child {
      background-color: #ccc;
    }

    i:last-child {
      background-color: #f15353;
    }

    i {
      width: 1.5rem;
      height: 1.5rem;
      text-align: center;
      line-height: 1.5rem;
      border-radius: 0.75rem;
      color: #fff;
      font-size: 16px;
    }
  }

  li {
    padding-bottom: 0.5rem;
    display: flex;

    .left {
      flex: 0 0 8rem;

      img {
        width: 8rem;
        height: 8rem;
        border-radius: 0.313rem;
      }
    }

    .right {
      flex: 1;
      text-align: left;
      display: flex;
      flex-direction: column;
      margin: 0.5rem 0 0.5rem 0.5rem;
      font-size: 12px;
      width: 13rem;
    }

    .title {
      font-weight: bold;
      font-size: 0.875rem;
      line-height: 1.25rem;
      height: 2.5rem;
      margin-bottom: 0.3rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .spec {
      color: #9f9f9f;
    }

    .stock {
      margin-top: 1rem;
      margin-bottom: 0.3rem;
    }

    .price {
      color: #f01818;
      font-size: 15px;
    }

    .repertory {
      color: #9f9f9f;
      flex: 1;
      align-self: center;
    }

    .ticket {
      display: flex;
    }

    .exchange {
      background-color: #ffae00;
      border-radius: 15px;
      color: #fff;
      padding: 2px 0.5rem;
      line-height: 1rem;
      position: relative;

      i {
        // width: 1rem;
        padding: 0 0.25rem;
        height: 1rem;
        line-height: 1rem;
        font-size: 12px;
        position: absolute;
        top: -8px;
        right: -5px;
        background-color: #ff5d5c !important;
        text-align: center;
        border-radius: 0.75rem;
        color: #fff;
      }
    }

    .orange {
      color: #ffae00;
      align-self: center;
      flex: 1;
    }
  }
}

.noVantRadio {
  .van-radio-group {
    display: flex;
    flex-wrap: wrap;

    .van-radio {
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      background: #fff;
      border: 1px solid #efefef;
      text-align: center;
      box-sizing: border-box;
      border-radius: 0.25rem;
    }

    .vantRadioshow {
      background-color: rgb(241, 83, 83);
      border-color: rgb(241, 83, 83);
      box-shadow: rgb(241, 83, 83) -1px 0 0 0;
    }

    .van-radio__label {
      color: #000;
    }
  }
}

#specificationPopup {
  position: relative;
  width: 100%;

  .bottomBox {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    align-items: center;

    .btn {
      display: inline-block;
      width: 8rem;
      height: 2.5rem;
      line-height: 2.5rem;
      background-color: #f01818;
      border-radius: 1.234rem;
      color: #fff;
      font-size: 0.875rem;
      font-weight: bold;
    }
  }

  .topDiv {
    padding: 0.625rem 0.75rem;

    .shopimg {
      display: flex;
      justify-content: space-between;
      padding-bottom: 0.625rem;
      border-bottom: 0.0625rem solid #efefef;

      #chooser_img {
        height: 4.625rem;
        width: 4.625rem;

        img {
          width: 100%;
          border-radius: 0.1875rem;
          border: 0.0625rem solid #efefef;
        }
      }

      .right {
        flex: 1;
        text-align: left;
        padding: 0 0.875rem;

        .title {
          font-size: 0.875rem;
          line-height: 1.25rem;
          height: 2.5rem;
          color: #000;
          font-weight: bold;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .price {
          color: #f15353;
          font-size: 1rem;
          line-height: 1.25rem;
          height: 1.25rem;
          overflow: hidden;

          span {
            font-size: 1rem;
          }
        }

        .option {
          color: #999;
          font-size: 0.625rem;
          line-height: 1rem;
          height: 1rem;
          overflow: hidden;
        }
      }
    }
  }

  .shopinfo {
    text-align: left;
    padding-left: 0.625rem;
    margin: 1rem 0 1rem 0;
    max-height: 50vh;
    overflow: scroll;

    dl {
      dt {
        margin-bottom: 0.5rem;
        font-weight: bold;
        color: #000;
      }

      dd {
        margin-bottom: 0.3125rem;
      }
    }
  }

  .van-row {
    margin: 0.875rem;
    padding: 0;
    font-size: 14px;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    #num {
      height: 3.75rem;
      line-height: 3.75rem;
      text-align: left;
    }

    .num {
      margin-top: 1rem;
      float: right;
      background-color: #fff;
      border: 0.0625rem solid #ccc;
      border-radius: 0.875rem;
      overflow: hidden;

      .leftnav {
        height: 1.75rem;
        width: 1.75rem;
        float: left;
        background-color: #fff;
        color: #000;
        text-align: center;
        border-radius: 0.1875rem;
        line-height: 1.75rem;
        font-size: 24px;
        font-weight: bold;
      }

      .shownum {
        height: 1.75rem;
        width: 2.25rem;
        float: left;
        border: 0;
        margin: 0;
        padding: 0;
        text-align: center;
        color: #000;
        border-left: 0.0625rem solid #ccc;
        border-right: 0.0625rem solid #ccc;
      }

      .rightnav {
        height: 1.75rem;
        width: 1.75rem;
        float: right;
        background-color: #fff;
        color: #000;
        text-align: center;
        border-radius: 0.1875rem;
        line-height: 1.75rem;
        font-size: 24px;
        font-weight: bold;
      }
    }
  }
}

.car-btn {
  position: fixed;
  bottom: 5rem;
  right: 0.5rem;

  img {
    width: 3.5rem;
    height: 3.5rem;
  }
}
</style>
