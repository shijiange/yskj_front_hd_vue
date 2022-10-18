import cTitle from "components/title";
import { Toast, Image as VanImage, ActionSheet as VanActionSheet, Popup as VanPopup, Form as VanForm, Field as VanField } from "vant";
import DList from "@/components/dlist";
import PostItem from "@/components/circleCommunity/postItem";
import { saveEditMemberInfo } from "./libs/_request";

export default {
  data() {
    return {
      memberId: null,
      bg_img: "https://dev3.yunzmall.com/attachment/image/aae1e9a875eab1b4c9bdc44f69a3c0d7.jpeg", // 背景图片
      header_img: "", // 头像
      autograph: "", // 个性签名
      invitation_count: "", // 发布数量
      like_count: "", // 点赞数量
      name: "", // 名字
      photosize: 1024 * 1024 * 3, // 图片大小
      postPagination: {
        page: 1,
        loading: false,
        finished: false
      },
      currentShowType: "post",
      posts: [],
      visitor: false,
      showPostActions: false,
      currentActionPostIndex: null,
      displayEditSignaturePopup: false,
      formSignatureContent: ""
    };
  },
  activated() {
    if (this.$route.query.member_id) {
      this.memberId = this.$route.query.member_id;
      this.visitor = true;
    }
    this.getData();
    this.loadMorePost();
  },
  computed: {
    postActions() {
      if (this.currentShowType === "post") {
        return [
          { name: "修改", key: "edit" },
          { name: "删除", key: "delete" }
        ];
      } else {
        return [{ name: "删除", key: "delete" }];
      }
    }
  },
  methods: {
    getData() {
      let requestParams = {};
      if (this.visitor) {
        requestParams["member_id"] = this.memberId;
      }
      $http
        .get("plugin.circle.frontend.circle-member.my-invitation", requestParams, "")
        .then(
          response => {
            if (response.result !== 1) {
              Toast(response.msg);
            } else {
              if(response.data.bg_img){
                this.bg_img = response.data.bg_img;
              }

              this.header_img = response.data.header_img;
              this.autograph = response.data.autograph;
              this.invitation_count = response.data.invitation;
              this.like_count = response.data.like_count;
              this.name = response.data.name;
            }
          },
          response => {
            Toast(response);
          }
        )
        .catch(err => {
          console.error(err);
        });
    },
    switchPost(postType) {
      this.posts = [];
      this.currentShowType = postType;
      this.postPagination = {
        page: 1,
        loading: false,
        finished: false
      };
      this.loadMorePost();
    },
    // 背景图片上传
    onRead() {
      return file => {
        let fd = new FormData();
        fd.append("file", file.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
        let uploadUrl = this.fun.getRealUrl("upload.uploadPic", {});
        const UploadLoading = Toast.loading();
        axios
          .post(uploadUrl, fd, {
            headers: { "Content-Type": "multipart/form-data" }
          })
          .then(uploadedResult => {
            let reader = new FileReader();
            // 将图片转成base64格式
            reader.readAsDataURL(file.file);
            // 读取成功后的回调
            reader.onloadend = e => {
              let readerResult = e.target.result;
              $http
                .post("plugin.circle.frontend.circle-member.edit-member-info", {
                  bg_img: uploadedResult.data.data.img_url
                })
                .then(({ data: response, result, msg }) => {
                  UploadLoading.clear();
                  if (result == 0) {
                    Toast(msg);
                    return;
                  }
                  Toast("更换成功");
                  this.bg_img = readerResult;
                });
            };
          });
      };
    },
    // 上传之后限制大小
    onphotosize(e) {
      this.imgPreview(e.file, 1);
      // this.$notify('上传图片大小不能超过 2MB!')
    },
    // 上传照片处理
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
            var maxWidth = 400,
              maxHeight = 400;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过400x400的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
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
              self.onRead(blob, true);
            }, file.type || "image/png");
          };
        };
      }
    },
    loadMorePost() {
      if (this.postPagination.finished || this.postPagination.loading) {
        return;
      }
      this.postPagination.loading = true;
      let invitationStatus = this.currentShowType === "post" ? 1 : 2;
      let requestParams = {
        invitation_status: invitationStatus
      };
      if (this.visitor) {
        requestParams["member_id"] = this.memberId;
      }
      $http
        .get("plugin.circle.frontend.circle-invitation.get-my-invitation-list", requestParams)
        .then(({ data: response, result, msg }) => {
          if (result === 0) {
            Toast(msg);
            return;
          }
          if (response.last_page === response.current_page || response.data.length < response.per_page) {
            this.postPagination.finished = true;
          }
          this.postPagination.page++;
          this.posts.push(...response.data);
          this.postPagination.loading = false;
        })
        .catch(err => {
          console.error(err);
        });
    },
    async selectActionSheet({ key }) {
      const post = this.posts[this.currentActionPostIndex];
      let route = this.fun.getUrl("circleTopic");
      let response = null;
      switch (key) {
      case "delete":
        response = await this.deletePost(post.id);
        if (response.result === 1) {
          Toast("删除成功");
          this.posts.splice(this.currentActionPostIndex, 1);
        } else {
          Toast(response.msg);
        }
        break;
      case "edit":
        if (this.currentShowType === "video") {
          return;
        }
        route["query"]["pid"] = post.id;
        route["query"]["isReview"] = post.is_review;
        this.$router.push(route);
        break;
      }
    },
    displayPostActions(index) {
      this.currentActionPostIndex = index;
      this.showPostActions = !this.showPostActions;
    },
    async deletePost(postId) {
      return await $http.post("plugin.circle.frontend.circle-invitation.del", {
        invitation_id: postId
      });
    },
    viewPost(itemIndex) {
      let route = null;
      let post = this.posts[itemIndex];
      let page = this.posts.findIndex((value, index, arr) => {
        return value.id === post.id;
      });
      switch (post.status) {
      case 1:
        route = this.fun.getUrl(
          "topicDetails",
          {},
          {
            pid: post.id
          }
        );
        break;
      case 2:
        page = Math.ceil((page + 1) / 15);
        route = this.fun.getUrl(
          "circleVideodetail",
          {},
          {
            vid: post.id,
            from: "circle",
            page,
            circle_id: post.circle_id
          }
        );
        break;
      }
      this.$router.push(route);
    },
    goToCircle(id) {
      this.$router.push(this.fun.getUrl("circleDetails", {}, { id }));
    },
    showEditSignaturePopup() {
      if (this.displayEditSignaturePopup) {
        this.formSignatureContent = "";
      } else {
        this.formSignatureContent = this.autograph;
      }
      this.displayEditSignaturePopup = !this.displayEditSignaturePopup;
    },
    saveSignature() {
      saveEditMemberInfo({
        autograph: this.formSignatureContent
      }).then(({ result, msg }) => {
        Toast(msg);
        if (result) {
          this.autograph = this.formSignatureContent;
          this.formSignatureContent = "";
        }
      });
    }
  },
  components: {
    cTitle,
    DList,
    PostItem,
    VanImage,
    VanActionSheet,
    VanPopup,
    VanForm,
    VanField
  }
};
