<template>
  <div id="art-list">
    <c-title :hide="false" :text="title"></c-title>
    <section id="art-box">
      <div
        class="box"
        v-for="(item,i) in article_data" :key='i'
        @click.stop.prevent="gotoArticle(item)"
      >
        <ul>
          <li class="title" style="-webkit-box-orient: vertical;">
            <span class="pay-money" v-if="item.has_one_article_pay">付费</span><span>{{item.title}}</span>
          </li>
          <!-- <li class="browse-number"><span>{{item.read_num}}<small>人浏览</small></span></li> -->
        </ul>
        <div class="img">
          <img
            :src="
              item.thumb
                ? item.thumb
                : require('../../assets/images/loading.jpg')
            "
          />
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import articleContent_controller from "./articleList_controller";
export default articleContent_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#art-list {
  background-color: #fff;

  #art-box {
    text-align: left;
    padding-left: 0.875rem;

    .box:last-child {
      border: none;
    }

    .box {
      border-bottom: solid 0.0625rem #ebebeb;
      display: flex;
      padding: 0.625rem 0.875rem 0.625rem 0;

      ul {
        margin-left: 0.875rem;
        width: 13.3125rem;
        font-size: 16px;
        text-align: left;
        position: relative;

        li {
          line-height: 1.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

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

        .browse-number {
          color: #8c8c8c;
          position: absolute;
          bottom: 0;
          height: 1.5rem;
          line-height: 1.5rem;
        }
      }

      .img {
        width: 7.5rem;
        height: 5.25rem;
        background-color: #ccc;
        margin-left: 0.75rem;
        margin-right: 0.875rem;
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
