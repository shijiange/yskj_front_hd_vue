<!-- 主播助手 直播间 -->
<template>
  <div id="helper_liveRoom">
    <c-title :hide="false" text="直播间"></c-title>
    <div class="set-pc-style video-main" :class="{ 'pk-video-main': isLivePK }">
      <div class="videos" id="helper_video"></div>
      <div class="videos videos-pk" id="videoPlayerPK" v-show="isLivePK"></div>
      <img class="playbtn" src="../../assets/images/play1.png" alt="" v-if="loadedVideoDataOk" @click.stop="noAutoPlaying" />
    </div>
    <div style="height: 200px;"></div>
    <div class="main">
      <van-tabs v-model="active" sticky :offset-top="240" @click="getOther">
        <van-tab title="商品">
          <ul class="good_list">
            <li class="good_child" v-for="(item, index) in goods" :key="index">
              <div class="g_left">
                <img :src="item.thumb" alt="" />
                <div class="g_index">{{ item.sort }}</div>
              </div>
              <div class="g_right">
                <div class="g_title">{{ item.title }}</div>
                <div class="g_bottom">
                  <div class="money">
                    <em>{{ $i18n.t("money") }}</em
                    >{{ item.price }}
                  </div>
                  <div class="g_btn" v-show="now_goods != item.id" @click="setActiveGood(item.id)">设置当前讲解</div>
                  <div class="g_btn active_goods" v-show="now_goods == item.id" @click="cancelActiveGood(item.id)">
                    取消当前讲解
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="fun.isTextEmpty(goods)" />
        </van-tab>
        <van-tab title="聊天">
          <ul class="chat_list" id="chat_messages">
            <li class="chat_child" v-for="(item, index) in messageList" :key="index">
              <template v-if="!fun.isTextEmpty(item.text)">
                <img class="avator" :src="item.memberAvatar || ''" alt="" />
                <div class="member">
                  <div class="nickname">{{ item.nickName }}</div>
                  <div class="content">{{ item.text }}</div>
                </div>
                <div class="more_operat" @click="activeIndex = index">
                  .<br />.<br />.<br />
                  <div class="chat_btn" v-if="activeIndex == index">
                    <div @click="clickBan(item)"><i class="iconfont icon-all_stopcommentsl"></i> 禁言</div>
                    <em style="padding: 0 0.25rem;">|</em>
                    <div @click="clickOut(item)"><i class="iconfont icon-all_tiren"></i> 踢人</div>
                  </div>
                </div>
              </template>
              <template v-if="fun.isTextEmpty(item.text)">
                {{ item.content }}
              </template>
            </li>
            <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="fun.isTextEmpty(messageList)" />
          </ul>
        </van-tab>
        <van-tab title="禁言记录">
          <ul class="member_list">
            <li class="member" v-for="(item, index) in bannedSaid" :key="index">
              <img :src="item.avatar" alt="" class="avator" />
              <div class="nickname">{{ item.nickname }}</div>
              <div class="btn" @click="bannedMember(item.member_id, true)">解禁</div>
            </li>
          </ul>
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="fun.isTextEmpty(bannedSaid)" />
        </van-tab>
        <van-tab title="踢人记录">
          <ul class="member_list">
            <li class="member" v-for="(item, index) in outRoom" :key="index">
              <img :src="item.avatar" alt="" class="avator" />
              <div class="nickname">{{ item.nickname }}</div>
              <div class="btn" @click="outRoomMember(item.member_id, true)">恢复</div>
            </li>
          </ul>
          <img src="../../assets/images/blank.png" alt="" style="width: 5rem; margin: 2rem 0;" v-if="fun.isTextEmpty(outRoom)" />
        </van-tab>
      </van-tabs>
    </div>
    <van-popup v-model="showBannedMember" round position="bottom" class="popup_style">
      <img :src="activeMemberInfo.memberAvatar || ''" alt="" class="popup_img" />
      <div class="member_name">{{ activeMemberInfo.nickName }}</div>
      <div class="warn_text">是否禁止该会员发言</div>
      <div class="btn_box">
        <div class="btn_child" @click="showBannedMember = false">取消</div>
        <div class="btn_child success" @click="bannedMember(activeMemberInfo.memberId)">确认</div>
      </div>
    </van-popup>
    <van-popup v-model="showOutRoomMember" round position="bottom" class="popup_style">
      <img :src="activeMemberInfo.memberAvatar" alt="" class="popup_img" />
      <div class="member_name">{{ activeMemberInfo.nickName }}</div>
      <div class="warn_text">是否将该会员移出直播间</div>
      <div class="btn_box">
        <div class="btn_child" @click="showOutRoomMember = false">取消</div>
        <div class="btn_child success" @click="outRoomMember(activeMemberInfo.memberId)">确认</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from "vant";
