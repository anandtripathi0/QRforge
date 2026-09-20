import {defineConfig} from "vitest/config";
import path from "node:path";import fs from "node:fs";
const cache=path.resolve("work/font-cache");fs.mkdirSync(cache,{recursive:true});const fontConfig=path.resolve("work/fonts.conf");fs.writeFileSync(fontConfig,'<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "urn:fontconfig:fonts.dtd"><fontconfig><dir>'+(process.platform==="win32"?"C:/Windows/Fonts":"/usr/share/fonts")+'</dir><cachedir>'+cache.replaceAll("\\","/")+'</cachedir></fontconfig>');process.env.FONTCONFIG_FILE=fontConfig;
export default defineConfig({resolve:{alias:{"@":path.resolve(".")}},test:{include:["tests/**/*.test.ts"],environment:"node",testTimeout:30000}});
