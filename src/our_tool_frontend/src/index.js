import {
  createActor,
  our_tool_backend,
} from "../../declarations/our_tool_backend";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent } from "@dfinity/agent";
let actor = our_tool_backend;
const whoAmIButton = document.getElementById("whoAmI");
whoAmIButton.onclick = async (e) => {
  e.preventDefault();
  whoAmIButton.setAttribute("disabled", true);
  const principal = await actor.whoami();
  whoAmIButton.removeAttribute("disabled");
  document.getElementById("principal").innerText = principal.toString();
  return false;
};
const loginButton = document.getElementById("login");
loginButton.onclick = async (e) => {
  e.preventDefault();
  let authClient = await AuthClient.create();
  // start the login process and wait for it to finish
  await new Promise((resolve) => {
    authClient.login({
      identityProvider:
        process.env.DFX_NETWORK === "ic"
          ? "https://identity.ic0.app"
          : `http://localhost:4943/?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai`,
      onSuccess: resolve,
    });
  });
  const identity = authClient.getIdentity();
  console.log("identity",identity)
  const agent = new HttpAgent({ identity });
  console.log("agent",agent)
  actor = createActor(process.env.CANISTER_ID_OUR_TOOL_BACKEND, {
    agent,
  });
  console.log("actor",actor)
  return false;
};
