
import { Random } from "random-js";

export const RandomNumb = () => {

    const random = new Random(); 
    const value = random.integer(1, 10000);
  return value
  
}
