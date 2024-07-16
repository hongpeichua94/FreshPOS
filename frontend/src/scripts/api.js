import useFetch from "../hooks/useFetch";

const fetchData = useFetch();

export const getInventoryInfo = async (accessToken) => {
  try {
    const res = await fetchData(`/api/fruits`, "GET", undefined, accessToken);

    if (res.ok) {
      return res.data;
    } else {
      console.error(res.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getAccountInfo = async (userId, accessToken) => {
  try {
    const res = await fetchData(
      `/api/user/${userId}`,
      "GET",
      undefined,
      accessToken
    );

    if (res.ok) {
      return res.data[0];
    } else {
      console.error(res.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getCartDetail = async (userId, accessToken) => {
  try {
    const res = await fetchData(
      `/api/cart/items`,
      "POST",
      {
        user_id: userId,
      },
      undefined,
      accessToken
    );
    if (res.ok) {
      return res.data;
    } else {
      console.error(res.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getCartSummary = async (userId, accessToken) => {
  try {
    const res = await fetchData(
      `/api/cart`,
      "POST",
      {
        user_id: userId,
      },
      undefined,
      accessToken
    );
    if (res.ok) {
      return res.data;
    } else {
      console.error(res.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllOrders = async (accessToken) => {
  try {
    const res = await fetchData(`/api/order`, "GET", undefined, accessToken);
    if (res.ok) {
      return res.data;
    } else {
      console.error(res.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserOrders = async (userId, accessToken) => {
  try {
    const res = await fetchData(
      `/api/order`,
      "POST",
      {
        user_id: userId,
      },
      undefined,
      accessToken
    );
    if (res.ok) {
      return res.data;
    } else {
      console.error(res.data);
    }
  } catch (error) {
    console.log(error.message);
  }
};
