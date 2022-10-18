<!-- 我的拼团组件 -->
<template>
  <div id="mygroups">
    <c-title :hide="false" :text="customTitle"></c-title>
    <div class="content">
      <div class="headTop" v-if="is_frequency == 1">
        <div class="imgbox">
          <img :src="member.avatar_image" alt="" />
        </div>
        <div class="rightBox">
          <div>{{ member.nickname }}</div>
          <div>剩余开团次数：{{ frequency ? frequency : 0 }}</div>
        </div>
      </div>
      <van-tabs v-model="activeName" @change="getData" sticky>
        <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
          <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
            <div class="list_box" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
              <div class="list" v-for="(item, index) in dataList[ind].list" :key="index">
                <template v-if="pluginName == 'MyGroups'">
                  <!-- 拼团插件 -->
                  <div class="store-box" v-if="item.has_one_store && item.has_one_store.id" @click.stop="gotoUrl('o2oStore_v2', { store_id: item.has_one_store.id, fromHome: 1 })">
                    <img :src="item.has_one_store.thumb" alt="" />
                    <div class="store-name">{{ item.has_one_store.store_name }}</div>
                    <i class="iconfont icon-advertise-next"></i>
                  </div>
                  <div class="time_state">
                    <span class="time">开团:{{ item.has_one_team.start_time | startTimes }}</span>
                    <span class="state" v-if="activeName == 0">拼单中,还差{{ item.has_one_level.member_num - item.has_one_team.has_many_success_member_count }}人</span>
                    <span class="state" v-if="activeName == 1"
                      >拼团成功 <em v-if="item.is_win">({{ item.is_win == 1 ? "抽中" : "未抽中" }})</em></span
                    >
                    <span class="state" v-if="activeName == 2">拼团失败</span>
                  </div>
                  <div class="goods_box">
                    <div class="goods_img">
                      <img :src="!fun.isTextEmpty(item.has_one_goods) ? item.has_one_goods.thumb : ''" />
                    </div>
                    <ul class="goods_name">
                      <li class="name_price">
                        <h2 class="name" style="-webkit-box-orient: vertical;">
                          {{ item.has_one_goods ? item.has_one_goods.title : "" }}
                        </h2>
                      </li>
                      <li class="option">
                        <span>{{ $i18n.t("money") }}{{ item.total_price }}</span>

                        <span style="color: #000;">
                          <van-count-down :time="fun.getTimeDifference(item.has_one_team.end_time)" class="bottom_time" format="DD天HH时mm分ss秒" @finish="groupEnd"></van-count-down>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div class="allbt">
                    <button type="button" @click="gotoUrl('groupDetail', { order_id: item.order_id, orderType: 'groups' })">
                      订单详情
                    </button>
                    <button type="button" @click="gotoGroup(item)">
                      拼团详情
                    </button>
                  </div>
                </template>
                <template v-if="pluginName == 'zhpMyGroups'">
                  <!-- 珍惠拼拼团抽奖 -->
                  <div class="time_state">
                    <span class="time">参团:{{ item.created_at }}</span>
                    <span class="state" v-if="activeName != 0">{{ titleArr[ind] }}</span>
                  </div>
                  <div class="goods_box">
                    <div class="goods_img">
                      <img :src="item.thumb || ''" />
                    </div>
                    <ul class="goods_name">
                      <li class="name_price">
                        <h2 class="name" style="-webkit-box-orient: vertical;">
                          {{ item.goods_title || "" }}
                        </h2>
                      </li>
                      <li class="option">
                        <span>{{ $i18n.t("money") }}{{ item.order_price }}</span>
                        <span style="color: #000;" v-if="activeName == 0">
                          <van-count-down :time="fun.getTimeDifference(item.lottery_time)" class="bottom_time" format="DD天HH时mm分ss秒" @finish="groupEnd"></van-count-down>
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div class="allbt">
                    <!-- <div class="botton-Popover" @click.stop="showPopover(index)" v-if="activeName == 1 && item.nex_lottery == 0">
                      更多
                      <div class="botton-Popover-main" v-if="item.showPopover">
                        <template v-if="item.nex_lottery == 0">
                          <button type="button" @click="groupBtn(0, item.id)">
                            继续参团
                          </button>
                          <button type="button" @click="groupBtn(1, item.id)">
                            退出参团
                          </button>
                        </template>
                      </div>
                    </div> -->
                    <template v-if="activeName == 1">
                      <button type="button" v-if="item.nex_lottery == 0" @click="groupBtn(0, item.id)" >
                        继续参团
                      </button>
                      <button type="button" v-if="item.nex_lottery == 0" @click="groupBtn(1, item.id)">
                        退出参团
                      </button>
                      <button type="button" v-if="item.barter_status == 1">
                        已易兑
                      </button>
                      <button type="button" v-if="item.barter_status == 0" @click="zhpYh(item.id)">
                        易兑
                      </button>
                      <button type="button" v-if="item.barter_status == 0" @click="zhpSendAction(item.id)">
                        发货
                      </button>
                    </template>
                    <button type="button" @click="gotoUrl('orderdetail', { order_id: item.order_id, orderType: 'zhpGroup' })">
                      订单详情
                    </button>
                    <!-- <button type="button" @click="gotoUrl('zhpgroupDetail', { id: item.group_id })">
                      参团详情
                    </button> -->
                    <button type="button" v-if="item.refund_button" @click="cancelTap(item.id)">
                      退出拼团
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <yz-blank :datas="dataList[ind] && dataList[ind].list"></yz-blank>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>

    <van-popup v-model="yhShow" round position="center" style="width: 80%;">
      <div class="boxYh">
        <div style="margin-bottom: 1rem;">易货兑换</div>
        <div style="margin-bottom: 0.5rem;">是否确认易货兑换</div>
        <span style="margin-bottom: 0.5rem;">订单编号：{{ barter_order_sn }}</span>
        <span style="margin-bottom: 0.5rem;">可易货兑换{{ barter_value }}{{ barter_plugin_name }}</span>
        <div class="boxYhbtn">
          <div class="cancelBtn" @click="cancelyh">取消</div>
          <div class="submitBtn" @click="submityh(0)">兑换</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import mygroups_controller from "./mygroups_controller";

