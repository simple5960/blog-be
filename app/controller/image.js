const Controller = require('egg').Controller;
var http=require('http');
var fs=require('fs')
class ImageController extends Controller {
    async saveImage(){
        const {ctx,app}=this;
        const {imageURL,imageFileName}=ctx.request.body;
        //按照base64进行存储
        const res=await app.mysql.insert('images',{"imageURL":imageURL,'imageFileName':imageFileName});
        ctx.body={
            data:res.affectedRows
        }
        
    }
    async getImageList(){
        const {ctx,app}=this;
        const res=await app.mysql.select('images',{order: ['Id','desc']})
        ctx.body={
            data:res
        }
    }
    async deleteImage(){
        const {ctx,app}=this;
        const {imageFileName}=ctx.request.body;
        const res=await app.mysql.delete('images',{
            "imageFileName":imageFileName
        })
        ctx.body={
            data:res.affectedRows
        }
    }
}
module.exports = ImageController;
