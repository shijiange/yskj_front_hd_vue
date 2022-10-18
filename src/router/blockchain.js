//资产详情

//评估资产详情
const Assessment = r => require(["../views/blockchain/asset_details/assessment"], r);
//分红
// const AssetProfit = r => require(['../views/blockchain/asset_details/asset_profit'], r);
//全部类型
// const Categories = r => require(['../views/blockchain/asset_details/categories'], r);
//报告详情
const AssetNotices = r => require(["../views/blockchain/asset_details/asset_notices"], r);
//数字资产
// const DigitalAsset = r => require(['../views/blockchain/asset_details/digital_asset'], r);
//财务
// const Finance = r => require(['../views/blockchain/asset_details/finance'], r);
//简况
const AssetIntroduction = r => require(["../views/blockchain/asset_details/introduction"], r);
//报告和公告详情
const DetailReport = r => require(["../views/blockchain/asset_details/report"], r);
//我要销售
const AssetSale = r => require(["../views/blockchain/asset_details/sale"], r);

//我的资产

//认购记录、激活、奖励、买卖记录、转让记录、分红记录
const BuyingRecord = r => require(["../views/blockchain/my_asset/buying_record"], r);
//查看资产
const CheckAsset = r => require(["../views/blockchain/my_asset/check_asset"], r);
//进出记录
const IncomeRecord = r => require(["../views/blockchain/my_asset/income_record"], r);
//我的资产
const MyAsset = r => require(["../views/blockchain/my_asset/my_asset"], r);
//我的秘钥
const SecretKey = r => require(["../views/blockchain/my_asset/secret_key"], r);
//交易密码
const SetPassword = r => require(["../views/blockchain/my_asset/set_password"], r);
//转让
const AssetTrans = r => require(["../views/blockchain/my_asset/transfer"], r);
//交易详情（买入详情..）
const TransactionDetails = r => require(["../views/blockchain/my_asset/transaction_details"], r);

//交易大厅主页

//区块链-资产数字化
const TransHome = r => require(["../views/blockchain/transaction/home"], r);
//资产分类
const AssetClassify = r => require(["../views/blockchain/transaction/asset_classify"], r);
//认购买入
const Buying = r => require(["../views/blockchain/transaction/buying"], r);
//咨询公告
const TransNotice = r => require(["../views/blockchain/transaction/notice"], r);
//分类搜索列表
const ClassifiedSearch = r => require(["../views/blockchain/transaction/classified_search"], r);
//交易大厅
// const TradingHall = r => require(["../views/blockchain/transaction/trading_hall"], r);

//名片

//名片中心
const CardCenter = r => require(["../views/business_card/card_center"], r);
//名片角色
const BusinessCard = r => require(["../views/business_card/business_card"], r);
//名片动作
const Card_Action = r => require(["../views/business_card/card_action"], r);
//名片码
const CardCode = r => require(["../views/business_card/card_code"], r);
//名片收藏
const CardCollect = r => require(["../views/business_card/card_collect"], r);
//名片足迹
const CardFootprint = r => require(["../views/business_card/card_footprint"], r);
//名片选择商品
const CardGoods = r => require(["../views/business_card/card_goods"], r);
//名片排行
const CardRanking = r => require(["../views/business_card/card_ranking"], r);
//名片图片
const CardVisit = r => require(["../views/business_card/card_visit"], r);
//编辑名片
const EditCard = r => require(["../views/business_card/edit_card"], r);

// 渠道商
const distributorIndex = r => require(["../views/distributor/index"], r);
// 累计收入
const accumulatedIncome = r => require(["../views/distributor/accumulated_income"], r);
// 推荐升级
const recommendUp = r => require(["../views/distributor/recommendUp"], r);
// 提交推荐升级
const submitRecommend = r => require(["../views/distributor/submitRecommend"], r);
// 我的库存
const myRepertory = r => require(["../views/distributor/my_repertory"], r);
// 订货
const orderGoods = r => require(["../views/distributor/order_goods"], r);
// 发货
const deliverGoods = r => require(["../views/distributor/deliver_goods"], r);
// 发货下一步
const deliverGoodsNext = r => require(["../views/distributor/deliver_goods_next"], r);
// 下单
const placeOrder = r => require(["../views/distributor/place_order"], r);
// 换货
const exchangeGoods = r => require(["../views/distributor/exchange_goods"], r);
// 换货详情
const exchangeDetail = r => require(["../views/distributor/exchange_detail"], r);
// 兑换券
const exchangeTicket = r => require(["../views/distributor/exchange_ticket"], r);
// 我的下线客户
const myReferrals = r => require(["../views/distributor/my_referrals"], r);
// 我的换货
const myExchange = r => require(["../views/distributor/my_exchange"], r);
// 客户订单 我的发货  我的补货
const clientOrder = r => require(["../views/distributor/client_order"], r);
// 订单详情
const DisOrderDetail = r => require(["../views/distributor/order_detail"], r);
// 订货换货
const bookingChange = r => require(["../views/distributor/booking_change"], r);
//库存明细
const distributor_stock = r => require(["../views/distributor/distributor_stock"], r);
//客户订货详情
// const dis_order_datail = r => require(['../views/distributor/dis_order_datail'], r);
//购物车
const exchangeCart = r => require(["../views/distributor/cart"], r);
const distributorRank = r => require(["../views/distributor/distributor_rank"], r);
const estimatedIncome = r => require(["../views/distributor/estimated_income"], r);
const estimatedIncomeDetail = r => require(["../views/distributor/estimated_income_detail"], r);

//直播Live
//直播助手
const helperLiveList = r => require(["../views/live/helper_liveList"], r);
//直播助手直播间
const helperLiveRoom = r => require(["../views/live/helper_liveRoom"], r);
//主播申请
const anchorApply = r => require(["../views/live/anchorApply"], r);
//主播个人中心
const anchorDetail = r => require(["../views/live/anchorDetail"], r);
//直播列表
const liveList = r => require(["../views/live/liveList"], r);
//直播页
const livePage = r => require(["../views/live/livePage"], r);
//直播预告
const foreshow = r => require(["../views/live/foreshow"], r);
//直播主播分红
const liveDividend = r => require(["../views/live/liveDividend"], r);
//粉丝列表
const liveFanList = r => require(["../views/live/liveFanList"], r);

//精英奖
const eliteAwardHome = r => require(["../views/member/eliteAward/eliteAward_home"], r);
const eliteAwardRecord = r => require(["../views/member/eliteAward/eliteAward_record"], r);
const eliteAwardRank = r => require(["../views/member/eliteAward/eliteAward_rank"], r);

//安装服务（绿象）
const workerApply = r => require(["../views/member/install_service/worker_apply"], r);
const workerOrderlist = r => require(["../views/member/install_service/worker_orderlist"], r);
const workerOrderDetail = r => require(["../views/member/install_service/worker_orderDetail"], r);
const userOrderlist = r => require(["../views/member/install_service/user_orderlist"], r);
const userOrderDetail = r => require(["../views/member/install_service/user_orderDetail"], r);
const installIncome = r => require(["../views/member/install_service/install_income"], r);

//抢团
const grab_group_home = r => require(["../views/goods/grab_group/grab_group_home"], r);
const grab_group_my = r => require(["../views/goods/grab_group/grab_group_my"], r);
const grab_group_my_record = r => require(["../views/goods/grab_group/grab_group_my_record"], r);
const grab_group_reward = r => require(["../views/goods/grab_group/grab_group_reward"], r);
// const grab_group = r => require(["../views/goods/grab_group/grab_group"], r);
const grabGroup_detail = r => require(["../views/goods/grab_group/grab_group_detail"], r);

//推荐官
const referral_officer = r => require(["../views/extension/other/referral_officer"], r);
const referral_officerDetail = r => require(["../views/extension/other/referral_officerDetail"], r);

// 安装服务
const installationSeverApply = r => require(["../views/extension/other/installationSever/worker_apply"], r);
const installationSeverExtension = r => require(["../views/extension/other/installationSeverExtension"], r);
const installationSeverDividends = r => require(["../views/extension/other/installationSever/installationSeverDividends"], r);
const installationSeverHome = r => require(["../views/extension/other/installationSever/home"], r);
// 师傅端详情
const installationSeverDetail = r => require(["../views/extension/other/installationSever/detail"], r);
// 会员端详情
const installationSeverRefund = r => require(["../views/extension/other/installationSever/refund"], r);
// 售后原因
const installationSeverAftersale = r => require(["../views/extension/other/installationSever/afterSaleList"], r);
// 售后申请
const installationSeverAfterApply = r => require(["../views/extension/other/installationSever/afterApply"], r);
// 商家核销
const installationSeverWrite = r => require(["../views/extension/other/installationSever/installationSeverWrite"], r);
//群活码
const groupCodeIndex = r => require(["../views/member/group_code/group_code_index"], r);
const groupCodeCreate = r => require(["../views/member/group_code/group_code_create"], r);
const groupCodeData = r => require(["../views/member/group_code/group_code_data"], r);
const groupCodeEdit = r => require(["../views/member/group_code/group_code_edit"], r);
const groupCodeRanking = r => require(["../views/member/group_code/group_code_ranking"], r);
const groupCodeRecord = r => require(["../views/member/group_code/group_code_record"], r);
const groupCodeShow = r => require(["../views/member/group_code/group_code_show"], r);
const groupCodeLabel = r => require(["../views/member/group_code/group_code_label"], r);
const groupCodeSearch = r => require(["../views/member/group_code/group_code_search"], r);
const groupCodeGoodsList = r => require(["../views/member/group_code/group_code_goodsList"], r);

// 测肤
const skinHome = r => require(["../views/others/skin/home"], r);
const skinResult = r => require(["../views/others/skin/result"], r);
const skinShare = r => require(["../views/others/skin/share"], r);
const skinLog = r => require(["../views/others/skin/log"], r);
const skinRank = r => require(["../views/others/skin/rank"], r);
const AllResult = r => require(["../views/others/skin/all_result"], r);

