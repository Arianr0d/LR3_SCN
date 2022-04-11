import { createWebHashHistory, createRouter } from "vue-router";
import methodRSA from "../views/methodRSA.vue";

const routes = [
  {
    path: "/",
    name: "methodRSA",
    component: methodRSA,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
