import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const AppleLogo = ({width, height}) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M7.736 3.986c.78 0 1.757-.527 2.34-1.23.526-.637.91-1.526.91-2.416 0-.12-.01-.241-.032-.34-.868.033-1.911.582-2.537 1.318-.494.56-.944 1.438-.944 2.339 0 .131.022.263.033.307.055.011.142.022.23.022zM4.991 17.273c1.065 0 1.537-.714 2.866-.714 1.35 0 1.647.692 2.833.692 1.164 0 1.944-1.076 2.68-2.13.823-1.208 1.163-2.394 1.185-2.45-.076-.021-2.306-.933-2.306-3.491 0-2.218 1.757-3.217 1.856-3.294-1.164-1.67-2.932-1.713-3.415-1.713-1.307 0-2.372.79-3.042.79-.724 0-1.68-.746-2.81-.746C2.684 4.217.5 5.995.5 9.356c0 2.086.813 4.293 1.812 5.72.856 1.209 1.603 2.197 2.68 2.197z"
      fill="#fff"
    />
  </Svg>
);

export default AppleLogo;
