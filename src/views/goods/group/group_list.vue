<template>
  <!-- 拼团插件与珍惠拼插件 -->
  <div id="group_list">
    <c-title :hide="false" :text="diyTitle"></c-title>
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
        <div class="goods_box" v-for="(item, index) in info" :key="index">
          <template v-if="$route.name == 'GroupList' && item.has_one_goods">
            <div class="goods_img">
              <img :src="item.has_one_goods && item.has_one_goods.thumb" />
            </div>
            <ul class="goods_info">
              <li class="name" style="-webkit-box-orient: vertical;">
                {{ item.title }}
              </li>
              <li class="price" v-if="item.has_many_option_levels && item.has_many_option_levels.length > 0">
                <span>{{ $i18n.t("money") }}</span
                >{{ item.has_many_option_levels[0].group_price }}&nbsp;<span style="text-decoration: line-through;"
                  >{{ $i18n.t("money") }}{{ item.has_many_option_levels[0].has_one_fight_groups_option.option_price }}</span
                >
              </li>
              <group-list-popup :item='item' ></group-list-popup>
              <li class="number">
                <div class="left" v-if="item.has_many_option_levels && item.has_many_option_levels.length > 0">
                  <i class="iconfont icon-group_list"></i>
                  <span>{{ item.has_many_option_levels[0].member_num }}人</span>
                </div>

                <div class="go_group" @click="goGroup(item.id, item.store_id)">
                  <span>去开团</span>
                  <i class="fa fa-angle-right"></i>
                </div>
              </li>
            </ul>
          </template>
          <template v-if="$route.name == 'zhpGroupList'">
            <div class="goods_img">
              <img :src="item.thumb" />
            </div>
            <ul class="goods_info">
              <li class="name" style="-webkit-box-orient: vertical;">
                {{ item.title }}
              </li>
              <li class="price">
                <span>{{ $i18n.t("money") }}</span
                >{{ item.group_price }}&nbsp;<span style="text-decoration: line-through;" v-if="item.group_price < item.price" >{{ $i18n.t("money") }}{{ item.price }}</span>
              </li>
              <li class="number">
                <div class="left">
                  <i class="iconfont icon-group_list"></i>
                  <span>{{ item.member_count }}人</span>
                </div>

                <div class="go_group" @click="goGroup(item.id)">
                  <span>去参团</span>
                  <i class="fa fa-angle-right"></i>
                </div>
              </li>
            </ul>
          </template>
        </div>
      </van-pull-refresh>
    </div>
    <router-link v-if="this.$route.name == 'zhpGroupList'" class="order-fixed-btn-cw" tag="div" :to="fun.getUrl('zhpFinance', {})"><van-icon name="after-sale" size="20" />财务</router-link>
    <router-link v-if="this.$route.name == 'zhpGroupList'" class="order-fixed-btn" tag="div" :to="fun.getUrl('zhpMyGroups', {})"><i class="iconfont icon-dingdan1"></i>订单</router-link>
    <p v-if="this.info.length < 1" style="padding: 1rem 0; color: #f60;" @click="goHome">暂无拼团活动，去商城逛逛吧！</p>
  </div>
</template>

<script>
import group_list_controller from "./group_list_controller";

export default group_list_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#group_list {
  background: #fff;

  .content {
    padding-left: 0.625rem;

    .goods_box {
      display: flex;
      padding: 0.625rem 0.625rem 0.625rem 0;
      border-bottom: solid 0.0625rem #ebebeb;

      .goods_img {
        width: 7.5rem;
        height: 7.5rem;
        background: #f2f2f2;
        overflow: hidden;
        border-radius: 0.25rem;
        margin-right: 0.625rem;

        img {
          width: 100%;
        }
      }

      .goods_info {
        width: 14.0625rem;
        text-align: left;

        .name {
          font-size: 14px;
          line-height: 1.25rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .price {
          font-size: 16px;
          margin-top: 0.375rem;
          color: #f15353;

          span {
            font-size: 12px;
          }

          span:last-child {
            color: #8c8c8c;
            margin-left: 0.625rem;
          }
        }

        .number {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left {
            display: flex;
            align-items: center;

            .iconfont {
              font-size: 1.5rem;
              color: #f15353;
              margin-right: 0.375rem;
            }

            span {
              color: #f15353;
              font-size: 14px;
              border-left: solid 0.0625rem #ebebeb;
              padding-left: 0.375rem;
            }
          }

          .go_group {
            width: 5rem;
            height: 1.75rem;
            border-radius: 0.25rem;
            background: #f15353;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              color: #fff;
              font-size: 14px;
            }

            .fa {
              color: #fff;
              font-size: 1rem;
              margin-left: 0.625rem;
            }
          }
        }
      }
    }
  }

  .order-fixed-btn-cw {
    width: 2.5rem;
    height: 2.5rem;
    box-shadow: 0.047rem 0.081rem 0.156rem 0 rgba(209, 209, 209, 0.36);
    background-image: linear-gradient(#f14e4e, #f14e4e), linear-gradient(#fff, #fff);
    position: fixed;
    bottom: 6rem;
    right: 50%;
    transform: translateX(10rem);
    display: flex;
    justify-content: center;
    flex-direction: column;
    border-radius: 50%;
    color: #fff;
    font-size: 10px;
  }

  .order-fixed-btn {
    width: 2.5rem;
    height: 2.5rem;
    box-shadow: 0.047rem 0.081rem 0.156rem 0 rgba(209, 209, 209, 0.36);
    background-image: linear-gradient(#f14e4e, #f14e4e), linear-gradient(#fff, #fff);
    position: fixed;
    bottom: 3rem;
    right: 50%;
    transform: translateX(10rem);
    display: flex;
    justify-content: center;
    flex-direction: column;
    border-radius: 50%;
    color: #fff;
    font-size: 10px;
  }
}

.allteam {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;

  .allLeft {
    flex: 1;
    display: flex;
    overflow: hidden;

    .teamNo {
      color: #f15353;
      max-width: 55%;

      /* overflow: hidden; */

      /* text-overflow: ellipsis; */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .teamTwo {
      flex: 1;
    }
  }

  .allRight {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.open_group {
  background: #fff;
  padding: 0.625rem;
  border-radius: 0.5rem;

  p {
    font-size: 14px;
    margin-bottom: 0.625rem;
  }

  .icon_close {
    position: absolute;
    top: 0.25rem;
    right: 0;
    width: 2.5rem;
    height: 2.5rem;

    .iconfont {
      line-height: 2.5rem;
      font-size: 0.875rem;
      color: #999;
    }
  }
}
</style>
