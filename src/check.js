import request from "request";
import cheerio from "cheerio";
import { check } from "./db";

let article = {};

const parseWithCheerio = (html) => {
  const $ = cheerio.load(html);

  $(".news-feed-item").each((i, x) => {
    const author = $(x).find(".author").text();

    if (author === "Zach Lowe") {
      article['id'] = $(x).attr("data-id");
      article['url'] = $(x).find(".realStory").attr("href");
      article['title'] = $(x).find(".realStory").text().split(':')[1].trim();
      getDateAndDesc(`http://espn.com${article.url}`);
    }
  })
}

const getDateAndDesc = (story) => {
  request(story, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body);

      article['date'] = $('.article-meta .timestamp').first().attr('data-date');
      article['description'] = $('meta[name=description]').attr('content');
      check(article);
    }
  });
}

request('http://espn.com', (error, response, body) => {
  if (!error && response.statusCode == 200) {
    parseWithCheerio(body)  
  }
})
