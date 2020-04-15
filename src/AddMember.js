import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { TextField, Typography } from "@material-ui/core/";
import CircularProgress from "@material-ui/core/CircularProgress";
import { db, storage, snapshotToArray } from "./firebase";
import uuid from "uuid";

export default function AddMember(props) {
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [file, setFile] = useState(null);
  const [caseID, setCaseID] = useState("");
  const [teamID, setTeamID] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCaseID(props.case);
    setTeamID(props.team);
    console.log(props);
  }, [props]);

  const handleSaveMember = () => {
    setSaving(true);
    storage
      .ref("cases/" + caseID + "/teams/" + teamID + "/members/" + uuid())
      .put(file)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          db.collection("cases")
            .doc(caseID)
            .collection("teams")
            .doc(teamID)
            .collection("members")
            .add({
              memberEmail: memberEmail,
              memberName: memberName,
              memberPic: downloadURL,
            });
        });
      })
      .then(() => {
        setMemberName("");
        setMemberEmail("");
        setFile(null);
        setSaving(false);
        props.onClose();
      });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          Please enter your information to join this team
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Enter your full name"
            fullWidth={true}
            value={memberName}
            onChange={(e) => {
              setMemberName(e.target.value);
            }}
          />
          <TextField
            label="Enter your personal email address"
            fullWidth={true}
            value={memberEmail}
            onChange={(e) => {
              setMemberEmail(e.target.value);
            }}
          />
          <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
            <Typography>Upload a profile photo </Typography>
            <Button
              variant="contained"
              component="label"
              style={{ marginLeft: 20 }}
            >
              Choose a File
              <input
                type="file"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </Button>
            {file && (
              <Typography style={{ marginRight: 20, marginLeft: 20 }}>
                {file.name}
              </Typography>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            autoFocus
            variant="contained"
            onClick={handleSaveMember}
          >
            Save
          </Button>
          {saving && (
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: -12,
                marginLeft: -12,
              }}
              color="secondary"
              size={24}
            />
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
