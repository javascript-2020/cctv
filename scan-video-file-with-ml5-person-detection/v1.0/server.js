

        var fs      = require('fs');
        var fsp     = fs.promises;
        
        var dir       = 'D:/cctv/';
        
        require('http').createServer(request).listen(4000);
        console.log('http://localhost:4000/');
        
        async function request(req,res){
        
              if(req.url=='/read'){
                    var files   = await fsp.readdir(dir,{withFileTypes:true});
                    var json    = [];
                    files.forEach(file=>{
                    
                          if(file.isFile()){
                                var ext   = require('path').parse(file.name).ext.slice(1);
                                var f     = true;
                                switch(ext){
                                  case 'mp4'    : break;
                                  default       : f   = false;
                                }//switch
                                if(f){
                                      json.push(file.name);
                                }
                          }
                          
                    });
                    res.writeHead(200);
                    res.end(JSON.stringify(json));
                    return;
              }
              
              if(req.url=='/favicon.ico'){
                    res.writeHead(200,{'content-type':'image/png'});
                    var buf   = Buffer.from(favicon,'base64');
                    res.end(buf);
                    return;
              }
              
              if(req.url.startsWith('/video')){
                    var i       = req.url.indexOf('-');
                    var file    = req.url.slice(i+1);console.log(file);
                    var size    = fs.statSync(dir+file).size;console.log(size);
                    
                    var start   = 0;
                    var end     = size-1;
                    var range   = req.headers.range;
                    if(range){
                          [start,end]   = range.replace('bytes=','').split('-');
                          if(!end){
                                end     = size-1;
                          }
                          start   = parseInt(start);
                          end     = parseInt(end);
                    }
                    var length    = end-start+1;
                    var code      = 206;
                    if(length===size){
                          code    = 200;
                    }
                    var hdrs    = {
                          'content-range'     : `bytes ${start}-${end}/${size}`,
                          'accept-ranges'     : 'bytes',
                          'content-length'    : length,
                    };
                    res.writeHead(code,hdrs);
                    var stream    = fs.createReadStream(dir+file,{start,end});
                    stream.pipe(res);
                    return;
              }
              
              res.writeHead(200,{'content-type':'text/html'});
              var fd    = fs.createReadStream('index.html');
              fd.pipe(res);
              
        }//request
        
        
var favicon=
'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAeVJREFUSEvtlr'+
'9rFFEQx2fmvX2F3JIUB4FAKkt7GxsDsYm1TbAQIYUhYGFrpWB+QIoQMUXU0n/DKo1YaiNJZXukWW7x7t6bkTn2ybJs3IPb5YrkNQ'+
'tvZ/jsd/bNmy/CghYuiAuLBadp2s/zfD2E0Cciw8xh1kpovMZqjrX2wnt/DgB5Xb5z7h4zr3rvv6riFUT8KCKbAECzAuviEDE3xh'+
'x5798AgC/HWGsfMfOpiCwR0Q4aY56FED7NC40QRPztnNsYjUa/4l6EMvNd3SOiMySiV8x82CJ4kCTJw/F4/FMhClVhIrIWP8QY87'+
'lTcB1U4RG8y8zHbSvWQ1RVWlXcOhgR90XkZbm85YMW/3GrYO0sRPwjIneu65ApGABeAMD7tko9Szvegue6tWYpcYy5oaUmorbbqb'+
'HqnfSxTigA+CEi9//bx20rRsSBMWaLmbeZ+UkdvLO72jn3wDl3NRwOP9TBuyp1eSyuENFJFd6p4mgE1FZVlU8VFzPzi4j0G49jc4'+
'AOiO+9Xu9xlmWDGF54uoMQwvPCHOzpkLDGmKfMrMNiWaeLiEgTAxE1999tJyIBES+ttW8nk8m3an6h/J0ykiR5Xba3OsbSOmCapi'+
'HLsqmbbFjZdQ6zyLPF0y/WVzfJ6OL9zVP8Fyt+BruI5xiHAAAAAElFTkSuQmCC'
;

