import React from "react";
import StarRatings from "react-star-ratings";
import "./rate.css";

interface RateComponentProps {
  rate: number;
  editable: boolean;
  starColor?: string;
  emptyStarColor?: string;
  onRateChange?: (newRating: number) => void;
}

const RateComponent: React.FC<RateComponentProps> = ({
  rate,
  editable,
  starColor = "#ffbb00",
  emptyStarColor = "#DDDDDD",
  onRateChange,
}) => {
  const handleRatingChange = (newRating: number) => {
    if (onRateChange) onRateChange(newRating);
  };

  return (
    <div className="rate-component">
      <div className="flex flex-col items-center gap-2 ">
        <StarRatings
          rating={rate}
          starRatedColor={starColor}
          starEmptyColor={emptyStarColor}
          numberOfStars={5}
          name="rating"
          changeRating={handleRatingChange}
          isSelectable={editable}
          starDimension="24px"
          className="star-ratings"
        />
        {/* <span className="text-sm text-gray-600">
        {editable ? "Cliquez pour noter" : `${rate.toFixed(1)} / 5`}
      </span> */}
      </div>
    </div>
  );
};

export default RateComponent;
