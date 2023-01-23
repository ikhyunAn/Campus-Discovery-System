import React from "react"
import Card from "react-bootstrap/Card"
import Event from "./Event"
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Pagination from '@mui/material/Pagination'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import MuiPicker from './MuiPicker'
import Box from '@mui/material/Box'
import {db} from './firebase';
import { doc, query, getDocs, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { createTypePredicateNodeWithModifier } from "typescript";
import { createEvent } from "@testing-library/react";



// import Item from '@mui/material/Item'
import Paper from '@mui/material/Paper'
import EventModal from './EventModal'
import { Evented } from "mapbox-gl";
import Typography from '@mui/material/Typography'

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
    attendees: {id: number, name: string, rsvp: RSVPtype}[]
    
    // {
    //     'Will Attend': {id: number, name: string}[],
    //     'Maybe': {id: number, name: string}[],
    //     "Won't Attend": {id: number, name: string}[],
    //     // "I'm Your Nemesis": {id: number, name: string}[]
    // }
}

type props = {
    events: eventType[],
    userInformation : {name : string, category: string, username : string, password : string, id : number},
    setEvents(events: eventType[]) : any
    title: string
}


const gtTheme = createTheme({
    palette: {
        primary: {
            main: '#B3A369',
            contrastText: 'white'
        },
    }
})



