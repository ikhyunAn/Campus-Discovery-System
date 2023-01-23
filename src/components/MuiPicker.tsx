import React, { useState } from 'react'
import { Stack, TextField, Grid } from '@mui/material'
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

type eventType = {
    eventId: number,
    title : string,
    host : string,
    description: string,
    location: string,
    image: string,
    date: number,
    time: number,
    organization: string,
    creatorId : number,
    attendees: {id: number, name: string, rsvp: string}[],
}

type props = {
    formValues: eventType
    handleFormDate(e: any): any
    handleFormTime(e: any): any
}

export default function MuiPicker(props: props) {

    return (
        <>
        <Grid item xs={12} sm={6}>
            <DatePicker
                label='Date'
                renderInput={(params) => <TextField {...params}/>}
                value={props.formValues.date}
                onChange={props.handleFormDate}
            />
        </Grid>
         <Grid item xs={12} sm={6}>
            <TimePicker
                // name='time'
                label='Time'
                renderInput={(params) => <TextField {...params}/>}
                value={props.formValues.time}
                onChange={(e) => props.handleFormTime(e)}
            />
        </Grid>
        </>
    )
}