//社区团购B
const communityBuyIndex = r => require(["../views/community_buying/index"], r);
const communityBuyEdit_info = r => require(["../views/community_buying/edit_info"], r);
const communityBuyGroup = r => require(["../views/community_buying/group_buying"], r);
const communityBuyDetails = r => require(["../views/community_buying/buying_details"], r);
const communityBuyData = r => require(["../views/community_buying/buying_data"], r);
const communityBuyOrder = r => require(["../views/community_buying/buying_order"], r);
const communityBuyPersonal = r => require(["../views/community_buying/buying_personal"], r);

//站内消息通知
const stationNoticeIndex = r => require(["../views/member/station_notice/station_notice_index"], r);
const stationNoticeSetting = r => require(["../views/member/station_notice/station_notice_setting"], r);
const stationNoticeExtract = r => require(["../views/member/station_notice/station_notice_extract"], r);
const stationNoticeExamine = r => require(["../views/member/station_notice/station_notice_examine"], r);
const stationNoticeLogistics = r => require(["../views/member/station_notice/station_notice_logistics"], r);
const stationNoticeAnchor = r => require(["../views/member/station_notice/station_notice_anchor"], r);
const stationNoticeCustomer = r => require(["../views/member/station_notice/station_notice_customer"], r);
const stationNoticeProperty = r => require(["../views/member/station_notice/station_notice_property"], r);
const stationNoticeOrder = r => require(["../views/member/station_notice/station_notice_order"], r);
const stationNoticeActivity = r => require(["../views/member/station_notice/station_notice_activity"], r);
const stationNoticeActivityDetail = r => require(["../views/member/station_notice/station_notice_activity_detail"], r);
//爱心值排行榜
const loveRanking = r => require(["../views/member/love_ranking/love_ranking"], r);

// //拼单
// const collageIndex = r => require(["../views/member/collage/collage_index"], r); //首页
// const collageReportform = r => require(["../views/member/collage/collage_reportform"], r); //报表
// const collageRegionBonus = r => require(["../views/member/collage/collage_region_bonus"], r); // 拼单分红

// /***************非会员******************/

// const tacitApply = r => require(["../views/member/collage/tacit/tacit_apply"], r); //会员申请
// const tacitAddproject = r => require(["../views/member/collage/tacit/tacit_addproject"], r); //添加项目
// const tacitDetproject = r => require(["../views/member/collage/tacit/tacit_detproject"], r); //项目详情
// const tacitEditproject = r => require(["../views/member/collage/tacit/tacit_editproject"], r); //修改项目

// /***************等级创始人******************/
// const founderCollage = r => require(["../views/member/collage/founder/founder_collage"], r); //拼单
// const founderEchievement = r => require(["../views/member/collage/founder/founder_echievement"], r); //业绩榜单
// const founderTeam = r => require(["../views/member/collage/founder/founder_team"], r); //我的团队
// const founderSinglepool = r => require(["../views/member/collage/founder/founder_singlepool"], r); //拼单池
// const founderBicycle = r => require(["../views/member/collage/founder/founder_bicycle"], r); //拼单车

//区域代理
const regionalAgent = r => require(["../views/member/regional_agent/regional_agent_index"], r);
const regionalAgentResult = r => require(["../views/member/regional_agent/regional_agent_result"], r);
const regionalAgentSearch = r => require(["../views/member/regional_agent/regional_agent_search"], r);

//看视频答题
const videoAnswer = r => require(["../views/video_goods/little_video/video_answer"], r);

//共享合伙人
const sharedPartner = r => require(["../views/member/shared_partner/shared_partner"], r);

//社群接龙
const community_solitaire = r => require(["../views/others/community_solitaire/index"], r);
//新抽奖
const newDrawIndex = r => require(["../views/others/new_draw/index"], r);
const lottery_complaint = r => require(["../views/others/new_draw/lottery_complaint"], r);
const winners_list = r => require(["../views/others/new_draw/winners_list"], r);
const mydraw = r => require(["../views/others/new_draw/mydraw"], r);
const lucky_draw = r => require(["../views/others/new_draw/lucky_draw"], r);
const newDrawMyPrize = r => require(["../views/others/new_draw/my_prize"], r);
const newDrawRecommentReward = r => require(["../views/others/new_draw/recomment_reward"], r);
const newDrawPayment = r => require(["../views/others/new_draw/payment"], r);

//业绩区域奖励
const regionalAwards = r => require(["../views/member/regional_awards/regional_awards_index"], r);
const regionalAwardsRecord = r => require(["../views/member/regional_awards/regional_awards_record"], r);

//新团队分红
const newTeamBonus = r => require(["../views/member/income/teamAgentCenter/new_team_bonus"], r);
//蓝积分
const integralBlueCattle = r => require(["../views/member/integral_v2/member_integral_blueCattle"], r);
//蓝积分登陆
const lanLogin = r => require(["../views/member/integral_v2/lan_login"], r);

//我的市场
const myMarket = r => require(["../views/member/tool/my_market"], r);

//星拼乐
const starMusicIndex = r => require(["../views/member/star_music/star_music_index"], r); //聚合页
const starMusicOpenGroup = r => require(["../views/member/star_music/star_music_open_group"], r); //开团
const starMusicMy = r => require(["../views/member/star_music/star_music_my"], r); //我的
const starMusicRewardsRecord = r => require(["../views/member/star_music/star_music_rewards_record"], r); //奖励记录
//const starMusicEspNumber = r => require(["../views/member/star_music/star_music_esp_number"], r);//资格次数
const starMusicPersonalGroup = r => require(["../views/member/star_music/star_music_personal_group"], r); //我的团（开团和参团）
const starMusicListGroup = r => require(["../views/member/star_music/star_music_list_group"], r); //团列表
const starMusicGoodsDetails = r => require(["../views/member/star_music/star_music_goods_details"], r); //商品详情
const starMusicGroupDetails = r => require(["../views/member/star_music/star_music_group_details"], r); //拼团详情

// 商品分红
const commodityDividends = r => require(["../views/extension/commodityDividends"], r);

//盲盒
const blindBoxIndex = r => require(["../views/member/blindBox/blindBoxIndex"], r);
const blindBoxDetail = r => require(["../views/member/blindBox/blindBoxDetail"], r);
const blindBoxHelping = r => require(["../views/member/blindBox/blindBoxHelping"], r);

// 社区门店
const communityStore = r => require(["../views/o2o/community_stores/community_stores"], r);
const communityStoreDetails = r => require(["../views/o2o/community_stores/community_stores_details"], r);

//新零售
const newRetailIndex = r => require(["../views/member/newRetail/index"], r);
const newRetailSearch = r => require(["../views/member/newRetail/search"], r);
const newRetail_agencyPackage = r => require(["../views/member/newRetail/agency_package"], r);
const newRetailInventory = r => require(["../views/member/newRetail/inventory"], r);
const newRetailRetailLink = r => require(["../views/member/newRetail/retailLink"], r);
const newRetailSalesRecord = r => require(["../views/member/newRetail/salesRecord"], r);
const newRetailSalesRecordDetail = r => require(["../views/member/newRetail/salesRecord_detail"], r);
const newRetailSalesExtension = r => require(["../views/member/newRetail/extension"], r);
const newRetailInventoryDetails = r => require(["../views/member/newRetail/Inventory_details"], r);
// const newRetailSalesGood = r => require(["../views/member/newRetail/good"], r);

const Test = r => require(["../views/business_card/test"], r);

//广告投放
const advertisingApply = r => require(["../views/member/Advertising/apply"], r);
const advertisingAdvertisers = r => require(["../views/member/Advertising/advertisers"], r);
const advertisingAdDetails = r => require(["../views/member/Advertising/advertisersDetail"], r);
const advertisingRelease = r => require(["../views/member/Advertising/releaseAD"], r);
const advertisingList = r => require(["../views/member/Advertising/adList"], r);
const advertisingPutAD = r => require(["../views/member/Advertising/putAD"], r);
const advertisingPlayPage = r => require(["../views/member/Advertising/adPlayPage"], r);

//评估资产详情
const version = r => require(["../views/version"], r);

//消费积分
const consumerRewardIndex = r => require(["../views/extension/consumer_reward/consumer_reward_index"], r);
const consumerRewardApply = r => require(["../views/extension/consumer_reward/consumer_reward_apply"], r);
const consumerRewardRecord = r => require(["../views/extension/consumer_reward/consumer_reward_record"], r);
const consumerRewardPaySuccess = r => require(["../views/extension/consumer_reward/pay_success"], r);

//上级代付
const superiorPaymentIndex = r => require(["../views/superior_payment/superior_payment_index"], r);
const superiorPaymentPay = r => require(["../views/superior_payment/superior_payment_pay"], r);
const superiorPaymentExtension = r => require(["../views/superior_payment/superior_payment_extension"], r);
const superiorPaymentDetails = r => require(["../views/superior_payment/superior_payment_details"], r);
//群拓客
const gduIndex = r => require(["../views/member/group_develop_user/gdu_index"], r);
const gduEnterpriseDetails = r => require(["../views/member/group_develop_user/gdu_enterprise_details"], r);
const gduEnterprisePoster = r => require(["../views/member/group_develop_user/join_group_poster"], r);
//订单导入
const orderImportIndex = r => require(["../views/member/orderImport/order_import_index"], r);
const orderImportApply = r => require(["../views/member/orderImport/order_import_apply"], r);

