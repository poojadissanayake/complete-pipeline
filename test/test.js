import { expect } from "chai";
import request from "request";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://admin:sQbQ7UpBocNpW85I@cluster0.c1bcmhv.mongodb.net";
const client = new MongoClient(uri);

const db = client.db('cafe_latte');
const fb_collection = db.collection('feedback');
const serverUrl = "http://localhost:3020";

describe("Application Deployment Tests", function () {

    // Test for application health check
    it("should respond to health check", function (done) {
        request(`${serverUrl}/health`, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.include("OK");
            done();
        });
    });

    // Test for feedback API status code
    it("should submit feedback and return success message", function (done) {
        const feedbackData = {
            name: "Testuser7",
            email: "tester7@example.com",
            review: "Great service!"
        };

        request.post({
            url: `${serverUrl}/feedback`,
            json: feedbackData
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.have.property('message', 'Thank you for your feedback!');
            done();
        });
    });

});