import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

export default function TeamMember(props) {
  return (
    <div>
      <Card style={{ maxWidth: 345, marginRight: 10, marginTop: 10 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="300"
            image={props.image}
            title="Kyle Dana"
          />
          <CardContent>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "left",
              }}
            >
              <Typography variant="h6">{props.memberName}</Typography>
              <Typography variant="h7">{props.memberEmail}</Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}
