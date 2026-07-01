import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
// The trailer has an audio track, so render with an audio codec.
Config.setCodec("h264");
Config.overrideWebpackConfig((config) => config);
