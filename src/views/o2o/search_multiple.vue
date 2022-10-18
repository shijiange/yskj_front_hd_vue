<template>
  <div id="search" transition="fadeInLeft">
    <div id="soso" class="uou">
      <div class="search">
        <div slot="prepend" style="background: #fff; box-shadow: none;" @click="goback"><i class="iconfont icon-back"></i></div>
        <div class="screenBox">
          <div class="srceenText" @click="setScreenShow">{{ screenMenu[screenIndex].name }} <i class="iconfont icon-member-bottom"></i></div>
          <div class="srceenOptions" v-if="screenShow">
            <div class="srceenOptionsItem" v-for="(item, key) in screenMenu" :key="key" :class="{ active: key == screenIndex }" @click="setScreenIndex(key)">{{ item.name }}</div>
          </div>
        </div>
        <div class="searchBox">
          <form @submit.prevent action="#">
            <input type="search" placeholder="请输入内容" @keyup.13="getListData" v-model="inputs" />
          </form>
          <div class="img-icon" @click="getListData">
            <div class="img-icon-btn"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- <yz-blank :datas="stores" text="暂无记录" :isBtn="false"></yz-blank> -->
    <!-- <c-storeList :stores="stores" v-if="stores.length > 0" @changList="getMoreData" text="附近的店铺" :isLoadMore="isLoadMore" :page="page" :totalPage="total_page"></c-storeList> -->

    <loading :show="!networkLoading"></loading>
    <template v-if="networkLoading && listData.length > 0">
      <!-- 商品 -->
      <template v-if="screenType[screenIndex] == 'good'">
        <c-goodsList :goods="listData" goods_template="01"></c-goodsList>
      </template>

      <!-- 供应商 -->
      <template v-if="screenType[screenIndex] == 'supplier'">
        <div class="supplierList">
          <div class="supplierItem" v-for="item in listData" :key="item.id">
            <div class="supplierInfo">
              <div class="face" v-if="item.has_one_member">
                <img :src="item.has_one_member.avatar" alt="" />
              </div>
              <div class="left-content">
                <div class="name">{{ item.username }}</div>
                <div class="desc">在售商品{{ item.goods_total }}</div>
              </div>
              <div class="btn" @click="gotoSupplier(item.supplier_id)">进店</div>
            </div>
            <div class="supplierGoods">
              <template v-for="(good, index) in item.has_many_goods">
                <div class="supplierGood" :key="good.goods_id" v-if="index < 3" @click="gotoGoods(good.goods_id)">
                  <template v-if="good.has_one_goods">
                    <div class="face"><img :src="good.has_one_goods.thumb" alt="" /></div>
                    <div class="name">{{ good.has_one_goods.title }}</div>
                    <div class="price">{{ $i18n.t("money") }}{{ good.has_one_goods.vip_level_status && good.has_one_goods.vip_level_status.status == 1
                      ? good.has_one_goods.vip_level_status.word
                      : good.has_one_goods.price }}
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>

      <!-- 门店 -->
      <template v-if="screenType[screenIndex] == 'store'">
        <c-storeList :stores="listData" :listStyle="openTemplate" :noText="true"></c-storeList>
      </template>

      <!-- 酒店 -->
      <template v-if="screenType[screenIndex] == 'hotel'">
        <div style="padding-top: 1rem; background: #fff;">
          <hotel-list :datas="listData"></hotel-list>
        </div>
      </template>
    </template>

    <template v-if="networkLoading && listData.length == 0">
      <yz-blank text="暂无数据" :isBtn="false"></yz-blank>
    </template>

    <div v-show="networkLoading"></div>

    <div style="height: 3.4375rem; display: block;"></div>
  </div>
</template>

<script>
import search_multiple_controller from "./search_multiple_controller";
export default search_multiple_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#search {
  .osll {
    min-height: 100vh;
    overflow: scroll;
  }

  .uou {
    // position: fixed;
    // z-index: 99;
    // top: 0px;
    // transition: 0.2s;
    // -webkit-transition: 0.2s;
    width: 100%;
  }

  .mout {
    top: -2.25rem;
  }
}

