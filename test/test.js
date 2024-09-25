import { expect } from "chai";
import request from "request";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://admin:sQbQ7UpBocNpW85I@cluster0.c1bcmhv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

const db = client.db('cafe_latte');
const fb_collection = db.collection('feedback');

describe("Feedback API", function () {

    const serverUrl = "http://localhost:3020";

    //test the root route
    it("should return the index.html file", function (done) {
        request(serverUrl, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(response.headers['content-type']).to.include('text/html');
            done();
        });
    });

    //successful feedback submission
    it("submits feedback successfully", function (done) {
        const feedbackData = {
            name: "Woop",
            email: "woop@xmen.com",
            review: "Amazing coffee and cafe!"
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

    //retrieving all feedback
    it("retrieves all feedback", function (done) {
        request(`${serverUrl}/feedback`, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            const feedbackList = JSON.parse(body);
            expect(feedbackList).to.be.an('array');
            done();
        });
    });

    //test for successful database read (retrieving feedback from MongoDB)
    it("reads feedback from the database", async function () {
        try {
            const feedbackList = await fb_collection.find({}).toArray();

            //feedbackList - an array with at least one entry
            expect(feedbackList).to.be.an('array');
            expect(feedbackList.length).to.be.greaterThan(0);

            const firstFeedback = feedbackList[0];
            expect(firstFeedback).to.have.property('name');
            expect(firstFeedback).to.have.property('email');
            expect(firstFeedback).to.have.property('review');
        } catch (error) {
            throw new Error('Database read operation failed!');
        }
    });


    //test for successful database write (inserting feedback into MongoDB)
    it("writes feedback to the database", async function () {
        const feedbackData = {
            name: "jerry",
            email: "jerry@xmen.com",
            review: "Nice cafe!"
        };

        try {
            const result = await fb_collection.insertOne(feedbackData);

            expect(result.insertedId).to.exist; //checks if the insert operation returned an ID
            const insertedDoc = await fb_collection.findOne({ _id: result.insertedId });
            expect(insertedDoc).to.have.property('name', 'jerry');
            expect(insertedDoc).to.have.property('email', 'jerry@xmen.com');
            expect(insertedDoc).to.have.property('review', 'Nice cafe!');
        } catch (error) {
            throw new Error('Database write operation failed!');
        }
    });

    it("prevents duplicate feedback submissions", function (done) {
        const feedbackData = {
            name: "Tin",
            email: "chippy@xmen.com",
            review: "Nice cup!"
        };

        // 1st submission
        request.post({
            url: `${serverUrl}/feedback`,
            json: feedbackData
        }, function (error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body).to.have.property('message', 'Thank you for your feedback!');

            // Attempt to submit again
            request.post({
                url: `${serverUrl}/feedback`,
                json: feedbackData
            }, function (error, response, body) {
                expect(response.statusCode).to.equal(400);
                expect(body).to.have.property('message', 'Duplicate feedback not allowed!');
                done();
            });
        });
    });



});