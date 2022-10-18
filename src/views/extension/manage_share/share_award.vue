<!-- 分享奖 柯怡 -->
<template >
  <div id="share_award">
    <c-title :hide="false"
             :text="bonus.plugin_name?bonus.plugin_name:'共享奖'"></c-title>
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
        <div class="top_right">{{bonus.audit_standard?bonus.audit_standard:'0.00'}}</div>
        <div class="right">
          <span class="first"><b>{{bonus.award_amount}}</b></span>
          <span class="second">{{current==0?`累计排序${bonus.plugin_name}`:`累计直推${bonus.plugin_name}`}}(元)</span>
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
               @click="onClick(0)"
               :class="[current==0 ? 'bgColor' : '']">
            <span>排序{{bonus.plugin_name}}</span>
          </div>
          <div class="tab-second tab"
               @click="onClick(1)"
               :id='1'
               :class="[current==1 ? 'bgColor' : '']">
            <span>直推{{bonus.plugin_name}}</span>
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
                    <li><span class="first">贡献会员</span><span><b>{{item.source_member}}</b></span></li>
                    <li><span class="first">贡献金额(元)</span><span><b>{{item.amount}}</b></span></li>
                    <li><span class="first">比例</span><span><b>{{item.proportion}}</b></span></li>
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
        <van-pull-refresh v-model="isLoading" @refresh="careTop" success-text="刷新成功">
          <div class="care-list"
               :class="[care.length>0 ? 'bgBai' : '']"
               v-show="current==1">
            <ul>
              <li class="list-item"
                  v-for="(list,index) in care" :key='index'>
                <div class="block"
                     @click="changeCare(list)">
                  <div class="left">
                    <div>奖励ID：{{list.id}}<i class="stateClass">{{list.state_name}}</i></div>
                    <div class="date">{{list.created_at}}</div>
                  </div>
                  <div class="right">
                    <span>{{list.money}}元</span>
                  </div>
                </div>
                <div class="hide"
                     v-show="list.status">
                  <ul>
                    <li><span class="first">上级会员</span><span><b>{{list.source_member}}</b></span></li>
                    <li><span class="first">累计金额(元)</span><span><b>{{list.amount}}</b></span></li>
                    <li><span class="first">比例</span><span><b>{{list.proportion}}</b></span></li>
                    <li><span class="first">共享人数</span><span><b>{{list.part_count}}</b></span></li>
                  </ul>
                </div>
              </li>
            </ul>
            <div class="blank"
                 v-if="care.length<=0">
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
      care: [],
      isLoadMore: true,
      page: 1,
      total_page: 0,
      carePage: 1,
      care_total_page: 0,
      iscareMore: true,
      isLoading:false
    };
  },

  activated() {
    if (this.$route.name === "shareAward_sort") {
      this.initData();
      this.current = 0;
    } else {
      this.initCare();
      this.current = 1;
    }
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
    careTop() {
      this.initCare();
      this.getData();
      // this.$refs.care_loadmore.onTopLoaded();
    },
    change(item) {
      item.status = !item.status;
    },
    changeCare(list) {
      list.status = !list.status;
    },
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.dividend = [];
    },
    initCare() {
      this.carePage = 1;
      this.care_total_page = 0;
      this.iscareMore = true;
      this.care = [];
    },
    getData() {
      let that = this;
      let url =
        this.current == 0
          ? "plugin.share-award.Frontend.Modules.Award.Controllers.up-records.index"
          : "plugin.share-award.Frontend.Modules.Award.Controllers.down-records.index";
      let json = {
        page: this.current == 0 ? this.page : this.carePage
      };
      $http.get(url, json, "获取中").then(
        response => {
          if (response.result == 1) {
            that.bonus = response.data.base_data;
            that.fun.setWXTitle(that.bonus.plugin_name);
            that.current == 0
              ? (that.isLoadMore = true)
              : (that.iscareMore = true);
            that.current == 0
              ? (that.total_page = response.data.page_list.last_page)
              : (that.care_total_page = response.data.page_list.last_page);

            if (that.current == 0 && !that.total_page) {
              that.total_page = 0;
            } else if (that.current == 1 && !that.care_total_page) {
              that.care_total_page = 0;
            }
            if (that.current == 0) {
              if (response.data.page_list.data.length > 0) {
                let arr = [];
                response.data.page_list.data.map((item, index, key) => {
                  arr.push(Object.assign({}, item, { status: false }));
                });
                that.dividend = arr;
              }
            } else if (that.current == 1) {
              if (response.data.page_list.data.length > 0) {
                let arr = [];
                response.data.page_list.data.map((item, index, key) => {
                  arr.push(Object.assign({}, item, { status: false }));
                });
                that.care = arr;
              }
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
      let that = this;
      let url =
        this.current == 0
          ? "plugin.share-award.Frontend.Modules.Award.Controllers.up-records.index"
          : "plugin.share-award.Frontend.Modules.Award.Controllers.down-records.index";
      if (this.current == 0) {
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
                that.total_page = response.data.dividend.last_page;
                let arr = [];
                response.data.dividend.data.map((item, index, key) => {
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
      } else if (this.current == 1) {
        console.log(this.care_total_page);
        if (this.carePage === this.care_total_page) {
          return;
        }
        if (this.carePage >= this.care_total_page) {
          return;
        } else {
          this.carePage = this.carePage + 1;
          let json = {
            page: this.carePage
          };

          $http.get(url, json, "加载中").then(
            function(response) {
              if (response.result === 1) {
                that.care_total_page = response.data.last_page;
                let arr = [];
                response.data.data.map((item, index, key) => {
                  arr.push(Object.assign({}, item, { status: false }));
                });
                that.care = that.care.concat(arr);
              } else {
                that.carePage = that.carePage - 1;
                that.iscare;
                More = false;
                return;
              }
            },
            function(response) {
              // error callback
            }
          );
        }
      }
    },
    onClick(index) {
      this.current = index;
      if (index == 0) {
        this.initData();
      } else if (index == 1) {
        this.initCare();
      }
      let tab = document.getElementById("tabs");
      let tabChild = tab.getElementsByClassName("tab");
      this.current = tabChild[index].getAttribute("id");
      this.getData();
    }
  }
};
</script>
<style lang='scss' rel='stylesheet/scss' scoped>
#share_award {
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

      #tabs {
        width: 100%;
        display: flex;

        .tab {
          height: 2rem;
          line-height: 2rem;
          background-color: #fff;
          color: #aaa;
          font-size: 14px;
          width: 50%;
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
            padding-bottom: 0.625rem;
            padding-top: 0.625rem;

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
                margin-top: 0.35rem;
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
                  width: 33.3%;
                  justify-content: center;
                  flex-direction: column;
                  text-align: center;
                  font-size: 12px;
                  border-right: solid 1px #e1e1e1;

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
            padding-bottom: 0.625rem;
            padding-top: 0.625rem;

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
                margin-top: 0.35rem;
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
                  font-size: 12px;
                  justify-content: center;
                  flex-direction: column;
                  text-align: center;
                  border-right: solid 1px #e1e1e1;

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