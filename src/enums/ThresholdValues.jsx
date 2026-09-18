//import  CommnFail  from '../assets/images/legends/horizontal/CommonFail.jpg';
//import  BatteryLowVoltage  from '../assets/images/legends/horizontal/LowVoltage.gif';
//import  BatteryAboutToDie  from '../assets/images/legends/horizontal/BatteryAboutToDie3.gif';
//import  OpenBattery  from '../assets/images/legends/horizontal/OpenBatteryCrop.gif';
//import  BatteryHighVoltage  from '../assets/images/legends/horizontal/HighVolt.jpg';
//import  BatteryHighTemperature  from '../assets/images/legends/horizontal/highTemeprature.jpg';
//import  LegendCharging  from '../assets/images/legends/horizontal/Charging.gif';
//import  LegendDisCharging  from '../assets/images/legends/horizontal/Discharging.gif';

import { useContext } from "react";
import { AppContext } from '../services/AppContext';
export const BatteryLowVoltage = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem",  }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#FF0000" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#FF0000" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
        <rect x="5" y="5" width="20" height="50" rx="6" fill="#FF0000">
          <animate attributeName="fill-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
};

export const Charging = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#2E7D32" strokeWidth="3">
          <animate
            attributeName="stroke-opacity"
            values="0.3;1"
            dur="2s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;1"
          />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#2E7D32" strokeWidth="3">
          <animate
            attributeName="stroke-opacity"
            values="0.3;1"
            dur="2s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;1"
          />
        </rect>
        <rect x="5" y="5" width="20" height="50" rx="6" fill="#4CAF50">
          <animate
            attributeName="width"
            values="20;70"
            dur="3s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;1"
            keySplines="0.4 0 0.2 1"
            begin="0s"
          />
        </rect>
      </g>
    </svg>
  );
};
export const ChargingV = () => {
  return (
    <svg viewBox="0 0 60 100" style={{ width: "6rem" }}>
      <g transform="translate(10,10) scale(0.8)">
        {/* Outer rectangle (vertical orientation) */}
        <rect x="0" y="0" width="60" height="110" rx="8" fill="none" stroke="#2E7D32" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>

        {/* Terminal (moved to the top) */}
        <rect x="20" y="-8" width="20" height="8" fill="none" stroke="#2E7D32" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </rect>

        {/* Inner rectangle (vertical orientation, reverse animation) */}
        <rect x="5" y="85" width="50" height="50" rx="6" fill="#4CAF50">
          <animate
            attributeName="height"
            values="20;70;20"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="85;35;85"
            dur="3s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
};
export const AnimatedFuseIcon = ({
  size = 40,
  color = "currentColor",
  strokeWidth = 1.5,
  isBroken = false,
}) => {
  return (
    <svg
      width={size}
      height={size * 2.4}
      viewBox="0 0 100 240"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top cap */}
      <path
        d="M20,0 H80 Q100,0 100,20 V40 Q100,50 90,50 H10 Q0,50 0,40 V20 Q0,0 20,0 Z"
        fill={color}
        stroke="none"
      />
      
      {/* Bottom cap */}
      <path
        d="M20,190 H80 Q100,190 100,210 V220 Q100,240 80,240 H20 Q0,240 0,220 V210 Q0,190 20,190 Z"
        fill={color}
        stroke="none"
      />
      
      {/* Left side */}
      <rect x="10" y="50" width="10" height="140" fill={color} stroke="none" />
      
      {/* Right side */}
      <rect x="80" y="50" width="10" height="140" fill={color} stroke="none" />
      
      {/* Inner white space in caps */}
      <rect x="20" y="15" width="60" height="25" fill="white" stroke="none" />
      <rect x="20" y="200" width="60" height="25" fill="white" stroke="none" />
      
      {/* Conditional rendering based on isBroken prop */}
      {isBroken ? (
        <g>
          {/* Top portion of broken wire - with clear separation */}
          <path 
            d="M40,50 C60,85 30,105 40,105" 
            fill="none" 
            stroke={color} 
            strokeWidth={8}
          >
            <animate
              attributeName="d"
              values="M40,50 C60,85 30,105 40,105;M40,50 C60,85 30,105 38,103;M40,50 C60,85 30,105 40,105"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Bottom portion of broken wire - with clear separation */}
          <path 
            d="M60,135 C70,160 40,190 40,190" 
            fill="none" 
            stroke={color} 
            strokeWidth={8}
          >
            <animate
              attributeName="d"
              values="M60,135 C70,160 40,190 40,190;M62,137 C70,160 40,190 40,190;M60,135 C70,160 40,190 40,190"
              dur="0.5s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Enhanced spark effect */}
          <circle cx="50" cy="120" r="8" fill="white" stroke={color} strokeWidth={1}>
            <animate
              attributeName="r"
              values="8;12;8"
              dur="0.3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.7;1"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Enhanced spark lines */}
          <path d="M42,112 L58,128" stroke={color} strokeWidth={2.5}>
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="0.4s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M58,112 L42,128" stroke={color} strokeWidth={2.5}>
            <animate
              attributeName="opacity"
              values="1;0;1"
              dur="0.4s"
              repeatCount="indefinite"
            />
          </path>
          
          {/* Additional spark details */}
          <path d="M44,120 L56,120" stroke={color} strokeWidth={2}>
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="0.3s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M50,114 L50,126" stroke={color} strokeWidth={2}>
            <animate
              attributeName="opacity"
              values="0;1;0"
              dur="0.3s"
              repeatCount="indefinite"
              begin="0.15s"
            />
          </path>
        </g>
      ) : (
        // Intact wire
        <path 
          d="M40,50 C60,85 30,120 50,155 C70,190 40,190 40,190" 
          fill="none" 
          stroke={color} 
          strokeWidth={8} 
        />
      )}
    </svg>
  );
};
export const ACVoltagered = ({
  size = 50,
  color = "#FF5252",
  bgColor = "#FFEBEE",
  strokeWidth = 6,
  isActive = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top terminal - increased height */}
      <rect x="45" y="0" width="10" height="25" rx="5" fill={color} />
      
      {/* Bottom terminal - increased height */}
      <rect x="45" y="75" width="10" height="25" rx="5" fill={color} />
      
      {/* Main circular body - increased radius */}
      <circle cx="50" cy="50" r="40" fill={bgColor} />
      
      {/* Improved AC sine wave with better visibility and animation */}
      {isActive ? (
        <path 
          d="M25,50 Q37.5,20 50,50 T75,50"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        >
          <animate 
            attributeName="d" 
            values="M25,50 Q37.5,20 50,50 T75,50;
                    M25,50 Q37.5,80 50,50 T75,50;
                    M25,50 Q37.5,20 50,50 T75,50" 
            dur="1.5s" 
            repeatCount="indefinite" 
          />
        </path>
      ) : (
        <path 
          d="M25,50 L75,50"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      )}
    </svg>
  );
};
export const ACVoltageIcon = ({
  size = 50,
  color = "#3DD598",
  bgColor = "#b2ffb2",
  strokeWidth = 6,
  isActive = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Top terminal - increased height */}
      <rect x="45" y="0" width="10" height="25" rx="5" fill={color} />
      
      {/* Bottom terminal - increased height */}
      <rect x="45" y="75" width="10" height="25" rx="5" fill={color} />
      
      {/* Main circular body - increased radius */}
      <circle cx="50" cy="50" r="40" fill={bgColor} />
      
      {/* Improved AC sine wave with better visibility and animation */}
      {isActive ? (
        <path 
          d="M25,50 Q37.5,20 50,50 T75,50"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        >
          <animate 
            attributeName="d" 
            values="M25,50 Q37.5,20 50,50 T75,50;
                    M25,50 Q37.5,80 50,50 T75,50;
                    M25,50 Q37.5,20 50,50 T75,50" 
            dur="1.5s" 
            repeatCount="indefinite" 
          />
        </path>
      ) : (
        <path 
          d="M25,50 L75,50"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="4 4"
        />
      )}
    </svg>
  );
};

