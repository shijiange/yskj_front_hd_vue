<template>
  <div id="microcommentdetails">
    <div id="hoid" @click="goto" :class="{ hoet: hoet }">
      <div id="back">
        <i class="iconfont icon-member-left"></i>
      </div>
    </div>
    <div id="cart" @click="gotoCart" :class="{ hoet: hoet }">
      <div id="back">
        <i class="iconfont icon-ai-home"></i>
      </div>
    </div>
    <div class="header"></div>
    <div class="banner" v-if="detailsData.has_many_image">
      <viewer :images="detailsData.has_many_image" class="section">
        <van-swipe :autoplay="0" indicator-color="white" :loop="true" :show-indicators="false" @change="sidingsImg">
          <template v-for="(item, index) in detailsData.has_many_image">
            <van-swipe-item :key="index">
              <div class="centerbanner">
                <img :src="item.url" alt="" />
              </div>
            </van-swipe-item>
          </template>
        </van-swipe>
      </viewer>
      <div class="bannerindex" v-if="detailsData.has_many_image.length > 0">
        {{ bannerindex + "/" + detailsData.has_many_image.length }}
      </div>
    </div>
    <div class="details_show">
      <div class="user_message">
        <div class="user_left">
          <div class="pic" v-if="detailsData.has_one_stick_user">
            <img :src="detailsData.has_one_stick_user.avatar" alt="" @click="gotoHome(detailsData.has_one_stick_user.uid)" />
          </div>
          <div class="name_right">
            <div class="name" v-if="detailsData.has_one_stick_user">
              {{ detailsData.has_one_stick_user.nickname }}
            </div>
            <div class="createdata">{{ detailsData.created_at }}</div>
          </div>
        </div>
        <div class="uset_right">
          <div class="attention" @click="attentionBtn" v-if="detailsData.is_own != 1">
            {{ detailsData.is_follow ? "已关注" : "关注" }}
          </div>
          <div class="more" @click="managementBtn">
            <img src="../../assets/images/micro_communities/detail_more@2x.png" alt="" />
          </div>
        </div>
      </div>
      <div class="article" v-if="detailsData.contents">
        <template v-if="detailsData.contents.indexOf('micro-panel-body') > -1 || detailsData.contents.indexOf('</p>') > -1">
          <!--判断是否富文本-->
          <p v-html="detailsData.contents"></p>
        </template>
        <template v-else>
          <p v-for="(_item, i) in detailsData.contents.split('\n')" :key="i">{{ _item }}</p>
        </template>
      </div>

      <div style="margin: 0 0 12px 12px;">
        <audioSlider v-for="(item, index) in detailsData.audio_src" :key="index" :src="item.file" :duration="item.duration"></audioSlider>
      </div>

      <div class="article_label">
        <ul>
          <li>#{{ detailsData.cat_name }}</li>
        </ul>
      </div>
      <div class="loca_information">
        <div class="localeft">
          <div class="letimg" v-if="detailsData.address">
            <img src="../../assets/images/micro_communities/publish_add_address@2x.png" alt="" />
          </div>
          <div class="addressname">{{ detailsData.address }}</div>
        </div>
        <div class="locaright">浏览：{{ detailsData.browse_num ? detailsData.browse_num : 0 }}</div>
      </div>
      <div class="showmessage">
        <div class="content">
          <div class="shopshow" @click="gotoStore(detailsData.has_one_store.arr.id)" v-if="detailsData.has_one_store">
            <div class="leftimg">
              <img :src="detailsData.has_one_store.arr.thumb" alt="" />
            </div>
            <div class="shopright">
              <div class="name">
                {{ detailsData.has_one_store.arr.store_name }}
              </div>
              <div class="start_1">
                <img src="../../assets/images/collect.png" alt="" />
                <img src="../../assets/images/collect.png" alt="" />
                <img src="../../assets/images/collect.png" alt="" />
                <img src="../../assets/images/collect.png" alt="" />
                <img src="../../assets/images/collect.png" alt="" />
              </div>
              <div class="fobottom">
                <div class="area">
                  {{ detailsData.has_one_store.arr.address }}
                </div>
              </div>
            </div>
          </div>
          <div class="goodsshow" v-if="detailsData.has_one_goods" @click="gotoGoods(detailsData.has_one_goods.id)">
            <div class="leftimg">
              <img :src="detailsData.has_one_goods.thumb" alt="" />
            </div>
            <div class="goodright">
              <div class="goodsname">
                <div class="good-title">{{ detailsData.has_one_goods.title }}</div>
                <div class="do-btn" v-if="detailsData.wish_state == 1 && detailsData.order_id != 0" @click.stop="helpPay(detailsData.order_id)">帮他完成心愿</div>
              </div>
              <div class="fobottom">
                <div class="foleft">
                  <div class="pic">{{ $i18n.t("money") }}{{ detailsData.has_one_goods.price }}</div>
                  <div class="delpic">{{ $i18n.t("money") }}{{ detailsData.has_one_goods.market_price }}</div>
                </div>
                <div class="foright">
                  <div class="sold">已售{{ detailsData.has_one_goods.show_sales }}件</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="comment_display
