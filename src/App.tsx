import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginFunction from './components/LoginFunction';
import RegisterFunction from './components/RegisterFunction';
import Home from './Home';
import MapView from './components/MapView';
import {db} from './components/firebase'
import { doc, getDocs, setDoc, collection } from 'firebase/firestore'
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useState } from 'react';
import EventDashboard from './components/EventDashboard';
import Navbar from './components/Navbar';
import MapPrepare from './components/MapPrepare';

export default function App() {
  const eventscollectionRef = collection(db, "events");

  const defaultUser = {name : "", username : "", password : "", category : "Student", id : -1}
  const [userInformation, setUserInformation] = useState(defaultUser);
  const userscollectionRef = collection(db, "users");
  async function changeUser(id : number){
    const data = await getDocs(userscollectionRef);
    data.forEach(doc => {
      if (parseInt(doc.id) === id) {
        setUserInformation({
          id: parseInt(doc.id),
          name: doc.data().name,
          username: doc.data().username,
          password: doc.data().password,
          category: doc.data().category,
        })
        }
    });
  }
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
    attendees: {id: number, name: string, rsvp: RSVPtype}[]
    capacity: number,
}
  const [events, setEvents]: [eventType[], any] = React.useState( [
    /*{
      eventId: 0,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      startTime: Date.now(),
      endTime: Date.now(),
      organization: 'GT Vietnamese Student Association',
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      creatorId : 3,
      inviteOnly: false,
      capacity: 25,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 4,'name': 'John', rsvp: 'Maybe'},
          {"id": 5,'name': 'Heesuk', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity : 10
    },
    {
      eventId: 1,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      startTime: new Date(2022, 9, 13, 18, 0, 0).valueOf(),
      endTime: new Date(2022, 9, 13, 18, 0, 0).valueOf(),
      organization: 'GT Vietnamese Student Association',
      creatorId : 3,
      inviteOnly: false,
      capacity: 50,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity : 10
    },
    {
      eventId: 2,
      title : "Couchella",
      host : "Musician's Network",
      description: "Join us on NOVEMBER 5th FROM 2-11 PM on Peter's Parking Deck for our FREE all-day live music festival, COUCHELLA, featuring nelward, hillview 73, J-Royal, Dat Bussa Jumbo, Buice, and MORE!!!! Bring your friends, bring your dog, bring your friend's dog!!! See you there!",
      location: "Peter's Parking Deck",
      image: 'https://preview.redd.it/gt-musicians-network-presents-couchella-join-us-tomorrow-v0-8tizk34z0zx91.png?width=1533&format=png&auto=webp&s=6d47d214caf5b6d7c3f1a2b0c2b7ab4614a79bad',
      startTime: new Date(2022, 10, 4, 14, 0, 0).valueOf(),
      endTime: new Date(2022, 10, 4, 14, 0, 0).valueOf(),
      organization: "Musician's Network",
      creatorId : 3,
      inviteOnly: false,
      capacity: 1000,
      attendees: [
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: "Won't Attend"},
          {"id": 1,'name': 'Siam', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity :10
    },
    {
      eventId: 3,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      startTime: new Date(2022, 9, 13, 18, 0, 0).valueOf(),
      endTime: new Date(2022, 9, 13, 18, 0, 0).valueOf(),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: true,
      capacity: 75,
      attendees: [
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 1,'name': 'Siam', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity : 10
    },
    {
      eventId: 4,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 5,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      date: Date.now(),
      time: Date.now(),
      organization: 'GT Vietnamese Student Association',
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 4,'name': 'John', rsvp: 'Maybe'},
          {"id": 5,'name': 'Heesuk', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 6,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity : 10
    },
    {
      eventId: 7,
      title : "Couchella",
      host : "Musician's Network",
      description: "Join us on NOVEMBER 5th FROM 2-11 PM on Peter's Parking Deck for our FREE all-day live music festival, COUCHELLA, featuring nelward, hillview 73, J-Royal, Dat Bussa Jumbo, Buice, and MORE!!!! Bring your friends, bring your dog, bring your friend's dog!!! See you there!",
      location: "Peter's Parking Deck",
      image: 'https://preview.redd.it/gt-musicians-network-presents-couchella-join-us-tomorrow-v0-8tizk34z0zx91.png?width=1533&format=png&auto=webp&s=6d47d214caf5b6d7c3f1a2b0c2b7ab4614a79bad',
      date: new Date(2022, 10, 4, 14, 0, 0),
      time: new Date(2022, 10, 4, 14, 0, 0),
      organization: "Musician's Network",
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: "Won't Attend"},
          {"id": 1,'name': 'Siam', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 8,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: true,
      attendees: [
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 1,'name': 'Siam', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 9,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 10,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      date: Date.now(),
      time: Date.now(),
      organization: 'GT Vietnamese Student Association',
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 4,'name': 'John', rsvp: 'Maybe'},
          {"id": 5,'name': 'Heesuk', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity:10
    },
    {
      eventId: 11,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 12,
      title : "Couchella",
      host : "Musician's Network",
      description: "Join us on NOVEMBER 5th FROM 2-11 PM on Peter's Parking Deck for our FREE all-day live music festival, COUCHELLA, featuring nelward, hillview 73, J-Royal, Dat Bussa Jumbo, Buice, and MORE!!!! Bring your friends, bring your dog, bring your friend's dog!!! See you there!",
      location: "Peter's Parking Deck",
      image: 'https://preview.redd.it/gt-musicians-network-presents-couchella-join-us-tomorrow-v0-8tizk34z0zx91.png?width=1533&format=png&auto=webp&s=6d47d214caf5b6d7c3f1a2b0c2b7ab4614a79bad',
      date: new Date(2022, 10, 4, 14, 0, 0),
      time: new Date(2022, 10, 4, 14, 0, 0),
      organization: "Musician's Network",
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: "Won't Attend"},
          {"id": 1,'name': 'Siam', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 13,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: true,
      attendees: [
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 1,'name': 'Siam', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 14,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 15,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      date: Date.now(),
      time: Date.now(),
      organization: 'GT Vietnamese Student Association',
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 4,'name': 'John', rsvp: 'Maybe'},
          {"id": 5,'name': 'Heesuk', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 16,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 17,
      title : "Couchella",
      host : "Musician's Network",
      description: "Join us on NOVEMBER 5th FROM 2-11 PM on Peter's Parking Deck for our FREE all-day live music festival, COUCHELLA, featuring nelward, hillview 73, J-Royal, Dat Bussa Jumbo, Buice, and MORE!!!! Bring your friends, bring your dog, bring your friend's dog!!! See you there!",
      location: "Peter's Parking Deck",
      image: 'https://preview.redd.it/gt-musicians-network-presents-couchella-join-us-tomorrow-v0-8tizk34z0zx91.png?width=1533&format=png&auto=webp&s=6d47d214caf5b6d7c3f1a2b0c2b7ab4614a79bad',
      date: new Date(2022, 10, 4, 14, 0, 0),
      time: new Date(2022, 10, 4, 14, 0, 0),
      organization: "Musician's Network",
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: "Won't Attend"},
          {"id": 1,'name': 'Siam', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 18,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: true,
      attendees: [
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 1,'name': 'Siam', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 19,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 20,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      date: Date.now(),
      time: Date.now(),
      organization: 'GT Vietnamese Student Association',
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 4,'name': 'John', rsvp: 'Maybe'},
          {"id": 5,'name': 'Heesuk', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 21,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 22,
      title : "Couchella",
      host : "Musician's Network",
      description: "Join us on NOVEMBER 5th FROM 2-11 PM on Peter's Parking Deck for our FREE all-day live music festival, COUCHELLA, featuring nelward, hillview 73, J-Royal, Dat Bussa Jumbo, Buice, and MORE!!!! Bring your friends, bring your dog, bring your friend's dog!!! See you there!",
      location: "Peter's Parking Deck",
      image: 'https://preview.redd.it/gt-musicians-network-presents-couchella-join-us-tomorrow-v0-8tizk34z0zx91.png?width=1533&format=png&auto=webp&s=6d47d214caf5b6d7c3f1a2b0c2b7ab4614a79bad',
      date: new Date(2022, 10, 4, 14, 0, 0),
      time: new Date(2022, 10, 4, 14, 0, 0),
      organization: "Musician's Network",
      creatorId : 3,
      inviteOnly: false,
      attendees: [
          {"id": 2,'name': 'Thang', rsvp: 'Will Attend'},
          {"id": 3,'name': 'Ammar', rsvp: "Won't Attend"},
          {"id": 1,'name': 'Siam', rsvp: "Won't Attend"},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 23,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: true,
      attendees: [
          {"id": 3,'name': 'Ammar', rsvp: 'Will Attend'},
          {"id": 1,'name': 'Siam', rsvp: 'Maybe'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    {
      eventId: 24,
      title : "GT VSA MoonFest",
      host : "GT VSA",
      description: "The Georgia Tech Vietnamese Student Association would like to invite you to our 12th annual Moon Festival! The event will be hosted at Tech Green on Thursday, October 13th from 6:00 PM - 9:00 PM.\n Admission, food, and drinks are FREE for GT students and faculty with their Buzzcard. We will be serving many traditional Asian cuisines and will have plenty of performances, games, and prizes!",
      location: "Tech Green",
      image: 'https://www.gatech.edu/sites/default/files/hg_media/5ed108a9-1570-4e46-b85f-b9e76ecd7ac6248135fd-1bb8-4417-a3dd-43f81bd4a2ce.jpg',
      date: new Date(2022, 9, 13, 18, 0, 0),
      time: new Date(2022, 9, 13, 18, 0, 0),
      organization: 'GT Vietnamese Student Association',
      creatorId : 1,
      inviteOnly: false,
      capacity: 100,
      attendees: [
          {"id": 1,'name': 'Siam', rsvp: 'Will Attend'},
        // "I'm Your Nemesis": [
        //   {"id": 1,'name': 'Siam'},
        // ]
      ],
      guestCapacity: 10
    },
    */
  ])

  let toBeRead: Boolean = true;

  async function getEvents() {
    if (toBeRead) {
      //let events: eventType[];
      console.log("working")
      const data = await getDocs(eventscollectionRef);
      data.forEach(doc => {
          var newEvent: eventType = {
              eventId : parseInt(doc.data().eventId),
              title: doc.data().title,
              host : doc.data().host,
              description: doc.data().description,
              location: doc.data().location,
              startTime: doc.data().startTime,
              endTime: doc.data().endTime,
              organization: doc.data().organization,
              image: doc.data().image,
              creatorId : doc.data().creatorId,
              inviteOnly: doc.data().inviteOnly,
              attendees: doc.data().attendees,
              capacity : doc.data().capacity
          };
          
          events.push(newEvent);
          
      })
    toBeRead = false;
  }}

  React.useEffect(()=>{
      getEvents();
      toBeRead = false;
      console.log("use effect work");
  },[])

  function logout() {
    setUserInformation(defaultUser)
  }
  const [register, setRegister] = useState(false);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Router>
        <div className="App">
          <Navbar userInformation={userInformation} logout={logout}/>
          <div className="content">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<LoginFunction changeUser={changeUser} setRegister={setRegister} userInformation={userInformation}/>}/>
                <Route path="/register" element={<RegisterFunction changeUser={changeUser} setRegister={setRegister} userInformation={userInformation}/>}/>
                <Route path="/dashboard" element={<EventDashboard userInformation={userInformation} setEvents={setEvents} events={events} title='Event Dashboard'/>}/>
                <Route path="/map" element={<MapPrepare events={events} userId={userInformation.id}/>}/>
                <Route path="/myevents" element={<EventDashboard userInformation={userInformation} setEvents={setEvents} events={events} title='My Events'/>}/>
              </Routes>
            {/* <Footer/> */}
          </div>
        </div>
      </Router>
    </LocalizationProvider>
  );
}