import React, { useState , useEffect } from 'react';
import './App.css';
import Post from './Post' ;
import { db , auth } from './firebase';
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';

 

function getModalStyle() {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {

  const classes = useStyles();
  const [modalStyle] =useState(getModalStyle)
  const [posts,setPosts]= useState([])
  const [open, setOpen] = useState(false)
  const [openSignIn , setOpenSignIn] = useState('')

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email , setEmail] = useState('');
  const [user, setUser] = useState(null);

  //useEffect runs a piece of code bsed on specific condition


  useEffect(() => {
   
    const unsubscribe = auth.onAuthStateChanged((authUser) => {

      if(authUser){
        // usere has logged in
        console.log(authUser);
        setUser(authUser);


      }
      else{
        //user has logged out

        setUser(null);

      }
    })

    return () =>{

      // perform Somecleanup actions
      unsubscribe();
    }


  },[user, username])
  
  useEffect(() => {

    db.collection('posts').onSnapshot(snapshot => {

      setPosts(snapshot.docs.map( docs => ({
        id: docs.id ,     // it will load refresh the upcoming post only if we ue key
        post: docs.data() })))


    })

    // this is where the code runs
  },[]) ; // code will run once when the new post addd

  const signUp = (event) => {
    
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email , password)
    .then((authUser) => {

      return authUser.user.updateProfile({
        displayName : username
      })
    })
    .catch((error) => alert(error.message))
    setOpen(false);
  

  }
  
  const signIn =(event) =>{
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message))
    
    setOpenSignIn(false)


  }
  

  return (
    <div className="App">
      <div className="app__header">
        <img className= "app__headerImage"
        alt=""
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />


{user ? (
  <Button onClick = {() =>auth.signOut()}> Logout</Button>
  ) :(
    <div className= "app__loginContainer">
  <Button onClick = {() => setOpenSignIn(true)}> signin </Button>
  <Button onClick = {() => setOpen(true)}> signup </Button>

  </div>
)
}


      </div>

       {/* Modal for SignIN */}
        <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}  // this will close the modal when we click outside of the modal
          >

               <div style={modalStyle} className={classes.paper}>

            <form className="app__signup">
            <center>
               <img className= "app__headerImage"
        
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                />
                
            </center>
                 <Input
                placeholder= "Email"
                type="text"
                value= {email} 
                onChange = {(e) => setEmail(e.target.value)}
                
                />
                 <Input
                placeholder= "Password"
                type="password"
                value ={password}
                onChange = {(e) => setPassword(e.target.value)}
                
                />

                <Button type="submit" onClick = {signIn}> Sign IN </Button>

              
            </form>    
              
            </div>
            
          </Modal>

          {/* Modal for SignUp */}
          <Modal
            open={open}
            onClose={() => setOpen(false)}  // this will close the modal when we click outside of the modal
          >

               <div style={modalStyle} className={classes.paper}>

            <form className="app__signup">
            <center>
               <img className= "app__headerImage"
                alt=""
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                
                />  
                
            </center>
                

                
                <Input
                placeholder= "Username"
                type="text"
                value={username} 
                onChange = {(e) => setUsername(e.target.value)}
                
                />
                
                 <Input
                placeholder= "Email"
                type="text"
                value= {email} 
                onChange = {(e) => setEmail(e.target.value)}
                
                />
                 <Input
                placeholder= "Password"
                type="password"
                value ={password}
                onChange = {(e) => setPassword(e.target.value)}
                
                />

                <Button type="submit" onClick = {signUp}> Signup </Button>

              
            </form>    
              
            </div>

          </Modal>
		  
		

     <div className="app__post  ">

      {   //  if we add a unique key then not all the page will refresh 
        posts.map( ({ id ,post })=>(
          <Post key ={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }

     </div>
	 
	 

    { /*imageupload*/ }

    {user?.displayName ? (
         <ImageUpload  username={user.displayName} />

       ):(
         <center className="post_center"><h3>Sorry you need to login to upload</h3></center>
       )}  
    </div>
  );

}

export default App;
