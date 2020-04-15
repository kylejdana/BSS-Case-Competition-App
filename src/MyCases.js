import React, { useState, useEffect } from "react";
import { Typography, Paper, List, ListItem } from "@material-ui/core";
import CaseDisplay from "./CaseDisplay";
import EventIcon from "@material-ui/icons/Event";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import TimerIcon from "@material-ui/icons/Timer";
import { db } from "./firebase";

export default function HomePage(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [personalArray, setPersonalArray] = useState([]);
  const [caseArray, setCaseArray] = useState([]);

  // need to only output the cases in the case array that match the id's from the user's account
  // I need the complete array of personal cases from the user
  // I need to match the ids of that array to the other arrays.

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(props.match.params.user_id)
      .collection("personalCases")
      .onSnapshot((snapshot) => {
        const personalCases = snapshot.docs.map((s) => {
          const data = {
            id: s.data().caseID,
          };
          return s.data().company;
        });
        setPersonalArray(personalCases);
      });

    return unsubscribe;
  }, [props]);

  useEffect(() => {
    console.log("This is the Personal Array");
    console.log(personalArray);
    if (personalArray.length > 0) {
      db.collection("cases")
        .where("company", "in", personalArray)
        .get()
        .then((snapshot) => {
          const matchedCases = snapshot.docs.map((a) => {
            const aCase = a.data();
            return {
              caseID: a.id,
              company: a.data().company,
              startDate: new Date(a.data().startDate.seconds * 1000),
              endDate: new Date(a.data().endDate.seconds * 1000),
              prize: a.data().prize,
              image: a.data().image,
            };
          });
          const sortedMatchedCases = matchedCases.sort((a, b) => {
            if (a.startDate > b.startDate) {
              return 1;
            } else {
              return -1;
            }
          });
          setCaseArray(sortedMatchedCases);
        });
    }
  }, [personalArray]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
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
              <Typography variant="h6" style={{ marginRight: 480 }}>
                Dates
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <List>
                {caseArray
                  .filter((c) => {
                    return c.endDate >= new Date() && c.startDate < new Date();
                  })
                  .map((a) => {
                    return (
                      <ListItem key={a.caseID}>
                        <CaseDisplay
                          id={a.caseID}
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
              <Typography variant="h6" style={{ marginRight: 480 }}>
                Dates
              </Typography>
            </div>
            <List>
              {console.log("This is the Case Array")}
              {console.log(caseArray)}
              {caseArray
                .filter((c) => {
                  return c.startDate >= new Date();
                })
                .map((a) => {
                  return (
                    <ListItem key={a.caseID}>
                      <CaseDisplay
                        id={a.caseID}
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

          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <BeenhereIcon
                style={{ marginRight: 10, height: 50, width: 50 }}
              />
              <Typography
                variant="h4"
                style={{ marginTop: 15, marginBottom: 15 }}
              >
                Past Cases
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
              <Typography variant="h6" style={{ marginRight: 480 }}>
                Dates
              </Typography>
            </div>
            <List>
              {caseArray
                .filter((c) => {
                  return c.endDate < new Date();
                })
                .map((a) => {
                  return (
                    <ListItem key={a.caseID}>
                      <CaseDisplay
                        id={a.caseID}
                        company={a.company}
                        prize={a.prize}
                        start={a.startDate}
                        end={a.endDate}
                        image={a.image}
                        past={true}
                      />
                    </ListItem>
                  );
                })}
            </List>
          </div>
        </Paper>
      </div>
    </div>
  );
}
