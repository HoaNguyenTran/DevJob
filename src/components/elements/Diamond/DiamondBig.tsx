import React from 'react'

interface IProps {
  value: number
}

const width = 130
const height = 130

const DiamondBig = (props: IProps): JSX.Element => {
  const { value } = props
  const heightValue = height * 0.9
  const percent = heightValue / 100

  return (
    <svg width={width} height={height}>
      <defs>
        <clipPath id="clip-path">
          <path
            clipRule="evenodd"
            fill="none"
            d="m6.001,26.45801l13,-20.794l92.932,0l13,20.794l-59.46,95.138l-59.472,-95.138z"
            data-name="Path 14453"
            id="Path_14453"
          />
        </clipPath>
      </defs>
      <g>
        <g id="Group_13362">
          <g id="Group_13927">
            <path
              opacity="0.5"
              fillRule="evenodd"
              fill="#d7bfff"
              d="m14.751,1.77401l-14.175,22.686a3.769,3.769 0 0 0 0,4l61.687,98.695a3.773,3.773 0 0 0 6.4,0l61.687,-98.695a3.768,3.768 0 0 0 0,-4l-14.175,-22.686a3.778,3.778 0 0 0 -3.2,-1.774l-95.024,0a3.778,3.778 0 0 0 -3.2,1.774z"
              id="Path_14452"
            />
          </g>
          <g id="Group_13363">
            <g clipPath="url(#clip-path)" id="Group_13362-2">
              <rect
                x="3.59101"
                y={percent * (100 - value)}
                fill="#8218d1"
                height={(heightValue * value) / 100}
                width={width}
                id="Rectangle_147940"
              />
            </g>
          </g>
          <path
            opacity="0.2"
            fillRule="evenodd"
            fill="#fff"
            d="m49.149,0.00101l-16.58,26.458l32.889,105.817l30.244,-105.817l-13.93,-26.457l-32.623,-0.001z"
            data-name="Path 14454"
            id="Path_14454"
          />
        </g>
      </g>
    </svg>
  )
}

export default DiamondBig
