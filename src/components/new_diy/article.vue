<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>
    <!--文章静态-->
    <div>
      <div id="article">
        <!--:style="{ backgroundColor: datas.article_bg }"-->
        <div class="tab_box" v-if="(datas.get_style == 1 || datas.get_style == 3) && datas.show_tab && !tabcontrol">
          <ul class="tab_list">
            <van-tabs v-model="active"
                      swipeable
                      @change="onClick"
                      :background="datas.article_tab_bg"
                      :title-active-color="datas.title_active_color"
                      :color="datas.title_active_color"
                      :title-inactive-color="datas.title_color"
                      id="tab">
              <van-tab title="全部分类" v-if="datas.get_style == 1"
                       :name="0"
                       class="tabChild"></van-tab>
              <van-tab :title="item.name"
                       v-for="(item,i) in categories"
                       :name="item.id" :key='i'
                       class="tabChild"></van-tab>
            </van-tabs>
          </ul>
        </div>

        <!--自动获取-->
        <template v-if="Number(datas.get_number) > 0 && datas.list && (datas.get_style == 1 || datas.get_style == 3)">
          <div class="article-list" :class="plugin_active ? 'member-article-list' : ''" v-for="(item, index) in list" :key="index" @click.stop.prevent="gotoArticle(item)">
            <!-- 样式一图片 -->
            <div v-if="datas.article_style == 1" class="image-style1">
              <img :src="item.thumb || emptyImage" alt=""/>
            </div>
            <div class="content">
              <div class="title" style="-webkit-box-orient: vertical;">
                <span class="pay-money" v-if="item.has_one_article_pay || item.is_pay == 1">付费</span><span>{{item.title}}</span>
              </div>
              <div class="message">
                <div class="author">{{item.author}}</div>
                <div class="time">{{item.created_at || item.virtual_at}}</div>
              </div>
            </div>
            <!-- 样式二图片 -->
            <div v-if="datas.article_style == 2" class="image-style2">
              <img :src="item.thumb || emptyImage" alt=""/>
            </div>
          </div>
        </template>

        <!--手动获取-->
        <template v-if="datas.list && datas.get_style == 2">
          <div class="article-list" v-for="item in datas.list" :key="item.id" @click.stop.prevent="gotoArticle(item)">
            <!-- 样式一图片 -->
            <div v-if="datas.article_style == 1" class="image-style1">
              <img :src="item.thumb || emptyImage" alt=""/>
            </div>
            <div class="content">
              <div class="title" style="-webkit-box-orient: vertical;">
                <span class="pay-money" v-if="item.is_pay == 1">付费</span><span>{{item.title}}</span>
              </div>
              <div class="message">
                <div class="author" v-if="item.author">{{item.author}}</div>
                <div class="time">{{item.created_at || item.virtual_at}}</div>
              </div>
            </div>
            <!-- 样式二图片 -->
            <div v-if="datas.article_style == 2" class="image-style2">
              <img :src="item.thumb || emptyImage" alt=""/>
            </div>
          </div>
        </template>

        <div v-if="datas.list && datas.list.length <= 0 && datas.get_style == 2" style="padding: 15px; text-align: center;">
          暂无设置文章
        </div>

        <div v-if="!noNotice && (datas.get_style == 1 || datas.get_style == 3)">
          <div
            style="width: 100%; height: 40px; line-height: 40px; text-align: center;"
            v-if="isLoadMore"
            @click="getMoreData"
          >{{ $i18n.t("加载更多") }}</div>
          <div
            style="width: 100%; height: 40px; line-height: 40px; text-align: center;"
            v-if="lastIndex == index && allLoaded"
          >{{ $i18n.t("没有更多了") }}~</div>
        </div>
        <div v-if="noNotice" style="text-align: center;">
          <img
            style="width: 5rem; padding: 2rem 0; display: inherit;"
            src="../../assets/images/blank.png"
            alt=""
            v-if="fun.isTextEmpty(list)"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import emptyImage from '../../assets/images/new_diy/image.png';
// 自定义样式
const css = function () {

  if(this.datas.article_bg) {
    // 确保数据已传入
    const {
      article_bg,
      article_tab_bg,
      title_color,
      title_active_color,
      text_size,
      margin_top,
      margin_bottom,
      margin_left,
      margin_right,
      box_radius
    } = this.datas;

    return `
        .component-${this.id} .article-list {
            background-color: ${article_bg};
            margin-top: ${margin_top}px;
            margin-bottom: ${margin_bottom}px;
            margin-left: ${margin_left}px;
            margin-right: ${margin_right}px;
            border-radius: ${box_radius}px;
        }

        .component-${this.id} .article-list .title {
            font-size: ${text_size || 14}px;
            line-height: ${(text_size + 2) || 16}px;
            height: ${((text_size + 2)*2) || 32}px;
        }

        .component-${this.id} .nav-bgimage {
            background-color: ${article_tab_bg || "#fff"};
        }

        .component-${this.id} .nav-li {
            color: ${title_color};
        }

        .component-${this.id} .nav-li.nav-selected {
            color: ${title_active_color};
            border-bottom: solid  2px ${title_active_color };
        }
    `;
  }

};

