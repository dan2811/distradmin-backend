"use strict";

module.exports = {
    routes: [
        {
            // Path defined with a URL parameter
            method: "GET",
            path: "/musicians/count",
            handler: "musician.count",
        },
    ],
};
