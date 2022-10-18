<!-- 安装服务 收入 -->
<template>
  <div id="install_income">
    <c-title :hide="false" :text="diyName"></c-title>
    <div class="member_info">
      <img :src="info.avatar" alt="" class="avatar" />
      <p class="name">{{ info.nickname }}</p>
    </div>

    <div class="total_list">
      <div class="total_child">
        <p class="num">{{ info.grand_total }}</p>
        <p class="num_name">累计金额(元)</p>
      </div>
      <div class="total_child">
        <p class="num">{{ info.unsettlement_total }}</p>
        <p class="num_name">未结算(元)</p>
      </div>
      <div class="total_child">
        <p class="num">{{ info.settlement_total }}</p>
        <p class="num_name">已结算(元)</p>
      </div>
    </div>

    <div class="tab_box">
      <van-tabs v-model="active" @click="getList" sticky :offset-top="39" swipeable>
        <van-tab :title="items.title" v-for="(items, index) in arr" :key="index">
          <div class="list_child" v-for="item in list" :key="item.id">
            <div class="childs">
              <div class="order_sn">订单号:{{ item.order_sn }}</div>
              <div class="money">{{ $i18n.t('money') }} {{ item.amount }}</div>
            </div>
            <div class="childs">
              <div class="time">时间:{{ item.created_at }}</div>
              <div class="status">{{ item.status == 1 ? '已结算' : '未结算' }}</div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <yz-blank :datas="list"></yz-blank>
  </div>
</template>

<script>
import cTitle from '../../../components/title';
import { Toast } from 'vant';
import { scrollMixin } from 'utils/mixin';
import yzBlank from '../../../components/ui_components/yz_blank';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: {},
      list: {},
      active: 0,
      url: '',

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,

      arr: [],
      diyName: JSON.parse(window.localStorage.getItem('globalParameter')).assemble_worker_name || ''
    };
  },

  activated() {
    this.init();
    this.getInfo();
  },

  components: { cTitle, yzBlank },

  computed: {},

  methods: {
    init() {
      this.list = [];
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
    },
    getInfo() {
      $http
        .post('plugin.assemble.Frontend.Modules.Income.Controllers.page', {}, '')
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;

            if (response.data.identity == 1) {
              this.arr = [{ title: this.diyName, url: 'plugin.assemble.Frontend.Modules.Income.Controllers.wages' }];
            } else if (response.data.identity == 2) {
              this.arr = [{ title: '区域代理', url: 'plugin.assemble.Frontend.Modules.Income.Controllers.bonus' }];
            } else if (response.data.identity == 3) {
              this.arr = [
                { title: this.diyName, url: 'plugin.assemble.Frontend.Modules.Income.Controllers.wages' },
                { title: '区域代理', url: 'plugin.assemble.Frontend.Modules.Income.Controllers.bonus' }
              ];
            }
            this.getList();
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getList() {
      this.url = this.arr[this.active].url;
      $http
        .post(this.url, {}, '')
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.list = response.data.data;
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
      if (this.page >= this.total_page) {
        return;
      } else {
        let _json = {};
        this.page = this.page + 1;
        _json.page = this.page;
        $http.post(this.url, _json, '加载中').then(
          response => {
            let res = response.data;
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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#install_income {
  .member_info {
    height: 7.375rem;
    background-color: #f15353;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .avatar {
      width: 3.125rem;
      height: 3.125rem;
      border: 3px solid #fff;
      border-radius: 100%;
      overflow: hidden;
      margin: 0 0 0.5rem;
    }

    .name {
      font-size: 1rem;
      line-height: 1.5rem;
      color: #fff;
    }
  }

  .total_list {
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    margin-bottom: 0.65rem;

    .total_child {
      height: 5.875rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      flex: 1;

      .num {
        font-size: 1rem;
        color: #333;
        margin-bottom: 0.5rem;
      }

      .num_name {
        font-size: 0.875rem;
        color: #666;
      }
    }
  }

  .tab_box {
    padding: 0 0.75rem;
    background: #fff;

    .list_child {
      width: 100%;
      height: 4.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .childs {
        display: flex;
        justify-content: space-between;
        line-height: 1.625rem;

        .order_sn {
          color: #000;
        }

        .money {
          color: #f15353;
        }

        .time,
        .status {
          color: #666;
        }
      }
    }
  }
}
</style>
