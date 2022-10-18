<!-- 安装服务 安装师傅订单列表 -->
<template>
  <div id="worker_orderlist">
    <c-title :hide="false" :text="diyName"></c-title>
    <van-tabs v-model="active" @change="getData" sticky :offset-top="40" swipeable>
      <van-tab title="全部订单">
        <div class="list">
          <div class="list_child" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
            <div class="top_box">
              <div class="sn">订单号:{{ item.order_sn }}</div>
              <div class="sn_status">{{ item.status_name }}</div>
            </div>
            <div class="context">
              <div class="context_child">
                <div class="name">安装数量:</div>
                <div class="text">{{ item.total }}</div>
              </div>
              <div class="context_child">
                <div class="name">联 系 人:</div>
                <div class="text">{{ item.person }}</div>
              </div>
              <div class="context_child">
                <div class="name">联系电话:</div>
                <div class="text phones">
                  <a :href="'tel:' + item.phone">{{ item.phone }}</a>
                </div>
              </div>
              <div class="context_child">
                <div class="name">预约时间:</div>
                <div class="text">{{ item.reserve_time }}</div>
              </div>
              <div class="context_child">
                <div class="name">安装地址:</div>
                <div class="text address">{{ item.address }}</div>
              </div>
            </div>
            <div class="bottom_box">
              <div class="money">{{ $i18n.t('money') }}{{ item.money }}</div>
              <div class="button_list">
                <div
                  class="button"
                  @click.stop="publicMessage(item.id, items.api, items.name)"
                  v-for="items in item.button_models"
                  :key="items.value"
                >
                  {{ items.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="待安装订单">
        <div class="list">
          <div class="list_child" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
            <div class="top_box">
              <div class="sn">订单号:{{ item.order_sn }}</div>
              <div class="sn_status">{{ item.status_name }}</div>
            </div>
            <div class="context">
              <div class="context_child">
                <div class="name">安装数量:</div>
                <div class="text">{{ item.total }}</div>
              </div>
              <div class="context_child">
                <div class="name">联 系 人:</div>
                <div class="text">{{ item.person }}</div>
              </div>
              <div class="context_child">
                <div class="name">联系电话:</div>
                <div class="text phones">
                  <a :href="'tel:' + item.phone">{{ item.phone }}</a>
                </div>
              </div>
              <div class="context_child">
                <div class="name">预约时间:</div>
                <div class="text">{{ item.reserve_time }}</div>
              </div>
              <div class="context_child">
                <div class="name">安装地址:</div>
                <div class="text address">{{ item.address }}</div>
              </div>
            </div>
            <div class="bottom_box">
              <div class="money">{{ $i18n.t('money') }}{{ item.money }}</div>
              <div class="button_list">
                <div
                  class="button"
                  @click.stop="publicMessage(item.id, items.api, items.name)"
                  v-for="items in item.button_models"
                  :key="items.value"
                >
                  {{ items.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已安装订单">
        <div class="list">
          <div class="list_child" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
            <div class="top_box">
              <div class="sn">订单号:{{ item.order_sn }}</div>
              <div class="sn_status">{{ item.status_name }}</div>
            </div>
            <div class="context">
              <div class="context_child">
                <div class="name">安装数量:</div>
                <div class="text">{{ item.total }}</div>
              </div>
              <div class="context_child">
                <div class="name">联 系 人:</div>
                <div class="text">{{ item.person }}</div>
              </div>
              <div class="context_child">
                <div class="name">联系电话:</div>
                <div class="text phones">
                  <a :href="'tel:' + item.phone">{{ item.phone }}</a>
                </div>
              </div>
              <div class="context_child">
                <div class="name">预约时间:</div>
                <div class="text">{{ item.reserve_time }}</div>
              </div>
              <div class="context_child">
                <div class="name">安装地址:</div>
                <div class="text address">{{ item.address }}</div>
              </div>
            </div>
            <div class="bottom_box">
              <div class="money">{{ $i18n.t('money') }}{{ item.money }}</div>
              <div class="button_list">
                <div
                  class="button"
                  @click.stop="publicMessage(item.id, items.api, items.name)"
                  v-for="items in item.button_models"
                  :key="items.value"
                >
                  {{ items.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <template v-if="!loading && fun.isTextEmpty(list)">
      <div class="noData">
        <img src="../../../assets/images/energytank_blank@2x.png" class="noData_imgs" alt="" />
        <p class="text">暂无信息</p>
      </div>
    </template>
  </div>
</template>

<script>
import cTitle from '../../../components/title';
import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: 0,
      list: [],
      loading: false,

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      diyName:
        `${JSON.parse(window.localStorage.getItem('globalParameter')).assemble_worker_name}订单列表` || '订单列表'
    };
  },

  activated() {
    this.init();
    this.getData();
  },
  components: { cTitle },
  computed: {},
  methods: {
    init() {
      this.loading = false;
      this.list = [];
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.fun.setWXTitle(this.diyName);
    },
    getData() {
      this.loading = true;
      $http
        .get('plugin.assemble.Frontend.Modules.Worker.Controllers.order', { status: this.active, page: 1 }, '')
        .then(response => {
          this.loading = false;
          if (response.result === 1) {
            this.list = response.data.data;
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
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
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.active == '1') {
        return;
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = {
          status: that.active
        };
        this.page = this.page + 1;
        _json.page = this.page;
        $http.get('plugin.assemble.Frontend.Modules.Worker.Controllers.order', _json, '加载中').then(
          res => {
            that.isLoadMore = true;
            if (res.result === 1) {
              var myData = res.data.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            console.log('response', response);
            // error callback
          }
        );
      }
    },
    toDetail(_id) {
      this.$router.push(this.fun.getUrl('workerOrderDetail', { id: _id }));
    },
    publicMessage(id, api, text) {
      let _text = text || '提交操作';
      if (!api) {
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#worker_orderlist {
  .noData {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    .noData_imgs {
      width: 100%;
      margin: 0;
    }

    .text {
      padding: 1rem 0;
      color: #999;
      font-size: 1rem;
    }
  }

  .list {
    .list_child {
      width: 100%;
      background: #fff;
      padding: 0 0.875rem;
      margin-top: 0.625rem;

      .context {
        display: flex;
        flex-direction: column;
        position: relative;
      }

      .top_box,
      .context .context_child,
      .bottom_box {
        display: flex;
        justify-content: space-between;
      }

      .top_box {
        font-size: 0.875rem;
        height: 2.375rem;
        line-height: 2.375rem;
        text-align: left;

        .sn {
          color: #333;
          flex: 1;
        }

        .sn_status {
          color: #f15353;
        }
      }

      .context .context_child {
        line-height: 1.25rem;
        font-size: 0.75rem;
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
          color: #000;
        }

        .phones {
          color: #f15353;
        }
      }

      .context::after {
        height: 1px;
        position: absolute;
        z-index: 0;
        bottom: 0;
        left: 0;
        content: '';
        width: 100%;
        background-image: linear-gradient(0deg, #ececec 50%, transparent 0);
      }

      .bottom_box {
        height: 2.875rem;
        line-height: 2.875rem;
        align-items: center;

        .money {
          flex: 1;
          color: #f15353;
          font-size: 0.875rem;
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
}
</style>
