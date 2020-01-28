const inquirer = require("inquirer");
const fs = require("fs");
const conversion = require("phantom-html-to-pdf")();
const axios = require("axios");
const pdf = require('html-pdf');
const util = require("util");

inquirer
function promptUser() {
  return inquirer.prompt([{
    type: "input",
    message: "Enter your GitHub username:",
    name: "username"
  }, 
  {
    type: "list",
    message: "What's your favorite color?",
    name: "faveColor",
    choices: ['red', 'pink', 'green', 'blue']
  }]);
}
const colors = {

  pink: {
    wrapperBackground: "pink",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "red",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  },
  green: {
    wrapperBackground: "green",
    headerBackground: "#C1C72C",
    headerColor: "black",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "blue",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  }
};
  
let readyToConvert = false;
promptUser()
  .then(function ({ username, faveColor }) {

    const queryUrl = `https://api.github.com/users/${username}`;
    axios
      .get(queryUrl).then(function (res) {
        console.log(res);
        data = {
          profilePic: res.data.avatar_url,
          name: res.data.name,
          location: res.data.location,
          profileUrl: res.data.html_url,
          bio: res.data.bio,
          blog: res.data.blog,
          company: res.data.company,
          repos: res.data.public_repos,
          followers: res.data.followers,
          following: res.data.following,
          color: faveColor,
        }
        console.log(data);

        const newQueryUrl = `https://api.github.com/users/${username}/repos`;
        console.log(newQueryUrl);

// Make a request for a user with a given ID

        axios.get(newQueryUrl).then(function (res) {
          let starCount = 0;
          for (let index = 0; index < res.data.length; index++) {
            let count = res.data[index].stargazers_count;
            starCount = starCount + count;
            console.log(res)

          }
          console.log("Final star count for all repositories: " + starCount)
          data.starCount = starCount;
          const html = generateHTML(data);

          console.log(`${username}.html is ready to convert to PDF`);
          readyToConvert = true;

          // for testing the HTML file that gets written to disk
          fs.writeFileSync(`${username}.html`, html);

          // https://www.npmjs.com/package/html-pdf
          var options = { format: 'landscape' };
          pdf.create(html, options).toFile(`${username}.pdf`, function (err, res) {
            if (err) return console.log(err);
            console.log(res);
          });

        });
      });
    
      })

  .catch(function (err) {
    console.log(err);

  })

function generatePdf(html) {
  let conversion = convertFactory({

    converterPath: convertFactory.converters.PDF

  });

  conversion({
    html: html,
    waitForJs: true,
    waitForJsVarName: readyToConvert,
  },
    function (err, result) {
      if (err) {
        return console.log(err);
      }

      result.stream.pipe(fs.createWriteStream(`${username}.pdf`));

      conversion.kill();

      console.log(`${username}.pdf is now available in your current directory`);
    });
}


// This will generate the html into a downloadable pdf

  function generateHTML(data) {
    return ` <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
      <title>Profile Generator</title>
      <style>
        @page {
          margin: 0;
        }
       *,
       *::after,
       *::before {
       box-sizing: border-box;
       }
       html, body {
       padding: 0;
       margin: 0;
       }
       html, body, .wrapper {
       height: 100%;
       }
       .wrapper {
       background-color: rgb(179, 172, 172);
       padding-top: 100px;
       }
       body {
       background-color: ;
       -webkit-print-color-adjust: exact !important;
       font-family: 'Cabin', sans-serif;
       }
       main {
       background-color: rgb(208, 246, 255);
       height: auto;
       padding-top: 30px;
       }
       h1, h2, h3, h4, h5, h6 {
       font-family: 'Vicente Lamónaca','Sans', serif;
       margin: 0;
       }
       h1 {
       font-size: 3em;
       }
       h2 {
       font-size: 2.5em;
       }
       h3 {
       font-size: 2em;
       }
       h4 {
       font-size: 1.5em;
       }
       h5 {
       font-size: 1.3em;
       }
       h6 {
       font-size: 1.2em;
       }
       .avi {
       position: center;
       margin: 0 auto;
       margin-bottom: -50px;
       display: flex;
       justify-content: center;
       flex-wrap: wrap;
       background-color: ${colors[data.color].headerBackground};
       color: black;
       padding: 10px;
       width: 95%;
       border-radius: 6px;
       }
       .avi img {
       width: 250px;
       height: 250px;
       border-radius: 50%;
       object-fit: cover;
       margin-top: -75px;
       border: 6px solid black;
       box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
       }
       .avi h1, .avi h2 {
       width: 100%;
       text-align: center;
       }
       .avi h1 {
       margin-top: 10px;
       }
       .links-nav {
       width: 100%;
       text-align: center;
       padding: 20px 0;
       font-size: 1.1em;
       }
       .nav-link {
       display: inline-block;
       margin: 5px 10px;
       }
       .workExp-date {
       font-style: italic;
       font-size: .7em;
       text-align: right;
       margin-top: 10px;
       }
       .container {
       padding: 50px;
       padding-left: 100px;
       padding-right: 100px;
       }
    
       .row {
         display: flex;
         flex-wrap: wrap;
         justify-content: space-between;
         margin-top: 20px;
         margin-bottom: 20px;
       }
    
       .card {
         padding: 20px;
         border-radius: 6px;
         background-color: ${colors[data.color].headerBackground};
         color: black;
         margin: 20px;
       }
       
       .col {
       flex: 1;
       text-align: center;
       }
    
       a, a:hover {
       text-decoration: none;
       color: inherit;
       font-weight: bold;
       }
    
       @media print { 
        body { 
          zoom: .75; 
        } 
       }
    </style>
    </head>
    
    <body>
      <!--website wrapper-->
       <div class="wrapper">
        <div class="avi">
      <!--User Profile Picture and heading-->
        <img src="${data.profilePic}" alt="Profile Picture" />
        <br>
        <h1>Hey!</h1>
        <br>
        <h2>
        My name is ${data.name}!</h1>
        <br>
        <h5>${data.bio}</h5>
        <br>
       <nav class="links-nav">
         <!--href links to location, repo site, and porfolio-->
        <a class="nav-link" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/${data.location}"><i class="fas fa-location-arrow"></i>${data.location}</a>
        <a class="nav-link" target="_blank" rel="noopener noreferrer" href="${data.profileUrl}"><i class="fab fa-github-alt"></i> GitHub</a>
        <a class="nav-link" target="_blank" rel="noopener noreferrer" href="${data.blog}"><i class="fas fa-rss"></i> Blog</a>
        </nav>
        
        </div>
    
    <!--All content cards will be in this main container-->
        <main>
        <div class="container">

        <div class="row">
        <div class="col">
        <div class="card">
         <h3>Public Repositories</h3>
        <h4>${data.repos}</h4>
        </div>
        </div>
        <div class="col">
        <div class="card">
         <h3>Followers</h3>
        <h4>${data.followers}</h4>
        </div>
        </div>
         </div>
        <div class="row">
        <div class="col">
        <div class="card">
         <h3>GitHub Stars</h3>
        <h4>${data.starCount}</h4>
         </div>
          </div>
        <div class="col">
         <div class="card">
          <h3>Following</h3>
           <h4>${data.following}</h4>
          </div>
        </div>
      </div>
    </div>
    </main>
    </div>
    </body>
    </html>`

      }
      
  

