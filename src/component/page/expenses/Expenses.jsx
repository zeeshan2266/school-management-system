import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useDispatch, useSelector } from 'react-redux';
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  // updateExpense
} from './redux/ExpenseAction';
import ExpenseList from '../expenses/ExpenseList';
import ExpenseForm from "../expenses/ExpenseForm";
import * as XLSX from 'xlsx';
import ClearIcon from '@mui/icons-material/Clear';
import { selectSchoolDetails } from "../../../common";

const Expense = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const userData = useSelector(selectSchoolDetails);
  const schoolId = userData?.id;
  const session = userData?.session;
  const { expenses, loading, error } = useSelector((state) => state.expenses);

  useEffect(() => {
    if (schoolId && session) {
      dispatch(fetchExpenses(schoolId, session));
    }
  }, [dispatch, schoolId, session]);

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setOpenForm(true);
  };

  const handleClearSearch = () => setSearchQuery('');

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setOpenForm(true);
  };

  const handleViewExpense = (expense) => {
    setSelectedExpense(expense);
    setOpenDetails(true);
  };

  // const handleFormSubmit = (formData) => {
  //   const operation = formData.id 
  //     ? dispatch(createExpense(formData))
  //     : dispatch(updateExpense(formData));

  //   operation
  //     .then(() => dispatch(fetchExpenses(schoolId, session)))
  //     .catch((error) => console.error("Expense operation failed:", error));

  //   setOpenForm(false);
  // };

  const handleFormSubmit = (formData) => {
  dispatch(createExpense(formData))
    .then(() => {
      dispatch(fetchExpenses(schoolId, session));
      setOpenForm(false);
    })
    .catch((error) => {
      console.error("Expense creation failed:", error);

    });
};

  const handleDownloadExcel = () => {
    const filteredData = expenses.map(({ attachmentsData, ...expense }) => ({
      ...expense,
      amount: parseFloat(expense.amount),
      creationDateTime: new Date(expense.creationDateTime).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    XLSX.writeFile(workbook, 'expenses.xlsx');
  };

  const filteredExpenses = expenses?.filter(expense => {
    const searchLower = searchQuery.toLowerCase();
    return expense.category.toLowerCase().includes(searchLower) ||
           expense.description.toLowerCase().includes(searchLower);
  }) || [];

  return (
    <Container maxWidth="lg">
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" width="100%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={40} style={{ marginTop: '16px' }} />
          <Skeleton variant="rectangular" width="100%" height={400} style={{ marginTop: '16px' }} />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <>
          <Box sx={{ 
            marginBottom: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: 2
          }}>
            <TextField
              label="Search by Category or Description"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="search">
                      <SearchIcon />
                    </IconButton>
                    {searchQuery && (
                      <IconButton aria-label="clear" onClick={handleClearSearch}>
                        <ClearIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddExpense}
            >
              Add Expense
            </Button>
            <Tooltip title="Download all expenses">
              <IconButton color="primary" onClick={handleDownloadExcel}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container>
            <Grid item xs={12}>
              <ExpenseList
                expenses={filteredExpenses}
                onEdit={handleEditExpense}
                onView={handleViewExpense}
              />
            </Grid>
          </Grid>

          <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="md">
            <DialogTitle>{selectedExpense ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
            <DialogContent>
              <ExpenseForm
                expense={selectedExpense}
                onSubmit={handleFormSubmit}
                onCancel={() => setOpenForm(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={openDetails} onClose={() => setOpenDetails(false)} fullWidth maxWidth="md">
            <DialogTitle>Expense Details</DialogTitle>
            <DialogContent>
              {selectedExpense ? (
                <Table>
                  <TableBody>
                    {[
                      { label: "Category", value: selectedExpense.category },
                      { label: "Amount", value: `$${selectedExpense.amount}` },
                      { label: "Description", value: selectedExpense.description },
                      { label: "Date", value: new Date(selectedExpense.creationDateTime).toLocaleString() },
                      { 
                        label: "Attachment", 
                        value: selectedExpense.attachmentsData ? (
                          <Button 
                            variant="text"
                            onClick={() => window.open(`data:application/octet-stream;base64,${selectedExpense.attachmentsData}`)}
                          >
                            View Attachment
                          </Button>
                        ) : "None"
                      }
                    ].map((item) => (
                      <TableRow key={item.label}>
                        <TableCell><strong>{item.label}</strong></TableCell>
                        <TableCell>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Skeleton variant="rectangular" width="100%" height={200} />
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default Expense;