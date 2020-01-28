const inquirer = require("inquirer");
// const conversion = require("html5-to-pdf");
const fs = require("fs");
const conversion = require("phantom-html-to-pdf")();
// const path = require("path");
const axios = require("axios");
const pdf = require('html-pdf');

// const cardColor = localStorage.getItem("cardColor");
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
let readyToConvert = false;
promptUser()
  .then(function ({ username, faveColor }) {

    const queryUrl = `https://api.github.com/users/${username}`;
    axios
      .get(queryUrl).then(function (res) {
        console.log(res);
        info = {
          profilePic: res.data.avatar_url,
          name: res.data.login,
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
        console.log(info);

        const newQueryUrl = `https://api.github.com/users/${username}/repos`;
        console.log(newQueryUrl);

        axios.get(newQueryUrl).then(function (res) {
          let starCount = 0;
          for (let index = 0; index < res.data.length; index++) {
            let count = res.data[index].stargazers_count;
            starCount = starCount + count;

          }
          console.log("Final star count for all repositories: " + starCount)
          info.starCount = starCount;
          const html = generateHTML(info);

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

  // inquirer
  //The user will be prompted for a favortie color//
  
  //   .prompt([{
  // type: "list",
  // message: "What is your favorite color?",
  // name: "favcolor",
  // choices: ["blue", "Red", "green", "white"],
  // },
  
  // {
  // type: "question",
  // message: "What is your Github Username?",
  // name: "user",
  // }
  // ])
  // .catch(function (err) {
  //   console.log(err);

  // })
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
const colors = {
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
  },
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
  }
};
  

  // .then(user, favcolor  => {
  // request(user);
  
  
  // });

  


// Make a request for a user with a given ID
// axios.get(`https://api.github.com/users/`)
//   .then(function (response) {
    // handle success
  //   console.log(response);
  // })
  // .catch(function (error) {
    // handle error
  //   console.log(error);
  // })
  // .finally(function () {
    // always executed
  // });




// This will generate the html into a downloadable pdf

  function generateHTML(info) {
    return ` <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
      <title>Developer Profile Generator </title>
    
      <!-- Bootstrap -->
      <link href="css/bootstrap.min.css" rel="stylesheet">
      <link rel="stylesheet" href="css/font-awesome.css">
      <link rel="stylesheet" href="css/animate.css">
      <link href="css/style.css" rel="stylesheet">
    
      <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic' rel='stylesheet' type='text/css'>
      <link href='https://fonts.googleapis.com/css?family=Playball' rel='stylesheet' type='text/css'>
    </head>
    
    <body>
      <div class="wrapper" id="wrapper">
        <header>
          <div class="banner row" id="banner">
            <div class="menu">
              <div class="navbar-wrapper">
                <div class="container">
                  <div class="navwrapper">
                    <div class="navbar navbar-inverse navbar-static-top">
                      <div class="container">
                        <div class="navArea">
                          <div class="navbar-collapse collapse">
                            <ul class="nav navbar-nav">
                              <li class="menuItem active"><a href="#wrapper">Home</a></li>
                              <li class="menuItem"><a href="#aboutus">Portfolio</a></li>
                              <!-- <li class="menuItem"><a href="#specialties">Skills</a></li> -->
                              <!-- <li class="menuItem"><a href="#gallery">Portfolio</a></li> -->
                              <!-- <li class="menuItem"><a href="#feedback">Education</a></li> -->
                              <li class="menuItem"><a href="#contact">Contact</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
            <div class="parallax text-center" style="background-image: url(img/cover.jpg);">
              <div class="parallax-pattern-overlay">
                <div class="container text-center" style="height:800px;padding-top:300px;">
                  <a href="#"><img id="site-title" class=" wow fadeInDown" wow-data-delay="0.0s" wow-data-duration="0.9s" src="img/2.jpg" alt=""/></a>
                  <h2 class="intro"><a href="index.html">Donavan Kemet Brown</a></h2>
                </div>
              </div>
            </div>
          </div>
        </header>
    
        <!--about us-->
        <section class="aboutus" id="aboutus">
          <div class="container">
            <div class="heading text-center">
              <br></br>
              <br></br>
              <h2>Hi my Name is Donavan Brown
              </h2>
              <br>
              <br>
              <nav class="links-nav">
                <a class="nav-link" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/place/Philadelphia, PA"><i class="fas fa-location-arrow"></i> Philadelphia, PA</a>
                <a class="nav-link" target="_blank" rel="noopener noreferrer" href="https://github.com/dkb715"><i class="fab fa-github-alt"></i> GitHub</a>
                <a class="nav-link" target="_blank" rel="noopener noreferrer" href="https://dkb715.github.io/Homework-2/"><i class="fas fa-rss"></i> Blog</a>
             </nav>
    
              <br>
              <p>
                <!-- <ul> -->
                  <!-- <a href="https://github.com/dkb715"><i class="fa fa-github"></i></a> -->
                  <!-- <li><a href="#"><i class="fa fa-facebook"></i></a></li>
                  <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
                  <li><a href="#"><i class="fa fa-pinterest"></i></a></li>
                  <li><a href="#"><i class="fa fa-flickr"></i></a></li> -->
                <!-- </ul> -->
        
              </p>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="papers text-center">
                  <!-- <img src="" alt=""><br/> -->
                  <h4 class="">Public Repositories</h4>
                  <br>
    
                  <p>
                    11
                  </p>
                  <!-- <a href="#"><b>Download my resume</b></a> -->
                </div>
              </div>
              <div class="col-md-6">
                <div class="papers text-center">
                  <!-- <img src="" alt=""><br/> -->
                  <h4 class="">Followers</h4>
                  <br>
                  <p>
                    0
                  </p>
                  <!-- <a href="#"><b>Download my resume</b></a> -->
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="papers text-center">
                <!-- <img src="" alt=""><br/> -->
                <h4 class="">GitHub Stars</h4>
                <br>
    
                <p>
                  1
                </p>
                <!-- <a href="#"><b>Download my resume</b></a> -->
              </div>
            </div>
            <div class="col-md-6">
              <div class="papers text-center">
                <!-- <img src="" alt=""><br/> -->
                <h4 class="">Following</h4>
                <br>
    
                <p>
                  0
                </p>
                <!-- <a href="#"><b>Download my resume</b></a> -->
              </div>
            </div>
          </div>
          </div>
        </section>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
    
        <!--skills-->
        <!-- <section class="specialties" id="specialties">
          <div class="container">
            <div class="heading text-center"> -->
              <!-- <h2>Our Skills</h2>
              <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros. Etiam ullamcorper sed lectus sit amet mattis. Morbi justo sem, cursus nec convallis a, pellentesque eu mi. Morbi hendrerit ultricies ligula </h3> -->
            <!-- </div>
          </div> -->
    
          <!-- <div class="container">
            <div class="row">
              <div class="col-md-6 wow fadeInRight" data-wow-offset="0" data-wow-delay="0.3s" "> -->
              <!-- <div class="skill ">
                <div class="progress-wrap ">
                  <h3>Graphic Design</h3>
                  <div class="progress ">
                    <div class="progress-bar color1 " role="progressbar " aria-valuenow="40 " aria-valuemin="0 " aria-valuemax="100 " style="width: 85% ">
                    <span class="bar-width ">85%</span>
                    </div>
    
                  </div>
                </div>
    
                <div class="progress-wrap ">
                  <h3>HTML</h3>
                  <div class="progress ">
                    <div class="progress-bar color2 " role="progressbar " aria-valuenow="20 " aria-valuemin="0 " aria-valuemax="100 " style="width: 95% ">
                     <span class="bar-width ">95%</span>
                    </div>
                  </div>
                </div>
    
                <div class="progress-wrap ">
                  <h3>CSS</h3>
                  <div class="progress ">
                    <div class="progress-bar color3 " role="progressbar " aria-valuenow="60 " aria-valuemin="0 " aria-valuemax="100 " style="width: 80% ">
                    <span class="bar-width ">80%</span>
                    </div>
                  </div>
                </div>
    
                <div class="progress-wrap ">
                  <h3>Wordpress</h3>
                  <div class="progress ">
                    <div class="progress-bar color4 " role="progressbar " aria-valuenow="80 " aria-valuemin="0 " aria-valuemax="100 " style="width: 90% ">
                    <span class="bar-width ">90%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            <div class="col-md-6 wow fadeInRight " data-wow-offset="0 " data-wow-delay="0.6s "">
                <img src="img/team/6.jpg" class="img-responsive">
              </div> -->
            <!-- </div>
          </div> -->
    
          <!-- <div class="container">
            <div class="row">
              <div class="col-md-4">
                <div class="skills">
                  <h3 class="main text-center">WEB DESIGN</h3>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>HTML</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>CSS</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>JAVASCRIPT</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="skills">
                  <h3 class="main text-center">PHOTOGRAPHY</h3>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>adipiscing elit</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>adipiscing elit</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>adipiscing elit</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="skills">
                  <h3 class="main text-center">PROGRAMMING</h3>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>adipiscing elit</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>adipiscing elit</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                  <div class="restitem clearfix">
                    <div class="rm-thumb" style="background-image: url(img/2.png)">
                    </div>
                    <h5>adipiscing elit</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> -->
    
    
        <!--portfolio-->
    
    
        <!-- <section class="gallery" id="gallery">
          <div class="container">
            <div class="heading text-center">
              <h2>Portfolio</h2>
              <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi quis dolor sit amet lacus ultricies rutrum. Curabitur vitae fringilla elit. Sed at nunc congue, cursus erat ac, pellentesque eros. Etiam ullamcorper sed lectus sit amet mattis.</h3>
            </div>
    
            <div id="grid-gallery" class="grid-gallery">
              <section class="grid-wrap">
                <ul class="grid">
                  <li class="grid-sizer"></li> -->
    
                  <!-- for Masonry column width -->
    
                  <!-- <li>
                    <figure>
                      <img src="img/work/1.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/2.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/3.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
                  <li> -->
                    <!-- <figure>
                      <img src="img/work/4.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/5.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/6.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
    
                  <li>
                    <figure>
                      <img src="img/work/7.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
    
                  <li>
                    <figure>
                      <img src="img/work/8.jpg" alt="" />
                      <figcaption>
                        <h3>Vitae fringilla elit</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                      </figcaption>
                    </figure>
                  </li>
    
                </ul>
              </section> -->
              <!-- // end small images -->
    
              <!-- <section class="slideshow">
                <ul>
                  <li>
                    <figure>
                      <img src="img/work/1.jpg" alt="" />
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/2.jpg" alt="" />
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/3.jpg" alt="" />
                    </figure>
                  </li> -->
                  <!-- <li>
                    <figure>
                      <img src="img/work/4.jpg" alt="" />
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/5.jpg" alt="" />
                    </figure>
                  </li>
                  <li>
                    <figure>
                      <img src="img/work/6.jpg" alt="" />
                    </figure>
                  </li>
    
                  <li>
                    <figure>
                      <img src="img/work/7.jpg" alt="" />
                    </figure>
                  </li>
    
                  <li>
                    <figure>
                      <img src="img/work/8.jpg" alt="" />
                    </figure>
                  </li>
                </ul> -->
                <!-- <nav>
                  <span class="icon nav-prev"></span>
                  <span class="icon nav-next"></span>
                  <span class="icon nav-close"></span>
                </nav>
                <div class="info-keys icon">Navigate with arrow keys</div>
              </section> -->
              <!-- // end slideshow -->
            <!-- </div> -->
            <!-- // grid-gallery -->
          <!-- </div>
        </section> -->
    
        <!--education-->
        <!-- <section class="feedback" id="feedback">
          <div class="container">
            <div class="heading">
              <h2>Education</h2>
              <h3>Phasellus non dolor nibh. Nullam elementum tellus pretium feugiat.<br>
            Cras dictum tellus dui, vitae sollicitudin ipsum tincidunt in. Sed tincidunt tristique enim sed sollcitudin.</h3>
            </div>
          </div>
    
          <div class="container">
            <div class="col-md-4 wow fadeInRight" data-wow-offset="0" data-wow-delay="0.3s">
              <div class="text-center">
                <div class="hi-icon-wrap hi-icon-effect">
                  <h4>MASTER OF COMPUTER SCIENCE</h4>
                  <h5>FEB 2012 - DEC 2014</h5>
                  <i class="fa fa-laptop"></i>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
                </div>
              </div>
            </div>
    
            <div class="col-md-4 wow fadeInRight" data-wow-offset="0" data-wow-delay="0.6s">
              <div class="text-center">
                <div class="hi-icon-wrap hi-icon-effect">
                  <h4>MASTER OF COMPUTER SCIENCE</h4>
                  <h5>FEB 2012 - DEC 2014</h5>
                  <i class="fa fa-book"></i>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
                </div>
              </div>
            </div>
    
            <div class="col-md-4 wow fadeInRight" data-wow-offset="0" data-wow-delay="0.9s">
              <div class="text-center">
                <div class="hi-icon-wrap hi-icon-effect">
                  <h4>MASTER OF COMPUTER SCIENCE</h4>
                  <h5>FEB 2012 - DEC 2014</h5>
                  <i class="fa fa-gear"></i>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing</p>
                </div>
              </div>
            </div>
          </div>
    
          <div class="container">
            <div class="row">
              <blockquote>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages." <cite>Jogn De, Programming<br/><i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i></cite>            </blockquote>
              <blockquote>Have you ever felt worried that your party will not raise up to your guest expectations? In design, vertical rhythm is the structure that guides a reader’s eye through the content. Good vertical rhythm makes a layout more balanced and beautiful
                and its content more readable. The time signature in sheet music visually depicts a song’s rhythm, while for us, the lines of the baseline grid depict the rhythm of our content and give us guidelines. <cite>Marta Kay, Business Development<br/><i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i></cite>            </blockquote>
            </div>
          </div>
        </section> -->
    
        <!--education-->
        <section class="contact" id="contact">
          <div class="container">
            <div class="heading" id="contactposition">
              <h2>Contact</h2>
              <h3><br>
              </h3>
            </div>
          </div>
    
          <div class="container">
            <div class="row">
              <div class="col-md-7">
                <div class="map">
                  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22864.11283411948!2d-73.96468908098944!3d40.630720240038435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2sbg!4v1540447494452" width="100%" height="380" frameborder="0" style="border:0" allowfullscreen></iframe>
                </div>
              </div>
    
              <div class="contact-info">
                <div class="col-md-5">
                  <h4>My Contact Info</h4>
                  <h5></h5>
                  <p></p>
                  <ul>
                    <!-- <li><i class="fa fa-home fa-2x"></i> Home # 38, Suite 54 Elizebth Street</li> -->
                    <li><i class="fa fa-phone fa-2x"></i> +732-947-9396</li>
                    <li><i class="fa fa-envelope fa-2x"></i> donavankbrown@gmail.com</li>
                    <!-- <li><i class="fa fa-download fa-2x"></i> Download My Resume</li> -->
                  </ul>
                </div>
              </div>
            </div>
          </div>
    
          <div class="container">
            <div class="row">
              <div class="col-md-8 col-md-offset-2">
                <div id="sendmessage">Your message has been sent. Thank you!</div>
                <div id="errormessage"></div>
                <form action="" method="post" role="form" class="contactForm">
                  <div class="form-group">
                    <input type="text" name="name" class="form-control" id="name" placeholder="Your Name" data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                    <div class="validation"></div>
                  </div>
                  <div class="form-group">
                    <input type="email" class="form-control" name="email" id="email" placeholder="Your Email" data-rule="email" data-msg="Please enter a valid email" />
                    <div class="validation"></div>
                  </div>
                  <div class="form-group">
                    <input type="text" class="form-control" name="subject" id="subject" placeholder="Subject" data-rule="minlen:4" data-msg="Please enter at least 8 chars of subject" />
                    <div class="validation"></div>
                  </div>
                  <div class="form-group">
                    <textarea class="form-control" name="message" rows="5" data-rule="required" data-msg="Please write something for us" placeholder="Message"></textarea>
                    <div class="validation"></div>
                  </div>
    
                  <div class="text-center"><button type="submit" class="contact submit">Send Message</button></div>
                </form>
              </div>
            </div>
          </div>
        </section>
    
        <!--footer-->
        <section class="footer" id="footer">
          <p class="text-center">
            <a href="#wrapper" class="gototop"><i class="fa fa-angle-double-up fa-2x"></i></a>
          </p>
          <div class="container">
            <!-- <ul>
              <li><a href="#"><i class="fa fa-github"></i></a></li> -->
              <!-- <li><a href="#"><i class="fa fa-facebook"></i></a></li>
              <li><a href="#"><i class="fa fa-linkedin"></i></a></li>
              <li><a href="#"><i class="fa fa-pinterest"></i></a></li>
              <li><a href="#"><i class="fa fa-flickr"></i></a></li> -->
            <!-- </ul> -->
            <p>&copy; MyResume Theme. All Rights Reserved.</p>
            <div class="credits">
              <!--
                All the links in the footer should remain intact.
                You can delete the links only if you purchased the pro version.
                Licensing information: https://bootstrapmade.com/license/
                Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=MyResume
              -->
              Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
            </div>
          </div>
        </section>
    
      </div>
      <script src="js/jquery.js"></script>
      <script src="js/modernizr.js"></script>
      <!-- Include all compiled plugins (below), or include individual files as needed -->
      <script src="js/bootstrap.min.js"></script>
      <script src="js/menustick.js"></script>
      <script src="js/parallax.js"></script>
      <script src="js/easing.js"></script>
      <script src="js/wow.js"></script>
      <script src="js/smoothscroll.js"></script>
      <script src="js/masonry.js"></script>
      <script src="js/imgloaded.js"></script>
      <script src="js/classie.js"></script>
      <script src="js/colorfinder.js"></script>
      <script src="js/gridscroll.js"></script>
      <script src="js/contact.js"></script>
      <script src="js/common.js"></script>
      <script>
        wow = new WOW({}).init();
      </script>
      <script type="text/javascript">
        jQuery(function($) {
          $(document).ready(function() {
            //enabling stickUp on the '.navbar-wrapper' class
            $('.navbar-wrapper').stickUp({
              parts: {
                0: 'banner',
                1: 'aboutus',
                2: 'specialties',
                3: 'gallery',
                4: 'feedback',
                5: 'contact'
              },
              itemClass: 'menuItem',
              itemHover: 'active',
              topMargin: 'auto'
            });
          });
        });
      </script>
      <script src="contactform/contactform.js"></script>
    
    
    </body>
    
    </html> `;
}
  

