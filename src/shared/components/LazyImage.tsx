import { LazyLoadImage } from "react-lazy-load-image-component";
import type { LazyLoadImageProps } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

export const LazyImage = (props: LazyLoadImageProps) => (
  <LazyLoadImage effect="opacity" threshold={200} {...props} />
);
