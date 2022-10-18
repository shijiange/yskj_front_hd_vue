import signButton from "../sign/component/sign_button";
import { Toast } from 'vant';
import loading from "components/loading";

export default {
  data() {
    return {
      signWait: false,
      showPage: false,
      showFixed: false,
      signSuccess: false,
      signFail: false,
      showPhone: false,
      showMore: false,
      showContent: false,
      pdfWidth: 0,
      pdfHeight: 0,
      current_page: 1, // pdf文件当前页码
      page_count: 0, // pdf文件总页数
      pdfUrl: "",// 这里是pdf文件地址，后台给的流文件请求地址也是可以的
      pdfDoc: null,// pdfjs 生成的对象
      mobile: "",

      timerOut: null,
      minY: 0,
      maxY: 0,
      lastdeltaX: 0,
      lastdeltaY: 0,
      OriginX: 0,
      OriginY: 0,
      nowScale: 1,
      dom: null,
      scrollTop: 0,
      count: "",
      timer: null,
      showSign: false,
      code: "",
      checked: [],

      showEdges: false,
      pdfWidthPC: 0,
      pdfHeightPC: 0,
      user_role_id: "",
      sign_status: 0,
      auth_status: 1,
      is_cc: 0,
      can_sign: 0,
      commonStructsList: [],
      company_seals: [],
      contract_info: {},
      person_seals: [],
      seals_info: {},
      contract_doc_imgs: [],
      sign_auth_type: '',

      site: {},

      isMinApp: false,
    };
  },
  watch: {
    lastdeltaY(new1, old1) {
      let _pdfs = document.querySelectorAll(".pdfPage_1yRne");
      let arr = [0];
      _pdfs.forEach((item, index) => {
        if (new1 <= (-this.pdfHeight*this.nowScale*(index+1))+this.minY) {
          arr.push(index+1);
        }
      });
      this.current_page = Math.max.apply(null, arr) + 1;
    }
  },
  activated() {
    this.signWait= false;
    this.showPage= false;
    this.showFixed= false;
    this.signSuccess= false;
    this.signFail= false;
    this.showPhone= false;
    this.showContent = false;
    this.showMore = false;
    this.sign_auth_type = '';
    this.contract_id = this.$route.params.id;
    this.mobile = localStorage.getItem("siteMobile");
    if(this.fun.getKey('isMinApp') == 1) {
      this.isMinApp = true;
    }
    if(this.$route.query.fromHome === 1 || this.$route.query.fromOrder === 1) {
      this.$nextTick(() => {
        this.getData();
      });
    }
  },
  mounted() {
    if(this.$route.query.fromHome !== 1 && this.$route.query.fromOrder !== 1) {
      this.$nextTick(() => {
        // this.pdfUrl = "/addons/yun_shop//static/test2.pdf";
        // this._loadFile(this.pdfUrl);
        // this.test();
        this.getData();
        // this.isBindMobile();
      });
    }
  },
  methods: {
    // 启动缩放功能
    setPinch() {
      let that = this;
      let oldScale = 1;
      let oBox = document.querySelector("#inHtml");
      let hammer = new Hammer(oBox);

      hammer.get("pan").set({
        direction: Hammer.DIRECTION_ALL
      });
      hammer.on("panstart", function(event) {
        clearTimeout(that.timerOut);
        that.showFixed = true;
        let minX = that.$refs.pdfBox.offsetWidth * that.nowScale * that.OriginX - that.$refs.pdfBox.offsetWidth * that.OriginX;
        let maxX = that.$refs.pdfBox.offsetWidth * that.nowScale - minX - that.$refs.pdfBox.offsetWidth;
        let minY = that.$refs.pdfBox.offsetHeight * that.nowScale * that.OriginY - that.$refs.pdfBox.offsetHeight * that.OriginY;
        let maxY = that.$refs.pdfBox.offsetHeight * that.nowScale - minY - ((that.$refs.pdfBox.offsetHeight / that.page_count) - 50);
        that.minY = minY;
        that.maxY = maxY;
        oBox.style.transitionDuration = "0s";
        hammer.on("panmove", function(event) {
          let x = 0;
          let y = 0;
          if (parseFloat(that.lastdeltaX + event.deltaX) > minX) {
            x = minX;
          } else if (parseFloat(that.lastdeltaX + event.deltaX) < -maxX) {
            x = -maxX;
          } else {
            x = parseFloat(that.lastdeltaX + event.deltaX);
          }

          if (parseFloat(that.lastdeltaY + event.deltaY) > minY) {
            y = minY;
          } else if (parseFloat(that.lastdeltaY + event.deltaY) < -maxY) {
            y = -maxY;
          } else {
            y = parseFloat(that.lastdeltaY + event.deltaY);
          }
          oBox.style.transform = "translate(" + x + "px," + y + "px)" + "scale(" + that.nowScale + ")";
        });
      });
      hammer.on("panend", function(event) {
        that.timerOut = setTimeout(() => {
          if (that.showFixed) {
            that.showFixed = false;
          }
        }, 3000);
        let y = 0;
        let x = 0;
        let minX = that.$refs.pdfBox.offsetWidth * that.nowScale * that.OriginX - that.$refs.pdfBox.offsetWidth * that.OriginX;
        let maxX = that.$refs.pdfBox.offsetWidth * that.nowScale - minX - that.$refs.pdfBox.offsetWidth;
        let minY = that.$refs.pdfBox.offsetHeight * that.nowScale * that.OriginY - that.$refs.pdfBox.offsetHeight * that.OriginY;
        let maxY = that.$refs.pdfBox.offsetHeight * that.nowScale - minY - ((that.$refs.pdfBox.offsetHeight / that.page_count) - 50);
        that.minY = minY;
        that.maxY = maxY;
        that.lastdeltaX = parseFloat(that.lastdeltaX + event.deltaX);
        that.lastdeltaY = parseFloat(that.lastdeltaY + event.deltaY);
        let distance = event.velocityY * 500;
        oBox.style.transitionDuration = "500ms";
        if (that.lastdeltaX > minX) {
          x = minX;
        } else if (that.lastdeltaX < -maxX) {
          x = -maxX;
        } else {
          x = that.lastdeltaX;
        }

        if (that.lastdeltaY + distance > minY) {
          y = minY;
        } else if (that.lastdeltaY + distance < -maxY) {
          y = -maxY;
        } else {
          y = that.lastdeltaY + distance;
        }
        oBox.style.transform = "translate(" + x + "px," + y + "px)" + "scale(" + that.nowScale + ")";
        that.lastdeltaY = y;
        that.lastdeltaX = x;
      });
      hammer.get("pinch").set({
        enable: true
      });
      hammer.on("pinchstart", function(event) {
        oldScale = that.nowScale || 1;
        oBox.style.transitionDuration = "200ms";
        oBox.style.transitionTimingFunction = "cubic-bezier(0.23, 1, 0.32, 1)";
        that.OriginX = Math.abs(event.center.x - that.lastdeltaX) / (that.$refs.pdfBox.offsetWidth);
        that.OriginY = Math.abs(event.center.y - that.lastdeltaY) / (that.$refs.pdfBox.offsetHeight);
        oBox.style.transformOrigin = Math.abs(event.center.x - that.lastdeltaX) / (that.$refs.pdfBox.offsetWidth) * 100 + "%" + " "
          + Math.abs(event.center.y - that.lastdeltaY) / (that.$refs.pdfBox.offsetHeight) * 100 + "%";

        hammer.on("pinchmove", function(event) {
          if (2.5 > oldScale * event.scale && oldScale * event.scale > 0.9) {
            that.nowScale = oldScale * event.scale;
            oBox.style.transform = "translate(" + parseFloat(that.lastdeltaX) + "px," + parseFloat(that.lastdeltaY) + "px)" + "scale(" + oldScale * event.scale + ")";
          }
        });
      });
      hammer.on("pinchend", function(event) {
        oBox.style.transitionDuration = "0s";
        if (oldScale * event.scale < 1) {
          that.nowScale = 1;
          oBox.style.transform = "translate(" + parseFloat(that.lastdeltaX) + "px," + parseFloat(that.lastdeltaY) + "px)" + "scale(" + 1 + ")";
        }

        if (oldScale * event.scale > 2) {
          that.nowScale = 2;
          oBox.style.transform = "translate(" + parseFloat(that.lastdeltaX) + "px," + parseFloat(that.lastdeltaY) + "px)" + "scale(" + 2 + ")";
        }

      });
    },
    toTop() {
      this.lastdeltaY = this.minY;
      document.getElementById("inHtml").style.transform = "translate(" + this.lastdeltaX + "px," + this.lastdeltaY + "px)" + "scale(" + this.nowScale + ")";
    },
    toBottom() {
      this.lastdeltaY = -this.maxY;
      document.getElementById("inHtml").style.transform = "translate(" + this.lastdeltaX + "px," + this.lastdeltaY + "px)" + "scale(" + this.nowScale + ")";
    },
    clearAll() {
      this.showMore = false;
      // for (let i = 0; i < document.querySelectorAll('.text_mark2').length; i++) {
      //   document.querySelectorAll(".text_mark2")[i].childNodes[2].style.display = "none";
      // }
    },
    signPic(e, dom) {
      if(!dom) {
        dom = e.currentTarget.cloneNode(true);
      }

      for (let i = 0; i < document.querySelectorAll('.text_mark2').length; i++) {
        if (document.querySelectorAll(".text_mark2")[i].getAttribute("role_id") == this.user_role_id) {
          this.pos_x = parseFloat(document.querySelectorAll(".text_mark2")[i].getAttribute("pos_x_pc"));
          this.pos_y = parseFloat(document.querySelectorAll(".text_mark2")[i].getAttribute("pos_y_pc"));
          this.posPage = document.querySelectorAll(".text_mark2")[i].getAttribute("page");
          this.seal_id = dom.getAttribute("id");
          dom.style.left = 0 + "px";
          dom.style.top = 0 + "px";
          dom.style.width = "100%";
          dom.style.height = "100%";
          // dom.onclick = this.deleteIt3;
          this.lastdeltaY = -(this.posPage - 1) * this.pdfHeight;
          document.getElementById("inHtml").style.transform = "translate(" + this.lastdeltaX + "px," + this.lastdeltaY + "px)" + "scale(" + this.nowScale + ")";
          // if(document.querySelectorAll(".text_mark2")[i].childNodes[2]) {
          //   document.querySelectorAll(".text_mark2")[i].childNodes[2].style.display = "none";
          //   document.querySelectorAll(".text_mark2")[i].childNodes[2].onclick = this.toShowContent;
          // }
          document.querySelectorAll(".text_mark2")[i].childNodes[1].childNodes[0].style.display = "none";
          if (document.querySelectorAll(".text_mark2")[i].childNodes[1].childNodes[2]) {
            document.querySelectorAll(".text_mark2")[i].childNodes[1].removeChild(document.querySelectorAll(".text_mark2")[i].childNodes[1].childNodes[2]);
          }
          document.querySelectorAll(".text_mark2")[i].childNodes[1].appendChild(dom);
        }
      }
      if(document.querySelectorAll('.text_mark2').length <= 0) {
        this.$dialog.alert({message:'请先在合同模板添加签署区'});

      }
      this.showContent = false;
    },
    deleteIt3(e) {
      if (e.currentTarget.parentNode.parentNode.childNodes[2].style.display === "block") {
        e.currentTarget.parentNode.parentNode.childNodes[2].style.display = "none";
      } else {
        e.currentTarget.parentNode.parentNode.childNodes[2].style.display = "block";
      }
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    isBindMobile() {
      $http
        .get("plugin.yun-sign.frontend.h5.member.get-base-info", {}, "loading")
        .then(response => {
          if (response.result === 1) {
            this.mobile = response.data.mobile;
            if(this.mobile){
              this.getData();
            }else {
              window.location.href = this.fun.getSiteRoot() + "/addons/yun_shop/" + "?menu#" + "/member/editmobile?i="
                + this.fun.getKeyByI() + "&type=" + this.fun.getTyep() + "&mid=" + this.fun.getKeyByMid()+'&from=signPage';
            }

          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getData() {
      this.showPage = false;
      $http.post("plugin.shop-esign.frontend.contract.detail", { contract_id: this.contract_id }, "loading").then(response => {
        if (response.result === 1) {
          this.showPage = true;
          this.user_role_id = response.data.user_role_id;
          this.sign_status = response.data.sign_status;
          this.auth_status = response.data.auth_status;
          this.is_cc = response.data.is_cc;
          this.can_sign = response.data.can_sign;
          this.contract_doc_imgs = response.data.contract_doc_imgs;
          this.seals_info = response.data.seals_info ? response.data.seals_info : {};
          // this.company_seals = response.data.company_seals;
          this.contract_info = response.data.contract_info;
          // this.person_seals = response.data.person_seals;
          this.page_count = this.contract_doc_imgs.length;
          this.pdfWidthPC = this.contract_info.pdf_width;
          this.pdfHeightPC = this.contract_info.pdf_height;
          this.commonStructsList = response.data.form_list;
          this.sign_auth_type = response.data.sign_auth_type;
          this.$nextTick(() => {
            this.setPinch();
            setTimeout(() => {
              this.setTemplate();
            }, 500);
          });
        } else {
          this.$dialog.alert({message:response.msg}).then(()=>{
            if(this.isMinApp) {
              // 小程序端跳转对应页面
              wx.miniProgram.reLaunch({ url: `/packageH/signIndexPlu/signIndex/signIndex` });
            }
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    setTemplate() {
      const that = this;
      for (let i = 0; i < this.commonStructsList.length; i++) {
        if (that.commonStructsList[i].form_type == 2) {
          let Element = document.querySelector(".componentSign").cloneNode(true);
          document.querySelector("#can" + that.commonStructsList[i].doc_page).appendChild(Element);
          if(that.fun.getPhoneEnv() == 3) {
            Element.style.left = that.commonStructsList[i].pos_x * (375 / that.pdfWidthPC) + "px";
            Element.style.top = that.commonStructsList[i].pos_y * (((that.pdfHeightPC / that.pdfWidthPC) * 375)/that.pdfHeightPC) + "px";
            console.log(((that.pdfHeightPC / that.pdfWidthPC) * 375))
          }else {
            Element.style.left = that.commonStructsList[i].pos_x * (that.$refs.pdfBox.offsetWidth / that.pdfWidthPC) + "px";
            Element.style.top = that.commonStructsList[i].pos_y * (((that.pdfHeightPC / that.pdfWidthPC) * that.$refs.pdfBox.offsetWidth)/that.pdfHeightPC) + "px";
            console.log(((that.pdfHeightPC / that.pdfWidthPC) * that.$refs.pdfBox.offsetWidth))
          }

          Element.style.display = "flex";
          Element.classList.add("text_mark2");
          Element.setAttribute("pos_x_pc", that.commonStructsList[i].pos_x);
          Element.setAttribute("pos_y_pc", that.commonStructsList[i].pos_y);
          Element.setAttribute("page", that.commonStructsList[i].doc_page);
          Element.setAttribute("textId", that.commonStructsList[i].id);
          Element.setAttribute("role_id", that.commonStructsList[i].role_id);
          Element.childNodes[0].style.display = "flex";
          Element.childNodes[0].childNodes[1].childNodes[1].childNodes[1].innerText = that.commonStructsList[i].form_name;
          if (that.commonStructsList[i].role_id == "1") {
            Element.childNodes[0].childNodes[1].childNodes[0].innerText = "甲方";
          } else if (that.commonStructsList[i].role_id == "2") {
            Element.childNodes[0].childNodes[1].childNodes[0].innerText = "乙方";
          } else if (that.commonStructsList[i].role_id == "3") {
            Element.childNodes[0].childNodes[1].childNodes[0].innerText = "丙方";
          }
        }
      }
      if(that.fun.getPhoneEnv() == 3) {
        that.pdfHeight = (that.pdfHeightPC / that.pdfWidthPC) * 375
      }else {
        that.pdfHeight = (that.pdfHeightPC / that.pdfWidthPC) * that.$refs.pdfBox.offsetWidth;
      }
    },
    onClickLeft() {
      if(this.isMinApp) {
        // 小程序端跳转对应页面
        wx.miniProgram.reLaunch({ url: `/packageH/signIndexPlu/signIndex/signIndex` });
      }else {
        this.$router.go(-1);
      }
    },
    onClickRight() {
      this.showMore = !this.showMore;
    },
    toMission() {
      this.$router.push(this.fun.getUrl("signMissionPlu", { id: this.contract_id }));
    },
    toIdentify() {
      if(this.isMinApp) {
        // 小程序端跳转对应页面
        wx.miniProgram.redirectTo({ url: `/packageH/signIndexPlu/personBank/personBank` });
      }else {
        this.$router.push(this.fun.getUrl("personBankPlu"));
      }
    },
    toList() {
      if(this.isMinApp) {
        // 小程序端跳转对应页面
        wx.miniProgram.redirectTo({ url: `/packageH/signIndexPlu/contractList/contractList` });
      }else {
        this.$router.push(this.fun.getUrl("contractListPlu"));
      }
    },
    toReload() {
      this.$router.go(0);
    },
    toShowContent() {
      if(this.auth_status != 1) {
        this.showContent = true;
      }else {
        let Element = document.querySelector(".seal-item").cloneNode(true);
        this.signPic(1, Element);
      }

    },
    tapIN() {
      if(this.sign_auth_type == 1) {
        this.showSign = true;
      }else {
        this.sendFace();
      }
    },
    // 获取人脸认证
    sendFace() {
      if(!this.seal_id) {
        MessageBox.alert('请先点击左下方盖章');
        return
      }
      let sign_type = 1;
      if(this.showEdges) {
        sign_type = 2;
      } else {
        sign_type = 1;
      }
      let json = {
        sign_type: sign_type,
        total_page: this.page_count,
        posPage: this.posPage,
        seal_id: this.seal_id,
        width: 100,
        pos_x: this.pos_x,
        pos_y: this.pdfHeightPC - this.pos_y - 100,  //转成bottom
        updated_at: this.contract_info.updated_at,
        contract_id: this.contract_id,
        code: this.code
      };
      this.showSign = false;
      this.signWait = true;
      this.signFail = false;
      $http.post("plugin.shop-esign.frontend.contract.get-sign-auth-info", json, "loading").then(response => {
        if (response.result === 1) {
          this.signWait = false;
          window.location.href = response.data.shortUrl;
        } else {
          this.signFail = true;
          // MessageBox.alert(response.msg);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取手机验证码
    sendCode() {
      if(!this.seal_id){
        this.showSign = false;
        this.$dialog.alert({message:'请先点击左下方盖章'});

        return
      }
      $http.post("plugin.shop-esign.frontend.contract.send-code", { contract_id: this.contract_id }, "loading").then(response => {
        if (response.result === 1) {
          const TIME_COUNT = 60;
          if (!this.timer) {
            this.count = TIME_COUNT;
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--;
              } else {
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        } else {
          this.$dialog.alert({message:response.msg});
        }
      }).catch(err => {
        console.log(err);
      });
    },
    companySign() {
      if (!this.code) {
        Toast("请输入验证码");
        return;
      }
      let sign_type = 1;
      if(this.showEdges) {
        sign_type = 2;
      } else {
        sign_type = 1;
      }
      let json = {
        sign_type: sign_type,
        total_page: this.page_count,
        posPage: this.posPage,
        seal_id: this.seal_id,
        width: 100,
        pos_x: this.pos_x,
        pos_y: this.pdfHeightPC - this.pos_y - 100,  //转成bottom
        updated_at: this.contract_info.updated_at,
        id: this.contract_id,
        code: this.code
      };
      this.showSign = false;
      this.signWait = true;
      this.signFail = false;
      $http.post("plugin.shop-esign.frontend.contract.sign-contract", json, "loading").then(response => {
        this.code = "";
        if (response.result === 1) {
          this.signWait = false;
          this.signSuccess = true;
          if(this.$route.query.fromOrder === 1) {
            this.$router.go(-1);
          }
        } else {
          this.signFail = true;
          this.$dialog.alert({message:response.msg});

        }
      }).catch(err => {
        this.code = "";
        console.log(err);
      });
    },
  },
  components: {
    signButton,
    loading
  }
};
