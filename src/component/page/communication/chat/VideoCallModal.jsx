import React, {useEffect, useRef, useState} from 'react';
import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import './TestingWebRTC.css';
import {api, baseURL, selectSchoolDetails, selectUserActualData} from "../../../../common";
import {useSelector} from "react-redux";
import {
    AppBar,
    Box,
    Button,
    Card,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Slide,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import {
    Call,
    CallEnd,
    Cancel,
    CheckCircle,
    Close,
    Fullscreen,
    FullscreenExit,
    Mic,
    MicOff,
    PersonAdd,
    Refresh,
    ScreenShare,
    Settings,
    StopScreenShare,
    Videocam,
    VideocamOff,
    Warning
} from '@mui/icons-material';
// Optional transition for dialogs
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const VideoCallModal = ({
                            open,
                            onClose,
                            callType,
                            contact,
                            currentUser,
                            sessionId,
                            stompClient,
                            registeredId,
                            setRegisteredId
                        }) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [userId, setUserId] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const [incomingCall, setIncomingCall] = useState(false);
    const [callInProgress, setCallInProgress] = useState(false);
    const [callerId, setCallerId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [lastError, setLastError] = useState('');
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const stompClientRef = useRef(null);
    const localStreamRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const remoteStreamRef = useRef(null);
// Add these state variables to your existing state declarations
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const screenStreamRef = useRef(null);
    const userData = useSelector(selectSchoolDetails);
    const userDataActual = useSelector(selectUserActualData);
    const schoolId = userData?.id;
    const session = userData?.session;
// Function to toggle screen sharing

    useEffect(() => {
        const registerUser = async () => {
            const userTable = userDataActual.tableName ? userDataActual.tableName.toLowerCase() : "NAN";
            const className = userDataActual.className ? userDataActual.className : "NAN";
            const section = userDataActual.section ? userDataActual.section : "NAN";
            const topic = `/topic/webrtc/${userDataActual.tableId}_${userDataActual.name}_${className}_${section}_${schoolId}_${session}_${userTable}`;
            setUserId(topic);

            try {
                // Pass topic as userId in the request body
                const response = await api.post('/api/register', {userId: topic});

                if (response.status === 200) {
                    console.log('Successfully registered with ID:', topic);
                    setRegisteredId(topic);
                    setConnectionStatus('Registering...');

                    // Setup local video stream
                    setupLocalVideoStream();
                } else {
                    const error = await response.text();
                    alert(`Registration failed: ${error}`);
                }
            } catch (error) {
                console.error('Error registering user:', error);
                alert('Error registering user. Please check console for details.');
            }
        };
        const selectTargetUserId = async () => {
            const userTable = contact.usertable ? contact.usertable.toLowerCase() : "NAN";
            const className = contact.className ? contact.className : "NAN";
            const section = contact.section ? contact.section : "NAN";
            const topic = `/topic/webrtc/${contact.id}_${contact.name}_${className}_${section}_${contact.schoolId}_${contact.session}_${userTable}`;
            setTargetUserId(topic);
        };

        registerUser();
        selectTargetUserId();
        startCall();

        // Optional cleanup function
        return () => {
            // Any cleanup code if needed
        };
    }, [userDataActual,targetUserId]);

    const toggleScreenSharing = async () => {
        try {
            const pc = peerConnectionRef.current;
            if (!pc) {
                console.error('No peer connection available');
                setLastError('Cannot share screen: No active call');
                return;
            }

            if (isScreenSharing) {
                // Stop screen sharing, revert to camera
                console.log('Stopping screen sharing');

                // Stop all tracks from the screen sharing stream
                if (screenStreamRef.current) {
                    screenStreamRef.current.getTracks().forEach(track => {
                        track.stop();
                    });
                    screenStreamRef.current = null;
                }

                // Replace the screen share tracks with camera tracks
                if (localStreamRef.current) {
                    const senders = pc.getSenders();
                    const videoSender = senders.find(sender =>
                        sender.track && sender.track.kind === 'video');

                    if (videoSender) {
                        // Get the video track from local stream
                        const videoTrack = localStreamRef.current.getVideoTracks()[0];
                        if (videoTrack) {
                            await videoSender.replaceTrack(videoTrack);
                        }
                    }

                    // Update local video display
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = localStreamRef.current;
                    }
                }

                setIsScreenSharing(false);
            } else {
                // Start screen sharing
                console.log('Starting screen sharing');
                try {
                    // Get screen sharing stream
                    const screenStream = await navigator.mediaDevices.getDisplayMedia({
                        video: {
                            cursor: 'always'
                        },
                        audio: false
                    });

                    screenStreamRef.current = screenStream;

                    // Replace camera video track with screen sharing track
                    const senders = pc.getSenders();
                    const videoSender = senders.find(sender =>
                        sender.track && sender.track.kind === 'video');

                    if (videoSender && screenStream.getVideoTracks().length > 0) {
                        const screenTrack = screenStream.getVideoTracks()[0];
                        await videoSender.replaceTrack(screenTrack);

                        // Handle when user stops screen sharing via the browser UI
                        screenTrack.onended = () => {
                            toggleScreenSharing();
                        };
                    }

                    // Update local video display to show screen
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = screenStream;
                    }

                    setIsScreenSharing(true);
                } catch (error) {
                    console.error('Error starting screen sharing:', error);
                    setLastError('Failed to start screen sharing: ' + error.message);
                }
            }
        } catch (error) {
            console.error('Error toggling screen share:', error);
            setLastError('Screen sharing error: ' + error.message);
        }
    };