export default {
  data() {
    return {
      emptyImage,

      active: "",
      class_id: "0",
      list: [],
      categories: [],
      isLoadMore: false,
      page: 1,
      total_page: 0,
      pageSize: 12,
      noNotice: false,
      allLoaded: false, // 全部数据已经加载完成
    };
  },
  props: ["id", "datas", "tabcontrol", 'lastIndex', 'index', "plugin_active","fatherTitle"],
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    },
  },
  mounted() {
    if(this.datas.get_style == 1 || this.datas.get_style == 3) {
      this.initData();
      //获取数据
      this.getNetData(this.datas);
    }else {
      this.isLoadMore = false;
      this.allLoaded = true;
    }
  },
  methods: {
    initData() {
      this.page = 1;
      this.total_page = 0;
      this.isLoadMore = true;
      this.allLoaded = false;
      this.list = [];
    },

    //获取数据
    getNetData(data) {
      if(data) {
        if(data.cate && data.cate[0]) {
          this.class_id = data.cate[0].id;
        }
        this.noNotice = false;
        this.total_page = data.list.last_page;
        this.pageSize = data.list.per_page;
        this.isLoadMore = true;
        if(this.total_page<=1) {
          this.isLoadMore = false;
          this.allLoaded = true;
        }
        if(data.list.data.length > this.datas.get_number) {
          data.list.data.splice(this.datas.get_number, data.list.data.length-this.datas.get_number);
          this.isLoadMore = false;
          this.allLoaded = true;
        }
        this.list = data.list.data;

        if(data.cate) {
          this.categories = data.cate;
          if (data.cate.length <= 0) {
            this.noNotice = true;
          }
        }

        return;
      }

      let json = { category_id: this.class_id, page: 1, pageSize: 12 };
      $http.get("plugin.article.api.article.get-articles", json, "获取中").then(
        response => {
          if (response.result == 1) {
            this.noNotice = false;
            this.total_page = response.data.articles.last_page;
            this.pageSize = response.data.articles.per_page;
            this.isLoadMore = true;
            if(this.total_page<=1) {
              this.isLoadMore = false;
              this.allLoaded = true;
            }
            if (response.data.categories.length <= 0) {
              this.noNotice = true;
            }

            if(response.data.articles.data.length > this.datas.get_number) {
              response.data.articles.data.splice(this.datas.get_number, response.data.articles.data.length-this.datas.get_number);
              this.isLoadMore = false;
              this.allLoaded = true;
            }

            this.list = response.data.articles.data;
            // this.categories = response.data.categories;
          } else {
            this.noNotice = true;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },

    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page || this.list.length > this.datas.get_number) {
        console.log("getMoreData", this.total_page);
      } else {
        this.page = this.page + 1;
        let json = { category_id: this.class_id, page: this.page, pageSize: this.pageSize };
        $http
          .get("plugin.article.api.article.get-articles", json, "加载中")
          .then( (response)=> {
            if (response.result === 1) {

              this.total_page = response.data.articles.last_page;
              if(this.page < this.total_page) {
                this.isLoadMore = true;
              }else {
                this.allLoaded = true;
              }

              this.list = this.list.concat(response.data.articles.data);
              if(this.list.length > this.datas.get_number) {
                this.list.splice(this.datas.get_number,this.list.length-this.datas.get_number);
                this.isLoadMore = false;
                this.allLoaded = true;
              }
              this.$emit('setLoadMore', this.isLoadMore);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              this.allLoaded = true;
            }
          },
          function(response) {
            // error callback
          }
          );
      }
    },

    gotoArticle(item) {
      console.log(item);
      zhuge.track(this.fatherTitle+'-点击文章',{
          '文章名称':item.title,
          '文章id':''+item.id,
          '发布人':item.author,
          '发布人id':''+item.id,
          '发布时间':item.created_at || item.virtual_at,
          '所属标签':item.category_name
      });
      this.$router.push(this.fun.getUrl("articleContent", { id: item.id }));
    },
    onClick(index, title) {
      zhuge.track(this.fatherTitle+'-点击文章分类标签',{
          '标签名称':''+title
      });
      this.initData();
      this.class_id = index;
      this.getNetData();
    }
  },
};
</script>

<style lang="scss" scoped>
  // 默认
  .component-wrapper {
    width: 100%;
    text-align: left;
  }

  #article {
    .nav {
      display: flex;
      align-items: center;
      height: 40px;
      white-space: nowrap;
      flex-wrap: nowrap;
      box-sizing: content-box;

      .nav-li {
        flex: 1;
        min-width: 20%;
        text-align: center;

        .nav-lis {
          display: inline-block;
          line-height: 40px;
        }
      }
    }

    .scroll {
      overflow-x: scroll;
    }

    .article-list {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      padding: 5px 10px;
      height: 93px;
      box-sizing: content-box;

      .image-style1 {
        width: 104px;
        height: 93px;
        border-radius: 7.5px;
        margin-right: 15px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        height: 100%;
        padding: 8px 0;

        .title {
          /* line-height: 1.125rem; */

          /* min-height: 32px; */
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          -webkit-box-orient: vertical;

          .pay-money {
            width: 2.125rem;
            height: 1.125rem;
            border-radius: 0.3125rem;
            border: solid 0.0625rem #ff2c29;
            display: inline-block;
            text-align: center;
            line-height: 1.125rem;
            font-size: 12px;
            color: #ff2c29;
            margin-right: 5px;
            vertical-align: baseline;
          }
        }

        .message {
          flex: 1;
          display: flex;
          align-items: flex-end;
          color: #999;
          font-size: 12px;

          .author {
            flex: 1;
            display: inline-block;
            margin-right: 10px;
          }

          .time {
            flex: 0 0 120px;
            display: inline-block;
          }
        }
      }

      .image-style2 {
        width: 104px;
        height: 93px;
        border-radius: 7.5px;
        margin-left: 15px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 5px;
        }
      }
    }

    .article-list.member-article-list {
      background: #fff;
      margin: 10px;
      border-radius: 5px;
    }
  }
</style>
