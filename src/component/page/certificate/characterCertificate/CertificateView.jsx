import React,{useState} from 'react';
import {
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CertificateView = ({ certificateView = [] }) => {
    const [certificatedatas, setCertificatedatas] = useState(certificateView);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Student Name</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Session/Year/Date</TableCell>
                        <TableCell>Behaviour</TableCell>
                        <TableCell>Place</TableCell>
                        <TableCell>Issue Date</TableCell>
                        <TableCell>Print/View</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                
                {Array.isArray(certificatedatas) && certificatedatas.length > 0 ? (
                        certificatedatas.map((certificatedata, index) => (
                            <TableRow key={certificatedata.id || index}>
                                <TableCell>{certificatedata.studentName}</TableCell>
                                <TableCell>{certificatedata.class}</TableCell>
                                <TableCell>{certificatedata.session}</TableCell>
                                <TableCell>{certificatedata.behavior}</TableCell>
                                <TableCell>{certificatedata.place}</TableCell>
                                <TableCell>{certificatedata.issueDate}</TableCell>
                                <TableCell>
                                    <Button startIcon={<PrintIcon />}>Format 1</Button>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                No certificates found
                            </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CertificateView;
