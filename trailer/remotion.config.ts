import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// Software GL works reliably in headless containers.
Config.setChromiumOpenGlRenderer("swangle");
Config.setConcurrency(4);
