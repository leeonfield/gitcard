/**
 * GITHUB 为 Github Api 集合
 *
 * GITCARD 为 Node Server 集合
 */

const API = {

    GITCARD: {
        NEW_COMMENT: '/api/newcomment',
        GET_COMMENT: '/api/getcomment',
        DELETE_COMMENT: '/api/delcomment',
        GET_AUTH_UER: '/api/getauthuser'
    },
    GITHUB: {
        DOMAIN: 'https://api.github.com',
        GET_USER_INFO: 'https://api.github.com/users',
        GET_LOGIN_INFO: 'https://api.github.com/user',
        GET_EVENTS: 'https://api.github.com/events',
        // GET
        // Status: 204 No Content Y
        // Status: 204 No Content M
        CHECK_FOLLOW: '/user/following/:username',
        // PUT
        // Status: 204 No Content Y
        FOLLOW: 'https://api.github.com/user/following/',
        // DELETE
        // Status: 204 No Content Y
        UNFOLLOW: '/user/following/:username',
        CHECK_STAR: '/user/starred/:owner/:repo',
        STAR: '/user/starred/:owner/:repo',
        UNSTAR:'/user/starred/:owner/:repo'
    }
}

module.exports = API;
