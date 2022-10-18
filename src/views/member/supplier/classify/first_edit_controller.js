import cTitle from 'components/title';
import { Toast } from 'vant';
export default{
  components: { cTitle },
  data(){
    return{
      classify_name: '',
      isRecommend: '',
      isOpen: '',
      judgeState: true,
      //setting sun
      imageUrl: '',
      uploadUrl:'',
      thumb: '', 
    };
  },
  activated() {
    this.init();
    this.urlUp();
    this.getJson();
  },
  methods:{
    init(){
      this.classify_name = '';
      this.thumb = '';
      this.imageUrl = '';
      this.isRecommend = '';
      this.isOpen = '';
    },
    getJson(){
      var that = this;
      console.log('--params---',that.$route.params);
      let json = {id: that.$route.params.classify_id};
      $http.post('plugin.store-cashier.frontend.store.goods-category.detail-category',json).then(function (response) {
        console.log('显示edit',response);
        if(response.result == 1){
          that.classify_name = response.data.name;
          // that.thumb = response.data.thumb;
          // that.imageUrl = response.data.thumb;
          // if(response.data.is_home == 1){
          //     that.isRecommend = '是'; 
          // }else if(response.data.is_home == 0){
          //     that.isRecommend = '否';
          // }
          if(response.data.enabled == 1){
            that.isOpen = '1';
          }else if(response.data.enabled == 0){
            that.isOpen = '0';
          }
        }else{
          that.$notify(response.msg);
          // that.$message.error(response.msg);

        }
      }, function (response) {
        console.log(response);
      });	
    },
    //确定编辑
    sureEdit(){
      // let isHome = '';
      // if(this.isRecommend == '是'){
      //     isHome = 1;
      // }else if(this.isRecommend == '否'){
      //     isHome = 0;
      // }
      let isEnabled = '';
      if(this.isOpen == '1'){
        isEnabled = 1;
      }else if(this.isOpen == '0'){
        isEnabled = 0;
      }
      var that = this;
      that.judge();
      if(that.judgeState == true){
        let json = {
          store_id: that.$route.params.store_id,
          name: that.classify_name,
          // thumb: that.thumb,
          // is_home: isHome,
          enabled: isEnabled,
          id: that.$route.params.classify_id,
          level: that.$route.params.level,
        };
        $http.post('plugin.store-cashier.frontend.store.goods-category.edit-category',json).then(function (response) {
          console.log('显示editSure',response);
          if(response.result == 1){
            that.$router.push(that.fun.getUrl('GoodsClassify',{store_id: that.$route.params.store_id}));
            // that.$message({
            //     message: '修改成功',
            //     type: 'success'
            // });
            that.$notify({
              background:'#f0f9eb',
              message: '修改成功',
              color:'#67c23a'
            });

          }else{
            that.$notify(response.msg);
            // that.$message.error(response.msg);
          }
        }, function (response) {
          console.log(response);
        });
      }else{
        // that.$message({
        //     message: '分类信息不完整',
        //     type: 'warning'
        // });
        that.$notify({
          background:'#fef0f0',
          message: '分类信息不完整',
          color:'#f56c6c'
        });
      }	
    },
    //条件判断
    judge(){
      this.judgeState = true;
      if(this.classify_name == ''||this.isOpen == ''){
        this.judgeState = false;
      }
    },
    //setting sun
    //商品分类图片
    //上传url
    urlUp(){
      this.uploadUrl = this.fun.getRealUrl("plugin.store-cashier.frontend.store.goods.upload",{});
    },
    handleStoreSuccess(res, file) {
      console.log(res);
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.result == 1) {
        this.thumb = res.data.img;
      } else {
        Toast(res.msg);
      }
    },
    beforeUpload(file) {
      const isPNG = (file.type === 'image/png' || file.type === 'image/jpeg');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isPNG) {
        this.$notify("上传头像图片只能是 JPG或PNG 格式!");
        // this.$message.error('上传头像图片只能是 JPG或PNG 格式!');
      }
      if (!isLt2M) {
        this.$notify("上传头像图片大小不能超过 2MB!");
        // this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isPNG && isLt2M;
    },

  }
};