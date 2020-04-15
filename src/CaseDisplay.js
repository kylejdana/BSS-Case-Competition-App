import React from "react";
import Typography from "@material-ui/core/Typography";
import { Card, CardMedia, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import Moment from "moment";

export default function CaseDisplay(props) {
  var today = new Date();

  return (
    <Card>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: 1300,
        }}
      >
        <CardMedia
          component="img"
          style={{
            marginLeft: 10,
            marginRight: 20,
            marginBottom: 10,
            height: 60,
            width: 60,
          }}
          image={props.image}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: 350,
            }}
          >
            <Typography variant="body1">{props.company}</Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: 350,
            }}
          >
            <Typography variant="body1">{props.prize}</Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: 300,
            }}
          >
            <Typography variant="body1" style={{ marginRight: 150 }}>
              {Moment(props.start).format("MM/DD/YYYY")} -
              {Moment(props.end).format("MM/DD/YYYY")}
            </Typography>
          </div>
        </div>
        {props.current && (
          <Button
            style={{ marginRight: 20, width: 200 }}
            color="primary"
            variant="contained"
            to={"/app/case/" + props.id + "/"}
            component={Link}
          >
            Enter
          </Button>
        )}
        {props.future && (
          <Button
            style={{ marginRight: 20, width: 200 }}
            color="primary"
            variant="contained"
            to={"/app/case/" + props.id + "/"}
            component={Link}
          >
            Learn More
          </Button>
        )}
        {props.past && (
          <Button
            style={{ marginRight: 20, width: 200 }}
            color="primary"
            variant="contained"
            to={"/app/case/" + props.id + "/"}
            component={Link}
          >
            See What Happened
          </Button>
        )}
      </div>
    </Card>
  );
}
