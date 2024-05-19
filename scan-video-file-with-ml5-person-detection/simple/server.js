


        var file    = 'video.mp4';
        var port    = 4010;
        
        var fs      = require('fs');
        var size    = fs.statSync(file).size;
        
        require('http').createServer(request).listen(port);
        console.log(`http://localhost:${port}/`);
        
        function request(req,res){
        
              if(req.url=='/index.js'){
                    res.writeHead(200,{'content-type':'application/javascript'});
                    var fd    = fs.createReadStream('index.js');
                    fd.pipe(res);
                    return;
              }
              
              if(req.url=='/video'){
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
                    var stream    = fs.createReadStream(file,{start,end});
                    stream.pipe(res);
                    return;
              }
              
              res.writeHead(200,{'content-type':'text/html'});
              var fd    = fs.createReadStream('index.html');
              fd.pipe(res);
              
        }//request
        
        