export default function EventDashboard(props: props) {
    const eventscollectionRef = collection(db, "events");
    
    const defaultEvent: eventType = {
        eventId: props.events.length,
        title : "",
        host : "",
        description: "",
        location: "",
        image: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Georgia_Tech%27s_Buzz_logo.svg/1200px-Georgia_Tech%27s_Buzz_logo.svg.png',
        startTime: Date.now(),
        endTime: Date.now(),
        organization: "",
        creatorId : props.userInformation.id,
        inviteOnly: false,
        attendees: [],
        capacity: 5,
    }

    const [filter, setFilter] = React.useState('')
    const [sort, setSort]: [sort: 'startTime' | 'location' | 'title', setSort: any] = React.useState('startTime')
    const [order, setOrder] = React.useState('descending')
    const descending = order === 'descending'

    const [page, setPage] = React.useState(1)
    const [deleteSnackbar, setDeleteSnackbar] = React.useState(false)
    const [createDialog, setCreateDialog] = React.useState(false)
    const [createForm, setCreateForm]: [createForm: eventType, setCreateForm: any] = React.useState(defaultEvent)


    const attendingEvents = props.events.filter(event => event.attendees.some(a => a.id === props.userInformation.id && a.rsvp === 'Will Attend'))
    let conflicts: string[] = []

    React.useEffect(() => {
        // attendingEvents.map((event, index) => {
        //     for (let i = 0; i < attendingEvents.length; i++) {
        //         const secondEvent = attendingEvents[i]
        //         console.log(event, index, )
        //         if (i !== event.eventId && !conflicts.includes(event.title) &&
        //             (
        //                 event.endTime <= secondEvent.startTime)) {
        //                     conflicts.push(event.title)
        //                 }
        //             }
        // })
        console.log('CONFLICTS')
        console.log(conflicts)
    }, [attendingEvents])

    const handleDeleteClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        
        setDeleteSnackbar(false)
    } 

    async function createEvent(newEvent: eventType)
        {
            //newEventRef
            const data = await getDocs(eventscollectionRef);
            // var newEventId = newEvent.eventId;
            var newEventId = data.size + 1;
            var newEventRef = doc(db, "events", newEventId.toString());
            // var newEventRef = doc(db, "events", data.size.toString());
            //eventId is passed in from

            //creatorId
            var newCreatorId = props.userInformation.id;

        await setDoc(newEventRef, { eventId: newEventId,
                                    title: newEvent.title,
                                    host: newEvent.host,
                                    description: newEvent.description,
                                    location: newEvent.location,
                                    image: newEvent.image,
                                    startTime: newEvent.startTime,
                                    endTime: newEvent.endTime,
                                    organization: newEvent.organization,
                                    creatorId : newCreatorId,
                                    inviteOnly: newEvent.inviteOnly,
                                    attendees: newEvent.attendees,
                                    capacity : newEvent.capacity
                                 });
    };
    
    // React.useEffect(()=>{
    //     getEvents();
    //     console.log("use effect work");
    // },[])

    function CreateEvent(newEvent: eventType) {
        
        let valid = true
        if (newEvent.title === "" || newEvent.description === "" || newEvent.location === "" || newEvent.capacity <= 0
            || newEvent.endTime < newEvent.startTime) {
            valid = false
        }
        if (valid) {
            let newEvents = props.events
            newEvents = [newEvent, ...newEvents]
            props.setEvents(newEvents)

            createEvent(newEvent)
        }
    }

    async function deleteEvent(eventToDelete: any){
            //newEventRef
            // const data = await getDocs(eventscollectionRef);
            // var thisEventRef = doc(db, "events", index.toString());

            //creatorId
            // var newCreatorId = props.userInformation.id;

        await deleteDoc(doc(db, "events", eventToDelete.eventId.toString()));
    };

    function DeleteEvent(eventToDelete: eventType) {
        let valid = false;
        if (props.userInformation.category === "Administrator" || props.userInformation.id === eventToDelete.creatorId) {
            valid = true;
        }
        if (valid) {
            let newEvents = JSON.parse(JSON.stringify(props.events))
            newEvents.forEach((event: eventType) => {
                if (event.title === eventToDelete.title && event.eventId === eventToDelete.eventId) {
                    var index =  newEvents.indexOf(event);
                    if (index > -1) { // only splice array when item is found
                        newEvents.splice(index, 1); // 2nd parameter means remove one item only
                        props.setEvents(newEvents)
                    }
                    deleteEvent(eventToDelete);
                }
            });
            
        } else {
            setDeleteSnackbar(true)
        }
    }

    async function editEvent(changedEvent: any)
        {
            //newEventRef
            const data = await getDocs(eventscollectionRef);
            //var editEventId = changedEvent.eventId; 
            var editEventRef = doc(db, "events", changedEvent.eventId.toString());

            //creatorId
            // var newCreatorId = props.userInformation.id;

        await setDoc(editEventRef, {eventId: changedEvent.eventId,
                                    title: changedEvent.title,
                                    host: changedEvent.host,
                                    description: changedEvent.description,
                                    location: changedEvent.location,
                                    image: changedEvent.image,
                                    startTime: changedEvent.startTime,
                                    endTime: changedEvent.endTime,
                                    organization: changedEvent.organization,
                                    creatorId : changedEvent.creatorId,
                                    inviteOnly: changedEvent.inviteOnly,
                                    attendees: changedEvent.attendees,
                                    capacity : changedEvent.capacity
                                 });
    };

    function EditEvent(changedEvent: eventType) {
        let valid = true
        if (changedEvent.title === "" || changedEvent.description === "" || changedEvent.location === "" || changedEvent.capacity <= 0
        || changedEvent.endTime < changedEvent.startTime) {
            valid = false
        }
        if (valid) {
            let newEvents = JSON.parse(JSON.stringify(props.events))
            newEvents.forEach((event: eventType, index: number) => {
                if (event.eventId === changedEvent.eventId) {
                    newEvents[index] = changedEvent

                    editEvent(changedEvent);
                }
            })
            props.setEvents(newEvents)
        }
    }

    const handleFormChange = (e: any) => {
        let { name, value } = e.target
        if (value === 'true') value = true
        if (value === 'false') value = false
        setCreateForm({
            ...createForm,
            [name]: value,
        })
    }

    const handleFormStartTime = (startTime: any) => {
        setCreateForm({
            ...createForm,
            'startTime': startTime.valueOf(),
        })
    }

    const handleFormEndTime = (endTime: any) => {
        setCreateForm({
            ...createForm,
            'endTime': endTime.valueOf(),
        })
    }

    const handleFormSubmit = (event: any) => {
        if (createForm.title !== '' && createForm.description !== '' && createForm.location !== '') {
            event.preventDefault()
            CreateEvent(createForm)
            setCreateDialog(false)
            setCreateForm(defaultEvent)
        }
    }

    const sorted = props.events.sort((event, secondEvent) => {
        if (event[sort] === secondEvent[sort]) {
            return 0
        }
        if (!descending) {
            if (event[sort] > secondEvent[sort]) {
                return -1
            } else if (event[sort] < secondEvent[sort]) {
                return 1
            }
        } else {
            if (event[sort] < secondEvent[sort]) {
                return -1
            } else if (event[sort] > secondEvent[sort]) {
                return 1
            }
        }
        return 0
    })

    const filtered = sorted.filter(event => (
        (
            event.description.toLowerCase().includes(filter) ||
            event.title.toLowerCase().includes(filter) ||
            event.location.toLowerCase().includes(filter) ||
            event.organization.toLowerCase().includes(filter) ||
            event.startTime.toLocaleString().includes(filter) ||
            event.endTime.toLocaleString().includes(filter)
        ) && (
            !(props.title === 'My Events') || event.attendees.some(attendee => attendee.rsvp === 'Will Attend' && attendee.id === props.userInformation.id)
        )
    ))

    // const times: number[] = props.events.filter(event => props.events. event.startTime)

    const timeConflicts: number[] = []



    return (
        <div className="eventdashboard">
            <div className='eventdashboard-header'>
                <h2 className="start--title">
                    {props.title}
                </h2>
                <ThemeProvider theme={gtTheme}>
                    <Button variant='contained' startIcon={<AddIcon />} color='primary' id='createevent' onClick={() => setCreateDialog(true)}>
                        Create Event
                    </Button>
                </ThemeProvider>
            </div>       
            <div className="dashboardbody">
            <ThemeProvider theme={gtTheme}>
                <div className='searchsort'>
                    <Stack
                        direction='column'
                        alignItems='flex-start'
                        justifyContent='flex-start'
                        spacing={3}>
                    <TextField 
                    id='search' 
                    variant="standard" 
                    placeholder='Search...'
                    type='text'
                    value={filter}
                    style={{ width: 120}}
                    // inputProps={{ maxLength: 2}}
                    onChange={(e: any) => {setFilter(e.target.value); console.log(filter)}}
                    />
                    <FormControl>
                            <FormLabel>Sort</FormLabel>
                            <RadioGroup
                                defaultValue={sort}
                                onChange={(e: any) => setSort(e.target.value)}
                            >
                                <FormControlLabel value="startTime" control={<Radio />} label="Date" />
                                <FormControlLabel value="title" control={<Radio />} label="Title" />
                                <FormControlLabel value="location" control={<Radio />} label="Location" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Order</FormLabel>
                            <RadioGroup
                                defaultValue={order}
                                onChange={(e: any) => setOrder(e.target.value)}
                            >
                                <FormControlLabel value="ascending" control={<Radio />} label="Ascending" />
                                <FormControlLabel value="descending" control={<Radio />} label="Descending" />
                            </RadioGroup>
                        </FormControl>
                        {conflicts && <Typography variant='h6' color='primary'>Time Conflicts</Typography>}
                        {conflicts && attendingEvents.map((event, index) => {
                        for (let i = 0; i < attendingEvents.length; i++) {
                            const secondEvent = attendingEvents[i]
                            if (secondEvent.eventId !== event.eventId && !timeConflicts.includes(event.eventId) && event.startTime === secondEvent.startTime) {
                                        // timeConflicts.push(event.eventId)
                                        return (<Typography variant='body1'>{event.title}</Typography>)
                                    }
                                }
                        })}
                    </Stack>
                </div>
                </ThemeProvider>
                <div className="eventslist">
                    {filtered.map((event: eventType, index: number) => 
                    {
                        console.log(conflicts)
                        console.log(event.eventId)
                        // console.log(conflicts.includes(event.eventId))
                        return ((page - 1) * 10 <= index && index < 10 + (page - 1) * 10) ?
                        <Event 
                            event={event} 
                            eventKey={event.eventId}
                            userInformation={props.userInformation}
                            CreateEvent={CreateEvent}
                            DeleteEvent={DeleteEvent}
                            EditEvent={EditEvent}
                            key={event.eventId}
                            // conflict={!conflicts.includes(event.eventId)}
                        /> :
                        <div></div>
                    }
                        
                    )}
                </div>
            </div>

            {/* {props.events.map((event: eventType, index: number) => 
                ((page - 1) * 10 <= index && index < 10 + (page - 1) * 10) ?
                <Event 
                    event={event} 
                    eventKey={event.eventId}
                    userInformation={props.userInformation}
                    CreateEvent={CreateEvent}
                    DeleteEvent={DeleteEvent}
                    EditEvent={EditEvent}
                    key={event.eventId}
                /> :
                <div></div>
            )} */}
            
            
            <ThemeProvider theme={gtTheme}>
                <Stack alignItems='center'>
                    <Pagination 
                        count={Math.ceil(filtered.length / 10)} 
                        color='primary'
                        sx={{ backgroundColor: 'transparent', boxShadow: '0'}}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    />
                </Stack>
            </ThemeProvider>
            <Snackbar open={deleteSnackbar} autoHideDuration={6000} onClose={handleDeleteClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}>
                <Alert onClose={handleDeleteClose} severity='error' sx={{width: '100%'}}>
                    Only the creator or an administrator can delete
                </Alert>
            </Snackbar>
            <ThemeProvider theme={gtTheme}>
                <EventModal 
                    title='Create Event'
                    open={createDialog}
                    setOpen={setCreateDialog}
                    event={defaultEvent}
                    formValues={createForm}
                    handleFormChange={handleFormChange}
                    handleFormSubmit={handleFormSubmit}
                    setFormValues={setCreateForm}
                    handleFormStartTime={handleFormStartTime}
                    handleFormEndTime={handleFormEndTime}
                />

            {/* <Dialog
                    fullWidth
                    open={createDialog}
                    onClose={() => {
                        setCreateDialog(false)
                        setCreateForm(defaultEvent)
                    }}
                >
                    <DialogTitle>Create Event</DialogTitle>
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
                                    value={createForm.title}
                                    onChange={handleFormChange}
                                    margin="dense"
                                    required
                                    error={createForm.title === ''}
                                    helperText={createForm.title === '' && 'Please enter an event title'}
                                    fullWidth
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel>Registration Type</FormLabel>
                                    <RadioGroup row name='inviteOnly'  onChange={handleFormChange} value={createForm.inviteOnly}>
                                        <FormControlLabel value={false} control={<Radio />} label={'Standard RSVP'} 
                                           />
                                        <FormControlLabel value={true} control={<Radio />} label={'Invite-Only'} 
                                           />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    name='location'
                                    label='Location' 
                                    variant='outlined'
                                    type='text'
                                    value={createForm.location}
                                    onChange={handleFormChange}
                                    margin="dense"
                                    error={createForm.location === ''}
                                    helperText={createForm.location === '' && 'Please enter a location'}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item  xs={12}>
                            <TextField 
                                name='description'
                                label='Description' 
                                variant='outlined'
                                type='text'
                                value={createForm.description}
                                onChange={handleFormChange}
                                margin="dense"
                                multiline
                                fullWidth
                                error={createForm.description === ''}
                                helperText={createForm.description === '' && 'Please enter a description'}
                            />
                            </Grid>
                        </Grid>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFormSubmit} color='primary'>Create Event</Button>
                        <Button onClick={() => {setCreateDialog(false); setCreateForm(defaultEvent)}}>Cancel</Button>
                    </DialogActions>
                </Dialog> */}
            </ThemeProvider>
        </div>
    )
}