"
      >
        <div class="comment_top">
          <div class="title">评论({{ detailsData.comments_num ? detailsData.comments_num : 0 }})</div>
          <div class="reply" @click="subMainCommentBtn">
            <div class="reply_left" v-if="detailsData.has_one_stick_user">
              <img :src="detailsData.has_one_stick_user.avatar" alt="" />
            </div>
            <div class="reply_right">
              来都来了，留点什么吧...
            </div>
          </div>
        </div>
        <div class="comment_bottom">
          <ul class="maincomment">
            <li v-for="(item, index) in StickCommentData" :key="index">
              <div class="maincommentleft" @click="gotoHome(item.user_id)">
                <img v-if="item.has_one_comment_user" :src="`${item.has_one_comment_user.avatar}?${Date.now()}`" alt="" />
              </div>
              <div class="maincommentright">
                <div class="master_content" @click.stop="replyCommentsBtn(item,item.id, '', item.uname, item.content, item.is_own)">
                  <div class="master_content_left">
                    <div class="name">{{ item.uname }}</div>
                    <div class="createdata">{{ item.created_at }}</div>
                    <div class="review_content">
                      {{ item.content }}
                    </div>
                    <div class="comment-img">
                      <div class="comment-img-child" v-for="(imgchild, imgindex) in item.image" :key="imgindex" @click.stop="openImgPreview(item.image, imgindex)">
                        <img :src="imgchild" alt="" />
                      </div>
                    </div>
                  </div>
                  <div class="master_content_right">
                    <div class="reward-box" v-if="item.is_own == 0 && detailsData.comment_open == 1" @click.stop="moneyShow(1, item.id, item.uname, item.has_one_comment_user.avatar)">
                      <img src="../../assets/images/micro_communities/detail_reward@2x.png" alt="" />
                    </div>
                    <div class="thumb_up" @click.stop="praiseBtn(item,item.id, '', index, '', item.is_praise)">
                      <div class="thumb_img">
                        <template v-if="item.is_praise">
                          <img src="../../assets/images/micro_communities/home_praise_cur@2x.png" alt="" />
                        </template>
                        <template v-else>
                          <img src="../../assets/images/micro_communities/home_praise@2x.png" alt="" />
                        </template>
                      </div>
                      <div class="thumb_num">{{ item.praise_num }}</div>
                    </div>
                  </div>
                </div>
                <template v-for="(childitem, childindex) in item.child">
                  <div v-if="item.child" :key="childindex" class="deputy_comment">
                    <div class="deputy_comment_left" v-if="childitem.has_one_comment_user" @click.stop="gotoHome(childitem.user_id)">
                      <img :src="childitem.has_one_comment_user.avatar" alt="" />
                    </div>
                    <div class="deputy_comment_right" @click.stop="replyCommentsBtn(childitem,childitem.major_cm_id, childitem.id, childitem.uname, childitem.content, childitem.is_own)">
                      <div class="deputy_message">
                        <div class="name">{{ childitem.uname }}</div>
                        <div class="createdata">{{ childitem.created_at }}</div>
                        <div class="review_content">
                          <template v-if="childitem.less_name">
                            回复<span class="selecolor">{{ childitem.less_name }}</span>
                          </template>
                          {{ childitem.content }}
                        </div>
                        <div class="comment-img">
                          <div class="comment-img-child" v-for="(childitemImg, childitemI) in childitem.image" :key="childitemI" @click.stop="openImgPreview(childitem.image, childitemI)">
                            <img :src="childitemImg" alt="" />
                          </div>
                        </div>
                      </div>
                      <div class="thumb_up" @click.stop="praiseBtn(childitem.major_cm_id, childitem.id, index, childindex, childitem.is_praise)">
                        <div class="thumb_img">
                          <template v-if="childitem.is_praise">
                            <img src="../../assets/images/micro_communities/home_praise_cur@2x.png" alt="" />
                          </template>
                          <template v-else>
                            <img src="../../assets/images/micro_communities/home_praise@2x.png" alt="" />
                          </template>
                        </div>
                        <div class="thumb_num">{{ childitem.praise_num }}</div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="multiple_comments
