const TwSizeIndicator = () => {
  if (process.env.NODE_ENV === "development") {
    return (
      <></>
    );
  } else {
    return null;
  }
};
export default TwSizeIndicator;
