<template>
  <div id="articleContent">
    <h4>{{ dataInfo.title }}</h4>
    <div class="time">{{ dataInfo.created_at }}</div>
    <div class="content">
      {{ dataInfo.content }}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: "",
      dataInfo: {},
      content: ""
    };
  },
  activated() {
    this.id = this.$route.params.id;
    this.dataInfo = {};
    this.content = "";
    //获取数据
    this.getData();
  },
  mounted() {
  },
  methods: {
    //获取数据
    getData() {
      let that = this;
      let json = {
        message_id: this.id,
      };
      $http
        .get("plugin.app-set.frontend.message-detail.index", json, "加载中")
        .then(
          function(response) {
            console.log(response);
            if (response.result === 1) {
              that.dataInfo = response.data.message;
            } else {
              console.log(response.msg);
            }
          },
          function(response) {
            console.log(response);
          }
        );
    },
    //返回
    goto() {
      window.history.go(-1);
    }
  },
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#articleContent {
  padding: 0.625rem;
  background: #fff;

  .foot_advs {
    margin-bottom: 1.25rem;
    background: #fff;
    height: auto;
    border: 0.0625rem solid #ebebeb;
    padding: 0.3125rem;
    width: 100%;
    border-radius: 0;
  }

  .foot {
    height: 1.875rem;
  }

  h4 {
    text-align: left;
    font-size: 18px;
  }

  h4.like {
    float: left;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.read {
    padding-right: 0.625rem;
    float: left;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.report {
    padding-right: 0.625rem;
    float: right;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.link {
    padding-right: 0.625rem;
    float: right;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  h4.copy {
    padding-right: 0.625rem;
    float: left;
    color: #8a8a8a;
    text-align: left;
    font-size: 16px;
  }

  .time {
    font-size: 14px;
    color: #8a8a8a;
    text-align: left;
    line-height: 1.5625rem;
    height: 1.5625rem;
  }

  .content {
    width: 100%;
    font-size: 16px;
    text-align: left;
    padding-top: 0.625rem;
    padding-bottom: 1.875rem;

    img {
      width: 100%;
    }
  }

  .advs_img_bg {
    width: 100%;
    height: 8.125rem;
    margin-bottom: 0.625rem;
    padding-top: 0.3125rem;
    padding-bottom: 0.3125rem;
  }

  .advs_img {
    width: 100%;
    height: 7.5rem;
  }

  p.advs_title {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: left;
    height: 1.875rem;
    line-height: 1.875rem;
    font-size: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
  }

  .advs_desc {
    padding-left: 0.3125rem;
    padding-right: 0.3125rem;
    text-align: left;
    font-size: 14px;
    color: #8a8a8a;
  }
}
</style>
