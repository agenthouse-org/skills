
## Plugin runtime and environment

This skill can be bundled in an agenthouse plugin for ChatGPT and Codex. Installing that plugin makes its instructions and included files available in a new chat or session; it does not install local runtimes, browsers, package dependencies, or system tools on web or mobile.

- On a local agent, use included helper scripts only after checking that their stated runtime and dependencies are available.
- In ChatGPT Chat or Work, use the workflow and produce the requested artifact with the tools available to that chat. Do not claim a helper script, browser check, render, or export ran unless it actually did.
- When an optional tool is unavailable, explain the limitation briefly and deliver the best supported result instead of treating the plugin installation as a runtime installation.
