'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx,app } = this;
    ctx.body = 'hello world';
    
  }
  async login()
  {
    const { ctx,app } = this;
    let token;
    const {userName,userPassword}=ctx.request.body;
    const res=await app.mysql.select('users',{
      where:{userName:userName,userPassword:userPassword}
    })
    if(res.length)
    {
      token=`simpleBlogSystemLogin${new Date().getTime()}`.split("").sort(function(){return 0.5 - Math.random()}).join("")
      ctx.session.token=token
      ctx.cookies.set("token", token, {
        httpOnly: true, // 默认就是 true
        path:'/',
        maxAge: 0.5 * 3600 * 1000,//有效时间 30分钟
        signed:false,
        });

    }
    ctx.body={
      res:res.length,
      token:token
    }
  }
  async getArticleList()
  {
    const {ctx,app}=this;
    const sql=
    `
    select * from article a  join typeTable t
    on a.articleTypeId=t.typeId order by articleDate desc
    `
    let res=await app.mysql.query(sql)
    ctx.body=res
  }
  async getCommentListByArticleId()
  {
    const {ctx,app}=this;
    const {articleId}=ctx.request.query;
    const sql=
    `
    select * from article a join comment c on a.articleId=c.articleId where a.articleId=${articleId} order by c.commentDate desc
    `
    const res=await app.mysql.query(sql);
    ctx.body={
      res:res
    }
  }
  async deleteArticle()
  {
    const {ctx,app}=this;
    const {articleId}=ctx.request.body
    let res=await app.mysql.delete('article',{'articleId':articleId})
    const deleteSuccess=res.affectedRows==1
    ctx.body={
      deleteSuccess:deleteSuccess
    }
  }
  async getEditArticleDetail()
  {
    const {ctx,app}=this;
    const articleId=ctx.params.articleId
    const sql=
    `
    select articleTitle,typeName,articleTypeId,articleContent from article a join typeTable t
    on a.articleTypeId=t.typeId where articleId=${articleId}
    `
    const res=await app.mysql.query(sql);
    ctx.body={
      res
    }
  }
  async changeArticle()
  {
    const {ctx,app}=this;
    const {articleTitle,articleTypeId,articleContent,articleDate,articleId}=ctx.request.body.data;
    const row=
    {
      articleTitle:articleTitle,
      articleTypeId:articleTypeId,
      articleContent:articleContent,
      articleDate:articleDate
    }
    const res=app.mysql.update('article',row,{
      where: {
        articleId: articleId
      }
    });
    const updateSuccess=res.affectedRows==1
    ctx.body={
      res:res,
      updateSuccess:!updateSuccess
    }
  }
  async getTypeList()
  {
    const {ctx,app}=this;
    //如果不用left join的话,一个类型没有对应文章这个类型就不会被选出来,但是这里选出来的结果为1
    //如果用left join的话,选出来没有对应文章的类型的结果就是0
    const sql=
    `
    select typeId,typeName,count(articleId) as typeArticleCount from typeTable  
    left outer join article on typeTable.typeId=article.articleTypeId
    group by typeId
    `
    let res=await app.mysql.query(sql)
    ctx.body=res
  }
  async getArticleById()
  {
    const {ctx,app}=this;
    const { articleId}=ctx.request.query;
    const sql=
    `select * from article a join typeTable t on a.articleTypeId=t.typeId 
    where articleId=${articleId}`
    const res=await app.mysql.query(sql)
    ctx.body={
      res
    }
  }
  async getArticleListByTypeId()
  {
    const {ctx,app}=this;
    const { typeId}=ctx.request.query;
    const sql=`select * from article a join typeTable t
    on a.articleTypeId=t.typeId where typeId=${typeId}`
    const res=await app.mysql.query(sql);
    ctx.body={
      data:res
    }
  }
  async getArticleListByPage()
  {
    
    const {ctx,app}=this;
    const {currentPage,pageSize}=ctx.request.body;
    let start=0;
    if(currentPage==1)
    {
      start=0;
    }
    else
    {
      start=(currentPage-1)*pageSize
    }
    let sql=
    `
    select * from article a join typeTable t on a.articleTypeId=t.typeId order by a.articleDate desc limit ${pageSize} offset ${start}
    `
    const res=await app.mysql.query(sql);
    ctx.body={
      data:res
    }
  }
  async getArticleListByTypeIdAndPage()
  {
    const {ctx,app}=this;
    const {currentPage,pageSize,typeId}=ctx.request.body;
    let start=0;
    if(currentPage==1)
    {
      start=0;
    }
    else
    {
      start=(currentPage-1)*pageSize
    }
    const sql=
    `select * from article a join typeTable t on a.articleTypeId=t.typeId where t.typeId=${typeId} order by a.articleDate desc limit ${pageSize} offset ${start}`
    const res=await app.mysql.query(sql);
    ctx.body={
      data:res
    }
  }
  async addType()
  {
    const {ctx,app}=this;
    const typeName=ctx.request.body.typeName;
    const res=await app.mysql.insert('typeTable',{"typeName":typeName});
    const deleteSuccess=res.affectedRows==1
    ctx.body={
      res:res,
      deleteSuccess:deleteSuccess
    }
  }
  async deleteType()
  {
    const {ctx,app}=this;
    const typeName=ctx.request.body.typeName;
    const res=await app.mysql.delete('typeTable',{"typeName":typeName});
    const deleteSuccess=res.affectedRows==1
    ctx.body={
      res:res,
      deleteSuccess:deleteSuccess
    }
  }
  async addArticle()
  {
    const {ctx,app}=this;
    // console.log(ctx.request.header.cookie.split(';')[0].split('=')[1]);
    // console.log(ctx.session.token);
    const {articleTitle,articleTypeId,articleContent,articleDate}=ctx.request.body;
      const res=await app.mysql.insert('article',{
        'articleTitle':articleTitle,
        'articleTypeId':articleTypeId,
        'articleContent':articleContent,
        'articleDate':articleDate
      })
      const insertSuccess=res.affectedRows==1
      ctx.body={
        insertSuccess:insertSuccess
      }
  }
}

module.exports = HomeController;
