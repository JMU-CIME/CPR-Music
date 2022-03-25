import { getSession } from "next-auth/react";

export function getEnrollments() {
  return getSession()
    .then((session) => {
      const token = session.djangoToken;
      return fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/enrollments/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }).then((response, ...rest) => {
        const results = response.json();
        return results;
      });
    })
}

export function a(){}
