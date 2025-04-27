async function getData(endpoint) {
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { rows, error } = await response.json();

  if (error) return console.error(error);

  return { rows };
}

async function postData(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const { rows, error } = await response.json();

  if (error) return console.error(error);

  return { rows };
}

async function putData(endpoint, payload) {
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const { rows, error } = await response.json();

  if (error) return console.error(error);

  return { rows };
}

export { getData, postData, putData };
