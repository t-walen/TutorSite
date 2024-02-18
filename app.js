
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const catchAsync = require('./Utilities/catchAsync');
const Joi = require('joi');
const {StudentSchema, testimonialSchema } = require('./schemas.js');
const ExpressError = require('./Utilities/expresserror');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./model/user')
const Student = require('./model/student');
const Testimonial = require('./model/testimonials');
const multer = require('multer');
const upload = multer();


const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
// In the process of adding registration and testimonials
//const UserRoute = require('./routes/users')
//const student = require('./routes/student');
//const reviews = require('./routes/reviews')
const MongoStore = require("connect-mongo");
const { validateTestimonial, isLoggedIn, isTestimonialAuthor } = require('./routes/middleware.js');


const DB_SECRET = process.env.DB_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'Public')))
app.use(mongoSanitize({
    replaceWith: '_'
}));

const store = MongoStore.create({
 mongoUrl: dbUrl,
 touchAfter: 24 * 60 * 60,
 crypto: {
    secret: DB_SECRET
 },
 useNewUrlParser: true,
 useUnifiedTopology: true,
 collectionName: 'sessions',
});

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    store,
    name: 'sessions',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://code.jquery.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://maxcdn.bootstrapcdn.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            scriptSrcElem: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            styleSrcElem: ["'self'", "unsafe-inline", ...styleSrcUrls],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", 'https://fonts.gstatic.com/', ...fontSrcUrls],
        },
    })
);

const fetchAllTestimonials = async () => {
    try {
      const testimonials = await Testimonial.find();
      return testimonials;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  };



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// Store a user
passport.serializeUser(User.serializeUser());
//Get user
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    console.log(req.session)
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


registeruser = async(req, res, next) => {
    try {
    const { username, email, password } = req.body;
    const user = new User({email, username});
    const registereduser = await User.register(user, password);
    req.login(registereduser, err => {
        if(err) return next(err);
    req.flash('success', "Welcome");
    res.redirect('/skis');
})
} catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
}
};



app.get('/register', (req, res) => {
    res.render('main/register')
});

app.post('/register', catchAsync(async(req, res, next) => {
    try {
    const {username, email, password} = req.body;
    const user = new User({email, username});
    const registereduser = await User.register(user, password);
    req.login(registereduser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome');
        res.redirect('/index')
})
 } catch (e) {
    req.flash('error', e.message);
    res.redirect('main/register');
}}));

app.get('/login', (req, res) => {
    res.render('main/login')
});

app.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect:'/login'}),(req, res) => {
    req.flash('success', 'Welcome');
    res.redirect('/index')

})

app.get('/', (req, res) => {
    res.render('main/index')
});

app.get('/index', (req, res) => {
    res.render('main/index')
});

app.get('/about', (req, res) => {
    res.render('main/about');
});

app.get('/contact', (req, res) => {
    res.render('main/newStudent');
});


app.use((req, res, next) => {
    console.log('Request Body:', req.body);
    next();
});

app.post('/contact', upload.none(), catchAsync(async (req, res, next) => {

    const student = new Student({
        name: req.body.name,
        email: req.body.email,
        location: req.body.location,
        description: req.body.description,
    });
    await student.save();
    req.flash('success', 'Successfully Submitted');
    res.redirect('/index')
}));

app.get('/testimonials', catchAsync(async (req, res) => {
    try {
        const testimonials = await Testimonial.find().populate('author');
        res.render('main/testimonials', { testimonials, currentUser: req.user });
      } catch (error) {
        // Handle error
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    }));

app.post('/testimonials', isLoggedIn, validateTestimonial, catchAsync( async (req, res, next) => {
    const testimonial = new Testimonial(req.body.testimonial);
    testimonial.author = req.user._id;
    await testimonial.save();
    req.flash('success', 'Created a new testimonial!')
    res.redirect('/testimonials');
}));

app.delete('/testimonials/:testimonialID', isLoggedIn, isTestimonialAuthor, catchAsync(async (req, res) => {
    await Testimonial.findByIdAndDelete(req.params.testimonialId);
    res.redirect('/main/testimonials')
}))



app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/index');
    });
});

app.get('/test-error', (req, res, next) => {
    next(new ExpressError('Test Error', 500));
});
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
});

const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
