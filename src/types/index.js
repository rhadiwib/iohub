/**
 * @typedef {Object} INavLink
 * @property {string} imgURL
 * @property {string} route
 * @property {string} label
 */

/**
 * @typedef {Object} IUpdateUser
 * @property {string} userId
 * @property {string} name
 * @property {string} bio
 * @property {string} imageId
 * @property {string} imageUrl
 * @property {File[]} file
 */

/**
 * @typedef {Object} INewPost
 * @property {string} userId
 * @property {string} caption
 * @property {File[]} file
 * @property {string} [location]
 * @property {string} [tags]
 */

/**
 * @typedef {Object} IUpdatePost
 * @property {string} postId
 * @property {string} caption
 * @property {string} imageId
 * @property {string} imageUrl
 * @property {File[]} file
 * @property {string} [location]
 * @property {string} [tags]
 */

/**
 * @typedef {Object} IUser
 * @property {string} id
 * @property {string} name
 * @property {string} username
 * @property {string} email
 * @property {string} imageUrl
 * @property {string} bio
 */

/**
 * @typedef {Object} INewUser
 * @property {string} name
 * @property {string} email
 * @property {string} username
 * @property {string} password
 */