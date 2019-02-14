//required npm packages
require("dotenv").config();
var inquirer = require('inquirer');
var keys = require("./keys.js");
var axios = require("axios");
var spotify = require('node-spotify-api');
var moment = require('moment');
var fs = require("fs");
//for spotify keys
spotify = new spotify(keys.spotify);
// console.log(keys.spotify);

menuStart();

function menuStart() {
    inquirer.prompt([

        // Here we give the user a list to choose from.
        {
            type: "list",
            message: "what do you want to do?",
            choices: ["Search Spotify", "Search Movie", "Search BandsInTown", "do-what-it-says", "exit"],
            name: "op",
        },

        // Here we ask the user to confirm.
        {
            type: "confirm",
            message: "Are you sure:",
            name: "confirm",
            default: false
        }
    ]).then(function (inquirerSearch) {
        if (inquirerSearch.confirm != false) {
            switch (inquirerSearch.op) {
                case "Search Spotify":
                    searchSpotify(null);

                    break;
                case "Search Movie":
                    searchMovie(null);

                    break;
                case "Search BandsInTown":
                    searchBandsInTown(null);

                    break;
                case "do-what-it-says":
                    readRandom();

                    break;
                case "exit":
                    console.log("Bye!");
                    return 0;


                default:
                    break;
            }
        } else {
            menuStart();
        }
    });

}



function searchSpotify(commands) {
    if (commands !== null) {
        var trackName = commands;
        spotify
            .search({
                type: 'track',
                query: trackName
            })
            .then(function (response) {
                console.log("artists name " + response.tracks.items[0].artists[0].name);
                console.log("album name " + response.tracks.items[0].album.name);
                console.log("song name " + response.tracks.items[0].name);
                console.log("spotify link " + response.tracks.items[0].external_urls.spotify);
                // response.tracks.items[0].artists[0].nam
                confirmContinue();
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        inquirer.prompt([{
            type: "input",
            message: "Enter a Song to Search",
            name: "Search",
        }]).then(function (inquirerSearch) {
            if (inquirerSearch.Search === '') {
                var trackName = "The Sign Ace of Base";
            } else {
                var trackName = inquirerSearch.Search;
            }
            spotify
                .search({
                    type: 'track',
                    query: trackName
                })
                .then(function (response) {
                    console.log("artists name " + response.tracks.items[0].artists[0].name);
                    console.log("album name " + response.tracks.items[0].album.name);
                    console.log("song name " + response.tracks.items[0].name);
                    console.log("spotify link " + response.tracks.items[0].external_urls.spotify);
                    // response.tracks.items[0].artists[0].nam
                    confirmContinue();
                })
                .catch(function (err) {
                    console.log(err);
                });

        });
    }
}



function searchMovie(commands) {
    if (commands !== null) {
        var moveName = commands;
        var queryUrl = "http://www.omdbapi.com/?t=" + moveName + "&y=&plot=short&apikey=trilogy";
        console.log(queryUrl);

        axios.get(queryUrl).then(function (response) {
            console.log("The movie Title: " + response.data.Title);
            console.log("The movie was released in: " + response.data.Year);
            console.log("The movie imdb Rating: " + response.data.imdbRating);
            console.log("The movie Sourced: " + response.data.Ratings[1].Value + " :Rotten Tomatoes:");
            console.log("The movie was released in: " + response.data.Country);
            console.log("The movie is in: " + response.data.Language);
            console.log("Movie Plot: \n" + response.data.Plot);
            console.log("Actors: \n" + response.data.Actors);
            confirmContinue();
        });
    } else {
        inquirer.prompt([{
            type: "input",
            message: "Enter a movie to Search",
            name: "Search",
        }]).then(function (inquirerSearch) {
            console.log(inquirerSearch.Search);
            if (inquirerSearch.Search === '') {
                var moveName = "Mr. Nobody";
                console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/ It's on Netflix!")
            } else {
                var moveName = inquirerSearch.Search;
            }
            var queryUrl = "http://www.omdbapi.com/?t=" + moveName + "&y=&plot=short&apikey=trilogy";
            console.log(queryUrl);

            axios.get(queryUrl).then(function (response) {
                console.log("The movie Title: " + response.data.Title);
                console.log("The movie was released in: " + response.data.Year);
                console.log("The movie imdb Rating: " + response.data.imdbRating);
                console.log("The movie Sourced: " + response.data.Ratings[1].Value + " :Rotten Tomatoes:");
                console.log("The movie was released in: " + response.data.Country);
                console.log("The movie is in: " + response.data.Language);
                console.log("Movie Plot: \n" + response.data.Plot);
                console.log("Actors: \n" + response.data.Actors);
                confirmContinue();
            });

        });
    }

}


function searchBandsInTown(commands) {
    if (commands !== null) {
        var queryURL = "https://rest.bandsintown.com/artists/" + commands + "/events?app_id=codingbootcamp";
        axios.get(queryURL).then(function (responseBand) {

            // Printing the entire object to console
            // console.log(responseBand);

            // Constructing HTML containing the artist information
            var VenueName = (responseBand.data[0].venue.name);
            var VenueLcation = (responseBand.data[0].venue.country + ', ' + responseBand.data[0].venue.city);
            var VenueDate = moment(responseBand.data[0].datetime).format("MM/DD/YYYY");

            console.log("\n\nVenue Name " + VenueName);

            console.log("Venue Date " + VenueDate);
            console.log("Venue Lcation " + VenueLcation);
            confirmContinue();
        });
    } else {
        inquirer.prompt([{
            type: "input",
            message: "Enter a band to Search",
            name: "Search",
        }]).then(function (inquirerSearch) {
            if (inquirerSearch.Search === '') {
                var bandName = "AJR";
            } else {
                var bandName = inquirerSearch.Search;
            }
            // Querying the bandsintown api for the selected artist, the ?app_id parameter is required, but can equal anything
            var queryURL = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
            axios.get(queryURL).then(function (responseBand) {

                // Printing the entire object to console
                // console.log(responseBand);

                // Constructing HTML containing the artist information
                var VenueName = (responseBand.data[0].venue.name);
                var VenueLcation = (responseBand.data[0].venue.country + ', ' + responseBand.data[0].venue.city);
                var VenueDate = moment(responseBand.data[0].datetime).format("MM/DD/YYYY");

                console.log("\n\nVenue Name " + VenueName);

                console.log("Venue Date " + VenueDate);
                console.log("Venue Lcation " + VenueLcation);
                confirmContinue();
            });

        });
    }

}

function confirmContinue() {

    inquirer.prompt([

        {
            type: "confirm",
            message: "Continue?:",
            name: "confirm",
            default: false
        }
    ]).then(function (confirmContinue) {
        if (confirmContinue.confirm != false) {
            menuStart();
        } else {
            return 0;
        }
    });

}

function readRandom() {



    fs.readFile("./random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }

        // Then split it by commas to read the commands
        var dataArr = data.split(",");
        console.log(dataArr);
        switch (dataArr[0]) {
            case "spotify-this-song":
                searchSpotify(dataArr[1]);

                break;
            case "movie-this":
                searchMovie(dataArr[1]);


                break;
            case "concert-this":
                searchBandsInTown(dataArr[1]);

            default:
                break;
        }




    });
}