export const DCVoltageIcon = ({
  size = 150,
  state = "normal", // "normal", "low", or "over"
  className = "",
}) => {
  // Define colors based on state
  const getStateColor = () => {
    switch (state) {
      case "low":
        return "#FFC107"; // Yellow
      case "over":
        return "#F44336"; // Red
      case "normal":
      default:
        return "#4CAF50"; // Green
    }
  };

  // Calculate dimensions
  const width = size / 2;
  const height = size;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 300 600"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Battery Terminal */}
      <path
        d="M125 20 L175 20 C190 20 190 50 175 50 L125 50 C110 50 110 20 125 20 Z"
        fill="#424242"
      />

      {/* Battery Body Outline */}
      <rect
        x="50"
        y="50"
        width="200"
        height="500"
        rx="30"
        ry="30"
        fill="#424242"
      />

      {/* Battery Inner Background */}
      <rect
        x="65"
        y="65"
        width="170"
        height="470"
        rx="20"
        ry="20"
        fill="white"
      />

      {/* Battery Fill Level */}
      <rect
        x="65"
        y="65"
        width="170"
        height="470"
        rx="20"
        ry="20"
        fill={getStateColor()}
      />

      {/* Lightning Bolt */}
      <path
        d="M150 150 L100 310 L150 310 L130 450 L210 270 L150 270 L180 150 Z"
        fill="white"
      />

      {/* Warning Symbol - Only shown in "over" state */}
      {state === "over" && (
        <>
          <path d="M150 120 L180 170 L120 170 Z" fill="yellow" />
          <text
            x="150"
            y="165"
            textAnchor="middle"
            fontFamily="Arial"
            fontSize="40"
            fontWeight="bold"
          >
            !
          </text>
        </>
      )}
    </svg>
  );
};



