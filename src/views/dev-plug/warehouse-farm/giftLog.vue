<!-- 查看记录-我发送的、领取的 -->
<template>
  <div id="warehouse-farm-log">
    <c-title :hide="false" text="送礼物"></c-title>
    <van-tabs v-model="activeName" sticky :ellipsis="false" swipeable>
      <van-tab :title="titleArr[0].name">
        <van-pull-refresh v-model="dataList[0].refreshing" @refresh="onRefresh">
          <van-list v-model="dataList[0].loading" :finished="dataList[0].finished" finished-text="没有更多了" @load="onLoad()">
            <div class="list" v-if="dataList[0] && !fun.isTextEmpty(dataList[0].list)">
              <div class="list-child" v-for="(item, index) in dataList[0].list" :key="index" @click.stop="toUrl('warehouseFarmGiftDetail', { mode: 'receiving' }, { records_id: item.id })">
                <div class="top-box">
                  <div class="time">创建时间：{{ item.created_at }}</div>
                  <div class="status">{{ item.status_name }}</div>
                </div>
                <div class="list-item" v-if="item.has_one_goods">
                  <img class="good-img" :src="item.has_one_goods.thumb" alt="" />
                  <div class="item-right">
                    <div class="title">{{ item.has_one_goods.title }}</div>
                    <div class="good-info">
                      <div class="stock"></div>
                      <div class="button" v-if="item.status == 0"><i class="iconfont icon-zb_all_share"></i></div>
                    </div>
                  </div>
                </div>
                <div v-show="activeName == 0">
                  <div class="receive-member">已领取数量：{{ item.already_nums }}/{{ item.goods_num }}</div>
                  <div class="receive-member">已领取人数：{{ item.person_num }}/{{ item.share_num }}</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab :title="titleArr[1].name">
        <van-pull-refresh v-model="dataList[1].refreshing" @refresh="onRefresh">
          <van-list v-model="dataList[1].loading" :finished="dataList[1].finished" finished-text="没有更多了" @load="onLoad()">
            <div class="list" v-if="dataList[1] && !fun.isTextEmpty(dataList[1].list)">
              <div class="list-child" v-for="(item, index) in dataList[1].list" :key="index" @click.stop="toUrl('warehouseFarmGiftDetail', { mode: 'getgift' }, { records_id: item.id })">
                <div class="top-box">
                  <div class="time">创建时间：{{ item.created_at }}</div>
                  <div class="status">{{ item.status_name }}</div>
                </div>
                <div class="list-item" v-if="item.belongs_to_gift && item.belongs_to_gift.has_one_goods">
                  <img class="good-img" :src="item.belongs_to_gift.has_one_goods.thumb" alt="" />
                  <div class="item-right">
                    <div class="title">{{ item.belongs_to_gift.has_one_goods.title }}</div>
                    <div class="good-info">
                      <div class="stock">领取数量：{{ item.nums }}</div>
                      <div class="button" v-if="item.belongs_to_gift.status == 0"><i class="iconfont icon-zb_all_share"></i></div>
                    </div>
                  </div>
                </div>
                <div class="receive-member" v-if="item.belongs_to_gift && item.belongs_to_gift.has_one_give">
                  发送会员：<img class="avatar" :src="item.belongs_to_gift.has_one_give.avatar_image" alt="" />
                  <div style="color: #3d3d3d;">{{ item.belongs_to_gift.has_one_give.nickname }}</div>
                </div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 0,
      dataList: [],
      titleArr: [
        {
          name: "我送出的",
          url: "plugin.warehouse.frontend.controllers.gift.records.give"
        },
        {
          name: "我领取的",
          url: "plugin.warehouse.frontend.controllers.gift.records.receive"
        }
      ],
      isLoadMore: true
    };
  },

  activated() {},

  components: {},

  computed: {},

  mounted() {},
  created() {
    if (this.$route.params.tag) {
      this.activeName = 1;
    }
    this.init();
  },
  methods: {
    init() {
      this.dataList = [
        {
          loading: false,
          finished: false,
          refreshing: false,
          page: 1,
          list: [],
          url: "plugin.warehouse.frontend.controllers.gift.records.give"
        },
        {
          loading: false,
          finished: false,
          refreshing: false,
          page: 1,
          list: [],
          url: "plugin.warehouse.frontend.controllers.gift.records.receive"
        }
      ];
    },
    toUrl(_name, _params = {}, _query = {}) {
      if (_name) this.$router.push(this.fun.getUrl(_name, _params, _query));
    },
    handleClick() {
      $http
        .post(this.dataList[this.activeName].url, { page: this.dataList[this.activeName].page }, "")
        .then(response => {
          this.dataList[this.activeName].loading = false;
          this.dataList[this.activeName].refreshing = false;
          if (response.result === 1) {
            let _list = this.dataList[this.activeName].list;
            this.$set(this.dataList[this.activeName], "list", _list.concat(response.data.data));
            if (response.data.last_page == response.data.current_page) {
              this.dataList[this.activeName].finished = true;
            }
            this.dataList[this.activeName].page = this.dataList[this.activeName].page + 1;
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onLoad() {
      this.handleClick();
    },
    onRefresh() {
      this.dataList[this.activeName].loading = true;
      this.dataList[this.activeName].finished = false;
      this.dataList[this.activeName].page = 1;
      this.dataList[this.activeName].list = [];
      this.handleClick();
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#warehouse-farm-log {
  .list {
    padding: 0.625rem;
    .list-child {
      padding: 0.625rem;
      border-radius: 0.375rem;
      margin-bottom: 0.625rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      .top-box {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        padding-bottom: 0.625rem;
        .time {
          color: #8a8a8a;
          font-size: 10px;
        }
      }
      .list-item {
        display: flex;

        .good-img {
          width: 4.625rem;
          height: 4.625rem;
          background-color: #9d9d9d;
          border-radius: 0.375rem;
          margin-right: 0.625rem;
        }
        .item-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          .title {
            font-size: 15px;
            color: #2c2c2c;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .good-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .stock {
              color: #8a8a8a;
              font-size: 10px;
            }
            .button {
              .icon-zb_all_share {
                color: #ec8f35;
                font-size: 20px;
              }
            }
          }
        }
      }
      .receive-member {
        margin-top: 0.625rem;
        font-size: 10px;
        display: flex;
        align-items: center;
        color: #8a8a8a;
        .avatar {
          width: 1rem;
          height: 1rem;
          margin: 0;
          border-radius: 50%;
          margin-right: 0.25rem;
        }
      }
    }
  }
}
</style>