"
          v-if="mulcommentsshow && StickCommentData && StickCommentData.length > 0"
          @click="mulchMeatsShowBtn"
        >
          展开多条评论
        </div>
      </div>
    </div>
    <div class="bottom_operation set-pc-styleLeft">
      <div class="content">
        <div class="reply" @click="subMainCommentBtn">
          <div class="reply_left">
            <img src="../../assets/images/micro_communities/home_autograph@2x.png" alt="" />
          </div>
          <div class="reply_right">
            说点什么...
          </div>
        </div>
        <div class="thumbup" @click="shareWeixin">
          <div class="thumbupimg" style="width: auto;height: auto;">
            <i class="iconfont icon-fenxiang" style="font-weight: bold;"></i>
          </div>
          <div class="thumbupnum">分享</div>
        </div>
        <div class="thumbup" v-if="reward_button == 0" @click="moneyShow(0)">
          <div class="thumbupimg">
            <img src="../../assets/images/micro_communities/detail_reward@2x.png" alt="" />
          </div>
          <div class="thumbupnum">赞赏</div>
        </div>
        <div class="thumbup" @click="isPraiseBtn">
          <div class="thumbupimg">
            <img src="../../assets/images/micro_communities/detail_praise@2x.png" alt="" />
          </div>
          <div class="thumbupnum">{{ detailsData.praise_num }}</div>
        </div>
        <div class="thumbup">
          <div class="thumbupimg">
            <img src="../../assets/images/micro_communities/detail_comment@2x.png" alt="" />
          </div>
          <div class="thumbupnum">{{ detailsData.comments_num }}</div>
        </div>
      </div>
    </div>
    <van-popup v-model="adminOperationshow" position="bottom" :overlay="true">
      <div class="adminOperation">
        <div class="recommend">
          <div class="recommend_left">
            <img src="../../assets/images/micro_communities/detail_recommend@2x.png" alt="" />
          </div>
          <div class="recommend_right" @click="adminBtn(1)">
            <span v-if="recommend_flag == 1">取消推荐</span>
            <span v-else>推荐</span>
          </div>
        </div>
        <div class="top_set">
          <div class="top_set_left">
            <img src="../../assets/images/micro_communities/detail_roof@2x.png" alt="" />
          </div>
          <div class="top_set_right" @click="adminBtn(2)">
            <span v-if="stick_flag == 1">取消置顶</span>
            <span v-else>置顶</span>
          </div>
        </div>
        <div class="top_set" v-if="is_own" @click="reEditBtn">
          <div class="top_set_left">
            <img src="../../assets/images/micro_communities/detail_revise@2x.png" alt="" />
          </div>
          <div class="top_set_right">修改</div>
        </div>
        <div class="delete" @click="deleteBtn">
          <div class="delete_left">
            <img src="../../assets/images/micro_communities/detail_delect@2x.png" alt="" />
          </div>
          <div class="delete_right">删除</div>
        </div>
        <div class="cancel" @click="adCancel">取消</div>
      </div>
    </van-popup>
    <van-popup v-model="releaseOperationshow" position="bottom" :overlay="true">
      <div class="releaseOperation">
        <div class="re_edit" @click="reEditBtn">
          <div class="re_edit_left">
            <img src="../../assets/images/micro_communities/detail_revise@2x.png" alt="" />
          </div>
          <div class="re_edit_right">修改</div>
        </div>
        <div class="delete" @click="deleteBtn">
          <div class="delete_left">
            <img src="../../assets/images/micro_communities/detail_delect@2x.png" alt="" />
          </div>
          <div class="delete_right">删除</div>
        </div>
        <div class="cancel" @click="reCancelBtn">取消</div>
      </div>
    </van-popup>
    <van-popup v-model="amountRewardshow" position="bottom" :overlay="true">
      <div class="amountReward">
        <div class="close" @click="amountRewardshow = false">
          <img src="../../assets/images/micro_communities/detail_clost@2x.png" alt="" />
        </div>
        <div class="usermessage">
          <div class="top" v-if="RewardMember.img">
            <img :src="RewardMember.img" alt="" />
          </div>
          <div class="name" v-if="RewardMember.name">
            {{ RewardMember.name }}
          </div>
        </div>
        <div class="listAmounts">
          <div class="title">请选择金额打赏</div>
          <ul>
            <li v-for="(item, index) in rewardArr" :key="index" :class="{ sel: rewardArrselect == index }" @click="shorewardArrBtn(index)">
              {{ $i18n.t("money") }}{{ item.name }}
              <div class="selimg" v-if="rewardArrselect == index">
                <img src="../../assets/images/micro_communities/detail_btn_cur@2x.png" alt="" />
              </div>
            </li>
          </ul>
        </div>
        <div class="custom_amount">
          <div class="top">自定义金额打赏</div>
          <div class="bottom">
            <input v-model="rewardArrmoney" type="number" name="" placeholder="请输入要打赏的金额" @focus="rewardArrMoneyBtn" />
          </div>
        </div>
        <div class="confirmReward" @click="confirmRewardBtn">确认打赏</div>
      </div>
    </van-popup>
    <van-popup v-model="rewardPayshow" position="bottom" :overlay="true">
      <div class="rewardPay">
        <div class="payMode">
          <ul>
            <li @click="payBtn(item)" v-for="(item, index) in btnData" :key="index">
              {{ item.name }}
            </li>
          </ul>
        </div>
        <div class="cancel" @click="rewardPayCancelBtn">取消</div>
      </div>
    </van-popup>
    <van-popup v-model="commentManagement" position="bottom" :overlay="true">
      <div class="rewardPay">
        <div class="content">
          <span>{{ replyName }}:</span>{{ replyshowcontent }}
        </div>
        <div class="payMode">
          <ul>
            <li @click="replyBtn">回复</li>
            <li @click="delBtn" v-if="is_own || detailsData.is_manager">删除</li>
          </ul>
        </div>
        <div class="cancel" @click="replyCancelBtn">取消</div>
      </div>
    </van-popup>
    <!--支付密码-->
    <!-- <van-popup v-model="popupSpecs" position="bottom" closeOnClickModal="true">
      <div class="pay-psw-info">
        <div class="pay_content_title">
          支付密码
        </div>
        <div class="pay_content">
          <div class="pay_content_view">
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw1 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw2 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw3 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw4 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw5 | pwd_filter }}</div>
            </div>
            <div class="ipt_pay">
              <div class="ipt_pay_p">{{ pw6 | pwd_filter }}</div>
            </div>
          </div>
        </div>
        <footer style="position: inherit;">
          <ul class="pay_btn">
            <li @click="onPassword('1')">1</li>
            <li @click="onPassword('2')">2</li>
            <li @click="onPassword('3')">3</li>
            <li @click="onPassword('4')">4</li>
            <li @click="onPassword('5')">5</li>
            <li @click="onPassword('6')">6</li>
            <li @click="onPassword('7')">7</li>
            <li @click="onPassword('8')">8</li>
            <li @click="onPassword('9')">9</li>
            <li class="b9"></li>
            <li @click="onPassword('0')">0</li>
            <li class="b9" @click="pwdDelete">删除</li>
          </ul>
        </footer>
      </div>
    </van-popup> -->
    <pay-keyboard :payKeyboardShow.sync="popupSpecs" @complete="onPassword"></pay-keyboard>
    <yz-comment-input v-model="showCommentInput" v-on:confirm="subMainBtn" :options="commentInputOptions" :replyName="replyName"  :zhugeid="replayIdZhuge"  :detailsData="detailsData">
      <div class="commentInput-slot-style" v-if="commentInputOptions.type == 'reply'">
        回复<span class="selcolor">@{{ replyName }}</span>
      </div>
    </yz-comment-input>
    <van-image-preview v-model="showImagePreview" :images="imagesPreview" :start-position="startPosition"> </van-image-preview>
  </div>
