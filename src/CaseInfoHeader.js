import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import {
  Paper,
  Card,
  CardMedia,
  Button,
  List,
  ListItem,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import CloseIcon from "@material-ui/icons/Close";
import { db } from "./firebase";
import Moment from "moment";

export default function CaseInfoHeader(props) {
  const [open, setOpen] = useState(false);

  const handleAddToMyCases = () => {
    db.collection("users").doc(props.uid).collection("personalCases").add({
      caseID: props.id,
      company: props.company,
    });
  };

  return (
    <Paper>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: 1300,
        }}
      >
        <Card style={{ maxWidth: 180, maxheight: 180 }}>
          <CardMedia component="img" image={props.image} />
        </Card>
        <div
          style={{
            display: "flex",
            flexGrow: 1,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <List>
              <ListItem key={props.caseID}>
                <div
                  style={{ display: "flex", flexDirection: "row", width: 1000 }}
                >
                  <Typography
                    variant="h3"
                    style={{ display: "flex", flexGrow: 1 }}
                  >
                    {props.company} Case Competition
                  </Typography>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      style={{ marginRight: 20, width: 200 }}
                      color="primary"
                      variant="contained"
                      onClick={() => {
                        handleAddToMyCases(props.caseID);
                        setOpen(true);
                      }}
                    >
                      Add to My Cases
                    </Button>
                    <Collapse in={open}>
                      <Alert
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpen(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                      >
                        Added to My Cases!
                      </Alert>
                    </Collapse>
                  </div>
                </div>
              </ListItem>
              <ListItem>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: 600,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginRight: 10 }}
                      >
                        Prize:
                      </Typography>
                      <Typography variant="h6">{props.prize}</Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginRight: 10 }}
                      >
                        Duration:
                      </Typography>
                      <Typography variant="h6">
                        {Moment(props.start).format("MM/DD/YYYY")}-{" "}
                        {Moment(props.end).format("MM/DD/YYYY")}
                      </Typography>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        style={{ marginRight: 10, width: 70 }}
                      >
                        Case Details:
                      </Typography>
                      <Typography variant="h6">{props.notes}</Typography>
                    </div>
                  </div>
                </div>
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    </Paper>
  );
}
