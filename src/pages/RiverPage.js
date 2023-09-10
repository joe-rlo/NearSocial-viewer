import * as nearApi from "near-api-js"; // make sure to install this package
import React, { useEffect, useState, useRef } from "react";
import { useAccountId } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { Widget } from "near-social-vm";

import "../Feed.css";

function River({ userId }) {
  const accountId = useAccountId();

  return (
    <div className="feed">
      <>
        <Widget src="efiz.near/widget/Sharddog.River" />
      </>
    </div>
  );
}

export default River;
