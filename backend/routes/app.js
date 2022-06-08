const request = require("request");
const express = require("express");
const router = express.Router();
const {
  Voting,
  CheckMyVote,
  CountVoted,
  ListVoted,
} = require("../controller/app");

/**
 * @swagger
 * components:
 *  schemas:
 *      Voting:
 *          type: object
 *          required:
 *              - image_url
 *              - option
 *          properties:
 *              image_url:
 *                  type: string
 *                  description: QR code image of citizen identification
 *              option:
 *                  type: int
 *                  description: Number vote for
 *          example:
 *              image_url: "https://gateway.pinata.cloud/ipfs/QmUqZdf9gsusvN3G4bRR6z2iY7urJ1RUvaaKt3wKuoUAoS"
 *              option: 3
 *      Check-my-vote:
 *          type: object
 *          required:
 *              - image_url
 *          properties:
 *              image_url:
 *                  type: string
 *                  description: QR code image of citizen identification
 *          example:
 *              image_url: "https://gateway.pinata.cloud/ipfs/QmUqZdf9gsusvN3G4bRR6z2iY7urJ1RUvaaKt3wKuoUAoS"
 *      Count-voted:
 *          type: object
 *          required:
 *          properties:
 *          example:
 *              null
 *      List-voted:
 *          type: object
 *          required:
 *          properties:
 *          example:
 *              null
 */

/**
 * @swagger
 * tags:
 *  name: 2022 Presidential Election
 *  description: API
 */

/**
 * @swagger
 * /api/vote/voting:
 *  post:
 *      summary: Vote President
 *      tags: [2022 Presidential Election]
 *      requestBody:
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Voting'
 *            required: true
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Voting'
 */
router.post("/voting", Voting);

/**
 * @swagger
 * /api/vote/check-my-vote:
 *  get:
 *      summary: Check the vote
 *      tags: [2022 Presidential Election]
 *      parameters:
 *            - in: query
 *              name: image_url
 *              schema:
 *                type: string
 *              required: true
 *              description: url of your Id QR image
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Check-my-vote'
 */
router.get("/check-my-vote/", CheckMyVote);

/**
 * @swagger
 * /api/vote/count-voted:
 *  get:
 *      summary: List of voted amount
 *      tags: [2022 Presidential Election]
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Count-voted'
 */
router.get("/count-voted", CountVoted);

/**
 * @swagger
 * /api/vote/list-voted:
 *  get:
 *      summary: List of Vote
 *      tags: [2022 Presidential Election]
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/List-voted'
 *
 */
router.get("/list-voted", ListVoted);

module.exports = router;