export default mygroups_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#mygroups {
  .content {
    .headTop {
      display: flex;
      align-items: center;
      padding: 1rem 1.3rem;
      background-color: #fff;

      .imgbox {
        width: 3rem;
        height: 3rem;
        border-radius: 100%;
        background-color: chocolate;

        img {
          width: 100%;
          height: 100%;
          border-radius: 100%;
        }
      }

      .rightBox {
        flex: 1;
        text-align: left;
        margin-left: 0.4rem;
        margin-bottom: 0.6rem;
      }
    }

    .list_box {
      min-height: 100vh;

      .list {
        background: #fff;
        margin-top: 0.625rem;

        .store-box {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.875rem 0;
          text-align: left;
          color: #333;

          img {
            width: 1.875rem;
            height: 1.875rem;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 0.5rem;
          }

          .store-name {
            flex: 1;
            font-size: 0.75rem;
          }
        }

        .time_state {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.875rem;

          .state {
            color: #f15353;
          }
        }

        .goods_box {
          // background: #fafafa;
          border-top: solid 0.0625rem #ebebeb;
          padding: 0.625rem 0.875rem;
          display: flex;

          .goods_img {
            width: 5.625rem;
            height: 5.625rem;
            overflow: hidden;
            background: #f2f2f2;
            border-radius: 0.25rem;
            margin-right: 0.625rem;

            img {
              width: 100%;
            }
          }

          .goods_name {
            width: 15.4375rem;
            position: relative;

            .name_price {
              display: flex;
              justify-content: space-between;

              .name {
                width: 100%;
                font-size: 14px;
                line-height: 1.25rem;
                max-height: 2.5rem;
                text-align: left;
                font-weight: normal;
                text-overflow: ellipsis;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }

              .price {
                font-size: 14px;
                text-align: right;
                line-height: 1.25rem;

                span {
                  color: #8c8c8c;
                }
              }
            }

            .option {
              width: 100%;
              display: flex;
              justify-content: space-between;
              color: #f15353;
              font-size: 14px;
              margin-top: 0.625rem;
              text-align: left;
              position: absolute;
              bottom: 0.625rem;
            }
          }
        }

        .all_price {
          height: 2.5rem;
          line-height: 2.5rem;
          padding: 0 0.875rem;
          text-align: right;
          font-size: 14px;
          font-weight: normal;

          span {
            font-weight: bold;
            font-size: 18px;
          }
        }

        .allbt {
          border-top: solid 0.0625rem #ebebeb;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0.5rem 0.3rem 0 0;
          flex-wrap: wrap;

          button {
            border-radius: 0.1875rem;
            border: solid 0.0625rem #666;
            font-size: 12px;
            padding: 0.25rem 0.625rem;
            margin-left: 0.625rem;
            margin-bottom: 0.5rem;
            flex-shrink: 0;
          }

          .botton-Popover {
            border-radius: 0.1875rem;
            border: solid 0.0625rem #666;
            font-size: 12px;
            padding: 0.25rem 0.625rem;
            margin-left: 0.625rem;
            margin-bottom: 0.5rem;
            flex-shrink: 0;
            position: relative;

            .botton-Popover-main {
              position: absolute;
              width: 80px;
              height: auto;
              border: 1px solid #e2e2e2;
              display: flex;
              flex-direction: column;
              bottom: 32px;
              background: #fff;
              border-radius: 4px;
              transform: translateX(-50%);
              left: 50%;

              button {
                margin: 0 auto;
                border: none;
                border-bottom: 1px solid #e2e2e2;
                width: 80%;
                padding: 0.25rem 0;
              }

              button:last-child {
                border: none;
              }
            }

            .botton-Popover-main::before {
              content: "";
              width: 0;
              height: 0;
              bottom: 0;
              left: 50%;
              margin-bottom: -12px;
              margin-left: -6px;
              position: absolute;
              border: 6px solid;
              border-color: #e2e2e2 transparent transparent;
            }
          }
        }
      }
    }
  }
}

.boxYh {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  border-radius: 1rem;
  padding: 1rem 0;

  .boxYhbtn {
    display: flex;
    align-items: center;
    justify-content: center;

    .cancelBtn {
      color: #f15353;
      padding: 0.25rem 1rem;
      border-radius: 0.3rem;
      border: 1px solid #f15353;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }

    .submitBtn {
      margin-left: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f15353;
      color: #fff;
      padding: 0.25rem 1rem;
      border-radius: 0.3rem;
    }
  }
}
</style>