export const BatteryStringIcon = ({
  size = 50,
  color = "#3DD598",
  bgColor = "#E4FFF0",
  errorColor = "#FF5C5C",
  strokeWidth = 2,
  isActive = true,
  orientation = "vertical"
}) => {
  // Determine if we're rendering a vertical or horizontal layout
  const isVertical = orientation === "vertical";
  
  // Set viewBox based on orientation
  const viewBox = isVertical ? "0 0 100 200" : "0 0 200 100";
  
  // Adjust dimensions based on orientation
  const width = isVertical ? size : size * 2;
  const height = isVertical ? size * 2 : size;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {isVertical ? (
        // VERTICAL LAYOUT
        <>
          {/* Battery cells */}
          <rect x="30" y="15" width="40" height="20" rx="2" stroke="#555" strokeWidth={strokeWidth} fill={bgColor} />
          <rect x="30" y="75" width="40" height="20" rx="2" stroke="#555" strokeWidth={strokeWidth} fill={bgColor} />
          <rect x="30" y="135" width="40" height="20" rx="2" stroke="#555" strokeWidth={strokeWidth} fill={bgColor} />
          
          {/* Battery terminals */}
          <line x1="45" y1="10" x2="45" y2="15" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="40" y1="12.5" x2="50" y2="12.5" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="55" y1="35" x2="55" y2="40" stroke="#555" strokeWidth={strokeWidth} />
          
          <line x1="45" y1="70" x2="45" y2="75" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="40" y1="72.5" x2="50" y2="72.5" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="55" y1="95" x2="55" y2="100" stroke="#555" strokeWidth={strokeWidth} />
          
          <line x1="45" y1="130" x2="45" y2="135" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="40" y1="132.5" x2="50" y2="132.5" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="55" y1="155" x2="55" y2="160" stroke="#555" strokeWidth={strokeWidth} />
          
          {/* Connector lines */}
          <line x1="50" y1="35" x2="50" y2="75" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="50" y1="95" x2="50" y2="135" stroke="#555" strokeWidth={strokeWidth} />
          
          {/* Communication wires */}
          {isActive ? (
            <>
              <path 
                d="M25,25 C15,25 15,85 25,85" 
                stroke={color} 
                strokeWidth={strokeWidth} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              <path 
                d="M25,85 C15,85 15,145 25,145" 
                stroke={color} 
                strokeWidth={strokeWidth} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              
              {/* Data dots */}
              <circle cx="20" cy="25" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="20" cy="85" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="20" cy="145" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              
              {/* Data flow animations */}
              <path 
                d="M20,35 C15,45 25,55 20,65" 
                stroke={color} 
                strokeWidth={1.5} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="0;1;0" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              <path 
                d="M20,95 C15,105 25,115 20,125" 
                stroke={color} 
                strokeWidth={1.5} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="0;1;0" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
            </>
          ) : (
            <>
              <path 
                d="M25,25 C15,25 15,55 20,55" 
                stroke={color} 
                strokeWidth={strokeWidth} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              <path 
                d="M20,55 C15,55 15,85 25,85" 
                stroke={errorColor} 
                strokeWidth={strokeWidth} 
                fill="none"
                strokeDasharray="4 4"
              />
              <path 
                d="M25,85 C15,85 15,145 25,145" 
                stroke={errorColor} 
                strokeWidth={strokeWidth} 
                fill="none"
                strokeDasharray="4 4"
              />
              
              {/* Status indicators */}
              <circle cx="20" cy="25" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="20" cy="85" r="3" fill={errorColor} />
              <circle cx="20" cy="145" r="3" fill={errorColor} />
              
              {/* Broken connection symbol */}
              <line x1="15" y1="62" x2="25" y2="68" stroke={errorColor} strokeWidth={strokeWidth} />
              <line x1="15" y1="68" x2="25" y2="62" stroke={errorColor} strokeWidth={strokeWidth} />
            </>
          )}
        </>
      ) : (
        // HORIZONTAL LAYOUT
        <>
          {/* Battery cells */}
          <rect x="15" y="30" width="20" height="40" rx="2" stroke="#555" strokeWidth={strokeWidth} fill={bgColor} />
          <rect x="75" y="30" width="20" height="40" rx="2" stroke="#555" strokeWidth={strokeWidth} fill={bgColor} />
          <rect x="135" y="30" width="20" height="40" rx="2" stroke="#555" strokeWidth={strokeWidth} fill={bgColor} />
          
          {/* Battery terminals */}
          <line x1="10" y1="45" x2="15" y2="45" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="12.5" y1="40" x2="12.5" y2="50" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="35" y1="55" x2="40" y2="55" stroke="#555" strokeWidth={strokeWidth} />
          
          <line x1="70" y1="45" x2="75" y2="45" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="72.5" y1="40" x2="72.5" y2="50" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="95" y1="55" x2="100" y2="55" stroke="#555" strokeWidth={strokeWidth} />
          
          <line x1="130" y1="45" x2="135" y2="45" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="132.5" y1="40" x2="132.5" y2="50" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="155" y1="55" x2="160" y2="55" stroke="#555" strokeWidth={strokeWidth} />
          
          {/* Connector lines */}
          <line x1="35" y1="50" x2="75" y2="50" stroke="#555" strokeWidth={strokeWidth} />
          <line x1="95" y1="50" x2="135" y2="50" stroke="#555" strokeWidth={strokeWidth} />
          
          {/* Communication wires */}
          {isActive ? (
            <>
              <path 
                d="M25,25 C25,15 85,15 85,25" 
                stroke={color} 
                strokeWidth={strokeWidth} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              <path 
                d="M85,25 C85,15 145,15 145,25" 
                stroke={color} 
                strokeWidth={strokeWidth} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              
              {/* Data dots */}
              <circle cx="25" cy="20" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="85" cy="20" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="145" cy="20" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              
              {/* Data flow animations */}
              <path 
                d="M35,20 C45,15 55,25 65,20" 
                stroke={color} 
                strokeWidth={1.5} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="0;1;0" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              <path 
                d="M95,20 C105,15 115,25 125,20"
                stroke={color} 
                strokeWidth={1.5} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="0;1;0" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
            </>
          ) : (
            <>
              <path 
                d="M25,25 C25,15 55,15 55,20" 
                stroke={color} 
                strokeWidth={strokeWidth} 
                fill="none"
              >
                <animate 
                  attributeName="stroke-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </path>
              <path 
                d="M55,20 C55,15 85,15 85,25" 
                stroke={errorColor} 
                strokeWidth={strokeWidth} 
                fill="none"
                strokeDasharray="4 4"
              />
              <path 
                d="M85,25 C85,15 145,15 145,25" 
                stroke={errorColor} 
                strokeWidth={strokeWidth} 
                fill="none"
                strokeDasharray="4 4"
              />
              
              {/* Status indicators */}
              <circle cx="25" cy="20" r="3" fill={color}>
                <animate 
                  attributeName="fill-opacity" 
                  values="1;0.3;1" 
                  dur="2s" 
                  repeatCount="indefinite" 
                />
              </circle>
              <circle cx="85" cy="20" r="3" fill={errorColor} />
              <circle cx="145" cy="20" r="3" fill={errorColor} />
              
              {/* Broken connection symbol */}
              <line x1="62" y1="15" x2="68" y2="25" stroke={errorColor} strokeWidth={strokeWidth} />
              <line x1="68" y1="15" x2="62" y2="25" stroke={errorColor} strokeWidth={strokeWidth} />
            </>
          )}
        </>
      )}
    </svg>
  );
};

