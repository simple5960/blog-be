module.exports = options =>{
    return async function adminauth(ctx,next){
        //判断传上来的cookie中的token和session中的token一样不
        if(ctx.request.header.cookie)
        {
            if(ctx.session.token==ctx.request.header.cookie.split(';')[0].split('=')[1]){
                await next()
            }
        }
        else{
            ctx.body={data:'没有登录'}
        }
    }
}