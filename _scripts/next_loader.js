
module.exports = function() {
    const callback = this.async();
    var axios = require("axios");

    const fileName = this.resourcePath.split("/").slice(-1)[0];
    const pageName = fileName.split(".")[0];

    axios.get(`http://localhost:3387/${pageName}`)
    .then((response) => {
      const htmlContent = response.data.match(/<body[^>]*>((.|[\n\r])*)<script id="__NEXT_DATA__"/);

      callback(null, htmlContent[1]);
    })
    .catch((err) => console.log(err));  
};
module.exports.raw = true;
