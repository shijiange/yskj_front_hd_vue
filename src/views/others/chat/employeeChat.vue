<template>
  <div class="chat-main">
    <div class="chat-scroll" id="chat-data">
      <div class="conversation" v-for="item in chatList" :key="item.id">
        <template v-if="item.is_system_opt">
          <div class="system-opt-message">
            {{item.content}}
          </div>
        </template>
        <template v-else-if="item.is_backed">
          <div class="system-opt-message">
            <div v-if="item.direction_type===0">您撤回了消息 </div>
            <div v-if="item.direction_type===1">{{memberInfo.nickname}}撤回了消息 </div>
          </div>
        </template>
        <template v-else>
          <div class="chat-msg my-msg" v-if="item.direction_type===0">
            <div class="avater">
              <img :src="employeeInfo.avatar">
            </div>
            <div class="content">
              <div class="name">
                <span class="content-time">
                  {{item.created_at}}
                </span>
              </div>
              <div class="my-info">
                <p class="txt">
                  <template v-if="item.content_type==1">
                    <ChatContentPic :item="item" />
                  </template>
                  <template v-else-if="item.content_type==2">
                    <ChatContentGoods :item="item" />
                  </template>
                  <template v-else-if="item.content_type==3">
                    <ChatContentOrder :item="item" />
                  </template>
                  <template  v-else>
                    <ChatContentTxt :item="item"/>
                  </template>
                </p>
                <div class="arrow-r"></div>
              </div>
            </div>
          </div>
          <div class="chat-msg other-msg" v-else-if="item.direction_type==1">
            <div class="avater">
              <img :src="memberInfo.avatar">
            </div>
            <div class="content">
              <div class="name">
                {{memberInfo.nickname}}
                <span class="content-time">
                  {{item.created_at}}
                </span>
              </div>
              <el-popover v-model="showMoreChatOpt[item.id]" placement="bottom" trigger="click">
              <template #reference>
              <div class="other-info">
                <div v-if="!item.id" class="send-msg-loading">
                  <img src="../../../assets/images/img_loading.gif">
                </div>
                <p class="txt">
                  <template v-if="item.content_type==1">
                    <ChatContentPic :item="item" />
                  </template>
                  <template v-else-if="item.content_type==2">
                    <ChatContentGoods :item="item" />
                  </template>
                  <template v-else-if="item.content_type==3">
                    <ChatContentOrder :item="item" />
                  </template>
                  <template  v-else>
                    <ChatContentTxt :item="item"/>
                  </template>
                </p>
                <div v-if="item.send_fail">
                  <ChatContentFailed :item="item"/>
                </div>
                <div class="arrow-l"></div>
              </div>
              </template>
              <div class="chat-content-opt">
                <div class="chat-content-opt-item" @click="backMsg(item)">撤回</div>
              </div>
              </el-popover>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="chat-footer">
      <div class="chat-opt-input">
        <div class="chat-opt-input-box">
          <input id="text_in" v-model="msgText" class="edit-ipt" style="" />
          <div class="chat-opt-input-emoji-icon">
            <div class="emoticon-con">
              <el-popover v-model="showEmoji" placement="top" trigger="click">
                <div class="faces_content">
                  <span class="face-item" v-for="(item, i) in emojiList" :title="item.text" :key="i" @click="selectEmoji(item)">
                    <img :src="require('../../../assets/images/'+item.url)">
                  </span>
                </div>
                <template #reference>
                  <van-icon name="smile-o" size="30px" color="#666"/>
                </template>
              </el-popover>
            </div>
          </div>
          <span class="chat-opt-input-more-icon" @click="showMore=true">
            <van-icon name="add" size="30px" color="#fb4a4a"/>

          </span>
          <a class="chat-opt-send-msg-btn" @click="sendMsg(0)">发送</a>
        </div>
      </div>
      <van-popup v-model="showMore" position="bottom">
        <div class="more-opt-con">
          <div class="more-opt-item">
            <div class="more-opt-item-icon">
              <van-uploader :after-read="sendImg"
                      :before-read="beforeSendImg">
                <van-icon name="photo" size="1.5rem" color="#666666" />
              </van-uploader>
            </div>
            <div class="more-opt-item-txt">图片</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showGoodsPopup">
              <van-icon name="bag" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">商品</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showOrderPopup">
              <van-icon name="column" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">订单</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showReplyPopup">
              <van-icon name="todo-list" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">快捷回复</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showTransferPopup">
              <van-icon name="friends" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">转接客服</div>
          </div>
        </div>
      </van-popup>
    </div>
    <van-popup v-model="goodsPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="goodsSearch.kwd" placeholder="搜索商品">
            <i class="iconfont icon-sousuo" @click="getGoodsList"></i>
          </div>
        </div>
        <div class="list">
          <div v-for="item in goodsList" :key="item.id" class="goods-con">
            <div class="goods-img">
              <img :src="item.thumb"/>
            </div>
            <div class="goods-txt">
              <div class="goods-title">{{item.title}}</div>
              <div class="goods-price">￥{{item.price}}</div>
            </div>
            <div class="goods-send">
              <span class="goods-send-btn" @click="selectGoods(item)">发 送</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="orderPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="orderSearch.keyword" placeholder="请输入订单号">
            <i class="iconfont icon-sousuo" @click="getOrderList"></i>
          </div>
        </div>
        <div class="list">

          <div v-for="item in orderList" :key="item.id"  class="order-con">
            <div class="order-header">
              <span class="order-no">订单号：{{item.order_sn}}</span>
              <span class="order-status">{{item.status_name}}</span>
            </div>
            <div v-for="goods_item in item.has_many_order_goods" :key="goods_item.goods_id" class="order-item-con">
              <div class="order-goods-img">
                <img :src="goods_item.thumb"/>
              </div>
              <div class="order-item-txt">
                <div class="order-goods-title">{{goods_item.title}}</div>
                <div class="order-goods-price"><span class="order-goods-num">x{{goods_item.total}}</span>￥{{goods_item.price}}</div>
              </div>
            </div>
            <div class="order-footer">
              <div class="totle-txt">
                共 {{item.goods_total}} 件商品 实付：¥{{item.price}}
              </div>
              <div>
                <span class="send-btn" @click="selectOrder(item)">发 送</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="replyPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="replySearch.kwd" placeholder="请输入标题">
            <i class="iconfont icon-sousuo" @click="getReplyList"></i>
          </div>
        </div>
        <div class="list">
          <div v-for="item in replyList" :key="item.id" class="reply-con">
            <div class="reply-txt">
              <div class="reply-title">{{item.title}}</div>
              <div class="reply-content">{{item.content}}</div>
            </div>
            <div class="reply-send">
              <span class="reply-send-btn" @click="selectReply(item)">发 送</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="transferPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="transferSearch.kwd" placeholder="请输入客服昵称或手机号">
            <i class="iconfont icon-sousuo" @click="getTransferEmployeeList"></i>
          </div>
        </div>
        <div class="list">
          <div v-for="item in transferEmployeeList" :key="item.id" class="transfer-con">
            <div class="transfer-avatar">
              <img :src="item.avatar"/>
            </div>
            <div class="transfer-txt">
              <div class="">{{item.nickname}}</div>
              <div class="">{{item.has_one_member.mobile}}</div>
            </div>
            <div class="transfer-send">
              <span class="transfer-send-btn" @click="selectTransfer(item)">转 接</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Indicator, Toast, MessageBox } from "mint-ui";
