
import { isObjectIdOrHexString } from "mongoose";
import Post from "../models/Post.js"
import Comment from "../models/Comment.js";

export const getAll = async (req, res) => {
    try {
        const posts = await Post.find().populate('user').exec();

        const postsWithCommentCounts = await Promise.all(
            posts.map(async (post) => {
              const commentsCount = await Comment.countDocuments({ post: post._id });
              return {
                ...post.toObject(), // Convert post to a plain object
                commentsCount,
              };
            })
          );

        res.json(postsWithCommentCounts)
    } catch (error) {
        res.status(500).json({
            message: 'Cannot get the posts',
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await Post.find().limit(5).exec();
        // finding all the posts
        // limiting the amount of the posts we get 

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (error) {
        res.status(500).json({
            message: 'Cannot get the tags',
        })
    }
}

export const getNew = async (req, res) => {
    try {
        
        const NewerPosts = await Post.find().sort( { createdAt: -1 } ).populate('user');
      
        if (NewerPosts.length === 0) {
          return res.status(404).json({ message: 'Cannot get newer posts' });
        }
      
        res.json(NewerPosts);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Newer posts error',
        });
      } 
}
export const getPopular = async (req, res) => {
    try {

        const PopularPosts = await Post.find().sort( { viewsCount: -1 } ).populate('user');
      
        if (!PopularPosts) {
          return res.status(404).json({ message: 'Cannot get popular posts' });
        }
      
        res.json(PopularPosts)
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Popular posts error',
        });
      } 
}

export const getOne = async (req, res) => {
    try {
        // Atomic Update via MongoDB
        const postId = req.params.id;
      
        // Increment the viewsCount and return the updated document
        const onePost = await Post.findOneAndUpdate(
          { _id: postId },
          { $inc: { viewsCount: 1 } },
          {
            new: true, // To return the updated document
          }
        ).populate('user');
      
        if (!onePost) {
          // Handle the case where the post with the specified ID is not found
          return res.status(404).json({ message: 'Post not found' });
        }
      
        res.json(onePost);
      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Cannot get the post',
        });
      } 
}

export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find().limit(5).populate('user').exec()

        res.json(comments)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Cannot get all the comments',
        });
    }
}
 
export const getPostComments = async (req,res) => {
    try {
        const postId = req.params.id;
        const postComments = await Comment.find({post : postId}).sort({ createdAt: -1 }).populate('user').exec()

        res.json(postComments)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Cannot get the comments for post',
        });
    }
}


export const createComment = async (req,res) => {
    try {
        const postId = req.params.id
        const doc = new Comment({
            text: req.body.text,
            user: req.userId,
            post: postId
        })

        const comment = await doc.save()
        await Post.updateOne({ _id: postId }, { $inc: { commentsCount: 1 } });
        res.json(comment)
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Cannot create the comment',
        });
    }
}

export const findTags = async(req,res) => {
    try {
        const tagName = req.params.tagName
        const postsWithTag = await Post.find({ tags: { $in: [tagName] } });
        console.log(postsWithTag)

        res.json(postsWithTag)
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
          message: 'Cannot create the comment',
        });
    }
}

export const create = async (req, res) => {
    try {
        const doc = new Post({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            // Getting the userId from the checkAuth middleware
        });

        const post = await doc.save();

        res.json(post);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Ne udalosi sozdati statiu'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await Post.findOneAndDelete({
            _id: postId,
        });

        if (!deletedPost) {
            return res.status(404).json({
                message: 'Post not found'
            });
        }

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Smth went wrong'
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const updatedPost = await Post.updateOne({
            _id: postId,
        },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId,
            },
        )

        res.json({
            success: true,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Ne udalosi obnoviti statiu'
        })
    }
}
