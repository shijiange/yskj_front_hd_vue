<template>
  <div class="goods-management">
    <c-title :hide="false" text="商品管理"></c-title>
    <!-- 吸顶 -->
    <van-sticky :offset-top="40">
      <div class="header-search">
        <!-- 加form标签，在苹果手机键盘输入显示 "搜索" -->
        <form action="/" class="search">
          <van-search
            v-model="keyWord"
            :clearable="true"
            shape="round"
            placeholder="搜索商品"
            @search="searchGoods"
          >
            <template #left-icon>
              <van-icon name="search" @click="searchGoods"></van-icon>
            </template>
          </van-search>
        </form>
        <router-link class="btn-search" :to="fun.getUrl('releaseStoreGoods')">发布商品</router-link>
      </div>
      <van-tabs v-model="active" @change="changeTabs" class="status-tab">
        <van-tab title="全部" name=""></van-tab>
        <van-tab title="在售商品" :name="1"></van-tab>
        <van-tab title="下架商品" :name="0"></van-tab>
      </van-tabs>
      <div class="control-column">
          <span class="goods-count">商品数：{{pagination.total}}</span>
          <div class="batch-option" @click="selectBolfun" v-if="!isBatchOperation">
            <i class="iconfont icon-fontclass-piliang"></i>
            <span>批量操作</span>
          </div>
          <div v-else @click="cancelBatchOperation">取消</div>
        </div>
    </van-sticky>

    <van-list class="goods-list"
      v-if="goodsList.length > 0"
      v-model="pagination.loading"
      offset="50"
      :finished="pagination.finished"
      finished-text="没有更多了"
      @load="getGoodsList"
      :immediate-check="false"
    >
      <van-checkbox-group v-model="batchGoods" ref="checkboxGroup">
        <div class="goods-box" v-for="(goods, index) in goodsList" :key="index">
          <div class="goods">
            <div class="goods-info">
              <div class="left-img">
                <van-checkbox class="checkbox" v-if="isBatchOperation" :name="goods.id"></van-checkbox>
                <img :src="goods.thumb_src" alt="">
              </div>
              <div class="right-detail">
                <p class="goods-title text-over-2">{{goods.title}}</p>
                <p class="stock">
                  <span>库存：{{goods.stock ? goods.stock : 0}}</span>
                  <span style="margin-left: 0.5rem">销量：{{goods.real_sale ? goods.real_sale : 0}}</span>
                </p>
                <p style="display:flex">
                  <span class="price">
                    <span class="money-icon">{{ $i18n.t("money") }}</span>
                    {{goods.price}}
                  </span>
                  <span v-if="goods.status == 1">上架</span>
                  <span v-else style="color: #929292;">下架</span>
                </p>
              </div>
            </div>
            <div class="option-goods">
              <router-link class="option edit" :to="fun.getUrl('releaseStoreGoods', {id: goods.id})">
                <span>编辑</span>
                <i class="iconfont icon-fontclass-qianshu"></i>
              </router-link>
              <div class="option release">
                <span v-if="goods.status != 1" @click="onShelf(goods.id, 1)">
                  <span>上架</span>
                  <i class="iconfont icon-fontclass-shangchuan"></i>
                </span>
                <span v-else @click="onShelf(goods.id, 0)">
                  <span>下架</span>
                  <i class="iconfont icon-fontclass-xiazai"></i>
                </span>
              </div>
              <div class="option delete" @click="deleteGoods(goods.id)">
                <span>删除</span>
                <i class="iconfont icon-fontclass-shanchu"></i>
              </div>
            </div>
          </div>
        </div>
      </van-checkbox-group>
    </van-list>
    <van-empty v-else description="空空如也" />

    <div v-if="isBatchOperation">
      <div class="empty-placeholder"></div>
      <div :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '', 'all-handler']">
        <div class="check-all">
          <van-checkbox v-model="allCheck" @change="toggleAll">
            <template #icon="props">
              <i :class="['iconfont', 'icon-all_select_active', props.checked ? 'activeIcon' : '']"></i>
            </template>
            <span>全选</span>
          </van-checkbox>
        </div>
        <div class="btns">
          <div :class="['btn', index == btnActive ? 'btn-active' : '']" v-for="(item, index) in optionBtns" :key="index" @click="handlerBatchOpt(item, index)">{{item.text}}</div>
        </div>
        <div class="complete" @click="cancelBatchOperation">完成</div>
      </div>
    </div>
  </div>
