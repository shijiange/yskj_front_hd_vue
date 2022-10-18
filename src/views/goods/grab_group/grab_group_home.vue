<!-- 抢团聚合页 -->
<template>
  <div id="grab_group_home">
    <c-title :hide="false" :text="'抢团'"></c-title>
    <div class="top-search">
      <div class="search-box">
        <input type="text" placeholder="搜索商品" v-model="serch_title" />
        <div class="search-btn" @click.stop="onRefresh()">搜索</div>
      </div>
      <div class="text" @click.stop="show = true">活动说明</div>
    </div>
    <div class="banner" v-if="!fun.isTextEmpty(Banner)">
      <van-swipe :autoplay="4000" indicator-color="#f94c3b" :width="fun.getPhoneEnv() == 3 ? 375 : clientWidth">
        <van-swipe-item v-for="(slide, index) in Banner" :key="index">
          <img
            style="padding: 0.5rem 0.875rem; border-radius: 1.5rem; width: 100%;"
            :src="slide.thumb"
            @click.stop="gotoLink(slide.thumb_link)"
          />
        </van-swipe-item>
      </van-swipe>
    </div>

    <div class="list-box" v-show="isquest">
      <van-tabs v-model="activeName" @change="handleClick" sticky :ellipsis="false" swipeable>
        <van-tab :title="items.name" v-for="(items, ind) in titleArr" :key="ind">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
              <li
                class="li"
                @click.stop="gotoGoods(child.activity_id, child.goods_id)"
                v-for="child in dataList[ind].list"
                :key="child.goods_id"
              >
                <div class="img-box">
                  <img :src="child.thumb" alt="" />
                </div>
                <div class="goods-info">
                  <div class="title">{{ child.goods_name }}</div>
                  <div class="m-prices">原价:{{ $i18n.t('money') }}{{ child.market_price }}</div>
                  <div class="prices">
                    <div class="small">{{ $i18n.t('money') }}</div>
                    {{ child.price }}
                  </div>
                </div>
                <div class="other-info" v-if="child.transport_reward>0">
                  <div class="other-info-box">
                      <div>{{child.limit_num}}人拼团，1人拼中</div>
                      <div>未拼中得{{child.transport_reward}}红包</div>
                  </div>
                </div>
              </li>
            </ul>
            <template v-if="dataList[ind]">
              <yz-blank :datas="dataList[ind].list" text="该分类暂无活动信息" :isBtn="false"></yz-blank>
            </template>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>

    <div class="float-btn" >
      <!-- 我的抢团 悬浮按钮 -->
      <i @click.stop="gotoMy()" class="iconfont icon-qt_button_groupbbuy"></i>
    </div>

    <van-popup v-model="show" closeable round :style="{ height: '50%', width: '80%' }" class="text-popup">
      <h2>活动规则</h2>
      <p v-if="!fun.isTextEmpty(explain)" v-html="explain"></p>
      <p v-else>暂无活动说明</p>
    </van-popup>
  </div>
</template>

