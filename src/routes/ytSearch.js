const { default: axios } = require("axios");
const express = require("express");
const { JSDOM } = require("jsdom");

const router = express.Router();

const getKeySafe = (getFn) => {
  try {
    return getFn();
  } catch {
    return null;
  }
};
const fetchSearchResultsFromApi = async () => {
  setSearchProgress(10);
  // await setTimeout(() => {
  //   setSearchButtonIcon(search_icon);
  // }, 1000);

  const response = await fetch(
    `https://youtube-search-results.p.rapidapi.com/youtube-search/?q=${searchStrRef.current}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "youtube-search-results.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY,
      },
    }
  );
  if (!response.ok) {
    console.log("error fetching search results:");
    return;
  }
  const data = await response.json();
  console.log(JSON.stringify(data));
  const items = data.items.filter((item) => item.type === "video");
  setSearchResults(items);
};

const scrapeSearch = async (query) => {
  let ytInitialData = null;
  const { data } = await axios.get(
    encodeURI(`https://www.youtube.com/results?search_query=${query}`)
  );
  const doc = new JSDOM(data).window.document;
  const scripts = doc.querySelectorAll("script");

  let ytDataScript;
  if (scripts[33].textContent.includes("var ytInitialData")) {
    ytDataScript = scripts[33].textContent;
  } else {
    console.log("script moved from index 33, searching manually..");
    scripts.forEach((s) => {
      if (s.textContent.includes("var ytInitialData")) {
        ytDataScript = s.textContent;
        return;
      }
    });
  }
  try {
    ytInitialData = JSON.parse(
      ytDataScript.substring(20, ytDataScript.length - 1)
    );
  } catch {
    return null;
  }

  const { contents } = getKeySafe(
    () =>
      ytInitialData.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer
  );
  const results = contents
    .filter(
      (v) =>
        "videoRenderer" in v &&
        getKeySafe(
          () =>
            v.videoRenderer.ownerBadges[0].metadataBadgeRenderer.icon.iconType
        ) === "OFFICIAL_ARTIST_BADGE"
    )
    .map((v) => {
      const vid = v.videoRenderer;
      return {
        id: vid.videoId,
        title: vid.title.runs[0].text,
        artist: {
          title: vid.ownerText.runs[0].text,
          imgs: vid.channelThumbnailSupportedRenderers
            .channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
        },
        imgs: vid.thumbnail.thumbnails,
      };
    });
  return results;
};

router.get("/", async (req, res) => {
  const { q } = req.query;

  const results = await scrapeSearch(q);
  // const results = await youtube(q);
  res.send(results);
});

module.exports = router;
