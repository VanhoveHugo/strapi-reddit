/**
 * post router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::post.post", {
  config: {
    update: {
      policies: ["global::is-authenticated", "global::is-owner"],
    },
    delete: {
      policies: ["global::is-authenticated", "global::is-owner"],
    },
  },
});
