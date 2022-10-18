<!-- 管理奖 柯怡 -->
<template >
  <div id="subsidy_manage">
    <c-title :hide="false"
             text="津贴管理"></c-title>
    <div class="content">
      <div class="background">
        <div class="user">
          <div class="user-head">
            <img :src="member.avatar_image">
          </div>
          <div class="user-name">{{member.nickname}}</div>
        </div>
      </div>
      <div class="absolute-block">
        <div class="left">
          <span class="first"><b>{{member.level_name}}</b></span>
          <span class="second">经销商等级</span>
        </div>
        <div class="line"></div>
        <div class="right">
          <span class="first"><b>{{total_amount}}</b></span>
          <span class="second">累计奖励</span>
        </div>
      </div>
      <div class="list">
        <div id="tabs">
          <div class="tab-first tab"
               @click="change(item)"
               v-for="(item,index) in arr"
               :key="index"
               :class="[current==item.id ? 'bgColor' : '']">
            <span>{{item.text}}</span>
          </div>
        </div>
        <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
          <div class="award-list"
               :class="[dividend.length>0 ? 'bgBai' : '']">
            <ul>
              <li class="list-item"
                  v-for="(item,index) in dividend"
                  :key='index'>
                <div class="block">
                  <div class="left">
                    <div>奖励ID：{{item.id}}</div>
                    <div class="date">{{item.created_at}}</div>
                  </div>
                  <div class="right">
                    <span>{{item.dividend_amount}}元</span>
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
import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from '../../../utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      isLoading:false,
      current: 0,
      dividend: [],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      member: {},
      total_amount: '',
      arr: [
        {
          id: 0,
          text: '管理奖'
        },
        {
          id: 1,
          text: '平级奖'
        }
      ]
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
      // this.$refs.award_loadmore.onTopLoaded()
    },
    change(item) {
      this.current = item.id;
      this.initData();
      this.getData();
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
      let url = 'plugin.distributor-manage.api.dividend.index';
      let json = {
        page: 1,
        dividend_type: this.current
      };
      $http.get(url, json, '获取中').then(
        response => {
          if (response.result == 1) {
            that.total_amount = response.data.total_amount;
            that.member = response.data.member;
            that.isLoadMore = true;
            that.total_page = response.data.dividend.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.dividend = response.data.dividend.data;
            that.isLoading = false;
          } else {
            Toast(response.msg);
            that.isLoading = false;
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
      let url = 'plugin.distributor-manage.api.dividend.index';
      if (this.page === this.total_page) {
        return;
      }
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          page: this.page,
          dividend_type: this.current
        };
        this.page = this.page + 1;
        $http.get(url, json, '加载中').then(
          function(response) {
            if (response.result === 1) {
              that.isLoadMore = true;
              that.total_page = response.data.dividend.last_page;
              var nextPageData = res.data.dividend.data;
              that.dividend = that.dividend.concat(nextPageData);
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
#subsidy_manage {
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
        width: 49%;
        text-align: right;
        color: #999;
        margin-bottom: 0.625rem;
      }

      .left {
        width: 50%;
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
        width: 49%;
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
          content: '';
          position: absolute;
          right: 0;
          width: 0;
          height: 2rem;
          border-bottom: 2rem solid #fff;
          border-left: 0.6rem solid transparent;
        }

        .tab-second::before {
          content: '';
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
