import React, { useState, useEffect, useRef } from "react";
import { capitalize } from "lodash";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  styled,
  Skeleton,
  ListItemAvatar,
  Grid,
  MenuItem,
  FormControl,
  // CloseIcon,
  InputLabel,
  Select,
  DialogActions,
  Autocomplete,
  DialogTitle,
} from "@mui/material";
import {
  // Select,
  Close,
  Delete,
  Drafts,
  Inbox,
  InsertDriveFile,
  Label,
  MoreVert,
  Send,
  StarBorder,
  Refresh,
  KeyboardHide,
  Search as SearchIcon,
  Menu,
  SendOutlined,
  KeyboardArrowDown,
  Add,
  DeleteOutline,
  MailOutline,
  Keyboard,
  AttachFile,
} from "@mui/icons-material";

import {
  Chip,
  InputAdornment,
  // FormControl,
  // InputLabel,
  // MenuItem,
  // Select,
  // TextField,
  // Typography,
  // Button
} from "@mui/material";
import {
  Person,
  School,
  Group,
  Subject,
  // AttachFile,
  Category,
  // List
  // ClassIcon
} from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useSelector } from "react-redux";

import { formatDateTimeWithAmPm } from "../../../../commonStyle";
import {
  api,
  emailAddressFromState,
  noticeTypes,
  selectSchoolDetails,
} from "../../../../common";

import CloseIcon from "@mui/icons-material/Close";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Tooltip from "@mui/material/Tooltip";
import ReplyIcon from "@mui/icons-material/Reply";
import ForwardIcon from "@mui/icons-material/Forward";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const MainContent = styled(Box)({
  display: "flex",
  flexGrow: 1,

  // height: 'calc(100vh - 64px)',
  height: "100vh",

  // position:"fixed"
});
const GmailWrapper = styled(Box)({
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f6f8fc",
  overflow: "hidden",
});

const Sidebar = styled(Box)({
  width: 280,
  minWidth: 280,
  borderRight: "1px solid #e0e0e0",
  backgroundColor: "#ffffff",
  padding: "8px 0",
  overflow: "hidden",
  top: 0,
});

const EmailListWrapper = styled(Box)(({ dialogopen }) => ({
  // marginLeft: 280,           // <-- push it over past the fixed sidebar
  flexGrow: 1, // <-- fill remaining width
  height: "100vh", // <-- match viewport height
  minHeight: 0, // <-- critical for flex children to allow scrolling
  display: "flex",
  flexDirection: "column",
  overflowY: dialogopen ? "hidden" : "auto", // <-- only this pane scrolls
  backgroundColor: "#ffffff",
  borderRight: "1px solid #e0e0e0",
}));

const ComposeButton = styled(Button)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  bottom: 24,
  width: "90%",
  height: "48px",
  borderRadius: "24px",
  padding: "0 24px",
  textTransform: "none",
  backgroundColor: "#ffffff",
  color: "#001d35",
  border: "1px solid #dadce0",
  boxShadow: "0 1px 3px 0 rgba(60,64,67,0.3)",
  fontWeight: 500,
  letterSpacing: "0.25px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "0 2px 5px 2px rgba(0,0,0,0.15)",
    backgroundColor: "#fafafb",
  },
  "& .MuiButton-startIcon": {
    margin: 0,
    marginRight: "8px",
  },
});

const EmailListItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== "unread",
})(({ theme, unread }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2), // Use theme spacing
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

  // Layout & Spacing
  padding: theme.spacing(1.5, 3),
  margin: theme.spacing(0.5, 0),
  borderRadius: theme.shape.borderRadius * 2, // Use theme borderRadius

  // Base Styling
  backgroundColor: unread
    ? theme.palette.primary.lighter
    : theme.palette.background.paper,
  color: unread ? theme.palette.text.primary : theme.palette.text.secondary,
  borderLeft: unread ? `4px solid ${theme.palette.primary.main}` : "none",
  boxShadow: theme.shadows[1],

  // Typography
  fontWeight: unread ? 600 : 500,
  fontSize: "0.925rem",
  lineHeight: 1.5,

  "&:hover": {
    transform: "translateY(-4px) scale(1.02)",
    boxShadow: theme.shadows[6],
    backgroundColor: unread
      ? `color-mix(in srgb, ${theme.palette.primary.light} 90%, white)`
      : theme.palette.action.hover,

    // Animated border-left expansion
    "&::before": {
      transform: "scaleY(1)",
      opacity: 1,
    },

    // Shine effect
    "&::after": {
      transform: "translateX(100%) skewX(-15deg)",
      transition: "transform 0.6s ease",
    },

    // Icon enhancement
    "& .MuiSvgIcon-root": {
      transform: "scale(1.15) translateX(2px)",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
    },
  },

  // Shine overlay
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-50%",
    width: "40%",
    height: "100%",
    background: `
      linear-gradient(
        to right,
        rgba(255,255,255,0) 0%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0) 100%
      )
    `,
    transform: "translateX(-100%) skewX(-15deg)",
    transition: "transform 0.4s ease",
  },

  // Focus states
  "&:focus-visible": {
    transform: "scale(1.01)",
    boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
    "&::before": {
      transform: "scaleY(1)",
      opacity: 1,
    },
  },

  // Active state
  "&:active": {
    transform: "translateY(-1px) scale(0.98)",
    transition: "transform 0.1s ease",
  },

  // Icon styling
  "& .MuiSvgIcon-root": {
    transition: "transform 0.3s ease, filter 0.3s ease",
    color: unread ? theme.palette.primary.main : theme.palette.text.secondary,
    fontSize: "1.1rem",
    zIndex: 1,
  },
}));
const MailService = () => {
  const [filterText, setFilterText] = useState("");
  const classSections = useSelector(
    (state) => state.master.data.classSections || []
  );

  const [list, setlist] = useState("");
  const userData = useSelector(selectSchoolDetails);
  const schoolId = userData?.id;
  const session = userData?.session;
  const emailAddresses = useSelector(emailAddressFromState);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mainType, setMainType] = useState("Information");
  const [recipientType, setRecipientType] = useState("individual");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageDetailsOpen, setMessageDetailsOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [loading, setLoading] = useState();

  const [newEmail, setNewEmail] = useState({
    subject: "",
    to: "",
    content: "",
    userData: userData.email,
    type: "individual",
    mailType: mainType,
    schoolId: schoolId,
    session,
    role: userData?.role,
    date: new Date(),
    attachmentData: null,
  });

  const handleComposeClick = () => {
    setComposeOpen(true);
    if (selectedPerson) {
      setNewEmail({ ...newEmail, to: selectedPerson.email });
    }
  };
  const handleRecipientTypeChange = (e) => {
    setRecipientType(e.target.value);
    setNewEmail({ ...newEmail, type: e.target.value });
  };
  // e.g. above your return(), inside the component body:
  const handleEmailDelete = (emailId) => {
    // stop the parent onClick from firing
    // remove it from your state (or call your API)
    setMessages((prev) => prev.filter((m) => m.id !== emailId));
    // optionally also clear selection if you track selectedEmails
    setSelectedEmails((prev) => prev.filter((id) => id !== emailId));
  };

  const handlePersonClick = async (message) => {
    setSelectedMessage(message);
    setMessageDetailsOpen(true);

    if (!message.read) {
      try {
        await api.put(`/api/mail/messages/${message.id}`, { read: true });
        setMessages(
          messages.map((msg) =>
            msg.id === message.id ? { ...msg, read: true } : msg
          )
        );
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };
  const loadInboxMessages = async () => {
    try {
      const params = { email: userData.email, schoolId, role: userData?.role };
      const response = await api.get("/api/mail/inbox", { params });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading inbox messages:", error);
      setLoading(false);
    }
  };

  const loadSentMessages = async () => {
    try {
      const params = { email: userData.email, schoolId, role: userData?.role };
      const response = await api.get("/api/mail/sent", { params });
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading sent messages:", error);
      setLoading(false);
    }
  };

  const people = emailAddresses.map((person) => ({
    id: person.id,
    name: person.name,
    email: person.email,
    role: person.role, // Keep role as provided in the emailAddresses data
    type: person.role.toLowerCase(), // Assign type based on the role (e.g., 'staff' or 'student')
  }));

  const handleCloseCompose = () => {
    setComposeOpen(false);
    setNewEmail({
      subject: "",
      to: "",
      content: "",
      mailType: mainType,
      userData: userData.email,
      type: "individual",
      schoolId: schoolId,
      date: new Date(),
      role: userData?.role,
      session,
    });
    setRecipientType("individual");
    setSelectedClass("");
    setSelectedSection("");
    setSelectedPeople([]);
    setAttachments([]);
  };

  const handlePrint = () => {
    // You might want to print only the message content using a custom print function
    window.print();
  };

  // Delete action (replace with your actual logic)
  const handleDelete = () => {
    // Example: call API to delete message or update state
    console.log("Deleted the message:", selectedMessage);
  };
  // / AttachmentPreview component (add this to your file)
  const AttachmentPreview = ({ file }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        border: "1px solid #e0e0e0",
        borderRadius: 1,
        width: 200,
        backgroundColor: "#f9f9f9",
      }}
    >
      <InsertDriveFileIcon sx={{ color: "#5f6368", mr: 1 }} />
      <Box sx={{ overflow: "hidden" }}>
        <Typography noWrap variant="body2" sx={{ fontWeight: 500 }}>
          {file.name}
        </Typography>
        <Typography variant="caption" sx={{ color: "#5f6368" }}>
          {formatFileSize(file.size)}
        </Typography>
      </Box>
    </Box>
  );

  // Helper functions (add these to your component)
  const getRandomColor = (str = "") => {
    // Add default parameter
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
      "#ffc107",
      "#ff9800",
      "#ff5722",
    ];
    const hash = str
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };
  const emailListRef = useRef(null);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleSendEmail = async () => {
    let recipients = [];

    // Build recipients list based on email type
    if (newEmail.type === "class") {
      recipients.push(`${selectedClass}`);
    } else if (newEmail.type === "section") {
      recipients.push(`${selectedClass}.${selectedSection}`);
    } else if (newEmail.type === "group") {
      recipients = selectedPeople.map((person) => person.email);
    } else {
      recipients.push(newEmail.to);
    }

    const formData = new FormData();
    formData.append("subject", newEmail.subject);
    formData.append("content", newEmail.content);
    formData.append("from", userData.email);
    formData.append("type", newEmail.type);
    formData.append("schoolId", schoolId);
    formData.append("class", selectedClass);
    formData.append("section", selectedSection);
    formData.append("date", new Date());
    formData.append("role", userData?.role);
    formData.append("mailType", mainType);
    // formData.append("attachmentData", attachmentData);

    // Only append 'to[]' if the type is not 'class' or 'section'
    if (newEmail.type !== "class" && newEmail.type !== "section") {
      recipients.forEach((email) => formData.append("to[]", email));
    }
    attachments.forEach((file) => formData.append("attachments", file));

    try {
      await api.post("/api/mail/send", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Email sent to:", recipients);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    handleCloseCompose();
  };

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    newValue === 0 ? loadInboxMessages() : loadSentMessages();
  };
  const handleChange = (e) => {
    setNewEmail({ ...newEmail, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchmail = async () => {
      try {
        const response = await api.get("/api/mail/inbox");
        setMessages(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchmail();
  }, []);
  console.log("messages inbox", messages);
  const handleEmailSelect = (emailId) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  // initial load

  useEffect(() => {
    loadInboxMessages();
  }, []);
  const filteredPeople = (people || []).filter(
    (person) =>
      (person.name &&
        person.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (person.email &&
        person.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (person.subject &&
        person.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const renderImageUpload = (label, name) => (
    <Grid item xs={6} key={name}>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id={`upload-${name}`}
        type="file"
        name={name}
        onChange={handleChange}
      />
      <label htmlFor={`upload-${name}`}>
        <Button variant="contained" color="primary" component="span">
          Upload {label}
        </Button>
      </label>
      {newEmail[name] && (
        <Avatar
          src={`data:image/jpeg;base64,${newEmail[name]}`}
          alt={label}
          sx={{ width: 56, height: 56, mt: 2 }}
        />
      )}
    </Grid>
  );
  return (
    <GmailWrapper>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar
          sx={{
            gap: 2,
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
           
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {/* <MailOutline sx={{ color: '#5f6368', fontSize: 32 }} /> */}
           
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, maxWidth: 720, ml: 4 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search mail"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: "#5f6368", mr: 1 }} />,
                sx: {
                  borderRadius: 24,
                  backgroundColor: "#f1f3f4",
                  "& fieldset": { border: "none" },
                },
              }}
            />
          </Box>

        </Toolbar>
      </AppBar>

      <MainContent>
        <Sidebar>
          <List dense sx={{ mt: 8 }}>
            <ComposeButton onClick={handleComposeClick}>
              <Add sx={{ mr: 1.5, color: "#5f6368" }} />
              Compose
            </ComposeButton>
            {[
              {
                icon: Inbox,
                label: "Inbox",
                count: messages.length,
                active: activeTab === 0,
              },
              { icon: SendOutlined, label: "Sent", active: activeTab === 1 },
             
            ].map((item) => (
              <ListItemButton
                key={item.label}
                onClick={() => handleTabChange(item.label === "Inbox" ? 0 : 1)}
                sx={{
                  borderRadius: "0 24px 24px 0",
                  height: 48,
                  "&:hover": { backgroundColor: "#f1f3f4" },
                  ...(item.active && {
                    backgroundColor: "#e8f0fe !important",
                    color: "#1967d2",
                  }),
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <item.icon
                    sx={{
                      color: item.active ? "#1967d2" : "#5f6368",
                      fontSize: 20,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: item.active ? 600 : 400,
                    color: item.active ? "#1967d2" : "#202124",
                  }}
                />
                {item.count > 0 && (
                  <Typography variant="caption" sx={{ color: "#5f6368" }}>
                    {item.count}
                  </Typography>
                )}
              </ListItemButton>
            ))}
          </List>
        </Sidebar>
        <EmailListWrapper
          ref={emailListRef}
          dialogopen={messageDetailsOpen ? 1 : 0}
        >
          <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <Checkbox
              checked={selectedEmails.includes(messages.id)}
              onChange={() => handleEmailSelect(messages.id)}
              sx={{ mr: 1 }}
            />
            <IconButton
              disabled={selectedEmails.length === 0}
              onClick={loadInboxMessages} // 🔥 re‑runs your fetch
            >
              <Refresh />
            </IconButton>
            <IconButton disabled={selectedEmails.length === 0}>
              <Delete />
            </IconButton>
            <IconButton disabled={selectedEmails.length === 0}>
              <Label />
            </IconButton>
            <IconButton disabled={selectedEmails.length === 0}>
              <MoreVert />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="caption" sx={{ color: "#5f6368" }}>
              {`1-${messages.length} of ${messages.length}`}
            </Typography>
            <IconButton>
              <KeyboardArrowDown />
            </IconButton>
          </Box>

          <Divider />

          <List dense>
            {loading
              ? Array(8)
                  .fill()
                  .map((_, i) => (
                    <Skeleton
                      key={i}
                      variant="rectangular"
                      height={72}
                      sx={{ mb: 0.5 }}
                    />
                  ))
              : [...messages]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((message) => (
                    <EmailListItem
                      key={message.id}
                      unread={!message.read}
                      onClick={() => handlePersonClick(message)}
                    >
                      <Checkbox
                        checked={selectedEmails.includes(message.id)}
                        onChange={() => handleEmailSelect(message.id)}
                        sx={{ mr: 1 }}
                      />
                      <IconButton size="small" sx={{ mr: 1 }}>
                        <StarBorder sx={{ color: "#5f6368" }} />
                      </IconButton>

                      <ListItemAvatar sx={{ minWidth: 40 }}>
                        <Avatar
                          sx={{ width: 32, height: 32, bgcolor: "#e8f0fe" }}
                        >
                          {message.sender?.[0]?.toUpperCase() || "?"}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: message.read ? 400 : 700,
                                color: message.read ? "#5f6368" : "#202124",
                              }}
                            >
                              {message.sender || "Unknown Sender"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                flexGrow: 1,
                                fontWeight: message.read ? 400 : 600,
                                color: "#202124",
                              }}
                            >
                              {message.subject}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#5f6368",
                                minWidth: 80,
                                textAlign: "right",
                              }}
                            >
                              {formatDateTimeWithAmPm(message.date)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#5f6368",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {message.content?.substring(0, 60) ||
                              "No content available"}
                            ...
                          </Typography>
                        }
                      />
                      <IconButton
                        size="small"
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEmailDelete(message.id);
                        }}
                        aria-label="Delete email"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </EmailListItem>
                  ))}
          </List>
        </EmailListWrapper>
      </MainContent>
      {/* email list dialog onclick */}
      <Dialog
        open={messageDetailsOpen}
        onClose={() => setMessageDetailsOpen(false)}
        container={emailListRef.current}
        PaperProps={{
          sx: (theme) => ({
            position: "absolute",
            top: { xs: 0, sm: theme.spacing(15) },
            bottom: { xs: 0, sm: theme.spacing(1) },
            right: 0,
            m: 0,
            height: { xs: "100%", sm: "85%" },
            width: { xs: "100%", sm: "70%" },
            maxHeight: "none",
            borderRadius: { xs: 0, sm: theme.shape.borderRadius * 2 },
            overflow: "hidden",
            boxShadow: theme.shadows[6],
            transition: theme.transitions.create(["top", "height"], {
              duration: theme.transitions.duration.standard,
            }),
          }),
        }}
        BackdropProps={{
          sx: (theme) => ({
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(2px)",
          }),
        }}
        disableScrollLock
        fullWidth={false}
        maxWidth={false}
      >
        {/* Header with enhanced actions */}
        <AppBar
          position="static"
          color="inherit"
          sx={(theme) => ({
            bgcolor: "background.paper",
            boxShadow: theme.shadows[1],
            borderBottom: `1px solid ${theme.palette.divider}`,
            py: 0.5,
            transition: theme.transitions.create("box-shadow"),
          })}
        >
          <Toolbar sx={{ minHeight: "56px!important", px: 2 }}>
            <Tooltip title="Back">
              <IconButton
                onClick={() => setMessageDetailsOpen(false)}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    bgcolor: "action.hover",
                    transform: "rotate(-360deg)",
                    transition: "transform 0.6s ease",
                  },
                }}
              >
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: "flex", gap: 0.5 }}>
              {["archive", "delete", "more"].map((action) => (
                <Tooltip key={action} title={capitalize(action)}>
                  <IconButton
                    size="small"
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        bgcolor: "action.hover",
                        color:
                          action === "delete" ? "error.main" : "primary.main",
                      },
                      transition: (theme) =>
                        theme.transitions.create(["color", "background-color"]),
                    }}
                  >
                    {action === "archive" && (
                      <ArchiveOutlinedIcon fontSize="small" />
                    )}
                    {action === "delete" && (
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    )}
                    {action === "more" && (
                      <MoreVertOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Email Content */}
        <Box
          sx={(theme) => ({
            height: "calc(100% - 120px)",
            overflowY: "auto",
            bgcolor: "background.paper",
            p: 3,
          })}
        >
          {selectedMessage && (
            <Box sx={{ maxWidth: 800, mx: "auto" }}>
              {/* Subject */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  mb: 3,
                  color: "text.primary",
                  lineHeight: 1.3,
                }}
              >
                {selectedMessage.subject}
              </Typography>

              {/* Sender Info */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 4,
                  gap: 2,
                }}
              >
                <Avatar
                  src={selectedMessage?.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: getRandomColor(selectedMessage?.from),
                    "& .MuiAvatar-fallback": { fill: "white" },
                  }}
                >
                  {selectedMessage?.from?.charAt(0).toUpperCase() || "A"}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedMessage.from}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMessage.fromEmail}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: "auto" }}
                    >
                      {formatDate(selectedMessage.date)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    to me
                  </Typography>
                </Box>
              </Box>

              {/* Message Body */}
              <Box
                sx={{
                  ml: 7,
                  fontSize: "0.9375rem",
                  lineHeight: 1.7,
                  color: "text.primary",
                  whiteSpace: "pre-line",
                  "& a": {
                    color: "primary.main",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  },
                }}
                dangerouslySetInnerHTML={{ __html: selectedMessage.content }}
              />

              {/* Attachments */}
              {selectedMessage.attachments?.length > 0 && (
                <Box sx={{ ml: 7, mt: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ mb: 2, fontWeight: 500 }}
                  >
                    Attachments ({selectedMessage.attachments.length})
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {selectedMessage.attachments.map((file) => (
                      <AttachmentPreview key={file.id} file={file} />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Enhanced Reply Footer */}
        <Box
          sx={(theme) => ({
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
            display: "flex",
            gap: 2,
            boxShadow: theme.shadows[2],
          })}
        >
          {["reply", "forward"].map((action) => (
            <Button
              key={action}
              variant="contained"
              size="medium"
              startIcon={action === "reply" ? <ReplyIcon /> : <ForwardIcon />}
              sx={{
                textTransform: "capitalize",
                px: 3,
                bgcolor: "action.selected",
                color: "text.primary",
                "&:hover": {
                  bgcolor: "action.hover",
                  boxShadow: 1,
                },
                "& .MuiButton-startIcon": {
                  color: "primary.main",
                },
              }}
            >
              {capitalize(action)}
            </Button>
          ))}
        </Box>
      </Dialog>

      {/* Compose Dialog */}
      <Dialog
        open={composeOpen}
        onClose={handleCloseCompose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: "60vh",
            maxHeight: "90vh",
            background: "#f5f5f5",
          },
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            background: "white",
          }}
        >
          <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 600 }}>
            New message
          </Typography>
          <IconButton size="small" onClick={handleCloseCompose}>
            <Close fontSize="small" />
          </IconButton>
        </div>

        <Dialog
          open={composeOpen}
          onClose={handleCloseCompose}
          fullWidth
          maxWidth="lg" // Set maxWidth to 'lg' for a larger dialog size, or 'xl' for even larger
          PaperProps={{
            sx: {
              height: "80vh", // Set height to 80% of the viewport height
              width: "100%", // You can also adjust the width as needed>
            },
          }}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseCompose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ ml: 2, flex: 1 }}>
                Compose Email
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <Grid container spacing={3} sx={{ py: 2 }}>
              {/* Recipient Type Dropdown */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="recipient-type-label">
                    Recipient Type
                  </InputLabel>
                  <Select
                    labelId="recipient-type-label"
                    value={recipientType}
                    onChange={handleRecipientTypeChange}
                    label="Recipient Type"
                    MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                  >
                    <MenuItem
                      value="individual"
                      sx={{ display: "flex", gap: 1.5 }}
                    >
                      <Person /> Individual
                    </MenuItem>
                    <MenuItem value="class" sx={{ display: "flex", gap: 1.5 }}>
                      <School /> Class
                    </MenuItem>
                    <MenuItem
                      value="section"
                      sx={{ display: "flex", gap: 1.5 }}
                    >
                      <School /> Class Section
                    </MenuItem>
                    <MenuItem value="group" sx={{ display: "flex", gap: 1.5 }}>
                      <Group /> Group
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Conditional Fields */}
              {recipientType === "individual" && (
                <Grid item xs={12}>
                  <Autocomplete
                    autoFocus
                    options={filteredPeople}
                    getOptionLabel={(option) =>
                      `${option.name} (${option.email})`
                    }
                    value={
                      filteredPeople.find(
                        (person) => person.email === newEmail.to
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setNewEmail({ ...newEmail, to: newValue?.email || "" });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Recipient"
                        variant="outlined"
                        helperText="Start typing to search for recipients"
                      />
                    )}
                    groupBy={(option) => option.type}
                    renderGroup={(params) => (
                      <li key={params.key}>
                        <div
                          style={{
                            backgroundColor:
                              params.group === "student"
                                ? "#e8f5e9"
                                : "#ffebee",
                            padding: "8px 16px",
                            fontWeight: "bold",
                          }}
                        >
                          {params.group.toUpperCase()}
                        </div>
                        <ul style={{ padding: 0 }}>{params.children}</ul>
                      </li>
                    )}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{
                          ...props.style,
                          color:
                            option.type === "student" ? "#2e7d32" : "#c62828",
                          padding: "8px 16px !important",
                        }}
                      >
                        {`${option.name} (${option.email})`}
                      </li>
                    )}
                    sx={{
                      mt: 1,
                      "& .MuiAutocomplete-option": {
                        // Override default hover colors
                        '&[aria-selected="true"]': {
                          backgroundColor: "rgba(0, 0, 0, 0.04) !important",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04) !important",
                        },
                      },
                    }}
                  />
                </Grid>
              )}

              {recipientType === "class" && (
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="class-label">Select Class</InputLabel>
                    <Select
                      labelId="class-label"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      label="Class"
                      MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                    >
                      {classSections.map((cls) => (
                        <MenuItem
                          key={cls.id}
                          value={cls.name}
                          sx={{ py: 1.5 }}
                        >
                          <School sx={{ mr: 1.5, color: "text.secondary" }} />
                          {cls.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}

              {recipientType === "section" && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="class-label">Select Class</InputLabel>
                      <Select
                        labelId="class-label"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        label="Class"
                      >
                        {classSections.map((cls) => (
                          <MenuItem key={cls.id} value={cls.name}>
                            {cls.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="section-label">Select Section</InputLabel>
                      <Select
                        labelId="section-label"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        label="Section"
                      >
                        {classSections.find((cs) => cs.name === selectedClass)
                          ?.sections?.length > 0 ? (
                          classSections
                            .find((cs) => cs.name === selectedClass)
                            .sections.map((section) => (
                              <MenuItem key={section.id} value={section.name}>
                                {section.name}
                              </MenuItem>
                            ))
                        ) : (
                          <MenuItem value="" disabled>
                            No Sections Available
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}

              {recipientType === "group" && (
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={filteredPeople}
                    getOptionLabel={(option) =>
                      `${option.name} (${option.email})`
                    }
                    value={selectedPeople}
                    onChange={(event, newValue) => {
                      setSelectedPeople(newValue);
                      setNewEmail({ ...newEmail, to: "" });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Group Members"
                        variant="outlined"
                        helperText="Choose multiple recipients"
                      />
                    )}
                    groupBy={(option) => option.type}
                    renderGroup={(params) => (
                      <li key={params.key}>
                        <div
                          style={{
                            backgroundColor:
                              params.group === "student"
                                ? "#e8f5e9"
                                : "#ffebee",
                            padding: "8px 16px",
                            fontWeight: "bold",
                          }}
                        >
                          {params.group.toUpperCase()}
                        </div>
                        <ul style={{ padding: 0 }}>{params.children}</ul>
                      </li>
                    )}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{
                          ...props.style,
                          color:
                            option.type === "student" ? "#2e7d32" : "#c62828",
                          padding: "8px 16px !important",
                        }}
                      >
                        {`${option.name} (${option.email})`}
                      </li>
                    )}
                    sx={{
                      mt: 1,
                      "& .MuiAutocomplete-option": {
                        // Override default hover colors
                        '&[aria-selected="true"]': {
                          backgroundColor: "rgba(0, 0, 0, 0.04) !important",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04) !important",
                        },
                      },
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option.email}
                          label={option.name}
                          size="small"
                          sx={{ borderRadius: 1 }}
                        />
                      ))
                    }
                  />
                </Grid>
              )}

              {/* Message Type */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="notice-type-label">Message Type</InputLabel>
                  <Select
                    labelId="notice-type-label"
                    value={mainType}
                    onChange={(e) => setMainType(e.target.value)}
                    label="Message Type"
                  >
                    {noticeTypes.map((type, index) => (
                      <MenuItem key={index} value={type} sx={{ py: 1.5 }}>
                        <Category sx={{ mr: 1.5, color: "text.secondary" }} />
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Subject */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Subject"
                  name="subject"
                  value={newEmail.subject}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Subject color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Content */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  label="Message Content"
                  name="content"
                  value={newEmail.content}
                  onChange={handleChange}
                  InputProps={{
                    style: {
                      alignItems: "flex-start",
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      alignItems: "flex-start",
                    },
                  }}
                />
              </Grid>

              {/* File Upload */}
              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  startIcon={<AttachFile />}
                  sx={{ mt: 1, mb: 2 }}
                >
                  Add Attachments
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => setAttachments(Array.from(e.target.files))}
                  />
                </Button>
                {attachments?.length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ ml: 2 }}
                  >
                    {attachments.length} file(s) selected
                  </Typography>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions
            sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}
          >
            <Button
              onClick={handleCloseCompose}
              variant="outlined"
              sx={{
                borderRadius: 2,
                px: 3,
                "&:hover": { bgcolor: "grey.100" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                px: 3,
                boxShadow: "none",
                "&:hover": { boxShadow: "0 2px 4px rgba(0,0,0,0.2)" },
              }}
            >
              Send Message
            </Button>
          </DialogActions>
        </Dialog>

        {/* Footer Actions */}
        <DialogActions
          sx={{
            padding: "8px 16px",
            borderTop: "1px solid #e0e0e0",
            background: "white",
          }}
        >
          <Button
            onClick={handleCloseCompose}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            onClick={handleSendEmail}
            sx={{
              borderRadius: 20,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      {/* diaaaaa */}
    </GmailWrapper>

    // message dialog
  );
};

export default MailService;
