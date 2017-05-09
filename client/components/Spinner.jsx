import React, { PropTypes } from "react";
import styled, { keyframes } from "styled-components";

import { green, purple } from "techbikers/utils/style-variables";

/**
 * Styled root component
 */
const Root = styled.div`
  max-width: 200px;
  margin: 0 auto;
  padding: ${props => props.spacing};
`;

Root.propTypes = {
  spacing: PropTypes.string
};

/**
 * Styled loader container component
 */
const Loader = styled.div`
  margin: 0 auto;
  width: 1em;
  height: 1em;
  position: relative;
  font-size: ${props => props.size}px;
`;

Loader.propTypes = {
  size: PropTypes.number
};


/**
 * Styled spinning cube component
 */
const cubemove = keyframes`
  25% {
    transform: translateX(0.65em) rotate(-90deg) scale(0.5);
  } 50% {
    transform: translateX(0.65em) translateY(0.65em) rotate(-179deg);
  } 50.1% {
    transform: translateX(0.65em) translateY(0.65em) rotate(-180deg);
  } 75% {
    transform: translateX(0px) translateY(0.65em) rotate(-270deg) scale(0.5);
  } 100% {
    transform: rotate(-360deg);
  }
`;

const Cube = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0.35em;
  height: 0.35em;
  animation: ${cubemove} 1.8s infinite ease-in-out;
  animation-delay: ${props => props.delay || "0s"};
  background-color: ${props => (props.light ? "#FFFFFF" : `${props.color}`)};
`;

Cube.propTypes = {
  delay: PropTypes.string,
  color: PropTypes.string
};

/**
 * Styled message component
 */
const Message = styled.div`
  margin: 10px 0;
  text-align: center;
  font-size: 1rem;
`;

/**
 * Final Spinner component
 * @param {Number}  [size=56]         Size of the spinner
 * @param {Boolean} [light=false]     Makes the spinner background white
 * @param {String}  [spacing="100px"] Spacing around the spinner
 */
const Spinner = ({ size = 56, light = false, spacing = "100px", children }) => (
  <Root spacing={spacing}>
    <Loader size={size}>
      <Cube color={green} light={light} />
      <Cube color={purple} delay="-0.9s" light={light} />
    </Loader>
    {children &&
      <Message>{children}</Message>}
  </Root>
);

Spinner.propTypes = {
  spacing: PropTypes.string,
  size: PropTypes.number,
  light: PropTypes.bool,
  children: PropTypes.node
};

export default Spinner;
