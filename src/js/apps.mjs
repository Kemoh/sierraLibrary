// Load apps
import { appslist } from "../data/apps.js";
import { loadItems } from "./utils.mjs";

export function loadAppsPage() {
    loadItems(appslist, "#sierralib-apps", "app");
}
loadAppsPage();