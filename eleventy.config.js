export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });
  eleventyConfig.addPassthroughCopy({ "src/images/2024/09/cropped-favicon.webp": "favicon.webp" });

  const byDateDesc = (a, b) => b.date - a.date;

  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/blog/*.md").sort(byDateDesc)
  );
  eleventyConfig.addCollection("podcast", (api) =>
    api.getFilteredByGlob("src/blog/*.md")
      .filter((p) => (p.data.categories || []).includes("Unequal Parts Podcast"))
      .sort(byDateDesc)
  );

  // Every tag and category with the posts that use it, for /tag/... and /category/... pages
  const groupBy = (api, key) => {
    const groups = new Map();
    for (const post of api.getFilteredByGlob("src/blog/*.md").sort(byDateDesc)) {
      for (const name of post.data[key] || []) {
        if (name === "post") continue;
        if (!groups.has(name)) groups.set(name, []);
        groups.get(name).push(post);
      }
    }
    return [...groups.entries()]
      .map(([name, posts]) => ({ name, posts }))
      .sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
  };
  eleventyConfig.addCollection("tagList", (api) => groupBy(api, "tags"));
  eleventyConfig.addCollection("categoryList", (api) => groupBy(api, "categories"));
  eleventyConfig.addCollection("archiveList", (api) => {
    const months = new Map();
    for (const post of api.getFilteredByGlob("src/blog/*.md").sort(byDateDesc)) {
      const d = post.date;
      const key = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
      if (!months.has(key)) months.set(key, { key, date: d, posts: [] });
      months.get(key).posts.push(post);
    }
    return [...months.values()];
  });

  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("monthYear", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("truncateWords", (s, n = 55) => {
    const words = String(s || "").split(/\s+/);
    return words.length > n ? words.slice(0, n).join(" ") + "…" : s;
  });
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path, base).toString());
  eleventyConfig.addFilter("isExternal", (url) => /^https?:\/\//.test(url || ""));
  eleventyConfig.addFilter("isActive", (url, pageUrl) =>
    url === "/" ? pageUrl === "/" : (pageUrl || "").startsWith(url)
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