</template>
<script>
import goodsManagement from "./goods_management_controller";
export default goodsManagement;
</script>


<style lang='scss' rel='stylesheet/scss' scoped>
.goods-management {
  .text-over-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .header-search {
    display: flex;
    align-items: center;
    background: #ffffff;
    height: 2.5rem;
    padding: 0.5rem;
    /deep/ .van-search__content {
      background-color: #eff0f1;
    }
    .search {
      flex: 1;
      padding: 0;
      margin-right: 0.5rem;
    }
    .btn-search {
      color: #ffffff;
      padding: 0.3rem 1rem;
      background-color: #28b2fa;
      border-radius: 0.84rem;
    }
  }
  .control-column {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: #F5F5F5;
    .batch-option {
      letter-spacing: 0.1rem;
      color: #28b2fa;
    }
  }


  .goods-list {
    .goods-box {
      display: flex;
      align-items: center;
      margin: 0 0.8rem 0.8rem 0.8rem;
      background-color: #ffffff;
      border-radius: 0.31rem;
      .goods {
        flex: 1;
        padding: 0.75rem;
        .goods-info {
          display: flex;
          align-items: center;
          .left-img {
            position: relative;
            width: 4.38rem;
            height: 4.38rem;
            background-color: #8b8b8b;
            border-radius: 0.19rem;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
            .checkbox {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(37, 37, 37, 0.5);
            }
          }
          .right-detail {
            flex: 1;
            text-align: left;
            margin-left: 0.63rem;
            .goods-title {
              font-size: 0.98rem;
              line-height: 1.13rem;
              color: #242424;
            }
            .stock {
              color: #807e7e;
              margin: 0.66rem 0;
              font-size: 0.69rem;
            }
            .price {
              flex: 1;
              font-weight: bold;
              font-size: 0.88rem;
              color: #f15353;
              .money-icon {
                font-size: 0.63rem;
              }
            }
          }
        }
        .option-goods {
          display: flex;
          justify-content: space-between;
          margin-top: 0.68rem;
          .iconfont {
            margin-left: 0.5rem;
            color: #f15353;
          }
        }
      }
    }
  }

  /deep/ .van-checkbox {
    .van-checkbox__icon{
      .van-icon-success {
        background: #c4c4c4;
        color: #ffffff;
        border: none;
      }
    }
    .van-checkbox__icon--checked{
      .van-icon-success {
        background: #f15353 !important;
      }
    }
  }

  .empty-placeholder {
    width: 100%;
    height: 3.2rem;
  }
  .all-handler {
    width: 100%;
    height: 3.2rem;
    padding: 0.65rem;
    background: #fff;
    border-top: 0.0625rem solid #e1e1e1;
    position: fixed;
    bottom: 0;
    z-index: 99;
    display: flex;
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
    .check-all {
      display: flex;
      .icon-all_select_active {
        font-size: 1.2rem;
        color: #c4c4c4;
      }
      .activeIcon {
        color: #f15353;
      }
    }
    .btns {
      flex: 1;
      display: flex;
      font-size: 0.8rem;
      justify-content: space-evenly;
      .btn {
        color: #f15353;
        padding: 0.2rem 0.5rem;
        border: 1px solid #f15353;
        border-radius: 0.825rem;
      }
    }
    .btn-active {
      color: #ffffff !important;
      background-color: #f15353;
    }
    .complete {
      color: #f15353;
    }
  }
}
.pcStyle {
  width: 375px !important;
  left: 50%;
  transform: translateX(-50%);
}
</style>