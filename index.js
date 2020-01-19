require("dotenv").config();


// accessing the npms we need for this app
var axios = require("axios");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var moment = require("moment");
var keys = require("./keys.js");
var spotifyKeys = require("./keys.js");
var spotify = new Spotify(spotifyKeys.spotify);


// variables for the arguments to be entered by the user in Liri
var appCommand = process.argv[2];

// use the slice method to account for user's search starting with index 3 position 

var userSearch = process.argv.slice(3).join(" `");


// using switch statement to execute the code to appCommand using user's input
function liriRun(appCommand, userSearch){
    switch(appCommand){
        case "spotify-this-song":
            getSpotify(userSearch);
            break;
        case "concert-this":
            getBandsInTown(userSearch);
            break;
        case "movie-this":
            getOMDB(userSearch);
            break;
        case "do-what-it-says":
            getRandom();
            break;
        // if appCommand is blank, prompt default message to user
        default:
            console.log("Please enter one of the following commands:'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'");
    }
}


// Spotify API search function
function getSpotify(songName){
    
    if (!songName){
        songName = "Over the Rainbow";
    }
    spotify.search({type: 'track', query: songName}, function(err, data){
        if (err) {
            return console.log('Error: ' + err);
        }
        console.log("\r\n");
        console.log("========== Searching for... ==========");
        console.log("\r\n");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name + "\r\n");
        console.log("Song: " + data.tracks.items[0].name + "\r\n");
        console.log("Song Preview Link: " + data.tracks.items[0].href + "\r\n");
        console.log("Album: "+ data.tracks.items[0].album.name + "\r\n");
        console.log("========== Search completed ==========");

// append text into log.txt
    var logSong = "=====Begin Spotify Log Entry=====" + "\nArtist: " + data.tracks.items[0].album.artists[0].name;
    fs.appendFile("log.txt", logSong, function(err){
        if(err) throw err;
    }); 
      logResults(data);
    });
}


// Bands API search function
function getBandsInTown(artist){
    
    var bandQueryURL = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";

    axios.get(bandQueryURL).then(
        function (response){
            console.log("\r\n");
            console.log("========== Searching for... ==========");
            console.log("\r\n");
            console.log("Venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
            console.log("Event Date: " + moment(response.data[0].venue.datetime).format("MM-DD-YYYY") + "\r\n");
            console.log("========== Search completed ==========");
        })
        .catch(function (error) {
            console.log(error);
        
            var logConcert = "========== Begin Concert Log Entry ==========" +"\nArtist: " + userSearch + "\nVenue: " + response.data[0].venue.name;

            fs.appendFile("log.txt", logConcert, function(err){
                if(err) throw err;
            });
            return response.json();
        });
}

// function to search OMDB API
function getOMDB(movie){
    if(!movie){
        movie = "Top Gun";
    }
    var movieQueryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.request(movieQueryURL).then(
        function(response){
            console.log("\r\n");
            console.log("========== Searching for... ==========");
            console.log("\r\n");
            console.log("Title: " + response.data.Title + "\r\n");
            console.log("Year released: " + response.data.Year + "\r\n");
            console.log("IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("Country produced: " + response.data.Country + "\r\n");
            console.log("Language: " + response.data.Language + "\r\n");
            console.log("Plot: " + response.data.Plot + "\r\n");
            console.log("Actors: " + response.data.Actors + "\r\n");
            console.log("========== Search completed ==========");

            var logMovie = "========== Begin Movie Log Entry ==========" +"/nMovie title: " + response.data.Title + "/nYear released: " + response.data.Year;

            fs.appendFile("log.txt", logMovie, function(err){
                if(err) throw err;
            });
        });
}

// function 
function getRandom(){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error);
        } else {
            console.log("\r\n");
            console.log("========== Searching for... ==========");
            console.log("\r\n");
            console.log(data);
            var randomData = data.split(" .");
            liriRun(randomData[0], randomData[1]);
            console.log("========== Search completed ==========");
        }
    });
}

function logResults(data){
    fs.appendFile("log.txt", data, function(err){
        if (err) throw err;
    });
}

liriRun(appCommand, userSearch);

// take in these commands:
// concert-this
// spotify-this-song
// movie-this
// do-what-it-says
