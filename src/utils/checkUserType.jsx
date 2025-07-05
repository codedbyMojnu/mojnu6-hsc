export default function checkUserType(token) {
  // A jwt token has 3 part header.payload.signature

  const base64 = token.split("."); // token convert to an array
  const payload = base64[1]; // taken 2nd part
  const payloadJson = atob(payload); // decode base 64 code to json string
  const data = JSON.parse(payloadJson); // Json convert to object
  console.log(data);
  return { 
    role: data?.role, 
    username: data?.username,
    userId: data?.userId || data?.id || data?._id 
  };
}
