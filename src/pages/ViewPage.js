import React, { useEffect, useState, useRef } from "react";
import { Widget } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { useHashRouterLegacy } from "../hooks/useHashRouterLegacy";
import { Helmet } from "react-helmet";

export default function ViewPage(props) {
  useHashRouterLegacy();
  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src = widgetSrc || props.widgets.default;
  const setWidgetSrc = props.setWidgetSrc;
  const viewSourceWidget = props.widgets.viewSource;

  useEffect(() => {
    setWidgetProps(Object.fromEntries([...query.entries()]));
  }, [query]);

  useEffect(() => {
    setTimeout(() => {
      setWidgetSrc(
        src === viewSourceWidget && query.get("src")
          ? {
              edit: query.get("src"),
              view: null,
            }
          : {
              edit: src,
              view: src,
            }
      );
    }, 1);
  }, [src, query, setWidgetSrc, viewSourceWidget]);

  return (
    <div>
      <Helmet>
        <title>ShardDog Social</title>
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
        <meta property="og:title" content="ShardDog Social" />
        <meta
          property="og:description"
          content="Where anyone can build an audience"
        />
      </Helmet>
      <div className="container-xl">
        <div className="row">
          <div
            className="d-inline-block position-relative overflow-hidden"
            style={{
              "--body-top-padding": "4px",
              paddingTop: "var(--body-top-padding)",
            }}
          >
            <Widget key={src} src={src} props={widgetProps} />{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
