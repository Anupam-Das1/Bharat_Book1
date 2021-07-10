if(process.env.NODE_ENV==='production'){
    module.exports=require('./prod')
}else{
    module.exports=require('./dev')
}
// "mongodb+srv://AnupamDas:Anupam@433454@cluster0.xxg6e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// "abcdef"