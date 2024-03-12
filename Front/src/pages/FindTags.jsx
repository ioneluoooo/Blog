import React, { useEffect, useState } from 'react'
import axios from '../axios'
import Grid from '@mui/material/Grid';
import { Post } from '../components/Post';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const FindTags = () => {

  const [ sortedPosts,setSortedPosts] = useState([])
  const isPostsLoading = sortedPosts.status === 'loading'
  const { tagName } = useParams()
  const userData = useSelector(state => state.auth.data);

  useEffect(() => {
    axios.get(`/tag/${tagName}`)
      .then((response) => {
        setSortedPosts(response.data);
        console.log(sortedPosts)
      })
      .catch((err) => {
        console.log(err);
        alert('Cannot get the sorted posts for tags');
      });
  }, []); // Include 'name' in the dependency array to re-fetch when 'name' changes
  
  
  return (
    <Grid container spacing={4}>
        <Grid xs={8} item>
          {/* If the loading persists then we are rendering the Post with loading true, if not then the real Post should render */}
          {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) => isPostsLoading ? <Post key={index} isLoading={true} /> :
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
        </Grid>
  )
}


