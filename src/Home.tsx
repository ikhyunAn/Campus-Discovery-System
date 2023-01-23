import React from 'react'
import Buzz from './components/Buzz'
import {ThemeProvider, createTheme} from '@mui/material/styles'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'


function Home() {
  const goldTheme = createTheme({
    palette: {
        primary: {
            main: '#B3A369',
            contrastText: 'white'
        },
    }
  })
  return (
    <div>
    {/* <nav>
        <img src={require("./images/GTLogo.png")} alt="Georgia Tech Logo" className="nav--logo"/>
    </nav> */}
    <section className='welcome'>
        <div className='start'>
          <h2 className="start--title">Campus Discovery System</h2>
          <p className="start--text">
            Discover new experiences and events across the Georgia Tech Campus!
          </p>
          <ThemeProvider theme={goldTheme}>
          <Button 
            // onClick={() => setStart(false)}
            variant='contained'
            color='primary'
            size ='large'
            component={Link} to = "/login"
            // sx={{ color: 'blue', backgroundColor: 'transparent', borderColor: 'blue'}}
            >START DISCOVERING</Button>
          </ThemeProvider>
          {/* <button className="start--button" onClick={() => setStart(false)}>START DISCOVERING</button> */}
      </div>
      <Buzz />
    </section>
    </div>
    
  );
}

export default Home;

{/* <div className="home">
      <h2 className="start--title">Campus Discovery System</h2>
        <p className="start--text">
          Discover new experiences and events across the Georgia Tech Campus!
        </p>
        <Buzz />
        <Link to="/login">
          <button type="button">
            Start Discovering
          </button>
        </Link>
        <footer className=''>

        </footer>
    </div> */}