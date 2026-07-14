import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moinuddin Shaik · Applied Scientist",
    short_name: "Moinuddin Shaik",
    description: "Applied Scientist and AI Systems Engineer building reliable AI systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#090a0a",
    theme_color: "#090a0a",
  };
}
