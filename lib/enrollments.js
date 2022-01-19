const fetchMyEnrollments = (djangoToken) =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/`, {
    // fetch("http://localhost:3000/backend/api/enrollments/", {
    headers: {
      Authorization: `Token ${djangoToken}`,
      'Content-Type': 'application/json',
    },
  })
    // return fetch("http://localhost:8000/api/enrollments/")
    .then((response, ...rest) => {
      // console.log("response");
      // console.log(response);
      // console.log("\n\nrest");
      // console.log(rest);
      const results = response.json();
      console.log(results);
      return results;
    })
    .catch((...rest) => {
      console.log('catch rest');
      console.log(rest);
    });

export default fetchMyEnrollments;
