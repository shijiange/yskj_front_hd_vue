<template>
  <div id="group_list">
    <c-title :hide="false" :text="'拼购列表'"></c-title>
    <div class="content">
      <div class="goods_box" v-for="(item, index) in info" :key="index">
        <div class="goods_img">
          <img :src="item.thumb" />
        </div>
        <ul class="goods_info">
          <li class="name" style="-webkit-box-orient: vertical;">
            {{ item.title }}
          </li>

          <li class="left">
            <template v-if="false">
              <i class="iconfont icon-group_list"></i>
              <span>{{ item.buy_number }}人</span>
            </template>
          </li>
          <li class="number">
            <div class="price">
              <span>{{ $i18n.t('money') }}{{ item.market_price }}</span>
              <span
                ><em style="font-size: 0.75rem;">{{ $i18n.t('money') }}</em
                >{{ item.price }}</span
              >
            </div>
            <div class="go_group" @click="goGroup(item.activity_id, item.goods_id)">
              <span>去拼购</span>
            </div>
          </li>
        </ul>
      </div>

      <yz-blank :datas="info" text="暂无拼购活动" :isBtn="true" btnText="返回首页" tolink="home"></yz-blank>
    </div>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { Toast } from 'vant';
import { scrollMixin } from '../../../utils/mixin'; //引入加载更多
import yzBlank from '../../../components/ui_components/yz_blank';
export default {
  mixins: [scrollMixin],
  data() {
    return {
      info: {},
      shareInfo: {},
      //more
      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    this.init();
    this.getData();
  },
  methods: {
    init() {
      this.info = {};
      this.shareInfo = {};
      this.isLoadMore = true;
      this.total_page = 0;
      this.page = 1;
    },
    getData() {
      $http.get('plugin.together-purchase.api.index.getTogetherData', { art: 'polymerization' }, '加载中').then(
        response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.polymerization.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.info = response.data.polymerization.data;
            this.getShare();
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    getShare() {
      $http.get('plugin.together-purchase.api.index.getTogetherData', { art: 'getShare' }).then(
        response => {
          if (response.result === 1) {
            this.share(response.data.getShare);
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    //组装分享设置
    share(_data) {
      // let that = this;

      let _links = document.location.href;
      let _titles = this.fun.isTextEmpty(_data.share_title) ? '' : _data.share_title;
      let _imgUrls = this.fun.isTextEmpty(_data.share_img) ? '' : _data.share_img;
      let _descs = this.fun.isTextEmpty(_data.share_describe) ? '' : _data.share_describe;

      // console.log(_titles, _links, _imgUrls, _descs)

      wx.ready(function() {
        wx.showOptionMenu();

        wx.onMenuShareTimeline({
          title: _titles, // 分享标题
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });

        wx.onMenuShareAppMessage({
          title: _titles, // 分享标题
          desc: _descs, // 分享描述
          link: _links, // 分享链接
          imgUrl: _imgUrls, // 分享图标
          success: function() {
            Toast('分享成功');
          },
          cancel: function() {
            Toast('取消分享');
          }
        });
      });
    },
    goGroup(aid, gid) {
      this.$router.push(this.fun.getUrl('groupBuy', { aid: aid, id: gid }));
    },
    //获取更多数据，加载更多
    getMoreData() {
      this.isLoadMore = false; // 防止多次请求分页数据
      const that = this;
      if (that.page >= that.total_page) {
        return;
      } else {
        that.page += 1;
        $http
          .get(
            'plugin.together-purchase.api.index.getTogetherData',
            { page: that.page, art: 'polymerization' },
            '加载中'
          )
          .then(res => {
            that.isLoadMore = true;
            if (res.result == 1) {
              var nextPageData = res.data.polymerization.data;
              that.info = that.info.concat(nextPageData); //进行数组拼接
            } else {
              that.page = that.page - 1;
              that.isLoadMore = false;
              return;
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  components: { cTitle, yzBlank }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#group_list {
  .content {
    padding-bottom: 60px;

    .goods_box {
      display: flex;
      margin: 0.75rem;
      padding: 0.5rem;
      background: #fff;
      border-radius: 0.375rem;
      overflow: hidden;

      .goods_img {
        width: 7.5rem;
        height: 7.5rem;
        overflow: hidden;
        flex-shrink: 0;
        border-radius: 0.25rem;
        margin-right: 0.625rem;

        img {
          width: 100%;
        }
      }

      .goods_info {
        width: 14.0625rem;
        text-align: left;

        .name {
          font-size: 14px;
          line-height: 1.25rem;
          height: 2.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: #000;
        }

        .price {
          font-size: 16px;
          color: #ff2c29;
          display: flex;
          flex-direction: column;
          margin-top: -0.5rem;

          span {
            font-size: 1rem;
          }

          span:first-child {
            color: #999;
            font-size: 0.75rem;
            text-decoration: line-through;
          }
        }

        .left {
          display: flex;
          align-items: center;
          height: 1.5rem;

          .iconfont {
            font-size: 1rem;
            color: #ff2c29;
            margin-right: 0.375rem;
          }

          span {
            color: #ff2c29;
            font-size: 0.75rem;
            border-left: solid 0.0625rem #ebebeb;
            padding-left: 0.375rem;
          }
        }

        .number {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.625rem;

          .go_group {
            width: 4.75rem;
            height: 1.5rem;
            line-height: 1.5rem;
            border-radius: 1rem;
            background: #ff2c29;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
              color: #fff;
              font-size: 0.75rem;
            }

            .fa {
              color: #fff;
              font-size: 1rem;
              margin-left: 0.625rem;
            }
          }
        }
      }
    }
  }
}
</style>
