const Request = require("request");
const user = require('../routes/api/user.js');
var server = require("../server");
var baseURL = "https://localhost:5000/api/user/login";

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';



/*var options = {
    url: baseURL,
    strictSSL: false,
    rejectUnauthorized: false,
    requestCert: false,//add when working with https sites
    agent: false//add when working with https sites
}

*/


describe("Login test ", () => {
    it("returns status code 200", function(done) {
        Request.post(baseURL, {json: true, body: {"Username" : "Test3","Password" : "Test"}}, function(error, response, body) {
            if(error) done(error);
        expect(response.statusCode).toBe(200);
        done();
        });
    });
});