// 门店独立余额
const independenceBalance = r => require(["../views/o2o/independenceBalance"], r);
const storeBalanceDetail = r => require(["../views/o2o/storeBalanceDetail"], r);
// cps
const cpsPage = r => require(["../views/others/cps/cpsPage"], r);
const cpsSearchPage = r => require(["../views/others/cps/cpsSearchPage"], r);
const cpsGoodDetail = r => require(["../views/others/cps/cpsDetail"], r);
const cpsTransfer = r => require(["../views/others/cps/cpsTransfer"], r);
// 个人红包
const personRed = r => require(["../views/others/daily_red/personRed/personRed"], r);
const personRedList = r => require(["../views/others/daily_red/personRed/personRedList"], r);
const personRedListDetail = r => require(["../views/others/daily_red/personRed/personRedListDetail"], r);
const personRedPay = r => require(["../views/others/daily_red/personRed/personRedPay"], r);
const personRedissue = r => require(["../views/others/daily_red/personRed/personRedissue"], r);
const personRedrecord = r => require(["../views/others/daily_red/personRed/personRedrecord"], r);
// 奖金池
const prizePool = r => require(["../views/others/prizePool/prizePool"], r);

// 商品详情新优化评价页面
const goodsComment = r => require(["../views/goods/GoodsComment"], r);

//捐赠项目
const donationProjectIndex = r => require(["../views/member/donation_project/donation_project_index"], r);
const donationProjectList = r => require(["../views/member/donation_project/donation_project_list"], r);
const donationProjectSearch = r => require(["../views/member/donation_project/donation_project_search"], r);
const donationProjectPicture = r => require(["../views/member/donation_project/donation_project_picture"], r);
const donationProjectVideo = r => require(["../views/member/donation_project/donation_project_video"], r);
const donationProjectDetails = r => require(["../views/member/donation_project/donation_project_details"], r);
const donationProjectInfo = r => require(["../views/member/donation_project/donation_project_info"], r);
// 企业微信侧边栏
const workWechatSidebar = r => require(["../views/enterprise_wechat/wechat_sidebar"], r);
const sidebarIndex = r => require(["../views/enterprise_wechat/index"], r);
const sidebarOrderDetail = r => require(["../views/enterprise_wechat/orderDetail"], r);
//小学霸-区域分红
const gratitudeRewardIndex = r => require(["../views/extension/gratitude_reward/gratitude_reward_index"], r);
const DonateIndex = r => require(["../views/love/donate/DonateIndex"], r);
// 供应商配送
const supplierDriver = r => require(["../views/member/supplier/supplierDist/supplierDriver"], r);
// 配送入口
const distributionEntrance = r => require(["../views/member/supplier/supplierDist/distributionEntrance"], r);

// 店铺助手
const storeManagementIndex = r => require(["../views/store_management/index"], r);
const storeGoodsManagement = r => require(["../views/store_management/goods_management"], r);
const releaseStoreGoods = r => require(["../views/store_management/release_goods"], r);
const storeGoodsCatgory = r => require(["../views/store_management/goods_category"], r);
const editGoodsCatgory = r => require(["../views/store_management/edit_category"], r);
// 店铺助手--会员管理
const memberManagement = r => require(["../views/store_management/member_management"], r);
const storeMemberInfo = r => require(["../views/store_management/member_info"], r);
const storeIntegralList = r => require(["../views/store_management/integral_detail"], r);
const storeBalanceList = r => require(["../views/store_management/balance_detail"], r);
const storeCouponList = r => require(["../views/store_management/coupon_list"], r);
// 店铺助手--财务管理
const financeManagement = r => require(["../views/store_management/finance_management"], r);
// 店铺助手--提现记录
const withdrawalList = r => require(["../views/store_management/withdrawal_list"], r);
const withdrawalDetail = r => require(["../views/store_management/withdrawal_detail"], r);

//任务奖励开发
const dealerTaskRewardIndex = r => require(["../views/extension/dealer_task_reward/index"], r);
const dealerTaskRewardRecord = r => require(["../views/extension/dealer_task_reward/record"], r);

// 企业微信好友裂变
const workWxFriendExtend = r => require(["../views/others/wx_friend_extend/index"], r);
const friendRanking = r => require(["../views/others/wx_friend_extend/rankingList"], r);
const invitationRecord = r => require(["../views/others/wx_friend_extend/invitationRecord"], r);
const friendRewardRecord = r => require(["../views/others/wx_friend_extend/rewardRecord"], r);

// 企业微信 sop任务
const sopPushTask = r => require(["../views/workWx/sop_task/pushTaskList.vue"], r);
const sopTaskDetail = r => require(["../views/workWx/sop_task/taskDetail"], r);
const sopTaskList = r => require(["../views/workWx/sop_task/taskList"], r);

//品牌资源
const brandResourcesIndex = r => require(["../views/brand_resources/brand_resources_index"], r);
const cardVoucherInfo = r => require(["../views/brand_resources/card_voucher_info"], r);
// 代理商奖励
const allowanceIndex = r => require(["../views/extension/allowanceIndex/allowanceIndex"], r);
const allowanceReward = r => require(["../views/extension/allowanceIndex/allowanceReward"], r);
const allowanceAchievement = r => require(["../views/extension/allowanceIndex/allowanceAchievement"], r);
const allowanceTeam = r => require(["../views/extension/allowanceIndex/allowanceTeam"], r);
// 宙子云开发单独页面
const cloudPage = r => require(["../views/others/cloudPage/cloudPage"], r);
const payBack = r => require(["../views/member/order/pay_back/pay_back"], r);
// 分时预约
const timeAppointment_index = r => require(["../views/timeAppointment/timeAppointment_index"], r);
const timeAppointment_search = r => require(["../views/timeAppointment/timeAppointment_search"], r);
const timeAppointmentMy = r => require(["../views/timeAppointment/timeAppointmentMy"], r);
const timeAppointmentMylist = r => require(["../views/timeAppointment/timeAppointmentMylist"], r);
const AppointmentUserDe = r => require(["../views/timeAppointment/AppointmentUserDe"], r);
// 小猪欢欢项目 奖励池
const bonusPoolsIndex = r => require(["../views/extension/bonusPoolsIndex/bonusPoolsIndex"], r);
const bonusPoolsTeam = r => require(["../views/extension/bonusPoolsIndex/bonusPoolsTeam"], r);

// 话术库
const SpeechLibrary = r => require(["../views/workWx/speech-library/index.vue"], r);

// 见点奖励
const seePoint = r => require(["../views/extension/seePoint"], r);

// 拓客雷达
const customerStatistic = r => require(["../views/workWx/customer-radar/statistic"], r);
const memberRecordDetail = r => require(["../views/workWx/customer-radar/record_detail"], r);
const wxWorkChatTransfer = r => require(["../views/workWx/customer-radar/chatTransfer"], r);

// 门店签到
const storeSign = r => require(["../views/o2o/storeSign/storeSign.vue"], r);
// 门店签到明细
const storeSignDetail = r => require(["../views/o2o/storeSign/storeSignDetail.vue"], r);
// 爱心公益
const publicWelfare = r => require(["../views/extension/public_welfare_fund/index"], r);
const welfareDonations = r => require(["../views/extension/public_welfare_fund/donations"], r);
const welfareRecord = r => require(["../views/extension/public_welfare_fund/record"], r);

