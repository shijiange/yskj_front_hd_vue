<!-- 直播列表页 -->
<template>
  <div id="liveList">
    <div class="search_box">
      <ul class="search">
        <li class="left">
          <i style="padding-right: 0.5rem;" class="iconfont icon-back" @click.stop="gotoMember"></i>
          <span>{{ isCateStyle ? "列表" : "首页" }}</span>
        </li>
        <li class="right">
          <!-- <input
            v-model="kwd"
            type="text"
            title="搜索"
            placeholder="请输入主播/直播内容"
          /> -->
          <form action="/">
            <van-search v-model="kwd" shape="round" input-align="center" placeholder="请输入主播/直播内容" @search="onSearch" @cancel="onCancel" />
          </form>
          <!-- <i class="iconfont icon-sousuo" ></i> -->
        </li>
      </ul>
    </div>
    <template v-if="!isCateStyle">
      <van-swipe :autoplay="4000" indicator-color="#f15353" :width="fun.getPhoneEnv() == 3 ? 375 : clientWidth" v-if="!fun.isTextEmpty(liveBanner)">
        <van-swipe-item v-for="(slide, index) in liveBanner" :key="index" v-if="slide.is_show">
          <a :href="slide.url" style="display: block; background: #fff;">
            <img style="height: 11.25rem; padding: 0.5rem 0.875rem; border-radius: 1.5rem; width: 100%;" :src="slide.image" />
          </a>
        </van-swipe-item>
      </van-swipe>

      <div class="ment">
        <van-swipe
          :autoplay="0"
          indicator-color="#f15353"
          class="sw_list"
          :width="fun.getPhoneEnv() == 3 ? 375 : clientWidth"
          :class="{
            sw_list_6: category != null && category.length > 0 && category[0].length <= 5,
            sw_list_12: category != null && category.length > 0 && category[0].length > 5,
            sw_list_0: category.length == 0
          }"
        >
          <van-swipe-item v-for="(items, i) in category" :key="i">
            <ul>
              <li v-for="(item, i) in items" :key="i" style="float: left;" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
                <router-link :to="fun.getUrl('liveCategory', { cate_id: item.id })">
                  <div class="image" v-if="item.thumb">
                    <img :src="item.thumb" />
                  </div>
                  <div class="image" v-if="!item.thumb">
                    <img src="../../assets/images/img_default.png" />
                  </div>
                  <p class="text">{{ item.name }}</p>
                </router-link>
              </li>
            </ul>
          </van-swipe-item>
        </van-swipe>
      </div>
    </template>
    <!-- 这个需要优化 简洁代码 -->
    <van-tabs v-model="active" swipeable sticky style="background: #fff;" @change="getData">
      <van-tab title="我的关注" name="-1">
        <template v-if="active == -1">
          <div class="living-box" v-if="list_style == 0">
            <ul ref="newArray1" class="zq-waterfall-left living-item">
              <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoAnchor(0, item.anchor_member_id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top" v-if="item.status == 1"><span class="red">直播中</span>{{ item.view_num }}人观看</div>
                <div class="goods_icon" v-if="item.status == 1">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item">
              <li class="" v-for="(item, index) in newArray2" :key="index" @click="gotoAnchor(0, item.anchor_member_id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top" v-if="item.status == 1"><span class="red">直播中</span>{{ item.view_num }}人观看</div>
                <div class="goods_icon" v-if="item.status == 1">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>

          <div class="second-list-style" v-else>
            <div class="second-li" v-for="(item, index) in recordsList" :key="index" @click="gotoAnchor(0, item.anchor_member_id)">
              <div class="second-li-left">
                <img :src="item.cover" alt="" class="cover" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red">直播中</span>
                  <template>{{ item.view_num }}人观看</template>
                </div>
              </div>
              <div class="second-li-right">
                <div class="live-title">{{ item.title }}</div>
                <div class="live-goods">
                  <div class="goods-item" v-for="goods in item.goods" :key="goods.id">
                    <img :src="goods.thumb" alt="" />
                    <div class="goods-price">{{ $i18n.t("money") }} {{ goods.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="!isloading && fun.isTextEmpty(recordsList)" />
        </template>
      </van-tab>
      <van-tab title="全部" name="0">
        <template v-if="active == 0">
          <div class="living-box" v-if="list_style == 0">
            <ul ref="newArray1" class="zq-waterfall-left living-item">
              <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoAnchor_2(item.status, null, item.id, item.back_id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.status == '4' ? 'huifan_color' : ''">{{ item.status == "3" ? "直播中" : item.status == "4" ? "回放" : "预告" }}</span
                  ><template v-if="item.status != '2'">{{ item.view_num }}人观看</template
                  ><template v-if="item.status == '2'">
                    <span v-if="fun.getTimeDifference(item.live_time) == 0">等待开播</span>
                    <van-count-down v-else :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒"></van-count-down>
                    ></template
                  >
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item">
              <li class="" v-for="(item, index) in newArray2" :key="index" @click="gotoAnchor_2(item.status, null, item.id, item.back_id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.status == '4' ? 'huifan_color' : ''">{{ item.status == "3" ? "直播中" : item.status == "4" ? "回放" : "预告" }}</span
                  ><template v-if="item.status != '2'">{{ item.view_num }}人观看</template
                  ><template v-if="item.status == '2'">
                    <span v-if="fun.getTimeDifference(item.live_time) == 0">等待开播</span>
                    <van-count-down v-else :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒"></van-count-down>
                    ></template
                  >
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>

          <div class="second-list-style" v-else>
            <div class="second-li" v-for="(item, index) in recordsList" :key="index" @click="gotoAnchor_2(item.status, null, item.id, item.back_id)">
              <div class="second-li-left">
                <img :src="item.cover" alt="" class="cover" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.status == '4' ? 'huifan_color' : ''">{{ item.status == "3" ? "直播中" : item.status == "4" ? "回放" : "预告" }}</span>
                  <template v-if="item.status != '2'">{{ item.view_num }}人观看</template>
                  <template v-if="item.status == '2'">
                    <span v-if="fun.getTimeDifference(item.live_time) == 0">等待开播</span>
                    <van-count-down v-else :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒"></van-count-down>
                  </template>
                </div>
              </div>
              <div class="second-li-right">
                <div class="live-title">{{ item.title }}</div>
                <div class="live-goods">
                  <div class="goods-item" v-for="goods in item.goods" :key="goods.id">
                    <img :src="goods.thumb" alt="" />
                    <div class="goods-price">{{ $i18n.t("money") }} {{ goods.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="!isloading && fun.isTextEmpty(recordsList)" />
      </van-tab>
      <van-tab title="推荐" name="1">
        <template v-if="active == 1">
          <div class="living-box" v-if="list_style == 0">
            <ul ref="newArray1" class="zq-waterfall-left living-item">
              <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoAnchor_1(item.play_type, null, item.room_id, item.back_id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.play_type == '1' ? '' : 'huifan_color'">{{ item.play_type == "1" ? "直播中" : "回放" }}</span
                  >{{ item.view_num }}人观看
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item">
              <li class="" v-for="(item, index) in newArray2" :key="index" @click="gotoAnchor_1(item.play_type, null, item.room_id, item.back_id)">
                <div class="bg">
                  <img :src="item.cover" alt="" />
                </div>
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.play_type == '1' ? '' : 'huifan_color'">{{ item.play_type == "1" ? "直播中" : "回放" }}</span
                  >{{ item.view_num }}人观看
                </div>
                <div class="goods_icon">
                  <i class="iconfont icon-zb_goods"></i><span>{{ item.goods_num }}</span>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
          </div>
          <div class="second-list-style" v-else>
            <div class="second-li" v-for="(item, index) in recordsList" :key="index" @click="gotoAnchor_1(item.play_type, null, item.room_id, item.back_id)">
              <div class="second-li-left">
                <img :src="item.cover" alt="" class="cover" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red" :class="item.play_type == '1' ? '' : 'huifan_color'">{{ item.play_type == "1" ? "直播中" : "回放" }}</span>
                  <template>{{ item.view_num }}人观看</template>
                </div>
              </div>
              <div class="second-li-right">
                <div class="live-title">{{ item.title }}</div>
                <div class="live-goods">
                  <div class="goods-item" v-for="goods in item.goods" :key="goods.id">
                    <img :src="goods.thumb" alt="" />
                    <div class="goods-price">{{ $i18n.t("money") }} {{ goods.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="!isloading && fun.isTextEmpty(recordsList)" />
      </van-tab>
      <van-tab title="直播中" name="2">
        <template v-if="active == 2">
          <div class="living-box" v-if="list_style == 0">
            <ul ref="newArray1" class="zq-waterfall-left living-item">
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
            <ul ref="newArray2" class="zq-waterfall-right living-item">
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
          <div class="second-list-style" v-else>
            <div class="second-li" v-for="(item, index) in recordsList" :key="index" @click="gotoAnchor(1, null, item.id)">
              <div class="second-li-left">
                <img :src="item.cover" alt="" class="cover" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red">直播中</span>
                  <template>{{ item.view_num }}人观看</template>
                </div>
              </div>
              <div class="second-li-right">
                <div class="live-title">{{ item.title }}</div>
                <div class="live-goods">
                  <div class="goods-item" v-for="goods in item.goods" :key="goods.id">
                    <img :src="goods.thumb" alt="" />
                    <div class="goods-price">{{ $i18n.t("money") }} {{ goods.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="!isloading && fun.isTextEmpty(recordsList)" />
      </van-tab>
      <van-tab title="预告" name="3">
        <template v-if="active == 3">
          <div class="living-box" v-if="list_style == 0">
            <ul ref="newArray1" class="zq-waterfall-left living-item">
              <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoAnchor(2, null, item.id)">
                <img class="bg" :src="item.cover" alt="" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red">预告</span>
                  <span v-if="fun.getTimeDifference(item.live_time) == 0">等待开播</span>
                  <van-count-down v-else :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒"></van-count-down>
                </div>
                <div class="bottom overflow1">{{ item.title }}</div>
              </li>
            </ul>
            <ul ref="newArray2" class="zq-waterfall-right living-item">
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
          <div class="second-list-style" v-else>
            <div class="second-li" v-for="(item, index) in recordsList" :key="index" @click="gotoAnchor(2, null, item.id)">
              <div class="second-li-left">
                <img :src="item.cover" alt="" class="cover" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red">预告</span>
                  <template>
                    <span v-if="fun.getTimeDifference(item.live_time) == 0">等待开播</span>
                    <van-count-down v-else :time="fun.getTimeDifference(item.live_time)" format="DD天HH时mm分ss秒"></van-count-down>
                  </template>
                </div>
              </div>
              <div class="second-li-right">
                <div class="live-title">{{ item.title }}</div>
                <div class="live-goods">
                  <div class="goods-item" v-for="goods in item.goods" :key="goods.id">
                    <img :src="goods.thumb" alt="" />
                    <div class="goods-price">{{ $i18n.t("money") }} {{ goods.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="!isloading && fun.isTextEmpty(recordsList)" />
      </van-tab>
      <van-tab title="精彩回放" name="4" v-if="isShowBack">
        <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="!isloading && fun.isTextEmpty(recordsList)" />
        <template v-if="active == 4">
          <div class="living-box" v-if="list_style == 0">
            <ul ref="newArray1" class="zq-waterfall-left living-item">
              <li class="" v-for="(item, index) in newArray1" :key="index" @click="gotoAnchor(3, null, item.room_id, item.id)">
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
            <ul ref="newArray2" class="zq-waterfall-right living-item">
              <li class="" v-for="(item, index) in newArray2" :key="index" @click="gotoAnchor(3, null, item.room_id, item.id)">
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
          <div class="second-list-style" v-else>
            <div class="second-li" v-for="(item, index) in recordsList" :key="index" @click="gotoAnchor(3, null, item.room_id, item.id)">
              <div class="second-li-left">
                <img :src="item.cover" alt="" class="cover" />
                <div class="title">
                  <img :src="item.avatar" alt="" />
                  <span class="name">{{ item.nickname }}</span>
                </div>
                <div class="top">
                  <span class="red huifan_color">回放</span>
                  <template>{{ item.view_num }}人观看</template>
                </div>
              </div>
              <div class="second-li-right">
                <div class="live-title">{{ item.title }}</div>
                <div class="live-goods">
                  <div class="goods-item" v-for="goods in item.goods" :key="goods.id">
                    <img :src="goods.thumb" alt="" />
                    <div class="goods-price">{{ $i18n.t("money") }} {{ goods.title }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </van-tab>
    </van-tabs>
    <p v-show="this.$store.state.isloadding" style="color: #999; padding: 1.5rem 0; background-color: #fff;">
      正在加载中.....
    </p>
  </div>
</template>

<script>
import liveList_Controller from "./liveList_Controller";

export default liveList_Controller;
</script>
<style lang="scss" scoped>
.search_box {
  .search {
    height: 2.75rem;
    line-height: 2.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.875rem;
    background-color: #fff;

    .left {
      font-size: 16px;
      display: flex;
      font-weight: bold;

      i {
        color: #333;
        font-size: 1rem;
      }

      span {
        display: block;
        margin: 0 0.25rem;
        max-width: 5.75rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #333;
        font-size: 1rem;
      }

      i:last-child {
        font-size: 1.125rem;
      }
    }

    .right {
      display: flex;
      border-radius: 1rem;
      font-size: 14px;
      color: #c9c9c9;
      // width: 12.375rem;
      // height: 1.875rem;
      // background: #f8f8f8;
      // display: flex;
      // line-height: 1.875rem;
      // border-radius: 1rem;
      // padding: 0 0.625rem;
      // font-size: 14px;
      // flex: 1;
      // margin: 0 1rem;
      // color: #c9c9c9;
      // i {
      //   font-size: 1.125rem;
      //   margin-right: 0.375rem;
      // }
      // input {
      //   border: none;
      //   width: 100%;
      //   text-align: center;
      // }
      // input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
      //   color: #c9c9c9;
      // }
    }
  }
}

.attention-box {
  background: #fff;
  margin: 0.8rem;
  padding-bottom: 1rem;
}

.attention-item {
  display: flex;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 0 0.469rem 0 rgba(0, 0, 0, 0.09);
  border: 1px solid #eee;
  border-radius: 5px;

  .left {
    flex: 0 0 3.75rem;
    width: 3.75rem;
    height: 3.75rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .middle {
    margin-left: 1rem;
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    p {
      line-height: 2rem;
      width: 11rem;
    }

    .gray {
      color: #999;
      font-size: 12px;
    }
  }

  .right {
    flex: 0 0 5.5rem;
    display: flex;
    align-self: center;
    justify-self: center;
    color: #e90505;
    line-height: 34px;

    i {
      font-size: 30px;
    }
  }
}

.living-box {
  background: #fff;
  margin: 0.8rem;
  margin-bottom: 0;
  padding-bottom: 1.5rem;
}

.living-item {
  margin: 0;
  margin-bottom: 0.875rem;
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

    .red {
      background-color: #f10303;
      border-radius: 0.15rem;
      padding: 0 0.25rem;
      margin-right: 0.2rem;
      display: inline-block;
      height: 100%;
    }

    .van-count-down {
      display: inline-block;
      color: #fff;
      font-size: 14px;
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

.second-list-style {
  display: flex;
  flex-direction: column;
  padding: 0.875rem;
  background: #f2f2f2;

  .second-li {
    background: #fff;
    border-radius: 0.875rem;
    overflow: hidden;
    margin-bottom: 0.75rem;
    padding: 0.625rem;
    display: flex;

    .second-li-left {
      width: 8.375rem;
      height: 7.188rem;
      border-radius: 0.469rem;
      overflow: hidden;
      margin-right: 0.5rem;
      position: relative;
      background: #fbfbfb;

      .cover {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .title {
        display: flex;
        overflow: hidden;
        position: absolute;
        bottom: 0.5rem;
        left: 0;
        width: 100%;
        padding: 0 0.5rem;

        img {
          width: 1.25rem;
          height: 1.25rem;
          background-color: #fff;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          margin-right: 0.5rem;
        }

        .name {
          flex: 1;
          text-align: left;
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

        .red {
          background-color: #f10303;
          border-radius: 0.15rem;
          padding: 0 0.25rem;
          margin-right: 0.2rem;
          display: inline-block;
          height: 100%;
        }

        .van-count-down {
          display: inline-block;
          color: #fff;
          font-size: 10px;
        }

        .huifan_color {
          background-color: #999;
        }
      }
    }

    .second-li-right {
      display: flex;
      flex-direction: column;
      flex: 1;

      .live-title {
        text-align: left;
        line-height: 1.125rem;
        height: 2.375rem;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .live-goods {
        display: flex;

        .goods-item {
          position: relative;
          overflow: hidden;
          border-radius: 0.313rem;
          width: 4.688rem;
          height: 4.688rem;
          background-color: #a0a0a0;
          margin-left: 0.5rem;

          img {
            width: 100%;
            height: 100%;
          }

          .goods-price {
            position: absolute;
            width: 100%;
            left: 0;
            bottom: 0;
            height: 1.125rem;
            line-height: 1.125rem;
            font-size: 10px;
            color: #fff;
            background-color: rgba(0, 0, 0, 0.5);
          }
        }

        .goods-item:nth-child(1) {
          margin: 0;
        }
      }
    }
  }
}

.ment {
  background: #fff;
}

.sw_list {
  // padding-top: 0.6rem;
  ul {
    margin: 0.875rem 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    li {
      list-style: none;
      width: 20%;
      float: left;
      margin: 0;
      padding: 0;
      margin-bottom: 0.625rem;

      a {
        color: #2b2f33;
      }

      .image {
        height: 11vw;
        width: 100%;
        overflow: hidden;
      }

      img {
        width: 50%;
        vertical-align: middle;
        height: 90%;
        border-radius: 50%;
      }

      p {
        margin: 0;
        font-size: 12px;
        line-height: 1.125rem;
        max-height: 2.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 0 0.5rem;
        display: block;
      }
    }

    .pcStyle {
      .image {
        height: 2.625rem;
      }
    }
  }
}

.sw_list_6 {
  min-height: 6rem;
}

.sw_list_12 {
  min-height: 10rem;
}

.sw_list_0 {
  min-height: 0;
}

@media all and (max-width: 400px) {
  .sw_list_12 {
    height: 12rem;
  }
}
</style>
