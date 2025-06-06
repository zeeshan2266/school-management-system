import {
    ControlBar,
    GridLayout,
    ParticipantTile,
    RoomAudioRenderer,
    useConnectionState,
    useLocalParticipant,
    useParticipants,
    useRoomContext,
    useTracks
} from "@livekit/components-react";
import React, {useEffect, useRef, useState} from "react";
import {DataPacket_Kind, RoomEvent, Track} from "livekit-client";
import {format} from "date-fns";
import {Whiteboard} from "./Whiteboard";
import {ParticipantUsers} from "./participantUsers";
import {VirtualHand} from "./VirtualHand";
import {PollsQuizzes} from "./PollsQuizzes";
import {AttendanceTracker} from "./AttendanceTracker";
import "./AttendanceTracker.css";
import {PermissionControls} from "./PermissionControls";

export function VideoConferenceComponent({userName, roomInfo, userRole}) {
    const connectionState = useConnectionState();
    const participants = useParticipants();
    const {localParticipant} = useLocalParticipant();
    const room = useRoomContext();

    const [chatMessages, setChatMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [activeTab, setActiveTab] = useState('video'); // 'video', 'chat', 'whiteboard', 'resources', 'hand', 'attendance', 'polls', 'participantUsers'
    const chatContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [attachedFile, setAttachedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [handRaisedCount, setHandRaisedCount] = useState(0);

    // Permission state
    const [permissions, setPermissions] = useState({
        userPermissions: {}, // User-specific permissions
        globalPermissions: {} // Global room permissions
    });

    // Maximum file size (25MB in bytes)
    const MAX_FILE_SIZE = 25 * 1024 * 1024;

    const tracks = useTracks([
        {source: Track.Source.Camera, withPlaceholder: true},
        {source: Track.Source.ScreenShare, withPlaceholder: false}
    ]);

    // Setup permissions listener
    useEffect(() => {
        if (!room || !localParticipant) return;

        const handleDataReceived = (payload, participant) => {
            try {
                const data = JSON.parse(new TextDecoder().decode(payload));
                if (data.type === 'permission_update') {
                    // Update permissions state
                    setPermissions(prevPermissions => {
                        const newPermissions = {...prevPermissions};

                        // Update user-specific permissions
                        if (data.userPermissions && data.userPermissions[localParticipant.identity]) {
                            newPermissions.userPermissions = {
                                ...prevPermissions.userPermissions,
                                [localParticipant.identity]: data.userPermissions[localParticipant.identity]
                            };
                        }

                        // Update global permissions
                        if (data.globalPermissions) {
                            newPermissions.globalPermissions = {
                                ...prevPermissions.globalPermissions,
                                ...data.globalPermissions
                            };
                        }

                        return newPermissions;
                    });
                }
            } catch (e) {
                console.error('Error parsing permission update:', e);
            }
        };

        room.on(RoomEvent.DataReceived, handleDataReceived);

        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
        };
    }, [room, localParticipant]);

    // Setup chat message and hand raise listener
    useEffect(() => {
        if (!room || !localParticipant) return;

        const handleDataReceived = (payload, participant) => {
            try {
                const data = JSON.parse(new TextDecoder().decode(payload));

                if (data.type === 'chat') {
                    // Check if user has permission to see chat messages
                    if (!hasPermission('canSeeChat')) {
                        return;
                    }

                    const newMessage = {
                        id: Date.now().toString(),
                        sender: participant.identity,
                        senderRole: data.role || 'unknown',
                        text: data.message,
                        timestamp: new Date(),
                        isLocal: participant.identity === localParticipant.identity,
                        fileInfo: data.fileInfo
                    };

                    setChatMessages(prev => [...prev, newMessage]);
                } else if (data.type === 'hand_action') {
                    // Update hand raised count for badge display
                    if (data.action === 'raise') {
                        setHandRaisedCount(prev => prev + 1);
                    } else if (data.action === 'lower' || data.action === 'answer') {
                        setHandRaisedCount(prev => Math.max(0, prev - 1));
                    } else if (data.action === 'clear_all') {
                        setHandRaisedCount(0);
                    }
                }
            } catch (e) {
                console.error('Error parsing data message:', e);
            }
        };

        room.on(RoomEvent.DataReceived, handleDataReceived);

        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
        };
    }, [room, localParticipant]);

    // Auto-scroll chat to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current && activeTab === 'chat') {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, activeTab]);

    // Check if user has a specific permission
    const hasPermission = (permissionName) => {
        // Teachers and admins typically have all permissions
        if (userRole === 'teacher' || userRole === 'admin') {
            return true;
        }

        // Check for globally disabled features
        if (permissions.globalPermissions &&
            permissions.globalPermissions[permissionName] === false) {
            return false;
        }

        // Check user-specific permissions
        const userPerms = permissions.userPermissions[localParticipant?.identity];
        if (userPerms && userPerms[permissionName] === false) {
            return false;
        }

        // Default to allowed if not explicitly restricted
        return true;
    };

    const sendChatMessage = async () => {
        if ((!messageText.trim() && !attachedFile) || !room || !localParticipant) return;

        // Check if user has permission to send chat messages
        if (!hasPermission('canSendChat')) {
            alert("You don't have permission to send chat messages.");
            return;
        }

        let fileInfo = null;

        // Handle file upload if a file is attached
        if (attachedFile) {
            // Check if user has permission to share files
            if (!hasPermission('canShareFiles')) {
                alert("You don't have permission to share files.");
                return;
            }

            setIsUploading(true);

            try {
                // Simulate file upload with progress
                for (let i = 0; i <= 100; i += 10) {
                    setUploadProgress(i);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Create a data URL for preview (for demonstration purposes)
                // In a real app, you would upload to a server and get a URL back
                fileInfo = {
                    name: attachedFile.name,
                    size: attachedFile.size,
                    type: attachedFile.type,
                    // In a real implementation, this would be a URL from your server
                    dataUrl: filePreview,
                    timestamp: new Date().toISOString()
                };

            } catch (e) {
                console.error('Error uploading file:', e);
                alert('File upload failed. Please try again.');
                setIsUploading(false);
                setUploadProgress(0);
                return;
            }

            setIsUploading(false);
            setUploadProgress(0);
        }

        const message = {
            type: 'chat',
            message: messageText,
            sender: userName,
            role: userRole,
            timestamp: new Date().toISOString(),
            fileInfo: fileInfo
        };

        const data = new TextEncoder().encode(JSON.stringify(message));
        room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);

        // Add message to local state
        const newMessage = {
            id: Date.now().toString(),
            sender: userName,
            senderRole: userRole,
            text: messageText,
            timestamp: new Date(),
            isLocal: true,
            fileInfo: fileInfo
        };

        setChatMessages(prev => [...prev, newMessage]);
        setMessageText('');
        setAttachedFile(null);
        setFilePreview(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    const formatTime = (date) => {
        return format(date, 'HH:mm');
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if user has permission to share files
        if (!hasPermission('canShareFiles')) {
            alert("You don't have permission to share files.");
            return;
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            alert(`File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`);
            return;
        }

        setAttachedFile(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFilePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            // For non-image files, just show the file name and icon
            setFilePreview(null);
        }
    };

    const cancelFileAttachment = () => {
        setAttachedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (fileType) => {
        if (fileType.startsWith('image/')) return '📷';
        if (fileType.startsWith('video/')) return '🎬';
        if (fileType.startsWith('audio/')) return '🎵';
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word') || fileType.includes('document')) return '📝';
        if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
        if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📊';
        return '📎';
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const handleDownload = (fileInfo) => {
        // In a real implementation, this would download from your server
        // For this demo, we're just using the data URL directly
        const link = document.createElement('a');
        link.href = fileInfo.dataUrl;
        link.download = fileInfo.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Check if user should show permission controls (only for teachers/admins)
    const canManagePermissions = () => {
        return userRole === 'teacher' || userRole === 'admin';
    };

    return (
        <div className="conference">
            <div className="room-info">
                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
                        onClick={() => setActiveTab('video')}
                    >
                        Video
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
                        onClick={() => setActiveTab('chat')}
                        disabled={!hasPermission('canSeeChat')}
                    >
                        Chat {chatMessages.length > 0 && <span className="badge">{chatMessages.length}</span>}
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'whiteboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('whiteboard')}
                        disabled={!hasPermission('canUseWhiteboard')}
                    >
                        Whiteboard
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'hand' ? 'active' : ''}`}
                        onClick={() => setActiveTab('hand')}
                        disabled={!hasPermission('canRaiseHand')}
                    >
                        Raise Hand {handRaisedCount > 0 && <span className="badge">{handRaisedCount}</span>}
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'polls' ? 'active' : ''}`}
                        onClick={() => setActiveTab('polls')}
                    >
                        Polls & Quizzes
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'participantUsers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('participantUsers')}
                    >
                        Participants
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'attendance' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                        disabled={!hasPermission('canViewAttendance') && userRole !== 'teacher' && userRole !== 'admin'}
                    >
                        Attendance
                    </button>
                    {canManagePermissions() && (
                        <button
                            className={`tab-button ${activeTab === 'permissions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('permissions')}
                        >
                            Permissions
                        </button>
                    )}
                </div>
            </div>

            {connectionState === 'connected' ? (
                <div className="conference-content">
                    {/* Video Grid */}
                    {activeTab === 'video' && (
                        <div className="video-grid">
                            <GridLayout className="grid-layout" tracks={tracks}>
                                <ParticipantTile className="participant-tile"/>
                            </GridLayout>
                        </div>
                    )}

                    {/* Participants Panel */}
                    {activeTab === 'participantUsers' && (
                        <ParticipantUsers
                            roomInfo={roomInfo}
                            userName={userName}
                            userRole={userRole}
                            participants={participants}
                        />
                    )}

                    {/* Chat Panel with File Sharing */}
                    {activeTab === 'chat' && hasPermission('canSeeChat') ? (
                        <div className="chat-container">
                            <div className="chat-header">
                                <h3>Chat</h3>
                                <span>{chatMessages.length} messages</span>
                            </div>

                            <div className="chat-messages" ref={chatContainerRef}>
                                {chatMessages.length === 0 ? (
                                    <div className="empty-chat">
                                        <p>No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    chatMessages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`chat-message ${msg.isLocal ? 'local-message' : 'remote-message'}`}
                                        >
                                            <div className="message-header">
                                                <span className="sender-name">{msg.sender}</span>
                                                <span className="sender-role">{msg.senderRole}</span>
                                                <span className="message-time">{formatTime(msg.timestamp)}</span>
                                            </div>
                                            {msg.text && <div className="message-text">{msg.text}</div>}

                                            {msg.fileInfo && (
                                                <div className="file-attachment">
                                                    {msg.fileInfo.type.startsWith('image/') ? (
                                                        <div className="image-preview">
                                                            <img
                                                                src={msg.fileInfo.dataUrl}
                                                                alt={msg.fileInfo.name}
                                                                onClick={() => window.open(msg.fileInfo.dataUrl, '_blank')}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="file-info"
                                                             onClick={() => handleDownload(msg.fileInfo)}>
                                                            <span
                                                                className="file-icon">{getFileIcon(msg.fileInfo.type)}</span>
                                                            <div className="file-details">
                                                                <div className="file-name">{msg.fileInfo.name}</div>
                                                                <div
                                                                    className="file-size">{formatFileSize(msg.fileInfo.size)}</div>
                                                            </div>
                                                            <button className="download-button">Download</button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="chat-input-container">
                                {attachedFile && (
                                    <div className="attached-file-preview">
                                        <div className="file-preview-info">
                                            <span className="file-icon">{getFileIcon(attachedFile.type)}</span>
                                            <span className="file-name">{attachedFile.name}</span>
                                            <span className="file-size">({formatFileSize(attachedFile.size)})</span>
                                        </div>
                                        <button className="cancel-attachment" onClick={cancelFileAttachment}>×</button>

                                        {filePreview && attachedFile.type.startsWith('image/') && (
                                            <div className="image-thumbnail">
                                                <img src={filePreview} alt="Preview"/>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isUploading && (
                                    <div className="upload-progress">
                                        <div className="progress-bar">
                                            <div className="progress" style={{width: `${uploadProgress}%`}}></div>
                                        </div>
                                        <div className="progress-text">Uploading: {uploadProgress}%</div>
                                    </div>
                                )}

                                <div className="chat-controls">
                                    <textarea
                                        className="chat-input"
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={hasPermission('canSendChat') ? "Type your message..." : "You don't have permission to send messages"}
                                        rows={2}
                                        disabled={isUploading || !hasPermission('canSendChat')}
                                    />

                                    <div className="chat-buttons">
                                        <button
                                            className="attach-button"
                                            onClick={() => fileInputRef.current.click()}
                                            disabled={isUploading || attachedFile || !hasPermission('canShareFiles')}
                                            title={hasPermission('canShareFiles') ? "Attach file (max 25MB)" : "File sharing disabled"}
                                        >
                                            📎
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            style={{display: 'none'}}
                                            onChange={handleFileSelect}
                                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                        />

                                        <button
                                            className="send-button"
                                            onClick={sendChatMessage}
                                            disabled={isUploading || (!messageText.trim() && !attachedFile) || !hasPermission('canSendChat')}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'chat' && (
                        <div className="permission-denied-message">
                            <h3>Chat Access Restricted</h3>
                            <p>You don't currently have permission to access the chat feature.</p>
                        </div>
                    )}

                    {/* Whiteboard Panel */}
                    {activeTab === 'whiteboard' && (
                        <Whiteboard
                            roomInfo={roomInfo}
                            room={room}
                            localParticipant={localParticipant}
                            userRole={userRole}
                        />
                    )}

                    {/* Virtual Hand Raising Panel */}
                    {activeTab === 'hand' && (
                        <VirtualHand
                            room={room}
                            localParticipant={localParticipant}
                            userName={userName}
                            userRole={userRole}
                        />
                    )}

                    {/* Polls and Quizzes Panel */}
                    {activeTab === 'polls' && (
                        <PollsQuizzes
                            room={room}
                            localParticipant={localParticipant}
                            userName={userName}
                            userRole={userRole}
                        />
                    )}

                    {/* Attendance Tracking Panel */}
                    {activeTab === 'attendance' && (
                        <AttendanceTracker
                            room={room}
                            localParticipant={localParticipant}
                            userName={userName}
                            userRole={userRole}
                            roomInfo={roomInfo}
                        />
                    )}

                    {/* Permission Controls Panel - Only for teachers/admins */}
                    {activeTab === 'permissions' && canManagePermissions() && (
                        <PermissionControls
                            room={room}
                            localParticipant={localParticipant}
                            participants={participants}
                            userRole={userRole}
                        />
                    )}

                    <RoomAudioRenderer/>
                    <div className="controls-container">
                        <ControlBar
                            className="control-bar"
                            controls={{
                                camera: true,
                                microphone: true,
                                screenShare: hasPermission('canShareScreen'),
                                leave: true
                            }}
                            variation="minimal"
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                padding: '10px',
                                borderRadius: '10px',
                                zIndex: 1000
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="connecting">Connecting to room...</div>
            )}
        </div>
    );
}