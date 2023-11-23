export const formatTokenMetaData = (arr) => {
  const resultObject = {};
  arr.forEach((item) => {
    const key = item[0];
    const value = item[1][Object.keys(item[1])[0]]; // Extracting the value from the nested object
    resultObject[key] = value;
  });
  return resultObject;
};
