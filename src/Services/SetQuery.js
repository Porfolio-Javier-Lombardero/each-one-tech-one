export const SetQuery = (topic) => {
  switch (topic) {
    case "App's & Software":
      return "Software OR microsoft OR develop";
    case "Smartphones":
      return "iphone OR samsung galaxy OR xiaomi OR huawei OR smartphone";
    case "Gadgets":
      return "gadget OR gadgets OR gadget review";
    case "A.I.":
      return 'ai OR "A.I." OR Artificial Intelligence';
    case "Politics & Regulation":
      return "regulation OR law OR politics";
    case "rapshody":
      return "release OR review";
    case null:
      return 'smartphone OR AI OR space' ;
    default:
     return topic.trim().replaceAll(",", " OR ") ; 
  }
};
