<template>
  <div id="card_goods">
    <!--<c-title :hide="false" :text="'名片选择商品'"></c-title>-->
    <div class="search_box"
         :style="{width: fun.getPhoneEnv() == 3 ? '375px' : ''}">
      <i class="fa fa-angle-left"
         @click="goBack"></i>

      <div class="text_box">
        <i class="iconfont icon-sousuo1"></i>
        <form @submit.prevent
              action="#">
          <input type="search"
                 v-model="inputs"
                 placeholder="搜索商品标题"
                 @keypress="enterSearch" />
        </form>
      </div>
      <span @click="getData">搜索</span>
    </div>
    <div class="title">
      <div class="line_left"></div>
      <h1>搜索结果</h1>
      <div class="line-right"></div>
    </div>
    <div class="goods_list"
         v-if="!this.fun.isTextEmpty(this.goodList)">
      <div class="goods_box"
           v-for="(item,index) in goodList"
           :key="index"
           @click="chooseGood(item.id)"
           :class="{'cg':item.id == chooseGoods}">
        <div class="goods_img">
          <img :src="item.thumb" />
        </div>
        <ul class="goods_text">
          <li class="name"
              style="-webkit-box-orient: vertical;">
            {{ item.title | escapeTitle }}
          </li>
          <li class="sum">
            <span>
              <font>{{$i18n.t('money')}}</font>{{ item.price }}
            </span>
            <i class="icon"
               v-if="item.id == chooseGoods"></i>
            <!-- <i class="iconfont no_current"
               v-if="!chooseGood.includes(item.goods_id)"></i> -->
          </li>
        </ul>
      </div>
    </div>

    <div class="noMoes"
         v-if="this.fun.isTextEmpty(this.goodList)">
      <img src="../../assets/images/no-more-product.png"
           alt="">
    </div>

    <div class="card_goods_btm"
         :style="{width: fun.getPhoneEnv() == 3 ? '375px' : ''}"
         :class="{'noG':fun.isTextEmpty(this.chooseGoods)}">
      <button type="button"
              @click="gotoRelease">确定选择</button>
    </div>
  </div>
</template>

<script>
import video_good_controller from "./video_good_controller";

export default video_good_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#card_goods {
  padding-bottom: 60px;

  .tips_box {
    background: #fff;
    border-radius: 0.375rem;
    height: 10.5rem;

    .text {
      padding: 2.25rem 0.875rem;
      font-size: 16px;
    }

    button {
      border: none;
      color: #50a6f9;
      font-size: 16px;
      width: 100%;
      height: 2.875rem;
      line-height: 2.875rem;
      border-top: solid 0.0625rem #ebebeb;
    }
  }

  .search_box {
    position: fixed;
    top: 0;
    z-index: 100;
    width: 100%;
    background: #fff;
    height: 2.75rem;
    line-height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .fa {
      font-size: 1.5rem;
      color: #333;
      width: 2.5rem;
    }

    .text_box {
      width: 17.5rem;
      border-radius: 1rem;
      height: 1.75rem;
      display: flex;
      align-items: center;
      background: #f2f2f2;
      padding: 0 0.625rem;

      .iconfont {
        font-size: 1rem;
        color: #999;
        margin-right: 0.625rem;
      }

      form {
        width: 100%;
      }

      input {
        border: none;
        width: 90%;
      }
    }

    span {
      width: 3.75rem;
      font-size: 15px;
    }
  }

  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2.5rem;

    .line_left,
    .line-right {
      width: 6.25rem;
      height: 0.0625rem;
      background: #ebebeb;
    }

    h1 {
      font-size: 15px;
      color: #999;
      margin: 0 0.875rem;
    }
  }

  .goods_list {
    padding: 0.625rem 0.9375rem;
    background: #f5f5f5;

    .goods_box {
      background: #fff;
      padding: 0.625rem;
      display: flex;
      margin-bottom: 0.625rem;
      border: solid 0.0625rem #fff;

      .goods_img {
        width: 3.75rem;
        height: 3.75rem;
        overflow: hidden;
        margin-right: 0.78rem;
        background: #f2f2f2;

        img {
          width: 100%;
        }
      }

      .goods_text {
        flex: 1;
        position: relative;

        .name {
          text-overflow: ellipsis;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          font-size: 15px;
          text-align: left;
        }

        .sum {
          position: absolute;
          bottom: 0;
          display: flex;
          line-height: 1.5rem;
          width: 100%;
          justify-content: space-between;

          span {
            color: #f15353;
            font-size: 1rem;

            font {
              font-size: 12px;
            }
          }

          .icon {
            font-size: 0.875rem;
            color: #fff;
            width: 1.5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            // border: solid 0.0625rem #f15353;
            // border-radius: 2rem;
            background-image: url(../../assets/images/addGoods_gou@2x.png);
            background-size: cover;
          }

          .no_current {
            font-size: 0.875rem;
            color: #ccc;
            width: 1.5rem;
            height: 1.5rem;
            line-height: 1.5rem;
            border: solid 0.0625rem #ccc;
            border-radius: 2rem;
            background: #fff;
          }
        }
      }
    }

    .cg {
      border: solid 0.0625rem #f15353;
    }
  }

  .noMoes {
    img {
      width: 5rem;
      height: 5rem;
      overflow: hidden;
    }
  }

  .card_goods_btm {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 3.0625rem;
    border-top: solid 0.0625rem #ebebeb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;

    p {
      padding: 0 0.625rem;
      font-size: 16px;

      span {
        color: #f15353;
        margin: 0 0.25rem;
      }
    }

    button {
      border: none;
      background: #f15353;
      color: #fff;
      border-radius: 0.25rem;
      width: auto;
      flex: 1;
      height: 2.5rem;
      font-size: 16px;
      margin: 0 0.94rem;
    }
  }

  .noG {
    button {
      background: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