</template>

<script>
import microcommentdetails_controller from "./microcommentdetails_controller";

export default microcommentdetails_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.pcStyle {
  #microcommentdetails {
    #member {
      right: 50% !important;
      margin-right: -150px;
    }

    #cart {
      right: 50% !important;
      margin-right: -186px;
    }
  }
}

#microcommentdetails {
  #hoid {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
  }

  #cart {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
    box-sizing: content-box;
  }

  #member {
    padding: 0.3125rem;
    width: 1.6rem;
    position: fixed;
    z-index: 2;
    box-sizing: content-box;
  }

  #cart {
    right: 0;
  }

  #member {
    right: 2rem;
  }

  #hoid.hoet {
    transition: 0.1s;
    background: rgba(0, 0, 0, 0.2);
    width: 100%;
  }

  #back {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 100%;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.4);
    text-indent: 0;
    line-height: 1.6rem;
    overflow: hidden;
    i {
      font-size: 14px;
    }
  }

  .hoet #back {
    transition: 0.1s;
    background-color: rgba(237, 237, 237, 0);
  }

  padding-bottom: 4rem;

  .banner {
    background-color: #fff;
    position: relative;
    min-height: 26px;

    .centerbanner {
      img {
        width: 100%;
      }
    }

    .bannerindex {
      width: 2.25rem;
      height: 1.88rem;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 0.6rem;
      font-size: 0.88rem;
      line-height: 1.88rem;
      color: #fff;
      position: absolute;
      bottom: 0.63rem;
      right: 0.63rem;
    }
  }

  .details_show {
    background-color: #fff;

    .user_message {
      display: flex;
      justify-content: space-between;
      padding-top: 0.75rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;

      .user_left {
        display: flex;
        align-items: center;

        .pic {
          width: 2.5rem;
          height: 2.5rem;
          background-color: #f2f2f2;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }

          margin-right: 0.69rem;
        }

        .name_right {
          .name {
            font-size: 0.88rem;
            line-height: 0.94rem;
            color: #333;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 8rem;
            text-align: left;
            margin-bottom: 0.44rem;
            padding-top: 0.19rem;
          }

          .createdata {
            font-size: 0.75rem;
            line-height: 0.75rem;
            color: #999;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 8rem;
            text-align: left;
          }
        }
      }

      .uset_right {
        display: flex;
        align-items: center;

        .attention {
          // width: 3.38rem;
          // height: 1.63rem;
          padding: 0 0.5rem;
          background-color: #fff;
          border-radius: 12px;
          border: solid 0.06rem #f15353;
          line-height: 1.63rem;
          color: #f84b4b;
          font-size: 0.88rem;
          margin-right: 1rem;
        }

        .more {
          width: 1.25rem;
          height: 1.25rem;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }

    .article {
      word-break: break-all;
      padding-top: 0.69rem;
      padding-left: 0.78rem;
      padding-right: 0.78rem;
      font-size: 0.88rem;
      line-height: 1.13rem;
      color: #333;
      text-align: left;
      margin-bottom: 1.16rem;
    }

    .article_label {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-bottom: 0.5rem;

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          // height: 1.5rem;
          background-color: #f2f2f2;
          border-radius: 0.75rem;
          line-height: 1.5rem;
          font-size: 0.75rem;
          color: #1c96fe;
          padding-left: 0.69rem;
          padding-right: 0.69rem;
          margin-right: 0.8rem;
          margin-bottom: 0.63rem;
        }
      }
    }

    .loca_information {
      display: flex;
      justify-content: space-between;
      padding-left: 0.97rem;
      padding-right: 0.84rem;
      padding-bottom: 0.5rem;

      .localeft {
        display: flex;
        align-items: center;

        .letimg {
          width: 0.84rem;
          height: 0.84rem;

          img {
            width: 100%;
            height: 100%;
          }

          margin-right: 0.44rem;
        }

        .addressname {
          font-size: 0.88rem;
          line-height: 1.13rem;
          color: #999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 15rem;
          text-align: left;
        }
      }

      .locaright {
        font-size: 0.88rem;
        line-height: 1.13rem;
        color: #999;
        text-align: left;
      }
    }

    .showmessage {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      padding-bottom: 1.03rem;

      .content {
        background-color: #fafafa;
        border-radius: 0.38rem;
        padding: 0.63rem;

        .shopshow {
          display: flex;
          align-items: center;
          margin-bottom: 1.25rem;

          .leftimg {
            background: #fff;
            width: 3rem;
            height: 3rem;
            border: 0.06rem solid #eee;
            border-radius: 0.8rem;
            margin-right: 0.66rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .shopright {
            .name {
              font-size: 0.84rem;
              line-height: 1rem;
              max-width: 8rem;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              text-align: left;
              padding-top: 0.2rem;
            }

            .start_1 {
              text-align: left;

              img {
                width: 0.38rem;
                height: 0.38rem;
              }
            }

            .fobottom {
              color: #999;
              font-size: 0.75rem;
            }
          }
        }

        .goodsshow {
          display: flex;
          align-items: center;

          .leftimg {
            flex: 0 0 3rem;
            background: #fff;
            width: 3rem;
            height: 3rem;
            border: 0.06rem solid #eee;
            border-radius: 0.8rem;
            margin-right: 0.66rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .goodright {
            flex: 1;
            max-width: 85%;

            .goodsname {
              display: flex;
              justify-content: space-between;
              align-items: center;
              line-height: 1rem;
              margin-bottom: 0.75rem;
              padding-top: 0.2rem;

              .good-title {
                font-size: 0.875rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                text-align: left;
                flex: 1;
              }

              .do-btn {
                padding: 0 0.5rem;
                color: #f9ac00;
                border: 1px solid #f9ac00;
                border-radius: 1rem;
                font-size: 10px;
                height: 1.125rem;
              }
            }

            .fobottom {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .foleft {
                display: flex;
                align-items: center;
                height: 1rem;
                line-height: 1rem;
                margin-right: 1.69rem;

                .pic {
                  color: #f15353;
                  font-size: 0.88rem;
                  margin-right: 0.59rem;
                }

                .delpic {
                  color: #999;
                  font-size: 0.75rem;
                  text-decoration: line-through;
                }
              }

              .foright {
                display: flex;
                align-items: center;
                height: 1rem;
                line-height: 1rem;

                .sold {
                  color: #999;
                  font-size: 0.75rem;
                }
              }
            }
          }
        }
      }
    }

    .comment_display {
      .comment_top {
        padding-left: 0.81rem;
        padding-right: 0.81rem;
        padding-bottom: 1.31rem;

        .title {
          font-size: 0.75rem;
          line-height: 0.75rem;
          color: #666;
          text-align: left;
          padding-bottom: 0.66rem;
        }

        .reply {
          display: flex;
          align-items: center;

          .reply_left {
            width: 2rem;
            height: 2rem;
            margin-right: 0.72rem;

            img {
              border-radius: 50%;
              width: 100%;
              height: 100%;
            }
          }

          .reply_right {
            width: 19.22rem;
            // height: 1.88rem;
            line-height: 1.88rem;
            background-color: #f2f2f2;
            border-radius: 0.94rem;
            font-size: 0.88rem;
            color: #999;
            text-align: left;
            padding-left: 0.63rem;
          }
        }
      }

      .comment_bottom {
        padding-left: 0.81rem;
        padding-right: 0.81rem;

        .maincomment {
          li {
            display: flex;
            margin-top: 0.5rem;

            .maincommentleft {
              width: 2rem;
              height: 2rem;
              border-radius: 50%;
              margin-right: 0.72rem;

              img {
                width: 100%;
                height: 100%;
              }
            }

            .maincommentright {
              flex: 1;
              padding-bottom: 0.5rem;
              border-bottom: 0.06rem solid #eee;

              .master_content {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.4rem;

                .master_content_left {
                  text-align: left;

                  .name {
                    font-size: 0.88rem;
                    line-height: 1.13rem;
                    color: #1c96fe;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 10rem;
                  }

                  .createdata {
                    font-size: 0.75rem;
                    line-height: 1.13rem;
                    color: #999;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 10rem;
                  }

                  .review_content {
                    font-size: 0.88rem;
                    line-height: 1.13rem;
                    color: #333;
                  }
                }

                .master_content_right {
                  display: flex;
                }

                .thumb_up {
                  display: flex;
                  align-items: center;
                  flex-direction: column;

                  .thumb_img {
                    width: 0.94rem;
                    height: 0.94rem;

                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }

                  .thumb_num {
                    font-size: 0.63rem;
                    line-height: 1.13rem;
                    color: #333;
                  }
                }

                .reward-box {
                  margin-right: 0.875rem;

                  img {
                    width: 1.25rem;
                    height: 1.25rem;
                    display: block;
                    margin: 0;
                  }
                }
              }

              .deputy_comment {
                display: flex;
                margin-bottom: 0.4rem;

                .deputy_comment_left {
                  width: 1.5rem;
                  height: 1.5rem;
                  border-radius: 50%;
                  margin-right: 0.41rem;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .deputy_comment_right {
                  flex: 1;
                  display: flex;
                  justify-content: space-between;
                  text-align: left;

                  .deputy_message {
                    flex: 1;

                    .name {
                      font-size: 0.75rem;
                      line-height: 1.13rem;
                      color: #1c96fe;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: 10rem;
                    }

                    .createdata {
                      font-size: 0.63rem;
                      line-height: 1.13rem;
                      color: #999;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      width: 10rem;
                    }

                    .review_content {
                      font-size: 0.88rem;
                      line-height: 1.13rem;
                      color: #333;

                      .selecolor {
                        color: #1c96fe;
                      }
                    }
                  }

                  .thumb_up {
                    display: flex;
                    align-items: center;
                    flex-direction: column;

                    .thumb_img {
                      width: 0.94rem;
                      height: 0.94rem;

                      img {
                        width: 100%;
                        height: 100%;
                      }
                    }

                    .thumb_num {
                      font-size: 0.63rem;
                      line-height: 1.13rem;
                      color: #333;
                    }
                  }
                }
              }

              .comment-img {
                display: flex;
                flex-wrap: wrap;

                .comment-img-child {
                  margin-right: 0.5rem;
                  margin-top: 0.5rem;
                  background: #fbfbfb;
                  overflow: hidden;

                  img {
                    object-fit: contain;
                    width: 3rem;
                    height: 3rem;
                    margin: 0;
                    display: block;
                  }
                }
              }
            }
          }

          li:last-of-type {
            .maincommentright {
              border-bottom: none;
            }
          }
        }
      }

      .multiple_comments {
        padding-top: 0.81rem;
        padding-bottom: 0.81rem;
        font-size: 0.88rem;
        color: #1c96fe;
        border-top: 0.06rem solid #eee;
      }
    }
  }

  .bottom_operation {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 48px;
    background-color: #fff;
    text-align: left;

    .content {
      display: flex;
      align-items: center;
      height: 100%;
      margin: 0 0.75rem;
      .reply {
        display: flex;
        align-items: center;
        flex: 1;
        overflow: hidden;
        // height: 1.88rem;
        line-height: 1.88rem;
        background-color: #f2f2f2;
        border-radius: 0.94rem;
        font-size: 12px;
        color: #999;

        .reply_left {
          width: 1.2rem;
          height: 1.2rem;
          margin-left: 0.75rem;
          margin-right: 0.53rem;

          img {
            width: 100%;
            height: 100%;
            vertical-align: super;
          }
        }
        .reply_right {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .thumbup {
        display: flex;
        align-items: center;
        margin-left: 0.78rem;

        .thumbupimg {
          width: 1.28rem;
          height: 1.31rem;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .thumbupnum {
          // line-height: 0.75rem;
          color: #333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 4px;
        }
      }
    }
  }

  .replyMainComment {
    display: flex;
    padding-top: 0.8rem;
    padding-bottom: 0.5rem;
    padding-left: 1rem;
    align-items: center;
    justify-content: space-between;

    .left {
      width: 18.13rem;
      background-color: #f5f5f5;
      border-radius: 0.5rem;
      padding: 0.5rem;

      /deep/.van-cell {
        background: transparent;
        padding: 0;
      }

      /deep/.van-field__control {
        max-height: 10rem;
      }

      .comment-imgs {
        display: flex;
        flex-wrap: wrap;

        /deep/.van-uploader__preview-image {
          width: 3rem;
          height: 3rem;
        }

        /deep/.van-uploader__upload {
          width: 3rem;
          height: 3rem;
          display: none;
        }
      }
    }

    .right {
      // width: 3rem;
      flex: 1;
      margin: 0 0.5rem;
      height: 1.88rem;
      font-size: 0.94rem;
      line-height: 1.88rem;
      color: #0072e8;
    }
  }

  .operate-boxs {
    display: flex;
    padding: 0 1rem 0.5rem;

    .operate-btn {
      margin-right: 0.5rem;

      i {
        font-size: 20px;
      }
    }
  }

  .replyComment {
    padding: 1rem;

    .top {
      margin-bottom: 0.5rem;

      .left {
        font-size: 0.88rem;
        line-height: 1.13rem;
        color: #333;
        text-align: left;

        .selcolor {
          color: #1c96fe;
        }
      }
    }

    .bottom {
      height: 8rem;
      background-color: #f5f5f5;
      border-radius: 0.94rem;
      position: relative;
      padding: 0.5rem;

      textarea {
        height: 6rem;
        width: 100%;
        overflow: auto;
        background-color: #f5f5f5;
        border: none;
      }

      .replysubmit {
        position: absolute;
        bottom: 0.5rem;
        right: 1rem;
        width: 2.56rem;
        height: 1rem;
        line-height: 1rem;
        font-size: 0.88rem;
      }
    }
  }

  .adminOperation {
    background-color: #f2f2f2;

    .recommend,
    .top_set,
    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      height: 3.44rem;
      border-bottom: 0.06rem solid #eee;
    }

    .delete {
      border-bottom: none;
      margin-bottom: 0.63rem;
    }

    .recommend_left,
    .top_set_left,
    .delete_left {
      height: 1.22rem;
      width: 1.22rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .recommend_right,
    .top_set_right,
    .delete_right {
      font-size: 1rem;
      color: #333;
      margin-left: 0.28rem;
    }

    .cancel {
      height: 3.44rem;
      background: #fff;
      color: #333;
      font-size: 1rem;
      line-height: 3.44rem;
    }
  }

  .releaseOperation {
    background-color: #f2f2f2;

    .re_edit,
    .delete {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      height: 3.44rem;
      border-bottom: 0.06rem solid #eee;
    }

    .re_edit_left,
    .delete_left {
      height: 1.22rem;
      width: 1.22rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .re_edit_right,
    .delete_right {
      font-size: 1rem;
      color: #333;
      margin-left: 0.28rem;
    }

    .delete {
      border-bottom: none;
      margin-bottom: 0.63rem;
    }

    .cancel {
      height: 3.44rem;
      background: #fff;
      color: #333;
      font-size: 1rem;
      line-height: 3.44rem;
    }
  }

  .amountReward {
    position: relative;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 1.25rem;
    padding-bottom: 1.31rem;

    .close {
      top: 0.97rem;
      right: 1.03rem;
      position: absolute;
      width: 0.84rem;
      height: 0.84rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .usermessage {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1.22rem;

      .top {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 50%;
        margin-bottom: 0.69rem;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        font-size: 1rem;
        color: #333;
        line-height: 1rem;
        font-weight: bold;
      }
    }

    .listAmounts {
      .title {
        text-align: left;
        font-size: 0.88rem;
        color: #333;
        font-weight: bold;
        margin-bottom: 0.94rem;
      }

      ul {
        display: flex;
        flex-wrap: wrap;

        li {
          position: relative;
          margin-right: 0.84rem;
          width: 6.75rem;
          height: 2.38rem;
          background-color: #fff;
          border-radius: 0.25rem;
          border: solid 0.06rem #e5e5e5;
          line-height: 2.38rem;
          margin-bottom: 0.66rem;
          font-size: 0.88rem;
          color: #333;

          .selimg {
            position: absolute;
            width: 1.84rem;
            height: 1.19rem;
            top: 0;
            right: 0;

            img {
              display: block;
              width: 100%;
              height: 100%;
            }
          }
        }

        li.sel {
          border-color: #f15353;
          color: #f15353;
        }

        li:nth-of-type(3n) {
          margin-right: 0;
        }
      }
    }

    .custom_amount {
      margin-bottom: 3.09rem;

      .top {
        text-align: left;
        font-size: 0.88rem;
        color: #333;
        font-weight: bold;
        margin-bottom: 0.94rem;
      }

      .bottom {
        height: 2.41rem;
        background-color: #fff;
        border-radius: 0.25rem;
        border: solid 0.06rem #e5e5e5;

        input {
          width: 100%;
          height: 100%;
          padding-left: 0.4rem;
          border: none;
        }
      }
    }

    .confirmReward {
      width: 10rem;
      height: 2.5rem;
      background-color: #f15353;
      border-radius: 0.25rem;
      line-height: 2.5rem;
      font-size: 1rem;
      color: #fff;
      margin: 0 auto;
    }
  }

  .rewardPay {
    background-color: #f2f2f2;

    .content {
      background-color: #fff;

      span {
        color: #1c96fe;
      }

      text-align: left;
      padding: 0.6rem;
      min-height: 3.44rem;
      font-size: 0.8rem;
      line-height: 1rem;
      width: 100%;
      white-space: normal;
      word-break: break-all;
      word-wrap: break-word;
    }

    .payMode {
      ul {
        li {
          background-color: #fff;
          height: 3.44rem;
          border-bottom: 0.06rem solid #eee;
          font-size: 1rem;
          color: #333;
          line-height: 3.44rem;
        }

        li:last-of-type {
          border-bottom: none;
          margin-bottom: 0.69rem;
        }
      }
    }

    .cancel {
      background-color: #fff;
      height: 3.44rem;
      border-bottom: 0.06rem solid #eee;
      font-size: 1rem;
      color: #333;
      line-height: 3.44rem;
    }
  }
}

.commentInput-slot-style {
  height: 1.5rem;
  line-height: 2rem;
  text-align: left;
  padding-left: 0.875rem;

  .selcolor {
    color: #1c96fe;
  }
}

.pay-psw-info {
  overflow-y: scroll;
  width: 100vw;
  height: auto;
  background: #fff;
  max-height: 80vh;
  padding-top: 0.625rem;

  .pay_content_title {
    width: 100vw;
    height: 1.875rem;
    line-height: 1.875rem;
    margin-bottom: 0.625rem;
    font-size: 18px;
  }

  .pay_content {
    width: 100vw;
    height: 3.125rem;
    margin-bottom: 0.625rem;
  }

  .pay_content_view {
    width: 100vw;
    height: 3.125rem; // margin-left: 0.125rem;
    border-bottom: 0.0625rem solid #ddd;
    border-top: 0.0625rem solid #ddd;
    border-right: 0.0625rem solid #ddd;
  }

  .ipt_pay_p {
    line-height: 3.125rem;
    height: 3.125rem;
    font-size: 20px;
  }

  .ipt_pay {
    float: left;
    width: 16.27%;
    height: 3.125rem;
    text-align: center;
    border-left: 0.0625rem solid #ddd;
  }

  footer {
    position: absolute;
    bottom: 0;
    width: 100vw;
    font-weight: 600;
  }

  .pay_btn {
    border-top: 0.0625rem solid #ddd;
    width: 100vw;
    height: auto;
  }

  .pay_btn li {
    width: 33%;
    float: left;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
    background: #fff;
    font-size: 14px;
    border-right: 0.0625rem solid #ddd;
    border-bottom: 0.0625rem solid #ddd;
  }

  .pay_btn li:active {
    background: #c2c2c2;
  }

  .b9:active {
    background: #fff !important;
  }

  .b9 {
    background: #c2c2c2 !important;
  }
}
</style>
