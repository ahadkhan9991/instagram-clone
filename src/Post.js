
import React, { useState , useEffect } from 'react';
import './Post.css';

import firebase from "firebase";
import { db } from './firebase';
import Avatar from "@material-ui/core/Avatar";

function Post({postId , user , username , caption, imageUrl}) {
    
  const [comments ,setComments] = useState([]);
  
  const [comment ,setComment] = useState('');

  useEffect(() => {
      let unsubscribe;
      if (postId){
          unsubscribe = db
          .collection("posts") 
          .doc(postId)
          .collection("comments") // comment collection is added inside the collection of posts , to map each comment with specfic posts.
          .orderBy('timestamp', 'desc')
          .onSnapshot((snapshot) =>{
              setComments(snapshot.docs.map((doc) => doc.data()));
          });
      }
      return() => {
          unsubscribe(); //cleanup actions
      };
  } , [postId]);

  const postComment = (event) =>{
      //adding comments on the specific posts from firebase
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });

        setComment('');
  }

    return (
<div className="post">
    {/* header = Avatar + username
     then : images
     then : username + caption
    */}
    <div className="post__header">
    <Avatar 
    className="post__avatar"
    alt={username}
    src="/static/images/avatar/1.jpg"
    />

     <h3>{username}</h3> 

    </div>

    <img className="post__image"
    alt=""
    src={imageUrl} />

    <h4 className="post__text"><strong> {username} </strong> : {caption}</h4>

    <div className="post_comments">
        {comments.map((comment) => (
            <p>
                <strong>{comment.username}</strong> {comment.text}
            </p>
        ))}

    </div>

    {user && ( //remmove comment box if user is not logged in
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}

          />

          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >Post</button>

        </form>
    )}

    
</div>
    )
}

export default Post
