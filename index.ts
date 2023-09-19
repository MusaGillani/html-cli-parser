#!/usr/bin/env tsx
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as prettier from "prettier";
import * as path from "path";
import { NodeHtmlMarkdown, NodeHtmlMarkdownOptions } from "node-html-markdown";

const OUTDIR = "out";
const TEXTOUTPATH = path.join(OUTDIR, "output.txt");
const HTMLOUTPATH = path.join(OUTDIR, "output.html");
const MDOUTPATH = path.join(OUTDIR, "output.md");

const formatHtml = async (html: string) => {
  return await prettier.format(html, {
    parser: "html",
  });
};

async function main() {
  if (process.argv.length < 3) {
    console.error("please provide a filepath for input file");
    process.exit(1);
  }

  const filePath = process.argv[2];
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`The file "${absolutePath}" does not exist.`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(absolutePath, "utf-8");

  const $ = cheerio.load(buffer, null, false);

  const $selectedElements = $('[data-pre-plain-text*="9/14/2023"]');

  const allHtml: string[] = [];
  const allText: string[] = [];

  $selectedElements.each((i, el) => {
    const $element = $(el);
    const elementHtml = `${i + 1}\n ---- \n${$element.html()!} \n`;
    allHtml.push(elementHtml);

    // this is in the case of reply to a message
    if ($element.find("div:first-child").hasClass("_1hl2r")) {
      // Skip this element and find its sibling's second <span>
      const secondSpanContent =
        `\n---- \n${i + 1}\n` +
        $element
          .find("div:first-child")
          .next("div")
          .find("span:eq(1)")
          .text()
          .trim() +
        `\n`;
      allText.push(secondSpanContent);
    } else {
      const secondSpanContent =
        `\n---- \n${i + 1}\n` + $element.find("span:eq(1)").text().trim();
      `\n`;

      allText.push(secondSpanContent);
    }
  });

  console.info("Writing output");

  if (!fs.existsSync(OUTDIR)) {
    fs.mkdirSync(OUTDIR, { recursive: true });
  }
  const outputFormatted = await formatHtml(allHtml.join(""));
  const markdown = NodeHtmlMarkdown.translate(
    /* html */ outputFormatted,
    /* options (optional) */ {},
    /* customTranslators (optional) */ undefined,
    /* customCodeBlockTranslators (optional) */ undefined
  );
  fs.writeFile(HTMLOUTPATH, outputFormatted, (err) => {
    if (err) console.error("error writing to " + HTMLOUTPATH);
  });
  fs.writeFile(MDOUTPATH, markdown, (err) => {
    if (err) console.error("error writing to " + MDOUTPATH);
  });
  fs.writeFile(TEXTOUTPATH, allText.join(""), (err) => {
    if (err) console.error("error writing to " + TEXTOUTPATH);
  });

  console.info("Check " + MDOUTPATH + " for result");
  // console.log("all html", allHtml.join("\n----\n"));
  // console.log("formatted output", outputFormatted);
  // console.log("selected.lenght", $selected.length);
}

main();
