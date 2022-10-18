<!-- 带货直播 首页装修页组件 -->
<template>
  <div id="livestreaming" :class="className" :style="{ backgroundColor: datas.preview_color }">
    <van-tabs
      v-if="!tabcontrol"
      v-model="active"
      swipeable
      @change="getData"
      :background="datas.tab_bg_color"
      :title-active-color="datas.tab_active_color"
      :color="datas.tab_active_color"
      :title-inactive-color="datas.tab_color"
    >
      <van-tab title="全部" name="0" v-if="datas.tab_list.indexOf('0') > -1">
        <template v-if="active == 0">
          <div class="living-box">
            <ul ref="newArray1" class="zq-waterfall-left living-item" :class="`zq-waterfall-left${id}`">
              <li
                class=""
                v-for="(item, index) in newArray1"
                :key="index"
                @click="gotoAnchor_2(item.status, null, item.id, item.back_id)"
              >
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.status == '4' ? 'huifan_color' : ''">{{
                    item.status == '3' ? '直播中' : item.status == '4' ? '回放' : '预告'
                  }}</span
                  ><template v-if="item.status != '2'">{{ item.view_num }}人观看</template
                ><template v-if="item.status == '2'">
                  <van-count-down :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒" v-if="fun.getTimeDifference(item.live_time) != 0"></van-count-down>
                  <span v-else>等待开播</span>
                  </template>
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item" :class="`zq-waterfall-right${id}`">
              <li
                class=""
                v-for="(item, index) in newArray2"
                :key="index"
                @click="gotoAnchor_2(item.status, null, item.id, item.back_id)"
              >
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.status == '4' ? 'huifan_color' : ''">{{
                    item.status == '3' ? '直播中' : item.status == '4' ? '回放' : '预告'
                  }}</span
                  ><template v-if="item.status != '2'">{{ item.view_num }}人观看</template
                ><template v-if="item.status == '2'">
                  <van-count-down :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒" v-if="fun.getTimeDifference(item.live_time) != 0"></van-count-down>
                  <span v-else>等待开播</span>
                  </template>
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>
        </template>
      </van-tab>
      <van-tab title="推荐" name="1" v-if="datas.tab_list.indexOf('1') > -1">
        <template v-if="active == 1">
          <div class="living-box">
            <ul ref="newArray1" class="zq-waterfall-left living-item" :class="`zq-waterfall-left${id}`">
              <li
                class=""
                v-for="(item, index) in newArray1"
                :key="index"
                @click="gotoAnchor_1(item.play_type, null, item.room_id, item.back_id)"
              >
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.play_type == '1' ? '' : 'huifan_color'">{{
                    item.play_type == '1' ? '直播中' : '回放'
                  }}</span
                  >{{ item.view_num }}人观看
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item" :class="`zq-waterfall-right${id}`">
              <li
                class=""
                v-for="(item, index) in newArray2"
                :key="index"
                @click="gotoAnchor_1(item.play_type, null, item.room_id, item.back_id)"
              >
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.play_type == '1' ? '' : 'huifan_color'">{{
                    item.play_type == '1' ? '直播中' : '回放'
                  }}</span
                  >{{ item.view_num }}人观看
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>
        </template>
      </van-tab>
      <van-tab title="直播中" name="2" v-if="datas.tab_list.indexOf('2') > -1">
        <template v-if="active == 2">
          <div class="living-box">
            <ul ref="newArray1" class="zq-waterfall-left living-item" :class="`zq-waterfall-left${id}`">
              <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoAnchor(1, null, item.id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top"><span class="red">直播中</span>{{ item.view_num }}人观看</div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item" :class="`zq-waterfall-right${id}`">
              <li class="" v-for="(item, index) in newArray2" :key="index" @click="gotoAnchor(1, null, item.id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top"><span class="red">直播中</span>{{ item.view_num }}人观看</div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>
        </template>
      </van-tab>
      <van-tab title="预告" name="3" v-if="datas.tab_list.indexOf('3') > -1">
        <template v-if="active == 3">
          <div class="living-box">
            <ul ref="newArray1" class="zq-waterfall-left living-item" :class="`zq-waterfall-left${id}`">
              <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoAnchor(2, null, item.id)">
                <img class="bg" :src="item.cover" alt="" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red">预告</span
                  >
                  <van-count-down :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒" v-if="fun.getTimeDifference(item.live_time) != 0"></van-count-down>
                  <span v-else>等待开播</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item" :class="`zq-waterfall-right${id}`">
              <li class="" v-for="(item, index) in newArray2" :key="index" @click="gotoAnchor(2, null, item.id)">
                <img class="bg" :src="item.cover" alt="" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top"><span class="red">预告</span></div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>
        </template>
      </van-tab>
      <van-tab title="精彩回放" name="4" v-if="isShowBack && datas.tab_list.indexOf('4') > -1">
        <template v-if="active == 4">
          <div class="living-box">
            <ul ref="newArray1" class="zq-waterfall-left living-item" :class="`zq-waterfall-left${id}`">
              <li
                class=""
                v-for="(item, index) in newArray1"
                :key="index"
                @click="gotoAnchor(3, null, item.room_id, item.id)"
              >
                <img class="bg" :src="item.cover" alt="" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top"><span class="red huifan_color">回放</span>{{ item.view_num }}人观看</div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item" :class="`zq-waterfall-right${id}`">
              <li
                class=""
                v-for="(item, index) in newArray2"
                :key="index"
                @click="gotoAnchor(3, null, item.room_id, item.id)"
              >
                <img class="bg" :src="item.cover" alt="" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top"><span class="red huifan_color">回放</span>{{ item.view_num }}人观看</div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>
        </template>
      </van-tab>
    </van-tabs>

    <template v-if="tabcontrol">
      <div class="living-box" style="margin: 0 0.8rem;">
        <ul ref="newArray1" class="zq-waterfall-left living-item" :class="`zq-waterfall-left${id}`">
          <li
            class=""
            v-for="(item, index) in newArray1"
            :key="index"
            @click="gotoAnchor_2(item.status, null, item.id, item.back_id)"
          >
            <div class="bg">
              <img :src="item.cover" alt="" />
            </div>
            <div class="title">
              <img :src="item.avatar" alt="" />
              <span class="name">{{ item.nickname }}</span>
            </div>
            <div class="top">
                  <span class="red" :class="item.status == '4' ? 'huifan_color' : ''">{{
                    item.status == '3' ? '直播中' : item.status == '4' ? '回放' : '预告'
                  }}</span
                  ><template v-if="item.status != '2'">{{ item.view_num }}人观看</template
            ><template v-if="item.status == '2'">
              <van-count-down :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒" v-if="fun.getTimeDifference(item.live_time) != 0"></van-count-down>
                  <span v-else>等待开播</span>
              </template>
            </div>
            <div class="goods_icon">
              <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
            </div>
            <div class="bottom overflow1">{{ item.title }}</div>
          </li>
        </ul>
        <ul ref="newArray2" class="zq-waterfall-right living-item" :class="`zq-waterfall-right${id}`">
          <li
            class=""
            v-for="(item, index) in newArray2"
            :key="index"
            @click="gotoAnchor_2(item.status, null, item.id, item.back_id)"
          >
            <div class="bg">
              <img :src="item.cover" alt="" />
            </div>
            <div class="title">
              <img :src="item.avatar" alt="" />
              <span class="name">{{ item.nickname }}</span>
            </div>
            <div class="top">
                  <span class="red" :class="item.status == '4' ? 'huifan_color' : ''">{{
                    item.status == '3' ? '直播中' : item.status == '4' ? '回放' : '预告'
                  }}</span
                  ><template v-if="item.status != '2'">{{ item.view_num }}人观看</template
            ><template v-if="item.status == '2'">
              <van-count-down :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒" v-if="fun.getTimeDifference(item.live_time) != 0"></van-count-down>
              <span v-else>等待开播</span>
              </template>
            </div>
            <div class="goods_icon">
              <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
            </div>
            <div class="bottom overflow1">{{ item.title }}</div>
          </li>
        </ul>
      </div>
    </template>

    <p v-if="isloading" style="padding: 2rem 0; color: #666;">加载中...</p>
    <img
      src="../../assets/images/blank.png"
      alt=""
      style="width: 5rem; margin: 2rem 0;"
      v-if="!isloading && fun.isTextEmpty(recordsList)"
    />
    <router-link v-if="!isloading" style="padding: 0 0 1rem 0; color: #999;" tag="p" :to="fun.getUrl('liveList')">
      前往直播列表 >
    </router-link>
  </div>
</template>

<script>
import { Toast } from 'vant';

export default {
  props: ['id', 'datas', 'tabcontrol'],
  data() {
    return {
      active: 0,
      recordsList: [],
      newArray1: [],
      newArray2: [],
      isShowBack: true,
      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isloading: false //是否正在请求状态，true时为空图片不显示
    };
  },
  components: {},
  computed: {
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  mounted() {
    if(this.tabcontrol) {
      this.getData('0', this.datas);
    }else {
      this.active = this.datas.choose_tab || '0';
      this.getData(this.active, this.datas);
    }
  },
  methods: {
    getData(name, data) {
      let that = this;
      this.isloading = true;
      if(data.list) {
        //是否开启精彩回放
        data.record_id == 1 ? this.isShowBack = true : this.isShowBack = false;

        that.recordsList = data.list.data ? data.list.data : data.list;
        if (!that.fun.isTextEmpty(that.datas.get_number)) {
          that.recordsList = that.recordsList.slice(0, that.datas.get_number);
        }
        that.isloading = false;
        that.newArray1 = [];
        that.newArray2 = [];
        that.sort(0, that.recordsList);
        return;
      }

      let _url = null;
      let _json = {};
      this.recordsList = [];
      switch (name) {
      case '0':
        that.active = '0';
        _url = 'plugin.room.frontend.live-list.get-all-live-list'; //全部
        break;
      case '1':
        that.active = '1';
        _url = 'plugin.room.frontend.live-list.get-live-recommend'; //推荐
        break;
      case '2':
        that.active = '2';
        _url = 'plugin.room.frontend.live-list.get-live-list'; //直播中
        _json.status = 3;
        break;
      case '3':
        that.active = '3';
        _url = 'plugin.room.frontend.live-list.get-live-list'; //预告
        _json.status = 2;
        break;
      case '4':
        that.active = '4';
        _url = 'plugin.room.frontend.live-list.play-back'; //回放
        break;

      default:
        that.active = '-1';
        _url = 'plugin.room.frontend.live-list.get-live-concern'; //关注
        break;
      }
      $http
        .post(_url, _json, '')
        .then(response => {
          this.isloading = false;
          if (response.result === 1) {
            if (that.active == 1) {
              that.recordsList = response.data;
            } else {
              that.recordsList = response.data.data;
            }
            if (!that.fun.isTextEmpty(that.datas.get_number)) {
              that.recordsList = that.recordsList.slice(0, that.datas.get_number);
            }
            that.newArray1 = [];
            that.newArray2 = [];
            that.sort(0, that.recordsList);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 图片加载完回调
    getImg(url, callback, callback2) {
      let img = new Image();
      img.src = url;
      //如果图片被缓存，则直接返回缓存数据
      if (img.complete) {
        /* callback(img.width, img.height); */
        callback(img.width, img.height, Number(img.height) / Number(img.width));
      } else {
        //完全加载完毕的事件
        img.onload = function() {
          /* callback(img.width, img.height); */
          callback(img.width, img.height, Number(img.height) / Number(img.width));
        };

        img.onerror = function() {
          callback2();
        };
      }
    },
    sort(arg, list) {
      let that = this;
      let index = arg || 0;
      if (list.length > index) {
        that.getImg(
          list[index].cover,
          function(w, h, r) {
            let boxA = 0;
            let boxB = 0;

            if (document.getElementsByClassName(`zq-waterfall-left${that.id}`)[0]) {
              boxA = document.getElementsByClassName(`zq-waterfall-left${that.id}`)[0].clientHeight;
            }

            if (document.getElementsByClassName(`zq-waterfall-right${that.id}`)[0]) {
              boxB = document.getElementsByClassName(`zq-waterfall-right${that.id}`)[0].clientHeight;
            }
            if (boxA <= boxB) {
              that.newArray1.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list); //加载完再递归
              });
            } else {
              that.newArray2.push(list[index]);
              that.$nextTick(() => {
                that.sort(index + 1, list);
              });
            }
          },
          function() {
            list[index].cover = 'https://www.yunzmall.com/addons/yun_shop/static/app/img/agreen_video@2x.png';
            that.$nextTick(() => {
              that.sort(index, list);
            });
          }
        );
      }
      if (list.length - 1 == index) {
        this.isLoadMore = true;
      }
    },
    gotoAnchor(_status, _Mid, _Rid, _backId) {
      //_status:1直播状态,_Mid：直播id,_Rid:直播间id
      if (_status == 1 && _Rid) {
        //直播中，跳转到主播间
        console.log('直播中，跳转到主播间');
        this.$router.push(this.fun.getUrl('livePage', { id: _Rid, type: 'livePlay' }));
      } else if (_status == 3 && _Rid && _backId) {
        //直播回放中，跳转到主播间
        console.log('直播回放中，跳转到主播间回放');
        this.$router.push(this.fun.getUrl('livePage', { id: _Rid, backid: _backId, type: 'playBack' }));
      } else if (_status == 0 && _Mid) {
        //我的关注 非直播状态，跳转到主播页面（个人中心）
        this.$router.push(this.fun.getUrl('anchorDetail', { id: _Mid }));
      } else if (_status == 2 && _Rid) {
        //预告页面
        this.$router.push(this.fun.getUrl('foreshow', { id: _Rid }));
      } else {
        console.log('缺少参数');
      }
    },
    gotoAnchor_1(_status, _Mid, _Rid, _backId) {
      if (_status == '1' && _Rid) {
        //直播中，跳转到主播间
        console.log('直播中，跳转到主播间');
        this.$router.push(this.fun.getUrl('livePage', { id: _Rid, type: 'livePlay' }));
      } else if (_status == '2' && _Rid && _backId) {
        //直播回放中，跳转到主播间
        console.log('直播回放中，跳转到主播间回放');
        this.$router.push(this.fun.getUrl('livePage', { id: _Rid, backid: _backId, type: 'playBack' }));
      } else {
        console.log('error::::', _status, _Mid, _Rid, _backId);
      }
    },
    gotoAnchor_2(_status, _Mid, _Rid, _backId) {
      //_status:1直播状态,_Mid：直播id,_Rid:直播间id
      if (_status == 3 && _Rid) {
        //直播中，跳转到主播间
        console.log('直播中，跳转到主播间');
        this.$router.push(this.fun.getUrl('livePage', { id: _Rid, type: 'livePlay' }));
      } else if (_status == 4 && _Rid && _backId) {
        //直播回放中，跳转到主播间
        console.log('直播回放中，跳转到主播间回放');
        this.$router.push(this.fun.getUrl('livePage', { id: _Rid, backid: _backId, type: 'playBack' }));
      } else if (_status == 2) {
        //预告页面
        Toast('直播暂未开始！');
        // this.$router.push(this.fun.getUrl("foreshow", { id: _Rid }));
      } else {
        console.log('缺少参数');
      }
    }
  }
};
</script>
<style lang="scss" scoped>
  #livestreaming {
    background: #fff;

    .living-box {
      margin: 0.8rem;
    }

    .living-item {
      margin: 0;
      width: 48%;
      overflow: hidden;
      vertical-align: top;
      display: inline-block;

      li {
        margin-bottom: 0.875rem;
        position: relative;
      }

      .bg {
        width: 100%;
        // height: 13.125rem;
        border-radius: 0.313rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        display: flex;

        img {
          flex: 0 0 1.656rem;
          width: 1.656rem;
          height: 1.656rem;
          border-radius: 50%;
          margin-top: -0.625rem;
          border: 0.125rem solid #fff;
        }

        .name {
          display: inline-block;
          flex: 1;
          text-align: left;
          line-height: 1rem;
          margin-left: 0.25rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .top {
        position: absolute;
        top: 0.5rem;
        left: 0.25rem;
        background-color: rgba(0, 0, 0, 0.4);
        border-radius: 0.15rem;
        color: #fff;
        padding: 0 0.15rem 0 0;
        font-size: 12px;
        height: 1.25rem;
        line-height: 1.25rem;
        display: flex;
        align-items: center;

        .red {
          background-color: #f10303;
          border-radius: 0.15rem;
          padding: 0 0.25rem;
          margin-right: 0.2rem;
          display: inline-block;
          height: 100%;
        }

        .van-count-down {
          color: #fff;
          font-size: 12px;
        }

        .huifan_color {
          background-color: #999;
        }
      }

      .goods_icon {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        font-size: 12px;
        height: 1.25rem;
        line-height: 1.25rem;

        i {
          font-size: 1.625rem;
          color: #ffa303;
        }

        span {
          background-color: #fff;
          border-radius: 0.266rem;
          color: #f00;
          position: absolute;
          right: -4px;
          height: 0.875rem;
          line-height: 0.875rem;
          font-size: 0.625rem;
          padding: 0 0.15rem;
        }
      }

      .bottom {
        width: 100%;
        height: 2.5rem;
        line-height: 1.25rem;
        position: absolute;
        bottom: 1.875rem;
        left: 0;
        font-weight: bold;
        font-size: 0.875rem;
        color: #fff;
        text-align: left;
        padding: 0 0.5rem;
        // background: rgba(0, 0, 0, 0.4);
      }

      .overflow1 {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .purple {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        color: #fff;
        font-size: 12px;
        background-color: #8415f5;
        border-radius: 0.625rem 0 0.625rem 0;
        padding: 0.2rem 0.6rem;
      }

      .gray {
        position: absolute;
        top: 0.5rem;
        left: 0.5rem;
        color: #fff;
        font-size: 12px;
        background-color: #999;
        border-radius: 0.625rem 0 0.625rem 0;
        padding: 0.2rem 0.6rem;
      }
    }

    .zq-waterfall-left {
      margin-right: 0.5rem;
    }
  }
</style>
