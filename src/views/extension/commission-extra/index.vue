<template>
  <div class="recommend-reward">
    <div class="reward-header">
      <c-title class="circle_title" :hide="false" :text="info.plugin_name || ''"></c-title>
      <div class="reward-user">
        <div class="user-img">
          <img :src="info.avatar" alt />
        </div>
        <div class="user-info">
          <p>{{ info.nickname || "--" }}</p>
        </div>
      </div>
      <div class="reward-price">
        <div class="prile-list">
          <p><em style="font-size: 12px;">￥</em>{{ info.total_unsettle || "--" }}</p>
          <p>未结算</p>
        </div>
        <div class="prile-list">
          <p><em style="font-size: 12px;">￥</em>{{ info.total_settle || "--" }}</p>
          <p>已结算</p>
        </div>
      </div>
    </div>
    <div class="reward-list">
      <van-tabs v-model="active" @change="tabStatus" sticky swipeable>
        <van-tab title="全部" :name="2"></van-tab>
        <van-tab title="未结算" :name="0"></van-tab>
        <van-tab title="已结算" :name="1"></van-tab>
        <van-tab title="失效" :name="-1"></van-tab>
        <ul class="list" v-for="item in listData" :key="item.id">
          <li class="list-order">
            <p>{{ item.order_sn }}</p>
            <p>￥{{ item.dividend_amount || "--" }}</p>
          </li>
          <li class="list-date">
            <p>{{ item.created_at }}</p>
            <p :style="{ color: item.status == 0 ? '#999' : '#333' }">{{ item.status_name }}</p>
          </li>
        </ul>
        <yz-blank :datas="listData"></yz-blank>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { scrollMixin } from "../../../utils/mixin"; //引入加载更多
import yzBlank from "components/ui_components/yz_blank";
export default {
  mixins: [scrollMixin],
  data() {
    return {
      active: 2,
      info: {}, //用户信息
      listData: [], //列表数据

      // more
      isLoadMore: true, // 判断是否要加载更多的标识
      page: 1, //当前的页数
      total_page: 0 // 总共有多少页
    };
  },
  created() {
    this.getIndexData(true);
  },
  components: { yzBlank },
  methods: {
    //获取数据
    getIndexData(_first) {
      let json = {};
      if (this.active != 2) {
        json.status = this.active;
      }
      $http
        .get("plugin.commission-extra.frontend.index", json, "加载中...")
        .then(
          response => {
            if (response.result === 1) {
              if (_first) {
                this.fun.setWXTitle(response.data.plugin_name);
                this.info["plugin_name"] = response.data.plugin_name;
                this.info["nickname"] = response.data.nickname;
                this.info["avatar"] = response.data.avatar;
                this.info["total_unsettle"] = response.data.total_unsettle;
                this.info["total_settle"] = response.data.total_settle;
              }
              this.listData = response.data.data;
              this.total_page = response.data.last_page;
              if (!this.total_page) {
                this.total_page = 0;
              }
            } else {
              this.$toast(response.msg);
            }
          },
          response => {
            this.$toast(response);
          }
        )
        .catch(error => {
          console.log(error);
        });
    },

    tabStatus() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.getIndexData(false);
    },

    //获取更多数据
    getMoreData() {
      let json = {};
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        json = {
          page: this.page
        };
        if (this.active != 2) {
          json.status = this.active;
        }
        $http
          .get("plugin.commission-extra.frontend.index", json, "加载中...")
          .then(res => {
            this.isLoadMore = true;
            if (res.result == 1) {
              let myData = res.data.data;
              this.listData = this.listData.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.recommend-reward {
  .reward-title {
    background-color: #f8f8f8;
    text-align: center;
    height: 2.75rem;
    line-height: 2.75rem;

    p {
      font-size: 18px;
      color: #2c2c2c;
    }
  }

  .reward-user {
    background-color: #f15353;
    height: 6.69rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .user-img {
      width: 2.88rem;
      height: 2.88rem;
      margin-left: 1.56rem;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .user-info {
      color: #fff;
      margin-left: 0.69rem;
      text-align: left;

      > p {
        font-size: 16px;
        margin-bottom: 0.56rem;
      }

      .user-grade {
        width: 3.25rem;
        height: 1.25rem;
        text-align: center;
        background-color: #f36b69;
        border-radius: 0.63rem;

        p {
          line-height: 1.25rem;
          color: #fff;
          font-size: 12px;
        }
      }
    }
  }

  .reward-price {
    height: 5.5rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;

    .prile-list {
      p:nth-child(1) {
        font-size: 18px;
        color: #f15353;
        margin-bottom: 0.375rem;
      }

      p:nth-child(2) {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .reward-list {
    margin-top: 0.63rem;
  }

  .list {
    background-color: #fff;
    box-sizing: border-box;
    padding: 0.7rem 0.65rem;
    border-bottom: 1px solid #f4f4f4;

    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 1.7rem;
    }

    p {
      font-size: 14px;
    }

    .list-order {
      p:nth-child(1) {
        color: #2a2f31;
      }

      p:nth-child(2) {
        color: #f15353;
      }
    }

    .list-date {
      p:nth-child(1) {
        color: #6a6a6a;
        font-size: 12px;
      }

      p:nth-child(2) {
        color: #101010;
      }
    }
  }
}
</style>
