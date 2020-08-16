export const handleError = (err: NodeJS.ErrnoException): string => {
  if (err.message.includes("Unknown option")) {
    return "Oops! You entered something that I don't know.";
  } else {
    return `${err.name}(${err.code || ""}): ${err.message} \n ${err.stack}`;
  }
};
