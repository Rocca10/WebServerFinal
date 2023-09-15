const express = require('express');
const passport = require('passport');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const PassportLocal = require('passport-local').Strategy;


app.use(express.urlencoded({extended: true}));

app.use(cookieParser('Un secreto'));

app.use(session({
    secret: "Un secreto",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new PassportLocal(function(username,password,done){
    if(username === "nicolas" && password === "123456")
    return done(null, {id: 1, name: "Nico"});

    done(null,false);
}))

passport.serializeUser(function(user,done){
    done(null,user.id)
})

passport.deserializeUser(function(id,done){
    done(null,{id: 1, name: "Nico"});
})

app.set('view engine','ejs')

app.get("/",  (req,res,next) =>{
    if(req.isAuthenticated()) return next(); //Eso lo que hace es, si está bien que siga para adelante con next. Si no vuelva a la pagina principal (en mi caso va a ser error)

    res.redirect("/login");
}   ,(req,res)=>{
   res.send("Hola");
})

app.get("/login",(req,res)=>{
   //Mostrar el formulario

   res.render("login");
})

app.post("/login",passport.authenticate('local',{
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.listen(3000,()=>{
    console.log("Servidor corriendo",3000); //Muestra por consola que el servidor está corriendo
});