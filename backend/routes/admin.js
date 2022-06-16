const express = require("express");
const router = express.Router();
const {
  AddAuthorizedAccount,
  ChangeAuthorizedAccount,
  DeleteAuthorizedAccount,
  ListAuthorizedAccount,
  NameOfAddress,
  AddressOfName,
} = require("../controller/admin");

/**
 * @swagger
 * components:
 *  schemas:
 *      Add:
 *          type: object
 *          required:
 *              - address
 *              - name
 *          properties:
 *              address:
 *                  type: string
 *                  description: Address of authorized account
 *              name:
 *                  type: string
 *                  description: Name of authorized account
 *          example:
 *              address: "0x06309b3B3cf2d6fb5CD0bc0E47f8852f2a2b44e6"
 *              name: "administrator"
 *      Change:
 *          type: object
 *          required:
 *              - address
 *              - name
 *          properties:
 *              address:
 *                  type: string
 *                  description: Address of authorized account
 *              name:
 *                  type: string
 *                  description: Name of authorized account
 *          example:
 *              address: "0x06309b3B3cf2d6fb5CD0bc0E47f8852f2a2b44e6"
 *              name: "admin"
 *      Delete:
 *          type: object
 *          required:
 *              - address
 *          properties:
 *              address:
 *                  type: string
 *                  description: Address of authorized account
 *          example:
 *              address: "0x06309b3B3cf2d6fb5CD0bc0E47f8852f2a2b44e6"
 *      List:
 *          type: object
 *          required:
 *          properties:
 *          example:
 *              null
 *      Name:
 *          type: object
 *          required:
 *              - address
 *          properties:
 *              address:
 *                  type: string
 *                  description: Address of authorized account
 *          example:
 *              address: "0x06309b3B3cf2d6fb5CD0bc0E47f8852f2a2b44e6"
 *      Address:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  description: Name of authorized account
 *          example:
 *              name: "admin"
 */

/**
 * @swagger
 * tags:
 *  name: Government
 *  description: Admin
 */

/**
 * @swagger
 * /api/gov/name:
 *  get:
 *      summary: Name of authorized account
 *      tags: [Government]
 *      parameters:
 *            - in: query
 *              name: address
 *              schema:
 *                type: string
 *              required: true
 *              description: Address of authorized account
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Name'
 */
router.get("/name", NameOfAddress);

/**
 * @swagger
 * /api/gov/address:
 *  get:
 *      summary: Address of authorized account
 *      tags: [Government]
 *      parameters:
 *            - in: query
 *              name: name
 *              schema:
 *                type: string
 *              required: true
 *              description: Name of authorized account
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Address'
 */
router.get("/address", AddressOfName);

/**
 * @swagger
 * /api/gov/add:
 *  post:
 *      summary: Add authorized account
 *      tags: [Government]
 *      requestBody:
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Add'
 *            required: true
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Add'
 */
router.post("/add", AddAuthorizedAccount);

/**
 * @swagger
 * /api/gov/change:
 *  post:
 *      summary: Change authorized account
 *      tags: [Government]
 *      requestBody:
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Change'
 *            required: true
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Change'
 */
router.post("/change", ChangeAuthorizedAccount);

/**
 * @swagger
 * /api/gov/delete:
 *  post:
 *      summary: Delete authorized account
 *      tags: [Government]
 *      requestBody:
 *            content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Delete'
 *            required: true
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/Delete'
 */
router.post("/delete", DeleteAuthorizedAccount);

/**
 * @swagger
 * /api/gov/list:
 *  get:
 *      summary: List authorized account
 *      tags: [Government]
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          items:
 *                              $ref: '#/components/schemas/List'
 */
router.get("/list", ListAuthorizedAccount);

module.exports = router;
