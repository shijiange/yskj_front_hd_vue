<!-- 渠道商推荐升级 -->
<template>
  <div id="recommendUp">
    <c-title :hide="false" text="推荐升级" :url="'distributorIndex'"></c-title>
    <div class="top_member">
      <div class="avater">
        <img :src="member.avatar" alt="" />
      </div>
      <div class="member_main">
        <h2 class="name">{{ member.nickname }}</h2>
        <span class="grade">{{ member.level_name }}</span>
        <p class="number">剩余数量：{{ member.recommend_num }}</p>
      </div>
    </div>
    <div class="updateBox">
      <div class="bold_title">推荐列表</div>
      <div class="btn" @click="gotoSubmit">去推荐</div>
    </div>
    <div class="main">
      <div class="list_titel">
        <div class="list_img"></div>
        <div class="title_1">下级会员信息</div>
        <div class="title_2">时间</div>
        <div class="title_3">等级</div>
        <div class="title_4">状态</div>
      </div>
      <ul class="list">
        <li v-for="(item, index) in list" :key="index">
          <div class="list_img">
            <img :src="item.child_member ? item.child_member.avatar_image : null" alt="" />
          </div>
          <div class="title_1 titleflex_1">
            <div style="display: flex;">
              <div class="member_name">{{ item.child_member ? item.child_member.nickname : '' }}</div>
              <div class="member_id">{{ item.id }}</div>
            </div>
            <div>{{ item.child_member ? item.child_member.mobile : '' }}</div>
          </div>
          <div class="title_2" style="display: flex; flex-direction: column;">
            <div style="font-size: 0.875rem; width: 100%;">{{ item.created_at.substr(0, 4) }}</div>
            <div style="font-size: 0.75rem; width: 100%;">
              {{ item.created_at.substr(5, 7) }}/{{ item.created_at.substr(8, 10) }}
            </div>
          </div>
          <div class="title_3">{{ item.child_level ? item.child_level.level_name : '' }}</div>
          <div class="title_4" style="color: #ff2c29;">{{ item.status_name }}</div>
        </li>
      </ul>
      <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="fun.isTextEmpty(list)" />
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      member: {},
      list: [],
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0
    };
  },
  components: {
    cTitle
  },
  computed: {},
  mounted() {
    this.getOpen();
    this.getData();
  },
  methods: {
    getOpen() {
      let that = this;
      $http
        .post('plugin.channel.frontend.recommend.set.getOpen', {}, '')
        .then(response => {
          if (response.result === 1) {
            if (response.data.is_open == '0') {
              Toast('没有开启推荐升级！');
              that.$router.push(that.fun.getUrl('distributorIndex', {}));
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      $http
        .post('plugin.channel.frontend.recommend.center', {}, '')
        .then(response => {
          if (response.result === 1) {
            this.member = response.data.member;
            this.list = response.data.recommend_list.data;
            this.isLoadMore = true;
            this.total_page = response.data.recommend_list.last_page;
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
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        let _url = 'plugin.channel.frontend.recommend.center';
        // let _json = {};
        this.page = this.page + 1;
        $http.get(_url, { page: this.page }, '').then(
          response => {
            that.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.recommend_list.data;
              that.list = that.list.concat(myData); //数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    gotoSubmit() {
      this.$router.push(this.fun.getUrl('submitRecommend', {}));
    }
  }
};
</script>
<style lang="scss" scoped>
#recommendUp {
  min-height: 100vh;
  background: #fff;

  .top_member {
    padding: 1rem;
    overflow: hidden;
    display: flex;

    .avater {
      width: 5.375rem;
      height: 5.375rem;
      border-radius: 100%;
      overflow: hidden;
      margin-right: 1.375rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .member_main {
      text-align: left;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
      align-items: flex-start;

      .name {
        width: 100%;
        font-size: 1.125rem;
        font-weight: bold;
        color: #000;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
        margin-bottom: 0.625rem;
      }

      .grade {
        background: #ffdbdb;
        color: #ff2c29;
        padding: 0 0.875rem;
        border-radius: 2rem;
        overflow: hidden;
        display: block;
        margin-bottom: 0.625rem;
      }

      .number {
        font-size: 10px;
        color: #000;
      }
    }
  }

  .updateBox {
    height: 2rem;
    line-height: 2rem;
    display: flex;
    padding: 0 1rem;
    justify-content: space-between;

    .bold_title {
      font-size: 1.125rem;
      color: #000;
      font-weight: bold;
    }

    .btn {
      background: #ff2c29;
      color: #fff;
      border-radius: 1rem;
      overflow: hidden;
      padding: 0 0.875rem;
    }
  }

  .main {
    margin-top: 1rem;

    .list_titel {
      background: #f7f7f7;
      height: 1.875rem;
      line-height: 1.875rem;
      padding: 0 0.875rem;
      display: flex;
      color: #666;
    }

    .list {
      padding: 0 0.875rem;

      li {
        padding: 1rem 0;
        display: flex;
        align-items: center;
        width: 100%;
        overflow: hidden;
        border-bottom: 0.0625rem solid #d9d9d9;
      }
    }

    .list_img {
      width: 2rem;

      img {
        width: 2rem;
        height: 2rem;
        border-radius: 100%;
        overflow: hidden;
      }
    }

    .title_1 {
      margin-left: 0.25rem;
      width: 8.375rem;
      text-align: left;
    }

    .title_2 {
      width: 3.875rem;
    }

    .title_3 {
      width: 3.875rem;
    }

    .title_4 {
      flex: 1;
    }

    .titleflex_1 {
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;

      .member_name {
        max-width: 4.25rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
      }

      .member_id {
        background: #ffdbdb;
        color: #ff2c29;
        padding: 0 0.5rem;
        border-radius: 2rem;
        overflow: hidden;
        display: block;
        margin: 0 0.125rem;
      }
    }
  }
}
</style>