export const Discharging = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#C62828" strokeWidth="3">
          <animate
            attributeName="stroke-opacity"
            values="1;0.3"
            dur="2s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;1"
          />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#C62828" strokeWidth="3">
          <animate
            attributeName="stroke-opacity"
            values="1;0.3"
            dur="2s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;1"
          />
        </rect>
        <rect x="5" y="5" width="70" height="50" rx="6" fill="#FF5252">
          <animate
            attributeName="width"
            values="70;20"
            dur="3s"
            repeatCount="indefinite"
            calcMode="linear"
            keyTimes="0;1"
            keySplines="0.4 0 0.2 1"
            begin="0s"
          />
        </rect>
      </g>
    </svg>
  );
};
export const DischargingV = () => {
  return (
    <svg viewBox="0 0 60 100" style={{ width: "3rem" }}>
      <g transform="translate(0,0)">
        {/* Outer rectangle */}
        <rect
          x="5"
          y="10"
          width="50"
          height="80"
          rx="6"
          fill="none"
          stroke="#C62828"
          strokeWidth="4"
        >
          <animate
            attributeName="stroke-opacity"
            values="1;0.3;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>

        {/* Battery Terminal */}
        <rect x="22" y="0" width="16" height="6" fill="#C62828" />

        {/* Battery Level */}
        <rect x="10" y="60" width="40" height="30" rx="4" fill="#FF5252">
          <animate
            attributeName="height"
            values="30;15;30"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            values="60;75;60"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
};

export const CommunicationFailed = ({
  mode = 'dark' // 'dark' or 'light'
}) => {
  // Color presets optimized for visibility
  const colors = {
    dark: {
      stroke: '#F0F0F0',  // Soft white
      fill: '#E0E0E0',    // Slightly dimmer white
      error: '#FF5A5A',   // Bright red
      barOpacity: 0.4,
      barHighlight: 1
    },
    light: {
      stroke: '#3A3D47',  // Dark gray-blue
      fill: '#4A4E5A',    // Slightly lighter than stroke
      error: '#FF3B30',   // Vivid red
      barOpacity: 0.5,
      barHighlight: 0.9
    }
  };

  const theme = colors[mode] || colors.dark;

  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <g transform="translate(10,10) scale(0.8)">
        {/* Phone outline */}
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" 
              stroke={theme.stroke} strokeWidth="3" />
        <rect x="100" y="20" width="8" height="20" fill="none" 
              stroke={theme.stroke} strokeWidth="3" />

        {/* Signal bars */}
        <g transform="translate(20,15)">
          <rect x="0" y="20" width="10" height="20" fill={theme.fill} opacity={theme.barOpacity}>
            <animate attributeName="opacity" 
                     values={`${theme.barOpacity};${theme.barHighlight};${theme.barOpacity}`} 
                     dur="1.5s" repeatCount="indefinite" />
          </rect>
          <rect x="15" y="15" width="10" height="25" fill={theme.fill} opacity={theme.barOpacity}>
            <animate attributeName="opacity" 
                     values={`${theme.barOpacity};${theme.barHighlight};${theme.barOpacity}`} 
                     dur="1.5s" begin="0.2s" repeatCount="indefinite" />
          </rect>
          <rect x="30" y="10" width="10" height="50" fill={theme.fill} opacity={theme.barOpacity}>
            <animate attributeName="opacity" 
                     values={`${theme.barOpacity};${theme.barHighlight};${theme.barOpacity}`} 
                     dur="1.5s" begin="0.4s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Error cross */}
        <path d="M35,10 L65,40 M65,10 L35,40" 
              stroke={theme.error} 
              strokeWidth="8"
              strokeLinecap="round">
          <animate attributeName="stroke-opacity" 
                   values="1;0.7;1" 
                   dur="1s" 
                   repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
};
export const HighVoltage = ({ mode = 'dark' }) => {
  const colors = {
    dark: {
      main: '#F57F17', // Bright orange
      gradientStart: '#F57F17',
      gradientEnd: 'transparent'
    },
    light: {
      main: '#E65100', // Darker orange
      gradientStart: '#E65100',
      gradientEnd: 'transparent'
    }
  };

  const theme = colors[mode] || colors.dark;

  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <defs>
        <radialGradient id="highVoltageGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={theme.gradientStart} stopOpacity="0.2" />
          <stop offset="100%" stopColor={theme.gradientEnd} stopOpacity="0" />
        </radialGradient>
      </defs>
      
      <g transform="translate(10,10) scale(0.8)">
        {/* Background Gradient */}
        <rect x="0" y="0" width="100" height="60" rx="8" fill="url(#highVoltageGradient)" />

        {/* Battery Outline */}
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke={theme.main} strokeWidth="3" />
        <rect x="100" y="20" width="8" height="20" fill="none" stroke={theme.main} strokeWidth="3" />

        {/* Lightning Bolt */}
        <path d="M45,10 L55,10 L50,25 L60,25 L40,50 L45,35 L35,35 Z" fill={theme.main}>
          <animate attributeName="transform" values="translate(0,0);translate(0,2);translate(0,0)" dur="0.2s" repeatCount="indefinite" />
        </path>
      </g>
    </svg>
  );
};


