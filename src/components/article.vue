<template>
  <div id="art-list">
    <section id="art-box"
             :style="'background:' + datas.params.bgcolor"
             v-if="datas.params.addmethod == 1">
      <div class="box"
           v-for="(item,i) in datas.data"
           :key='i'
           @click.stop.prevent="gotoArticle(item)">
        <ul>
          <li class="title"
              style="-webkit-box-orient: vertical;">
              <span class="pay-money" v-if="item.has_one_article_pay">付费</span><span>{{item.title}}</span>
          </li>
          <li style="width: 100%;"
              class="bottomTest"><span>{{item.author}}</span><span v-if="item.time">{{ item.time.slice(0,10) }}</span></li>
        </ul>
        <div class="img">
          <img v-lazy="item.thumb ? item.thumb : require('../assets/images/loading.jpg')" />
        </div>
      </div>
    </section>

    <section id="art-box1"
             :style="'background:' + datas.params.bgcolor"
             v-if="datas.params.addmethod == 0">
      <div class="box"
           v-for="(item,i) in articles"
           :key='i'
           @click.stop.prevent="gotoArticle(item)">
        <ul>
          <li class="title"
              style="-webkit-box-orient: vertical;">
              <span class="pay-money" v-if="item.has_one_article_pay">付费</span><span>{{item.title}}</span>
          </li>
          <li style="width: 100%;"
              class="bottomTest"><span>{{item.author}}</span><span v-if="item.created_at">{{ item.created_at.slice(0,10) }}</span></li>
        </ul>
        <div class="img">
          <img v-lazy="
              item.thumb ? item.thumb : require('../assets/images/loading.jpg')
            " />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    datas: {
      default: []
    }
  },
  data() {
    return {
      articles: []
    };
  },
  created() {
    //addmethod == 0才获取
    if (this.datas.params.addmethod == 0) {
      this.getMoreArticle();
    }
  },
  activated() {
    // this.getMoreArticle();
  },
  computed: {},
  methods: {
    //跳转
    gotoArticle(item) {
      if(item.has_one_article_pay){
        if(item.has_one_record){
          this.$router.push(this.fun.getUrl("articleContent", { id: item.articleid,home:'1' }));
        }else{
          this.$router.push(this.fun.getUrl("payList", { id: item.articleid,home:'1' }));
          return;
        }
      }else{
        this.$router.push(this.fun.getUrl("articleContent", { id: item.articleid,home:'1' }));
        return;
      }
    },
    getMoreArticle() {
      const that = this;
      $http
        .get("plugin.article.api.article-page.page", {
          pageSize: that.datas.params.shownum
        })
        .then(
          response => {
            if (response.result === 1) {
              this.articles = response.data.data;
            }
          },
          reject => {
            //alert('网络错误，请稍后再试！')
          }
        );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#art-list {
  background-color: #fff;

  #art-box,
  #art-box1 {
    text-align: left;
    padding-left: 0.875rem;

    .box:last-child {
      border: none;
    }

    .box {
      border-bottom: solid 0.0625rem #ebebeb;
      padding-right: 0.875rem;
      display: flex;
      padding: 0.625rem 0;

      ul {
        width: 13.75rem;
        font-size: 16px;
        text-align: left;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .title {
          line-height: 1.5rem;
          overflow: hidden;
          text-overflow: ellipsis; //文本溢出显示省略号
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 1.125rem;

          .pay-money {
            width: 2.125rem;
            height: 1.125rem;
            border-radius: 0.3125rem;
            border: solid 0.0625rem #ff2c29;
            display: inline-block;
            text-align: center;
            line-height: 1.125rem;
            vertical-align: text-top;
            font-size: 12px;
            color: #ff2c29;
          }
        }

        .bottomTest {
          font-size: 12px;
          color: #8c8c8c;
          display: flex;
          justify-content: space-between;
        }

        .browse-number {
          color: #8c8c8c;
          position: absolute;
          bottom: 0;
          height: 1.5rem;
          line-height: 1.5rem;
        }
      }

      .img {
        min-height: 5.5rem;
        width: 7.0625rem;
        height: 5.5rem;
        background-size: cover;
        background-color: #ccc;
        margin-left: 0.875rem;
        //margin-left:0.75rem;
        //margin-right:0.875rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
