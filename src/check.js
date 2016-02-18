import request from "request";
import moment from "moment";
import cheerio from "cheerio";
import { check } from "./db";

let article = {};

const parseWithCheerio = (html) => {
  const $ = cheerio.load(html);

  $(".news-feed-item").each((i, x) => {
    const author = $(x).find(".author").text();

    if (author === "Zach Lowe") {
      const href = $(x).find(".realStory").attr("href");
      article['id'] = $(x).attr("data-id");
      article['url'] = `http://espn.com${href}`;
      article['title'] = $(x).find(".realStory").text().split(':')[1].trim();
      getDateAndDesc(article.url);
    }
  })
}

const getDateAndDesc = (story) => {
  request(story, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(body);

      const date = $('.article-meta .timestamp').first().attr('data-date');
      const formattedDate = moment(date).format('ddd, DD MMM YYYY HH:mm:ss ZZ');
      article['date'] = formattedDate;
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
