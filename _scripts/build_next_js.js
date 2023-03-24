var fs = require("fs");

function readFiles(dirname, onFileContent, onError) {

  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      console.log(err);
      return;
    }
    filenames.forEach(function(filename) {
      if (!filename.endsWith(".html")) {
        return;
      }

      fs.readFile(dirname + filename, "utf-8", function(err, content) {
        if (err) {
          console.log(err);
          return;
        }

        const htmlContent = content.match(/<body[^>]*>((.|[\n\r])*)<script id="__NEXT_DATA__"/);

        try {
          fs.writeFileSync("build/templates/" + filename, htmlContent[1]);
          // file written successfully
        } catch (err) {
          console.error(err);
        }
      });
    });
  });
}

readFiles("out/");
