import React from "react";

export const ParticipantUsers = ({roomInfo, userName, userRole, participants = []}) => {
    return <div className="participants-panel">
        <h2>Room: {roomInfo?.name}</h2>
        <div className="room-metadata">
            <p>School: {roomInfo?.schoolId}</p>
            {roomInfo?.className && (
                <p>Class: {roomInfo.className} {roomInfo?.section && `- ${roomInfo.section}`}</p>
            )}
            <p>You: {userName} ({userRole})</p>
            <p>Participants: {participants?.length}</p>
        </div>
        <div className="participants-list">
            {participants.map((participant) => (
                <div key={participant.sid} className="participant-item">
                    <div className="participant-status">
                        <span className={`status-indicator ${participant.isSpeaking ? 'speaking' : ''}`}></span>
                    </div>
                    <div className="participant-info">
                        <div className="participant-name">
                            {participant.identity}
                            {participant.identity === userName && " (You)"}
                        </div>
                        <div className="participant-controls">
                                                    <span className="track-indicator">
                                                        <span
                                                            className={`camera ${participant.isCameraEnabled ? 'on' : 'off'}`}>
                                                            {participant.isCameraEnabled ? '📹' : '🚫'}
                                                        </span>
                                                        <span
                                                            className={`mic ${participant.isMicrophoneEnabled ? 'on' : 'off'}`}>
                                                            {participant.isMicrophoneEnabled ? '🎤' : '🔇'}
                                                        </span>
                                                    </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>;
}