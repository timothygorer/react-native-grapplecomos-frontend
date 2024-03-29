import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const FacebookLogo = ({width, height}) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18 9.053C18 4.053 13.97 0 9 0S0 4.053 0 9.053c0 4.519 3.291 8.264 7.594 8.943V11.67H5.309V9.053h2.285V7.059c0-2.27 1.343-3.523 3.4-3.523.984 0 2.014.177 2.014.177v2.228h-1.135c-1.118 0-1.467.698-1.467 1.414v1.698h2.496l-.399 2.617h-2.097v6.326C14.71 17.317 18 13.572 18 9.053z"
      fill="#1877F2"
    />
  </Svg>
);

export default FacebookLogo;
