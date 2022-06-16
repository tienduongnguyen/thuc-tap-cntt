const express = require("express");
const router = express.Router();
const {
  Scan,
  Voting,
  CheckMyVote,
  CountVoted,
  ListVoted,
  TotalVoted,
} = require("../controller/user");

/**
 * @swagger
 * components:
 *  schemas:
 *      Scan:
 *        type: object
 *        required:
 *          - image_url
 *        properties:
 *          image_url:
 *            type: string
 *            description: QR code image of citizen identification
 *        example:
 *            image_url: "https://gateway.pinata.cloud/ipfs/QmUqZdf9gsusvN3G4bRR6z2iY7urJ1RUvaaKt3wKuoUAoS"
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
 *      Total-supply:
 *          type: object
 *          required:
 *          properties:
 *          example:
 *              null
 */

/**
 * @swagger
 * tags:
 *  name: Vote
 *  description: Users
 */

/**
 * @swagger
 * /api/vote/scan:
 *  get:
 *      summary: Scan QR code image
 *      tags: [Vote]
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
 *                              $ref: '#/components/schemas/Scan'
 *
 */
router.get("/scan", Scan);

/**
 * @swagger
 * /api/vote/voting:
 *  post:
 *      summary: Vote President
 *      tags: [Vote]
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
 *      tags: [Vote]
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
 *      tags: [Vote]
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
 *      summary: List of voted
 *      tags: [Vote]
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

/**
 * @swagger
 * /api/vote/total-voted:
 *  get:
 *      summary: Total of voted
 *      tags: [Vote]
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Total-supply'
 *
 */
router.get("/total-voted", TotalVoted);

module.exports = router;
