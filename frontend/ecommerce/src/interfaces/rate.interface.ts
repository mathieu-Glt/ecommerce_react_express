export interface RateComponentProps {
  rate: number;
  editable?: boolean;
  starColor?: string;
  emptyStarColor?: string;
  onRateChange?: (newRating: number) => void;
}
