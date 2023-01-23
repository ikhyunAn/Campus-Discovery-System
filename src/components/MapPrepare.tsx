import React from "react"
import MapView from "./MapView"

type props = {
    events: eventType[],
    userId: number
  }
  type locationType = {
      name : string,
      latitude : number,
      longitude: number,
  }
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
  }
  type RSVPtype = 'RSVP' | 'Will Attend' | 'Maybe' | "Won't Attend"
  
  export default function MapPrepare(props : props) {
      const classLocations = [
        { name : "Klaus",
        latitude : 33.7771562,
        longitude: -84.3962024}, 
        { name : "Clough",
        latitude : 33.7746494,
        longitude: -84.3964166},
        { name : "College of Computing",
        latitude : 33.777353,
        longitude: -84.3973721}, 
        { name : "Instructional Center",
        latitude : 33.7754021,
        longitude: -84.4013294},
        { name : "Student Center",
        latitude : 33.774009704589,
        longitude: -84.39887237548},
        { name : "Howey",
        latitude : 33.7773099,
        longitude: -84.3986777}, 
        { name : "Ferst Center of the Arts",
        latitude : 33.774909704589,
        longitude: -84.39927237548},
        { name : "Exhibition Hall",
        latitude : 33.774509704589,
        longitude: -84.4015294},
      ]
      let markers : locationType[] = [];
      function addMarkers() {
        for(let i = 0; i < props.events.length; i++) {
          for(let j = 0; j < props.events[i].attendees.length; j++) {
            if (props.events[i].attendees[j].id == props.userId && props.events[i].attendees[j].rsvp == "Will Attend") {
              for(let k = 0; k < classLocations.length; k++) {
                if (classLocations[k].name == props.events[i].location) {
                  markers.push(classLocations[k])
                }
              }
            }
          }
        }
        console.log(markers)
      }
      addMarkers()
      return(
        <div>
            <MapView markers={markers}/>
        </div>
      );
      
  }