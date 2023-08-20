import React, { useEffect, useState, useRef } from "react";
import { Widget } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/Badge";
import ListGroupItem from "react-bootstrap/Badge";

export default function ChangelogPage() {
  // Replace this with data fetched from an API or other source
  const [changelog, setChangelog] = useState([
    {
      version: "2023-08-20",
      changes: [
        "Branding update",
        "Support for Dark Mode",
        "Comic book viewer",
        "ShardDog Claim success page",
        "Placeholder for dog park updated",
      ],
    },
    {
      version: "2023-07-16",
      changes: [
        "Twitter embeds from Twitter share URL",
        "Plceholder for dog park",
      ],
    },
    {
      version: "2023-07-14",
      changes: [
        "Minor clean-up of post composer",
        "Apple music embed support (just post the share URL)",
      ],
    },
    {
      version: "2023-07-12",
      changes: [
        "Removed cookies from YouTube links",
        "Added user search",
        "Misc layout improvements",
        "Changed the save data screen",
        "This changelog",
      ],
    },
    {
      version: "2023-07-11",
      changes: [
        "Anyone can claim access now",
        "Fixed the link sharing",
        "Added counts to likes and reposts",
      ],
    },
    {
      version: "2023-07-08",
      changes: [
        "Gif Support",
        "MOV & MP4 support",
        "Improved editor for posting",
      ],
    },
    {
      version: "2023-07-06",
      changes: ["Initial release", "YouTube & Spotify embeded support"],
    },
    // More versions...
  ]);

  return (
    <div className="container-xl">
      <h1>ShardDog.social Changelog</h1>
      <hr />

      {changelog.map((log, index) => (
        <div key={index} style={{ marginBottom: "2rem" }}>
          <h4>
            <Badge variant="secondary">{log.version}</Badge>
          </h4>

          <ListGroup variant="flush" id="changelog">
            {log.changes.map((change, i) => (
              <>
                <ListGroupItem key={i}>* {change}</ListGroupItem> <br />
              </>
            ))}
          </ListGroup>
        </div>
      ))}
    </div>
  );
}