export const HighTemperature = ({ mode = "dark" }) => {
  // Define colors based on the mode (light/dark)
  const isDarkMode = mode === "dark";
  const colors = {
    outlineStroke: isDarkMode ? '#E53935' : '#D32F2F', // Darker red in light mode
    terminalStroke: isDarkMode ? '#E53935' : '#D32F2F',
    bulbFill: isDarkMode ? '#E53935' : '#F44336', // Brighter red in light mode
    bulbStroke: isDarkMode ? '#FF1744' : '#D32F2F',
    stemFill: isDarkMode ? '#333333' : '#E0E0E0', // Lighter background in light mode
    liquidFill: isDarkMode ? '#E53935' : '#F44336',
    markingsStroke: isDarkMode ? '#FF1744' : '#D32F2F',
    fireFill: isDarkMode ? '#FF5722' : '#FF7043', // Brighter orange in light mode
    glowStroke: isDarkMode ? '#FF1744' : '#F44336',
    bgFill: isDarkMode ? '#000000' : '#FFFFFF' // Black in dark, white in light
  };

  return (
    <svg 
      viewBox="0 0 100 60" 
      style={{ 
        width: "100%", 
        height: "auto",
        maxWidth: "3rem",
        minWidth: "2rem"
      }}
    >
      <g transform="translate(10,10) scale(0.8)">
        {/* Battery cell outline */}
        <rect
          x="0"
          y="0"
          width="100"
          height="60"
          rx="8"
          fill={colors.bgFill}
          stroke={colors.outlineStroke}
          strokeWidth="3"
        >
          <animate
            attributeName="stroke"
            values={`${colors.outlineStroke};#FF1744;${colors.outlineStroke}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
        
        {/* Battery terminal */}
        <rect
          x="100"
          y="20"
          width="8"
          height="20"
          fill={colors.bgFill}
          stroke={colors.terminalStroke}
          strokeWidth="3"
        >
          <animate
            attributeName="stroke"
            values={`${colors.terminalStroke};#FF1744;${colors.terminalStroke}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </rect>
        
        {/* Thermometer */}
        <g transform="translate(25, 10)">
          {/* Thermometer bulb */}
          <circle 
            cx="8" 
            cy="35" 
            r="8" 
            fill={colors.bulbFill}
            stroke={colors.bulbStroke}
            strokeWidth="2"
          >
            <animate
              attributeName="fill"
              values={`${colors.bulbFill};#FF1744;#FF5722;${colors.bulbFill}`}
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Thermometer stem background */}
          <rect 
            x="5" 
            y="7" 
            width="6" 
            height="28" 
            rx="3" 
            fill={colors.stemFill}
            stroke={colors.bulbStroke}
            strokeWidth="2"
          />
          
          {/* Thermometer liquid */}
          <rect 
            x="6.5" 
            y="10" 
            width="3" 
            height="25" 
            rx="1.5" 
            fill={colors.liquidFill}
          >
            <animate
              attributeName="height"
              values="20;28;20"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values="15;7;15"
              dur="1s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill"
              values={`${colors.liquidFill};#FF1744;#FF5722;${colors.liquidFill}`}
              dur="1.5s"
              repeatCount="indefinite"
            />
          </rect>
          
          {/* Thermometer markings */}
          <line x1="14" y1="12" x2="11" y2="12" stroke={colors.markingsStroke} strokeWidth="1.5" />
          <line x1="14" y1="20" x2="11" y2="20" stroke={colors.markingsStroke} strokeWidth="1.5" />
          <line x1="14" y1="28" x2="11" y2="28" stroke={colors.markingsStroke} strokeWidth="1.5" />
        </g>
        
        {/* Fire/flame symbol */}
        <g transform="translate(60, 10)">
          <text
            x="0"
            y="32"
            fontFamily="Arial, sans-serif"
            fontSize="28"
            fontWeight="bold"
            fill={colors.fireFill}
          >
            🔥
            <animate
              attributeName="font-size"
              values="26;32;26"
              dur="0.6s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="fill"
              values={`${colors.fireFill};#FF1744;#E53935;${colors.fireFill}`}
              dur="1.2s"
              repeatCount="indefinite"
            />
          </text>
          
          {/* Heat wave lines */}
          <g opacity="0.7">
            <path
              d="M -8 15 Q -5 12 -2 15 Q 1 18 4 15"
              stroke={colors.fireFill}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M -8 15 Q -5 12 -2 15 Q 1 18 4 15;M -8 15 Q -5 18 -2 15 Q 1 12 4 15;M -8 15 Q -5 12 -2 15 Q 1 18 4 15"
                dur="0.8s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M -8 8 Q -5 5 -2 8 Q 1 11 4 8"
              stroke={colors.fireFill}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values="M -8 8 Q -5 5 -2 8 Q 1 11 4 8;M -8 8 Q -5 11 -2 8 Q 1 5 4 8;M -8 8 Q -5 5 -2 8 Q 1 11 4 8"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
        
        {/* Pulsing danger glow effect */}
        <rect
          x="-2"
          y="-2"
          width="104"
          height="64"
          rx="10"
          fill="none"
          stroke={colors.glowStroke}
          strokeWidth="1"
          opacity="0.5"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.8;0.2"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  );
};

export default HighTemperature;

export const AboutToDie = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem", }}>
      <g transform="translate(10,10) scale(0.8)">
        <rect x="0" y="0" width="100" height="60" rx="8" fill="none" stroke="#C62828" strokeWidth="3">
          <animate attributeName="stroke-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </rect>
        <rect x="100" y="20" width="8" height="20" fill="none" stroke="#C62828" strokeWidth="3" />

        <rect x="5" y="5" width="15" height="50" rx="6" fill="#FF0000">
          <animate attributeName="fill-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </rect>

        <path d="M40,15 L50,35 L30,35 Z" fill="#C62828">
          <animate attributeName="fill-opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
        </path>
        <circle cx="40" cy="31" r="2" fill="#FFEBEE" />
      </g>
    </svg>
  );
};

