const express=require("express");
const app=express();
const path = require("path");
const indexRouter=require("./routes/indexRouter");
const authRouter=require("./routes/auth");
const productRouter=require("./routes/product");
const adminRouter=require("./routes/admin");

const categoryRouter=require("./routes/categoryroute");
const userRouter=require("./routes/userRouter");
const cartRouter=require("./routes/cartrouter");
const orderRouter=require("./routes/orderrouter");
const profileRouter=require("./routes/profile");
const paymentRouter=require("./routes/payment");
const passport=require("passport");
const userModel=require("./models/user");
const expressSession=require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const { profile } = require("console");
require("dotenv").config();
require("./config/googleauthconfig");
require("./config/db");



app.set("view engine","ejs");  


app.use(express.static(path.join(__dirname,"public")));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressSession({
     resave:true,
     saveUninitialized:false,
     secret:process.env.SESSION_SECRET,
}))
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     next();
 });

app.get("/",indexRouter);
app.use("/auth",authRouter);
app.use("/admin",adminRouter);
app.use("/product",productRouter);
app.use("/categories",categoryRouter);
app.use("/users",userRouter);
app.use("/cart",cartRouter);
app.use("/orders", orderRouter);
app.use("/payment",paymentRouter);
app.use("/profile",profileRouter);
app.get("/error", (req, res) => {
     res.render("error", { message: "Oops! Something went wrong. Please try again." });
 });
 

app.listen(3000,function(){
     console.log("server start at port :3000");
})

