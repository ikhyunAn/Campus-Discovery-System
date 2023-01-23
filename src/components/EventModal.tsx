import React from "react"
import MuiPicker from './MuiPicker'

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PersonRounded from '@mui/icons-material/PersonRounded'
import SchoolRounded from '@mui/icons-material/SchoolRounded'
import BuildRounded from '@mui/icons-material/BuildRounded'

import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import InputLabel from '@mui/material/InputLabel'

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'

type RSVPtype = 'RSVP' | 'Will Attend' | 'Maybe' | "Won't Attend"

type eventType = {
    eventId: number,
    title : string,
    host : string,
    description: string,
    location: string,
    image: string,
    startTime: number,
    endTime: number,
    organization: string,
    creatorId : number,
    inviteOnly: boolean,
    capacity: number,
    attendees: {id: number, name: string, rsvp: RSVPtype}[],
}

type propsType = {
    open: boolean,
    setOpen(bool: boolean): void,
    event: eventType,
    formValues: eventType,
    handleFormChange(e: any): any
    setFormValues(e: any): any
    handleFormStartTime(e: any): any
    handleFormEndTime(e: any): any
    handleFormSubmit(e: any): any
    title: string
}

const locations = [
    "Student Center",
    "Klaus",
    "Instructional Center",
    "Ferst Center of the Arts",
    "Exhibition Hall",
    "Howey",
    "College of Computing",
    "Clough"
]

export default function EventModal(props: propsType) {
    const formColor = props.title === 'Edit Event' ? 'warning' : 'primary'

    return (
    <Dialog
        // maxWidth='md'
        fullWidth
        open={props.open}
        onClose={() => {
            props.setOpen(false)
            props.setFormValues(props.event)
        }}
    >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box component='form' sx={{ mt: 3}} noValidate>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField 
                        name='title'
                        label='Event Title' 
                        variant='outlined'
                        type='text'
                        value={props.formValues.title}
                        onChange={props.handleFormChange}
                        margin="dense"
                        required
                        error={props.formValues.title === ''}
                        helperText={props.formValues.title === '' && 'Please enter an event title'}
                        fullWidth
                    />
                </Grid>
                
                <Grid item xs={12}>
                    <FormControl>
                        <FormLabel>Registration Type</FormLabel>
                        <RadioGroup row name='inviteOnly'  onChange={props.handleFormChange} value={props.formValues.inviteOnly}>
                            <FormControlLabel value={false} control={<Radio />} label={'Standard RSVP'} 
                                />
                            <FormControlLabel value={true} control={<Radio />} label={'Invite-Only'} 
                                />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DateTimePicker
                        label='Start Time'
                        renderInput={(params) => <TextField {...params}/>}
                        value={props.formValues.startTime}
                        onChange={props.handleFormStartTime}
                        // onError={props.formValues.endTime < props.formValues.startTime}
                        // helperText={props.formValues.endTime < props.formValues.startTime && 'Start time cannot be after end time'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <DateTimePicker
                        label='End Time'
                        renderInput={(params) => <TextField {...params}/>}
                        value={props.formValues.endTime}
                        onChange={props.handleFormEndTime}
                        // onError={props.formValues.endTime < props.formValues.startTime}
                        // helperText={props.formValues.endTime < props.formValues.startTime && 'Start time cannot be after end time'}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    {/* <TextField 
                        name='location'
                        label='Location' 
                        variant='outlined'
                        type='text'
                        value={props.formValues.location}
                        onChange={props.handleFormChange}
                        margin="dense"
                        error={props.formValues.location === ''}
                        helperText={props.formValues.location === '' && 'Please enter a location'}
                        fullWidth
                    /> */}
                    <FormControl fullWidth>
                        <InputLabel
                            
                        >Location</InputLabel>
                        <Select
                            name='location'
                            label='Location'
                            value={props.formValues.location}
                            onChange={props.handleFormChange}
                        >
                            {locations.map(location =>(
                                <MenuItem value={location}>{location}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                <Grid item xs={12} sm={6}>
                    <TextField 
                        name='capacity'
                        label='Guest Capacity' 
                        variant='outlined'
                        type='number'
                        value={props.formValues.capacity}
                        onChange={props.handleFormChange}
                        margin="dense"
                        error={props.formValues.capacity <= 0}
                        helperText={props.formValues.capacity <= 0 && 'Please enter a guest capacity'}
                        fullWidth
                    />
                </Grid>
                </Grid>
                <Grid item  xs={12}>
                <TextField 
                    name='description'
                    label='Description' 
                    variant='outlined'
                    type='text'
                    value={props.formValues.description}
                    onChange={props.handleFormChange}
                    margin="dense"
                    multiline
                    fullWidth
                    error={props.formValues.description === ''}
                    helperText={props.formValues.description === '' && 'Please enter a description'}
                />
                </Grid>
            </Grid>
                </Box>
            </Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.handleFormSubmit} color={formColor}>{props.title}</Button>
            <Button onClick={() => {props.setOpen(false); props.setFormValues(props.event)}}>Cancel</Button>
        </DialogActions>
    </Dialog>
    )
}