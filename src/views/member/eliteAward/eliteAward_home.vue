<!-- 精英奖入口 -->
<template>
  <div id="eliteAward_home">
    <c-title :hide="false" text="精英奖" :url="'member'"></c-title>
    <div class="top_main">
      <div class="member_info">
        <img :src="info.avater || ''" alt="" />
        <div class="nickname">{{ info.nickname || '' }}</div>
      </div>
      <div class="number_info">
        <div class="number_info_child">
          <div class="number_info_c_total">{{ info.achievement }}</div>
          <div class="number_info_c_name">业绩(元)</div>
        </div>
        <div class="number_info_child">
          <div class="number_info_c_total">{{ info.ranking }}</div>
          <div class="number_info_c_name">排名</div>
        </div>
        <div class="number_info_child">
          <div class="number_info_c_total">{{ info.total }}</div>
          <div class="number_info_c_name">累计金额(元)</div>
        </div>
      </div>
    </div>
    <div class="list_main">
      <router-link :to="fun.getUrl('eliteAwardRecord', {})" class="list_main_child" tag="div">
        <div class="icon_box">
          <i class="iconfont icon-elite_record icon-elite_record_bg"></i>
        </div>
        <div class="name">精英奖记录</div>
        <i class="fa fa-angle-right"></i>
      </router-link>
      <router-link :to="fun.getUrl('eliteAwardRank', {})" class="list_main_child" tag="div">
        <div class="icon_box">
          <i class="iconfont icon-ranking_record icon-elite_record_bg1"></i>
        </div>
        <div class="name">排行榜记录</div>
        <i class="fa fa-angle-right"></i>
      </router-link>
    </div>
    <div class="awrad_main" v-if="!fun.isTextEmpty(titleLevel)">
      <van-tabs v-model="active" sticky class="aaa" @click="getList">
        <van-tab :title="item.level_name" v-for="(item, index) in titleLevel" :key="index">
          <c-eliteAwardList
            :datas="list[index].list"
            :is_reward="is_reward"
            :is_achievement="is_achievement"
          ></c-eliteAwardList>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
import cEliteAwardList from './c_eliteAwardList';
import { scrollMixin } from 'utils/mixin';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      active: '0',
      info: {
        avater: '',
        nickname: '',
        achievement: null,
        total: null,
        ranking: null,
        statistics_id: null
      },
      list: [],
      titleLevel: [],

      is_reward: true, //是否显示奖励
      is_achievement: true, //是否显示业绩

      isLoadMore: false
    };
  },

  activated() {
    window.scrollTo(0, 0);
  },

  components: { cTitle, cEliteAwardList },

  computed: {},

  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      let that = this;
      $http.post('plugin.elite-award.api.index.index', {}).then(
        function(response) {
          if (response.result == 1) {
            let _data = response.data;
            that.info.avater = _data.data.member.avatar_image;
            that.info.nickname = _data.data.member.nickname;
            that.info.achievement = _data.data.achievement;
            that.info.total = _data.total;
            that.info.ranking = _data.ranking;
            that.statistics_id = _data.statistics_id;
            that.titleLevel = _data.level;
            that.is_reward = _data.set.is_reward == '1' ? true : false;
            that.is_achievement = _data.set.is_achievement == '1' ? true : false;

            _data.level.forEach((val, index) => {
              that.list.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: []
              });
            });
            that.setData(_data.levelData);
          }
        },
        function(response) {}
      );
    },

    setData(_data) {
      let that = this;
      that.isLoadMore = true;
      that.$set(this.list[that.active], 'isLoadMore', true);
      that.$set(this.list[that.active], 'total_page', _data.last_page);
      if (!this.list[that.active].total_page) {
        that.$set(this.list[that.active], 'total_page', 0);
        that.list[that.active].total_page = 0;
      }
      that.$set(this.list[that.active], 'list', _data.data);
      console.log(that.list);
    },

    getList() {
      let that = this;
      if (!this.fun.isTextEmpty(this.list[that.active].list)) {
        that.isLoadMore = this.list[that.active].isLoadMore;
        return;
      }

      $http
        .post(
          'plugin.elite-award.api.index.get-page',
          {
            search: {
              level_id: that.titleLevel[that.active].id,
              statistics_id: that.statistics_id
            }
          },
          '加载中'
        )
        .then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              that.setData(response.data);
            }
          },
          function(response) {
            // error callback
          }
        );
    },

    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      that.list[that.active].isLoadMore = false;
      if (that.list[that.active].page >= that.list[that.active].total_page) {
        return;
      } else {
        that.list[that.active].page = that.list[that.active].page + 1;
        $http
          .post(
            'plugin.elite-award.api.index.get-page',
            {
              page: that.list[that.active].page,
              search: {
                level_id: that.titleLevel[that.active].id,
                statistics_id: that.statistics_id
              }
            },
            '加载中'
          )
          .then(
            response => {
              that.isLoadMore = true;
              that.list[that.active].isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.list[that.active].list = that.list[that.active].list.concat(myData); //数组拼接
              } else {
                that.list[that.active].page = that.list[that.active].page - 1;
                that.list[that.active].isLoadMore = false;
                that.isLoadMore = false;
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
<style lang="scss" rel="stylesheet/scss" scoped>
#eliteAward_home {
  .top_main {
    height: 8.125rem;
    background-color: #ee2e2b;
    color: #fff;

    .member_info {
      display: flex;
      padding: 1.125rem 1.875rem;
      align-items: center;

      img {
        width: 2.625rem;
        height: 2.625rem;
        border-radius: 100%;
      }

      .nickname {
        text-align: left;
        flex: 1;
        padding-left: 1rem;
        font-weight: bold;
        font-size: 1rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }
    }

    .number_info {
      display: flex;
      justify-content: space-around;

      .number_info_child {
        width: 30%;
        display: flex;
        flex-direction: column;

        .number_info_c_total {
          font-size: 1rem;
          font-weight: bold;
          padding-bottom: 0.375rem;
        }

        .number_info_c_name {
          font-size: 0.75rem;
        }
      }
    }
  }

  .list_main {
    display: flex;
    height: 6.25rem;
    background: #fff;
    margin-bottom: 0.625rem;

    .list_main_child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50%;
      font-size: 1rem;

      .name {
        padding: 0 0.5rem;
        color: #000;
      }

      .fa {
        font-size: 1.375rem;
        color: #999;
      }
    }

    .icon_box {
      i {
        font-size: 2.25rem;
      }

      .icon-elite_record_bg {
        background-image: -webkit-linear-gradient(bottom, #ff4946, #ff8a66, #ff8a66);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .icon-elite_record_bg1 {
        background-image: -webkit-linear-gradient(bottom, #ffae46, #ffae46, #ff8a66);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}
</style>
