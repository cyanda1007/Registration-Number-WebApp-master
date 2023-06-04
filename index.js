const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const flash = require('express-flash');
const session = require('express-session');


const appExpress = express();
const regRoute = require('./routes/regRoutes');




// initialise session middleware - flash-express depends on it
appExpress.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
appExpress.use(flash());

//Configure express handlebars
appExpress.engine('handlebars', exphbs({ defaultLayout: 'main' }));
appExpress.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
appExpress.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
appExpress.use(bodyParser.json())

appExpress.use(express.static('public'));

appExpress.use('/', regRoute);
appExpress.use("/bottuns", regRoute)
appExpress.use('/reg_numbers', regRoute);
appExpress.use("/resetBtn", regRoute)
appExpress.use('/reg_number', regRoute);
appExpress.use("/reg_numbers", regRoute)

const PORT = process.env.PORT || 3016;

appExpress.listen(PORT, () => {
    console.log(`App started at http://localhost:${PORT}`);
});