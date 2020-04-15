import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core/";
import CircularProgress from "@material-ui/core/CircularProgress";
import { db } from "./firebase";

export default function AddTeam(props) {
  const [nickname, setNickname] = useState(null);
  const [captain, setCaptain] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [teamEmail, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveTeam = () => {
    setSaving(true);
    db.collection("cases")
      .doc(props.caseID)
      .collection("teams")
      .add({
        nickname: nickname,
        captain: captain,
        phoneNumber: phoneNumber,
        teamEmail: teamEmail,
        creationDate: new Date(),
        //file: URL("http://lego.com"),
      })
      .then(() => {
        setNickname("");
        setCaptain("");
        setEmail("");
        setPhoneNumber("");
        props.onClose();
        setSaving(false);
      });
  };

  /*if (!) {
    return <div />;
  }*/
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
          Welcome to the case competition! Please enter your teams information
          below.
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Enter a nickname for your team (optional):"
            fullWidth={true}
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
          />
          <TextField
            label="Enter the name of your team captain:"
            fullWidth={true}
            value={captain}
            onChange={(e) => {
              setCaptain(e.target.value);
            }}
          />
          <TextField
            label="What is the best email to reach your team at?"
            fullWidth={true}
            value={teamEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            label="What is the best phone number?"
            fullWidth={true}
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            autoFocus
            variant="contained"
            onClick={handleSaveTeam}
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
