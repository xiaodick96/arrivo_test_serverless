const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const { allowInsecurePrototypeAccess, } = require("@handlebars/allow-prototype-access")
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const { auth, requiresAuth } = require('express-openid-connect')

require('dotenv').config()
const app = express()
const homeRoute = require('./routes/Home')
const userRoute = require('./routes/User')
const postRoute = require('./routes/Post')
const categoryroute = require('./routes/Category')
const paymentroute = require('./routes/Payment')

app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(bodyParser.json({ limit: '100mb', extended: true }))
app.enable("trust proxy", 1)

var soptions = {
    host: process.env.RDB_DB_HOST,
    port: process.env.RDB_DB_PORT,
    user: process.env.RDB_DB_USER,
    password: process.env.RDB_DB_PASSWORD,
    database: process.env.RDB_DB_DATABASE,
    clearExpired: true
};
var sessionStore = new MySQLStore(soptions);

app.use(session({
    key: 'test_lambda',
    secret: 'arrivo',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // one day
    resave: true,
    store: sessionStore
}));

app.set("views", path.join(__dirname, "/views/"))

app.engine(
    "hbs",
    exphbs.engine({
        handlebars: allowInsecurePrototypeAccess(handlebars),
        extname: "hbs",
        defaultLayout: "MainLayout",
        layoutsDir: __dirname + "/views/layouts/",
    })
)

app.set("view engine", "hbs")

app.use(
    auth({
        authRequired: false,
        auth0Logout: true,
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        secret: process.env.SECRET,
    })
)

app.use('/froalacss', express.static(__dirname + '/node_modules/froala-editor/css/froala_editor.pkgd.min.css'))
app.use('/froalajs', express.static(__dirname + '/node_modules/froala-editor/js/froala_editor.pkgd.min.js'))

app.use("/", homeRoute)
app.use("/user", userRoute)
app.use("/post", postRoute)
app.use("/category", categoryroute)
app.use('/payment', paymentroute)

app.get("/testing", function(req, res) {
    return res.send(req.session)
})

module.exports = app