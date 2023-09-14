import * as nearApi from "near-api-js"; // make sure to install this package
import React, { useEffect, useState, useRef } from "react";
import { useAccountId } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { Widget } from "near-social-vm";
import { Helmet } from "react-helmet";

import "../Feed.css";

function River({ userId }) {
  const accountId = useAccountId();

  return (
    <div>
      <Helmet>
        <title>ShardDog River</title>
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@sharddog" />
        <meta
          name="twitter:image"
          content="https://sharddog.social/assets/ShardDogLogo.png"
        />
        <meta
          property="og:image"
          content="https://sharddog.social/assets/ShardDogLogo.png"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ShardDog River" />
        <meta
          property="og:description"
          content="Where anyone can build an audience"
        />
      </Helmet>
      <div className="feed">
        <>
          <Widget src="efiz.near/widget/Sharddog.River" />
        </>
      </div>
    </div>
  );
}

export default River;