export default [
  // 代理商奖励
  {
    path: "/allowanceIndex",
    component: allowanceIndex,
    name: "allowanceIndex",
    meta: { title: "代理商奖励", foot: true }
  },
  {
    path: "/allowanceReward/:ind",
    component: allowanceReward,
    name: "allowanceReward",
    meta: { title: "", foot: true }
  },
  {
    path: "/allowanceAchievement",
    component: allowanceAchievement,
    name: "allowanceAchievement",
    meta: { title: "业绩统计", foot: true }
  },
  {
    path: "/allowanceTeam",
    component: allowanceTeam,
    name: "allowanceTeam",
    meta: { title: "团队人员", foot: true }
  },
  //资产详情
  { path: "/assessment/:asset_id", component: Assessment, name: "Assessment", meta: { title: "资产详情", foot: false } },
  // {path: '/asset_profit', component: AssetProfit, name: 'AssetProfit', meta: {title: '分红', foot: true}},
  // {path: '/categories', component: Categories, name: 'Categories', meta: {title: '全部类型', foot: true}},
  {
    path: "/asset_notices/:notice_id",
    component: AssetNotices,
    name: "AssetNotices",
    meta: { title: "财务报告", foot: true }
  },
  // {path: '/digital_asset', component: DigitalAsset, name: 'DigitalAsset', meta: {title: '数字资产', foot: true}},
  // {path: '/finance', component: Finance, name: 'Finance', meta: {title: '财务', foot: true}},
  {
    path: "/asset_introduction/:asset_id",
    component: AssetIntroduction,
    name: "AssetIntroduction",
    meta: { title: "简况", foot: true }
  },
  {
    path: "/detail_report/:finance_id",
    component: DetailReport,
    name: "DetailReport",
    meta: { title: "财务报告", foot: true }
  },
  { path: "/asset_sale/:asset_id", component: AssetSale, name: "AssetSale", meta: { title: "我要销售", foot: true } },

  //我的资产
  { path: "/buying_record/:asset_id", component: BuyingRecord, name: "BuyingRecord", meta: { title: "", foot: true } },
  { path: "/check_asset/:asset_id", component: CheckAsset, name: "CheckAsset", meta: { title: "", foot: true } },
  {
    path: "/income_record/:asset_id",
    component: IncomeRecord,
    name: "IncomeRecord",
    meta: { title: "进出记录", foot: true }
  },
  { path: "/my_asset", component: MyAsset, name: "MyAsset", meta: { title: "", foot: true } },
  { path: "/secret_key/:name", component: SecretKey, name: "SecretKey", meta: { title: "", foot: true } },
  { path: "/set_password", component: SetPassword, name: "SetPassword", meta: { title: "交易密码", foot: true } },
  { path: "/transfer/:asset_id", component: AssetTrans, name: "AssetTrans", meta: { title: "转让", foot: true } },
  {
    path: "/transaction_details/:id",
    component: TransactionDetails,
    name: "TransactionDetails",
    meta: { title: "详情", foot: true }
  },

  //交易大厅主页
  { path: "/trans_home", component: TransHome, name: "TransHome", meta: { title: " ", foot: true } },
  { path: "/asset_classify", component: AssetClassify, name: "AssetClassify", meta: { title: "交易大厅", foot: true } },
  { path: "/buying/:asset_id", component: Buying, name: "Buying", meta: { title: "认购", foot: true } },
  { path: "/trans_notice", component: TransNotice, name: "TransNotice", meta: { title: "公告", foot: true } },
  {
    path: "/classified_search",
    component: ClassifiedSearch,
    name: "ClassifiedSearch",
    meta: { title: "分类搜索列表", foot: true }
  },
  // { path: "/trading_hall", component: TradingHall, name: "TradingHall", meta: { title: "交易大厅", foot: true } },

  //名片
  {
    path: "/business_card/card_center",
    component: CardCenter,
    name: "CardCenter",
    meta: { title: "名片中心", foot: true }
  },
  {
    path: "/business_card/business_card",
    component: BusinessCard,
    name: "BusinessCard",
    meta: { title: "名片", foot: true }
  },
  {
    path: "/business_card/card_action/:card_id",
    component: Card_Action,
    name: "Card_Action",
    meta: { title: "数据统计", foot: true }
  },
  {
    path: "/business_card/card_code/:card_id",
    component: CardCode,
    name: "CardCode",
    meta: { title: "名片码", foot: true }
  },
  {
    path: "/business_card/card_collect/:card_id",
    component: CardCollect,
    name: "CardCollect",
    meta: { title: "名片收藏", foot: true }
  },
  {
    path: "/business_card/card_footprint/:card_id",
    component: CardFootprint,
    name: "CardFootprint",
    meta: { title: "名片足迹", foot: true }
  },
  {
    path: "/business_card/card_goods/:id",
    component: CardGoods,
    name: "CardGoods",
    meta: { title: "名片选择商品", foot: true }
  },
  {
    path: "/business_card/card_ranking",
    component: CardRanking,
    name: "CardRanking",
    meta: { title: "名片排行", foot: true }
  },
  {
    path: "/business_card/card_visit/:card_id",
    component: CardVisit,
    name: "CardVisit",
    meta: { title: "名片图片", foot: true }
  },
  {
    path: "/business_card/edit_card/:card_id",
    component: EditCard,
    name: "EditCard",
    meta: { title: "编辑名片", foot: true }
  },

  // 渠道商
  { path: "/distributor_index", component: distributorIndex, name: "distributorIndex", meta: { title: "", foot: true } },
  { path: "/accumulated_income", component: accumulatedIncome, name: "accumulatedIncome", meta: { title: "累计收入", foot: true } },
  { path: "/recommendUp", component: recommendUp, name: "recommendUp", meta: { title: "推荐升级", foot: true } },
  { path: "/submitRecommend", component: submitRecommend, name: "submitRecommend", meta: { title: "提交推荐", foot: true } },
  { path: "/my_repertory", component: myRepertory, name: "myRepertory", meta: { title: "我的库存", foot: true } },
  { path: "/order_goods", component: orderGoods, name: "orderGoods", meta: { title: "订货", foot: true, notKeepAlive: true } },
  { path: "/deliver_goods", component: deliverGoods, name: "deliverGoods", meta: { title: "发货", foot: true } },
  { path: "/deliverGoodsNext", component: deliverGoodsNext, name: "deliverGoodsNext", meta: { title: "发货", foot: true } },
  { path: "/place_order", component: placeOrder, name: "placeOrder", meta: { title: "下单", foot: true } },
  { path: "/exchange_goods", component: exchangeGoods, name: "exchangeGoods", meta: { title: "换货", foot: true } },
  { path: "/exchange_detail/:id", component: exchangeDetail, name: "exchangeDetail", meta: { title: "换货", foot: true } },
  { path: "/exchange_ticket", component: exchangeTicket, name: "exchangeTicket", meta: { title: "兑换券", foot: true } },
  { path: "/my_referrals", component: myReferrals, name: "myReferrals", meta: { title: "我的下线客户", foot: true } },
  { path: "/my_exchange", component: myExchange, name: "myExchange", meta: { title: "我的换货", foot: true } },
  { path: "/client_order/:status", component: clientOrder, name: "clientOrder", meta: { title: "客户订单", foot: true } },
  { path: "/client_order/:status/:orderType", component: clientOrder, name: "myDeliver", meta: { title: "我的发货", foot: true } },
  { path: "/client_order/:status/:orderType", component: clientOrder, name: "dismyReplenishment", meta: { title: "我的补货", foot: true } },
  { path: "/dis_order_detail/:order_id/:orderType", component: DisOrderDetail, name: "DisOrderDetail", meta: { title: "订单详情", foot: true } },
  { path: "/booking_change/:order_id", component: bookingChange, name: "bookingChange", meta: { title: "补货", foot: true } },
  { path: "/exchangeCart/:type/:order_id?", component: exchangeCart, name: "exchangeCart", meta: { title: "购物车", foot: true } },
  { path: "/distributor_stock/:goods_id/:option_id", component: distributor_stock, name: "distributor_stock", meta: { title: "库存明细", foot: true } },
  { path: "/distributor/rank", component: distributorRank, name: "distributorRank", meta: { title: "排行榜", foot: true } },
  { path: "/distributor/estimatedIncome", component: estimatedIncome, name: "estimatedIncome", meta: { title: "预估收益", foot: true } },
  { path: "/distributor/estimatedIncomeDetail/:id", component: estimatedIncomeDetail, name: "estimatedIncomeDetail", meta: { title: "预估收益详情", foot: true } },

  // {path: '/dis_order_datail', component: dis_order_datail, name: 'dis_order_datail', meta: {title: '客户订货详情', foot: true}},
  //直播
  { path: "/helperLiveList", component: helperLiveList, name: "helperLiveList", meta: { title: "主播助手", foot: true } },
  {
    path: "/helperLiveRoom/:id",
    component: helperLiveRoom,
    name: "helperLiveRoom",
    meta: { title: "直播间", foot: true }
  },
  { path: "/anchorApply", component: anchorApply, name: "anchorApply", meta: { title: "主播申请", foot: true } },
  { path: "/anchorDetail/:id", component: anchorDetail, name: "anchorDetail", meta: { title: "主播页面", foot: true } },
  { path: "/liveList", component: liveList, name: "liveList", meta: { title: "直播列表", foot: true } },
  { path: "/liveCategory/:cate_id", component: liveList, name: "liveCategory", meta: { title: "分类列表", foot: true } },
  { path: "/livePage", component: livePage, name: "livePage", meta: { title: "直播间", foot: true, is_single_share: true } },
  { path: "/foreshow/:id", component: foreshow, name: "foreshow", meta: { title: "直播预告", foot: true } },
  { path: "/liveDividend", component: liveDividend, name: "liveDividend", meta: { title: "主播分红", foot: true } },
  { path: "/liveFanList", component: liveFanList, name: "liveFanList", meta: { title: "粉丝列表", foot: true } },

  //精英奖
  { path: "/eliteAwardHome", component: eliteAwardHome, name: "eliteAwardHome", meta: { title: "精英奖", foot: true } },
  {
    path: "/eliteAwardRecord",
    component: eliteAwardRecord,
    name: "eliteAwardRecord",
    meta: { title: "精英奖记录", foot: true }
  },
  { path: "/eliteAwardRank", component: eliteAwardRank, name: "eliteAwardRank", meta: { title: "排行榜记录", foot: true } },

  { path: "/business_card/Test", component: Test, name: "Test", meta: { title: "Test", foot: true } },
  { path: "/version", component: version, name: "version", meta: { title: "version", foot: true } },

  //群活码
  { path: "/member/groupCode", component: groupCodeIndex, name: "groupCode", meta: { title: "群活码", foot: false } },
  {
    path: "/member/groupCodeCreate",
    component: groupCodeCreate,
    name: "groupCodeCreate",
    meta: { title: "活码创建", foot: true }
  },
  {
    path: "/member/groupCodeData",
    component: groupCodeData,
    name: "groupCodeData",
    meta: { title: "群活码数据", foot: false }
  },
  {
    path: "/member/groupCodeEdit",
    component: groupCodeEdit,
    name: "groupCodeEdit",
    meta: { title: "群活码编辑", foot: true }
  },
  {
    path: "/member/groupCodeRanking",
    component: groupCodeRanking,
    name: "groupCodeRanking",
    meta: { title: "群活码排行榜", foot: false }
  },
  {
    path: "/member/groupCodeRecord",
    component: groupCodeRecord,
    name: "groupCodeRecord",
    meta: { title: "群活码记录", foot: false }
  },
  {
    path: "/member/groupCodeShow",
    component: groupCodeShow,
    name: "groupCodeShow",
    meta: { title: "群活码展示", foot: false }
  },
  {
    path: "/member/groupCodeLabel",
    component: groupCodeLabel,
    name: "groupCodeLabel",
    meta: { title: "", foot: false }
  },
  {
    path: "/member/groupCodeSearch",
    component: groupCodeSearch,
    name: "groupCodeSearch",
    meta: { title: "搜索", foot: true }
  },
  {
    path: "/member/groupCodeGoodsList/:id",
    component: groupCodeGoodsList,
    name: "groupCodeGoodsList",
    meta: { title: "群活码商品列表", foot: true }
  },

  //测肤
  { path: "/skin/Home", component: skinHome, name: "skinHome", meta: { title: "测肤", foot: false, notKeepAlive: true } },
  { path: "/skin/Result/:id", component: skinResult, name: "skinResult", meta: { title: "测肤结果", foot: false } },
  { path: "/skin/Share/:id", component: skinShare, name: "skinShare", meta: { title: "测肤结果", foot: false } },
  { path: "/skin/Log", component: skinLog, name: "skinLog", meta: { title: "测肤记录", foot: false, notKeepAlive: true } },
  {
    path: "/skin/Rank",
    component: skinRank,
    name: "skinRank",
    meta: { title: "测肤结果", foot: false, notKeepAlive: true }
  },
  { path: "/skin/AllResult/:id", component: AllResult, name: "AllResult", meta: { title: "测肤结果", foot: false } },

  //社区团购
  {
    path: "/community_buying/index",
    component: communityBuyIndex,
    name: "communityBuyIndex",
    meta: { title: "自提点", foot: true }
  },
  {
    path: "/community_buying/edit_info",
    component: communityBuyEdit_info,
    name: "communityBuyEdit_info",
    meta: { title: "自提点", foot: true }
  },
  {
    path: "/community_buying/group_buying",
    component: communityBuyGroup,
    name: "communityBuyGroup",
    meta: { title: "社区团购", foot: true }
  },
  {
    path: "/community_buying/buying_details/:id",
    component: communityBuyDetails,
    name: "communityBuyDetails",
    meta: { title: "团购商品", foot: true }
  },
  {
    path: "/community_buying/buying_data/:id",
    component: communityBuyData,
    name: "communityBuyData",
    meta: { title: "团购商品", foot: true }
  },
  {
    path: "/community_buying/buying_order",
    component: communityBuyOrder,
    name: "communityBuyOrder",
    meta: { title: "社区团购", foot: true }
  },
  {
    path: "/community_buying/buying_personal/:id/:deliver_id",
    component: communityBuyPersonal,
    name: "communityBuyPersonal",
    meta: { title: "社区团购", foot: true }
  },
  //站内通知
  {
    path: "/member/stationNotice",
    component: stationNoticeIndex,
    name: "stationNotice",
    meta: { title: "信息", foot: false }
  },
  {
    path: "/member/stationNoticeSetting",
    component: stationNoticeSetting,
    name: "stationNoticeSetting",
    meta: { title: "信息", foot: false }
  },
  {
    path: "/member/stationNoticeExtract",
    component: stationNoticeExtract,
    name: "stationNoticeExtract",
    meta: { title: "提现", foot: false }
  },
  {
    path: "/member/stationNoticeExamine",
    component: stationNoticeExamine,
    name: "stationNoticeExamine",
    meta: { title: "申请", foot: false }
  },
  {
    path: "/member/stationNoticeLogistics",
    component: stationNoticeLogistics,
    name: "stationNoticeLogistics",
    meta: { title: "交易物流", foot: false }
  },
  {
    path: "/member/stationNoticeAnchor",
    component: stationNoticeAnchor,
    name: "stationNoticeAnchor",
    meta: { title: "服务通知", foot: false }
  },
  {
    path: "/member/stationNoticeCustomer",
    component: stationNoticeCustomer,
    name: "stationNoticeCustomer",
    meta: { title: "客户通知", foot: false }
  },
  {
    path: "/member/stationNoticeProperty",
    component: stationNoticeProperty,
    name: "stationNoticeProperty",
    meta: { title: "资产通知", foot: false }
  },
  {
    path: "/member/stationNoticeOrder",
    component: stationNoticeOrder,
    name: "stationNoticeOrder",
    meta: { title: "订单提醒", foot: false }
  },
  {
    path: "/member/stationNoticeActivity",
    component: stationNoticeActivity,
    name: "stationNoticeActivity",
    meta: { title: "活动优惠", foot: false }
  },
  {
    path: "/member/stationNoticeActivityDetail",
    component: stationNoticeActivityDetail,
    name: "stationNoticeActivityDetail",
    meta: { title: "活动优惠", foot: false }
  },

  //安装服务
  { path: "/member/workerApply", component: workerApply, name: "workerApply", meta: { title: "申请", foot: true } },
  {
    path: "/member/workerOrderlist",
    component: workerOrderlist,
    name: "workerOrderlist",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/workerOrderDetail/:id",
    component: workerOrderDetail,
    name: "workerOrderDetail",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/userOrderlist",
    component: userOrderlist,
    name: "userOrderlist",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/userOrderDetail/:id",
    component: userOrderDetail,
    name: "userOrderDetail",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/member/installIncome",
    component: installIncome,
    name: "installIncome",
    meta: { title: "安装服务", foot: true }
  },

  //推荐人
  {
    path: "/extension/referral_officer",
    component: referral_officer,
    name: "referral_officer",
    meta: { title: "推荐官", foot: true }
  },
  {
    path: "/extension/referral_officerDetail/:id",
    component: referral_officerDetail,
    name: "referral_officerDetail",
    meta: { title: "查看详情", foot: true }
  },
  //抢团
  { path: "/grabGroupHome", component: grab_group_home, name: "grab_group_home", meta: { title: "抢团", foot: false } },
  { path: "/grabGroupMy", component: grab_group_my, name: "grab_group_my", meta: { title: "我的抢团", foot: true } },
  {
    path: "/grabGroup_myRecord",
    component: grab_group_my_record,
    name: "grab_group_my_record",
    meta: { title: "我的抢团", foot: true }
  },
  {
    path: "/grabGroupReward",
    component: grab_group_reward,
    name: "grab_group_reward",
    meta: { title: "我的抢团", foot: true }
  },

  // /grabGroup_detail/:id (id为团长id)
  {
    path: "/grabGroup_detail/:id",
    component: grabGroup_detail,
    name: "grabGroup_detail",
    meta: { title: "抢团详情", foot: true }
  },

  //爱心值排行榜
  { path: "/member/loveRanking", component: loveRanking, name: "loveRanking", meta: { title: "爱心值排行榜", foot: true } },

  //拼单
  // {
  //   path: "/member/collage/collageReportform",
  //   component: collageReportform,
  //   name: "collageReportform",
  //   meta: { title: "收入报表", foot: true, notKeepAlive: true }
  // },
  // {
  //   path: "/member/collage/collageIndex",
  //   component: collageIndex,
  //   name: "collageIndex",
  //   meta: { title: "拼单", foot: true }
  // },
  // {
  //   path: "/member/collage/collageRegionBonus",
  //   component: collageRegionBonus,
  //   name: "collageRegionBonus",
  //   meta: { title: "拼单", foot: true }
  // },

  // //拼单——非会员
  // {
  //   path: "/member/collage/tacitApply",
  //   component: tacitApply,
  //   name: "tacitApply",
  //   meta: { title: "会员申请", foot: true, notKeepAlive: true }
  // },
  // {
  //   path: "/member/collage/tacitAddproject",
  //   component: tacitAddproject,
  //   name: "tacitAddproject",
  //   meta: { title: "添加项目", foot: true, notKeepAlive: true }
  // },
  // {
  //   path: "/member/collage/tacitDetproject",
  //   component: tacitDetproject,
  //   name: "tacitDetproject",
  //   meta: { title: "项目详情", foot: true, notKeepAlive: true }
  // },
  // {
  //   path: "/member/collage/tacitEditproject",
  //   component: tacitEditproject,
  //   name: "tacitEditproject",
  //   meta: { title: "修改项目", foot: true, notKeepAlive: true }
  // },

  // //拼单——等级创始人
  // {
  //   path: "/member/collage/founderCollage",
  //   component: founderCollage,
  //   name: "founderCollage",
  //   meta: { title: "拼单", foot: true }
  // },
  // {
  //   path: "/member/collage/founderEchievement",
  //   component: founderEchievement,
  //   name: "founderEchievement",
  //   meta: { title: "业绩榜单", foot: true, notKeepAlive: true }
  // },
  // {
  //   path: "/member/collage/founderTeam",
  //   component: founderTeam,
  //   name: "founderTeam",
  //   meta: { title: "我的团队", foot: true, notKeepAlive: true }
  // },
  // {
  //   path: "/member/collage/founderSinglepool",
  //   component: founderSinglepool,
  //   name: "founderSinglepool",
  //   meta: { title: "拼单池", foot: true, notKeepAlive: true }
  // },
  // {
  //   path: "/member/collage/founderBicycle",
  //   component: founderBicycle,
  //   name: "founderBicycle",
  //   meta: { title: "拼单车", foot: true, notKeepAlive: true }
  // },

  //区域代理
  {
    path: "/member/regionalAgent",
    component: regionalAgent,
    name: "regionalAgent",
    meta: { title: "区域代理", foot: true }
  },
  {
    path: "/member/regionalAgentResult",
    component: regionalAgentResult,
    name: "regionalAgentResult",
    meta: { title: "查询结果", foot: true }
  },
  {
    path: "/member/regionalAgentSearch",
    component: regionalAgentSearch,
    name: "regionalAgentSearch",
    meta: { title: "搜索区域", foot: true }
  },

  {
    path: "/community_solitaire/:id",
    component: community_solitaire,
    name: "community_solitaire",
    meta: { title: "社群接龙", foot: true }
  },
  {
    path: "/newDrawIndex/:id",
    component: newDrawIndex,
    name: "newDrawIndex",
    meta: { title: "抽奖活动", foot: true }
  },
  {
    path: "/lottery_complaint/:id",
    component: lottery_complaint,
    name: "lotteryComplaint",
    meta: { title: "抽奖投诉", foot: true }
  },
  {
    path: "/winners_list/:id/:num",
    component: winners_list,
    name: "winnersList",
    meta: { title: "中奖名单", foot: true }
  },
  {
    path: "/mydraw",
    component: mydraw,
    name: "mydraw",
    meta: { title: "我的抽奖", foot: false }
  },
  {
    path: "/lucky_draw/:tag?/:index?",
    component: lucky_draw,
    name: "luckyDraw",
    meta: { title: "抽奖活动", foot: false }
  },
  {
    path: "/newDrawMyPrize",
    component: newDrawMyPrize,
    name: "newDrawMyPrize",
    meta: { title: "我的奖品", foot: true }
  },
  {
    path: "/newDrawRecommentReward",
    component: newDrawRecommentReward,
    name: "newDrawRecommentReward",
    meta: { title: "中奖推荐奖励", foot: true }
  },
  {
    path: "/newDrawPayment",
    component: newDrawPayment,
    name: "newDrawPayment",
    meta: { title: "支付", foot: true }
  },

  //业绩区域奖励
  {
    path: "/member/regionalAwards",
    component: regionalAwards,
    name: "regionalAwards",
    meta: { title: "业绩区域奖励", foot: true }
  },
  {
    path: "/member/regionalAwardsRecord",
    component: regionalAwardsRecord,
    name: "regionalAwardsRecord",
    meta: { title: "奖励记录", foot: true }
  },

  //新团队分红
  { path: "/newTeamBonus", component: newTeamBonus, name: "newTeamBonus", meta: { title: "新团队分红", foot: true } },

  //看视频答题
  {
    path: "/videoAnswer",
    component: videoAnswer,
    name: "videoAnswer",
    meta: { title: "答题", foot: true, notKeepAlive: true }
  },

  { path: "/sharedPartner", component: sharedPartner, name: "sharedPartner", meta: { title: "共享合伙人", foot: false } },

  //蓝积分
  {
    path: "/member/integralBlueCattle",
    component: integralBlueCattle,
    name: "integralBlueCattle",
    meta: { title: "蓝积分", foot: true, notKeepAlive: true }
  },

  { path: "/lanLogin", component: lanLogin, name: "lanLogin", meta: { title: "跳转中", foot: true, notKeepAlive: true } },

  //我的市场
  {
    path: "/member/myMarket",
    component: myMarket,
    name: "myMarket",
    meta: { title: "我的市场", foot: true, notKeepAlive: true }
  },

  //星拼乐
  {
    path: "/member/starMusicIndex",
    component: starMusicIndex,
    name: "starMusicIndex",
    meta: { title: "星拼乐", foot: true }
  },
  {
    path: "/member/starMusicOpenGroup",
    component: starMusicOpenGroup,
    name: "starMusicOpenGroup",
    meta: { title: "开团", foot: true }
  },
  { path: "/member/starMusicMy", component: starMusicMy, name: "starMusicMy", meta: { title: "我的", foot: true } },
  {
    path: "/member/starMusicRewardsRecord",
    component: starMusicRewardsRecord,
    name: "starMusicRewardsRecord",
    meta: { title: "奖励记录", foot: true, notKeepAlive: true }
  },
  //   {
  //     path: "/member/starMusicEspNumber",
  //     component: starMusicEspNumber,
  //     name: "starMusicEspNumber",
  //     meta: { title: "星拼资格次数", foot: true, notKeepAlive: true }
  //   },
  {
    path: "/member/starMusicPersonalGroup",
    component: starMusicPersonalGroup,
    name: "starMusicPersonalGroup",
    meta: { title: "我的开团", foot: true }
  },
  {
    path: "/member/starMusicListGroup",
    component: starMusicListGroup,
    name: "starMusicListGroup",
    meta: { title: "开团列表", foot: true }
  },
  {
    path: "/member/starMusicGoodsDetails/:id",
    component: starMusicGoodsDetails,
    name: "starMusicGoodsDetails",
    meta: { title: "星拼团详情", foot: true }
  },
  {
    path: "/member/starMusicGroupDetails/:id",
    component: starMusicGroupDetails,
    name: "starMusicGroupDetails",
    meta: { title: "星拼团详情", foot: true }
  },

  //盲盒
  {
    path: "/member/blindBoxIndex",
    component: blindBoxIndex,
    name: "blindBoxIndex",
    meta: { title: "首页", foot: true }
  },
  {
    path: "/member/blindBoxDetail",
    component: blindBoxDetail,
    name: "blindBoxDetail",
    meta: { title: "抽奖", notKeepAlive: true }
  },
  {
    path: "/member/blindBoxHelping",
    component: blindBoxHelping,
    name: "blindBoxHelping",
    meta: { title: "助力", foot: true }
  },

  //商品分红
  {
    path: "/commodityDividends",
    component: commodityDividends,
    name: "commodityDividends",
    meta: { title: "商品分红", foot: true, notKeepAlive: true }
  },
  //安装服务 插件名：live-install
  {
    path: "/installationSeverApply",
    component: installationSeverApply,
    name: "installationSeverApply",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverExtension",
    component: installationSeverExtension,
    name: "installationSeverExtension",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverDividends/:active",
    component: installationSeverDividends,
    name: "installationSeverDividends",
    meta: { title: "分红记录", foot: true }
  },
  {
    path: "/installationSeverHome",
    component: installationSeverHome,
    name: "installationSeverHome",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverMemberHome",
    component: installationSeverHome,
    name: "installationSeverMemberHome",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverDetail/:id",
    component: installationSeverDetail,
    name: "installationSeverDetail",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverRefund/:id",
    component: installationSeverRefund,
    name: "installationSeverRefund",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverAftersale/:oid",
    component: installationSeverAftersale,
    name: "installationSeverAftersale",
    meta: { title: "安装服务", foot: true }
  },
  {
    path: "/installationSeverAfterApply/:id",
    component: installationSeverAfterApply,
    name: "installationSeverAfterApply",
    meta: { title: "售后申请", foot: true }
  },
  {
    path: "/installationSeverWrite/:take_sn",
    component: installationSeverWrite,
    name: "installationSeverWrite",
    meta: { title: "商家核销", foot: true }
  },
  {
    path: "/newRetail/index",
    component: newRetailIndex,
    name: "newRetailIndex",
    meta: { title: "新零售", foot: true }
  },
  {
    path: "/newRetail/Search/:type",
    component: newRetailSearch,
    name: "newRetailSearch",
    meta: { title: "", foot: true }
  },
  {
    path: "/newRetail/agencyPackage/:id",
    component: newRetail_agencyPackage,
    name: "newRetail_agencyPackage",
    meta: { title: "代理套餐", foot: true }
  },
  {
    path: "/newRetail/inventory",
    component: newRetailInventory,
    name: "newRetailInventory",
    meta: { title: "我的库存", foot: true, notKeepAlive: true }
  },
  {
    path: "/newRetail/retailLink/:id",
    component: newRetailRetailLink,
    name: "newRetailRetailLink",
    meta: { title: "我的库存", foot: true }
  },
  {
    path: "/newRetail/salesRecord",
    component: newRetailSalesRecord,
    name: "newRetailSalesRecord",
    meta: { title: "销售记录", foot: true }
  },
  {
    path: "/newRetail/salesRecord/datail/:id/:mode",
    component: newRetailSalesRecordDetail,
    name: "newRetailSalesRecordDetail",
    meta: { title: "销售记录", foot: true }
  },
  {
    path: "/newRetail/extension",
    component: newRetailSalesExtension,
    name: "newRetailSalesExtension",
    meta: { title: "", foot: true }
  },
  {
    path: "/newRetail/Inventory/Details/:gid/:optionId",
    component: newRetailInventoryDetails,
    name: "newRetailInventoryDetails",
    meta: { title: "", foot: true }
  },
  {
    path: "/stockDividend/extension",
    component: newRetailSalesExtension,
    name: "stockDividendExtension",
    meta: { title: "", foot: true }
  },

  // 社区门店
  {
    path: "/communityStore",
    component: communityStore,
    name: "communityStore",
    meta: { title: "", foot: false }
  },
  {
    path: "/communityStoreDetails",
    component: communityStoreDetails,
    name: "communityStoreDetails",
    meta: { title: "", foot: false }
  },

  //消费奖励
  {
    path: "/consumerRewardIndex",
    component: consumerRewardIndex,
    name: "consumerRewardIndex",
    meta: { title: "", foot: false, notKeepAlive: true }
  },
  {
    path: "/consumerRewardApply",
    component: consumerRewardApply,
    name: "consumerRewardApply",
    meta: { title: "", foot: false, notKeepAlive: true }
  },
  {
    path: "/consumerRewardRecord",
    component: consumerRewardRecord,
    name: "consumerRewardRecord",
    meta: { title: "领取记录", foot: false, notKeepAlive: true }
  },
  {
    path: "/consumerRewardPaySuccess",
    component: consumerRewardPaySuccess,
    name: "consumerRewardPaySuccess",
    meta: { title: "支付成功", foot: false, notKeepAlive: true }
  },

  //上级代付
  {
    path: "/superiorPaymentIndex/:order_id",
    component: superiorPaymentIndex,
    name: "superiorPaymentIndex",
    meta: { title: "上级代付", foot: false, notKeepAlive: true }
  },
  {
    path: "/superiorPaymentPay",
    component: superiorPaymentPay,
    name: "superiorPaymentPay",
    meta: { title: "上级代付", foot: false, notKeepAlive: true }
  },
  {
    path: "/superiorPaymentExtension",
    component: superiorPaymentExtension,
    name: "superiorPaymentExtension",
    meta: { title: "上级代付", foot: false }
  },
  {
    path: "/superiorPaymentDetails",
    component: superiorPaymentDetails,
    name: "superiorPaymentDetails",
    meta: { title: "上级代付", foot: false, notKeepAlive: true }
  },

  //广告投放
  { path: "/advertising/Apply", component: advertisingApply, name: "advertisingApply", meta: { title: "广告主申请", foot: true } },
  { path: "/advertising/Advertisers", component: advertisingAdvertisers, name: "advertisingAdvertisers", meta: { title: "广告主", foot: true } },
  { path: "/advertising/AdDetails/:id", component: advertisingAdDetails, name: "advertisingAdDetails", meta: { title: "广告主", foot: true, notKeepAlive: true } },
  { path: "/advertising/release", component: advertisingRelease, name: "advertisingRelease", meta: { title: "发布广告", foot: true, notKeepAlive: true } },
  { path: "/advertising/list/:tag/:id?", component: advertisingList, name: "advertisingList", meta: { title: "广告列表", foot: true } },
  { path: "/advertising/put/:tag/:id", component: advertisingPutAD, name: "advertisingPutAD", meta: { title: "投放广告", foot: true, notKeepAlive: true } },
  { path: "/advertising/play/:tag/:id/:aid/:page", component: advertisingPlayPage, name: "advertisingPlayPage", meta: { title: "广告播放", foot: true, notKeepAlive: true } },

  //群拓客
  {
    path: "/member/gduIndex",
    component: gduIndex,
    name: "gduIndex",
    meta: { title: "", foot: false }
  },
  {
    path: "/member/gduEnterpriseDetails",
    component: gduEnterpriseDetails,
    name: "gduEnterpriseDetails",
    meta: { title: "", foot: false, notKeepAlive: true }
  },
  {
    path: "/member/gduEnterprisePoster/:id",
    component: gduEnterprisePoster,
    name: "gduEnterprisePoster",
    meta: { title: "", foot: true, notKeepAlive: true }
  },
  //订单导入
  {
    path: "/member/orderImportIndex",
    component: orderImportIndex,
    name: "orderImportIndex",
    meta: { title: "", foot: false }
  },
  {
    path: "/member/orderImportApply",
    component: orderImportApply,
    name: "orderImportApply",
    meta: { title: "", foot: true, notKeepAlive: true }
  },
  {
    path: "/cpsPage",
    component: cpsPage,
    name: "cpsPage",
    meta: { title: "聚合页", foot: false }
  },
  {
    path: "/cpsSearchPage",
    component: cpsSearchPage,
    name: "cpsSearchPage",
    meta: { title: "商品列表", foot: true }
  },
  {
    path: "/cpsGoodDetail",
    component: cpsGoodDetail,
    name: "cpsGoodDetail",
    meta: { title: "商品详情", foot: true }
  },
  // 聚合cps中转页
  {
    path: "/cpsTransfer",
    component: cpsTransfer,
    name: "cpsTransfer",
    meta: { title: "", foot: true }
  },

  {
    path: "/personRed",
    component: personRed,
    name: "personRed",
    meta: { title: "红包雨", foot: true }
  },
  {
    path: "/independenceBalance/:store_id",
    component: independenceBalance,
    name: "independenceBalance",
    meta: { title: "余额", foot: false }
  },
  {
    path: "/storeBalanceDetail/:store_id",
    component: storeBalanceDetail,
    name: "storeBalanceDetail",
    meta: { title: "余额明细", foot: false }
  },
  {
    path: "/personRedList",
    component: personRedList,
    name: "personRedList",
    meta: { title: "个人记录", foot: true }
  },
  {
    path: "/personRedListDetail/:id",
    component: personRedListDetail,
    name: "personRedListDetail",
    meta: { title: "发放详情", foot: true }
  },
  {
    path: "/personRedPay",
    component: personRedPay,
    name: "personRedPay",
    meta: { title: "支付", foot: true }
  },
  {
    path: "/personRedissue",
    component: personRedissue,
    name: "personRedissue",
    meta: { title: "发红包", foot: true }
  },
  {
    path: "/personRedrecord/:id",
    component: personRedrecord,
    name: "personRedrecord",
    meta: { title: "领取记录", foot: true }
  },
  {
    path: "/commissionExtra/index",
    component: r => require(["../views/extension/commission-extra/index"], r),
    name: "commissionExtraIndex",
    meta: { title: "", foot: true, notKeepAlive: true }
  },

  //商品详情新优化
  {
    path: "/goodsComment/:gid/:istype?",
    component: goodsComment,
    name: "goodsComment",
    meta: { title: "", foot: true }
  },

  {
    path: "/groupWork/index/:id?",
    component: r => require(["../views/goods/group-work/index"], r),
    name: "groupWorkIndex",
    meta: { title: "拼团活动", foot: true }
  },
  {
    path: "/groupWork/my",
    component: r => require(["../views/goods/group-work/my_group-work"], r),
    name: "groupWorkMy",
    meta: { title: "我的拼团", foot: true }
  },
  {
    path: "/groupWork/detail/:aid/:id",
    component: r => require(["../views/goods/group-work/detail"], r),
    name: "groupWorkDetail",
    meta: { title: "拼团详情", foot: true }
  },
  {
    path: "/workWechatSidebar",
    component: workWechatSidebar,
    name: "workWechatSidebar",
    meta: { title: "会员详情", foot: false }
  },
  {
    path: "/workWechatSidebar/index",
    component: sidebarIndex,
    name: "sidebarIndex",
    meta: { title: "商城", foot: false }
  },
  {
    path: "/workWechatSidebar/sideOrderdetail/:order_id/:orderType?",
    component: sidebarOrderDetail,
    name: "sideOrderdetail",
    meta: {
      title: "订单详情",
      foot: true
    }
  },
  {
    path: "/offlineInvestment/index/:id",
    component: r => require(["../views/others/offline_investment/index"], r),
    name: "offlineInvestmentIndex",
    meta: { title: "线下招商会", foot: true }
  },
  {
    path: "/offlineInvestment/extension",
    component: r => require(["../views/others/offline_investment/extension"], r),
    name: "offlineInvestmentExtension",
    meta: { title: "线下招商会", foot: true }
  },
  {
    path: "/prizePool",
    component: prizePool,
    name: "prizePool",
    meta: { title: "奖金池", foot: true }
  },

  //捐赠项目
  {
    path: "/donationProjectIndex",
    component: donationProjectIndex,
    name: "donationProjectIndex",
    meta: { title: "捐赠查询", foot: false }
  },
  {
    path: "/donationProjectList",
    component: donationProjectList,
    name: "donationProjectList",
    meta: { title: "公示页捐赠项目详情", foot: false }
  },
  {
    path: "/donationProjectSearch",
    component: donationProjectSearch,
    name: "donationProjectSearch",
    meta: { title: "捐赠信息查询", foot: true }
  },
  {
    path: "/donationProjectPicture",
    component: donationProjectPicture,
    name: "donationProjectPicture",
    meta: { title: "捐赠项目图片详情", foot: false, notKeepAlive: true }
  },
  {
    path: "/donationProjectVideo",
    component: donationProjectVideo,
    name: "donationProjectVideo",
    meta: { title: "捐赠项目视频详情", foot: false, notKeepAlive: true }
  },
  {
    path: "/donationProjectDetails",
    component: donationProjectDetails,
    name: "donationProjectDetails",
    meta: { title: "个人捐赠详情", foot: false }
  },
  {
    path: "/donationProjectInfo",
    component: donationProjectInfo,
    name: "donationProjectInfo",
    meta: { title: "个人捐赠详情", foot: false, notKeepAlive: true }
  },
  {
    path: "/teamOdd/dividend",
    component: r => require(["../views/extension/other/team_odd_dividend"], r),
    name: "teamOddDividend",
    meta: { title: "团队单数分红", foot: true }
  },
  {
    path: "/selfPickupPoint/select/:tag/:deliverId?",
    component: r => require(["../views/member/self_carry/select_selfPickupPoint"], r),
    name: "selectSelfPickupPoint",
    meta: { title: "选择自提点", foot: true }
  },
  {
    path: "/gratitudeRewardIndex",
    component: gratitudeRewardIndex,
    name: "gratitudeRewardIndex",
    meta: { title: "感恩奖", foot: true }
  },
  {
    path: "/storeManagement/Index",
    component: storeManagementIndex,
    name: "storeManagementIndex",
    meta: { title: "店铺助手", foot: true }
  },
  {
    path: "/storeManagement/storeGoodsManagement",
    component: storeGoodsManagement,
    name: "storeGoodsManagement",
    meta: { title: "商品管理", foot: true }
  },
  {
    path: "/storeManagement/releaseStoreGoods/:id?",
    component: releaseStoreGoods,
    name: "releaseStoreGoods",
    meta: { title: "商品发布", foot: true }
  },
  {
    path: "/storeManagement/storeGoodsCatgory",
    component: storeGoodsCatgory,
    name: "storeGoodsCatgory",
    meta: { title: "商品分类", foot: true }
  },
  {
    path: "/storeManagement/editGoodsCatgory/:id?",
    component: editGoodsCatgory,
    name: "editGoodsCatgory",
    meta: { title: "编辑分类", foot: true }
  },
  {
    path: "/storeManagement/addGoodsCatgory/:parentId?",
    component: editGoodsCatgory,
    name: "addGoodsCatgory",
    meta: { title: "添加分类", foot: true }
  },
  {
    path: "/storeManagement/memberManagement",
    component: memberManagement,
    name: "memberManagement",
    meta: { title: "会员管理", foot: true }
  },
  {
    path: "/storeManagement/storeMemberInfo/:id",
    component: storeMemberInfo,
    name: "storeMemberInfo",
    meta: { title: "会员详情", foot: true }
  },
  {
    path: "/storeManagement/storeIntegralList/:id?",
    component: storeIntegralList,
    name: "storeIntegralList",
    meta: { title: "积分明细", foot: true }
  },
  {
    path: "/storeManagement/storeBalanceList/:id?",
    component: storeBalanceList,
    name: "storeBalanceList",
    meta: { title: "余额明细", foot: true }
  },
  {
    path: "/storeManagement/storeCouponList/:id?",
    component: storeCouponList,
    name: "storeCouponList",
    meta: { title: "优惠券", foot: true }
  },
  {
    path: "/storeManagement/financeManagement",
    component: financeManagement,
    name: "financeManagement",
    meta: { title: "财务管理", foot: true }
  },
  {
    path: "/storeManagement/withdrawalList",
    component: withdrawalList,
    name: "withdrawalList",
    meta: { title: "提现记录", foot: true }
  },
  {
    path: "/storeManagement/withdrawalDetail/:id",
    component: withdrawalDetail,
    name: "withdrawalDetail",
    meta: { title: "提现详情", foot: true }
  },
  {
    path: "/order/fullPackage",
    component: r => require(["../views/goods/full_package"], r),
    name: "orderullPackage",
    meta: { title: "满额包邮", foot: true }
  },
  {
    path: "/gdt/reward",
    component: r => require(["../views/extension/other/gdt_reward"], r),
    name: "gdtReward",
    meta: { title: "广告返利", foot: true }
  },
  {
    path: "/DonateIndex",
    component: DonateIndex,
    name: "DonateIndex",
    meta: { title: "债权人绑定债务人", foot: true }
  },
  {
    path: "/warehouseFarm/index",
    component: r => require(["../views/dev-plug/warehouse-farm/index"], r),
    name: "warehouseFarmIndex",
    meta: { title: "圈仓", foot: true }
  },
  {
    path: "/warehouseFarm/giftList/:id?",
    component: r => require(["../views/dev-plug/warehouse-farm/buy-gift"], r),
    name: "warehouseFarmBuyGift",
    meta: { title: "买礼盒", foot: true }
  },
  {
    path: "/warehouseFarm/good/:id",
    component: r => require(["../views/dev-plug/warehouse-farm/goods"], r),
    name: "warehouseFarmGood",
    meta: { title: "买礼盒", foot: true }
  },
  {
    path: "/warehouseFarm/gift",
    component: r => require(["../views/dev-plug/warehouse-farm/gift"], r),
    name: "warehouseFarmGift",
    meta: { title: "送礼物", foot: true }
  },
  {
    path: "/warehouseFarm/create/:id",
    component: r => require(["../views/dev-plug/warehouse-farm/createGift"], r),
    name: "warehouseFarmCreate",
    meta: { title: "送礼物", foot: true }
  },
  {
    path: "/warehouseFarm/giftLog",
    component: r => require(["../views/dev-plug/warehouse-farm/giftLog"], r),
    name: "warehouseFarmGiftLog",
    meta: { title: "送礼物", foot: true }
  },
  {
    path: "/warehouseFarm/giftDetail/:mode?",
    component: r => require(["../views/dev-plug/warehouse-farm/giftDetail"], r),
    name: "warehouseFarmGiftDetail",
    meta: { title: "礼物详情", foot: true }
  },
  {
    path: "/warehouseFarm/extract",
    component: r => require(["../views/dev-plug/warehouse-farm/extract-gift"], r),
    name: "warehouseFarmExtract",
    meta: { title: "提礼物", foot: true }
  },
  {
    path: "/warehouseFarm/Inventory",
    component: r => require(["../views/dev-plug/warehouse-farm/Inventory"], r),
    name: "warehouseFarmInventory",
    meta: { title: "圈仓", foot: true }
  },
  {
    path: "/handwrittenEsign/esign/:id",
    component: r => require(["../views/dev-plug/handwrittenEsign/esign"], r),
    name: "handwrittenEsignIndex",
    meta: { title: "协议详情", foot: true, notKeepAlive: true }
  },
  {
    path: "/handwrittenEsign/log",
    component: r => require(["../views/dev-plug/handwrittenEsign/log"], r),
    name: "handwrittenEsignLog",
    meta: { title: "手签协议", foot: true }
  },
  {
    path: "/diyRormProve/index",
    component: r => require(["../views/dev-plug/diy-form-prove/index"], r),
    name: "diyRormProveIndex",
    meta: { title: "表单核销", foot: true }
  },
  {
    path: "/diyRormProve/:mode/:id",
    component: r => require(["../views/dev-plug/diy-form-prove/submit"], r),
    name: "diyRormProveSubmit",
    meta: { title: "自定义表单", foot: true, notKeepAlive: true }
  },
  {
    path: "/diyRormProve/log",
    component: r => require(["../views/dev-plug/diy-form-prove/log"], r),
    name: "diyRormProveLog",
    meta: { title: "核销记录", foot: true, notKeepAlive: true }
  },
  {
    path: "/diyRormProve/detail/:id",
    component: r => require(["../views/dev-plug/diy-form-prove/detail"], r),
    name: "diyRormProveDetail",
    meta: { title: "表单信息", foot: true, notKeepAlive: true }
  },
  {
    path: "/dealerTaskRewardIndex",
    component: dealerTaskRewardIndex,
    name: "dealerTaskRewardIndex",
    meta: { title: "", foot: true }
  },
  {
    path: "/dealerTaskRewardRecord",
    component: dealerTaskRewardRecord,
    name: "dealerTaskRewardRecord",
    meta: { title: "", foot: true }
  },
  {
    path: "/supplierDriver/:id/:code?",
    component: supplierDriver,
    name: "supplierDriver",
    meta: { title: "配送入口", foot: true }
  },
  {
    path: "/distributionEntrance",
    component: distributionEntrance,
    name: "distributionEntrance",
    meta: { title: "配送入口", foot: true }
  },
  {
    path: "/workWxFriendExtend",
    component: workWxFriendExtend,
    name: "workWxFriendExtend",
    meta: { title: "好友裂变", foot: true }
  },
  {
    path: "/workWxFriendExtend/friendRanking",
    component: friendRanking,
    name: "friendRanking",
    meta: { title: "好友裂变排行榜", foot: true }
  },
  {
    path: "/workWxFriendExtend/invitationRecord",
    component: invitationRecord,
    name: "invitationRecord",
    meta: { title: "邀请记录", foot: true }
  },
  {
    path: "/workWxFriendExtend/rewardRecord",
    component: friendRewardRecord,
    name: "friendRewardRecord",
    meta: { title: "奖励记录", foot: true }
  },
  {
    path: "/workWx/sopPushTask",
    component: sopPushTask,
    name: "sopPushTask",
    meta: { title: "推送详情", foot: true }
  },
  {
    path: "/workWx/sopTaskList",
    component: sopTaskList,
    name: "sopTaskList",
    meta: { title: "任务列表", foot: true }
  },
  {
    path: "/workWx/sopTaskDetail/:taskLog",
    component: sopTaskDetail,
    name: "sopTaskDetail",
    meta: { title: "任务详情", foot: true }
  },
  {
    path: "/brandResourcesIndex",
    component: brandResourcesIndex,
    name: "brandResourcesIndex",
    meta: { title: "品牌资源", foot: true }
  },
  {
    path: "/cardVoucherInfo/:order_id",
    component: cardVoucherInfo,
    name: "cardVoucherInfo",
    meta: { title: "卡密", foot: true }
  },
  {
    path: "/cloudPage",
    component: cloudPage,
    name: "cloudPage",
    meta: { title: "跳转中", foot: true }
  },
  {
    path: "/order/pay_back/:ids/:sn?/:is_cps?/:pageUrl?",
    component: payBack,
    name: "payBack",
    meta: { title: "支付成功", foot: true }
  },
  {
    path: "/workWx/speechLibrary",
    component: SpeechLibrary,
    name: "speechLibrary",
    meta: { title: "话术库", foot: true }
  },
  {
    path: "/timeAppointment_index",
    component: timeAppointment_index,
    name: "timeAppointment_index",
    meta: { title: "分时预约", foot: false }
  },
  {
    path: "/timeAppointment_search",
    component: timeAppointment_search,
    name: "timeAppointment_search",
    meta: { title: "分时预约", foot: true }
  },
  {
    path: "/timeAppointmentMy",
    component: timeAppointmentMy,
    name: "timeAppointmentMy",
    meta: { title: "分时预约", foot: true }
  },
  {
    path: "/timeAppointmentMylist/:status",
    component: timeAppointmentMylist,
    name: "timeAppointmentMylist",
    meta: { title: "分时预约", foot: true }
  },
  {
    path: "/AppointmentUserDe/:id",
    component: AppointmentUserDe,
    name: "AppointmentUserDe",
    meta: { title: "预约人员详情", foot: true }
  },
  {
    path: "/seePoint",
    component: seePoint,
    name: "seePoint",
    meta: { title: "见点奖励", foot: true }
  },
  {
    path: "/workWx/customerStatistic",
    component: customerStatistic,
    name: "customerStatistic",
    meta: { title: "数据统计", foot: true }
  },
  {
    path: "/workWx/memberRecordDetail/:id",
    component: memberRecordDetail,
    name: "memberRecordDetail",
    meta: { title: "访问记录", foot: true }
  },
  {
    path: "/workWx/wxWorkChatTransfer",
    component: wxWorkChatTransfer,
    name: "wxWorkChatTransfer",
    meta: { title: "", foot: true }
  },
  {
    path: "/bonusPoolsIndex",
    component: bonusPoolsIndex,
    name: "bonusPoolsIndex",
    meta: { title: "奖金池奖励", foot: true }
  },
  {
    path: "/bonusPoolsTeam",
    component: bonusPoolsTeam,
    name: "bonusPoolsTeam",
    meta: { title: "团队业绩值", foot: true }
  },
  {
    path: "/storeSign/:id",
    component: storeSign,
    name: "storeSign",
    meta: { title: "门店签到", foot: true }
  },
  {
    path: "/storeSignDetail",
    component: storeSignDetail,
    name: "storeSignDetail",
    meta: { title: "签到明细", foot: true }
  },
  {
    path: "/publicWelfareFund/index",
    component: publicWelfare,
    name: "publicWelfare",
    meta: { title: "爱心公益", foot: true }
  },
  {
    path: "/publicWelfareFund/donations",
    component: welfareDonations,
    name: "welfareDonations",
    meta: { title: "公益支出", foot: true }
  },
  {
    path: "/publicWelfareFund/record/:type",
    component: welfareRecord,
    name: "welfareRecord",
    meta: { title: "记录", foot: true }
  }
];
