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

mongoose.connect('MONGODB_URL', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Database error', err))

const app = express();

const db = mongoose.connection

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    }, 
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
    
});

const upload = multer({ storage });

app.use(cors());

app.use(express.json());
app.use('/uploads', express.static('uploads'))

// REQUESTS for auth
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
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
