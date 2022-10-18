<!-- 新零售 -->
<template>
  <div id="newRetail-index">
    <c-title :hide="false" :text="info.project_name || '--'"></c-title>
    <div class="top-member-box">
      <img class="member-acator" :src="info.avatar" alt="" />
      <div class="member-info">
        <div class="member-name">{{ info.nickname }}</div>
        <div class="member-grade" v-if="info.level_name">{{ info.level_name }}</div>
      </div>
    </div>

    <div class="income-box" @click.stop="gotoUrl('newRetailSalesExtension', {})">
      <div class="income-num">累计收益：{{ $i18n.t("money") }} {{ info.money }}</div>
      <i class="iconfont icon-member_right"></i>
    </div>

    <div class="main-box">
      <div class="main-nav" @click.stop="gotoUrl('newRetailSearch', { type: 2 })">
        <div class="nav-icon">
          <i class="iconfont icon-fontclass-daili"></i>
        </div>
        <div>代理套餐</div>
      </div>
      <div class="main-nav" @click.stop="gotoUrl('newRetailSearch', { type: 3 })">
        <div class="nav-icon">
          <i class="iconfont icon-fontclass-jinhuo"></i>
        </div>
        <div>自主进货</div>
      </div>
      <div class="main-nav" @click.stop="gotoUrl('newRetailInventory', {})">
        <div class="nav-icon">
          <i class="iconfont icon-fontclass-kucun1"></i>
        </div>
        <div>我的库存</div>
      </div>
      <div class="main-nav" @click.stop="gotoUrl('newRetailSalesRecord', {})">
        <div class="nav-icon">
          <i class="iconfont icon-fontclass-jilu"></i>
        </div>
        <div>销售记录</div>
      </div>
      <div class="main-nav" @click.stop="gotoUrl('orderlist', { status: 0, orderType: 'newRetail' })">
        <div class="nav-icon">
          <i class="iconfont icon-fontclass-guanli"></i>
        </div>
        <div>订单管理</div>
      </div>
    </div>

    <good-list class="goods-list" :goodsList="goodsList" :mode="1"></good-list>
  </div>
</template>

<script>
import goodList from "./child/goodlist";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: {},
      goodsList: [],
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },

  activated() {
    this.getData();
  },
  components: { goodList },
  computed: {},
  methods: {
    getData() {
      $http
        .get("plugin.new-retail.frontend.index.index", {})
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
            this.fun.setWXTitle(this.info.project_name);
            this.getGood();
          } else {
            Toast(response.msg);
            if (response.msg != "请登录") {
              if (window.history.length <= 1) {
                this.$router.push(this.fun.getUrl('home', {}));
              } else {
                this.$router.go(-1);
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getGood() {
      $http
        .get("plugin.new-retail.frontend.index.goodsList", {}, "")
        .then(response => {
          if (response.result === 1) {
            this.goodsList = response.data.data;
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
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get("plugin.new-retail.frontend.index.goodsList", { page: that.page }, "加载中")
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.data;
              that.goodsList = that.goodsList.concat(nextPageData); //进行数组拼接
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
    },
    gotoUrl(name, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(name, params, query));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#newRetail-index {
  .top-member-box {
    display: flex;
    padding: 1.625rem 1.375rem 3.125rem;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-image: linear-gradient(-90deg, #198afb 0%, #1eabfb 100%), linear-gradient(#22d293, #22d293);
    background-blend-mode: normal, normal;

    .member-acator {
      width: 47px;
      height: 47px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      margin: 0 0.625rem 0 0;
      background: #fff;
    }

    .member-info {
      flex: 1;
      text-align: left;
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;

      .member-name {
        width: 100%;
        line-height: 1.875rem;
        font-size: 16px;
        font-weight: 600;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .member-grade {
        display: flex;
        height: 1.25rem;
        line-height: 1.25rem;
        padding: 0 0.5rem;
        border-radius: 1rem;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.5);
      }
    }
  }

  .income-box {
    background: #fff;
    width: 90%;
    height: 3.125rem;
    background-color: #fff;
    border-radius: 0.375rem;
    overflow: hidden;
    margin: -1.625rem auto 1rem;
    display: flex;
    align-items: center;
    padding: 0 0.875rem;

    .income-num {
      flex: 1;
      text-align: left;
      font-size: 16px;
    }
  }

  .main-box {
    width: 90%;
    margin: 0 auto;
    padding: 0 1.375rem 0.875rem;
    background-color: #fff;
    border-radius: 0.313rem;
    display: flex;
    flex-wrap: wrap;
    font-size: 10px;
    line-height: 1.625rem;

    .main-nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 2rem;
      margin-top: 0.875rem;

      .nav-icon {
        width: 2.5rem;
        height: 2.5rem;
        background-color: #e5f5ff;
        color: #198bfb;
        line-height: 2.5rem;
        border-radius: 50%;
        overflow: hidden;

        i {
          font-size: 24px;
        }
      }
    }

    .main-nav:nth-child(4) {
      margin-right: 0;
    }
  }
}
</style>