export const OpenBattery = ({ mode = 'dark' }) => {
  const colors = {
    dark: {
      battery: '#FFD700', // Gold
      warning: '#FF0000', // Red
      text: '#FFF'       // White
    },
    light: {
      battery: '#f50202ff', // More muted gold
      warning: '#E53935', // Less intense red
      text: '#FFF'       // White (still works on warning triangle)
    }
  };

  const theme = colors[mode] || colors.dark;

  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <g transform="translate(10,10) scale(0.8)">
        {/* Battery outline */}
        <rect x="0" y="0" width="100" height="60" fill="none" stroke={theme.battery} strokeWidth="3" rx="5">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
        </rect>
        
        {/* Battery terminal */}
        <rect x="100" y="20" width="8" height="20" fill="none" stroke={theme.battery} strokeWidth="3" rx="2">
          <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
        </rect>

        {/* Battery cells */}
        <rect x="8" y="8" width="12" height="44" fill={theme.battery} opacity="0.3" />
        <rect x="24" y="8" width="12" height="44" fill={theme.battery} opacity="0.3" />
        <rect x="40" y="8" width="12" height="44" fill={theme.battery} opacity="0.3" />
        
        {/* Warning icon */}
        <g transform="translate(50,30)">
          <path d="M-20,15 L20,15 L0,-15 Z" fill={theme.warning} stroke={theme.warning} strokeWidth="4">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="1s" repeatCount="indefinite" />
          </path>
          <line x1="0" y1="6" x2="0" y2="-6" stroke={theme.text} strokeWidth="5" strokeLinecap="round" />
          <circle cx="0" cy="9" r="3" fill={theme.text} />
        </g>
      </g>
    </svg>
  );
};



