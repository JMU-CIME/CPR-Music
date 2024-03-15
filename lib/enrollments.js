const fetchMyEnrollments = (djangoToken) =>
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/`, {
    headers: {
      Authorization: `Token ${djangoToken}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response, ...rest) => {
      const results = response.json();
      return results;
    })
    .catch((...rest) => {
      console.error('catch rest');
      console.error(rest);
    });

export default fetchMyEnrollments;
