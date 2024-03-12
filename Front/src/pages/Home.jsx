import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import axios from '../axios';
export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data);
  const { posts, tags } = useSelector(state => state.posts);
  const [ newerPosts, setNewerPosts ] = useState([]);
  const [ popularPosts, setPopularPosts ] = useState([]);
  const [comments,setComments] = useState([]);
  const [selectedTab, setSelectedTab] = useState('new');

  const isPostsLoading = posts.status === 'loading'
  const isTagsLoading = tags.status === 'loading'

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());

    axios.get('/comments')
    .then((response) => {
      setComments(response.data)
    })
    .catch((err) => {
      console.log(err)
      alert('Cannot get the comments')
    })
  }, [])

  useEffect(() => {
    if (selectedTab === 'new') {
      axios.get('/posts/new')
        .then((response) => {
          setNewerPosts(response.data);
        })
        .catch((err) => {
          console.log(err);
          alert('Cannot get the newer posts');
        });
    } else if (selectedTab === 'popular') {
      axios.get('/posts/popular')
        .then((response) => {
          setPopularPosts(response.data);
        })
        .catch((err) => {
          console.log(err);
          alert('Cannot get the popular posts');
        });
    }
  }, [selectedTab]);

   // The empty dependency array means this effect will run once on component mount
  
  

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <>
      <Tabs 
      onChange={handleTabChange}
      tyle={{ marginBottom: 15 }} 
      value={selectedTab} 
      aria-label="basic tabs example">
        <Tab label="Новые"  value={'new'}/>
        <Tab label="Популярные" value={'popular'}/>
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {/* If the loading persists then we are rendering the Post with loading true, if not then the real Post should render */}
          {(isPostsLoading ? [...Array(5)] : (selectedTab === 'new' ? newerPosts : popularPosts)).map((obj, index) => isPostsLoading ? <Post key={index} isLoading={true} /> :
            (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.commentsCount}
                tags={obj.tags}
                // comparing the id's of the users to check if the user can edit the post or not
                isEditable={userData?._id === obj.user._id} // there
              />
            ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
           items={comments.map((comment) => ({
            user: {
              fullName: comment.user.fullName,
              avatarUrl: comment.user.avatarUrl
            },
            text: comment.text
          }))}
          isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
