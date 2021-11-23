const { Console } = require('console');
var express = require('express');
var path = require('path');
var fs = require ('fs');
const { json } = require('express');
var app = express();
const session = require('express-session');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
}));

var number_users = JSON.parse(fs.readFileSync("number_users.json"));
var users = JSON.parse(fs.readFileSync("users.json"));
var users_book = JSON.parse(fs.readFileSync("users_book.json"));

var messLogin = false;


app.get('/login',function(req,res){
    res.redirect('/');
});
app.get('/',function(req,res){
  if(req.session.current_User!=null){
    res.redirect('/home');
    return;
  }
  if(!messLogin){
      res.render('login',{errormessage:null})}
  else{
    res.render('login',{errormessage:"You have to Login"})
    messLogin=false;
  }
   
});

app.get('/home',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  res.render('home');
});
app.post('/logout',function(req,res){
  req.session.current_User=null;
    res.redirect('/');
    return;

});

app.post('/',function(req,res){
  if(req.session.current_User!=null){
    res.redirect('/home');
    return;
  }
  var user_name = req.body.username;
  var user_password = req.body.password;
  var i ;
  for(i=0;i<number_users;i++){
    if(user_name==users[i].name && user_password==users[i].password){
      req.session.current_User = users[i];
      req.session.current_user_number=i;
      req.session.current_user_books=users_book[i];
      res.redirect('home');

      return;
    }
  }
  res.render('login',{errormessage:"Invalid username or password"});
  
});

app.get('/registration',function(req,res){
  if(req.session.current_User!=null){
    res.redirect('/home');
    return;
  }
  res.render('registration',{errormessage:null});
});
app.post('/register',function(req,res){
  if(req.session.current_User!=null){
    res.redirect('/home');
    return;
  }
  var user_name = req.body.username;
  var user_password = req.body.password;
  if(!(isUserNameValid( user_name))){
    res.render('registration',{errormessage:"Invalid Username"});
    return;
  }
  if(user_password.length<5){
    res.render('registration',{errormessage:"password is less than 5 character"});
    return;
  }
  for(i=0;i<number_users;i++){
    if(user_name==users[i].name){
      res.render('registration',{errormessage:"Username has been already user"});
      return;
    }
  }
  users[number_users]={'name': user_name,'password': user_password};
  users_book[number_users]={'flies':false,'grapes' :false, 'dune' :false, 'leaves' :false, 'sun' :false, 'mockingbird': false };
  number_users++;
  fs.writeFileSync("users.json",JSON.stringify(users));
  fs.writeFileSync("number_users.json",JSON.stringify(number_users));
  fs.writeFileSync("users_book.json",JSON.stringify(users_book));

  res.redirect('/');
});
app.get('/novel',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  res.render('novel');
});
app.get('/poetry',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  res.render('poetry');
});
app.get('/fiction',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  res.render('fiction');
});
app.get('/flies',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }

  if(req.session.current_user_books['flies']){
    res.render('flies',{message:"Remove from Want to Read List"});
  }
  else{
    res.render('flies',{message:"Add to Want to Read List"});

  }
});
app.post('/flies',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  req.session.current_user_books['flies']=!req.session.current_user_books['flies'];
  users_book[req.session.current_user_number]=req.session.current_user_books;
  fs.writeFileSync("users_book.json",JSON.stringify(users_book));

   res.redirect('/flies');

});

app.get('/dune',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }

  if(req.session.current_user_books['dune']){
    res.render('dune',{message:"Remove from Want to Read List"});
  }
  else{
    res.render('dune',{message:"Add to Want to Read List"});

  }
});
app.post('/dune',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  req.session.current_user_books['dune']=!req.session.current_user_books['dune'];
  users_book[req.session.current_user_number]=req.session.current_user_books;
  fs.writeFileSync("users_book.json",JSON.stringify(users_book));

   res.redirect('/dune');

});

app.get('/grapes',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }

  if(req.session.current_user_books['grapes']){
    res.render('grapes',{message:"Remove from Want to Read List"});
  }
  else{
    res.render('grapes',{message:"Add to Want to Read List"});

  }
});
app.post('/grapes',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  req.session.current_user_books['grapes']=!req.session.current_user_books['grapes'];
  users_book[req.session.current_user_number]=req.session.current_user_books;
  fs.writeFileSync("users_book.json",JSON.stringify(users_book));

   res.redirect('/grapes');

});

