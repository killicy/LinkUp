const Request = require("request");
const user = require('../routes/api/user.js');
var server = require("../server");
var baseURL = "https://localhost:5000/api/user/searchUsers";

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';



/*var options = {
    url: baseURL,
    strictSSL: false,
    rejectUnauthorized: false,
    requestCert: false,//add when working with https sites
    agent: false//add when working with https sites
}

*/


describe("addFriend test ", () => {
    it("returns status code 201", function(done) {
        Request.post({
            url:     baseURL,
            headers: {'content-type' : 'application/json'},
                       //'cookie' : ' '},
            body:    {"Username" : "ww3g"},
            json: true
        },   function(error, response, body) {
            if(error) done(error);
        console.log(body);
        expect(response.statusCode).toBe(200);
        done();
        });
    });
});