export const ChargerTrip = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <rect x="10" y="10" width="80" height="40" rx="5" fill="#ECEFF1" stroke="#455A64" strokeWidth="3" />
      <path d="M30,30 L70,30" stroke="#455A64" strokeWidth="3" strokeLinecap="round">
        <animate
          attributeName="d"
          values="M30,30 L70,30;M30,30 L50,30 M60,30 L70,30;M30,30 L70,30"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

export const StringCurrent=()=>{
  return(
    <>
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
    <g transform="translate(650,50)">
    <rect x="0" y="15" width="100" height="30" rx="15" fill="#FAFAFA" stroke="#424242" stroke-width="3"/>
    <circle cx="20" cy="30" r="8" fill="#424242">
      <animate attributeName="cx" values="20;80;20" dur="2s" repeatCount="indefinite"/>
    </circle>
    <path d="M10,30 L90,30" stroke="#424242" stroke-width="2" stroke-dasharray="4 4"/>
  </g>
    </svg>
    
    </>
  )
}

export const ACVoltage = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem" }}>
      <circle cx="50" cy="30" r="30" fill="#E1F5FE" stroke="#0288D1" strokeWidth="3" />
      <path
        d="M20,30 Q35,10 50,30 Q65,50 80,30"
        stroke="#0288D1"
        strokeWidth="3"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M20,30 Q35,10 50,30 Q65,50 80,30;M20,30 Q35,50 50,30 Q65,10 80,30;M20,30 Q35,10 50,30 Q65,50 80,30"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};
export const DCVoltage = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem"}}>
      <circle cx="50" cy="30" r="30" fill="#FFF8E1" stroke="#FFA000" strokeWidth="3" />
      <path
        d="M35,30 L45,15 L55,45 L65,30"
        stroke="#FFA000"
        strokeWidth="3"
        fill="none"
      >
        <animate
          attributeName="d"
          values="M35,30 L45,15 L55,45 L65,30;M35,30 L45,45 L55,15 L65,30;M35,30 L45,15 L55,45 L65,30"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
     
    </svg>
  );
};

