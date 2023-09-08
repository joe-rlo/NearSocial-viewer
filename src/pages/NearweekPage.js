import * as nearApi from "near-api-js"; // make sure to install this package
import React, { useEffect, useState, useRef } from "react";
import { useAccountId } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { Widget } from "near-social-vm";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../components/firebase"; // Adjust the path as needed
import { useCollectionData } from "react-firebase-hooks/firestore";
import "firebase/firestore";
import "../Feed.css";

function Nearweek({ userId }) {
  const [contentFeed, setContentFeed] = useState([]);
  const accountId = useAccountId();

  useEffect(() => {
    // Query content for the specific user, ordered by createdDate
    const firestore = getFirestore();
    const contentQuery = query(
      collection(firestore, "content"),
      where("userId", "==", accountId),
      orderBy("createdDate", "desc")
    );

    // Real-time listener for content updates
    const unsubscribe = onSnapshot(contentQuery, (snapshot) => {
      const contentData = [];
      snapshot.forEach((doc) => {
        contentData.push(doc.data());
      });
      setContentFeed(contentData);
    });

    // Clean up listener when the component is unmounted
    return () => unsubscribe();
  }, [accountId]);

  return (
    <div className="feed">
      {contentFeed.length > 0 ? (
        contentFeed.map((content) => (
          <div
            key={content.contentId}
            className={`content-item ${content.isSigned ? "signed" : ""}`}
          >
            <h2>{content.title}</h2>
            {content.description && <p>{content.description}</p>}
            {content.isExpiring && (
              <p className="expiring">
                Expiring on:{" "}
                {new Date(content.expirationDate).toLocaleDateString()}
              </p>
            )}
            {content.isSigned && <p className="signed">Signed on blockchain</p>}
            {content.mediaType === "audio" && (
              <audio src={content.contentUrl} controls />
            )}
            {content.mediaType === "video" && (
              <video src={content.contentUrl} controls />
            )}
            {content.mediaType === "image" && <img src={content.contentUrl} />}
            {content.mediaType === "text" && <p>{content.content}</p>}
          </div>
        ))
      ) : (
        <>
          <Widget src="sharddog.near/widget/NearweekCovers" />
        </>
      )}
    </div>
  );
}

export default Nearweek;
