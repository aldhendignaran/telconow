/**
 * Migration: create plan, homepageSetting, blogPost content types
 * Spec: .claude/brief/contentful-setup.md
 */

module.exports = function (migration) {

  // ─── plan ─────────────────────────────────────────────────────────────────

  const plan = migration.createContentType("plan", {
    name: "Plan",
    description: "TelcoNow pricing plan — Starter, Plus, or Pro.",
    displayField: "name",
  });

  plan.createField("name", { name: "Name", type: "Symbol", required: true });

  plan.createField("tier", { name: "Tier", type: "Symbol", required: true });
  plan.changeFieldControl("tier", "builtin", "dropdown");
  plan.editField("tier").validations([
    { in: ["starter", "plus", "pro"] },
  ]);

  plan.createField("monthlyPriceAUD", {
    name: "Monthly Price AUD (cents)",
    type: "Integer",
    required: true,
  });

  plan.createField("dataLimitGB", {
    name: "Data Limit GB (leave blank for unlimited)",
    type: "Integer",
    required: false,
  });

  plan.createField("features", {
    name: "Features",
    type: "Array",
    required: true,
    items: { type: "Symbol" },
  });

  plan.createField("highlighted", {
    name: "Featured plan (shows Most Popular badge)",
    type: "Boolean",
    required: true,
  });

  plan.createField("sortOrder", {
    name: "Sort Order (ascending)",
    type: "Integer",
    required: true,
  });

  // ─── homepageSetting ──────────────────────────────────────────────────────

  const homepageSetting = migration.createContentType("homepageSetting", {
    name: "Homepage Setting",
    description: "Single entry — controls homepage hero copy and CTAs.",
    displayField: "heroHeadline",
  });

  homepageSetting.createField("heroHeadline", {
    name: "Hero Headline",
    type: "Symbol",
    required: true,
  });

  homepageSetting.createField("heroSubcopy", {
    name: "Hero Subcopy",
    type: "Symbol",
    required: true,
  });

  homepageSetting.createField("heroCtaLabel", {
    name: "Hero CTA Label",
    type: "Symbol",
    required: true,
  });

  homepageSetting.createField("heroCtaUrl", {
    name: "Hero CTA URL",
    type: "Symbol",
    required: true,
  });

  homepageSetting.createField("featureBlocks", {
    name: "Feature Blocks",
    type: "RichText",
    required: false,
  });

  // ─── blogPost ─────────────────────────────────────────────────────────────

  const blogPost = migration.createContentType("blogPost", {
    name: "Blog Post",
    description: "Homepage blog section cards. No article page yet — Read More links are placeholders.",
    displayField: "title",
  });

  blogPost.createField("title", {
    name: "Title",
    type: "Symbol",
    required: true,
  });

  blogPost.createField("excerpt", {
    name: "Excerpt",
    type: "Symbol",
    required: true,
  });

  blogPost.createField("category", {
    name: "Category",
    type: "Symbol",
    required: true,
  });

  blogPost.createField("author", {
    name: "Author",
    type: "Symbol",
    required: true,
  });

  blogPost.createField("publishDate", {
    name: "Publish Date",
    type: "Date",
    required: true,
  });

  blogPost.createField("slug", {
    name: "Slug",
    type: "Symbol",
    required: true,
  });
  blogPost.editField("slug").validations([{ unique: true }]);
};
