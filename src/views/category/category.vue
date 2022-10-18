<template>
  <div id="category" :class="[fun.isIphoneX() ? 'iphoneXStyle' : '']">
    <!-- <c-title :hide="true" text=''></c-title> -->
    <div class="search-box">
      <div class="search-content" style="height: 4.2vh;" @click="gotosearch">
        <i class="iconfont icon-sousuo1"></i>
        {{ $i18n.t("category.搜索商品") }}
      </div>
    </div>
    <div id="category-content" ref="menucontent" v-if="!fun.isTextEmpty(list)" :style="{ overflow: this.category_template == '01' || category_template == '04' ? 'hidden' : 'scroll' }">
      <div id="err" v-if="err">{{ $i18n.t("category.未检测到子分类数据") }}!</div>

      <div class="goodsList" ref="goodsWrapper" style="overflow: hidden; height: 92vh;" v-if="!err && (category_template == '02' || category_template == '03')">
        <div>
          <c-carcontent hide="true" :list="contentlist_one" v-if="category_template == '02'"> </c-carcontent>
          <c-carcontent4 hide="true" :list="contentlist_one" :parentTitle="parentTitle" @bindOneCategory="bindOneCategory" v-if="category_template == '03'"> </c-carcontent4>
          <span id="loadMore" style="display: inline-block; width: 100%; height: 5rem;"></span>
        </div>
      </div>

      <div id="carcontent2" v-if="!err && (category_template == '01' || category_template == '04')">
        <div class="branch" ref="imgBox" v-show="!fun.isTextEmpty(ADImg)">
          <a :href="ADUrl | href_filters">
            <img style="width: 100%; max-height: 40vh;" :src="ADImg" />
          </a>
        </div>
        <!-- 分类下拉框 -->
        <div class="catagoryBox">
          <van-collapse v-model="activeName" :border="false">
            <van-collapse-item name="1">
              <div slot="title" class="activetitle">
                <!-- 自定义标题 -->
                <dl v-show="!fun.isTextEmpty(showTitle)">
                  <dt v-for="(o, index) in showTitle" :key="index" :class="o.id == secondaryId ? 'addClass' : 'removeClass'" @click.stop="clickActive(o)">{{ o.name }}</dt>
                </dl>
                <span v-show="fun.isTextEmpty(showTitle)">{{ $i18n.t("category.选择分类") }}</span>
              </div>
              <div style="overflow-y: scroll; max-height: 32vh;">
                <dl>
                  <dt v-for="(Secondary, index) in list.recommend" :key="index" :class="Secondary.id == secondaryId ? 'addClass1' : 'removeClass1'" @click.stop="chooseSecondary(Secondary)">
                    {{ Secondary.name }}
                  </dt>
                  <dt v-show="isCategoryMore" @click.stop="getMoreData_1(0)" class="more-btn-class">查看更多<i class="iconfont icon-member-bottom"></i></dt>
                </dl>
                <template v-if="list.set.cat_level == '3' && !fun.isTextEmpty(threeInfo)">
                  <p class="threeTitle">{{ $i18n.t("category.三级分类") }}</p>
                  <dl>
                    <dt v-for="(three, indexs) in threeInfo" :key="indexs" :class="three.id == threeId ? 'addClass1' : 'removeClass1'" @click="chooseThree(three.id)">{{ three.name }}</dt>
                  </dl>
                </template>
              </div>

              <p v-if="fun.isTextEmpty(list.recommend)">{{ $i18n.t("category.暂无其他分类") }}</p>
            </van-collapse-item>
          </van-collapse>
        </div>

        <div class="goodsList" ref="goodsWrapper" style="overflow: hidden;">
          <div class="coverLayer" v-if="this.activeName == '1'" @click="change"></div>
          <div>
            <div class="goodWrapper" :style="{ backgroundColor: category_template == '01' ? '#fff' : '#f4f4f4' }" v-if="!this.fun.isTextEmpty(foodInfo)">
              <div class="list" :class="`category_template${category_template}`" v-for="(good, indexs) in foodInfo" :key="indexs" @click="gotoGoods(good.goods_id, good)">
                <div class="img">
                  <img :src="good.thumb" />
                </div>
                <li class="goods-info">
                  <ul class="info-class">
                    <li class="info_a" style="-webkit-box-orient: vertical;">
                      <div class="goods-title">{{ good.title | escapeTitle }}</div>
                      <div class="goods-label-box">
                        <span class="goods-label" v-for="(labelItem) in good.label_list" :key="labelItem.id">{{labelItem.name}}</span>
                      </div>
                    </li>
                    <li class="info_b">{{ $i18n.t("category.已售") }}{{ good.show_sales + good.virtual_sales }}{{ good.sku }}</li>
                    <li class="info_c">
                      <template v-if="good.point_goods">
                        <span class="price" style="color: #ff9500;">
                          <small>{{
                            good.has_option == 1
                              ? !good.point_goods.max_point || good.point_goods.min_point == good.point_goods.max_point
                                ? good.point_goods.min_point
                                : good.point_goods.min_point + "-" + good.point_goods.max_point
                              : good.point_goods.min_point
                          }}</small
                          ><small>{{ integral }}</small>
                        </span>
                      </template>
                      <template v-else>
                        <span class="price" v-show="!good.has_option"
                          ><small>{{ $i18n.t("money") }}</small
                          >{{ good.vip_level_status && good.vip_level_status.status == 1 ? good.vip_level_status.word : good.price }}</span
                        >
                        <span class="price" v-show="good.has_option && (!good.vip_level_status || good.vip_level_status.status == 0)"
                          ><small>{{ $i18n.t("money") }}</small>
                          <small>{{ good.min_price }}</small>
                        </span>
                      </template>
                      <span class="price" v-if="good.has_option && good.vip_level_status && good.vip_level_status.status == 1"
                        ><small>{{ $i18n.t("money") }}</small>
                        {{ good.vip_level_status.word }}
                      </span>
                      <template v-if="category_template != '04' && good.is_special != 1">
                        <!--good.is_special 特殊商品加入购物车隐藏-->
                        <div class="select" v-if="good.has_option != 1 && good.plugin_id != 40">
                          <transition name="fade">
                            <i v-if="goodsCarts[good.id]" class="iconfont icon-life-game-sign" @click.stop="numberLeft(good.id)"></i>
                          </transition>
                          <input
                            type="tel"
                            title="number"
                            v-if="goodsCarts[good.id] && !goodsCarts[good.id].option_str"
                            @click.stop
                            v-model.lazy="goodsCartsTotal[good.id].total"
                            @focus="clickCount(goodsCartsTotal[good.id].total)"
                            @blur="changeCount(goodsCarts[good.id].id, goodsCartsTotal[good.id].total, 0, good)"
                          />
                          <span v-if="goodsCarts[good.id] && goodsCarts[good.id].option_str" @click.stop>{{ goodsCartsTotal[good.id].total }}</span>
                          <i @click.stop="numberRight(good.id, good.stock, good)" class="iconfont icon-life-game-plus"></i>
                        </div>
                        <!-- 分类页返回了plugin_id:0||商城商品，plugin_id：40||租赁，plugin_id：92||供应商商品 140卡券商品-->
                        <div class="select optionClass leaseBox" v-if="good.has_option == 1 && good.plugin_id != 40 && good.plugin_id != 140">
                          <p @click.stop="addGood(good)">{{ $i18n.t("category.选规格") }}</p>
                          <i v-if="!fun.isTextEmpty(goodsCartsTotal[good.id])">{{ goodsCartsTotal[good.id].total }}</i>
                        </div>
                        <span class="select leaseBox" v-if="good.plugin_id == 40">
                          {{ $i18n.t("category.去租赁") }}
                        </span>
                      </template>
                      <template v-if="category_template == '04'">
                        <div class="select">
                          <i class="iconfont icon-life-game-plus"></i>
                        </div>
                      </template>
                    </li>
                    <div class="price" v-show="good.is_open_micro == 1" style="font-size: 0.75rem;">
                      会员价:{{ $i18n.t("money") }}{{ good.price_level == 1 ? good.vip_price : good.vip_next_price }}
                    </div>
                  </ul>
                </li>
              </div>
              <div class="space">{{ LoadMoreTest }}</div>
            </div>
            <div v-if="this.fun.isTextEmpty(foodInfo)">
              <img src="../../assets/images/no-more-product.png" alt="" style="width: 5rem; margin-top: 6rem;" />
            </div>
            <span id="loadMore" style="display: inline-block; width: 100%; height: 5rem;"></span>
          </div>
        </div>
      </div>
    </div>
    <div id="rootlists" ref="menu">
      <ul id="rootList" v-if="onelist">
        <li @click="bpfun" v-if="brandShow == '0'">
          <span>{{ $i18n.t("category.推荐品牌") }}</span>
        </li>
        <li @click="allList" v-if="categoryShow == '0'" :class="{ active: active2 }">
          <span>{{ $i18n.t("category.推荐分类") }}</span>
        </li>
        <li v-for="(item, index) in onelist" :key="index" :class="{ active: active == index }" @click="tabsa(index, item)">
          <span>{{ item.name }}</span>
        </li>
        <div style="height: 3.125rem;"></div>
      </ul>
    </div>
    <!--选规格-->
    <van-popup v-model="show2" round position="center">
      <div class="spec_box q5" :style="{ width: fun.getPhoneEnv() == 3 ? '375px' : '' }">
        <h3>
          {{ popTitle }}
          <i @click.stop="close" class="iconfont icon-close11"></i>
        </h3>
        <div style="height: 2.5rem;"></div>
        <div class="spec_a">
          <div v-for="(spec, i) in goodsInfo.has_many_specs" :key="i">
            <h5>{{ spec.title }}：</h5>
            <ul class="option">
              <li @click.stop="selectSpecs(item, item.id)" v-for="(item, i) in spec.has_many_specs_item" :key="i" :class="specid.indexOf(item.id) >= 0 ? 'cur' : ''">
                {{ item.title }}
              </li>
            </ul>
          </div>
        </div>
        <div style="height: 3.4375rem;"></div>
        <div class="add_car">
          <ul class="car_btn">
            <li class="left" v-if="goodsInfo.point_goods">
              {{ popPrice }}<span>{{ integral }}</span>
            </li>
            <li class="left" v-else>
              <div class="good-price">
                <span>{{ $i18n.t("money") }}</span
                >{{ popPrice }}
              </div>
              <div class="vip-price" v-if="isMultiSpecs">
                <van-loading class="m-l-w6" size="16" color="#fdbc2e" v-show="specsVIPPrc == 0" />
                <span class="m-l-w6" v-show="specsVIPPrc">&nbsp;会员价: {{ $i18n.t("money") }}{{ specsVIPPrc }} </span>
              </div>
            </li>
            <li class="right">
              <span v-show="!popNum && popStock >= 1" @click.stop="submitAction">{{ $i18n.t("category.加入购物车") }}</span>
              <span v-show="popStock <= 0" style="background: #999;">库存不足</span>
            </li>
            <div class="Box" v-show="popNum >= 1">
              <i class="iconfont icon-store_reduceLine" @click.stop="changeCount(popCard.id, popNum - 1, -1)"></i>
              <label class="show">{{ popNum }}</label>
              <i class="iconfont icon-store_plus" @click.stop="changeCount(popCard.id, popNum + 1, 1)"></i>
            </div>
          </ul>
        </div>
      </div>
    </van-popup>
    <div style="height: 2.8125rem;"></div>
  </div>
