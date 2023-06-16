import axios from "axios";
import { URL, token } from "./config";

const axiosInstance = axios.create({
  baseURL: URL,
  withCredentials: true,
});
axiosInstance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Content-Type"] = "application/json";
  return config;
});
//users
export const fetchUsers = () => axiosInstance.get(`/users`);
export const deleteUser = (userID) =>
  axiosInstance.delete(`/users/deleteUser/${userID}`);
export const updateUser = (userID, roleID) =>
  axiosInstance.put(`/users/update/role`, { userID, roleID });
export const loginUser = (email, password) =>
  axios.post(
    `${URL}/users/login/`,
    { email, password },
    { withCredentials: true }
  );
export const loginGoogleUser = (email, fullName, avatar) =>
  axios.post(
    `${URL}/users/google/login/`,
    { email, fullName, avatar },
    { withCredentials: true }
  );
export const registerUser = (fullName, email, password, roleUser, department) =>
  axios.post(`${URL}/users/register/`, {
    fullName,
    email,
    password,
    roleUser,
    department,
  });
export const registerGoogleUser = (fullName, email, avatar, password) =>
  axios.post(`${URL}/users/google/register`, {
    fullName,
    email,
    avatar,
    password,
  });
export const getUserByID = (id) =>
  axiosInstance.post("/users/getUserByID", { userID: id });
export const getUserBySlug = (profile) =>
  axiosInstance.post("/users/getProfile", { slug: profile });
export const getAllUsers = () => axiosInstance.get(`/users`);
export const forgotPassword = (email) =>
  axios.post(`${URL}/users/forgot-password`, { email });
export const resetPassword = (token, newPassword) =>
  axios.post(`${URL}/users/reset-password`, { token, newPassword });
export const refresh = () =>
  axiosInstance.get(`${URL}/users/refresh`, { withCredentials: true });
export const logout = () => axiosInstance.post("/users/logout");

//edit profile
export const uploadAvatar = (id, data) =>
  axiosInstance.put("/users/update/avatar", {
    userID: id,
    data: data,
  });
export const addCommunication = (id, language, proficiency) =>
  axiosInstance.put("/users/update/communication", {
    userID: id,
    language: language,
    proficiency: proficiency,
  });
export const deleteCommunication = (userID, communicationID) =>
  axiosInstance.put("/users/delete/communication", {
    userID: userID,
    communicationID: communicationID,
  });
export const addBio = (userID, bio) =>
  axiosInstance.put("/users/update/bio", {
    userID: userID,
    bio: bio,
  });
export const addDisplayAs = (userID, displayName) =>
  axiosInstance.put("/users/update/displayName", {
    userID: userID,
    displayName: displayName,
  });
//chat
export const haveChattedBefore = (id) =>
  axiosInstance.post(`/chat/have-chatted-before`, { _id: id });
export const sendMessages = (id, currentChatUserID, inputMessage) =>
  axiosInstance.post(
    `/chat/sendMessage`,
    {
      from: id,
      to: currentChatUserID,
      message: inputMessage,
    },
    { headers: { "Content-Type": "application/json" } }
  );
export const getMessage = (id, currentChatUserID) =>
  axiosInstance.get(`/chat/get/msg/${id}/${currentChatUserID}`);
export const getLastMessage = (id, currentChatUserID) =>
  axiosInstance.get(`/chat/get/lastMsg/${id}/${currentChatUserID}`);

//roles
export const fetchRoles = () => axiosInstance.get("/roles");
export const createRole = (roleName) =>
  axiosInstance.post("/roles/create", { roleName });
export const deleteRole = (id) => axiosInstance.delete(`/roles/delete/${id}`);
export const updateRole = () => axiosInstance.put("/roles/update");
//platforms
export const fetchPlatforms = () => axiosInstance.get("/platforms/");
export const createPlatform = (name) =>
  axiosInstance.post("/platforms/create", { name });
export const deletePlatform = (id) =>
  axiosInstance.delete(`/platforms/delete/${id}`);
export const updatePlatform = () => axiosInstance.put("/platforms/update");

//categories
export const fetchCategories = () => axiosInstance.get("/categories");
export const createCategory = (name, img, categoryDesc) =>
  axiosInstance.post("/categories/create", { name, img, categoryDesc });
export const deleteCategory = (id) =>
  axiosInstance.delete(`/categories/delete/${id}`);
export const updateCategory = () => axiosInstance.put("/categories/update");
//sub-categories
export const createSubCategory = (categoryID, subCategory, title, img) =>
  axiosInstance.put("/categories/update/subCategory", {
    categoryID,
    subCategory,
    title,
    img,
  });
export const deleteSubCategory = (categoryID, subCategoryID) =>
  axiosInstance.put("/categories/delete/subCategory", {
    categoryID,
    subCategoryID,
  });
export const getSteam = () => axiosInstance.get("/steam/auth/steam/return");
export const getItemSteam = (userID, steamID) =>
  axiosInstance.put("/steam/item", { userID, steamID });
export const deleteSteamID = (steamID) =>
  axiosInstance.post("/steam/delete", { steamID });
export const updateSteamURL = (userID, steamURL) =>
  axiosInstance.put("/steam/update/steamURL", { userID, steamURL });
export const createListing = (
  userID,
  title,
  description,
  price,
  deliveryIn,
  deliveryMethod,
  category,
  subCategory,
  visibility,
  gameTitle,
  url
) =>
  axiosInstance.post("/products/create", {
    userID,
    title,
    description,
    price,
    deliveryIn,
    deliveryMethod,
    category,
    subCategory,
    visibility,
    gameTitle,
    url,
  });
export const getUserProducts = (slug) =>
  axiosInstance.post("/products/user", { slug });
export const getProductDetails = (_id) =>
  axiosInstance.post("/products/details", { _id });
export const createOrderPaypal = (cost) =>
  axiosInstance.post("/paypal/my-server/create-paypal-order", {
    cost,
  });
export const approvePaypal = (data) =>
  axiosInstance.post("/paypal/my-server/capture-paypal-order", {
    orderID: data?.orderID,
  });
export const payoutPaypal = (secretToken, userID, amount, email) =>
  axiosInstance.post("/paypal/my-server/payout", {
    secretToken,
    userID,
    amount,
    email,
  });
export const addFundUser = (userID, amount) =>
  axiosInstance.post("/users/addFund/", { userID, amount });
export const requestSecret = (userID) =>
  axiosInstance.post("/users/sendSecret", { userID });
