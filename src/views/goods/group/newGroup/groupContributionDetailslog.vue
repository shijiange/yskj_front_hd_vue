<template>
  <div id="groupContributionDetailslog">
    <c-title :hide="false" :text="gxz_name"></c-title>
    <div class="logBox" v-for="(item,ind) in list" :key="ind">
      <div class="left">
        <div>{{item.title}}</div>
        <div>{{item.order_sn}}</div>
        <div class="avaimg">
          <img :src="item.avatar" alt="" />
          <div>{{item.nickname}}</div>
        </div>
      </div>
      <div class="right">
        <div class="priceTxt">活动金额:￥{{item.price}}</div>
        <div class="price">+{{item.commission_gxz}}</div>
        <div class="time">{{item.created_at}}</div>
      </div>
    </div>
    <yz-blank :datas="list"></yz-blank>
  </div>
</template>
<script>
import { scrollMixin } from "utils/mixin";
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      gxz_name: "",
      list: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  components: { yzBlank },
  activated() {
    this.getData();
  },
  methods: {
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    },
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.contribution.get-contribution-log-list", { uid: this.$route.params.id }, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.gxz_name = response.data.gxz_name;
            this.fun.setWXTitle(this.gxz_name);
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
        .catch(err => {
          console.log(err);
        });
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.zhp-group-lottery.frontend.contribution.get-contribution-log-list", { uid: this.$route.params.id, page: that.page }, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.list = that.list.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
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
<style lang="scss" scoped>
#groupContributionDetailslog {
  min-height: 100vh;
  background: #fff;
}

.logBox {
  border-bottom: 1px solid #e5e5e5;
  margin: 0 11px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;

  .left {
    height: 4rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 14px;

    .avaimg {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;

      img {
        width: 20px;
        height: 20px;
        border-radius: 100%;
      }
    }
  }

  .right {
    height: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 14px;

    .priceTxt {
      color: #6f6f6f;
    }

    .price {
      color: #ff7373;
    }

    .time {
      font-size: 12px;
      color: #afafaf;
    }
  }
}
</style>
