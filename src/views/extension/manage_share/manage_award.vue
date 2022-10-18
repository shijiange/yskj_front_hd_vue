<!-- 管理奖 柯怡 -->
<template >
  <div id="manage_award">
    <c-title :hide="false"
             :text="bonus.plugin_name?bonus.plugin_name:'管理奖'"></c-title>
    <div class="content">
      <div class="background">
        <div class="user">
          <div class="user-head">
            <img :src="bonus.avatar">
          </div>
          <div class="user-name">{{bonus.nickname}}</div>
        </div>
      </div>
      <div class="absolute-block">
        <div class="top_left">考核标准</div>
        <div class="top_right">{{bonus.audit_standard}}</div>
        <div class="left">
          <span class="first"><b>{{bonus.hierarchy}}</b></span>
          <span class="second">{{bonus.plugin_name}}单数</span>
        </div>
        <div class="line"></div>
        <div class="right">
          <span class="first"><b>{{bonus.award_amount}}</b></span>
          <span class="second">累计{{bonus.plugin_name}}(元)</span>
        </div>
        <div class="line"></div>
        <div class="right">
          <span class="first"><b>{{bonus.order_amount}}</b></span>
          <span class="second">本月消费</span>
        </div>
      </div>
      <div class="list">
        <div id="tabs">
          <div class="tab-first tab"
               :id='0'
               :class="[current==0 ? 'bgColor' : '']">
            <span>{{bonus.plugin_name}}</span>
          </div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <div class="award-list"
               :class="[dividend.length>0 ? 'bgBai' : '']"
               v-show="current==0">
            <ul>
              <li class="list-item"
                  v-for="(item,index) in dividend" :key='index'>
                <div class="block"
                     @click="change(item)">
                  <div class="left">
                    <div>奖励ID：{{item.id}}<i class="stateClass">{{item.state_name}}</i></div>
                    <div class="date">{{item.created_at}}</div>
                  </div>
                  <div class="right">
                    <span>{{item.money}}元</span>
                  </div>
                </div>
                <div class="hide"
                     v-show="item.status">
                  <ul>
                    <li><span class="first">前天统计收入金额</span><span><b>{{$i18n.t('money')}}{{item.amount}}</b></span></li>
                    <li><span class="first">比例</span><span><b>{{item.proportion}}%</b></span></li>
                  </ul>
                </div>
              </li>
            </ul>
            <div class="blank"
                 v-if="dividend.length<=0">
              <img src="../../../assets/images/blank.png">
              <span>还没有记录哦</span>
            </div>
          </div>
        </van-pull-refresh>
      </div>
    </div>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "../../../utils/mixin";
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      current: 0,
      bonus: {},
      dividend: [],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },

  activated() {
    this.initData();
    this.current = 0;
    this.getData();
  },

  components: { cTitle },
  computed: {},
  methods: {
    loadTop() {
      this.initData();
      this.getData();
      // this.$refs.award_loadmore.onTopLoaded();
    },
    change(item) {
      item.status = !item.status;
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.bonus = {};
      this.dividend = [];
    },
    getData() {
      let that = this;
      let url = "plugin.manage-award.Frontend.Controllers.page.index";
      let json = {
        page: 1
      };
      $http.get(url, json, "获取中").then(
        response => {
          if (response.result == 1) {
            that.bonus = response.data.base_data;
            that.fun.setWXTitle(that.bonus.plugin_name);
            that.isLoadMore = true;
            that.total_page = response.data.page_list.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }

            if (response.data.page_list.data.length > 0) {
              let arr = [];
              response.data.page_list.data.map((item, index, key) => {
                arr.push(Object.assign({}, item, { status: false }));
              });
              that.dividend = arr;
            }
            that.isLoading = false;
          } else {
            that.isLoading = false;
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getMoreData(page) {
      this.isLoadMore = false; // 防止多次请求分页数据
      let that = this;
      let url = "plugin.manage-award.Frontend.Controllers.page.index";
      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page
        };
        this.page = this.page + 1;
        $http.get(url, json, "加载中").then(
          function(response) {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.page_list.last_page;
              let arr = [];
              response.data.page_list.data.map((item, index, key) => {
                arr.push(Object.assign({}, item, { status: false }));
              });
              that.dividend = that.dividend.concat(arr);
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    }
  }
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#manage_award {
  .content {
    .background {
      width: 100%;
      height: 10rem;
      background: #f15353;
      display: flex;
      padding-top: 1rem;
      justify-content: center;

      .user {
        display: flex;
        flex-direction: column;
        align-items: center;

        .user-head {
          height: 4rem;
          width: 4rem;
          background: #fff;
          border-radius: 50%;
          border: 0.125rem solid #fff;
          box-sizing: border-box;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .user-head img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .user-name {
          font-size: 16px;
          color: #fff;
          width: 8.5rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }
    }

    .absolute-block {
      width: 22rem;
      background-color: #fff;
      border-radius: 0.5rem;
      margin: 0 auto;
      transform: translateY(-40%);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding: 0.8rem 1rem;

      .top_left {
        width: 50%;
        text-align: left;
        color: #999;
        margin-bottom: 0.625rem;
      }

      .top_right {
        width: 50%;
        text-align: right;
        color: #999;
        margin-bottom: 0.625rem;
      }

      .left {
        width: 33%;
        display: flex;
        flex-direction: column;

        .first {
          color: #000;
          font-size: 16px;
        }

        .second {
          font-size: 12px;
          color: #333;
        }
      }

      .right {
        width: 33%;
        display: flex;
        flex-direction: column;

        .first {
          color: #000;
          font-size: 16px;
        }

        .second {
          font-size: 12px;
          color: #333;
        }
      }

      .line {
        height: 3rem;
        width: 1px;
        background-color: #d1d1d1;
      }
    }

    .list {
      width: 22rem;
      margin: 0 auto;
      border-radius: 0.5rem;
      margin-top: -1rem;
      margin-bottom: 1rem;
      background: #fff;

      #tabs {
        width: 100%;
        display: flex;

        .tab {
          height: 2rem;
          line-height: 2rem;
          background-color: rgba(244, 244, 244, 0.7);
          color: #aaa;
          font-size: 14px;
          width: 100%;
          position: relative;

          span {
            line-height: 2rem;
            display: inline-block;
          }
        }

        .tab:first-child {
          border-top-left-radius: 0.5rem;
        }

        .tab:last-child {
          border-top-right-radius: 0.5rem;
        }

        .tab-first::after {
          content: "";
          position: absolute;
          right: 0;
          width: 0;
          height: 2rem;
          border-bottom: 2rem solid #fff;
          border-left: 0.6rem solid transparent;
        }

        .tab-second::before {
          content: "";
          position: absolute;
          left: 0;
          width: 0;
          height: 2rem;
          border-bottom: 2rem solid #fff;
          border-right: 0.6rem solid transparent;
        }
      }

      .award-list {
        padding: 1rem;
        text-align: left;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;

        ul {
          .list-item {
            display: flex;
            flex-wrap: wrap;
            border-bottom: solid 1px #f3f3f3;
            padding-bottom: 1rem;
            padding-top: 1rem;

            .list-item:first-child {
              padding-top: 0;
            }

            .block {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .left {
              .stateClass {
                border: 1px solid #ff6000;
                color: #ff6000;
                border-radius: 0.438rem;
                font-size: 12px;
                padding: 0 0.25rem;
                margin-left: 0.25rem;
              }

              .date {
                color: #c1c1c1;
                font-size: 12px;
                margin-top: 0.2rem;
              }
            }

            .right {
              font-size: 18px;
              color: #ff6000;
            }

            .hide {
              display: flex;
              justify-content: center;
              width: 100%;
              padding-top: 1rem;

              ul {
                display: flex;
                width: 100%;

                li {
                  display: flex;
                  width: 50%;
                  justify-content: center;
                  flex-direction: column;
                  text-align: center;
                  border-right: solid 1px #f6d331;

                  .first {
                    margin-bottom: 0.5rem;
                  }
                }

                li:last-child {
                  border-right: none;
                }
              }
            }
          }
        }
      }

      .care-list {
        padding: 1rem;
        text-align: left;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;

        ul {
          .list-item {
            display: flex;
            flex-wrap: wrap;
            border-bottom: solid 1px #f3f3f3;
            padding-bottom: 1rem;
            padding-top: 1rem;

            .list-item:first-child {
              padding-top: 0;
            }

            .block {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }

            .left {
              .date {
                color: #c1c1c1;
                font-size: 12px;
                margin-top: 0.2rem;
              }
            }

            .right {
              font-size: 18px;
              color: #ff6000;
            }

            .hide {
              display: flex;
              justify-content: center;
              width: 100%;
              padding-top: 1rem;

              ul {
                display: flex;
                width: 100%;

                li {
                  display: flex;
                  width: 25%;
                  justify-content: center;
                  flex-direction: column;
                  text-align: center;
                  border-right: solid 1px #f6d331;

                  .first {
                    margin-bottom: 0.5rem;
                  }
                }

                li:last-child {
                  border-right: none;
                }
              }
            }
          }
        }
      }
    }

    .blank {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        width: 6rem;
        height: 6rem;
      }

      span {
        margin-top: 15px;
        color: #ccc;
        font-size: 14px;
      }
    }
  }

  .bgColor {
    background-color: #fff !important;
    color: #ff7459 !important;

    span {
      border-bottom: 2px solid #ff7459;
    }
  }

  .bgBai {
    background-color: #fff;
  }
}
</style>
