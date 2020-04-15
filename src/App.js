import React, { useState, useEffect } from "react";
import MenuIcon from "@material-ui/icons/Menu";
//import * as Colors from "material-ui/styles/colors";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link, Route } from "react-router-dom";
import { auth } from "./firebase";
import AddCase from "./AddCase";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CasePage from "./CasePage";
import HomePage from "./HomePage";
import PastCases from "./PastCases";
import MyCases from "./MyCases";
import { db, snapshotToArray } from "./firebase";

export function App(props) {
  const [drawer_open, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [caseArray, setCaseArray] = useState([
    {
      id: "1",
      company: "Dentist",
      prize: "Toothpaste",
      start: "Tomorrow",
      end: "Never",
      image:
        "https://cdn11.bigcommerce.com/s-all2n9o8xo/images/stencil/1280x1280/products/55803/47765/WOW-LENNFK__29470.1565007126.jpg?c=2&imbypass=on",
    },
  ]);

  useEffect(() => {
    const unsubscribe = db.collection("cases").onSnapshot((snapshot) => {
      const updatedCases = snapshotToArray(snapshot);
      setCaseArray(updatedCases);
    });

    return unsubscribe;
  }, [props]);

  const handleClick = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        props.history.push("/");
      }
    });

    return unsubscribe;
  }, [props.history]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!user) {
    return <div />;
  }

  if (!caseArray) {
    return <div />;
  }

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => {
              setDrawerOpen(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            style={{ flexGrow: 1, marginLeft: "30px" }}
          >
            BYU Case Competition Hub
          </Typography>
          <Typography color="inherit" style={{ marginRight: "30px" }}>
            Hi! {user.email}
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        open={drawer_open}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <List>
          <ListItem
            button
            to={"/app/home/"}
            component={Link}
            onClick={() => {
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            to={"/app/pastcases/"}
            component={Link}
            onClick={() => {
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="Past Cases" />
          </ListItem>
          <ListItem button onClick={handleClick}>
            <ListItemText primary="Cases" />
            {open ? <ExpandMore /> : <ExpandLess />}
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div">
              {caseArray.map((a) => {
                return (
                  <ListItem
                    key={a.id}
                    button
                    to={"/app/case/" + a.id + "/"}
                    component={Link}
                    onClick={() => {
                      setDrawerOpen(false);
                    }}
                  >
                    <ListItemText primary={a.company} />
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
          <ListItem
            button
            to={"/app/mycases/" + user.uid}
            component={Link}
            onClick={() => {
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary="My Cases" />
          </ListItem>
        </List>
      </Drawer>
      <Route
        path="/app/case/:case_id/"
        render={(routeProps) => {
          return <CasePage user={user} cases={caseArray} {...routeProps} />;
        }}
      />

      <Route
        path="/app/home/"
        render={(routeProps) => {
          return <HomePage user={user} cases={caseArray} />;
        }}
      />
      <Route
        path="/app/pastcases/"
        render={(routeProps) => {
          return <PastCases user={user} cases={caseArray} />;
        }}
      />
      <Route
        path="/app/mycases/:user_id/"
        render={(routeProps) => {
          return <MyCases user={user} cases={caseArray} {...routeProps} />;
        }}
      />

      <AddCase
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        user={user}
      />
    </div>
  );
}
