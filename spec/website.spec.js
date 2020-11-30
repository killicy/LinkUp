const Request = require("request");
const user = require('../routes/api/user.js');
var server = require("../server");
var baseURL = "https://linkup.rocksthe.net";

var options = {
    url: baseURL,
    strictSSL: false,
    rejectUnauthorized: false,
    requestCert: false,//add when working with https sites
    agent: false//add when working with https sites
}


describe("Website connection test", () => {
    it("returns status code 200", function(done) {
        Request.get(options, function(error, response, body) {
            if(error) done(error);

        expect(response.statusCode).toBe(200);
        done();
        });
        
   
    });

});
