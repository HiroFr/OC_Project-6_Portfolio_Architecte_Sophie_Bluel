const token = sessionStorage.getItem("token");

//API URL
const base_URL = "http://localhost:5678";
// POST Login
const loginUser = "/api/users/login";
// GET Category
const category = "/api/categories";
// GET / POST / DELETE Works
const works = "/api/works";

export { token, base_URL, category, works, loginUser }