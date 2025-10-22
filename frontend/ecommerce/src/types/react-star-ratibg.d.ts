declare module "react-star-rating" {
  import * as React from "react";

  export interface StarRatingProps {
    name?: string;
    value?: number; // nombre d’étoiles sélectionnées
    totalStars?: number; // total d’étoiles (par défaut 5)
    editing?: boolean; // true si l’utilisateur peut modifier
    onRatingClick?: (
      event: React.ChangeEvent<HTMLElement>,
      nextValue: number,
      prevValue: number,
      name: string
    ) => void;
  }

  const StarRating: React.FC<StarRatingProps>;

  export default StarRating;
}
