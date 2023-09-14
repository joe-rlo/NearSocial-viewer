import React, { useEffect, useState } from "react";
import { Widget } from "near-social-vm";
import { useParams } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";
import { useHashRouterLegacy } from "../hooks/useHashRouterLegacy";
import { Helmet } from "react-helmet";

export default function EmbedPage(props) {
  useHashRouterLegacy();
  const { widgetSrc } = useParams();
  const query = useQuery();
  const [widgetProps, setWidgetProps] = useState({});

  const src = widgetSrc || props.widgets.default;

  useEffect(() => {
    setWidgetProps(
      [...query.entries()].reduce((props, [key, value]) => {
        props[key] = value;
        return props;
      }, {})
    );
  }, [query]);

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
      <div className="d-inline-block position-relative overflow-hidden">
        <Widget key={src} src={src} props={widgetProps} />{" "}
      </div>
    </div>
  );
}
