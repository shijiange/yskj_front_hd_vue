<!-- 我的抢团 -->
<template>
  <div id="grab_group_my">
    <c-title :hide="false" :text="'我的抢团'"></c-title>
    <div class="top-member">
      <div class="info">
        <img :src="memberInfo.avatar_image" alt="" class="avator"/>
        <div class="info-left">
          <div class="name">{{ memberInfo.nickname }}</div>
          <div class="number">
            可发团次数
            <div class="info-left-total">{{ numberRounds }}</div>
          </div>
        </div>
      </div>
      <div class="recording">
        <i class="iconfont icon-qt_icon_record"></i>
        <div class="recording-text">中奖纪录</div>
        <div class="record-btn" @click.stop="gotoMyRecord">点击查看 <i class="iconfont icon-advertise-next"></i></div>
      </div>
    </div>

    <div class="content">
      <van-tabs v-model="activeName" @change="handleClick" sticky>
        <van-tab :name="ind" :title="items" v-for="(items, ind) in titleArr" :key="ind">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <div class="list_box" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
              <div class="list" v-for="child in dataList[ind].list" :key="child.order_id">
                <div class="time_state">
                  <span class="time">开团时间：{{ fun.timestampToTime(child.start_time) }}</span>
                  <span class="state">{{
                    activeName == 0 ? `抢团中,还差${child.surplus_number}人` : activeName == 1 ? "抢团成功" : "抢团失败"
                  }}</span>
                </div>
                <div class="goods_box">
                  <div class="goods_img">
                    <img :src="!fun.isTextEmpty(child.thumb) ? child.thumb : ''"/>
                  </div>
                  <ul class="goods_name">
                    <li class="name_price">
                      <h2 class="name" style="-webkit-box-orient: vertical;">{{ child.title }}</h2>
                    </li>
                    <li class="option">
                      <span class="total_price"
                      ><div class="small">{{ $i18n.t("money") }}</div>
                        {{ child.price }}</span
                      >
                    </li>
                  </ul>
                </div>
                <div class="allbt">
                  <template v-if="!fun.isTextEmpty(child.button_models)">
                    <div v-for="bottonChild in child.button_models" :key="bottonChild.value">
                      <button
                        type="button"
                        @click="operation(child.order_id, bottonChild, child.barter)"
                        v-if="activeName == 1 && bottonChild.name != '退款'"
                      >
                        {{ bottonChild.name }}
                      </button>
                    </div>
                  </template>
                  <button v-show="child.is_partake" type="button" @click="gotoOrderDetail(child.order_id)">
                    订单详情
                  </button>
                  <button type="button" @click="gotoGroup(child.leader_id)" class="groupDetail">
                    抢团详情
                  </button>
                </div>
              </div>
            </div>
            <template v-if="dataList[ind]">
              <yz-blank :datas="dataList[ind].list" text="暂无订单信息" :isBtn="false"></yz-blank>
            </template>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
    <van-dialog
      v-model="showBarter"
      title="易货兑换"
      show-cancel-button
      class="barter_dialog"
      @confirm="confirmBarter"
      @cancel="cancelBarter"
    >
      <div class="barter_dialog_1">是否确认易货兑换</div>
      <div class="barter_dialog_2">该商品可兑换易货值为{{ showBarter_value }}</div>
    </van-dialog>
  </div>
</template>

