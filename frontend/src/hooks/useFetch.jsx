const useFetch = () => {
  const fetchData = async (endpoint, method, body) => {
    const token = localStorage.getItem("accessToken");

    // Set up headers conditionally based on the body type
    const headers = {
      Authorization: "Bearer " + token,
    };

    // If the body is not formData, assume it's json and add the appropriate headers
    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(import.meta.env.VITE_SERVER + endpoint, {
      method,
      headers,
      body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
      // headers: {
      //   "Content-Type": "application/json",
      //   Authorization: "Bearer " + token,
      // },
      // body: JSON.stringify(body),
    });
    const data = await res.json();

    let returnValue = {};
    if (res.ok) {
      if (data.status === "error") {
        returnValue = { ok: false, data: data.message };
      } else {
        returnValue = { ok: true, data };
      }
    } else {
      if (data?.errors && Array.isArray(data.errors)) {
        const messages = data.errors.map((item) => item.msg);
        returnValue = { ok: false, data: messages };
      } else if (data?.status === "error") {
        returnValue = { ok: false, data: data.message || data.msg };
      } else {
        console.log(data);
        returnValue = { ok: false, data: "An error has occurred" };
      }
    }

    return returnValue;
  };

  return fetchData;
};

export default useFetch;
