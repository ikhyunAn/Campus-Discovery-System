import React from "react"
import { styled, alpha} from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings'
import PersonRounded from '@mui/icons-material/PersonRounded'
import SchoolRounded from '@mui/icons-material/SchoolRounded'
import BuildRounded from '@mui/icons-material/BuildRounded'
import IconButton from "@mui/material/IconButton"
import Typography from '@mui/material/Typography'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import { indigo } from '@mui/material/colors'
import { Link } from 'react-router-dom'

const linkStyle = {
    color: "black",
    textDecoration: "none"
}

const gtTheme = createTheme({
    palette: {
        primary: {
            main: '#B3A369',
            contrastText: 'white'
        },
        secondary: {
            main: '#003057',
            contrastText: 'white'
        }
    }
})


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha('#B3A369', 0.10),
    '&:hover': {
      backgroundColor: alpha('#B3A369', 0.20),
    },
    marginRight: 0, //theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
    width: '20ch',
    },
    },
}));


type props = {
    userInformation : {name : string, category: string, username : string, password : string, id : number},
    logout(): void
}

type userInfo = {name : string, category: string, username : string, password : string, id : number}


export default function Navbar(props: props) {
    const [anchorEl, setAnchorEl]: [anchorEl: null | HTMLElement,setAnchorEl: any] = React.useState(null)

    const isMenuOpen = Boolean(anchorEl)

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleMenuClose = () => {
        setAnchorEl(null);
    }

    const menuId = 'thing'

    const userInformation: userInfo = props.userInformation || {
        name: null,
        username: null,
        password: null,
        category: null,
        id: -1
    }

    const linkStyle = {
        color: "black",
        textDecoration: "none"
    }

    console.log(userInformation)

    return (
        <nav>
            <div className="nav--logodiv">
                <img src={require("../images/GTLogo.png")} alt="Georgia Tech Logo" className="nav--logo"/>
            </div>
            {userInformation.name &&
            <ThemeProvider theme={gtTheme}>
                {/* <Box sx={{ flexGrow: 1}}> */}
                    {false &&
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    }
                <Box sx={{ display: { xs: 'none', md: 'flex' } }} alignItems='center'>
                    <Typography variant='h6'>{userInformation.name}</Typography>
                    <IconButton edge='end' onClick={handleProfileMenuOpen} color='secondary'>
                        <Avatar sx={{ bgcolor: '#003057' }} >
                            {userInformation.category === 'Administrator' && <BuildRounded />}
                            {userInformation.category === 'Teacher' && <SchoolRounded />}
                            {userInformation.category === 'Student' && <PersonRounded />}
                        </Avatar>
                    </IconButton>
                </Box>
            </ThemeProvider>
            }
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                id={menuId}
                keepMounted
                transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <Link to="/dashboard" style={linkStyle}>
                    <MenuItem>Dashboard</MenuItem>
                </Link>
                <Link to="/myevents" style={linkStyle}>
                    <MenuItem>My Events</MenuItem>
                </Link>
                <Link to="/map" style={linkStyle}>
                    <MenuItem>Map</MenuItem>
                </Link>
                <Link to="/" style={linkStyle}>
                    <MenuItem onClick={props.logout}>Log Out</MenuItem>
                </Link>
                {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
            </Menu>
        </nav>
    )
}

