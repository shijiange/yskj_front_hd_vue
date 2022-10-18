<!-- 安装服务 安装师傅订单详情 -->
<template>
  <div id="worker_orderDetail">
    <c-title :hide="false" text="订单详情"></c-title>
    <div class="main">
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
        <div class="context_child">
          <div class="name">安装状态:</div>
          <div class="text">{{ datas.status_name }}</div>
        </div>
        <div class="context_child">
          <div class="name">安装数量:</div>
          <div class="text">{{ datas.total }}</div>
        </div>
        <div class="context_child">
          <div class="name">联 系 人:</div>
          <div class="text">{{ datas.person }}</div>
        </div>
        <div class="context_child">
          <div class="name">联系电话:</div>
          <div class="text phones">
            <a :href="'tel:' + datas.phone">{{ datas.phone }}</a>
          </div>
        </div>
        <div class="context_child">
          <div class="name">预约时间:</div>
          <div class="text">{{ datas.reserve_time }}</div>
        </div>
        <div class="context_child">
          <div class="name">安装地址:</div>
          <div class="text address">{{ datas.address }}</div>
        </div>
        <div class="context_child">
          <div class="name">备注信息:</div>
          <div class="text remark">{{ datas.remark }}</div>
        </div>
        <div class="context_child" v-if="datas.sendOrder_time">
          <div class="name">派单时间:</div>
          <div class="text">{{ datas.sendOrder_time }}</div>
        </div>
        <div class="context_child" v-if="datas.install_time">
          <div class="name">上门时间:</div>
          <div class="text">{{ datas.install_time }}</div>
        </div>
        <div class="context_child" v-if="datas.finish_time">
          <div class="name">完成时间:</div>
          <div class="text">{{ datas.finish_time }}</div>
        </div>
      </div>

      <div class="bottom_box set-pc-style">
        <div class="money">{{ $i18n.t('money') }}{{ datas.money }}</div>
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
  </div>
</template>

<script>
import cTitle from '../../../components/title';
import { Toast } from 'vant';

export default {
  data() {
    return {
      datas: {}
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
        .post('plugin.assemble.Frontend.Modules.Worker.Controllers.detail', { order_id: this.$route.params.id }, '')
        .then(response => {
          if (response.result === 1) {
            console.log(response.data);
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
      this.$dialog.confirm({ message:`确定${_text}?`})
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#worker_orderDetail {
  .main {
    .goodslist {
      display: flex;
      flex-direction: column;
      background: #fff;
      margin-bottom: 0.875rem;

      .goods {
        display: flex;
        padding: 0.5rem 0.875rem;

        img {
          width: 4.75rem;
          height: 4.75rem;
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
            -webkit-line-clamp: 2;
          }

          .total {
            color: #666;
          }
        }
      }
    }

    .context {
      display: flex;
      flex-direction: column;
      position: relative;
      background: #fff;
      padding: 1rem 0;

      .context_child {
        line-height: 1.25rem;
        font-size: 0.875rem;
        display: flex;
        justify-content: space-between;
        padding: 0.35rem 0;

        .name {
          text-align: center;
          width: 5.125rem;
          color: #666;
        }

        .text {
          flex: 1;
          text-align: left;
          padding: 0 1rem;
          color: #333;
        }

        .remark {
          color: #000;
        }

        .phones {
          color: #f15353;
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
  }
}
</style>