<script>
import cTitle from "components/title";
import { scrollMixin } from "utils/mixin";
import { Toast } from "vant";
import yzBlank from "../../../components/ui_components/yz_blank";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 0,
      titleArr: ["抢团中", "抢团中奖", "抢团失败"],
      dataList: [],
      isLoading: false,
      memberInfo: {},
      isLoadMore: true,

      showBarter: false,
      showBarter_value: null
    };
  },

  activated() {
    this.init();
    this.getData(true);
  },
  components: { cTitle, yzBlank },
  computed: {},
  methods: {
    init() {
      // this.activeName = 0
      this.dataList = [];
      this.isLoadMore = true;
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
    },
    handleClick() {
      this.getData(false);
    },
    onRefresh() {
      this.dataList[this.activeName].list = [];
      this.getData(false);
    },
    getData(tag) {
      $http
        .post("plugin.snatch-regiment.api.index.getSnatchData", { art: "myTeam", state: this.activeName + 1 }, "")
        .then(response => {
          if (response.result === 1) {
            this.isLoading = false;
            let that = this;
            if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
              that.isLoadMore = this.dataList[that.activeName].isLoadMore;
              return;
            }
            if (tag) {
              this.memberInfo = response.data.myTeam.member;
              this.numberRounds = response.data.myTeam.numberRounds;
            }
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.myTeam.list.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.myTeam.list.data);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //获取更多数据
    getMoreData() {
      const that = this;
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          art: "myTeam",
          state: that.activeName + 1
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.snatch-regiment.api.index.getSnatchData", _json, "").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.myTeam.list.data;
              that.dataList[that.activeName].list = that.dataList[that.activeName].list.concat(myData); //数组拼接
            } else {
              that.dataList[that.activeName].page = that.dataList[that.activeName].page - 1;
              that.dataList[that.activeName].isLoadMore = false;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    gotoOrderDetail(order_id) {
      this.$router.push(
        this.fun.getUrl("orderdetail", {
          order_id: order_id,
          orderType: "grabGroup"
        })
      );
    },
    gotoMyRecord() {
      this.$router.push(this.fun.getUrl("grab_group_my_record", {}));
    },
    gotoGroup(aid) {
      this.$router.push(this.fun.getUrl("grabGroup_detail", { id: aid }));
    },
    operation(_order, btn, barter) {
      console.log(btn, "点击");
      let order = {
        id: _order
      };
      this.orderPayId = _order;
      if (btn.value == 8 || btn.value == "snatch_regiment_express") {
        this.checklogistics(order, btn);
      } else if (btn.value == 10) {
        this.comment(order, btn);
      } else if (btn.value == 1 || btn.value == "snatch_regiment_pay") {
        this.toPay(order, btn);
      } else if (btn.value == 13 || btn.value == "snatch_regiment_refund") {
        //退款
        this.toRefund(order, btn);
      } else if (btn.value == 18) {
        //退款中
        this.toRefundDetail(order, btn);
      } else if (btn.value == "verification_code") {
        this.verification(order, btn);
      } else if (btn.value == 21) {
        this.$router.push(
          this.fun.getUrl("OrderRecord", {
            order_id: order.id
          })
        );
      } else if (btn.value == 27) {
        this.evaluate(order, btn);
      } else if (btn.value == 41) {
        //398售后
        window.location.href = btn.api;
      } else if (btn.value == 50) {
        //查看发票
        this.checkInvoice(btn, order);
      } else if (btn.value === "clerk_code" || btn.value === "package_deliver") {
        //确认核销
        this.confirmWriteOff(order, btn);
      } else if (btn.value == "lease_toy_apply_adopt") {
        // 填写归还
        this.$router.push(this.fun.getUrl("OrderReturn", { id: order.id }));
      } else if (btn.value == "snatch_regiment_barter") {
        // 抢团易货兑换
        this.showBarter = true;
        this.showBarter_value = barter;
      } else {
        this.publicMessage(order, btn);
      }
    },
    confirmBarter() {
      let that = this;
      $http.get("plugin.snatch-regiment.api.order.barter", { order_id: that.orderPayId }).then(
        function(response) {
          if (response.result == 1) {
            that.$notify({
              background: "#f0f9eb",
              message: `易货兑换成功`,
              color: "#67c23a"
            });
            that.onRefresh();
          } else {
            that.$dialog.alert({ message: response.msg });

          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    cancelBarter() {
      this.showBarter = false;
      this.showBarter_value = null;
    },
    publicMessage(order, btn) {
      let _text = btn.name || "操作";
      if (!btn.api) {
        return;
      }
      this.$dialog.confirm({ message: `确定${_text}?` })
        .then(() => {
          var that = this;
          let json = {
            order_id: that.orderPayId
          };
          let urls = btn.api || "";
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                Toast(`${_text}成功`);
                that.onRefresh();
              } else {
                that.$dialog.alert({ message: response.msg });

              }
            },
            function(response) {
              console.log(response);
            }
          );
        }).catch(() => {
        });
    },
    toPay(item, btn) {
      this.$router.push(
        this.fun.getUrl(
          "orderpay",
          {
            status: 1,
            order_ids: item.id
          },
          { api: btn.api }
        )
      );
    },
    //查看发票
    checkInvoice(btn, order) {
      this.$router.push(this.fun.getUrl("Invoice", { order_id: order.id }));
    },
    // 评价
    evaluate(order, btn) {
      this.$router.push(
        this.fun.getUrl("DeliveryEvaluate", {
          order_id: order.id,
          api: btn.api,
          name: "distributor"
        })
      );
    },
    //查看物流
    checklogistics(item, btn) {
      //回放轨迹
      console.log(JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open);
      if (
        item.dispatch_type_id == 7 &&
          JSON.parse(window.localStorage.getItem("globalParameter")).delivery_driver_open == "1"
      ) {
        console.log("hahaha");
        this.$router.push(
          this.fun.getUrl("track", {
            id: item.id
          })
        );
      } else {
        this.$router.push(
          this.fun.getUrl("logistics", {
            id: item.id,
            fromGrab: 1,
            api: btn.api
          })
        );
      }
    },
    toRefundDetail(item, btn) {
      this.$router.push(
        this.fun.getUrl("aftersales", {
          refund_id: item.refund_id
        })
      );
    },
    //退款
    toRefund(item, btn) {
      //refund
      this.$router.push(
        this.fun.getUrl("refund", {
          order_id: item.id,
          order_type: 3
        })
      );
    },
    verification(item, btn) {
      this.$router.push(
        this.fun.getUrl("orderVerification", {
          order_id: item.id,
          api: btn.api
        })
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #grab_group_my {
    .top-member {
      padding: 1rem;
      overflow: hidden;
      background: #fff;

      .info {
        display: flex;
        overflow: hidden;
        margin-bottom: 0.875rem;

        .avator {
          width: 3.75rem;
          height: 3.75rem;
          border-radius: 100%;
          margin-right: 0.625rem;
        }

        .info-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          justify-content: center;

          .name {
            width: 100%;
            color: #000;
            font-size: 1rem;
            font-weight: bold;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
            text-align: left;
          }

          .number {
            margin-top: 0.375rem;
            display: flex;
            align-items: center;
            font-size: 0.75rem;
            color: #808080;
          }

          .info-left-total {
            font-size: 1rem;
            color: #000;
          }
        }
      }

      .recording {
        background: url('../../../assets/images/qt_recordbg@2x.png') no-repeat center;
        background-size: 100%;
        width: 21.5rem;
        height: 3rem;
        line-height: 3rem;
        border-radius: 0.875rem 0.875rem 0 0;
        display: flex;
        align-items: center;
        padding: 0 1.25rem;

        .icon-qt_icon_record {
          font-size: 1.125rem;
          color: #fd806a;
        }

        .recording-text {
          flex: 1;
          text-align: left;
          text-indent: 0.75rem;
          color: #f94338;
          font-size: 1rem;
          font-weight: bold;
        }

        .record-btn {
          height: 1.75rem;
          line-height: 1.75rem;
          background-color: #fedfb7;
          border-radius: 0.875rem;
          color: #f94338;
          padding: 0 0.75rem;
          display: flex;
          align-items: center;
        }
      }
    }

    .content {
      .list_box {
        .list {
          background: #fff;
          margin: 0.875rem;
          overflow: hidden;
          border-radius: 0.375rem;

          .time_state {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            height: 2.5rem;
            line-height: 2.5rem;
            padding: 0 0.875rem;

            .state {
              color: #f15353;
            }
          }

          .goods_box {
            padding: 0.5rem;
            display: flex;

            .goods_img {
              width: 7.875rem;
              height: 7.875rem;
              overflow: hidden;
              background: #f2f2f2;
              border-radius: 0.25rem;
              margin-right: 0.875rem;
              flex-shrink: 0;

              img {
                width: 100%;
              }
            }

            .goods_name {
              flex: 1;
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              .name_price {
                display: flex;
                justify-content: space-between;

                .name {
                  width: 100%;
                  font-size: 0.875rem;
                  color: #000;
                  line-height: 1.25rem;
                  height: 4.75rem;
                  text-align: left;
                  font-weight: normal;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  display: -webkit-box;
                  -webkit-line-clamp: 4;
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
                flex-direction: column;
                justify-content: space-between;
                color: #f15353;
                font-size: 14px;
                text-align: left;

                .timestamp_box {
                  display: block;
                  padding: 0 0.5rem;
                  height: 1.25rem;
                  line-height: 1.25rem;
                  border-radius: 0.625rem;
                  background-color: rgba(255, 44, 41, 0.1);
                }

                .total_price {
                  font-size: 1rem;
                  line-height: 1.5rem;
                  display: flex;
                  align-items: center;

                  .small {
                    font-size: 0.75rem;
                  }
                }
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
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 0.5rem 0.875rem;
            flex-wrap: wrap;

            button {
              border-radius: 0.75rem;
              border: solid 0.0625rem #ff2c29;
              font-size: 12px;
              padding: 0.25rem 0.625rem;
              margin: 0 0 0.625rem 0.625rem;
              color: #ff2c29;
            }

            .groupDetail {
              color: #fff;
              background: #ff2c29;
            }
          }
        }
      }
    }

    .barter_dialog {
      .barter_dialog_1 {
        padding: 0.875rem 0;
        font-size: 1rem;
        font-weight: bold;
        color: #000;
      }

      .barter_dialog_2 {
        padding: 0.5rem 0;
        font-size: 0.875rem;
        color: #ee0a24;
      }
    }
  }
</style>
