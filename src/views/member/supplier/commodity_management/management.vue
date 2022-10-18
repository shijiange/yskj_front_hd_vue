<template>
  <section id="goods-manage">
    <c-title :hide="false" text='商品管理'></c-title>
    <van-search v-model="goods_search" placeholder="请输入商品名称"
    @search="onSearch"
    @cancel="onCancel" />
    <section id="release-goods">
      <div class="release-a">
        <van-icon class="iconfont icon-block" style="transform: translateY(2px);" color="#f15353" size="1.5rem"></van-icon>
      </div>
      <span>商品数量：{{goods_length}}</span>
      <div class="release-b" @click="routeTake()">
        <span>发布商品</span>
      </div>
    </section>
    <section id="goods-list">
      <div class="goods-list" v-for="(item,index) in commodity_data" :key="index">
        <div class="goods-a">
          <img style="width: 100%; height: 100%;" :src="item.change_thumb">
        </div>
        <ul class="goods-b">
          <li class="name">
            <span class="goods-title">{{item.title|escapeTitle}}</span>
          </li>
          <li class="status" v-if="type==='store'" :class="item.status===1?'red':'gray'">状态：{{item.status === 1 ?'上架':'下架'}}</li>
          <li class="price">
            <span>
              {{$i18n.t('money')}} <span style="font-size: 16px;">{{item.price}}</span>
            </span>
            <p v-if="type ==='store' && goods_audit!= 1" :class="item.status===0?'red':'gray'" @click.stop="changeGoodsStatus(item,index)"><span>点击</span>{{item.status === 0 ?'上架':'下架'}}</p>
            <p v-if="type !=='store' && goods_audit!= 1" :class="item.status===1?'red':'gray'" @click.stop="changeGoodsStatus(item,index)">{{item.status === 1 ?'上架':'下架'}}</p>
          </li>
          <li class="info">
            <font>库存：{{item.stock}}</font>
            <font>销量：{{item.virtual_sales ? item.virtual_sales+item.real_sales : item.real_sales}}</font>
            <span @click="moreEvent(index)">
						<van-icon class="iconfont icon-more" custom color="#c9c9c9" size="1.5rem"></van-icon>
						</span>
            <div class="more" v-show="item.edit_active">
              <ul>
                <li @click="editJumpEvent(index)">
                  <van-icon class="iconfont icon-edit" custom color="#fff" size="1.125rem"></van-icon>
                  <span>编辑</span>
                </li>
                <li @click="commodityDelete(index)">
                  <van-icon class="iconfont icon-delete" custom color="#fff" size="1.125rem"></van-icon>
                  <span>删除</span>
                </li>
              </ul>
              <div class="icon">
                <van-icon class="iconfont icon-down" custom size="1.5rem"></van-icon>
              </div>
            </div>
          </li>

        </ul>
      </div>
    </section>
  </section>
</template>

<script>
import manage from "./management_controller.js";

export default manage;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #goods-manage {
    #search-box {
      background-color: #fff;
      display: flex;
      height: 2.8125rem;
      line-height: 2.8125rem;
      position: relative;
      padding-left: 1.25rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .search-a {
        background-color: #f2f2f2;
        height: 1.75rem;
        line-height: 1.75rem;
        border-radius: 0.875rem;
        display: flex;
        padding: 0 0.875rem;
        margin-top: 0.5313rem;
        width: 18.75rem;

        input {
          border: none;
          width: 90%;
          margin-left: 0.625rem;
        }
      }

      .search-b {
        width: 2.8125rem;
        height: 2.8125rem;
        position: absolute;
        right: 0;
      }
    }

    #release-goods {
      background-color: #fff;
      display: flex;
      font-size: 16px;
      position: relative;
      height: 3rem;
      line-height: 3rem;
      border-bottom: solid 0.0625rem #ebebeb;

      .release-a {
        width: 3rem;
        height: 3rem;
      }

      .release-b {
        position: absolute;
        right: 0.875rem;
        top: 0.6875rem;
        font-size: 14px;
        background-color: #f15353;
        height: 1.625rem;
        line-height: 1.625rem;
        padding: 0 0.625rem;
        display: block;
        border-radius: 0.8125rem;
        color: #fff;
      }
    }

    #goods-list {
      .goods-list {
        background-color: #fff;
        padding: 0.625rem 0;
        display: flex;
        border-bottom: solid 0.0625rem #ebebeb;

        .goods-a {
          width: 6rem;
          height: 6rem;
          background-color: #ccc;
          margin-left: 0.625rem;
        }

        .goods-b {
          margin: 0 0.875rem;
          width: 16.0625rem;
          text-align: left;
          line-height: 1.25rem;

          .status {
            font-size: 10px;
          }

          .red {
            color: #f15353;
          }

          .gray {
            color: #8c8c8c;
          }

          .name {
            height: 2.5rem;
            font-size: 14px;

            .goods-title {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }

          .price {
            color: #f15353;
            font-size: 16px;
            overflow: hidden;

            p {
              float: right;
              padding: 0.1rem 0.4rem;
              color: #fff;
              font-size: 12px;
              border-radius: 0.5rem;
            }

            .red {
              background: #f15353;
              border: 1px solid #f15353;
            }

            .gray {
              background: #8c8c8c;
              border: 1px solid #8c8c8c;
            }

            span {
              font-size: 12px;
            }
          }

          .info {
            position: relative;
            color: #8c8c8c;
            font-size: 12px;

            font {
              margin-right: 1.25rem;
            }

            .icon-more {
              position: absolute;
              right: 0;
              z-index: 2;
            }

            .more {
              background: rgba(51, 51, 51, 0.9);
              border-radius: 0.25rem;
              color: #f0f0f0;
              width: 5.5rem;
              position: absolute;
              right: 0;
              top: -2.75rem;

              ul {
                display: flex;
                justify-content: center;

                li {
                  flex: 1;
                  text-align: center;

                  i {
                    display: block;
                    margin-top: 0.125rem;
                  }
                }
              }

              .icon {
                position: absolute;
                right: 0;
                top: 2.05rem;

                i {
                  color: rgba(51, 51, 51, 0.9);
                }
              }
            }
          }
        }
      }

      .goods-list:last-child {
        border: none;
      }
    }
  }
</style>
