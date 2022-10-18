import { Toast } from 'vant';
import cTitle from 'components/title';

export default {
  data() {
    return {
      photosize: 1024 * 1024 * 4, // 图片大小限制,
      show1: false,
      // setting sun
      imageUrl: '',
      uploadUrl: '',
      upImgSrc: '',
      bank_info: [],
      amount_info: '',
      pay_info: ''
    };
  },

  activated() {
    // setting sun
    this.urlUp();
    this.getJson();
  },

  mounted() {},
  methods: {
    getJson() {
      this.imageUrl = '';
      this.upImgSrc = '';
      // console.log('ROUTE',this.$route.params)
      var that = this;
      var json = { order_pay_id: that.$route.params.id };
      $http.get('order.mergePay.remittance', json).then(
        function (response) {
          // console.log(response)
          if (response.result == 1) {
            that.bank_info = response.data.payee_info;
            that.amount_info = response.data.amount;
            that.pay_info = response.data.pay_sn;
          }
        },
        function (response) {
          Toast(response.msg);
        }
      );
    },
    // 确认汇款
    confirmEvent() {
      if (this.upImgSrc != '') {
        var that = this;
        var json = {
          order_pay_id: that.$route.params.id,
          report_url: that.upImgSrc
        };
        $http.get('remittance.pay', json).then(
          function (response) {
            // console.log(response)
            if (response.result == 1) {
              that.$router.push(
                that.fun.getUrl('orderlist', {
                  status: that.$route.params.status,
                  bank_id: that.$route.params.id
                })
              );
              Toast(response.msg);
            }
          },
          function (response) {
            Toast(response.msg);
          }
        );
      } else {
        Toast('请上传付款凭证');
      }
    },
    // 在线付款
    onLine() {
      // this.$router.push(this.fun.getUrl("orderpay"))
      this.$router.push(
        this.fun.getUrl('orderpay', {
          status: '2',
          order_ids: this.$route.params.order_ids
        })
      );
    // this.$router.go(-1)
    },
    // 关闭提示
    closeTip() {
      this.show1 = false;
    },
    // 提示确认
    confirmTip() {
      this.show1 = false;
    },
    // setting sun
    // 上传url
    urlUp() {
      // console.log('route', this.$route.params)

      this.uploadUrl = this.fun.getRealUrl(
        'upload.uploadPic',
        {}
      );
    },
    handleStoreSuccess(res, file) {
      // console.log(res)
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.result == 1) {
        this.upImgSrc = res.data.img;
      } else {
        Toast(res.msg);
      }
    },
    beforeUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$notify('上传头像图片只能是 JPG或PNG 格式!');
      // this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$notify('上传头像图片大小不能超过 2MB!');
      // this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPNG && isLt2M;
    },
    /*vant图片上传*/
    onRead(e) {
      let fd = new FormData();
      fd.append('file', e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      var That = this;
      axios
        .post(this.uploadUrl, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result == 1) {
            That.imageUrl = URL.createObjectURL(e.file);
            That.upImgSrc = responseData.data.img;
          } else {
            Toast(responseData.msg);
          }
        // this.img.push(res.data.imgpath)
        })
        .catch(error => {
          console.log(error);
        });
    },
    onphotosize(e) {
      this.$notify('上传图片大小不能超过 2MB!');
    // this.$message.error('上传图片大小不能超过 2MB!')
    }
  },
  components: {
    cTitle}
};
