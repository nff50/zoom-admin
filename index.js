const express = require('express');
var request = require('request');
var cookieParser = require('cookie-parser')
const app = express();
app.set("view engine", "ejs")
app.use(cookieParser());
app.get("/re-auth",(req,res)=>{
  res.redirect("https://zoom.us/oauth/authorize?response_type=code&client_id=LQkuOUuETsmTmdqnVdUpA&redirect_uri=https%3A%2F%2Fzoom-admin--nff50.repl.co%2Fredirect")
})
app.get('/redirect', (req, res) => {
  var code = req.query.code

    var options = {
      method: 'POST',
      url: 'https://zoom.us/oauth/token',
      qs: {
        grant_type: 'authorization_code',
       
        code: code,

        redirect_uri: 'https://zoom-admin--nff50.repl.co/redirect',
      },
      headers: {
        
        Authorization: 'Basic ' + Buffer.from(process.env['ac_id'] + ':' + process.env['ac_secret']).toString('base64'),

      },
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      if (!JSON.parse(body).access_token) {
        res.send("Invalid code / no access token")

      } else {

        res.cookie("access-token", JSON.parse(body).access_token)
        res.redirect("/")

      }
    });
  



});
app.get("/", (req,res) => {
request({ method: "GET",
         url: "https://api.zoom.us/v2/users/me", 
       headers: {
         Authorization: "Bearer "+req.cookies["access-token"]
       }
        },function(err,resp,body){
    if(err) throw new Error(err);
  var body_ = JSON.parse(body)
if(body_.code == 124){
    res.redirect("/re-auth")
  }else{
  
  
  
  res.cookie("id", body_.id)
  res.cookie("account_id", body_.account_id)
  request({ method: "GET",
         url: "https://api.zoom.us/v2/users/"+body_.id+"/meetings", 
       headers: {
         Authorization: "Bearer "+req.cookies["access-token"]
       }
        },function(err,resp,bod){
    if(err) throw new Error(err);
  var _body = JSON.parse(bod)
if(_body.code == 124){
  res.redirect("/re-auth")
}else{
  console.log(_body)
res.render("index", {full_name:body_.first_name+" "+body_.last_name, display_name: body_.display_name, id: body_.id, account_id: body_.account_id, email: body_.email, meetings: _body.meetings, live:false, a:[],access:req.cookies["access-token"]})

}
})
  

//    request({ method: "GET",
//          url: "https://api.zoom.us/v2/meetings/"+_body.meetings[0].id, 
//        headers: {
//          Authorization: "Bearer "+req.cookies["access-token"]
//        }
//         },function(err,resp,bo){
//     if(err) throw new Error(err);
//   var boo_ = JSON.parse(bo)
//     console.log(_body)
// res.json(boo_)
  
// })
         }
})

  });
app.get("/live", (req,res) => {
request({ method: "GET",
         url: "https://api.zoom.us/v2/users/me", 
       headers: {
         Authorization: "Bearer "+req.cookies["access-token"]
       }
        },function(err,resp,body){
    if(err) throw new Error(err);
  var body_ = JSON.parse(body)
if(body_.code == 124){
    res.redirect("/re-auth")
  }else{
  
  
  
  res.cookie("id", body_.id)
  res.cookie("account_id", body_.account_id)
  request({ method: "GET",
         url: "https://api.zoom.us/v2/users/"+body_.id+"/meetings?type=live", 
       headers: {
         Authorization: "Bearer "+req.cookies["access-token"]
       }
        },function(err,resp,bod){
    if(err) throw new Error(err);
  var _body = JSON.parse(bod)
    
if(_body.code == 124){
  res.redirect("/re-auth")
}else{
  console.log(_body)
res.render("index", {full_name:body_.first_name+" "+body_.last_name, display_name: body_.display_name, id: body_.id, account_id: body_.account_id, email: body_.email, meetings: _body.meetings, live:true, a:[], access: req.cookies["access-token"]})

}
})
  

//    request({ method: "GET",
//          url: "https://api.zoom.us/v2/meetings/"+_body.meetings[0].id, 
//        headers: {
//          Authorization: "Bearer "+req.cookies["access-token"]
//        }
//         },function(err,resp,bo){
//     if(err) throw new Error(err);
//   var boo_ = JSON.parse(bo)
//     console.log(_body)
// res.json(boo_)
  
// })
         }
})

  });
app.get('/home', (req, res) => {
  res.send('home!')
});


app.listen(3000, () => {
  console.log('server started');
});
