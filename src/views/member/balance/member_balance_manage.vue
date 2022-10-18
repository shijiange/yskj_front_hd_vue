<template>
  <section id="balance_manage">
    <c-title :hide="false" text="保单管理"></c-title>
    <section id="release-goods">
      <div class="left">
        <div class="release-a" style="display: flex;">
          <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/supplier-protect.png" alt style="width: 30px;" />
        </div>
        <span>保单数量：{{ goods_length }}</span>
      </div>
      <div class="right">
        <van-button type="danger" size="small" round @click="goToAddbalance">添加保单 </van-button>
      </div>
    </section>
    <section id="goods-list">
      <div class="goods-list" v-for="(item, index) in data" :key="item">
        <div class="goods-list-top">
          <span>序号：{{ item.serial_number }}</span>
          <div class="contentright">
            <div class="title">{{ item.shop_name }}</div>
            <div class="btn">
              <span @click="moreEvent(index)">
                <van-icon class="iconfont icon-more" custom color="#c9c9c9" size="1.5rem" style="transform: translateY(4px);"></van-icon>
              </span>
              <div class="more" v-show="item.edit_active">
                <ul>
                  <li @click="editJumpEvent(index, item.is_pay)">
                    <!-- 已支付的不可编辑 -->
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
            </div>
          </div>
        </div>
        <div class="goods-list-bottom" @click="goTodetail(item.id)">
          <span>查看记录</span>
          <i class="fa fa-angle-right"></i>
        </div>
        <div class="goods-list-time" v-if="item.is_pay">
          <div class="left">支付时间</div>
          <div class="right">
            <div class="right-date" v-if="item.pay_time">{{ item.pay_time | TimeFilter }}</div>
            <div class="right-day" v-if="item.pay_time">{{ lastTime(item.lost_time) }}</div>
          </div>
        </div>
        <div class="goods-list-border"></div>
        <div class="goods-list-button">
          <div class="status success_tag" v-if="item.is_pay && pay_status == '1'">已支付</div>
          <div class="status" v-if="!item.is_pay && pay_status == '1'" @click.stop="gotoPay(item.id, item.supplier_id)">未支付</div>
          <div class="button" v-if="item.is_pay && renew_status == '1'" @click="contInsurance(index)">一键续保</div>
        </div>
      </div>
    </section>

    <van-popup v-model="showCallFisrt" round class="tanchuang tanchuangstate">
      <div class="title">提示</div>
      <span v-if="phone1 || phone2">暂不可用，如需修改，请拨打{{ phone1 }}或{{ phone2 }}</span>
      <van-button round type="primary" text="一键拨号" class="button button_pay button_call" @click="showPhonePopup" />
    </van-popup>
    <van-popup v-model="showCallTwo" round class="tanchuang tanchuangstate1">
      <div class="call_list" v-if="phone1">
        <span>{{ phone1 }}</span>
        <a class="callBotton button_call1" :href="'tel:' + phone1">拨号</a>
      </div>
      <div class="call_list" v-if="phone2">
        <span>{{ phone2 }}</span>
        <a class="callBotton button_call1" :href="'tel:' + phone2">拨号</a>
      </div>
      <span class="tc_cancle" @click.stop="showHidden">取消</span>
    </van-popup>
  </section>
</template>
<script>
import member_balance_manage from "./member_balance_managecontroller";

export default member_balance_manage;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#balance_manage {
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
    // border-bottom: solid 0.0625rem #ebebeb;
    justify-content: space-between;
    margin-bottom: 0.5rem;

    .left {
      position: relative;
      display: flex;
      align-items: center;

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

    .right {
      display: flex;
      align-items: center;
      margin-right: 0.4rem;

      button {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  }

  #goods-list {
    .goods-list {
      background-color: #fff;
      padding: 0.625rem 0;
      display: flex;
      flex-direction: column;
      // border-bottom: solid 0.0625rem #ebebeb;
      margin-bottom: 0.5rem;

      .goods-list-top {
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 0.875rem;
        padding: 0 0.875rem;
        display: flex;
        justify-content: space-between;
        // border-bottom: solid 0.0625rem #ebebeb;
        font-weight: 600;

        .contentright {
          display: flex;
          align-items: center;

          .btn {
            position: relative;
            margin-left: 0.4rem;
            font-weight: 500;
            font-size: 0.75rem;

            .more {
              line-height: normal;
              background: rgba(51, 51, 51, 0.9);
              border-radius: 0.25rem;
              color: #f0f0f0;
              width: 5.5rem;
              position: absolute;
              right: 0;
              top: -2rem;

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
                top: 1.85rem;

                i {
                  color: rgba(51, 51, 51, 0.9);
                }
              }
            }
          }
        }
      }

      .goods-list-bottom {
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 14px;
        padding: 0 0.875rem;
        display: flex;
        justify-content: space-between;
        color: #c9c9c9;
        // border-bottom: solid 0.0625rem #ebebeb;
        i {
          font-size: 1.25rem;
          color: #c9c9c9;
          line-height: 2.5rem;
        }
      }

      .goods-list-time {
        padding: 0 0.875rem;
        min-height: 2rem;
        line-height: 2rem;
        display: flex;
        align-items: center;
        color: #c9c9c9;

        .left {
          flex: 0 0 6rem;
          text-align: left;
        }

        .right {
          flex: 1;
          text-align: right;

          .right-date {
            display: inline-block;
            padding-right: 0.25rem;
          }

          .right-day {
            display: inline-block;
            color: #ee0a24;
            border-radius: 2rem;
            line-height: normal;
            padding: 0 0.35rem;
            font-size: 0.85rem;
            border: 1px solid #ee0a24;
          }
        }
      }

      .goods-list-border {
        border-bottom: 1px #f5f5f5 solid;
        margin: 0.25rem 0.875rem;
        height: 1px;
      }

      .goods-list-button {
        padding: 0 0.875rem;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: right;

        .status {
          display: inline-block;
          margin-right: 0.5rem;
          line-height: normal;
          background: #ee0a24;
          color: #fff;
          padding: 0.35rem 0.75rem;
          border-radius: 1rem;
        }

        .success_tag {
          background: #fff;
          color: #666;
          border: 1px solid #666;
        }

        .button {
          display: inline-block;
          color: #ee0a24;
          border-radius: 1rem;
          line-height: normal;
          padding: 0.35rem 0.75rem;
          font-size: 0.85rem;
          border: 1px solid #ee0a24;
        }
      }
    }
  }

  .tanchuang {
    width: 19rem;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;

    .title {
      font-size: 1rem;
      font-weight: bold;
      padding: 1rem;
      border-bottom: 1px solid #f2f2f7;
    }

    span {
      text-align: center;
      line-height: 1.5rem;
      padding: 0.8rem;
      font-size: 1rem;
    }

    .call_list {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.5rem 0 0.5rem;
    }

    .callBotton {
      display: inline-block;
      padding: 0 1rem;
      height: 2rem;
      line-height: 2rem;
      border-radius: 1rem;
    }
  }

  .tanchuangstate {
    padding: 0.2rem 0 1rem 0;
  }

  .tanchuangstate1 {
    padding: 1rem 0 0;
  }

  .button_call {
    margin-top: 1rem;
    align-self: center;
  }

  .button_call1 {
    background: #ff2c29;
    color: #fff;
    border: none;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    .content-a {
      width: 75%;
      height: 30vh;
      background: #fff;
      border-radius: 1rem;
    }
  }

  /deep/ .van-overlay {
    z-index: 99;
  }
}
</style>
