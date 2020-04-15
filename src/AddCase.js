import React, { useState, useEffect, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { TextField, Typography } from "@material-ui/core/";
import { db, storage } from "./firebase";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import uuid from "uuid";
import { KeyboardDatePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function AddCase(props) {
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState("");
  const [prize, setPrize] = useState("");
  //const [startDate, setStartDate] = useState("");
  //const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [current, setCurrent] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveCase = () => {
    setSaving(true);
    storage
      .ref("cases/" + uuid())
      .put(file)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          db.collection("cases")
            .add({
              company: company,
              prize: prize,
              startDate: selectedStartDate.toDate(),
              endDate: selectedEndDate.toDate(),
              image: downloadURL,
              notes: notes,
              current: current,
            })
            .then(() => {
              setPrize("");
              setCompany("");
              handleEndDateChange(null);
              handleStartDateChange(null);
              setNotes("");
              setFile(null);
              setSaving(false);
              props.onClose();
            });
        });
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
          Thank you for sponsoring a case competition at BYU! Please enter the
          details on your case competition below.
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Enter Company Name"
            fullWidth={true}
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
            }}
          />
          <TextField
            label="Enter Prize"
            fullWidth={true}
            value={prize}
            onChange={(e) => {
              setPrize(e.target.value);
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Case Start Date"
                format="MM/DD/YYYY"
                value={selectedStartDate}
                InputAdornmentProps={{ position: "start" }}
                onChange={(date) => handleStartDateChange(date)}
              />
              <KeyboardDatePicker
                autoOk
                variant="inline"
                inputVariant="outlined"
                label="Case End Date"
                format="MM/DD/YYYY"
                value={selectedEndDate}
                InputAdornmentProps={{ position: "start" }}
                onChange={(date) => handleEndDateChange(date)}
              />
            </MuiPickersUtilsProvider>
          </div>
          <TextField
            label="What is the case about?"
            fullWidth={true}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
            }}
          />
          <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>
            {file && (
              <Typography style={{ marginRight: 20 }}>{file.name}</Typography>
            )}
            <Button variant="contained" component="label">
              Upload Logo
              <input
                type="file"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </Button>
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
            onClick={handleSaveCase}
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
