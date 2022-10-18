<template>

  <div class="page">
    <c-title :hide="false" text="粉丝列表"></c-title>

    <div class="listData">
      <div class="item" v-for="item in listData" :key="item.uid">
        <div class="face">
          <img :src="item.avatar_image" alt="">
        </div>
        <div class="desc">{{item.nickname}}</div>
      </div>
    </div>
  </div>

</template>

<script>
import cTitle from "components/title";
import { scrollMixin } from "../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  components: {
    cTitle
  },
  data() {
    return {
      listData: [],

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数


    };
  },
  created() {
    this.getData();
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    getData() {
      this.initData();
      console.log(this.$route.query);
      $http.get("plugin.room.frontend.live.get-fans-list", {
        anchor_member_id: this.$route.query.memberId
      }).then((response) => {
        if (response.result === 1) {
          console.log(response);
          this.listData = response.data.data;
          this.isLoadMore = true;
          this.total_page = response.data.last_page;
          if (!this.total_page) {
            this.total_page = 0;
          }
        }
      });
    },
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        // that.loading = true;
        return;
      } else {
        this.page += 1;
        $http
          .get("plugin.room.frontend.live.get-fans-list", {
            anchor_member_id: this.$route.query.memberId,
            page: this.page
          })
          .then(res => {
            console.log(res);
            this.isLoadMore = true;
            if (res.result === 1) {
              var nextPageData = res.data.data;

              this.listData = this.listData.concat(nextPageData);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    }
  }
};


</script>

<style lang="scss" scoped>
  .page {
    min-height: 100vh;
    background: #fff;
  }

  .listData {
    .item {
      height: 3.438rem;
      display: flex;
      align-items: center;
      padding: 0 0.938rem;
      border-bottom: 0.031rem solid #f2f2f2;

      .face {
        width: 1.563rem;
        height: 1.563rem;
        border-radius: 50%;
        background-color: #f8f8fa;

        img {
          width: 1.563rem;
          height: 1.563rem;
          border-radius: 50%;
          background-color: #f8f8fa;
        }
      }

      .desc {
        font-size: 0.875rem;
        color: #333;
        padding-left: 0.469rem;
      }
    }
  }
</style>