import {emojiObjs,emojiList} from "./emoji";
import {ChatContentTxt,ChatContentPic,ChatContentGoods,ChatContentOrder,ChatContentFailed} from "./components";
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
export default {
  components: {
    ChatContentTxt,
    ChatContentPic,
    ChatContentGoods,
    ChatContentOrder,
    ChatContentFailed
  },
  data() {
    return {
      websock: null,
      lockReconnect: false,//是否真正建立连接
      timeout: 3*1000,//todo 30秒一次心跳
      timeoutObj: null,//心跳心跳倒计时
      serverTimeoutObj: null,//心跳倒计时
      timeoutnum: null,//断开 重连倒计时
      chatList:[],
      userUid:0,
      employeeId:parseInt(this.$route.params.employeeId),
      employeeInfo:{},
      memberInfo:{},
      groupId:parseInt(this.$route.params.groupId),
      page: 1,
      total_page: 0,
      isLoadMore: true,
      msgText:'',
      msgImg:'',
      photosize: 1024 * 1024 * 10,
      showEmoji:false,
      emojiList:[],
      emojisTmp:[],
      emojiObjs:{},
      showMore:false,
      goodsPopupShow:false,
      goodsList:[],
      goodsSearch:{
        kwd:''
      },
      orderPopupShow:false,
      orderList:[],
      orderSearch:{
        keyword:'',
        page:1
      },
      replyList:[],
      replySearch:{
        kwd:''
      },
      replyPopupShow:false,
      transferSearch:{
        kwd:''
      },
      transferPopupShow:false,
      transferEmployeeList:[],
      showMoreChatOpt:{},

      queue_id: 0,//会话ID
    };
  },
  created() {
    this.emojiList = emojiList;
    this.emojiObjs = emojiObjs;
    this.userUid =parseInt(this.$route.params.user_id);
    this.initWebSocket();
    this.init();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    init(){
      $http
        .get(
          "plugin.yun-chat.frontend.chat.index",
          { group_id: this.groupId,employee_id:this.employeeId },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            if(response.data.employee_info){
              this.employeeInfo = response.data.employee_info;
              this.userUid = response.data.member_info.uid;
              this.memberInfo = response.data.member_info;
              this.employeeId = response.data.employee_info.id;
              this.queue_id = response.data.queue_info.id;
              this.getChatList();
            }else{
              //todo 客服都不在线
              Toast('客服都不在线');
            }
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getChatList(){
      this.page = 1;
      $http
        .get(
          "plugin.yun-chat.frontend.chat.chats",
          { page: 1,queue_id: this.queue_id },
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isLoadMore = true;
            this.total_page = response.data.last_page;
            if (!this.total_page) {
              this.total_page = 0;
            }
            this.chatList = response.data.data;
            this.chatList = this.fmtChatList(this.chatList);
            this.$nextTick(() => {
              document.getElementById('chat-data').scrollTop=10000;
            });
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getReplyList(){
      $http
        .get(
          "plugin.yun-chat.frontend.common-reply.query",
          this.replySearch,
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            this.replyList = response.data;
          } else {
            Toast(response.msg);
          }
          this.replySearch = {
            kwd:''
          };
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectReply(item){
      this.msgText = item.content;
      console.log(this.msgText);
      this.sendMsg(0);
      this.replyPopupShow = false;
    },
    showTransferPopup(){
      this.showMore=false;
      this.transferPopupShow = true;
    },
    getTransferEmployeeList(){
      $http
        .get(
          "plugin.yun-chat.frontend.employee.queryList",
          this.transferSearch
        )
        .then(response => {
          if (response.result === 1) {
            this.transferEmployeeList = response.data;
          } else {
            Toast(response.msg);
          }
          this.transferSearch = {
            keyword:''
          };
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectTransfer(item){
      this.transferPopupShow = false;
      MessageBox.confirm('确定转接给（'+item.nickname+'）对接？').then(action => {
        if (action == "confirm") {
          $http
            .get(
              "plugin.yun-chat.frontend.chat.transfer",
              {employee_id:item.id,user_uid:this.userUid}
            )
            .then(response => {
              if (response.result === 1) {
                Toast(response.msg);
                this.$router.push(this.fun.getUrl("chatList",{}));
              } else {
                Toast(response.msg);
              }
              this.transferSearch = {
                keyword:''
              };
            })
            .catch(error => {
              console.log(error);
            });

        }
      }).catch(() => {
        console.log("cancel");
      });
    },
    showGoodsPopup(){
      this.showMore=false;
      this.goodsPopupShow = true;
    },
    getGoodsList(){
      $http
        .get(
          "plugin.yun-chat.frontend.goods.queryList",
          this.goodsSearch
        )
        .then(response => {
          if (response.result === 1) {
            this.goodsList = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectGoods(item){
      // 发送商品消息
      let goodsTmp={};
      goodsTmp['id'] = item.id;
      goodsTmp['title'] = item.title;
      goodsTmp['thumb'] = item.thumb;
      goodsTmp['price'] = item.price;
      console.log(JSON.stringify(goodsTmp));
      this.msgText = encodeURIComponent(JSON.stringify(goodsTmp));
      console.log(this.msgText);
      this.sendMsg(2);
      this.goodsPopupShow = false;
    },
    showOrderPopup(){
      this.showMore=false;
      this.orderPopupShow = true;
    },
    showReplyPopup(){
      this.showMore=false;
      this.replyPopupShow = true;
    },
    getOrderList(){
      $http
        .get(
          "plugin.yun-chat.frontend.order-list.get-data",
          {user_uid:this.userUid,order_sn:this.orderSearch.keyword}
        )
        .then(response => {
          if (response.result === 1) {
            this.orderList = response.data;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectOrder(item){
      // 发送订单消息
      /*let goodsTmp={};
      goodsTmp['id'] = item.id;
      goodsTmp['title'] = item.title;
      goodsTmp['thumb'] = item.thumb;
      goodsTmp['price'] = item.price;
      console.log(JSON.stringify(goodsTmp))*/
      this.msgText = encodeURIComponent(JSON.stringify(item));
      console.log(this.msgText);
      this.sendMsg(3);
      this.orderPopupShow = false;
    },
    sendMsg(content_type){
      console.log(this.msgText);
      if(!this.msgText){
        return;
      }
      let text = this.msgText;
      for(let i=0;i<this.emojisTmp.length;i++){
        text=text.replace(this.emojisTmp[i]['text'],this.emojisTmp[i]['name']);
      }
      let receiveTextObj = this.generateChatData(text,0,this.getNowDateTime(),content_type);
      let chatListTemp = [];
      for(let i=0;i<this.chatList.length;i++){
        chatListTemp.push(this.chatList[i]);
      }
      chatListTemp.push(receiveTextObj);
      this.chatList = chatListTemp;
      let msgIndex = this.chatList.length-1;
      this.chatList[msgIndex]['send_fail']=0;
      this.$nextTick(() => {
        document.getElementById('chat-data').scrollTop=10000;
      });
      $http
        .post(
          "plugin.yun-chat.frontend.chat.sendMsg",
          {
            text:text,
            queue_id: this.queue_id,
            content_type:content_type
          }
        )
        .then(response => {
          if (response.result === 1) {
            this.chatList[msgIndex]['id'] = response.data.id;
          } else {
            this.chatList[msgIndex]['send_fail'] = 1;
            Toast(response.msg);
          }
        })
        .catch(error => {
          this.chatList[msgIndex]['send_fail'] = 1;
          console.log(error);
        });

      //$(".chat-data").scrollTop(3000);
      this.msgText = '';
    },
    backMsg(item){
      $http
        .get(
          "plugin.yun-chat.frontend.chat.backed-msg",
          { id: item.id},
          "加载中"
        )
        .then(response => {
          if (response.result === 1) {
            let chatListTemp = [];
            for(let i=0;i<this.chatList.length;i++){
              if(this.chatList[i]['id']==item.id){
                this.chatList[i]['is_backed']=1;
              }
              chatListTemp.push(this.chatList[i]);
            }
            this.chatList = chatListTemp;
          } else {
            Toast(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goGoodsPage(item){
      this.$router.push(this.fun.getUrl("goods",{id: item.id}));
    },
    goOrderPage(item){
      //this.$router.push(this.fun.getUrl("goods",{id: item.id}));
    },
    beforeSendImg(e, flag){
      this.showMore=false;
    },
    sendImg(e, flag) {
      Indicator.open("上传中");
      let fd = new FormData();

      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            That.msgText = responseData.data.img_url;
            That.sendMsg(1);
            //That.applyModel.thumb = responseData.data.img_url;
            Indicator.close();
          } else {
            Indicator.close();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Indicator.close();
          console.log(error);
        });
    },
    selectEmoji(item){
      this.showEmoji=false;
      let myField = document.querySelector('#text_in');
      let emoji_text= item.text;
      if(myField.selectionStart || myField.selectionStart === 0) {
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        this.msgText = myField.value.substring(0, startPos) + emoji_text
                    + myField.value.substring(endPos, myField.value.length);
        this.$nextTick();
        myField.focus();
        myField.setSelectionRange(endPos + emoji_text.length, endPos + emoji_text.length);
      } else {
        this.msgText = emoji_text;
      }
      this.emojisTmp.push(item);
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function() {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 1024,
              maxHeight = 1024;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过1024x1024的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(
                  maxWidth * (originHeight / originWidth)
                );
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(
                  maxHeight * (originWidth / originHeight)
                );
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                self.onRead_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    initWebSocket(){ //初始化weosocket
      $http
        .get(
          "plugin.yun-chat.frontend.chat.get-ws-setting"
        )
        .then(response => {
          if (response.result === 1) {
            let wssParams = response.data.wss_params;
            const wsuri = wssParams.host+"?appId="+wssParams.appId+"&signature="+wssParams.signature+"&nonceStr="
            +wssParams.nonceStr+"&timestamp="+wssParams.timestamp+"&clientid="+wssParams.clientid;
            this.websock = new WebSocket(wsuri);
            this.websock.onmessage = this.websocketonmessage;
            this.websock.onopen = this.websocketonopen;
            this.websock.onerror = this.websocketonerror;
            this.websock.onclose = this.websocketclose;
            console.log('连接建立');
          } else {
            this.$message.error(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      console.log('连接建立');
    },
    reconnect() {//重新连接
      var that = this;
      if(that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        //新连接
        that.initWebSocket();
        that.lockReconnect = false;
      },5000);
    },
    reset(){//重置心跳
      var that = this;
      //清除时间
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeoutObj);
      //重启心跳
      that.heartBeatStart();
    },
    heartBeatStart(){//开启心跳
      var that = this;
      that.timeoutObj && clearTimeout(that.timeoutObj);
      that.serverTimeoutObj && clearTimeout(that.serverTimeoutObj);
      that.timeoutObj = setTimeout(function(){
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        console.log('that.websock.readyState'+that.websock.readyState);
        if (that.websock.readyState == 1) {//如果连接正常
          that.websock.send(JSON.stringify({'type':'ping'}));
        }else{//否则重连
          that.reconnect();
        }

      }, that.timeout);
    },
    websocketonopen(){ //连接建立之后执行send方法发送数据
      //let actions = {"type":"init","uid":this.socketBindUid};
      //this.websocketsend(JSON.stringify(actions));
      this.heartBeatStart();
    },
    websocketonerror(){//连接建立失败重连
      //this.initWebSocket();
      this.reconnect();
    },
    websocketonmessage(e){ //数据接收
      let message = JSON.parse(e.data);
      let chatListTemp = [];
      switch (message.type){
      case "init":
        //this.bind(message.client_id);
        return;
      case "text":
        if(this.userUid==message.uid) {
          let receiveTextObj = this.generateChatData(message.data,1,message.time,message.content_type);
          receiveTextObj['id'] = parseInt(message.id);
          for(let i=0;i<this.chatList.length;i++){
            chatListTemp.push(this.chatList[i]);
          }
          chatListTemp.push(receiveTextObj);
          this.chatList = chatListTemp;
          //this.chatList.push(receiveTextObj);
          this.$nextTick(() => {
            document.getElementById('chat-data').scrollTop=10000;
          });
          //$(".chat-data").scrollTop(3000);
        }
        return;
      case "backed":
        for(let i=0;i<this.chatList.length;i++){
          if(this.chatList[i].id == message.data){
            this.chatList[i]['is_backed']=1;
          }
          chatListTemp.push(this.chatList[i]);
        }
        this.chatList = chatListTemp;
        return;
      }
    },
    websocketsend(Data){//数据发送
      this.websock.send(Data);
    },
    websocketclose(e){  //关闭
      console.log('断开连接',e);
      this.reconnect();
      //this.initWebSocket();
    },
    generateChatData(content,direction_type,time,content_type){
      let res = {};
      res['id']=0;
      if(content_type==2||content_type==3){
        res['content'] = JSON.parse(decodeURIComponent(content));
      }else if(content_type==0){
        res['content'] = this.replaceEmoji(content);
      }
      res['content_type']=content_type;
      res['direction_type']=direction_type;
      res['created_at']=time;
      return res;
    },
    fmtChatList(chatList){
      for (let i = 0; i < chatList.length; i++) {
        if(chatList[i]['content_type']==2||chatList[i]['content_type']==3){
          chatList[i]['content'] = JSON.parse(decodeURIComponent(chatList[i]['content']));
        }else if(chatList[i]['content_type']==0){
          chatList[i]['content'] = this.replaceEmoji(chatList[i]['content']);
        }
      }
      return chatList;
    },
    replaceEmoji(content){

      let that = this;
      return content.replace(/face\[([^\s\[\]]+?)\]/g,function (i) {
        return '<img src="'+require("../../../assets/images/"+that.emojiObjs[i]["url"])+'" style="width:30px;height:30px;"/>';
      });
    },
    getNowDateTime(){
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();//年月日时分秒
      return currentdate;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import './chat.scss';
</style>