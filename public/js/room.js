
$('document').ready(()=>{


    // Animation
    
    $('#side').on('click',function(){
        $('.side_bar').toggle();
    })
    
        console.log('ready')
        $('.head_messages').hide()
    
    $('.left').on('click',()=>{
        $('.left').css('background-color','#C0C0C0')
        $('.right').css('background-color','#FAFAFA')
        // $('.head_contacts').css('height','90vh')
        // $('.head_messages').css('height','0')
        // $('.head_contacts').fadeIn()
        // $('.head_messages').fadeOut();
        $('.head_contacts').show()
        $('.head_messages').hide()
    })
    
    $('.right').on('click',()=>{
        $('.right').css('background-color','#C0C0C0')
        $('.left').css('background-color','#FAFAFA')
        // $('.head_contacts').css('height','0')
        // $('.head_messages').css('height','90vh')
        // $('.head_contacts').fadeOut()
        // $('.head_messages').fadeIn()
        $('.head_contacts').hide()
        $('.head_messages').show()
    })
    
    
    
    // templates insertion contact
    
    
    
    const contacts = document.querySelector('.head_contacts')
    
    // PeerJs ----------------
    
    
        const socket = io();
        const myPeer = new Peer({host:'peerjs-server.herokuapp.com', secure:true, port:443})
        // var myPeer = new Peer({ config: {'iceServers': [
        //     { url: 'stun:stun.l.google.com:19302' },
        //     { url: 'turn:numb.viagenie.ca:3478', credential: 'muazkh', username:'web...@live.com' },
        //     { url: 'turn:numb.viagenie.ca', credential: 'muazkh', username:'web...@live.com' },
        //     { url: 'turn:192.158.29.39:3478?transport=udp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' },
        //     { url: 'turn:192.158.29.39:3478?transport=tcp', credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', username:'28224511:1379330808' }
        // ]}});
        
        const peers={};
        const calls={};
        const msg ={};
        const names ={}
        const list ={};
        var Myid;
    
        const Video = document.querySelector('#main_video')
        var UserStream;
        var videoOption = {width:640,height:480}
        navigator.mediaDevices.getUserMedia({video:videoOption,audio:{echoCancellation: true}}).then(stream=>{
            UserStream=stream
            Video.srcObject = UserStream;
    
            myPeer.on('call',call=>{
                
                call.answer(UserStream);
                const contTemp = document.querySelector('#cont_temp').innerHTML
                call.on('stream',userVideoStream=>{
                    if(checkStream(call.peer)){
                       addVideoStream(contTemp,userVideoStream,names[call.peer],call.peer)
                    }
                    else
                    refreshStream(call.peer,userVideoStream)
                })
                
                
            })
    
          
        })
    
        const checkStream = (peerId)=>{
            const tag = document.querySelector('#b'+peerId)
            console.log(tag)
            if(tag===null)
            return true
            return false
        }
    
        const refreshStream = (peerId,stream)=>{
            const peerVideo = document.querySelector('#b'+peerId)
            peerVideo.srcObject = stream;
            peerVideo.onloadedmetadata = peerVideo.play;
    
        }
    
        socket.on('user-connected',(userId,name)=>{
            names[userId]=name;
            connectToMsg(userId,myName)
            connectToNewUser(userId,UserStream);
        })
    
        socket.on('user-disconnected',userId=>{
            if(peers[userId]) peers[userId].close();
            if(msg[userId]) msg[userId].close();
            list[userId]=null;
            $('#b'+userId).parents('.contact_temp').remove()
        })
    
        //Main Video psuedo code
    
        
    
    
        const connectToNewUser = (userId,UserStream)=>{
            const call = myPeer.call(userId,UserStream)
            const contTemp = document.querySelector('#cont_temp').innerHTML
            call.on('stream',userVideoStream=>{
                if(checkStream(userId))
                addVideoStream(contTemp,userVideoStream,names[userId],userId)
                else
                refreshStream(userId,userVideoStream);
            })
            call.on('close',()=>{
                $('#b'+userId).parents('.contact_temp').remove()
            })
    
            peers[userId]=call;
        }
    
        const addVideoStream = async (temp,stream,name,uid)=>{
            
            if(name && stream!=undefined && list[uid]!=1){
            const html = Mustache.render(temp,{
                username:name,
                videoId:`b${uid}`
                
            })
    
            contacts.insertAdjacentHTML('beforeend',html)   
            try {
                document.querySelector('#b'+uid).srcObject= stream
                 document.querySelector('#b'+uid).onloadedmetadata = function(e){
                     document.querySelector('#b'+uid).play()
                 }
                 list[uid]=1;
    
               }
            catch(e)
            {
    
            }
            
        }
            
        }
    
    
    
    
        // bottom icon bar 
    
        const mic = document.querySelector('.mic')
        const cam = document.querySelector('.camera')
        const disconnect = document.querySelector('.disconnect')
    
        mic.onclick = ()=>{
            UserStream.getAudioTracks()[0].enabled = !(UserStream.getAudioTracks()[0].enabled);
            // video.srcObject = UserStream
        }
        cam.onclick=()=>{
            UserStream.getVideoTracks()[0].enabled = !(UserStream.getVideoTracks()[0].enabled);
        }
        disconnect.onclick = ()=>{
            if(confirm('close window'))
            {
                window.open('/home','_self');
                window.close()
            }
        }
    
        myPeer.on('open',id=>{
            Myid=id;
            socket.emit('join-room',id,roomId,myName)
        })
    
        
    
        const connectToMsg = (userId,name)=>{
            const conn = myPeer.connect(userId)
            conn.on('open',()=>{
                conn.send({
                    type:'meta',
                    name:name
                })
            })
            msg[userId]=conn;
        }
    
        myPeer.on('connection',(conn)=>{
    
            if(msg[conn.peer]==null)
            connectToMsg(conn.peer,myName)
    
            conn.on('data',(data)=>{
                switch(data.type){
                    case 'meta':names[conn.peer]=data.name;
                                sendResponse(conn.peer);
                                break;
                    case 'response':connectToNewUser(conn.peer,UserStream);break;
                    case 'msg':sendMsg(names[conn.peer],data.msg)
                                break;
                    case 'image':sendImg(names[conn.peer],data.fileType,data.file,data.fileName);
                                break;
                        default:sendFile(names[conn.peer],data.fileType,data.file,data.fileName);
                        break;
                }
            })
        })
        const sendResponse = (userId)=>{
            msg[userId].send({
                type:'response'
            })
        }
    
        // sending text msg
    
        const textMsg = document.querySelector('.text');
        const msgTemp = document.querySelector('#msg_temp_text').innerHTML
        const imgTemp = document.querySelector('#msg_temp_img').innerHTML
        const fileTemp = document.querySelector('#msg_temp_file').innerHTML
    
        const messages = document.querySelector('.head_messages');
    
        const send = document.querySelector('#msg')
    
        send.onclick = ()=>{
    
            sendMsg(myName,textMsg.value);
            for(let key in msg)
            {
                if(msg.hasOwnProperty(key)){
                value=msg[key];
                value.send({
                    type:'msg',
                    msg:textMsg.value
                })
                }
            }
            textMsg.value='';
        }
    
        socket.on('presenting',userId=>{
            peers[userId].close();
            list[userId]=null;
            document.querySelectorAll('#b'+userId).forEach(video=>$(video).parents('#contact_temp').remove())
        })
    
    
        $('#present').on('click',async ()=>{
            let captureStream = null;
            try{
                captureStream = await navigator.mediaDevices.getDisplayMedia();
            }
            catch(e)
            {
                console.log('error',e);
            }
            UserStream.removeTrack(UserStream.getVideoTracks()[0])
            UserStream.addTrack(captureStream.getVideoTracks()[0])
    
            socket.emit('present',Myid);
            for(let key in msg)
            {
                if(msg.hasOwnProperty(key)){
                value=msg[key];
                peers[value.peer].close();
                list[value.peer]=null;
                connectToNewUser(value.peer,UserStream);
                }
            }
        })
    
        const sendMsg = (name,message)=>{
        const html  = Mustache.render(msgTemp,{
            username:name,
            createdAt:moment().format('h:mm a'),
            message:message
        })
    
        messages.insertAdjacentHTML('beforeend',html);
        $('.head_messages').scrollTop($('.head_messages').height())
    
        }
    
        const sendImg = (name,type,file,fileName)=>{
            const bytes = new Uint8Array(file);
            const blob = new Blob([bytes],{type:type})
            const url = URL.createObjectURL(blob)
            const html = Mustache.render(imgTemp,{
                username:name,
                createdAt:moment().format('h:mm a'),
                src:url
            })
    
            messages.insertAdjacentHTML('beforeend',html)
            $('.head_messages').scrollTop($('.head_messages').height())
    
        }
    
        const sendFile = (name,type,file,fileName)=>{
            const bytes = new Uint8Array(file);
            const blob = new Blob([bytes],{type:type})
            const url = URL.createObjectURL(blob)
            const html = Mustache.render(fileTemp,{
                username:name,
                createdAt:moment().format('h:mm a'),
                href:url,
                fileName:fileName,
                downloadName:fileName
            })
            messages.insertAdjacentHTML('beforeend',html)
            $('.head_messages').scrollTop($('.head_messages').height())
    
        }
    
    const fileSend = document.querySelector('#file-upload')
    fileSend.onchange = ()=>{
        const file = fileSend.files[0]
        if(file.type.includes('image'))
        {
            for(let key in msg)
            {
                if(msg.hasOwnProperty(key)){
                value=msg[key];
                value.send({
                    type:'image',
                    fileType:file.type,
                    file:file,
                    fileName:file.name
                })
                }
            }
        }
        else
        {
            for(let key in msg)
            {
                if(msg.hasOwnProperty(key)){
                value=msg[key];
                value.send({
                    type:"file",
                    fileType:file.type,
                    file:file,
                    fileName:file.name,
                })
                }
            }
        }
    }
    
    })
    
    let tempId;
    function test(e){
       const temp = e.querySelector('video').srcObject
       e.querySelector('video').srcObject=document.getElementById('main_video').srcObject;
       document.getElementById('main_video').srcObject=temp;
       const tempName = $('#presenter').text()
       $('#presenter').text($(e).find('.name').text()+" ")
       $(e).find('.name').text(tempName+" ")
       if(tempId)
       {
           const temp = e.querySelector('video').id;
           e.querySelector('video').id =tempId;
           tempId = temp;
       }
       else
       {
           tempId = e.querySelector('video').id
       }
    }
    