.search {
  background: #fff;
  border-bottom: 0.0625rem solid #f5f5f5;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  position: relative;
  z-index: 9;

  .mint-button.mint-button--default {
    float: left;
    width: 10%;
    border: none;
    padding-top: 0;
    box-shadow: none;
  }

  .screenBox {
    position: relative;
    display: flex;
    padding-left: 0.5rem;

    .srceenText {
      font-size: 0.75rem;
      color: #f15353;
    }

    .srceenOptions {
      position: absolute;
      top: 1.8rem;
      width: 3.406rem;
      padding: 0.2rem 0;
      background-color: #fff;
      box-shadow: 0 0 0.813rem rgba(198, 198, 198, 0.6);

      .srceenOptionsItem {
        padding: 0.22rem 0;
        font-size: 0.75rem;
        color: #404040;

        &.active {
          color: #f15353;
        }
      }

      &::before {
        content: "";
        position: absolute;
        top: -0.5rem;
        left: 50%;
        transform: translateX(-50%);
        display: block;
        width: 0;
        height: 0;
        border-left: 0.35rem solid transparent;
        border-right: 0.35rem solid transparent;
        border-bottom: 0.5rem solid #fff;
      }
    }
  }

  .searchBox {
    position: relative;
    font-size: 14px;
    display: inline-table;
    flex: 1;
    padding: 0 2%;
    height: 2.8125rem;

    input {
      vertical-align: middle;
      border: none;
      background: #f2f2f2 none;
      box-sizing: border-box;
      outline: 0;
      padding: 0.1875rem 0.625rem;
      padding-right: 2.625rem;
      height: 1.875rem;
      line-height: 1.875rem;
      margin-top: 0.5rem;
      color: #8c8c8c;
      font-size: 14px;
      width: 100%;
      border-radius: 0.9375rem;
      z-index: 10;
    }

    .img-icon {
      border: none;
      color: #a9a9a9;
      display: table-cell;
      position: relative;
      border-radius: 0;
      height: 1.875rem;
      top: 0.0625rem;
      opacity: 2;
      left: -2.25rem;

      .img-icon-btn {
        position: absolute;
        z-index: 12;
        width: 1rem;
        height: 1rem;
        top: 50%;
        left: 50%;
        margin-left: -0.5rem;
        margin-top: -0.5rem;
        background: url("../../assets/images/search.png") no-repeat center center;
        background-size: 80% 80%;
      }
    }
  }
}

.supplierList {
  padding: 0.4rem 0.938rem;

  .supplierItem {
    width: 100%;
    margin-bottom: 0.4rem;
    padding: 0.85rem 0.65rem;
    background-color: #fff;
    border-radius: 0.469rem;

    .supplierInfo {
      display: flex;
      align-items: center;

      .face {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #cdcdcd;
        border-radius: 0.313rem;

        img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 0.313rem;
        }
      }

      .left-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 0.531rem;
        text-align: left;

        .name {
          font-size: 0.875rem;
          color: #333;
        }

        .desc {
          font-size: 0.75rem;
          color: #828282;
        }
      }

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3.75rem;
        height: 1.563rem;
        font-size: 0.75rem;
        color: #fff;
        background-color: #f15353;
        border-radius: 0.781rem;
      }
    }

    .supplierGoods {
      display: grid;
      grid-template-columns: repeat(3, 6.2rem);
      justify-content: space-between;
      margin-top: 1rem;

      .supplierGood {
        width: 100%;
        text-align: left;

        .face {
          width: 6.094rem;
          height: 6.094rem;
          background-color: #ddd;
          border-radius: 0.313rem;

          img {
            width: 6.094rem;
            height: 6.094rem;
            border-radius: 0.313rem;
          }
        }

        .name {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #202020;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .price {
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #f15353;
        }
      }
    }
  }
}
</style>
