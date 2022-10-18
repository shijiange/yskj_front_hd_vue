<!-- 安装服务 安装服务（客户）订单详情 -->
<template>
  <div id="user_orderDetail">
    <c-title :hide="false" text="订单详情"></c-title>
    <div class="main">
      <div class="top_box">
        <div class="sn">订单号:{{ datas.order_sn }}</div>
        <div class="sn_status">{{ datas.status_name }}</div>
      </div>
      <div class="goodslist">
        <div class="goods" v-for="item in datas.has_many_order_goods" :key="item.id">
          <img :src="item.thumb" alt="" />
          <div class="goods_r">
            <div class="title">{{ item.title }}</div>
            <div class="total">数量:×{{ item.total }}</div>
          </div>
        </div>
      </div>

      <div class="context">
        <div class="Booked_box">
          <div class="reservation_time">预约时间</div>
          <div class="reservation_select" v-show="datas.status == 0 && !selectTime" @click="showTime = true">
            请选择 <i class="iconfont icon-member_right"></i>
          </div>
          <div class="reservation_select" v-show="datas.status == 0 && selectTime" @click="showTime = true">
            {{ selectTime }}<i class="iconfont icon-member_right"></i>
          </div>
          <div class="reservation_select" v-show="datas.status == 1">
            {{ datas.time }}<i class="iconfont icon-member_right"></i>
          </div>
        </div>
        <div class="remark">
          <div class="remark_title">备注信息</div>
          <template v-if="datas.status == 0">
            <van-field
              v-model="message"
              rows="3"
              autosize
              type="textarea"
              placeholder="填写备注..."
              show-word-limit
              v-if="datas.status == 0"
            />
            <p v-if="datas.status == 0" class="warn_text">
              温馨提醒:建议收到货后预约师傅安装，预约安装日期需在商品到达具体时间后
            </p>
          </template>
          <div class="remark_text" v-if="datas.status != 0">{{ datas.remark }}</div>
        </div>

        <div class="steps" v-if="datas.status != 0">
          <van-steps direction="vertical" :active="datas.status" active-color="#f15353">
            <van-step>
              <h3>预约安装时间</h3>
              <p v-if="datas.status >= 0">{{ datas.schedule.appointment_time }}</p>
            </van-step>
            <van-step>
              <h3>派单</h3>
              <p v-if="datas.status >= 1">
                安装师傅:{{ datas.schedule.worker_info.name }} 联系电话:<a
                  :href="'tel:' + datas.schedule.worker_info.phone"
                  >{{ datas.schedule.worker_info.phone }}</a
                >
              </p>
              <p v-if="datas.status >= 1">{{ datas.schedule.sendOrder_time }}</p>
            </van-step>
            <van-step>
              <h3>上门安装</h3>
              <p v-if="datas.status >= 2">{{ datas.schedule.install_time }}</p>
            </van-step>
            <van-step>
              <h3>完成安装</h3>
              <p v-if="datas.status >= 3">{{ datas.schedule.finish_time }}</p>
            </van-step>
          </van-steps>
        </div>
      </div>

      <div class="bottom_box set-pc-style" v-if="!fun.isTextEmpty(datas.button_models)">
        <div class="money"></div>
        <div class="button_list">
          <div
            class="button"
            @click.stop="publicMessage(datas.id, items.api, items.name)"
            v-for="items in datas.button_models"
            :key="items.value"
          >
            {{ items.name }}
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="showTime" class="set-pc-style" position="bottom" lock-scroll :close-on-click-overlay="false">
      <van-datetime-picker
        v-model="currentDate"
        :formatter="formatter"
        @confirm="confirmTime"
        @cancel="showTime = false"
        type="datetime"
        title="选择年月日小时"
        :min-date="minDate"
      />
    </van-popup>
  </div>
</template>

<script>
import cTitle from '../../../components/title';
import { Toast } from 'vant';

Date.prototype.Format = function(fmt) {
  // author: meizz
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
};

