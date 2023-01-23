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

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import AttendeesModal from "./AttendeesModal";


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
    event: eventType,
    eventKey: number,
    userInformation : {name : string, category: string, username : string, password : string, id : number},
    CreateEvent (newEvent: eventType): any
    DeleteEvent (eventToDelete: eventType): any
    EditEvent (changedEvent: eventType): any
    // conflict: boolean
}



type colorType = 'primary' | 'inherit' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined

type convert = {
    'RSVP': colorType,
    'Will Attend': colorType,
    'Maybe': colorType,
    "Won't Attend": colorType,
}

const gtTheme = createTheme({
    palette: {
        primary: {
            main: '#B3A369',
            contrastText: 'white'
        },
        secondary: {
            main: '#B3A369',
            contrastText: 'white'
        }
    }
  })
export default function Event(props: propsType) {
    const stateToColors: convert = {
        'RSVP': 'primary',
        'Will Attend': 'success',
        'Maybe': 'warning',
        "Won't Attend": 'error'
    }

    let initialRSVP: RSVPtype = 'RSVP';
    props.event.attendees.map(attendee => {
        if (attendee.id === props.userInformation.id) {
            initialRSVP = attendee.rsvp
        }}
    )

    React.useEffect(() => {
        let newRSVP: RSVPtype = 'RSVP'
        props.event.attendees.map(attendee => {
            if (attendee.id === props.userInformation.id) {
                newRSVP = attendee.rsvp
            }}
        )
        setRSVP(newRSVP)
        setColor(stateToColors[newRSVP])
        }
    )
    

    const [RSVP, setRSVP]: [RSVP: RSVPtype, setRSVP: any] = React.useState(initialRSVP)
    const [color, setColor]: [color: colorType, setColor: any] = React.useState(stateToColors[RSVP])
    const [anchor, setAnchor] = React.useState(null);
    const open = Boolean(anchor)

    
    const [viewDialog, setViewDialog] = React.useState(false)
    const [modifyDialog, setModifyDialog] = React.useState(false)
    const [editDialog, setEditDialog] = React.useState(false)
    const [deleteDialog, setDeleteDialog] = React.useState(false)
    
    const willAttend = props.event.attendees.filter(attendee => attendee.rsvp === 'Will Attend')
    const isAdmin = props.userInformation.id === props.event.creatorId || props.userInformation.category === 'Administrator'
    
    const handleClick = (event: any) => {
        event.stopPropagation();
        setAnchor(event.currentTarget)
    }

    const buttonClick = (event: any) => {
        event.stopPropagation()
        setViewDialog(true)
    }

    const handleClose = (event: any) => {
        event.stopPropagation();
        setAnchor(null)
        setFormValues(props.event)
        setCheckedAttendees([])
    }

    const handleRSVP = (event: any, newRSVP: RSVPtype, newColor: colorType): any => {
        event.stopPropagation();
        setAnchor(null)
        setRSVP(newRSVP)
        setColor(newColor)
        let newEvent = props.event
        let newAttendees = props.event.attendees
        let amIin = false;
        newAttendees.forEach((user, index) => {
            if (newRSVP === 'RSVP') {
                if (user.id === props.userInformation.id) {
                    newAttendees.splice(index, 1)
                    amIin = true;
                }
            } else {
                if (user.id === props.userInformation.id) {
                    newAttendees[index] = {
                        ...newAttendees[index],
                        'rsvp': newRSVP,
                    }
                    amIin = true;
                }
            }
        })
        if (!amIin) {
            newAttendees = [{id: props.userInformation.id, name: props.userInformation.name, rsvp: newRSVP}, ...newAttendees]
        }
        newEvent.attendees = newAttendees
        props.EditEvent(newEvent)
    }

    const [formValues, setFormValues]: [formValues: eventType, setFormValues: any] = React.useState(props.event)
    const [checkedAttendees, setCheckedAttendees] = React.useState<number[]>([])


    const handleFormChange = (e: any) => {
        let { name, value } = e.target
        if (value === 'true') value = true
        if (value === 'false') value = false
        setFormValues({
            ...formValues,
            [name]: value,
        })
        console.log("FORM")
        console.log(formValues)
    }

    const handleFormStartTime = (startTime: any) => {
        setFormValues({
            ...formValues,
            'startTime': startTime.valueOf(),
        })
    }

    const handleFormEndTime = (endTime: any) => {
        setFormValues({
            ...formValues,
            'endTime': endTime.valueOf(),
        })
    }

    const handleFormSubmit = (event: any) => {
        if (formValues.title !== '' && formValues.description !== '' && formValues.location !== '') {
            event.preventDefault()
            props.EditEvent(formValues)
            setEditDialog(false)
        }
    }

    const handleModifyAttendees = () => {
        props.event.attendees.filter(a => checkedAttendees.indexOf(a.id) > -1).forEach(x => props.event.attendees.splice(props.event.attendees.indexOf(x), 1));
        props.EditEvent(props.event)
        setCheckedAttendees([])
    }


    const handleRSVPRemoval = () => {
        props.event.attendees.map((attendee, index) => {
            if (attendee.id === props.userInformation.id) {
                props.event.attendees.splice(index, 1)
            }
        })
        props.EditEvent(props.event)
    }

    const handleSelect = (value: number) => {
        const isPresent = checkedAttendees.indexOf(value)
        if (isPresent !== -1) {
            const remaining = checkedAttendees.filter((item: number) => item !== value)
            setCheckedAttendees(remaining)
        } else {
            setCheckedAttendees((prevItems: any) => [...prevItems, value])
        }
    }

    
    // console.log("EVENT ")
    // console.log(props.event)

    return (
        <Accordion id='accordion' disableGutters>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="accordionSummary"
            >
                <div className="event--imagediv">
                    <img src={props.event.image} alt={props.event.title + " image"} className='event--image'/>
                </div>
                <div className="event--header">

                        <h3 className="event--header--title">{props.event.title} ({props.event.eventId})</h3>

                        <div className='event--text'>
                            <Stack direction='row' alignItems='center' gap={1} id='stack'>
                                <CalendarMonthIcon style={{ fontSize: 16}}/> 
                                <Typography variant='body2' id='event--text'>
                                    {new Date(props.event.startTime).toLocaleDateString()}
                                </Typography>
                            </Stack>
                            <Stack direction='row' alignItems='center' gap={1} id='stack'>
                                <AccessTimeIcon style={{ fontSize: 16}}/>
                                <Typography variant='body2'>
                                    {new Date(props.event.startTime).toLocaleTimeString()}
                                </Typography>
                            </Stack>
                        </div>
                        <Stack direction='row' alignItems='center' gap={1} id='stack'>
                            <LocationOnIcon style={{ fontSize: 16}}/>
                            <Typography variant='body2'>{props.event.location}</Typography>
                        </Stack>
                </div>
                
                <div className="event--rsvpbutton">
                    {(props.event.inviteOnly && !props.event.attendees.some(attendee => attendee.id === props.userInformation.id)) ? 
                        <Button
                            variant='contained'
                            color='primary'
                            disabled
                            > 
                            <div className='event--rsvpbutton'>
                                <Typography variant='button' style={{fontSize: "1.1em"}}>Invite-Only</Typography>
                                <Typography variant='body1' style={{ fontSize: "0.5em"}}>{willAttend.length} going</Typography>
                            </div>
                        </Button>
                     :
                     <ButtonGroup variant='contained' color={color}>
                        <Button onClick={buttonClick}
                        >
                            <div className='event--rsvpbutton'>
                                <Typography variant='button' style={{fontSize: "1.1em"}}>{RSVP}</Typography>
                                <b></b>
                                <Typography variant='body1' style={{ fontSize: "0.5em"}}>{willAttend.length} going   ({props.event.capacity - willAttend.length})</Typography>
                                {/* <Typography variant='body1' style={{ fontSize: "1em"}}>{props.conflict && "(CONFLICT)"}</Typography> */}
                            </div>
                            
                        </Button>
                        <Button onClick={handleClick} size='small'>
                            <KeyboardArrowDownIcon />
                        </Button>
                     </ButtonGroup>
                    }
                </div>
            
                <Menu
                    anchorEl={anchor}
                    open={open}
                    onClose={handleClose}>
                    <MenuItem 
                        onClick={(event) => handleRSVP(event, 'Will Attend', 'success')}
                        >Will Attend</MenuItem>
                    <MenuItem 
                        onClick={(event) => handleRSVP(event, 'Maybe', 'warning')}
                        >Maybe</MenuItem>
                    <MenuItem 
                        onClick={(event) => handleRSVP(event, "Won't Attend", 'error')}
                        >Won't Attend</MenuItem>
                    {RSVP !== 'RSVP' &&
                        <MenuItem 
                            onClick={(event) => handleRSVP(event, 'RSVP', 'primary')}
                            >Cancel RSVP</MenuItem>
                    }
                </Menu>

            </AccordionSummary>
            <AccordionDetails id='accordionDetails'>
                { isAdmin &&
                    <div className='event--adminbuttons'>
                        <Button 
                            variant='outlined' color='secondary' size='large'
                            startIcon={<GroupIcon/>} onClick={() => setModifyDialog(true)}
                            >Modify Attendees  ({props.event.attendees.length})</Button>
                        <Button variant='outlined' color='warning' size='large'
                            startIcon={<EditIcon/>} onClick={() => setEditDialog(true)}
                            >Edit Event</Button>
                        <Button variant='outlined' color='error' size='large'
                            startIcon={<DeleteIcon/>} onClick={() => setDeleteDialog(true)}
                            >Delete Event</Button>
                    </div>
                }
                <p className="event--description">
                {props.event.description}
                </p>
                <AttendeesModal
                    open={modifyDialog}
                    setOpen={setModifyDialog}
                    event={props.event}
                    checkedAttendees={checkedAttendees}
                    setCheckedAttendees={setCheckedAttendees}
                    handleSelect={handleSelect}
                    handleModifyAttendees={handleModifyAttendees}
                    title='Modify Attendees'
                />
                <AttendeesModal
                    open={viewDialog}
                    setOpen={setViewDialog}
                    event={props.event}
                    checkedAttendees={checkedAttendees}
                    setCheckedAttendees={setCheckedAttendees}
                    handleSelect={handleSelect}
                    handleModifyAttendees={handleModifyAttendees}
                    title='View Attendees'
                />
                {/* <Dialog
                    open={modifyDialog}
                    onClose={() => {setModifyDialog(false); setCheckedAttendees([])}}
                >
                    <DialogTitle>Modify Attendees</DialogTitle>
                    <DialogContent>
                        {props.event.attendees.length === 0 ? <Typography>No attendees...</Typography> :
                        
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {props.event.attendees.map((attendee) => {
                                const attending = attendee.rsvp === 'Will Attend'
                                const color = attendee.rsvp === 'Will Attend' ? 'green' : attendee.rsvp === "Won't Attend" ? 'red' : '#fd7e14'

                                return (
                                    <ListItem
                                        key={attendee.id}
                                        secondaryAction={ attending ?
                                            <Checkbox 
                                                color='secondary'
                                                edge='end'
                                                checked={checkedAttendees.includes(attendee.id)}
                                                onChange={() => handleSelect(attendee.id)}
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
                        <Button onClick={() => {setModifyDialog(false); handleModifyAttendees()}} color='secondary'>Remove Attendees</Button>
                        <Button onClick={() => {setModifyDialog(false); setCheckedAttendees([])}}>Cancel</Button>
                    </DialogActions>
                </Dialog> */}
                <EventModal 
                    title='Edit Event'
                    open={editDialog}
                    setOpen={setEditDialog}
                    event={props.event}
                    formValues={formValues}
                    handleFormChange={handleFormChange}
                    handleFormSubmit={handleFormSubmit}
                    setFormValues={setFormValues}
                    handleFormStartTime={handleFormStartTime}
                    handleFormEndTime={handleFormEndTime}
                />
                <Dialog
                    open={deleteDialog}
                    onClose={() => setDeleteDialog(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle>Delete {props.event.title}</DialogTitle>
                    <DialogContent>Are you sure you want to delete {props.event.title}?</DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteDialog(false)} color='primary'>Cancel</Button>
                        <Button onClick={() => {
                            setDeleteDialog(false)
                            props.DeleteEvent(props.event)
                        }} color='error'>Delete Event</Button>
                    </DialogActions>
                </Dialog>
                
            </AccordionDetails>
        </Accordion>
    )
}

/*
<Accordion.Item eventKey={props.eventKey.toString()}>
<Accordion>
<Accordion.Header>
<AccordionSummary
    expandIcon={<ExpandMoreIcon />}
    aria-controls="panel1a-content"
    id="panel1a-header"
>
    <div className='event--header'>
        <h2>{props.event.title}</h2>
        <div>
            <p>{<CalendarMonthIcon style={{ fontSize: 18 }}/>}{date.toLocaleDateString()}</p>
            <p>{<AccessTimeIcon style={{ fontSize: 18 }}/>} {date.toLocaleTimeString()}</p>
        </div>
        <p>{}{props.event.location}</p>
    </div>
    <div className="event--rsvpbutton">

        <Button
            variant='contained'
            color={color}
            onClick={handleClick}
        
            endIcon={<KeyboardArrowDownIcon />}
        >
            <div className='event--rsvpbutton'>
                {RSVP}
                <p>{attendees} attendees</p>
            </div>
            
        </Button>
    </div>

    <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleClose}>
        <MenuItem onClick={(event) => handleChange(event, 'Will Attend', 'success')}>Will Attend</MenuItem>
        <MenuItem onClick={(event) => handleChange(event, 'Maybe', 'warning')}>Maybe</MenuItem>
        <MenuItem onClick={(event) => handleChange(event, "Won't Attend", 'info')}>Won't Attend</MenuItem>
        <MenuItem onClick={(event) => handleChange(event, "I'm Your Nemesis", 'error')}>I'm Your Nemesis</MenuItem>
    </Menu>


  <Dropdown as={ButtonGroup}>
    <Dropdown.Toggle variant={color} size='sm'>{RSVP}</Dropdown.Toggle>
    <Dropdown.Menu>
        <Dropdown.Item 
            eventKey="1" 
            onClick={() => {setRSVP("Will Attend"); setColor('success')}}
            >Will Attend</Dropdown.Item>
        <Dropdown.Item 
            eventKey="2" 
            onClick={() => {setRSVP("Maybe"); setColor('warning')}}
            >Maybe</Dropdown.Item>
        <Dropdown.Item 
            eventKey="3" 
            onClick={() => {setRSVP("Won't Attend"); setColor('secondary')}}
            >Won't Attend</Dropdown.Item>
        <Dropdown.Item 
            eventKey="4" 
            onClick={() => {setRSVP("I'm Your Nemesis"); setColor('danger')}}
            >I'm Your Nemesis</Dropdown.Item>
    </Dropdown.Menu>
    </Dropdown>
    
    <DropdownButton title={RSVP} variant={color} size='lg'>
        <Dropdown.Item 
            eventKey="1" 
            onClick={() => {setRSVP("Will Attend"); setColor('success')}}
            >Will Attend</Dropdown.Item>
        <Dropdown.Item 
            eventKey="2" 
            onClick={() => {setRSVP("Maybe"); setColor('warning')}}
            >Maybe</Dropdown.Item>
        <Dropdown.Item 
            eventKey="3" 
            onClick={() => {setRSVP("Won't Attend"); setColor('secondary')}}
            >Won't Attend</Dropdown.Item>
        <Dropdown.Item 
            eventKey="4" 
            onClick={() => {setRSVP("I'm Your Nemesis"); setColor('danger')}}
            >I'm Your Nemesis</Dropdown.Item>
    </DropdownButton> 
    </AccordionSummary>
</Accordion.Header>
<Accordion.Body>
<AccordionDetails>
    <div className='event--adminbuttons'>
        <Button variant='outlined' color='secondary' size='large'
        startIcon={<GroupIcon/>}>Modify Attendees</Button>
        <Button variant='outlined' color='warning' size='large'
        startIcon={<EditIcon/>}>Edit Event</Button>
        <Button variant='outlined' color='error' size='large'
        startIcon={<DeleteIcon/>}>Delete Event</Button>
    </div>
    {props.event.description}
</AccordionDetails>
</Accordion.Body>
*/

