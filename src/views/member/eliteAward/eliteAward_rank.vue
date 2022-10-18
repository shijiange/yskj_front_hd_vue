<!-- 精英奖排行榜 -->
<template>
  <div id="eliteAward_rank">
    <c-title :hide="false" text="排行榜记录"></c-title>
    <van-tabs type="card" class="my_style" v-model="activeCycle" @click="getRateList">
      <van-tab :title="`${edition[0].edition}期排行`">
        <van-tabs v-model="activeRate" sticky @click="getRateList">
          <van-tab :title="`${item.level_name}排行榜`" v-for="(item, index) in titleArr" :key="index">
            <c-eliteAwardList
              :datas="left_dataList[index].list || []"
              v-if="!fun.isTextEmpty(left_dataList[index])"
              :is_reward="is_reward"
              :is_achievement="is_achievement"
            ></c-eliteAwardList>
          </van-tab>
        </van-tabs>
      </van-tab>
      <van-tab :title="`${edition[1].edition}期排行`" v-if="edition.length > 1">
        <van-tabs v-model="activeRate1" sticky @click="getRateList">
          <van-tab :title="`${item.level_name}排行榜`" v-for="(item, index) in titleArr" :key="index">
            <c-eliteAwardList
              :datas="right_dataList[index].list || []"
              v-if="!fun.isTextEmpty(right_dataList[index])"
              :is_reward="is_reward"
              :is_achievement="is_achievement"
            ></c-eliteAwardList>
          </van-tab>
        </van-tabs>
      </van-tab>
    </van-tabs>
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
      activeCycle: '0',
      activeRate: '0',
      activeRate1: '0',
      isLoadMore: true,
      left_dataList: [],
      right_dataList: [],
      titleArr: [],
      edition: [{ edition: '' }],

      is_reward: true, //是否显示奖励
      is_achievement: true //是否显示业绩
    };
  },

  components: { cTitle, cEliteAwardList },
  computed: {},
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let that = this;
      $http.post('plugin.elite-award.api.index.ranking-log', {}, '').then(
        response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.titleArr = response.data.level;
            this.edition = response.data.edition;
            that.is_reward = response.data.set.is_reward == '1' ? true : false;
            that.is_achievement = response.data.set.is_achievement == '1' ? true : false;

            this.titleArr.forEach((val, index) => {
              this.left_dataList.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: []
              });
              this.right_dataList.push({
                isLoadMore: true,
                page: 1,
                total_page: 0,
                list: []
              });
            });

            that.$set(this.left_dataList[0], 'isLoadMore', true);
            that.$set(this.left_dataList[0], 'total_page', response.data.data.last_page);
            if (!this.left_dataList[0].total_page) {
              that.$set(this.left_dataList[0], 'total_page', 0);
              this.left_dataList[0].total_page = 0;
            }
            that.$set(this.left_dataList[0], 'list', response.data.data.data);

            console.log(this.left_dataList);
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    getRateList() {
      let that = this;
      let _avticeTag = this.activeCycle == 0 ? that.activeRate : that.activeRate1;
      if (this.activeCycle == 0 && !this.fun.isTextEmpty(this.left_dataList[_avticeTag].list)) {
        that.isLoadMore = this.left_dataList[_avticeTag].isLoadMore;
        return;
      }
      if (this.activeCycle == 1 && !this.fun.isTextEmpty(this.right_dataList[_avticeTag].list)) {
        that.isLoadMore = this.right_dataList[_avticeTag].isLoadMore;
        return;
      }
      console.log(22222);
      $http
        .post(
          'plugin.elite-award.api.index.ranking-log-page',
          {
            page: 1,
            search: {
              level_id: this.titleArr[_avticeTag].id,
              statistics_id: this.edition[this.activeCycle].id
            }
          },
          ''
        )
        .then(
          response => {
            if (response.result === 1) {
              that.isLoadMore = true;
              if (this.activeCycle == 0) {
                that.$set(this.left_dataList[_avticeTag], 'isLoadMore', true);
                that.$set(this.left_dataList[_avticeTag], 'total_page', response.data.last_page);
                if (!this.left_dataList[_avticeTag].total_page) {
                  that.$set(this.left_dataList[_avticeTag], 'total_page', 0);
                  this.left_dataList[_avticeTag].total_page = 0;
                }
                that.$set(this.left_dataList[_avticeTag], 'list', response.data.data);
              } else {
                that.$set(this.right_dataList[_avticeTag], 'isLoadMore', true);
                that.$set(this.right_dataList[_avticeTag], 'total_page', response.data.last_page);
                if (!this.right_dataList[_avticeTag].total_page) {
                  that.$set(this.right_dataList[_avticeTag], 'total_page', 0);
                  this.right_dataList[_avticeTag].total_page = 0;
                }
                that.$set(this.right_dataList[_avticeTag], 'list', response.data.data);
              }

              console.log(this.left_dataList, this.right_dataList);
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
      let _avticeTag = this.activeCycle == 0 ? that.activeRate : that.activeRate1;
      if (that.activeCycle == 0) {
        that.left_dataList[_avticeTag].isLoadMore = false;
      } else {
        that.right_dataList[_avticeTag].isLoadMore = false;
      }
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.activeCycle == 0 && that.left_dataList[_avticeTag].page >= that.left_dataList[_avticeTag].total_page) {
        return;
      } else if (
        that.activeCycle == 1 &&
        that.right_dataList[_avticeTag].page >= that.right_dataList[_avticeTag].total_page
      ) {
        return;
      } else {
        if (that.activeCycle == 0) {
          that.left_dataList[_avticeTag].page = that.left_dataList[_avticeTag].page + 1;
        } else {
          that.right_dataList[_avticeTag].page = that.right_dataList[_avticeTag].page + 1;
        }

        $http
          .post(
            'plugin.elite-award.api.index.ranking-log-page',
            {
              page: that.activeCycle == 0 ? that.left_dataList[_avticeTag].page : that.right_dataList[_avticeTag].page,
              search: {
                level_id: that.titleArr[_avticeTag].id,
                statistics_id: that.edition[that.activeCycle].id
              }
            },
            '加载中'
          )
          .then(
            response => {
              that.isLoadMore = true;
              if (that.activeCycle == 0) {
                that.left_dataList[_avticeTag].isLoadMore = true;
              } else {
                that.right_dataList[_avticeTag].isLoadMore = true;
              }
              if (response.result === 1) {
                var myData = response.data.data;
                if (that.activeCycle == 0) {
                  that.left_dataList[_avticeTag].list = that.left_dataList[_avticeTag].list.concat(myData); //数组拼接
                } else {
                  that.right_dataList[_avticeTag].list = that.right_dataList[_avticeTag].list.concat(myData); //数组拼接
                }
              } else {
                if (that.activeCycle == 0) {
                  that.left_dataList[_avticeTag].page = that.left_dataList[_avticeTag].page - 1;
                  that.left_dataList[_avticeTag].isLoadMore = false;
                } else {
                  that.right_dataList[_avticeTag].page = that.right_dataList[_avticeTag].page - 1;
                  that.right_dataList[_avticeTag].isLoadMore = false;
                }
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
#eliteAward_rank {
  background: #fff;

  .my_style {
    margin: 1rem auto;

    /deep/.van-tabs__wrap {
      margin-bottom: 1rem;
    }

    /deep/.van-tabs__wrap::after {
      border: none;
    }

    /deep/.van-tabs__nav--card {
      width: 13rem;
      margin: 0 auto;
      border-radius: 1rem;
      background-color: #fafafa;
      border: none;
      overflow: hidden;

      .van-tab {
        border: none;
        color: #666;
      }

      .van-tab--active {
        border-radius: 1rem;
        color: #fff;
      }
    }
  }
}
</style>
