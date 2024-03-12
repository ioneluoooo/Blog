import express from 'express';
import mongoose, { mongo } from 'mongoose';
import multer from 'multer';
import cors from 'cors';

// MIDDLEWARES BEGGINING
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validations/Validation.js';
import { checkAuth, handleValidationErrors } from './utils/mainUtils.js'
// MIDDLEWARES END

// CONTROLLERS BEGGINING
import { UserController, PostController } from './controllers/mainController.js'
// CONTROLLERS END

// Connecting the database
mongoose.connect('mongodb+srv://admin:1ws2qa3ed@moicluster.iygrrhw.mongodb.net/yourDBname?retryWrites=true&w=majority', {
    // remove a depecrated warning when connecting
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Database error', err))

// Initialize the app
const app = express();

const db = mongoose.connection

// db.once('open', async () => {
//     try {
//         await db.collection.updateMany(
//             {},
//             [
//                 {
//                     $convert: {
//                         input: "$createdAt",
//                         to: "date"
//                     }
//                 },
//             ]
//         );
//         console.log('Field data type updated successfully')
//     } catch (error) {
//         console.error('An error occured', error)
//     }
// })

// initialize our storage
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    }, // Shows us the route where the images should be stored
    // Multer is a middlewae for handling file uploads in node
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
    // so when any file will download, firstly a function that will give us the destination will occur, then a second function that will give us the original name of the file before it is stored anywhere
});

const upload = multer({ storage });

app.use(cors());

app.use(express.json());
// Firstly, our express app cannot read the request
// So there we make it possible, otherwise all the time it will return undefined
app.use('/uploads', express.static('uploads'))
// without this, express cannot find our images, cannot find the route to them
// 'static' explains that you are not just setting a get request, but a get request for a static file too, like a photo

// REQUESTS for auth
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    // zdesi pizdet nado shtobi 'image' bil 'image' a ne kakto pa drugomu kogda delaeshi request a to rabotati ne budet 
    res.json({
        url: `/uploads/${req.file.originalname}`,
        // giving the client the path where the image is stored
    })
});
app.get('/tags', PostController.getLastTags);

// CRUD for POSTS
app.get('/posts', PostController.getAll);
app.get('/posts/new', PostController.getNew);
app.get('/posts/popular', PostController.getPopular);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/tags', PostController.getLastTags);
// Secured routes
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

//CRUD for comments
app.get('/comments', PostController.getAllComments)
app.post('/posts/:id/comments',checkAuth, commentCreateValidation, handleValidationErrors, PostController.createComment)
app.get('/posts/:id/comments', PostController.getPostComments)

app.get('/tag/:tagName', PostController.findTags)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server started')
});