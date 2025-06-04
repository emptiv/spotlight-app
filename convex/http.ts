import { httpRouter } from "convex/server";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {

    // Log all incoming headers for debugging
    console.log("Incoming headers:");
    request.headers.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // Just get the raw body as text
    const body = await request.text();

    // Parse event directly without verification
    let evt: any;
    try {
      evt = JSON.parse(body);
    } catch (err) {
      console.error("Invalid JSON payload:", err);
      return new Response("Invalid JSON", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`;

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          clerkId: id,
        });
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
