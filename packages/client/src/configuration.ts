/** Environment */
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const IS_TESTING = process.env.NODE_ENV === "test";

/** CDN endpoint for imagery */
export const CDN_IMAGE_ENDPOINT = process.env.REACT_APP_STATIC_IMAGERY_ENDPOINT;

/** Path to the public directory */
export const PUBLIC_URL = process.env.PUBLIC_URL;
