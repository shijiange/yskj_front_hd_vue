<template>
  <div id="right_good">
    <c-title :hide="false" :text="'权益商品'"></c-title>
    <div class="goods_box">
      <div class="goods" v-for="(item, i) in goodList" :key="i" v-show="!fun.isTextEmpty(item.id)">
        <div class="goods_img">
          <img :src="item.thumb" />
        </div>
        <ul class="name_price">
          <li class="name" style="-webkit-box-orient: vertical;">
            {{ item.title }}
          </li>
          <li class="price">
            <span class="sum"
              ><font>{{ $i18n.t('money') }}</font
              >{{ item.price }}</span
            >
            <button type="button" class="goods_btn" @click="buy(item.id)">
              立即购买
            </button>
          </li>
        </ul>
      </div>
      <template v-if="goodList.length <= 0 || fun.isTextEmpty(goodList[0].id)">
        <div class="noData">
          <img src="../../../assets/images/energytank_blank@2x.png" class="noData_imgs" alt="" />
          <p class="text">暂无指定商品</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import right_good_controller from './right_good_controller';

export default right_good_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#right_good {
  .noData {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .noData_imgs {
      width: 100%;
      margin: 0;
    }

    .text {
      padding: 3rem 0;
      color: #999;
      font-size: 1rem;
    }
  }

  .goods_box {
    background: #fff;
    padding: 0.625rem;

    .goods {
      border-radius: 0.25rem;
      border: solid 0.0625rem #ebebeb;
      display: flex;
      margin-bottom: 0.625rem;

      .goods_img {
        width: 7.5rem;
        height: 7.5rem;
        background: #f2f2f2;
        border-radius: 0.25rem 0 0 0.25rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name_price {
        width: 14.5625rem;
        padding: 0.625rem;
        position: relative;

        .name {
          text-align: left;
          font-size: 16px;
          line-height: 1.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .price {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: absolute;
          bottom: 0.625rem;
          padding-right: 1.25rem;

          .sum {
            font-size: 18px;
            color: #f15353;

            font {
              font-size: 12px;
            }
          }

          .goods_btn {
            background: #3b3b4f;
            font-size: 12px;
            color: #fff;
            width: 4.5rem;
            height: 1.625rem;
            border-radius: 2rem;
            border: none;
          }
        }
      }
    }

    .goods:last-child {
      margin: 0;
    }
  }
}
</style>
