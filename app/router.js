'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  var adminauth = app.middleware.adminauth()
  router.get('/', controller.home.index);
  //根据pageSize和当前页数获取文章
  router.post('/getArticleListByPage',controller.home.getArticleListByPage)
  //根据pageSize和当前页数获取分类后的文章
  router.post('/getArticleListByTypeIdAndPage',controller.home.getArticleListByTypeIdAndPage)
  //获取文章列表
  router.get('/getArticleList', controller.home.getArticleList);
  //删除文章
  router.post('/deleteArticle',adminauth, controller.home.deleteArticle);
  //获取编辑文章的信息
  router.get('/getEditArticleDetail/:articleId',controller.home.getEditArticleDetail);
  //修改文章
  router.post('/changeArticle/:articleId',adminauth,controller.home.changeArticle);
  //获取文章类型列表
  router.get('/getTypeList', controller.home.getTypeList);
  //获取评论列表
  router.get('/getCommentListByArticleId', controller.home.getCommentListByArticleId);
  //获取分类文章
  router.get('/getArticleListByTypeId', controller.home.getArticleListByTypeId);
  //添加文章类型
  router.post('/addType',adminauth,controller.home.addType)
  router.post('/deleteType',adminauth,controller.home.deleteType)
  //添加(编辑)文章
  router.post('/addArticle',adminauth,controller.home.addArticle)
  //获取文章的具体信息
  router.get('/getArticleById',controller.home.getArticleById)
  //登录
  router.post('/login',controller.home.login)

  
  //update
  //更新文章的浏览量
  router.post('/updateArticleViewCount',controller.update.updateArticleViewCount);
  //更新文章的点赞量
  router.post('/updateArticleLikeCount',controller.update.updateArticleLikeCount);
  //更新文章的评论内容以及评论数量
  router.post('/updateArticleCommentAndCount',controller.update.updateArticleCommentAndCount);
  //更新评论的点赞量
  router.post('/updateCommentLikeCount',controller.update.updateCommentLikeCount);

  //image部分
  //保存图片
  router.post('/saveImage',controller.image.saveImage)
  //拿到图片列表
  router.get('/getImageList',controller.image.getImageList)
  //删除图片
  router.post('/deleteImage',controller.image.deleteImage)  
};
