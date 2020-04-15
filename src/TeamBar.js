import React, { useState, useEffect } from "react";
import TeamMember from "./TeamMember";
import { Typography, Button, Paper, List, ListItem } from "@material-ui/core/";
import AddBoxIcon from "@material-ui/icons/AddBox";
import AddMember from "./AddMember";
import { db, storage } from "./firebase";

export default function TeamBar(props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [members, setMembers] = useState([]);
  let teamID = props.teamID;

  useEffect(() => {
    const unsubscribe = db
      .collection("cases")
      .doc(props.case)
      .collection("teams")
      .doc(props.teamID)
      .collection("members")
      .onSnapshot((snapshot) => {
        const memberArray = snapshot.docs.map((doc) => {
          const member = {
            memberName: doc.data().memberName,
            memberEmail: doc.data().memberEmail,
            memberPic: doc.data().memberPic,
          };
          return member;
        });
        setMembers(memberArray);
      });
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    storage
      .ref("cases/" + props.case + "/teams/" + teamID)
      .put(file)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          db.collection("cases")
            .doc(props.case)
            .collection("teams")
            .doc(teamID)
            .update({ file: downloadURL })
            .then(() => {
              setFile(downloadURL);
            });
        });
      });
    //setFile(file);
  };

  return (
    <Paper>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          color="primary"
          variant="contained"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 15,
            marginRight: 25,
          }}
        >
          <Typography variant="h5">Team</Typography>
          <Typography variant="h2"> {props.teamNumber + 1} </Typography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            justifyContent: "space-around",
            marginRight: 30,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2"> Nickname: </Typography>
            <Typography style={{ marginLeft: 30 }}>
              {" "}
              {props.nickname}{" "}
            </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2"> Team Captain: </Typography>
            <Typography style={{ marginLeft: 30 }}>{props.captain}</Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2"> Email: </Typography>
            <Typography style={{ marginLeft: 30 }}> {props.email} </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2"> Phone Number: </Typography>
            <Typography style={{ marginLeft: 30 }}>
              {" "}
              {props.phoneNumber}{" "}
            </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle2"> Submission: </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                component="label"
                style={{ marginLeft: 20, marginTop: 5, marginBottom: 20 }}
              >
                Choose a File
                <input
                  type="file"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
              </Button>

              {file && (
                <a href={file} target="_blank">
                  {"View File"}
                </a>
              )}
            </div>
          </div>
          <Typography></Typography>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <List>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {members.map((a) => {
                return (
                  <ListItem key={a.id}>
                    <TeamMember
                      //id={a.id}
                      memberName={a.memberName}
                      memberEmail={a.memberEmail}
                      image={a.memberPic}
                      teamID={props.teamID}
                      case={props.case}
                    />
                  </ListItem>
                );
              })}
            </div>
          </List>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginLeft: 15,
            }}
          >
            <Button
              onClick={() => {
                setDialogOpen(true);
              }}
              style={{ marginRight: 15 }}
            >
              <AddBoxIcon style={{ height: 60, width: 60, marginRight: 15 }} />
              Add Member
            </Button>
          </div>
        </div>
        <AddMember
          //need to pass in caseID and the team ID
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
          team={props.teamID}
          case={props.case}
        />
      </div>
    </Paper>
  );
}
