const express = require("express");
const RoleRouter = require("./Routes/role.routes");
const TrustyRouter = require("./Routes/trusty.routes");
const cors = require("cors")
const app = express();
require("dotenv").config();

app.use(express.json())
app.use(cors())

app.use("/api", RoleRouter);
app.use("/api", TrustyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