export default {
  data() {
    return {
      timestamp: null, //时间戳
      selectTime: null, //选择预约时间
      showTime: false,
      currentDate: new Date(),
      minDate: new Date(),
      datas: {},
      message: ''
    };
  },

  activated() {
    this.getData();
  },

  components: { cTitle },

  computed: {},

  methods: {
    getData() {
      $http
        .post('plugin.assemble.Frontend.Modules.Order.Controllers.detail', { order_id: this.$route.params.id }, '')
        .then(response => {
          if (response.result === 1) {
            this.datas = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    publicMessage(id, api, text) {
      let _text = text || '提交操作';
      if (!api) {
        return;
      }
      if (text == '预约安装') {
        //预约安装跳转到详情页提交信息
        this.submitReserve();
        return;
      }
      this.$dialog.confirm({ message: `确定${_text}?`})
        .then(() => {
          var that = this;
          let json = {
            order_id: id
          };
          let urls = api || '';
          $http.get(urls, json).then(
            function(response) {
              if (response.result == 1) {
                that.getData();
                
                Toast(`${_text}成功`);
              } else {
                that.$dialog.alert({message:response.msg});
               
              }
            },
            function(response) {
              console.log(response);
            }
          );
        }).catch(() => {});
    },
    submitReserve() {
      //提交预约
      let that = this;
      if (!this.timestamp) {
        Toast('请选择预约时间！');
        return;
      }
      console.log('sssssssss', this.timestamp, this.message);
      $http
        .post(
          'plugin.assemble.Frontend.Modules.Order.Controllers.appointment',
          { order_id: this.$route.params.id, time: this.timestamp, remark: this.message },
          ''
        )
        .then(response => {
          if (response.result === 1) {
            that.getData();
            Toast(response.msg);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    confirmTime(value) {
      console.log('valuevalue', value);
      this.selectTime = value.Format('yyyy-MM-dd hh:mm:ss');
      this.showTime = false;
      this.timestamp = this.fun.getTimestamp(value);
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      } else if (type === 'hour') {
        return `${val}时`;
      } else if (type === 'minute') {
        return `${val}分`;
      }
      return val;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#user_orderDetail {
  padding-bottom: 60px;

  .main {
    .top_box {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      height: 2.375rem;
      line-height: 2.375rem;
      text-align: left;
      background: #fff;
      padding: 0 0.875rem;

      .sn {
        color: #333;
        flex: 1;
      }

      .sn_status {
        color: #f15353;
      }
    }

    .goodslist {
      display: flex;
      flex-direction: column;
      background: #fff;
      margin-bottom: 0.875rem;

      .goods {
        display: flex;
        padding: 0.5rem 0.875rem;

        img {
          width: 7.25rem;
          height: 7.25rem;
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .goods_r {
          flex: 1;
          margin-left: 0.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;

          .title {
            font-size: 0.875rem;
            color: #000;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }

          .total {
            color: #666;
          }
        }
      }
    }

    .context {
      background: #fff;
      padding: 1rem 0;
      text-align: left;

      .Booked_box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding: 0 0.875rem;
      }

      .remark {
        padding: 0 0.875rem 1rem;

        .remark_title {
          height: 2rem;
          line-height: 2rem;
        }

        .remark_text {
          font-size: 0.875rem;
          color: #000;
          padding-bottom: 0.875rem;
          border-bottom: 0.0625rem solid #ececec;
        }

        .warn_text {
          padding: 0.5rem 0;
          font-size: 0.75rem;
          line-height: 1.25rem;
          color: #999;
        }

        .van-cell {
          background: #f7f7f7;
        }
      }

      .steps {
        font-weight: 400;

        h3 {
          font-weight: 400;
        }

        .van-step--vertical:not(:last-child)::after {
          border-bottom-width: 0;
        }
      }
    }

    .bottom_box {
      padding: 0 1.125rem;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3.125rem;
      line-height: 3.125rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #fff;
      z-index: 999;

      .money {
        flex: 1;
        color: #f15353;
        font-size: 1rem;
        font-weight: bold;
        text-align: left;
      }

      .button_list {
        display: flex;
      }

      .button {
        width: 5.75rem;
        height: 1.875rem;
        line-height: 1.875rem;
        background-color: #f15353;
        border-radius: 0.125rem;
        color: #fff;
        margin-left: 0.5rem;
      }
    }

    .bottom_box::after {
      height: 1px;
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      background-image: linear-gradient(0deg, #e8e8e8 50%, transparent 0);
    }
  }
}
</style>
