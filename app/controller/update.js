// update table article set articleViewCount=2 where articleId=1'use strict';

const Controller = require('egg').Controller;

class UpdateController extends Controller 
{
    async updateArticleViewCount()
    {
        const {ctx,app}=this;
        const { articleId,articleViewCount}=ctx.request.body;
        const sql=`update  article set articleViewCount=${articleViewCount} where articleId=${articleId}`
        const res=await app.mysql.query(sql);
        const updateSuccess=res.affectedRows==1
        ctx.body={
            updateSuccess:updateSuccess
        }
    }
    async updateArticleLikeCount ()
    {
        const {ctx,app}=this;
        const { articleId,articleLikeCount}=ctx.request.body;
        const sql=`update  article set articleLikeCount=${articleLikeCount} where articleId=${articleId}`;
        const querySQL=`select articleLikeCount from article where articleId=${articleId}`;
        const res=await app.mysql.query(sql);
        const queryRes=await app.mysql.query(querySQL);
        const updateSuccess=res.affectedRows==1 
        ctx.body={
            updateSuccess:updateSuccess,
            likeCount:queryRes
        }
    }
    async updateArticleCommentAndCount ()
    {
        const {ctx,app}=this;
        const {articleId,commentDate,commentContent}=ctx.request.body;
        const updateArticleCommentCountSQL=`update article set articleCommentCount=(select count(*) as articleCommentCount from comment where articleId=${articleId})
        where articleId=${articleId}`
        const addArticleCommentSQL=
        `insert  comment (articleId,commentDate,commentContent)  values (${articleId},'${commentDate}','${commentContent}')`
        //先执行comment的添加再执行commentCount的更新
        await app.mysql.query(addArticleCommentSQL);
        const res=await app.mysql.query(updateArticleCommentCountSQL);
        const updateSuccess=res.affectedRows==1 
        ctx.body={
            updateSuccess:updateSuccess
        }
    }
    async updateCommentLikeCount()
    {
        const {ctx,app}=this;
        const {commentId,commentLikeCount}=ctx.request.body;
        const sql=`update comment set commentLikeCount=${commentLikeCount} where commentId=${commentId}`;
        const res=await app.mysql.query(sql);
        const updateSuccess=res.affectedRows==1;
        ctx.body={
            updateSuccess:updateSuccess
        }
    }
}
module.exports = UpdateController;