var player;
// var timer = null;
// IM Web SDK
import TIM from "tim-js-sdk";
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let options = null;
let playerPK = null;
let tim = null; // SDK 实例通常用 tim 表示
export default {
  data() {
    return {
      messageList: [],
      taideRoom: {},
      liveSrc: null,
      loadedVideoDataOk: false,
      showBannedMember: false,
      showOutRoomMember: false,
      activeMemberInfo: {}, //当前聊天列表显示按钮的会员信息，用于禁言和踢出直播间
      activeIndex: null, //聊天按钮显示
      goods: [],
      now_goods: null, //当前讲解的商品
      bannedSaid: [], //禁言列表
      outRoom: [], //踢人列表
      livePKData: {},
      isLivePK: false,
      liveRTCSrc: "",
      livePKRTCSrc: "",
      livePKSrc: "", //pk链接 m3u8协议
      openRTC: false //是否开启rtc协议
    };
  },
  components: {
    cTitle
  },
  computed: {},
  deactivated() {
    if (player) {
      player.destroy(); //销毁播放器实例
      player = null;
    }
    if (playerPK) {
      playerPK.destroy();
      playerPK = null;
    }
    this.logout(); //退出聊天室
  },
  mounted() {
    let self = this;
    if (!document.getElementById("TcPlayerJs")) {
      //避免多次引入
      const script = document.createElement("script");
      script.type = "text/javascript";
      if (window.location.host.indexOf("localhost") > -1) {
        script.src = this.fun.getSiteRoot() + "/static/app/TcPlayer-2.4.1.js";
      } else {
        script.src = this.fun.getSiteRoot() + "/addons/yun_shop/static/app/TcPlayer-2.4.1.js";
      }
      script.id = "TcPlayerJs";
      document.body.appendChild(script);
      script.onload = script.onreadystatechange = function() {
        if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
          console.log("js onload");
          self.getIMSDKAppID();
        }
        script.onload = script.onreadystatechange = null; //删除事件处理函数。
      };
    } else {
      self.getIMSDKAppID();
    }
  },
  methods: {
    getIMSDKAppID() {
      let that = this;
      $http.get("plugin.room.frontend.im.get-im-sdk", {}, "加载中").then(
        function(response) {
          if (response.result === 1) {
            if (!that.fun.isTextEmpty(response.data.sdkappid)) {
              options = {
                SDKAppID: response.data.sdkappid // 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
              };
              // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
              tim = TIM.create(options); // SDK 实例通常用 tim 表示
              // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
              // tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
              tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
              that.chatEventList(); //加载聊天事件
            }
            that.getData();
          } else {
            console.log("error:::SDKAppID");
          }
        },
        function(response) {
          // error callback
        }
      );
    },
    logout() {
      let promise = tim.logout();
      promise
        .then(function(imResponse) {})
        .catch(function(imError) {
          console.warn("logout error:", imError);
        });
    },
    chatMyProfile() {
      let that = this;
      let promise = tim.getMyProfile();
      promise
        .then(function(imResponse) {
          // console.log("个人资料 - Profile 实例",imResponse.data); // 个人资料 - Profile 实例
          let myData = imResponse.data;
          if (!myData.nick) {
            that.changeMyProfile();
          }
        })
        .catch(function(imError) {
          console.warn("getMyProfile error:", imError); // 获取个人资料失败的相关信息
        });
    },
    //修改我的个人信息
    changeMyProfile() {
      let that = this;
      let promise = tim.updateMyProfile({
        nick: that.taideRoom.userNickname,
        avatar: that.taideRoom.userAvatar
      });
      promise
        .then(function(imResponse) {
          // console.log(imResponse.data); // 更新资料成功
        })
        .catch(function(imError) {
          console.warn("updateMyProfile error:", imError); // 更新资料失败的相关信息
        });
    },
    //获取群详细资料
    chatJoinGroup() {
      let that = this;
      let promise = tim.joinGroup({
        groupID: that.taideRoom.groupId,
        type: TIM.TYPES.GRP_CHATROOM
      });
      promise
        .then(function(imResponse) {
          switch (imResponse.data.status) {
          case TIM.TYPES.JOIN_STATUS_WAIT_APPROVAL:
            break; // 等待管理员同意
          case TIM.TYPES.JOIN_STATUS_SUCCESS: // 加群成功
            console.log("加群成功", imResponse.data.group); // 加入的群组资料
            that.isSuccessIM = true;
            that.$nextTick(() => {
              // that.comeLiveRoom()
            });
            break;
          default:
            break;
          }
        })
        .catch(function(imError) {
          console.warn("joinGroup error:", imError); // 申请加群失败的相关信息
        });
    },
    //聊天登录
    chatLogin() {
      let that = this;
      let promise = tim.login({
        userID: that.taideRoom.userID.toString(),
        userSig: that.taideRoom.userSig
      });
      promise
        .then(function(imResponse) {
          that.chatJoinGroup();
        })
        .catch(function(imError) {
          console.warn("login error:", imError); // 登录失败的相关信息
        });
    },
    quitGroup() {
      //退出群组
      let that = this;
      if (this.isSuccessIM) {
        let promise = tim.quitGroup(that.taideRoom.groupId);
        promise
          .then(function(imResponse) {
            console.log("退出成功的群", imResponse.data.groupID); // 退出成功的群 ID
          })
          .catch(function(imError) {
            console.warn("退群失败 quitGroup error:", imError); // 退出群组失败的相关信息
          });
      }
    },
    chatEventList() {
      let that = this;
      // 监听事件，例如：
      tim.on(TIM.EVENT.SDK_READY, function(event) {
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // console.log("收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口")
        that.chatMyProfile();
        // event.name - TIM.EVENT.SDK_READY
      });
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        // event.name - TIM.EVENT.MESSAGE_RECEIVED
        // event.data - 存储 Message 对象的数组 - [Message]

        //防止重新接受两条信息
        // console.log('TIM.EVENT.MESSAGE_RECEIVED', event);
        if (that.lasttime == event.data[0].time) {
          return;
        } else {
          that.lasttime = event.data[0].time;
        }
        let message = event.data;
        message.forEach(function(val, index) {
          let conversationType = val.conversationType;
          //判断消息来源群或者个人
          console.log("=============y有信息", val);
          if (conversationType == TIM.TYPES.CONV_GROUP) {
            let data = val;
            //后台发送过来的消息处理
            if (data.from == "administrator") {
              // if (data.payload.extension == 'welcome') {
              //   //进入直播间自动回复
              //   let json = JSON.parse(data.payload.description)
              //   that.messageList.push(json)
              //   that.$nextTick(() => {
              //     that.chatMessagesBottom()
              //   })
              // }
            }
            if (data.type == "TIMCustomElem") {
              console.log("=============y有信息", data);
              //自定义类型解析
              if (data.payload.extension == "customPkGroup") {
                console.log("连麦-----------------");
                that.livePKData = JSON.parse(data.payload.description);
                playerPK.load(that.livePKData.playUrl);
                that.isLivePK = true;
              } else if (data.payload.extension == "customQuitPkGroup") {
                // 结束连麦
                console.log("结束连麦");
                playerPK.pause();
                that.isLivePK = false;
                that.livePKData = {};
              } else if (data.payload.extension == "customText") {
                let messageListData = JSON.parse(data.payload.description);
                that.messageList.push(messageListData);
                that.$nextTick(() => {
                  that.chatMessagesBottom();
                });
              } else if (data.payload.extension == "welcome") {
                //进入直播间自动回复
                let json = JSON.parse(data.payload.description);
                that.messageList.push(json);
                that.$nextTick(() => {
                  that.chatMessagesBottom();
                });
              }
            }
          } else if (conversationType == TIM.TYPES.CONV_C2C) {
            console.log("1");
          }
        });
      });
      tim.on(TIM.EVENT.KICKED_OUT, function(event) {
        // 收到被踢下线通知
        // event.name - TIM.EVENT.KICKED_OUT
        // event.data.type - 被踢下线的原因，例如:
        //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
        //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
        //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢
        Toast("下线通知：您的IM在其他设备登录！");
      });
    },
    chatMessagesBottom() {
      let ele = document.getElementById("chat_messages");
      ele.scrollTop = ele.scrollHeight; // 使滚动条保持在底部
    },
    getData() {
      let that = this;
      $http
        .post("plugin.room.frontend.anchor-aide.room", { id: this.$route.params.id }, "")
        .then(response => {
          if (response.result === 1) {
            this.taideRoom = response.data;
            if (response.data.status == 3 || response.data.status == "3") {
              this.openRTC = Number(response.data.voice_open) == 1 ? true : false;
              this.liveSrc = response.data.play_url_m3u8;
              this.liveRTCSrc = this.openRTC ? response.data.play_url_rtc : ""; //voice_open：是否开启rtc模式
              this.livePKSrc = response.data.voice_status == 0 ? response.data.play_url_m3u8 : response.data.voice_anchor.play_url.play_url_m3u8;
              if (this.openRTC) {
                //开启rtc
                //voice_status 是否正在pk
                this.livePKRTCSrc = response.data.voice_status == 0 ? response.data.play_url_rtc : response.data.voice_anchor.play_url.play_url_rtc; //voice_status==1已经在pk
              } else {
                //没开启rtc,只是传统的hls模式
                this.livePKRTCSrc = "";
              }
              this.setTcPlayer(true);
              if (response.data.voice_status) {
                this.livePKData = response.data.voice_anchor;
                this.isLivePK = true;
              }
              that.setPKPlayer();
            } else {
              this.liveSrc = response.data.video_url;
              this.setTcPlayer(false);
            }

            this.goods = response.data.goods;
            this.now_goods = response.data.now_goods && response.data.now_goods.goods_id;
            setTimeout(() => {
              that.chatLogin();
            }, 1000);
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setActiveGood(_id) {
      // if(this.now_goods!= null){
      //   this.cancelActiveGood(_id,true);
      //   return;
      // }
      // timer = null;
      $http
        .post("plugin.room.frontend.anchor-aide.explain-goods", { id: this.$route.params.id, goods_id: _id }, "")
        .then(response => {
          if (response.result === 1) {
            Toast("设置成功！");
            this.now_goods = _id;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    setTcPlayer(_type) {
      let that = this;
      player = new TcPlayer("helper_video", {
        live: _type,
        x5_type: "h5",
        x5_fullscreen: false,
        systemFullscreen: false,
        x5_orientation: 1,
        x5_player: true,
        flash: false,
        webrtc: this.liveRTCSrc,
        m3u8: this.liveSrc, //请替换成实际可用的播放地址
        autoplay: false, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        width: that.fun.getPhoneEnv() != 3 ? window.innerWidth : "375", //视频的显示宽度，请尽量使用视频分辨率宽度
        height: 200, //视频的显示高度，请尽量使用视频分辨率高度
        wording: {
          2032: "请求视频失败，请检查网络",
          2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        },
        controls: _type ? "none" : "default ",
        Flash: false,
        listener: function(msg) {
          // console.log(msg.type);
          if (msg.type == "loadeddata") {
            console.log("loadeddata===============");
          }
          if (msg.type == "loadedmetadata") {
            // console.log("loadeddata===============");
          }
          if (msg.type == "load") {
            setTimeout(() => {
              that.loadedVideoDataOk = true;
            }, 800);
          }
          if (msg.type == "error") {
            console.log("error::视频播放不了.....");
            Toast("该视频出现问题了！");
            that.loadedVideoDataOk = true;
          }
          if (msg.type == "play") {
            that.loadedVideoDataOk = false;
            // console.log("loadeddata===============");
          }
          if (msg.type == "playing") {
            console.log("playing===============");
            that.loadedVideoDataOk = false;
          }
          if (msg.type == "pause") {
            that.loadedVideoDataOk = true;
          }
          if (msg.type == "timeupdate") {
            // console.log("loadeddata===============");
          }
        }
      });
    },
    setPKPlayer() {
      playerPK = new TcPlayer("videoPlayerPK", {
        live: true,
        x5_type: "h5",
        x5_fullscreen: true,
        systemFullscreen: true,
        x5_orientation: 1,
        x5_player: true,
        flash: false,
        webrtc: this.livePKRTCSrc,
        m3u8: this.livePKSrc, //请替换成实际可用的播放地址
        autoplay: true, //iOS 下 safari 浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        width: this.fun.getPhoneEnv() != 3 ? window.innerWidth : "375", //视频的显示宽度，请尽量使用视频分辨率宽度
        height: "200", //视频的显示高度，请尽量使用视频分辨率高度
        wording: {
          2032: "请求视频失败，请检查网络",
          2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        },
        controls: "none",
        Flash: false
      });
      playerPK.play();
    },
    noAutoPlaying() {
      player.play();
      playerPK.play();
      if (!this.isLivePK) {
        //进入时已在pk的，无需暂停
        setTimeout(() => {
          playerPK.pause();
        }, 50);
      }
    },
    cancelActiveGood(_id, _set) {
      let that = this;
      $http
        .post("plugin.room.frontend.anchor-aide.cancel-explain", { id: this.$route.params.id, goods_id: _id }, {})
        .then(response => {
          if (response.result === 1) {
            that.now_goods = null;
            // if(_set){
            //   timer = setTimeout(() => {
            //     that.setActiveGood(_id);
            //   }, 500);
            // }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getOther(name) {
      if (name == 0 || name == 1) {
        return;
      }
      let _url = name == 2 ? "plugin.room.frontend.anchor-aide.chat-ban-list" : "plugin.room.frontend.anchor-aide.room-ban-list";
      $http
        .post(_url, { id: this.$route.params.id, page: 1 })
        .then(response => {
          if (response.result === 1) {
            if (name == 2) {
              this.bannedSaid = response.data.data;
            } else {
              this.outRoom = response.data.data;
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    bannedMember(_mid, cancel) {
      //cancel 为true时，取消禁言
      let _url = cancel ? "plugin.room.frontend.anchor-aide.chat-reply" : "plugin.room.frontend.anchor-aide.chat-ban";
      $http
        .post(_url, { id: this.$route.params.id, member_id: _mid })
        .then(response => {
          if (response.result === 1) {
            let text = cancel ? "已解除禁言" : "禁言成功！";
            this.showBannedMember = false;
            Toast(text);
            if (cancel) {
              this.getOther(2);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    outRoomMember(_mid, cancel) {
      //cancel 为true时，恢复踢出直播间
      let _url = cancel ? "plugin.room.frontend.anchor-aide.room-reply" : "plugin.room.frontend.anchor-aide.room-ban";
      $http
        .post(_url, { id: this.$route.params.id, member_id: _mid })
        .then(response => {
          if (response.result === 1) {
            let text = cancel ? "该会员已恢复" : "已被踢出直播间！！";
            this.showOutRoomMember = false;
            Toast(text);
            if (cancel) {
              this.getOther(3);
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    clickBan(_info) {
      this.showBannedMember = true;
      this.activeMemberInfo = _info;
    },
    clickOut(_info) {
      this.showOutRoomMember = true;
      this.activeMemberInfo = _info;
    }
  }
};
</script>
<style lang="scss">
.pk-video-main {
  display: flex;

  .vcp-player {
    width: 100% !important;
  }

  .videos {
    width: 50% !important;

    video {
      width: 100% !important;
    }
  }
}
</style>
<style lang="scss" scoped>
#helper_liveRoom {
  .video-main {
    width: 100%;
    height: 200px;
    position: fixed;
    top: 40px;
    left: 0;
    z-index: 999;
    background-color: #979797;

    .videos {
      width: 100%;
      height: 200px;
      z-index: 999;
    }

    .playbtn {
      position: absolute;
      width: 60px;
      height: 60px;
      top: 65px;
      left: 50%;
      margin-left: -30px;
      z-index: 999;
    }
  }

  .main {
    .good_list {
      padding: 0 0.875rem;
      background: #fff;

      .good_child {
        display: flex;
        width: 100%;
        padding: 0.875rem 0;
        border-bottom: 0.0625rem solid #f3f3f4;

        .g_left {
          width: 5rem;
          height: 5rem;
          overflow: hidden;
          border-radius: 0.25rem;
          position: relative;
          margin-right: 0.875rem;

          img {
            width: 100%;
            height: 100%;
          }

          .g_index {
            color: #fff;
            height: 1rem;
            line-height: 1rem;
            background-color: #ff9c00;
            border-radius: 0.25rem 0 0.25rem 0;
            padding: 0 0.5rem;
            position: absolute;
            top: 0;
            left: 0;
          }
        }

        .g_right {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: space-between;

          .g_title {
            height: 2.25rem;
            line-height: 1.125rem;
            font-weight: bold;
            color: #000;
            text-align: left;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }

          .g_bottom {
            display: flex;
            justify-content: space-between;

            .money {
              em {
                font-size: 0.625rem;
                color: #999;
                font-weight: 400;
              }

              font-size: 1rem;
              color: #f53c3f;
              font-weight: bold;
            }

            .g_btn {
              padding: 0 0.5rem;
              border: 1px solid #ff2c29;
              border-radius: 0.825rem;
              height: 1.5rem;
              line-height: 1.5rem;
              color: #ff2c29;
            }

            .active_goods {
              background: #ff2c29;
              color: #fff;
            }
          }
        }
      }
    }

    .chat_list {
      padding: 0 0.875rem;
      background: #fff;

      .chat_child {
        padding: 0.5rem 0;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .avator {
          margin: 0;
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 100%;
          overflow: hidden;
          margin-right: 0.25rem;
        }

        .member {
          flex: 1;
          overflow: hidden;
          text-align: left;
          margin-right: 0.25rem;

          .nickname {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.625rem;
            margin-bottom: 0.25rem;
          }

          .content {
            line-height: 1.25rem;
            font-size: 0.875rem;
          }
        }

        .more_operat {
          width: 1rem;
          font-weight: 900;
          line-height: 6px;
          color: #666;
          height: 2rem;
          position: relative;

          .chat_btn {
            position: absolute;
            height: 1.5rem;
            line-height: 1.5rem;
            background: #666;
            color: #fff;
            padding: 0 0.3rem;
            font-size: 0.875rem;
            font-weight: 400;
            top: 0;
            left: -7rem;
            border-radius: 0.25rem;
            overflow: hidden;
            display: flex;

            i {
              font-size: 0.625rem;
              font-weight: 400;
            }
          }
        }
      }
    }

    .member_list {
      padding: 0 1rem;
      background: #fff;

      .member {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;

        .avator {
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 100%;
          overflow: hidden;
          margin-right: 0.5rem;
        }

        .nickname {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.875rem;
          text-align: left;
          margin-right: 0.5rem;
        }

        .btn {
          width: 3.375rem;
          height: 1.5rem;
          line-height: 1.5rem;
          background-color: #ff6333;
          border-radius: 0.75rem;
          color: #fff;
        }
      }
    }
  }

  .popup_style {
    display: flex;
    flex-direction: column;
    overflow: unset;

    .popup_img {
      width: 4.375rem;
      height: 4.375rem;
      border-radius: 100%;
      overflow: hidden;
      margin-top: -2rem;
    }

    .member_name {
      text-align: center;
      font-size: 0.875rem;
      color: #666;
      width: 12rem;
      margin: 0 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 0.875rem;
    }

    .warn_text {
      font-size: 1.125rem;
      color: #000;
      font-weight: bold;
      width: 100%;
      text-align: center;
      margin-top: 2.375rem;
    }

    .btn_box {
      display: flex;
      justify-content: space-around;
      margin: 2.875rem 0 3rem;

      .btn_child {
        width: 10rem;
        height: 2.5rem;
        line-height: 2.5rem;
        background-color: #ccc;
        border-radius: 0.375rem;
        text-align: center;
        overflow: hidden;
        color: #fff;
      }

      .success {
        background-color: #ff2c29;
      }
    }
  }
}
</style>
