import { useState,useRef,useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";
import './App.css'

function App() {

  // TODO
  // create a component that contains all the stuff I did in it
  // create another "login" component that passes a room ID prop down and uses that to create a websocket room

  const [callID,setCallID] = useState('');
  const localVideoRef = useRef();
  const callInputRef = useRef();
  const socket = useRef();

  const servers = {
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  
  // Global State
  const pc = new RTCPeerConnection(servers);
  
  let localStream = null;
  let remoteStream = null;

  socket.current = io('http://localhost:3000')


  return (
    <div className="App">

      <h2>1. Start your Webcam</h2>
      <div className="videos">
        <span>
          <h3>Local Stream</h3>
          <video id="webcamVideo" ref={localVideoRef} autoPlay playsInline></video>
        </span>
        <span>
          <h3>Remote Stream</h3>
          <video id="remoteVideo" autoPlay playsInline></video>
        </span>


      </div>


      <button id="webcamButton" onClick={async () => {
        localStream = await navigator.mediaDevices.getUserMedia({ video: {
          deviceId: {
            exact: '76942b01546af13a3f39ddf2b46a019acac5bfd1280364a1fdd1721f16f7b083',
          }
        }, audio: true, });
        
        remoteStream = new MediaStream();

        // Push tracks from local stream to peer connection
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });

        // Pull tracks from remote stream, add to video stream
        pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
          });
        };

        localVideoRef.current.srcObject = localStream;        
        remoteVideo.srcObject = remoteStream;

      }}>Start webcam</button>


      {/* CREATE A CALL */}
      <h2>2. Create a new Call</h2>
      <button id="callButton"
        onClick={async () => {
          
          callInputRef.current.value = socket.current.id;

          const offerDescription = pc.createOffer();
          await pc.setLocalDescription(offerDescription);

          const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
          }

        }}
       >Create Call (offer)</button>

      <h2>3. Join a Call</h2>
      <p>Answer the call from a different browser window or device</p>
      
      <input id="callInput" ref={callInputRef} />
      <button id="answerButton" disabled>Answer</button>

      <h2>4. Hangup</h2>

      <button id="hangupButton" disabled>Hangup</button>


    </div>
  )
}

export default App
