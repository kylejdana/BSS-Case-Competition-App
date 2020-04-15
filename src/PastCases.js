import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  List,
  ListItem,
  Card,
  CardMedia,
  CardActionArea,
} from "@material-ui/core";
import CaseDisplay from "./CaseDisplay";
import BeenhereIcon from "@material-ui/icons/Beenhere";
import { db } from "./firebase";

export default function PastCases(props) {
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

  //Consider adding a useEffect feature taht creates an array of current cases and non

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
              <Typography variant="h6" style={{ marginRight: 500 }}>
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
                    <ListItem key={a.id}>
                      <CaseDisplay
                        id={a.id}
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
