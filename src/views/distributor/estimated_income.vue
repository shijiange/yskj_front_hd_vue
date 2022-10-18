<!-- 渠道商 预估收益 -->
<template>
  <div id="estimated_income">
    <c-title :hide="false" :text="'预估收益'"> </c-title>
    <van-tabs v-model="activeName" @change="handleClick" sticky :ellipsis="false" swipeable>
      <van-tab :title="items" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="dataList[activeName] && !fun.isTextEmpty(dataList[activeName].list)">
          <li v-for="(item, index) in dataList[activeName].list" :key="index" @click.stop="gotoDetail(item.id)">
            <p>
              <span class="left">订单号：{{ item.order_sn }}</span
              ><span class="red right">{{ item.status_name }}</span>
            </p>
            <!-- <p>
              <span class="member left"
                >接单人：<img
                  class="avator"
                  :src="item.parent_member ? item.parent_member.avatar_image : ''"
                  alt=""
                />{{ item.parent_member.nickname }}</span
              ><span class="right"><i class="iconfont icon-advertise-next"></i></span>
            </p> -->
            <p>
              <span class="left">等级：{{ item.parent_level ? item.parent_level.level_name : '' }}</span>
            </p>
          </li>
        </ul>
        <img
          v-if="dataList[activeName] && fun.isTextEmpty(dataList[activeName].list)"
          src="../../assets/images/blank.png"
          alt=""
          style="width: 5rem; margin: 2rem auto;"
        />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { scrollMixin } from 'utils/mixin';
export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      activeName: 0,
      titleArr: ['全部', '发放中', '待结算', '已结算', '已失效'],
      dataList: [],

      isLoadMore: true
    };
  },

  activated() {
    this.setNewArr();
  },

  components: {},

  computed: {},
  methods: {
    setNewArr() {
      this.titleArr.forEach((val, index) => {
        this.dataList.push({
          isLoadMore: true,
          page: 1,
          total_page: 0,
          list: []
        });
      });
      console.log('dataList:::', this.dataList);
      this.handleClick();
    },
    handleClick() {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }

      $http
        .post('plugin.channel.frontend.predict.getList', { page: 1, status: that.activeName }, '')
        .then(response => {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.$set(this.dataList[that.activeName], 'isLoadMore', true);
            that.$set(this.dataList[that.activeName], 'total_page', response.data.list.last_page);
            if (!this.dataList[that.activeName].total_page) {
              that.$set(this.dataList[that.activeName], 'total_page', 0);
              this.dataList[that.activeName].total_page = 0;
            }
            that.$set(this.dataList[that.activeName], 'list', response.data.list.data);
          } else {
            MessageBox.alert(response.msg, '提示');
          }
        })
        .catch(error => {
          console.log(error);
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
        let _json = {
          status: that.activeName
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get('plugin.channel.frontend.predict.getList', _json, '加载中').then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.list.data;
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
    gotoDetail(_id) {
      this.$router.push(this.fun.getUrl('estimatedIncomeDetail', { id: _id }));
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#estimated_income {
  .content {
    padding: 0.875rem;

    li {
      margin-bottom: 0.625rem;
      background: #fff;
      border-radius: 0.625rem;
      overflow: hidden;
      padding: 0.5rem;

      p {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 1.25rem;
        text-align: left;
        font-size: 0.75rem;

        span {
          display: block;
        }

        .left {
          flex: 1;
          display: flex;
          align-items: center;

          .avator {
            width: 1.125rem;
            height: 1.125rem;
            border-radius: 50%;
            margin: 0 0.25rem 0 0;
          }
        }

        .red {
          color: #f14e4e;
        }
      }
    }
  }
}
</style>