// Function to toggle audio mute
    const toggleAudioMute = () => {
        if (localStreamRef.current) {
            const audioTracks = localStreamRef.current.getAudioTracks();

            audioTracks.forEach(track => {
                track.enabled = isAudioMuted;
                console.log(`Audio track ${track.id} ${isAudioMuted ? 'unmuted' : 'muted'}`);
            });

            setIsAudioMuted(!isAudioMuted);
        } else {
            console.warn('No local stream available to mute audio');
        }
    };

// Function to toggle video mute
    const toggleVideoMute = () => {
        if (localStreamRef.current) {
            const videoTracks = localStreamRef.current.getVideoTracks();

            videoTracks.forEach(track => {
                track.enabled = isVideoMuted;
                console.log(`Video track ${track.id} ${isVideoMuted ? 'unmuted' : 'muted'}`);
            });

            setIsVideoMuted(!isVideoMuted);
        } else {
            console.warn('No local stream available to mute video');
        }
    };
    // ICE servers configuration for WebRTC - with more STUN servers for reliability
    const iceServers = {
        iceServers: [
            {urls: 'stun:stun.l.google.com:19302'},
            {urls: 'stun:stun1.l.google.com:19302'},
            {urls: 'stun:stun2.l.google.com:19302'},
            {urls: 'stun:stun3.l.google.com:19302'},
            {urls: 'stun:stun4.l.google.com:19302'},
            // Add free TURN servers (replace with your own in production)
            /*          {
                          urls: 'turn:openrelay.metered.ca:80',
                          username: 'openrelayproject',
                          credential: 'openrelayproject'
                      },
                      {
                          urls: 'turn:openrelay.metered.ca:443',
                          username: 'openrelayproject',
                          credential: 'openrelayproject'
                      },
                      {
                          urls: 'turn:openrelay.metered.ca:443?transport=tcp',
                          username: 'openrelayproject',
                          credential: 'openrelayproject'
                      }*/
        ],
        iceCandidatePoolSize: 10 // Pre-gather ICE candidates
    };

    // Dedicated function to handle updating the video element
    // Modified updateRemoteVideo function to fix the timing issue
    const updateRemoteVideo = (stream) => {
        if (!remoteVideoRef.current) return;

        console.log('Updating remote video element with stream:', stream.id);

        try {
            // Safety check - detach any existing streams first
            if (remoteVideoRef.current.srcObject) {
                console.log('Removing old stream from video element');
                remoteVideoRef.current.srcObject = null;
            }

            // Ensure all tracks are enabled
            stream.getTracks().forEach(track => {
                track.enabled = true;
                console.log(`Ensuring track is enabled: ${track.kind} (${track.id})`);
            });

            // Force stream to refresh by cloning it
            const clonedStream = new MediaStream();
            stream.getTracks().forEach(track => {
                console.log(`Adding track to cloned stream: ${track.kind} (${track.id})`);
                clonedStream.addTrack(track);
            });

            // Apply the stream to the video element
            remoteVideoRef.current.srcObject = clonedStream;
            remoteVideoRef.current.muted = false;

            // Force play with improved retry mechanism
            const tryPlay = (attempts = 0) => {
                console.log(`Attempt ${attempts + 1} to play video`);

                // Make sure we're accessing the DOM in a safe way
                if (!remoteVideoRef.current) return;

                // First make sure that the video element is properly loaded and ready
                remoteVideoRef.current.load();

                // Then attempt to play
                const playPromise = remoteVideoRef.current.play();

                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Video playback started successfully');
                    }).catch(error => {
                        console.error('Error playing video:', error);

                        if (attempts < 5) {  // Increased retry attempts
                            // Try again with increasing delay
                            setTimeout(() => tryPlay(attempts + 1), 500 * (attempts + 1));
                        } else if (error.name === 'NotAllowedError') {
                            // If autoplay was blocked after retries, try muted playback
                            console.log('Autoplay blocked, trying muted playback');
                            remoteVideoRef.current.muted = true;
                            remoteVideoRef.current.play().then(() => {
                                console.log('Muted playback successful');
                                setLastError('Audio muted due to browser autoplay policy. Click screen to unmute.');

                                // Allow unmuting with click
                                const unmute = () => {
                                    remoteVideoRef.current.muted = false;
                                    document.removeEventListener('click', unmute);
                                    setLastError('');
                                };
                                document.addEventListener('click', unmute);
                            }).catch(e => console.error('Even muted playback failed:', e));
                        }
                    });
                }
            };

            // Try to play after a brief delay to ensure the video element is ready
            setTimeout(() => tryPlay(), 200);
        } catch (err) {
            console.error('Error in updateRemoteVideo:', err);
            setLastError('Error updating video: ' + err.message);
        }
    };

    // Initialize WebSocket connection
    useEffect(() => {
        // Only connect if we have a user ID to register
        if (!registeredId) return;

        const socket = new SockJS(baseURL + '/ws?userId=' + registeredId);
        const client = new Client({
            webSocketFactory: () => socket,
            debug: function (str) {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            setConnectionStatus('Connected');

            // Subscribe to private messages
            client.subscribe(`/topic/${registeredId}/queue/messages`, message => {
                try {
                    const payload = JSON.parse(message.body);
                    console.log("Received message: private topic", payload);
                    handleSignalingData(payload);
                } catch (error) {
                    console.error("Error parsing message:", error);
                }
            });

            client.subscribe(`/topic/messages`, message => {
                console.log("Received message:", message.body);
            });

            // Subscribe to errors channel
            client.subscribe(`/user/queue/errors`, message => {
                console.error("Error received:", message.body);
                setLastError(message.body);
            });
        };

        client.onStompError = (frame) => {
            console.error('STOMP Error:', frame);
            setConnectionStatus('Error: ' + frame.headers.message);
        };

        client.onWebSocketClose = () => {
            console.log('WebSocket connection closed');
            setConnectionStatus('Disconnected');
        };

        client.activate();
        stompClientRef.current = client;

        return () => {
            if (client && client.active) {
                client.deactivate();
            }
        };
    }, [registeredId]);

    // Register user ID with the server
    const registerUser = async () => {
        if (!userId || userId.trim() === '') {
            alert('Please enter a valid user ID');
            return;
        }

        try {
            const response = await api.post('/api/register', {userId});

            if (response.status === 200) {
                console.log('Successfully registered with ID:', userId);
                setRegisteredId(userId);
                setConnectionStatus('Registering...');

                // Setup local video stream
                setupLocalVideoStream();
            } else {
                const error = await response.text();
                alert(`Registration failed: ${error}`);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please check console for details.');
        }
    };

    // Setup local video stream
    const setupLocalVideoStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: {ideal: 1280},
                    height: {ideal: 720}
                },
                audio: true
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            localStreamRef.current = stream;
            console.log('Local stream set up successfully');
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Failed to access camera and microphone: ' + error.message);
        }
    };

    // Initialize WebRTC connection - FIX: Ensure we close any existing connection first
    const initializePeerConnection = (destination) => {
        console.log('Initializing peer connection with destination:', destination);

        // First, properly close any existing connection
        if (peerConnectionRef.current) {
            console.log('Closing existing peer connection before creating a new one');
            // Clear any existing interval
            if (peerConnectionRef.current.streamCheckInterval) {
                clearInterval(peerConnectionRef.current.streamCheckInterval);
                peerConnectionRef.current.streamCheckInterval = null;
            }

            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        const pc = new RTCPeerConnection(iceServers);
        peerConnectionRef.current = pc;

        // Store the current call destination
        if (destination) {
            pc.currentCallTarget = destination;
        }

        // Add local stream to peer connection
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                pc.addTrack(track, localStreamRef.current);
                console.log('Added track to peer connection:', track.kind);
            });
        } else {
            console.warn('No local stream available');
        }

        // Handle ICE candidates
        pc.onicecandidate = event => {
            if (event.candidate) {
                console.log('New ICE candidate:', event.candidate);

                // Use the stored target ID directly from the peer connection
                const currentTarget = pc.currentCallTarget || (callInProgress ?
                    (callerId || targetUserId) :
                    targetUserId);

                // Only send if we have a valid target
                if (currentTarget && currentTarget.trim() !== '') {
                    sendSignalingData({
                        type: 'ICE_CANDIDATE',
                        candidate: event.candidate,
                        targetUserId: currentTarget
                    });
                } else {
                    console.warn('Cannot send ICE candidate: No valid target user ID');
                    setLastError('Cannot send ICE candidate: No valid target user ID');
                }
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', pc.iceConnectionState);
            // Log more detailed connection state information for debugging
            console.log('Connection states - ICE:', pc.iceConnectionState,
                'Gathering:', pc.iceGatheringState,
                'Signaling:', pc.signalingState);

            if (pc.iceConnectionState === 'failed') {
                console.log('ICE connection failed, attempting restart...');
                pc.restartIce();
            }
        };

        // Completely rewritten ontrack handler for more reliable video display
        pc.ontrack = event => {
            console.log('Track received:', event.track.kind, event.track.id);
            console.log(`Track details - ID: ${event.track.id}, Kind: ${event.track.kind}, Enabled: ${event.track.enabled}, Muted: ${event.track.muted}, ReadyState: ${event.track.readyState}`);

            if (event.streams && event.streams[0]) {
                const stream = event.streams[0];
                console.log(`Remote stream received: ID=${stream.id}, tracks=${stream.getTracks().length}`);

                // Ensure video tracks are enabled and unmuted
                stream.getTracks().forEach(track => {
                    console.log(`Stream contains track: ${track.kind} (${track.id}), enabled: ${track.enabled}, muted: ${track.muted}`);
                    track.enabled = true;
                    if (track.kind === 'video' && track.muted) {
                        console.log('Attempting to unmute video track');
                    }
                });

                // Store the stream reference
                remoteStreamRef.current = stream;

                // Set up track-specific listeners
                event.track.onunmute = () => {
                    console.log(`Track unmuted: ${event.track.kind}`);
                    if (remoteStreamRef.current) {
                        console.log('Track unmuted, updating video display');
                        updateRemoteVideo(remoteStreamRef.current);
                    }
                };

                // Immediately update the remote video with a slight delay to ensure readiness
                setTimeout(() => {
                    updateRemoteVideo(stream);
                }, 100);

                // Set up periodic checks to ensure video is playing
                if (pc.streamCheckInterval) {
                    clearInterval(pc.streamCheckInterval);
                }

                pc.streamCheckInterval = setInterval(() => {
                    if (remoteVideoRef.current && remoteStreamRef.current) {
                        if (remoteVideoRef.current.paused ||
                            !remoteVideoRef.current.srcObject ||
                            remoteVideoRef.current.readyState === 0) {
                            console.log('Video not playing, reconnecting stream');
                            updateRemoteVideo(remoteStreamRef.current);
                        }
                    }
                }, 3000);
            }
        };

        // Enhanced connection state monitoring
        pc.onconnectionstatechange = () => {
            console.log('Connection state changed:', pc.connectionState);
            setConnectionStatus(`WebRTC: ${pc.connectionState}`);

            if (pc.connectionState === 'connected') {
                console.log('Peer connection successfully established!');

                // Once connected, check again to make sure video is playing
                setTimeout(() => {
                    if (remoteVideoRef.current && (!remoteVideoRef.current.srcObject || remoteVideoRef.current.paused) && remoteStreamRef.current) {
                        console.log('Connected but video not showing, reconnecting stream');
                        updateRemoteVideo(remoteStreamRef.current);
                    }
                }, 1000);
            } else if (pc.connectionState === 'failed') {
                console.error('Peer connection failed');
                setLastError('Connection failed. Attempting auto-recovery...');

                // More aggressive recovery
                setTimeout(() => diagnoseAndRecoverConnection(), 1000);
            } else if (pc.connectionState === 'disconnected') {
                console.warn('Peer connection disconnected, attempting to recover');

                // Wait briefly to see if it reconnects on its own
                setTimeout(() => {
                    if (pc.connectionState === 'disconnected') {
                        pc.restartIce();
                    }
                }, 2000);
            }
        };

        return pc;
    };

    // Send signaling data to the server
    const sendSignalingData = (data) => {
        if (stompClientRef.current && stompClientRef.current.connected) {
            console.log('Sending signal:', data);
            stompClientRef.current.publish({
                destination: '/app/signal',
                body: JSON.stringify({
                    ...data,
                    senderUserId: registeredId
                })
            });
        } else {
            console.error('WebSocket connection not established. Cannot send:', data);
            setLastError('WebSocket connection not established');
        }
    };

    const diagnoseAndRecoverConnection = async () => {
        console.log('Diagnosing WebRTC connection issues...');

        const pc = peerConnectionRef.current;
        if (!pc) {
            console.log('No peer connection to diagnose');
            return;
        }

        // Log complete connection state
        console.log('Connection state diagnosis:');
        console.log('- Signaling state:', pc.signalingState);
        console.log('- ICE connection state:', pc.iceConnectionState);
        console.log('- ICE gathering state:', pc.iceGatheringState);
        console.log('- Connection state:', pc.connectionState);

        // Check remote stream status
        if (remoteStreamRef.current) {
            console.log('Remote stream exists with tracks:', remoteStreamRef.current.getTracks().length);
            remoteStreamRef.current.getTracks().forEach(track => {
                console.log(`Track: ${track.kind}, enabled: ${track.enabled}, muted: ${track.muted}, readyState: ${track.readyState}`);

                // Ensure tracks are enabled
                if (!track.enabled) {
                    console.log(`Enabling disabled ${track.kind} track`);
                    track.enabled = true;
                }
            });
        } else {
            console.log('No remote stream available');
        }

        // Check video element status
        if (remoteVideoRef.current) {
            console.log('Video element status:');
            console.log('- Has srcObject:', remoteVideoRef.current.srcObject ? 'Yes' : 'No');
            console.log('- ReadyState:', remoteVideoRef.current.readyState);
            console.log('- Paused:', remoteVideoRef.current.paused);
            console.log('- Seeking:', remoteVideoRef.current.seeking);
            console.log('- Duration:', remoteVideoRef.current.duration);
            console.log('- Network state:', remoteVideoRef.current.networkState);
        }

        // Connection recovery attempts based on diagnosis
        try {
            // 1. Try ICE restart if connection is failed/disconnected
            if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
                console.log('Attempting ICE restart...');

                pc.restartIce();

                // Only create a new offer if we're in a stable state
                if (pc.signalingState === 'stable') {
                    console.log('Creating new offer after ICE restart...');
                    const offer = await pc.createOffer({iceRestart: true});
                    await pc.setLocalDescription(offer);

                    // Send the new offer to the peer
                    sendSignalingData({
                        type: 'OFFER',
                        offer: pc.localDescription,
                        targetUserId: pc.currentCallTarget
                    });
                }
            }

            // 2. For 'new' state that's stuck, try to initialize the connection properly
            if (pc.iceConnectionState === 'new' && pc.connectionState === 'new') {
                console.log('Connection appears to be stuck in new state');

                if (pc.signalingState === 'stable' && pc.currentCallTarget) {
                    console.log('Creating initial offer...');
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);

                    sendSignalingData({
                        type: 'OFFER',
                        offer: pc.localDescription,
                        targetUserId: pc.currentCallTarget
                    });
                }
            }

            // 3. Re-apply any pending ICE candidates
            if (pendingCandidates.length > 0) {
                console.log('Re-applying pending ICE candidates:', pendingCandidates.length);
                await applyPendingCandidates();
            }

            // 4. Try to reconnect video if connection appears ok but video isn't showing
            if ((pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed' ||
                    pc.iceConnectionState === 'checking') && remoteStreamRef.current &&
                (!remoteVideoRef.current.srcObject || remoteVideoRef.current.paused)) {

                console.log('Connection seems OK but video not showing, reconnecting stream...');
                updateRemoteVideo(remoteStreamRef.current);
            }
        } catch (err) {
            console.error('Error in recovery attempts:', err);
            setLastError('Recovery attempt failed: ' + err.message);
        }

        // Final fallback: If everything else failed, try a complete renegotiation
        if (pc.iceConnectionState === 'failed' && pc.connectionState === 'failed') {
            console.log('Connection completely failed, attempting full renegotiation');

            // Recreate the peer connection from scratch
            resetCall();

            // Wait a moment before reestablishing
            setTimeout(() => {
                if (pc.currentCallTarget) {
                    const target = pc.currentCallTarget;
                    initializePeerConnection(target);

                    // Start a new call after brief delay
                    setTimeout(() => {
                        console.log('Reinitiating call to', target);
                        setTargetUserId(target);
                        startCall();
                    }, 1000);
                }
            }, 2000);
        }
    };

    // Apply pending ICE candidates
    const applyPendingCandidates = async () => {
        const pc = peerConnectionRef.current;
        if (pc && pc.remoteDescription && pendingCandidates.length > 0) {
            console.log('Applying stored ICE candidates:', pendingCandidates.length);

            const promises = pendingCandidates.map(async (candidateData) => {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidateData));
                    console.log('Applied stored ICE candidate successfully');
                    return true;
                } catch (err) {
                    console.error('Error applying stored candidate:', err);
                    return false;
                }
            });

            await Promise.all(promises);
            setPendingCandidates([]);
        }
    };

    // Handle incoming signaling data
    const handleSignalingData = async (data) => {
        const {type, senderUserId} = data;
        console.log('Handling signal:', type, 'from', senderUserId);

        if (data.errorMessage) {
            setLastError(data.errorMessage);
            alert('Error: ' + data.errorMessage);
            return;
        }

        switch (type) {
            case 'CALL_REQUEST':
                console.log('Received call request from:', senderUserId);
                setIncomingCall(true);
                setCallerId(senderUserId);
                break;

            case 'CALL_ACCEPTED':
                console.log('Call accepted by:', senderUserId);
                // Create and send offer if call is accepted
                let pc = initializePeerConnection(senderUserId);

                try {
                    const offer = await pc.createOffer();
                    await pc.setLocalDescription(offer);
                    console.log('Created offer:', offer);

                    sendSignalingData({
                        type: 'OFFER',
                        offer: pc.localDescription,
                        targetUserId: senderUserId
                    });

                    setCallInProgress(true);
                } catch (error) {
                    console.error('Error creating offer:', error);
                    setLastError('Error creating offer: ' + error.message);
                }
                break;

            case 'OFFER':
                console.log('Received offer from:', senderUserId);
                // Initialize peer connection with sender as target and set remote description
                const peerConn = initializePeerConnection(senderUserId);

                try {
                    await peerConn.setRemoteDescription(new RTCSessionDescription(data.offer));
                    console.log('Set remote description from offer');
                    await applyPendingCandidates();
                    const answer = await peerConn.createAnswer();
                    await peerConn.setLocalDescription(answer);
                    console.log('Created answer:', answer);

                    sendSignalingData({
                        type: 'ANSWER',
                        answer: peerConn.localDescription,
                        targetUserId: senderUserId
                    });

                    setCallInProgress(true);
                } catch (error) {
                    console.error('Error handling offer:', error);
                    setLastError('Error handling offer: ' + error.message);
                }
                break;

            case 'ANSWER':
                console.log('Received answer from:', senderUserId);
                try {
                    const pc = peerConnectionRef.current;
                    if (pc) {
                        // Check the signaling state before applying the remote description
                        if (pc.signalingState === 'have-local-offer') {
                            await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                            console.log('Set remote description from answer');

                            // Apply any pending ICE candidates
                            await applyPendingCandidates();

                            // Force a check of the video stream connection
                            setTimeout(() => {
                                if (remoteStreamRef.current && !remoteVideoRef.current.srcObject) {
                                    console.log('Reconnecting remote stream after answer processing');
                                    updateRemoteVideo(remoteStreamRef.current);
                                }
                            }, 1000);
                        } else {
                            console.warn(`Cannot set remote description in signaling state: ${pc.signalingState}`);
                            setLastError(`Invalid signaling state for answer: ${pc.signalingState}`);

                            // If peer connection is in stable state, we might need to recreate the offer
                            if (pc.signalingState === 'stable') {
                                console.log('Connection in stable state, recreating offer...');
                                try {
                                    const offer = await pc.createOffer();
                                    await pc.setLocalDescription(offer);

                                    sendSignalingData({
                                        type: 'OFFER',
                                        offer: pc.localDescription,
                                        targetUserId: senderUserId
                                    });
                                } catch (e) {
                                    console.error('Error recreating offer:', e);
                                }
                            }
                        }
                    } else {
                        console.error('No peer connection established');
                        setLastError('No peer connection established');
                    }
                } catch (error) {
                    console.error('Error setting remote description:', error);
                    setLastError('Error setting remote description: ' + error.message);
                }
                break;

            case 'CALL_REJECTED':
                console.log('Call rejected by:', senderUserId);
                alert(`Call rejected by ${senderUserId}`);
                resetCall();
                break;

            case 'ICE_CANDIDATE':
                console.log('Received ICE candidate from:', senderUserId);
                try {
                    const candidate = new RTCIceCandidate(data.candidate);

                    // If we don't have a peer connection yet, create one
                    let pc = peerConnectionRef.current;
                    if (!pc) {
                        console.log('Creating new peer connection for ICE candidate');
                        pc = initializePeerConnection(senderUserId);
                    }

                    if (pc.remoteDescription) {
                        console.log('Adding ICE candidate immediately');
                        await pc.addIceCandidate(candidate);
                    } else {
                        console.log('Storing ICE candidate for later');
                        setPendingCandidates(prev => [...prev, data.candidate]);
                    }
                } catch (error) {
                    console.error('Error handling ICE candidate:', error);
                    setLastError('Error handling ICE candidate: ' + error.message);
                }
                break;

            case 'HANG_UP':
                console.log('Call ended by:', senderUserId);
                alert(`Call ended by ${senderUserId}`);
                resetCall();
                break;

            default:
                console.log('Unknown signal type:', type);
        }
    };

    // Initiate a call to another user
    const startCall = () => {
        if (!targetUserId || targetUserId.trim() === '') {
            alert('Please enter a target user ID');
            return;
        }

        console.log('Initiating call to:', targetUserId);
        sendSignalingData({
            type: 'CALL_REQUEST',
            targetUserId: targetUserId
        });
    };

    // Accept incoming call
    const acceptCall = () => {
        console.log('Accepting call from:', callerId);
        setIncomingCall(false);
        setCallInProgress(true);
        setTargetUserId(callerId);

        // Initialize peer connection with the caller ID
        initializePeerConnection(callerId);

        // Then send the acceptance
        sendSignalingData({
            type: 'CALL_ACCEPTED',
            targetUserId: callerId
        });
    };

    // Reject incoming call
    const rejectCall = () => {
        console.log('Rejecting call from:', callerId);
        setIncomingCall(false);

        sendSignalingData({
            type: 'CALL_REJECTED',
            targetUserId: callerId
        });

        setCallerId('');
    };

    // End the current call
    const endCall = () => {
        const currentTarget = callInProgress ? (callerId || targetUserId) : targetUserId;
        console.log('Ending call with:', currentTarget);

        sendSignalingData({
            type: 'HANG_UP',
            targetUserId: currentTarget
        });
        onClose();
        resetCall();
    };

    // Improved reset call state function
    const resetCall = () => {
        console.log('Resetting call state');
        setCallInProgress(false);
        setIncomingCall(false);
        setCallerId('');

        // Clear any stream check intervals
        if (peerConnectionRef.current && peerConnectionRef.current.streamCheckInterval) {
            clearInterval(peerConnectionRef.current.streamCheckInterval);
            peerConnectionRef.current.streamCheckInterval = null;
        }

        // Stop all tracks from the remote stream
        if (remoteStreamRef.current) {
            remoteStreamRef.current.getTracks().forEach(track => {
                track.stop();
                console.log(`Stopped remote track: ${track.kind}`);
            });
            remoteStreamRef.current = null;
        }

        // Clean up and close the peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Clear the remote video element
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        // Reset state
        setPendingCandidates([]);
    };

    // Force refresh remote video stream
    const forceRefreshRemoteVideo = () => {
        if (remoteStreamRef.current) {
            console.log('Forcing video refresh');
            updateRemoteVideo(remoteStreamRef.current);
        } else {
            console.log('No remote stream to refresh');
            setLastError('No remote stream available');
        }
    };

    // Clean up when component unmounts
    useEffect(() => {
        return () => {
            // Clean up any existing peer connection
            if (peerConnectionRef.current) {
                // Clear any interval
                if (peerConnectionRef.current.streamCheckInterval) {
                    clearInterval(peerConnectionRef.current.streamCheckInterval);
                    peerConnectionRef.current.streamCheckInterval = null;
                }

                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }

            // Stop all tracks from local stream
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log(`Stopped local track: ${track.kind}`);
                });
                localStreamRef.current = null;
            }

            // Stop all tracks from remote stream
            if (remoteStreamRef.current) {
                remoteStreamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log(`Stopped remote track: ${track.kind}`);
                });
                remoteStreamRef.current = null;
            }

            // Close WebSocket connection
            if (stompClientRef.current && stompClientRef.current.active) {
                stompClientRef.current.deactivate();
                stompClientRef.current = null;
            }

            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => {
                    track.stop();
                    console.log(`Stopped screen sharing track: ${track.kind}`);
                });
                screenStreamRef.current = null;
            }
        };
    }, []);
    return (
        <Dialog
            open={open}
            onClose={endCall}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: '#1a1a1a',
                    color: 'white',
                    height: isMinimized ? '120px' : '90vh',
                    maxHeight: isMinimized ? '120px' : '90vh', // Height changes based on minimize state
                    transition: 'height 0.3s ease, max-height 0.3s ease'
                }
            }}
            // Remove the default close button by setting disableEscapeKeyDown
            disableEscapeKeyDown
        >
            <DialogContent sx={{p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%'}}>
                {/* Window controls bar */}
                <Box sx={{
                    bgcolor: '#111',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1,
                    borderBottom: '1px solid #333'
                }}>
                    <Typography variant="subtitle1" sx={{fontWeight: 'bold', ml: 1}}>
                        WebRTC Video Meetings
                    </Typography>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <IconButton
                            size="small"
                            onClick={() => setIsMinimized(prev => !prev)}
                            sx={{color: 'white'}}
                        >
                            {isMinimized ? <Fullscreen fontSize="small"/> : <FullscreenExit fontSize="small"/>}
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={endCall}
                            sx={{color: 'white'}}
                        >
                            <Close fontSize="small"/>
                        </IconButton>
                    </Box>
                </Box>

                {/* Main container with consistent height */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    bgcolor: '#f5f5f5',
                    visibility: isMinimized ? 'hidden' : 'visible',
                    overflow: isMinimized ? 'hidden' : 'visible',
                }}>
                    {/* App Bar */}
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                                WebRTC Video Meetings
                            </Typography>
                            <Chip
                                label={connectionStatus}
                                color={connectionStatus === "Connected" ? "success" : connectionStatus === "Online" ? "primary" : "default"}
                                size="small"
                                sx={{mr: 2}}
                            />
                            {registeredId && (
                                <Chip
                                    label={`User: ${registeredId}`}
                                    variant="outlined"
                                    color="secondary"
                                    size="small"
                                />
                            )}
                        </Toolbar>
                    </AppBar>

                    {/* Main Content - Fixed with proper flex */}
                    <Box sx={{
                        flexGrow: 1,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto', // Allow content scrolling if needed
                        height: 'calc(100% - 64px - 68px)' // Total height minus AppBar and Controls (if visible)
                    }}>
                        {/* Error Display */}
                        {lastError && (
                            <Paper
                                elevation={0}
                                sx={{
                                    mb: 2,
                                    p: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: '#ffebee',
                                    color: '#c62828'
                                }}
                            >
                                <Warning color="error" sx={{mr: 1}}/>
                                <Typography variant="body2">{lastError}</Typography>
                            </Paper>
                        )}

                        {/* Registration or Call Controls */}
                        {!registeredId ? (
                            <Paper elevation={3} sx={{p: 3, mb: 3}}>
                                <Typography variant="h6" gutterBottom>
                                    Register to Start
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <TextField
                                        label="Your User ID"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<PersonAdd/>}
                                        onClick={registerUser}
                                    >
                                        Register
                                    </Button>
                                </Box>
                            </Paper>
                        ) : !callInProgress && !incomingCall && (
                            <Paper elevation={3} sx={{p: 3, mb: 3}}>
                                <Typography variant="h6" gutterBottom>
                                    Start a Call
                                </Typography>
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                    <TextField
                                        label="Target User ID"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={targetUserId}
                                        onChange={(e) => setTargetUserId(e.target.value)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Call/>}
                                        onClick={startCall}
                                    >
                                        Call
                                    </Button>
                                </Box>
                            </Paper>
                        )}

                        {/* Incoming Call Dialog */}
                        <Dialog
                            open={incomingCall}
                            TransitionComponent={Transition}
                            keepMounted
                        >
                            <DialogTitle>
                                <Box sx={{display: 'flex', alignItems: 'center'}}>
                                    <Call sx={{mr: 1, color: 'primary.main'}}/>
                                    Incoming Call
                                </Box>
                            </DialogTitle>
                            <DialogContent>
                                <Typography>
                                    {`${callerId} is calling you`}
                                </Typography>
                            </DialogContent>
                            <DialogActions sx={{justifyContent: 'center', pb: 2}}>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<CheckCircle/>}
                                    onClick={acceptCall}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<Cancel/>}
                                    onClick={rejectCall}
                                >
                                    Decline
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Video Container - Improved layout */}
                        <Box sx={{
                            flexGrow: 1,
                            display: 'flex',
                            flexDirection: {xs: 'column', md: 'row'},
                            gap: 2,
                            height: {xs: 'auto', md: 'calc(100% - 70px)'}, // Adjust height based on content above
                            minHeight: {xs: '400px', md: '0'} // Ensure minimum height on mobile
                        }}>
                            {/* Local Video */}
                            <Card sx={{
                                flex: {xs: '1 1 auto', md: '0 0 30%'}, // Different flex basis on desktop/mobile
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                bgcolor: '#000',
                                minHeight: {xs: '200px', md: '100%'}, // Full height on desktop
                                height: {xs: '200px', md: 'auto'}
                            }}>
                                <Box sx={{position: 'absolute', top: 8, left: 8, zIndex: 2}}>
                                    <Chip
                                        label="You"
                                        size="small"
                                        color="primary"
                                        sx={{opacity: 0.8}}
                                    />
                                </Box>
                                <Box sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden' // Prevent content overflow
                                }}>
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        muted
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover', // Cover available space
                                            display: isVideoMuted ? 'none' : 'block'
                                        }}
                                    />
                                    {isVideoMuted && (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            color: 'white'
                                        }}>
                                            <VideocamOff sx={{fontSize: 40, mb: 1}}/>
                                            <Typography variant="body2">Camera Off</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Card>

                            {/* Remote Video */}
                            <Card sx={{
                                flex: {xs: '1 1 auto', md: '1 1 70%'}, // Larger size on desktop
                                display: 'flex',
                                flexDirection: 'column',
                                bgcolor: '#000',
                                minHeight: {xs: '200px', md: '100%'}, // Full height on desktop
                                height: {xs: '200px', md: 'auto'},
                                position: 'relative'
                            }}>
                                <Box sx={{position: 'absolute', top: 8, left: 8, zIndex: 2}}>
                                    <Chip
                                        label={targetUserId || "Remote User"}
                                        size="small"
                                        color="secondary"
                                        sx={{opacity: 0.8}}
                                    />
                                </Box>

                                {callInProgress && (
                                    <Box sx={{position: 'absolute', top: 8, right: 8, zIndex: 2}}>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            sx={{bgcolor: 'rgba(255,255,255,0.2)'}}
                                            onClick={forceRefreshRemoteVideo}
                                        >
                                            <Refresh fontSize="small"/>
                                        </IconButton>
                                    </Box>
                                )}

                                <Box sx={{
                                    flexGrow: 1,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden' // Prevent content overflow
                                }}>
                                    <video
                                        ref={remoteVideoRef}
                                        autoPlay
                                        playsInline
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover', // Cover available space
                                            display: callInProgress ? 'block' : 'none'
                                        }}
                                    />
                                    {!callInProgress && (
                                        <Box sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            color: 'rgba(255,255,255,0.7)'
                                        }}>
                                            <Videocam sx={{fontSize: 48, mb: 2}}/>
                                            <Typography>No call in progress</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Card>
                        </Box>
                    </Box>

                    {/* Controls */}
                    {callInProgress && (
                        <Paper
                            elevation={4}
                            sx={{
                                p: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                gap: 2,
                                bgcolor: '#f5f5f5',
                                borderTop: '1px solid #e0e0e0',
                                position: 'relative', // Ensure it stays at the bottom
                                zIndex: 3
                            }}
                        >
                            <IconButton
                                color={isAudioMuted ? "default" : "primary"}
                                onClick={toggleAudioMute}
                                sx={{
                                    bgcolor: isAudioMuted ? '#e0e0e0' : 'rgba(25, 118, 210, 0.1)',
                                    p: 2
                                }}
                            >
                                {isAudioMuted ? <MicOff/> : <Mic/>}
                            </IconButton>

                            <IconButton
                                color={isVideoMuted ? "default" : "primary"}
                                onClick={toggleVideoMute}
                                sx={{
                                    bgcolor: isVideoMuted ? '#e0e0e0' : 'rgba(25, 118, 210, 0.1)',
                                    p: 2
                                }}
                            >
                                {isVideoMuted ? <VideocamOff/> : <Videocam/>}
                            </IconButton>

                            <IconButton
                                color={isScreenSharing ? "secondary" : "default"}
                                onClick={toggleScreenSharing}
                                sx={{
                                    bgcolor: isScreenSharing ? 'rgba(156, 39, 176, 0.1)' : '#e0e0e0',
                                    p: 2
                                }}
                            >
                                {isScreenSharing ? <StopScreenShare/> : <ScreenShare/>}
                            </IconButton>

                            <IconButton
                                color="error"
                                onClick={endCall}
                                sx={{
                                    bgcolor: 'rgba(211, 47, 47, 0.1)',
                                    p: 2
                                }}
                            >
                                <CallEnd/>
                            </IconButton>

                            <IconButton
                                color="info"
                                onClick={diagnoseAndRecoverConnection}
                                sx={{
                                    bgcolor: 'rgba(2, 136, 209, 0.1)',
                                    p: 2
                                }}
                            >
                                <Settings/>
                            </IconButton>
                        </Paper>
                    )}
                </Box>

                {/* Minimized state content */}
                {isMinimized && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        height: '100%',
                        bgcolor: '#212121'
                    }}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <Videocam sx={{color: 'primary.main', mr: 2}}/>
                            <Box>
                                <Typography variant="body1" sx={{color: 'white', fontWeight: 'medium'}}>
                                    {callInProgress ? `Call with ${targetUserId}` : 'WebRTC Video Meetings'}
                                </Typography>
                                <Typography variant="body2" sx={{color: '#aaa'}}>
                                    {callInProgress ? 'Call in progress' : 'Ready to connect'}
                                </Typography>
                            </Box>
                        </Box>

                        {callInProgress && (
                            <Box sx={{display: 'flex', gap: 1}}>
                                <IconButton size="small" color="primary" sx={{bgcolor: 'rgba(255,255,255,0.1)'}}>
                                    {isAudioMuted ? <MicOff fontSize="small"/> : <Mic fontSize="small"/>}
                                </IconButton>
                                <IconButton size="small" color="error" sx={{bgcolor: 'rgba(255,255,255,0.1)'}}>
                                    <CallEnd fontSize="small"/>
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default VideoCallModal;