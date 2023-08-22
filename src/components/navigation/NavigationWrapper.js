import React, { useState, useEffect } from "react";
import { useAccountId } from "near-social-vm";
import { DesktopNavigation } from "./desktop/DesktopNavigation";
import { MobileNavigation } from "./mobile/MobileNavigation";
import ChatWindow from '../../components/chat/ChatWindow';
export function NavigationWrapper(props) {
  const accountId = useAccountId();
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 992px)").matches
  );

  useEffect(() => {
    window
      .matchMedia("(min-width: 992px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);
  return (
    <>
      {matches && <DesktopNavigation {...props} />}
      {!matches && <MobileNavigation {...props} />}
      {accountId && <ChatWindow accountId={accountId} />}
    </>
  );
}