<script>
import cTitle from 'components/title';
import { scrollMixin } from 'utils/mixin';
import yzBlank from '../../../components/ui_components/yz_blank';
import { Toast } from 'vant';

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      show: false,
      explain: null,
      clientWidth: document.body.clientWidth,
      Banner: [],
      serch_title: '',
      activeName: 0, // 不初始化
      dataList: [],
      titleArr: [{ id: 0, name: '全部' }], // 不初始化
      isLoadMore: true,
      isLoading: false,
      isquest: false
    };
  },
  activated() {
    this.init();
    this.getData(true);
  },
  components: { cTitle, yzBlank },
  computed: {},
  methods: {
    init() {
      this.isquest = false;
      this.isLoading = false;
      this.serch_title = '';
      this.dataList = [];
      this.isLoadMore = true;
    },
    handleClick() {
      this.getData(false);
    },
    onRefresh() {
      this.dataList[this.activeName].list = [];
      this.getData(false);
    },
    gotoLink(_links) {
      if (_links) {
        window.location.href = _links;
        return;
      }
    },
    getData(_tag) {
      $http
        .post(
          'plugin.snatch-regiment.api.index.getSnatchData',
          { art: 'index', title: this.serch_title || 0, cate_id: this.titleArr[this.activeName] ? this.titleArr[this.activeName].id : 0 },
          ''
        )
        .then(response => {
          this.isquest = true;
          if (response.result === 1) {
            this.isLoading = false;
            if (_tag) {
              this.Banner = response.data.index.slide;
              this.titleArr = this.titleArr.concat(response.data.index.category);
              this.explain = response.data.index.explain;
              this.titleArr.forEach((val, index) => {
                this.dataList.push({
                  isLoadMore: true,
                  page: 1,
                  total_page: 0,
                  list: []
                });
              });
            }
            this.setListData(response.data.index.goods);
            // this.initShare();
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid(),goods_id: this.goods_id },
              {}
            );
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setListData(data) {
      let that = this;
      if (!this.fun.isTextEmpty(this.dataList[that.activeName].list)) {
        that.isLoadMore = this.dataList[that.activeName].isLoadMore;
        return;
      }
      that.isLoadMore = true;
      that.$set(this.dataList[that.activeName], 'isLoadMore', true);
      that.$set(this.dataList[that.activeName], 'total_page', data.last_page);
      if (!this.dataList[that.activeName].total_page) {
        that.$set(this.dataList[that.activeName], 'total_page', 0);
        this.dataList[that.activeName].total_page = 0;
      }
      that.$set(this.dataList[that.activeName], 'list', data.data);
      console.log('ss', this.dataList);
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      if (this.fun.isTextEmpty(this.dataList[that.activeName])) {
        return;
      }
      that.dataList[that.activeName].isLoadMore = false;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (that.dataList[that.activeName].page >= that.dataList[that.activeName].total_page) {
        return;
      } else {
        let _json = {
          art: 'index',
          title: this.serch_title || 0,
          cate_id: this.titleArr[this.activeName].id
        };
        that.dataList[that.activeName].page = that.dataList[that.activeName].page + 1;
        _json.page = that.dataList[that.activeName].page;

        $http.get('plugin.snatch-regiment.api.index.getSnatchData', _json, '').then(
          response => {
            that.isLoadMore = true;
            that.dataList[that.activeName].isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.index.goods.data;
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
    gotoGoods(aid, gid) {
      this.$router.push(this.fun.getUrl('grab_group', { id: gid }));
    },
    gotoMy() {
      this.$router.push(this.fun.getUrl('grab_group_my', {}));
    },
    getShare(_data) {
      $http.get('plugin.snatch-regiment.api.index.getSnatchData', { art: 'getShare' }).then(
        response => {
          if (response.result === 1) {
            this.share(response.data.getShare, _data);
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    //初始化分享设置
    initShare() {
      let json = {
        url: this.fun.isIosOrAndroid() === 'android' ? window.location.href : window.initUrl,
        mid: this.fun.getKeyByMid(),
        goods_id: this.goods_id
      };
      $http.post('member.member.wxJsSdkConfig', json).then(
        response => {
          if (response.result === 1) {
            // var cs = data.shop.cservice;
            if (response.data.config) {
              this.getShare(response.data);
            }
          } else {
            console.error(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    //组装分享设置
    share(_data, config) {
      let that = this;
      wx.config(config.config);
      let _links = document.location.href;
      _links = that.fun.isMid(_links, config.info.uid);
      let _titles,
        _imgUrls,
        _descs = null;
      try {
        _titles = this.fun.isTextEmpty(_data.share_title) ? '' : _data.share_title;
      } catch (error) {
        _titles = '分享';
      }
      try {
        _imgUrls = this.fun.isTextEmpty(_data.share_img) ? '' : _data.share_img;
      } catch (error) {
        _imgUrls = '';
      }
      try {
        _descs = this.fun.isTextEmpty(_data.share_describe) ? '' : _data.share_describe;
      } catch (error) {
        _descs = '';
      }

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
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#grab_group_home {
  padding: 40px 0;
  padding-top: 0;
  background: #fff;

  .top-search {
    padding: 0 1rem;
    margin: 0.625rem 0;
    height: 1.875rem;
    line-height: 1.875rem;
    display: flex;
    text-align: center;

    .search-box {
      flex: 1;
      background-color: #f7f8fa;
      border-radius: 1rem;
      display: flex;

      input {
        padding-left: 1rem;
        text-align: left;
        border: none;
        flex: 1;
      }

      .search-btn {
        width: 3.75rem;
        background-image: linear-gradient(270deg, #ff4946 0%, #ff8a66 100%), linear-gradient(#ff2c29, #ff2c29);
        background-blend-mode: normal, normal;
        border-radius: 0.953rem;
        color: #fff;
      }
    }

    .text {
      font-size: 0.75rem;
      color: #636363;
      margin-left: 0.5rem;
    }
  }

  .list-box {
    .content {
      width: 100%;
      padding: 0.75rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .li {
        width: 48%;
        border: 1px solid #e2e2e2;
        background-color: #fff;
        border-radius: 0.5rem;
        overflow: hidden;
        margin-bottom: 0.625rem;

        .img-box {
          width: 100%;
          padding-bottom: 100%;
          height: 0;
          position: relative;

          img {
            width: 100%;
            height: 100%;
            max-height: 50vh;
            position: absolute;
            left: 0;
          }
        }

        .goods-info {
          padding: 0.625rem;
          width: 100%;
          display: flex;
          flex-direction: column;
          text-align: left;
          justify-content: space-between;

          .title {
            height: 2.25rem;
            line-height: 1.125rem;
            text-align: left;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .prices {
            display: flex;
            align-items: center;
            font-size: 1rem;
            color: #f94c3b;

            .small {
              font-size: 0.75rem;
            }
          }

          .m-prices {
            font-size: 0.75rem;
            margin: 0.25rem 0;
            color: #999;
            text-decoration: line-through;
          }
        }

        .other-info {
          padding: 0 0.5rem 0.5rem;

          .other-info-box {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            width: 100%;
            height: 2.5rem;
            padding: 0 0.8rem;
            color: #fff;
            font-size: 0.75rem;
            background-color: #ff4848;
            border-radius: 0.5rem;

            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              display: block;
              width: 0.25rem;
              height: 0.5rem;
              background: #fff;
              border-radius: 0 0.5rem 0.5rem 0;
            }

            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              display: block;
              width: 0.25rem;
              height: 0.5rem;
              background: #fff;
              border-radius: 0.5rem 0 0 0.5rem;
            }
          }
        }
      }
    }
  }

  .float-btn {
    position: fixed;
    bottom: 6rem;
    right: 50%;
    transform: translateX(10rem);
    width: 3.25rem;
    height: 3.25rem;
    line-height: 3.25rem;
    z-index: 99999;
    color: #fff;
    border-radius: 100%;
    background-image: linear-gradient(0deg, #fc9f88 0%, #fe6159 100%), linear-gradient(#ededed, #ededed);
    background-blend-mode: normal, normal;
    box-shadow: 0 0.125rem 0.406rem 0 rgba(255, 64, 60, 0.35);

    i {
      font-size: 1.5rem;
    }
  }

  .text-popup {
    padding: 0 0.875rem 0.875rem;

    h2 {
      height: 3.5rem;
      line-height: 3.5rem;
    }

    p {
      line-height: 1.5rem;
      font-size: 0.75rem;
      color: #303030;
    }
  }
}
</style>
