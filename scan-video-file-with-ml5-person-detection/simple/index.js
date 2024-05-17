
                                                                                console.clear();
        var detector;
        var process       = true;
        var abort         = false;
        var step          = 1;
        var btn;
        var video;
        var dur;
        var bar;
        var time;
        var results;
        var item;
        
        window.onload=async function(){
              btn                           = $('[value=start]')
              btn.onclick                   = click;
              video                         = $('video');
              video.onloadedmetadata        = e=>dur   = video.duration;
              video.onseeked                = seeked;
              bar                           = $('#bar');
              time                          = $('#time');
              results                       = $('#results');
              item                          = $('#item');
              item.remove();
              detector                      = await ml5.objectDetector('cocossd');
              console.log(detector);
              video.src                     = '/video';
              $('h3').remove();
        }//onload
        
        function click(e){
              if(btn.value=='start'){
                    btn.value           = 'stop';
                    process             = true;
                    abort               = false;
                    video.currentTime   = 0;
                    results.replaceChildren();
              }else{
                    btn.value   = 'start';
                    abort       = true;
              }
        }//click
        
        function seeked(e){
              var t                 = video.currentTime;
              bar.style.width       = t/dur*100+'%';
              time.textContent      = t+' / '+dur;
              if(abort)return;
              if(!process)return;
              detector.detect(video,ondetected);
        }//onseeked
        
        function ondetected(error,detections){
              if(error)return console.error(error);
              detections.forEach(detection=>{
                    if(detection.label!='person')return;
                    var time                              = video.currentTime;
                    var nitem                             = item.cloneNode(true);
                    $(nitem,'#type').textContent          = detection.label;
                    $(nitem,'#confidence').textContent    = detection.confidence.toFixed(2);
                    $(nitem,'#time').textContent          = time;
                    $(nitem,'[value=view]').onclick       = e=>video.currentTime    = time;
                    results.append(nitem);
              });
              next();
        }//onDetected
        
        function next(){
              var t   = video.currentTime;
              if(t>=dur){
                    btn.value   = 'start';
                    process     = false;
                    return;
              }
              video.currentTime   = t+step;
        }//next
        
        function $(root,sel){
              if(!sel){
                    sel     = root;
                    root    = document;
              }
              return root.querySelector(sel);
        }//$
        
