import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'


var SCOPE = 'https://www.googleapis.com/auth/drive.file';
var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

export default function GDrive() {
    const [file, setfile] = useState("")
    const [googleAuth, setgoogleAuth] = useState("")
    const [access_key, setaccess_key] = useState('')
    
    const handleChange = (event) =>{
        setfile(event.target.files[0])
    }

    useEffect(() => {
        var script = document.createElement('script');
        script.onload= handleClientLoad;
        script.src="https://apis.google.com/js/api.js";
        document.body.appendChild(script);
        // eslint-disable-next-line
        },[])

    
    const initClient = () => {
        try{
        window.gapi.client.init({
            'apiKey': "AIzaSyCgRyaW3hfu6HtY85acCfwodz3FyiSpBmY",
            'clientId': "430082053982-m3qevde2u60cugd44fp6do53jgunp05r.apps.googleusercontent.com",
            'scope': SCOPE,
            'discoveryDocs': [discoveryUrl]
            }).then(()=>{
                setgoogleAuth(window.gapi.auth2.getAuthInstance())
                googleAuth.isSignedIn.listen(this.updateSigninStatus);
                }
            )
            }catch(e){
                console.log(e);
            }
        }

    const handleClientLoad = ()=>{
        window.gapi.load('client:auth2', initClient);
    }

    const signinStatus= async ()=>{
        var user = googleAuth.currentUser.get();
        console.log(user)
        if (user.wc == null){
          setaccess_key('');
        }
        else{
          var isAuthorized = user.hasGrantedScopes(SCOPE);
          if(isAuthorized){
              setaccess_key(user.wc.access_token)
          }
        new Blob([file], {type: file.type});
        var metadata = {
            'name': file.name, // Filename at Google Drive
            'mimeType': file.type, // mimeType at Google Drive
            };
        var accessToken = window.gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
        form.append('file', file);
        const response = await axios.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',form,{
             headers:{
                 Authorization:`Bearer ${accessToken}`
                },
            })
                console.log(response)
        }
    }

    const updateSigninStatus = ()=> {
        signinStatus();
      }

    const signInFunction =()=>{
        googleAuth.signIn();
        updateSigninStatus()
      }

    const handleUpload = () => {
            signInFunction()
          }

    return (
        <div>
            <form>
            <div>Access KEY : {access_key}</div>
            <input type='file' onChange={(e)=>handleChange(e)} />
            <button type="button" onClick={()=>handleUpload()}>Upload</button>
            </form>
        </div>
    )
}
