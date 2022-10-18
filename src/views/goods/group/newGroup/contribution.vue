<!--  -->
<template>
  <div id="group-contribution">
    <c-title :hide="false" text="珍惠拼"></c-title>
    <div class="group-contribution-main">
      <div class="main-box">
        <img src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/pearl_img3.png" alt="" />
        <div class="main-box-position">
          <div class="box-left" @click="gotoUrl('groupcblog')">下级{{ info.gxz_name }}明细</div>
          <div class="box-h2">今日{{ info.gxz_name }}</div>
          <div class="box-h1">{{ info.contribution_today }}</div>
          <div class="box-h3" @click="gotoUrl('pastLog')">往日{{ info.gxz_name }}数量 <i class="iconfont icon-advertise-next ico-arrow"></i></div>
        </div>
      </div>
      <div class="total-box">累计奖励金额：￥{{ info.countAmount }}</div>
    </div>

    <van-tabs v-model="activeName" @click="handleClick" sticky :ellipsis="false" swipeable>
      <van-tab :title="items.name" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <li class="li" v-for="(item, index) in dataList[ind].list" :key="index">
            <div class="p">
              <div class="left time">{{ item.created_at }}</div>
              <div class="red right">{{ item.dividend_amount }}</div>
            </div>
            <div class="p">
              <div class="left member">
                <img class="avator" :src="item.avatar" alt="" />
                <div class="member-name">{{ item.nickname }}</div>
              </div>
              <div class="right">{{ item.type_name }}</div>
            </div>
          </li>
        </ul>
      </van-tab>
      <yz-blank :datas="dataList[ind] && fun.isTextEmpty(dataList[ind].list)"></yz-blank>
    </van-tabs>
  </div>
</template>

<script>
import yzBlank from "components/ui_components/yz_blank";
import { Toast } from "vant";
import { scrollMixin } from "utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      info: {},
      activeName: 0,
      dataList: [],
      titleArr: [],
      isLoadMore: true
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  components: {
    yzBlank
  },
  computed: {},
  methods: {
    init() {
      this.dataList = [];
      this.titleArr = [
        {
          name: "奖励记录",
          url: "plugin.channel.frontend.award.getShipmentList"
        }
      ];
      this.isLoadMore = true;
      this.setNewArr();
    },
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: [],
          url: val.url
        });
      });
      this.handleClick();
    },
    handleClick() {
      let that = this;
      // if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
      //   that.isLoadMore = this.dataList[that.activeName].isLoadMore;
      //   return;
      // }

      $http
        .post("plugin.zhp-group-lottery.frontend.contribution.get-reward-list", { page: 1 }, "")
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], "isLoadMore", true);
            that.$set(this.dataList[that.activeName], "total_page", response.data.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], "total_page", 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], "list", response.data.data);
          } else {
            that.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      $http
        .post("plugin.zhp-group-lottery.frontend.contribution.index", {}, "加载中")
        .then(response => {
          if (response.result === 1) {
            this.info = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(err => {
          console.log(err);
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
        let _json = {};
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get("plugin.zhp-group-lottery.frontend.contribution.get-reward-list", _json, "加载中").then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
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
    gotoUrl(name, params = {}) {
      this.$router.push(this.fun.getUrl(name, params));
    }
  }
};
</script>
<style lang="scss" scoped>
#group-contribution {
  .group-contribution-main {
    background-color: #fff;
    padding: 0.875rem 0;
    margin-bottom: 0.875rem;

    .main-box {
      width: 90%;
      height: auto;
      margin: 0 auto;
      position: relative;
      color: #fff;

      img {
        width: 100%;
        object-fit: contain;
      }

      .main-box-position {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        padding: 1.875rem 1.25rem;
        text-align: left;

        .box-left {
          position: absolute;
          right: 1px;
          top: 0.875rem;
          // width: 5rem;
          padding: 0 8px;
          height: 1.125rem;
          background-color: rgba($color: #ffaf5f, $alpha: 0.8);
          border-radius: 0.5rem 0 0 0.5rem;
          font-size: 0.75rem;
          text-align: center;
        }

        .box-h1 {
          padding-top: 0.375rem;
          font-size: 1.75rem;
          color: #fef8ee;
        }

        .box-h3 {
          padding: 0 0.41rem;
          padding-right: 0;
          height: 1.44rem;
          border-radius: 0.19rem;
          border: solid 0.03rem #fff;
          float: right;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: -0.6rem;
        }
      }
    }

    .total-box {
      color: #f14e4e;
      text-align: left;
      font-size: 14px;
      padding: 0 0.875rem;
    }
  }

  .red {
    color: #f0201f;
  }

  .time {
    color: #8e8e8e;
  }

  .content {
    font-size: 15px;
    padding-bottom: 1rem;
    background: #fff;

    .li {
      padding: 1rem 1rem 0 1rem;
      line-height: 1rem;
      display: flex;
      flex-direction: column;

      .p {
        display: flex;
        margin-bottom: 0.3rem;

        span {
          display: inline-block;
        }
      }

      .member {
        display: flex;
        align-items: center;
        font-size: 10px;
        overflow: hidden;
        flex: 1;

        .avator {
          width: 1rem;
          height: 1rem;
          background-color: #dedede;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          margin: 0 0.375rem 0 0;
        }

        .member-name {
          text-align: left;
          flex: 1;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .right {
        flex: 1;
        text-align: right;
      }
    }
  }
}
</style>
