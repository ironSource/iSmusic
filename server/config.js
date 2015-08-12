module.exports = {
    "server": {
        "protocol": "http",
        "host": "dummy.com:3000"
    },
    "facebook": {
        "key": "624236471052693",
        "secret": "787e2c46c4af19829b6e3137fba533c3",
        "callback": "/handle_facebook_callback",
        "scope": [
            "email",
            "user_likes",
            "public_profile",
            "user_friends",
            "user_actions.music"
        ]
    }
};