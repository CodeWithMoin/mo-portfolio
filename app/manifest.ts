import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Moinuddin Shaik · I build things",
    short_name: "Moinuddin Shaik",
    description: "AI systems, most recently at Amazon. Before that, video work for 200+ clients and a Student Nationals silver.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f3",
    theme_color: "#f4f4f3",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
