import WorkItem from "@/components/WorkItem";

const WorkSection = () => {
  const projects = [
    {
      title: "videfly",
      description: "Frontend Development",
    },
    {
      title: "aetheria",
      description: "Fullstack Development",
    },
    {
      title: "artifax",
      description: "Design & Fullstack Development",
    },
  ];

  return (
    <div className="flex flex-col gap-y-8 text-xs md:text-base">
      <p className="uppercase px-4 md:px-12 xl:px-24">recent work//</p>
      <div className="w-full h-[1px] border-t border-white/25" />
      {projects.map((project, index) => (
        <div key={index}>
          <WorkItem title={project.title} description={project.description} />
          <div className="w-full h-[1px] border-t border-white/25 mt-8" />
        </div>
      ))}
    </div>
  );
};

export default WorkSection;
