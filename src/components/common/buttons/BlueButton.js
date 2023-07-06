import React from "react";
import { Button } from "./Button";
import styled from "styled-components";

const StyledButton = styled(Button)`
  color: white;
`;

export function BlueButton(props) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}
