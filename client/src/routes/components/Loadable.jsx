// src/components/Loadable.js
import React, { Suspense } from "react";
import Loader from "./Loader";

export default function Loadable(Component) {
  return function LoadableComponent(props) {
    return (
      // Fallback UI while loading the component (<Suspense> est un composant spécial fourni par React qui permet de gérer l’attente) 
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    );
  };
}
