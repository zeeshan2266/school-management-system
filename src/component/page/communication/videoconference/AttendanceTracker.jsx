import React, { useState, useEffect } from "react";
import { DataPacket_Kind, RoomEvent } from "livekit-client";
import { format } from "date-fns";
import './AttendanceTracker.css';

export function AttendanceTracker({ room, localParticipant, userName, userRole, roomInfo }) {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [activeParticipants, setActiveParticipants] = useState([]);
    const [showExport, setShowExport] = useState(false);
    const [exportFormat, setExportFormat] = useState('csv');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'joinTime', direction: 'desc' });
    const [reportData, setReportData] = useState(null);

    // Track when participants join and leave
    useEffect(() => {
        if (!room) return;

        const handleParticipantConnected = (participant) => {
            const joinTime = new Date();
            const participantInfo = {
                id: participant.identity,
                name: participant.name || participant.identity,
                role: participant.metadata ? JSON.parse(participant.metadata).role : 'student',
                joinTime: joinTime,
                leaveTime: null,
                duration: 0,
                active: true,
                sessionId: Date.now().toString() + Math.random().toString(36).substring(2, 9)
            };

            setActiveParticipants(prev => [...prev, participantInfo]);
            setAttendanceRecords(prev => [...prev, participantInfo]);

            // Broadcast the join event to other participants
            broadcastAttendanceEvent('join', participantInfo);
        };

        const handleParticipantDisconnected = (participant) => {
            const leaveTime = new Date();

            setActiveParticipants(prev => {
                return prev.filter(p => p.id !== participant.identity);
            });

            setAttendanceRecords(prev => {
                return prev.map(record => {
                    if (record.id === participant.identity && record.active) {
                        // Calculate duration in minutes
                        const durationMs = leaveTime - new Date(record.joinTime);
                        const durationMinutes = Math.floor(durationMs / 60000);

                        const updatedRecord = {
                            ...record,
                            leaveTime: leaveTime,
                            duration: durationMinutes,
                            active: false
                        };

                        // Broadcast the leave event to other participants
                        broadcastAttendanceEvent('leave', updatedRecord);

                        return updatedRecord;
                    }
                    return record;
                });
            });
        };

        // Listen for data messages containing attendance data
        const handleDataReceived = (payload, participant) => {
            try {
                const data = JSON.parse(new TextDecoder().decode(payload));
                if (data.type === 'attendance') {
                    // Handle attendance event from other participants
                    if (data.event === 'join') {
                        // Add to active participants if not already there
                        setActiveParticipants(prev => {
                            if (!prev.find(p => p.sessionId === data.participant.sessionId)) {
                                return [...prev, data.participant];
                            }
                            return prev;
                        });

                        // Add to attendance records if not already there
                        setAttendanceRecords(prev => {
                            if (!prev.find(p => p.sessionId === data.participant.sessionId)) {
                                return [...prev, data.participant];
                            }
                            return prev;
                        });
                    }
                    else if (data.event === 'leave') {
                        // Remove from active participants
                        setActiveParticipants(prev =>
                            prev.filter(p => p.sessionId !== data.participant.sessionId)
                        );

                        // Update attendance record
                        setAttendanceRecords(prev => {
                            return prev.map(record => {
                                if (record.sessionId === data.participant.sessionId) {
                                    return {
                                        ...data.participant,
                                        leaveTime: new Date(data.participant.leaveTime),
                                        joinTime: new Date(data.participant.joinTime)
                                    };
                                }
                                return record;
                            });
                        });
                    }
                    else if (data.event === 'sync_request' && userRole === 'instructor') {
                        // Only instructors respond to sync requests
                        sendAttendanceSync(participant.identity);
                    }
                    else if (data.event === 'sync_data') {
                        // Handle receiving sync data (full attendance list)
                        setAttendanceRecords(data.records.map(record => ({
                            ...record,
                            joinTime: new Date(record.joinTime),
                            leaveTime: record.leaveTime ? new Date(record.leaveTime) : null
                        })));

                        setActiveParticipants(data.activeParticipants.map(record => ({
                            ...record,
                            joinTime: new Date(record.joinTime),
                            leaveTime: record.leaveTime ? new Date(record.leaveTime) : null
                        })));
                    }
                }
            } catch (e) {
                console.error('Error parsing attendance data:', e);
            }
        };

        // When component mounts, check if user is instructor and send sync request
        if (userRole !== 'instructor') {
            requestAttendanceSync();
        } else {
            // If this is the instructor, add themselves to the attendance
            // This is needed because the connected event might already be fired
            if (localParticipant && !attendanceRecords.find(r => r.id === localParticipant.identity)) {
                const joinTime = new Date();
                const participantInfo = {
                    id: localParticipant.identity,
                    name: userName || localParticipant.identity,
                    role: userRole,
                    joinTime: joinTime,
                    leaveTime: null,
                    duration: 0,
                    active: true,
                    sessionId: Date.now().toString() + Math.random().toString(36).substring(2, 9)
                };

                setActiveParticipants(prev => [...prev, participantInfo]);
                setAttendanceRecords(prev => [...prev, participantInfo]);
            }
        }

        room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
        room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
        room.on(RoomEvent.DataReceived, handleDataReceived);

        return () => {
            room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
            room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
            room.off(RoomEvent.DataReceived, handleDataReceived);
        };
    }, [room, localParticipant, userName, userRole]);

    // For generating real-time duration updates for active participants
    useEffect(() => {
        // Update durations for active participants every minute
        const interval = setInterval(() => {
            const now = new Date();
            setAttendanceRecords(prev => {
                return prev.map(record => {
                    if (record.active) {
                        const durationMs = now - new Date(record.joinTime);
                        const durationMinutes = Math.floor(durationMs / 60000);
                        return {
                            ...record,
                            duration: durationMinutes
                        };
                    }
                    return record;
                });
            });
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Request attendance sync from instructor when joining
    const requestAttendanceSync = () => {
        if (!room || !localParticipant) return;

        const syncRequest = {
            type: 'attendance',
            event: 'sync_request',
            requesterId: localParticipant.identity
        };

        const data = new TextEncoder().encode(JSON.stringify(syncRequest));
        room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);
    };

    // Send attendance data to a specific participant (used when responding to sync requests)
    const sendAttendanceSync = (requesterId) => {
        if (!room || !localParticipant) return;

        const syncData = {
            type: 'attendance',
            event: 'sync_data',
            records: attendanceRecords,
            activeParticipants: activeParticipants
        };

        const data = new TextEncoder().encode(JSON.stringify(syncData));
        room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);
    };

    // Broadcast attendance event to all participants
    const broadcastAttendanceEvent = (eventType, participantInfo) => {
        if (!room || !localParticipant) return;

        const eventData = {
            type: 'attendance',
            event: eventType,
            participant: participantInfo,
            timestamp: new Date().toISOString()
        };

        const data = new TextEncoder().encode(JSON.stringify(eventData));
        room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);
    };

    // Format the time for display
    const formatTime = (time) => {
        if (!time) return "Still active";
        return format(new Date(time), 'HH:mm:ss');
    };

    // Format the date for display
    const formatDate = (date) => {
        if (!date) return "";
        return format(new Date(date), 'yyyy-MM-dd');
    };

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Apply sorting
    const sortedRecords = React.useMemo(() => {
        let sortableRecords = [...attendanceRecords];
        if (sortConfig.key) {
            sortableRecords.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableRecords;
    }, [attendanceRecords, sortConfig]);

    // Filter records by search term
    const filteredRecords = React.useMemo(() => {
        return sortedRecords.filter(record => {
            return record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                record.role.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [sortedRecords, searchTerm]);

    // Generate report data for export
    const generateReport = () => {
        const now = new Date();

        // Update duration for active participants
        const updatedRecords = attendanceRecords.map(record => {
            if (record.active) {
                const durationMs = now - new Date(record.joinTime);
                const durationMinutes = Math.floor(durationMs / 60000);
                return {
                    ...record,
                    duration: durationMinutes
                };
            }
            return record;
        });

        // Create CSV data
        if (exportFormat === 'csv') {
            const csvRows = [];
            // Header row
            csvRows.push(['ID', 'Name', 'Role', 'Join Date', 'Join Time', 'Leave Time', 'Duration (minutes)', 'Status'].join(','));

            // Data rows
            updatedRecords.forEach(record => {
                const row = [
                    record.id,
                    `"${record.name}"`,
                    record.role,
                    formatDate(record.joinTime),
                    formatTime(record.joinTime),
                    record.active ? 'Still active' : formatTime(record.leaveTime),
                    record.duration,
                    record.active ? 'Active' : 'Left'
                ];
                csvRows.push(row.join(','));
            });

            // Join rows with newlines
            const csvString = csvRows.join('\n');

            // Create a Blob containing the CSV data
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            setReportData({
                fileName: `attendance_${roomInfo.name}_${format(now, 'yyyyMMdd_HHmmss')}.csv`,
                blob: blob,
                url: URL.createObjectURL(blob)
            });
        }
        // Create JSON data
        else if (exportFormat === 'json') {
            const jsonData = {
                roomName: roomInfo.name,
                exportTime: now.toISOString(),
                attendanceRecords: updatedRecords.map(record => ({
                    ...record,
                    joinTime: new Date(record.joinTime).toISOString(),
                    leaveTime: record.leaveTime ? new Date(record.leaveTime).toISOString() : null
                }))
            };

            const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
            setReportData({
                fileName: `attendance_${roomInfo.name}_${format(now, 'yyyyMMdd_HHmmss')}.json`,
                blob: blob,
                url: URL.createObjectURL(blob)
            });
        }
    };

    const downloadReport = () => {
        if (!reportData) return;

        // Create a temporary anchor element to trigger download
        const a = document.createElement('a');
        a.href = reportData.url;
        a.download = reportData.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Calculate total attendance stats
    const totalAttendees = attendanceRecords.length;
    const currentlyActive = activeParticipants.length;
    const averageDuration = attendanceRecords.length > 0
        ? Math.round(attendanceRecords.reduce((acc, record) => acc + record.duration, 0) / attendanceRecords.length)
        : 0;

    return (
        <div className="attendance-tracker">
            <div className="attendance-header">
                <h2>Attendance Tracker</h2>
                <div className="attendance-summary">
                    <div className="summary-item">
                        <div className="summary-label">Total Attendees</div>
                        <div className="summary-value">{totalAttendees}</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-label">Currently Active</div>
                        <div className="summary-value">{currentlyActive}</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-label">Avg. Duration (min)</div>
                        <div className="summary-value">{averageDuration}</div>
                    </div>
                </div>
            </div>

            <div className="attendance-tools">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search by name, ID, or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                {userRole === 'instructor' && (
                    <div className="export-container">
                        {!showExport ? (
                            <button
                                className="export-button"
                                onClick={() => setShowExport(true)}
                            >
                                Export Attendance
                            </button>
                        ) : (
                            <div className="export-options">
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className="export-format-select"
                                >
                                    <option value="csv">CSV</option>
                                    <option value="json">JSON</option>
                                </select>
                                <button
                                    className="generate-button"
                                    onClick={generateReport}
                                >
                                    Generate
                                </button>
                                <button
                                    className="cancel-button"
                                    onClick={() => setShowExport(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {reportData && (
                <div className="download-report">
                    <div className="download-info">
                        <span className="download-filename">{reportData.fileName}</span>
                        <span className="download-ready">Ready for download</span>
                    </div>
                    <button
                        className="download-button"
                        onClick={downloadReport}
                    >
                        Download
                    </button>
                    <button
                        className="close-button"
                        onClick={() => setReportData(null)}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="attendance-list">
                <table className="attendance-table">
                    <thead>
                    <tr>
                        <th onClick={() => requestSort('name')}>
                            Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('role')}>
                            Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('joinTime')}>
                            Join Time {sortConfig.key === 'joinTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('leaveTime')}>
                            Leave Time {sortConfig.key === 'leaveTime' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('duration')}>
                            Duration (min) {sortConfig.key === 'duration' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('active')}>
                            Status {sortConfig.key === 'active' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredRecords.length > 0 ? (
                        filteredRecords.map((record) => (
                            <tr key={record.sessionId} className={record.active ? 'active-participant' : ''}>
                                <td>{record.name}</td>
                                <td>{record.role}</td>
                                <td>{formatTime(record.joinTime)}</td>
                                <td>{record.active ? 'Still active' : formatTime(record.leaveTime)}</td>
                                <td>{record.duration}</td>
                                <td>
                                        <span className={`status-indicator ${record.active ? 'active' : 'inactive'}`}>
                                            {record.active ? 'Active' : 'Left'}
                                        </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="no-records">
                                {searchTerm ? 'No matching records found' : 'No attendance records yet'}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}