import React from "react"
import MuiPicker from './MuiPicker'
import EventModal from './EventModal'

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
import ButtonGroup from '@mui/material/ButtonGroup'
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
    // setOpen(bool: boolean): void,
    event: eventType,
    checkedAttendees: number[],
    setOpen(e: any): any
    setCheckedAttendees(e: any): any
    handleSelect(e: any): any
    handleModifyAttendees(): any
    title: string
    // actionText: string
}

export default function AttendeesModal(props: propsType) {
    const renderButton = props.title === 'Modify Attendees'
    const actionText = props.title === 'Modify Attendees' ? 'Cancel' : 'Close'

    return (
    <Dialog
        open={props.open}
        onClose={() => {props.setOpen(false); props.setCheckedAttendees([])}}
    >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
            {props.event.attendees.length === 0 ? <Typography>No attendees...</Typography> :
            
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {props.event.attendees.map((attendee) => {
                    const attending = attendee.rsvp === 'Will Attend'
                    const color = attendee.rsvp === 'Will Attend' ? 'green' : attendee.rsvp === "Won't Attend" ? 'red' : '#fd7e14'

                    return (
                        <ListItem
                            key={attendee.id}
                            secondaryAction={ (attending && renderButton) ?
                                <Checkbox 
                                    color='secondary'
                                    edge='end'
                                    checked={props.checkedAttendees.includes(attendee.id)}
                                    onChange={() => props.handleSelect(attendee.id)}
                                /> : false
                            
                            }
                            >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: color}}>
                                        <PersonRounded />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText id={attendee.id.toString()} primary={attendee.name} />
                            </ListItemButton>
                        </ListItem>
                    )
                }
                    
                    
                )}
            </List>
            }
        </DialogContent>
        <DialogActions>
            {
                renderButton &&
                <Button onClick={() => {props.setOpen(false); props.handleModifyAttendees()}} color='secondary'>Remove Attendees</Button>
            }
            <Button onClick={() => {props.setOpen(false); props.setCheckedAttendees([])}}>{actionText}</Button>
        </DialogActions>
    </Dialog>
    )
}