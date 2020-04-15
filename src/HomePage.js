import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  Button,
  ListItem,
  Card,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import CaseDisplay from "./CaseDisplay";
import { Link } from "react-router-dom";
import EventIcon from "@material-ui/icons/Event";
import AddBoxIcon from "@material-ui/icons/AddBox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import TimerIcon from "@material-ui/icons/Timer";
import AddCase from "./AddCase";
import { db } from "./firebase";

export default function HomePage(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [caseArray, setCaseArray] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collectionGroup("cases").onSnapshot((snapshot) => {
      const updatedCases = snapshot.docs.map((s) => {
        const data = {
          id: s.id,
          image: s.data().image,
          company: s.data().company,
          prize: s.data().prize,
          notes: s.data().notes,
          startDate: new Date(s.data().startDate.seconds * 1000),
          endDate: new Date(s.data().endDate.seconds * 1000),
        };
        return data;
      });
      const sorted = updatedCases.sort((a, b) => {
        if (a.startDate > b.startDate) {
          return 1;
        } else {
          return -1;
        }
      });
      setCaseArray(sorted);
    });

    return unsubscribe;
  }, [props]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Card style={{ maxWidth: 1400 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="300"
            width="1300"
            image={
              "https://www.gouconnect.com/wp-content/themes/uConnect_V4/img/case-studies/csh-byu.png"
            }
          />
        </CardActionArea>
      </Card>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "Right",
          marginTop: 10,
          marginLeft: 10,
        }}
      >
        <Paper>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TimerIcon style={{ marginRight: 10, height: 50, width: 50 }} />
              <Typography
                variant="h4"
                style={{ marginTop: 15, marginBottom: 15 }}
              >
                Current Case Competitions
              </Typography>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" style={{ marginLeft: 100 }}>
                Company
              </Typography>
              <Typography variant="h6" style={{ marginRight: 30 }}>
                Prizes
              </Typography>
              <Typography variant="h6" style={{ marginRight: 490 }}>
                Dates
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <List>
                {caseArray
                  .filter((c) => {
                    return c.endDate > new Date() && c.startDate < new Date();
                  })
                  .map((a) => {
                    return (
                      <ListItem key={a.id}>
                        <CaseDisplay
                          id={a.id}
                          company={a.company}
                          prize={a.prize}
                          start={a.startDate}
                          end={a.endDate}
                          image={a.image}
                          current={true}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <EventIcon style={{ marginRight: 10, height: 50, width: 50 }} />
              <Typography
                variant="h4"
                style={{ marginTop: 15, marginBottom: 15 }}
              >
                Cases Coming Up
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" style={{ marginLeft: 100 }}>
                Company
              </Typography>
              <Typography variant="h6" style={{ marginRight: 30 }}>
                Prizes
              </Typography>
              <Typography variant="h6" style={{ marginRight: 490 }}>
                Dates
              </Typography>
            </div>
            <List>
              {caseArray
                .filter((c) => {
                  return c.startDate > new Date();
                })
                .map((a) => {
                  return (
                    <ListItem key={a.id}>
                      <CaseDisplay
                        id={a.id}
                        company={a.company}
                        prize={a.prize}
                        start={a.startDate}
                        end={a.endDate}
                        image={a.image}
                        future={true}
                      />
                    </ListItem>
                  );
                })}
            </List>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <div style={{ display: "flex", marginLeft: 15, marginRight: 15 }}>
              <Button
                onClick={() => {
                  setDialogOpen(true);
                }}
                style={{ marginRight: 15 }}
              >
                <AddBoxIcon
                  style={{ height: 60, width: 60, marginRight: 15 }}
                />
                Sponsor A Case
              </Button>
            </div>
            <div style={{ display: "flex", marginLeft: 15, marginRight: 15 }}>
              <Button
                to={"/app/pastcases/"}
                component={Link}
                style={{ marginRight: 15 }}
              >
                <CheckBoxIcon
                  style={{ height: 60, width: 60, marginRight: 15 }}
                />
                See Past Cases
              </Button>
            </div>
          </div>
        </Paper>
      </div>
      <AddCase
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        user={props.user}
      />
    </div>
  );
}
