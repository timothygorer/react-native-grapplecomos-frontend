import * as React from 'react';
import Svg, {Path, Circle} from 'react-native-svg';

const SvgComponent = props => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={100}
    height={100}
    fill="none"
    {...props}>
    <Path
      fill="#000"
      fillOpacity={0.16}
      d="M10 0C4.477 0 0 4.477 0 10c0 4.354 2.783 8.058 6.667 9.431V20c0 7.364 5.97 13.333 13.333 13.333h20A6.667 6.667 0 0 1 46.667 40v.569C42.783 41.942 40 45.646 40 50c0 5.523 4.477 10 10 10s10-4.477 10-10c0-4.354-2.783-8.058-6.667-9.431V19.431C57.217 18.058 60 14.354 60 10c0-5.523-4.477-10-10-10S40 4.477 40 10c0 4.354 2.783 8.058 6.667 9.431v9.02A13.274 13.274 0 0 0 40 26.666H20A6.667 6.667 0 0 1 13.333 20v-.569C17.217 18.058 20 14.354 20 10c0-5.523-4.477-10-10-10Zm40 46.667a3.333 3.333 0 1 1 0 6.666 3.333 3.333 0 0 1 0-6.666Zm0-40a3.333 3.333 0 1 1 0 6.666 3.333 3.333 0 0 1 0-6.666Zm-40 0a3.333 3.333 0 1 1 0 6.666 3.333 3.333 0 0 1 0-6.666Z"
    />
    <Path
      fill="#000"
      fillOpacity={0.16}
      d="M90 40c5.523 0 10 4.477 10 10 0 4.354-2.783 8.058-6.667 9.431V60c0 7.364-5.97 13.333-13.333 13.333H60A6.667 6.667 0 0 0 53.333 80v.569C57.217 81.942 60 85.646 60 90c0 5.523-4.477 10-10 10s-10-4.477-10-10c0-4.354 2.783-8.058 6.667-9.431V59.431C42.783 58.058 40 54.354 40 50c0-5.523 4.477-10 10-10s10 4.477 10 10c0 4.354-2.783 8.058-6.667 9.431v9.02A13.274 13.274 0 0 1 60 66.666h20A6.667 6.667 0 0 0 86.667 60v-.569C82.783 58.058 80 54.354 80 50c0-5.523 4.477-10 10-10ZM50 86.667a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666Zm0-40a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666Zm40 0a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666Z"
    />
    <Circle cx={90.04} cy={50.04} r={3.4} fill="#1F3B9F" />
    <Circle cx={90.04} cy={50.04} r={3.4} fill="#1F3B9F" />
    <Circle cx={9.96} cy={9.96} r={3.4} fill="#7A4D24" />
    <Circle cx={50.04} cy={9.96} r={3.4} fill="#921AA6" />
    <Circle cx={50.04} cy={50.04} r={3.4} fill="#000" />
  </Svg>
);
export default SvgComponent;