export const Buzzer = () => {
  return (
    <svg viewBox="0 0 100 60" style={{ width: "3rem",}}>
      <circle cx="50" cy="30" r="30" fill="#EFEBE9" stroke="#5D4037" strokeWidth="3" />
      <path d="M35,20 L45,20 L60,10 L60,50 L45,40 L35,40 Z" fill="#5D4037">
        <animate
          attributeName="transform"
          values="translate(0,0);translate(2,0);translate(0,0)"
          dur="0.2s"
          repeatCount="indefinite"
        />
      </path>
      <path
        d="M65,20 Q80,30 65,40"
        stroke="#5D4037"
        strokeWidth="2"
        fill="none"
      >
        <animate
          attributeName="stroke-opacity"
          values="1;0;1"
          dur="0.2s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};
export const FuseIcon = ({ size = 20, color = "#0D47A1", strokeWidth = 1.5 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      {/* Outer casing */}
      <rect x="4" y="8" width="16" height="8" rx="2" />
      
      {/* End terminals */}
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      
      {/* Inner fuse element */}
      <path d="M7 12h2" />
      <path d="M15 12h2" />
      <path d="M9 12C9 12 10 10 12 10S15 12 15 12" />
      
      {/* Rating marks */}
      <path d="M8 8v-1" />
      <path d="M16 8v-1" />
    </svg>
  );
};
export const ChargerLoadIcon = ({ color = "#1B5E20", fillColor, size = 3 }) => {
  // Derive fill color from main color if not provided
  const actualFillColor = fillColor || `${color}80`; // 80 adds 50% transparency
  // Derive light background color
  const lightColor = `${color}10`; // 10 adds 94% transparency

  return (
    <svg viewBox="0 0 100 60" style={{ width: `${size}rem` }}>
      {/* Battery indicator */}
      <rect 
        x="35" 
        y="20" 
        width="30" 
        height="20" 
        rx="2" 
        ry="2" 
        fill={lightColor} 
        stroke={color} 
        strokeWidth="2" 
      />
      
      {/* Battery tip */}
      <rect 
        x="65" 
        y="27" 
        width="4" 
        height="6" 
        rx="1" 
        ry="1" 
        fill={color} 
      />
      
      {/* Charging wave (animated) */}
      <path
        d="M30,30 L40,20 L50,40 L60,20 L70,30"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      >
        <animate
          attributeName="d"
          values="M30,30 L40,20 L50,40 L60,20 L70,30;M30,30 L40,40 L50,20 L60,40 L70,30;M30,30 L40,20 L50,40 L60,20 L70,30"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
      
      <rect 
        x="38" 
        y="23" 
        width="24" 
        height="14" 
        fill={actualFillColor}
      >
        <animate
          attributeName="width"
          values="0;24;24"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
};

export const StringCommunicationIcon = ({
  size = 40,
  color = "#1B5E20",
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* First Battery Cell (Top) */}
      <rect x="8" y="3" width="8" height="4" rx="0.5" />
      <line x1="12" y1="2" x2="12" y2="3" />
      <line x1="12" y1="7" x2="12" y2="8" />

      {/* Second Battery Cell (Middle) */}
      <rect x="8" y="10" width="8" height="4" rx="0.5" />
      <line x1="12" y1="9" x2="12" y2="10" />
      <line x1="12" y1="14" x2="12" y2="15" />

      {/* Third Battery Cell (Bottom) */}
      <rect x="8" y="17" width="8" height="4" rx="0.5" />
      <line x1="12" y1="16" x2="12" y2="17" />
      <line x1="12" y1="21" x2="12" y2="22" />

      {/* Communication Lines (Vertical) */}
      <path d="M12 7 v3">
        <animate
          attributeName="stroke-dasharray"
          values="0,6;6,0"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>

      <path d="M12 14 v3">
        <animate
          attributeName="stroke-dasharray"
          values="0,6;6,0"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>

      {/* Data Signal Indicators (Vertical) */}
      <circle cx="12" cy="8.5" r="0.4" fill={color}>
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>

      <circle cx="12" cy="15.5" r="0.4" fill={color}>
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="1.5s"
          begin="0.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export const GreenLight = ({ radius = 8, intensity = 1, pulseSpeed = 0.5 }) => {
  const lightStyle = {
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, #00ff00, #00cc00, #008800)`,
    boxShadow: `
      0 0 ${20 * intensity}px #00ff00,
      0 0 ${40 * intensity}px #00ff00,
      0 0 ${60 * intensity}px #00ff00,
      inset 0 0 ${10}px rgba(0,0,0,0.3)
    `,
    animation: `greenPulse ${pulseSpeed}s ease-in-out infinite`,
    display: 'inline-block',
    position: 'relative'
  };

  return (
    <>
      <style>
        {`
          @keyframes greenPulse {
            0%, 100% {
              box-shadow: 
                0 0 ${20 * intensity}px #00ff00,
                0 0 ${40 * intensity}px #00ff00,
                0 0 ${60 * intensity}px #00ff00,
                inset 0 0 10px rgba(0,0,0,0.3);
              transform: scale(1);
            }
            50% {
              box-shadow: 
                0 0 ${30 * intensity}px #00ff00,
                0 0 ${60 * intensity}px #00ff00,
                0 0 ${90 * intensity}px #00ff00,
                inset 0 0 15px rgba(0,0,0,0.3);
              transform: scale(1.05);
            }
          }
        `}
      </style>
      <div style={lightStyle}></div>
    </>
  );
};

// Red Light Component
export const RedLight = ({ radius = 8, intensity = 1, pulseSpeed = 0.5 }) => {
  const lightStyle = {
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: '50%',
    background: `radial-gradient(circle at 30% 30%, #ff0000, #cc0000, #880000)`,
    boxShadow: `
      0 0 ${20 * intensity}px #ff0000,
      0 0 ${40 * intensity}px #ff0000,
      0 0 ${60 * intensity}px #ff0000,
      inset 0 0 ${10}px rgba(0,0,0,0.3)
    `,
    animation: `redPulse ${pulseSpeed}s ease-in-out infinite`,
    display: 'inline-block',
    position: 'relative'
  };

  return (
    <>
      <style>
        {`
          @keyframes redPulse {
            0%, 100% {
              box-shadow: 
                0 0 ${20 * intensity}px #ff0000,
                0 0 ${40 * intensity}px #ff0000,
                0 0 ${60 * intensity}px #ff0000,
                inset 0 0 10px rgba(0,0,0,0.3);
              transform: scale(1);
            }
            50% {
              box-shadow: 
                0 0 ${30 * intensity}px #ff0000,
                0 0 ${60 * intensity}px #ff0000,
                0 0 ${90 * intensity}px #ff0000,
                inset 0 0 15px rgba(0,0,0,0.3);
              transform: scale(1.05);
            }
          }
        `}
      </style>
      <div style={lightStyle}></div>
    </>
  );
};

  export const CellThresholdValues = () => {
    const {
      Mdata = {} 
      }=useContext(AppContext)
  
    if (!Mdata) {
      return { // Default values to prevent crashes
        HighVoltage: 0,
        LowVoltage: 0,
        highTemperature: 0,
        BatteryAboutToDie: false,
        OpenBattery: false,
      };
    }
    const{
      highVoltage  ,
      lowVoltage  ,
      batteryAboutToDie  ,
      openBattery  ,
      highTemperature  ,
      lowTemperature  ,
      notCommnVoltage  ,
      notCommnTemperature  ,
      }=Mdata ||{}
  
    return {
      HighVoltage: highVoltage || 0,
      LowVoltage: lowVoltage || 0,
      highTemperature: highTemperature || 0,
      BatteryAboutToDie: batteryAboutToDie || false,
      OpenBattery: openBattery || false,
    };
  };
  
  export const CellLegends = {
    CommnFail :<CommunicationFailed/>,
    BatteryLowVoltage: <BatteryLowVoltage/>,
    BatteryAboutToDie: <AboutToDie/>,
    OpenBattery: <OpenBattery/>,
    BatteryHighVoltage:<HighVoltage/>,
    BatteryHighTemperature:<HighTemperature/>,
    LegendCharging: <Charging/>,
    LegendDisCharging: <Discharging/>,
  }


  