app.get('/leaves',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }

  if(req.session.current_user_books['leaves']){
    res.render('leaves',{message:"Remove from Want to Read List"});
  }
  else{
    res.render('leaves',{message:"Add to Want to Read List"});

  }
});
app.post('/leaves',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  req.session.current_user_books['leaves']=!req.session.current_user_books['leaves'];
  users_book[req.session.current_user_number]=req.session.current_user_books;
  fs.writeFileSync("users_book.json",JSON.stringify(users_book));

   res.redirect('/leaves');

});

app.get('/mockingbird',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }

  if(req.session.current_user_books['mockingbird']){
    res.render('mockingbird',{message:"Remove from Want to Read List"});
  }
  else{
    res.render('mockingbird',{message:"Add to Want to Read List"});

  }
});
app.post('/mockingbird',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  req.session.current_user_books['mockingbird']=!req.session.current_user_books['mockingbird'];
  users_book[req.session.current_user_number]=req.session.current_user_books;
  fs.writeFileSync("users_book.json",JSON.stringify(users_book));

   res.redirect('/mockingbird');

});

app.get('/sun',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }

  if(req.session.current_user_books['sun']){
    res.render('sun',{message:"Remove from Want to Read List"});
  }
  else{
    res.render('sun',{message:"Add to Want to Read List"});

  }
});
app.post('/sun',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  req.session.current_user_books['sun']=!req.session.current_user_books['sun'];
  users_book[req.session.current_user_number]=req.session.current_user_books;
  fs.writeFileSync("users_book.json",JSON.stringify(users_book));

   res.redirect('/sun');

});
app.get('/readlist',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  var books=['flies','grapes','leaves','sun','dune','mockingbird'];
  var xPos =[null,null,null,null,null,null];
  var i ;
  var cuX=50;
  for(i=0;i<6;i++){
    if(users_book[req.session.current_user_number][books[i]]==true){
      xPos[i]=cuX;
      cuX+=200;
    }
  }

  res.render('readlist',{
    xPosFlies:xPos[0],
    xPosGrapes:xPos[1],
    xPosLeaves:xPos[2],
    xPosSun:xPos[3],
    xPosDune:xPos[4],
    xPosMockingbird:xPos[5]

  });
});
app.get('/search',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  res.render('searchresults',{
    xPosFlies:null,
    xPosGrapes:null,
    xPosLeaves:null,
    xPosSun:null,
    xPosDune:null,
    xPosMockingbird:null,
    errormessage:"Enter A KeyWord"

  });


});
app.post('/search',function(req,res){
  if(req.session.current_User==null){
    messLogin = true;
    res.redirect('/');
    return;
  }
  var errormessage="Book Not Found !!!";
  var x = (req.body.Search).toLowerCase();
  var l = ["lord of the flies","the grapes of wrath","leaves of grass","the sun and her flowers","dune","to kill a mockingbird"];
  var xPos=[null,null,null,null,null,null];
  var cuX=50;
  var i;
  for(i=0;i<l.length;i++){
    if(l[i].includes(x)){
      errormessage=null;
      xPos[i]=cuX;
      cuX+=200;
    }
  }
  res.render('searchresults',{
    xPosFlies:xPos[0],
    xPosGrapes:xPos[1],
    xPosLeaves:xPos[2],
    xPosSun:xPos[3],
    xPosDune:xPos[4],
    xPosMockingbird:xPos[5],
    errormessage:errormessage

  });
})

function isUserNameValid( userName){
var valid = true;
var i;
userName = userName.toLowerCase();
for(i=0;i<userName.length && valid;i++){
    if(!((userName.charAt(i)>='a' && userName.charAt(i)<='z')||(userName.charAt(i)>='1' && userName.charAt(i)<='9')||(userName.charAt(i)=='.')) ){
         valid=false;
    }
}
if(userName.length==0){valid=false};
    
return valid;
};


if(process.env.PORT){
    app.listen(process.env.PORT,function(){console.log("server Started")});

}
else{
  app.listen(3000,function(){console.log("server Started on 3000")});
}