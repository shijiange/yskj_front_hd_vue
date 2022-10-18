<template>
  <div id="aftersales">
    <c-title :hide="false" text="协商记录"></c-title>

    <div class="listData">
      <div class="list-item" v-for="item in listData" :key="item.id">
        <div class="user-info">
          <div class="face">
              <div class="icon-wrapper icon-user" v-if="item.operator == 1">
                  <i class="iconfont icon-fontclass-rengezhongxin"></i>
              </div>    
              <div class="icon-wrapper icon-bussin" v-if="item.operator == 0">
                  <i class="iconfont icon-icon-test"></i>
              </div>
          </div>
          <div class="right-info">
            <div class="content">{{item.operate_name}}</div>
            <div class="time">{{item.created_at}}</div>
          </div>
        </div>
        <div class="details">
          <div class="details-item" v-for="(content,index) in item.detail" :key="index">
            <span class="details-text">{{content}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listData:[]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      $http.get("refund.detail.process-log", { refund_id: this.$route.params.refund_id }, "").then(response => {
        if (response.result == 1) {
          console.log(response.data);
          this.listData = response.data;
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
.listData {
  padding: 0.625rem 0.938rem;
  text-align: left;
  .list-item {
    margin-bottom: 0.625rem;
    padding: 0.813rem;
    background: #fff;
    border-radius: 0.625rem;
    .user-info {
      display: flex;
      padding-bottom: 0.813rem;
      border-bottom: 0.031rem solid #f2f2f2;
      .face {
        width: 1.813rem;
        height: 1.813rem;
        img {
          width: 1.813rem;
          height: 1.813rem;
          border-radius: 50%;
        }
        .icon-wrapper{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.125rem;
            height: 1.125rem;
            border-radius: 50%;
        }
        .icon-user{
            background-color: #ffa128;
        }
        .icon-bussin{
            background-color: #3b8bec;
        }
        .iconfont{
            color: #fff;
            font-size:14px;
        }
      }
      .right-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 1.813rem;
        padding-left: 0.469rem;
        .content {
          font-size: 0.875rem;
          color: #333333;
        }
        .time {
          font-size: 0.688rem;
          color: #666666;
        }
      }
    }
    .details {
      padding-top: 0.5rem;
      .details-item {
        line-height: 1.5rem;
        font-size: 0.75rem;
        color: #1e1e1e;
        .details-red {
          color: #ff464c;
        }
        .details-green {
          color: #1faf4d;
        }
      }
    }
  }
}
</style>
