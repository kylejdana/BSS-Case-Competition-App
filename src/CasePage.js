import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import TeamBar from "./TeamBar";
import AddTeam from "./AddTeam";
import CaseInfoHeader from "./CaseInfoHeader";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { List, ListItem } from "@material-ui/core";
import { db, snapshotToArray } from "./firebase";
import MomentUtils from "@date-io/moment";

export default function CasePage(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teams, setTeams] = useState([
    {
      id: "1",
      creation_date: "today",
      nickname: "dummy",
      captain: "dummies",
      phoneNumber: "1111111111",
      teamEmail: "team@gmail.com",
    },
  ]);
  const [caseArray, setCaseArray] = useState([]);
  let caseID = props.match.params.case_id;

  /*
  const [caseID, setCaseID] = useState("");

  useEffect(() => {
    const unsubscribe = db
      .collection("cases")
      .doc(props.match.params.case_id)
      setCaseID(case);

    return unsubscribe;
  }, [props]);
*/
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
      setCaseArray(updatedCases);
    });

    return unsubscribe;
  }, [props]);

  useEffect(() => {
    const unsubscribe = db
      .collection("cases")
      .doc(caseID)
      .collection("teams")
      .onSnapshot((snapshot) => {
        const teamArray = snapshotToArray(snapshot);

        const sorted = teamArray.sort((a, b) => {
          if (a.creationDate > b.creationDate) {
            return 1;
          } else {
            return -1;
          }
        });
        setTeams(sorted);
      });

    return unsubscribe;
  }, [props]);

  if (!teams) {
    return <div />;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        paddingLeft: 10,
        paddingTop: 10,
      }}
    >
      {caseArray
        .filter((c) => {
          return c.id === caseID;
        })
        .map((a) => {
          return (
            <ListItem key={a.id}>
              <CaseInfoHeader
                id={a.id}
                image={a.image}
                prize={a.prize}
                company={a.company}
                start={a.startDate}
                end={a.endDate}
                notes={a.notes}
                uid={props.user.uid}
                onClose={() => {
                  setDialogOpen(false);
                }}
              />
            </ListItem>
          );
        })}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <List>
          {teams.map((a, num) => {
            return (
              <ListItem key={a.id}>
                <TeamBar
                  teamID={a.id}
                  nickname={a.nickname}
                  creation_date={a.creation_date}
                  captain={a.captain}
                  email={a.teamEmail}
                  phoneNumber={a.phoneNumber}
                  case={caseID}
                  teamNumber={num}
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
          justifyContent: "flex-start",
          marginLeft: 15,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 15,
          }}
        >
          <Button
            onClick={() => {
              setDialogOpen(true);
            }}
            style={{ marginRight: 15 }}
          >
            <AddBoxIcon style={{ height: 100, width: 100, marginRight: 15 }} />
            Enter Your Team
          </Button>
        </div>
      </div>
      <AddTeam
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        user={props.user}
        cases={props.cases}
        caseID={props.match.params.case_id}
      />
    </div>
  );
}
