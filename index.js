//Defined variables
const inquirer = require("inquirer");
const fs = require("fs");
const pdf = require('html-pdf');
const axios = require("axios");

inquirer
//User prompt in the terminal
function promptUser() {
  return inquirer.prompt([{
    //specifies type of question
    type: "input",
    message: "Enter your GitHub username:",
    default: "dkb715",
    //object to call from on input to generate user specified github portfolio
    name: "username"
  }, 
  {
    type: "list",
    message: "What's your favorite color?",
    //object to call from when generating colors
    name: "favColor",
    choices: ['blue', 'pink', 'red', 'green']
  }]);
}
//setting the colors object as a string within an array to be able to then grab from on a user's favColor response
const colors = {
  
  blue: {
    colorName: "blue",
    backgroundColor: "#26175A",
  },
  pink: {
    colorName: "pink",
    backgroundColor: "#FF8374",
  },
  red: {
    colorName: "red",
    backgroundColor: "#870603",
  },
  green: {
    colorName: "green",
    backgroundColor: "#C1C72C",
  }
};
  
//this function passes through the promptUser function to grab the variables "username" and ...
// "favcolor" defined in the return.inquirer prompt


promptUser()
  .then(function ({ username, favColor }) {
//gives code the api link to pass through after grabbing the user response on the prompt
    const user = `https://api.github.com/users/${username}`;
    axios
    //this call will ge the user's response by passing through the defined variable/const which is the github link
    //the function will then replace username with the users response and run the api with the users repsonded username
      .get(user).then(function (res) {
        //this will console log the users responses
        console.log(res);
        //data is the defined object for pulling information from the users profile site and favColor reponse, doesnt get the stars in this function
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
          color: favColor,
        }
        console.log(data);
//second api call making a const to run through users repo API, this is how I start to count the stars on the users page
        const newUrl = `https://api.github.com/users/${username}/repos`;
        console.log(newUrl);

//actual pdf generator using the html const
function pdfGenerator(html) {
  let conversion = convertFactory({

    converterPath: convertFactory.converters.PDF

  });

  conversion({
    html: html,
    //waiting for confirmation before converting
    waitForJs: true,
    waitForJsVarName: readyToConvert,
  },
  //Using this function to run through the two parameters err and result. response on err or on results, on err console will log the err 
    function (err, result) {
      if (err) {
        return console.log(err);
      }
  
  result.return.download(fs.createWriteStream(`${username}.pdf`));
  //will stop running if theres an error
  conversion.kill();
  
  console.log(`${username}.pdf is ready to download!`);
});
}
// Make a request for a user with a given ID
//the axios function will fix the star count problem
axios.get(newUrl).then(function (res) {
  let starCount = 0;
  for (let index = 0; index < res.data.length; index++) {
    let count = res.data[index].stargazers_count;
    starCount = starCount + count;
    console.log(res)

  }
  //will add user data to starcount, which I set to 0, and that will give me the star count to post on the pdf
  console.log("Final star count for all repositories: " + starCount)
  data.starCount = starCount;
  const html = generateHTML(data);
  //message to user
  console.log(`${username}.html is ready to convert to PDF`);

  readyToConvert = true;

  // for testing the HTML file that gets written to disk, fs module is required to run
  fs.writeFileSync(`${username}.html`, html);

  // https://www.npmjs.com/package/html-pdf
  var options = { format: 'portrait' };
  pdf.create(html, options).toFile(`${username}.pdf`, function (err, res) {
    if (err) return console.log(err);
    console.log(res);
  });

});
});

})
//will respond an error if function doesnt run properly
.catch(function (err) {
console.log(err);

})


// This will generate the html template filled with the repsonded github user name and favorite color into a downloadable pdf

  function generateHTML(data) {
    return `       <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
      <title>Profile Generator</title>
      <style>
  
      .before {
      box-sizing: border-box;
      }

      .wrapper {
      background-color: rgb(179, 172, 172);
      padding-top: 75px;
      }
      body {
      font-family: 'Vicente Lamónaca', 'Sans', serif;
      background-color:  ${colors[data.color].backgroundColor};
      }
      main {
      height: auto;
      background-color: rgb(208, 246, 255);
      }
      .avi {
      position: center;
      margin: 0 auto;
      color: black;
      padding: 10px;
      background-color:  ${colors[data.color].backgroundColor};
      margin-bottom: -50px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      width: 97%;
      border-radius: 5px;
      }
      .avi img {
      width: 250px;
      height: 250px;
      border-radius: 50%;
      object-fit: cover;
      margin-top: -50px;
      border: 5px black;
      }
      .container {
      padding: 55px;
      padding-left: 50px;
      padding-right: 50px;
      }
      h1, h2, h3, h4, h5, h6 {
      font-family: 'Vicente Lamónaca','Sans', serif;
      margin: 0;
      }
      .avi h1 {
      margin-top: 10px;
      }
      .links {
      display: inline-block;
      margin: 5px;
      }
      .navLinks {
      width: 100%;
      text-align: center;
      font-size: 1.5em;
      padding: 0;
      }
      .row {
        display: flex;
        margin-top: 20px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }
      .col {
        text-align: center;
      }
      .cards {
        color: black;
        padding: 20px;
        background-color:  ${colors[data.color].backgroundColor};
        margin: 20px;
        /* gives cardss curvy edges */
        border-radius: 5px;
      }
      h1 {
      font-size: 3em;
      }
      h2 {
      font-size: 2.4em;
      }
      h3, h4{
      font-size: 2em;
      }
      h5, h6 {
      font-size: 1.5em;
      }
      .avi h1, .avi h2 {
      width: 100%;
      text-align: center;
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
       <nav class="navLinks">
         <!--href links to location, repo site, and porfolio-->
        <a class="links" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/${data.location}"><i class="fas fa-location-arrow"></i> Fishtown Philadelphia, PA</a>
        <a class="links" target="_blank" rel="noopener noreferrer" href="${data.profileUrl}"><i class="fab fa-github-alt"></i> GitHub</a>
        <a class="links" target="_blank" rel="noopener noreferrer" href="${data.blog}"><i class="fas fa-rss"></i> Blog</a>
        </nav>
        
        </div>
    
    <!--All content cards will be in this main container-->
        <main>
        <div class="container">
        <div class="row">
        <div class="col">
        <div class="cards">
         <h3>Public Repositories</h3>
        <h4>${data.repos}</h4>
        </div>
        </div>
        <div class="col">
        <div class="cards">
         <h3>Followers</h3>
        <h4>${data.followers}</h4>
        </div>
        </div>
         </div>
        <div class="row">
        <div class="col">
        <div class="cards">
         <h3>GitHub Stars</h3>
        <h4>${data.starCount}</h4>
         </div>
          </div>
        <div class="col">
         <div class="cards">
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
      
  