</template>

<script>
import category from "./category_controller";
export default category;
</script>

<style lang="scss" rel="stylesheet/scss">
#category {
  .van-collapse::after {
    border: none;
  }

  .catagoryBox {
    .van-cell__title {
      overflow: hidden;
    }
  }
}

/* 增加底部适配层 */
.iphoneXStyle #category-content,
#rootlists {
  padding-bottom: 24px;
}

#rootlists {
  overflow: hidden;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/css/category.scss";

#category {
  #rootlists,
  #category-content {
    height: 92vh;
  }

  .spec_box {
    background: #fff;
    width: 20.625rem;
    height: 24.375rem;
    border-radius: 0.625rem;
    padding-bottom: 3.4375rem;

    h3 {
      border-radius: 0.625rem 0.625rem 0 0;
      width: 100%;
      background-color: #fff;
      line-height: 2.75rem;
      border-bottom: solid 0.0625rem #ebebeb;
      font-size: 16px;
      overflow: hidden; /* 超出部分隐藏 */
      text-overflow: ellipsis; /* 超出部分显示省略号 */
      white-space: nowrap; /* 规定段落中的文本不进行换行 */
      padding-right: 15%;
      padding-left: 5%;
      text-align: left;
      position: absolute;
      top: 0;

      i {
        position: absolute;
        right: 0.875rem;
        line-height: 2.75rem;
        color: #999;
        font-size: 1.125rem;
      }
    }

    .spec_a {
      margin-top: 0.625rem;
      background: #fff;
      height: 17.375rem;
      overflow-y: scroll;
      position: absolute;
      top: 2.5rem;

      h5 {
        display: block;
        line-height: 2.5rem;
        text-align: left;
        padding-left: 1.25rem;
      }

      .option {
        display: flex;
        padding: 0 1.25rem;
        flex-wrap: wrap;

        .cur {
          border: solid 0.0625rem #f15353;
          background: #faf0f0;
        }

        li {
          padding: 0 6px;
          min-height: 1.875rem;
          line-height: 1.875rem;
          margin-right: 0.625rem;
          margin-bottom: 0.625rem;
          background: #f5f5f5;
          border: solid 0.0625rem #ebebeb;
          border-radius: 0.1875rem;
        }
      }
    }

    .add_car {
      width: 100%;
      height: 3.4375rem;
      line-height: 3.4375rem;
      background-color: #fff;
      border-top: solid 0.0625rem #ebebeb;
      position: absolute;
      bottom: 0;
      border-radius: 0 0 0.625rem 0.625rem;

      .car_btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.875rem;
        height: 100%;

        .left {
          color: #f15353;
          font-size: 16px;
          text-align: left;
          flex: 0 0 13rem;
          display: flex;
          flex-direction: column;
          align-items: center;

          .good-price,
          .vip-price {
            width: 100%;
          }

          .good-price {
            line-height: 1.25rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .vip-price {
            line-height: 1rem;
            font-size: 12px;
            color: #fdbc2e;
          }

          span {
            font-size: 12px;
          }
        }

        .right span {
          display: block;
          width: 5.5625rem;
          height: 1.875rem;
          line-height: 1.875rem;
          border-radius: 1rem;
          background: #f15353;
          color: #fff;
          font-size: 14px;
        }

        .Box {
          position: absolute;
          bottom: 0.625rem;
          right: 0.625rem;
          display: flex;

          i {
            width: 28px;
            height: 1.75rem;
            line-height: 1.75rem;
            font-size: 26px;
            color: #f15353;
          }

          .icon-store_reduceLine {
            color: #aaa;
          }

          label {
            right: 2.1875rem;
            color: #333;
            font-size: 12px;
            padding: 0;
            width: 1.5rem;
            height: 1.75rem;
            overflow: hidden;
            display: inline-block;
            text-align: center;
            line-height: 1.75rem;
            vertical-align: top;
            background-origin: content-box;
            background-color: transparent;
          }
        }
      }
    }
  }

  #carcontent2 {
    color: #686868;
    margin-bottom: 3.75rem;
    margin-top: 3%;
    display: flex;
    flex-direction: column;
    height: 100%;

    .branch {
      margin: 0 8px;

      a {
        display: inline-block;
        height: 100%;

        img {
          border-radius: 0.5rem;
          overflow: hidden;
        }
      }
    }

    .catagoryBox {
      // overflow: hidden;
      position: relative;
      height: 2.8125rem;
      z-index: 999;

      .threeTitle {
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: left;
      }

      dl {
        display: flex;
        flex-wrap: wrap;

        dt {
          font-size: 0.75rem;
          height: 1.125rem;
          line-height: 1.125rem;
          padding: 0 0.5rem;
          border: dashed 0.0625rem rgb(229, 229, 229);
          border-radius: 0.25rem;
          margin-right: 0.625rem;
          margin-bottom: 0.625rem;
        }

        .addClass {
          border: dashed 0.0625rem #fb4a4a;
          color: #fb4a4a;
        }

        .addClass1 {
          border: none;
          color: #fff;
          background: #fb5050;
          border-radius: 0.875rem;
        }

        .removeClass1 {
          border: none;
        }

        .more-btn-class {
          background: transparent;
          border: none;
          color: #fb5050;
          display: flex;
        }
        // dt:first-of-type {
        //   margin-left: 0;
        // }
      }

      .activetitle {
        overflow-x: auto;

        dl {
          flex-wrap: nowrap;

          dt {
            flex-shrink: 0;
            margin-bottom: 0;
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }

    .goodsList {
      background: #fff;
      position: relative;
      flex: 1;

      .coverLayer {
        //遮盖层
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        z-index: 99;
      }

      .goodWrapper {
        height: 100%;
        padding: 0 0.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }

      .goodWrapper::after {
        display: block;
        background: transparent;
        content: " ";
        width: 100%;
        height: 3.625rem;
      }

      .space {
        width: 100%;
        height: 8.625rem;
        margin-top: 0.5rem;
      }

      .category_template01 {
        display: flex;
        padding: 0.125rem 0;
        width: 100%;
        border-bottom: solid 0.0625rem #f2f2f7;

        .img {
          width: 4.375rem;
          height: 4.375rem;
          border-radius: 0.375rem;
          overflow: hidden;
          // margin-right: 0.625rem;
          img {
            width: 100%;
          }
        }

        .goods-info {
          padding-left: 0.625rem;

          .info-class .info_c .select i {
            width: 1.25rem;
            height: 1.25rem;
            line-height: 1.25rem;
            font-size: 14px;
          }
        }
      }

      .category_template04 {
        width: 49%;
        background: #fff;
        margin-top: 0.625rem;
        border-radius: 0.5rem;
        overflow: hidden;

        .img {
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          position: relative;

          img {
            width: 100%;
            right: 0;
            height: 100%;
            position: absolute;
          }
        }

        .goods-info {
          padding: 0.25rem;

          .info-class .info_c .select i {
            font-size: 10px;
            width: 1rem;
            height: 1rem;
            line-height: 1rem;
          }
        }
      }

      .goods-info {
        flex: 1;
        text-align: left;

        .info-class {
          .info_a {
            margin-bottom: 0.25rem;
            .goods-title {
              line-height: 1rem;
              font-size: 0.75rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              color: #000;
            }
            .goods-label-box {
              margin: 0.5rem 0;
              max-height: 30px;
              text-align: left;
              font-size: 12px;
              color: rgb(136, 136, 136);
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              word-break: break-all;
              .goods-label {
                margin-right: 6px;
              }
            }
          }

          .info_b {
            color: #999;
            // line-height: 1.25rem;
            // margin-bottom: 0.125rem;
            // text-decoration: line-through;
            font-size: 0.625rem;
          }

          .info_c {
            display: flex;
            justify-content: space-between;
            height: 1.25rem;
            align-items: center;

            .price {
              color: #f15353;
              font-size: 0.75rem;
              flex: 1;
              font-weight: bold;
              line-height: 1.5rem;
              overflow: hidden; /* 超出部分隐藏 */
              text-overflow: ellipsis; /* 超出部分显示省略号 */
              white-space: nowrap; /* 规定段落中的文本不进行换行 */
              small {
                font-size: 0.625rem;
              }
            }

            .standard {
              button {
                height: 1.25rem;
                width: 2.5rem;
                background-color: #f15353;
                border: none;
                border-radius: 0.75rem;
                color: #fff;
              }
            }

            .select {
              display: flex;

              span {
                outline: none;
                border: none;
                display: inline-block;
                width: 1.25rem;
                height: 1.25rem;
                line-height: 1.25rem;
                font-size: 14px;
                text-align: center;
              }

              input {
                outline: none;
                border: none;
                display: inline-block;
                width: 1.25rem;
                height: 1.25rem;
                line-height: 1.25rem;
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
                text-align: center;
                border-radius: 0.75rem;
                color: #fff;
              }
            }

            .leaseBox {
              padding: 0 0.5rem;
              background: #f15353;
              color: #fff;
              line-height: 1.25rem;
              height: 1.25rem;
              border-radius: 1rem;
              font-size: 12px;

              p {
                font-size: 0.75rem;
              }
            }

            .optionClass {
              position: relative;

              i {
                width: 1rem;
                height: 1rem;
                line-height: 1rem;
                font-size: 12px;
                position: absolute;
                top: -8px;
                right: -5px;
                background-color: #ff5d5c !important;
              }
            }
          }
        }
      }
    }
  }
}
</style>
