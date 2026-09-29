import Image from "next/image";
import { projectGradient, type Project } from "@/lib/site";

export default function ProjectVisual({ project, priority = false, sizes }: { project: Project; priority?: boolean; sizes?: string }) {
  if (project.image) {
    return (
      <Image
        src={project.image}
        alt={project.title}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
        className="object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0" style={{ background: projectGradient(project) }}>
      <span className="absolute inset-0 flex items-center justify-center text-[18vw] font-semibold uppercase tracking-tighter text-white/10 md:text-[9vw]">
        {project.title.split(" ")[0]}
      </span>
    </div>
  );
}
