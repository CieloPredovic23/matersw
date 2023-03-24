var axios = require("axios");

axios.get("http://localhost:3387/yml")
.then((response) => {
  const htmlContent = response.data.match(/<body[^>]*>((.|[\n\r])*)<script id="__NEXT_DATA__"/);

  console.log(htmlContent[1]);
})
.catch((err) => console.log(err));  
