import React, {useEffect, useState} from 'react';
import {Box, Button, TextField} from '@mui/material';
import {ChromePicker} from 'react-color';

function HouseForm({house, onSave}) {
    const initialFormState = {
        name: '',
        description: '',
        color: '#FF5733', // Default color
    };
    const [formState, setFormState] = useState(initialFormState);


    useEffect(() => {
        if (house) {
            setFormState(house);
        } else {
            setFormState(initialFormState); // Reset form when no house is selected
        }
    }, [house]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleColorChange = (color) => {
        setFormState(prevState => ({
            ...prevState,
            color: color.hex,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formState.name.trim() || !formState.description.trim()) {
            alert("House name and description cannot be blank."); // Error feedback
            return;
        }
        onSave(formState); // Save the form data

        // Reset the form after saving
        setFormState(initialFormState);

    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="House Name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                margin="normal"
            />
            <Box sx={{marginTop: 2}}>
                <ChromePicker
                    color={formState.color}
                    onChangeComplete={handleColorChange}
                />
            </Box>
            <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: 2}}>
                <Button type="submit" variant="contained" color="primary">
                    {house ? "Update House" : "Add House"}
                </Button>
            </Box>
        </form>
    );
}

export default HouseForm;
